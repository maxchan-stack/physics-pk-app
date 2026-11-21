import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

interface PlayerScoreEntry {
  name: string;
  score: number;
  correctCount: number;
  currentIndex: number;
  finished: boolean;
  updatedAt: number;
}

type RoomQuizType = 'standard' | 'conceptual' | 'gsat';

interface RoomState {
  roomId: string;
  chapterId: string;
  difficulty: number;
  quizType: RoomQuizType;
  gsatFilter?: string | number;
  status: 'waiting' | 'playing';
  hostName: string;
  hostKey: string;
  guestName: string | null;
  scores: Record<string, PlayerScoreEntry>;
  createdAt: number;
  updatedAt: number;
}

function normalizeQuizType(raw: unknown): RoomQuizType {
  if (raw === 'conceptual' || raw === 'gsat') return raw;
  return 'standard';
}

interface NodeHttpRequest {
  method?: string;
  url?: string;
  on: (event: string, listener: (chunk: Uint8Array | string) => void) => void;
}

interface NodeHttpResponse {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (data?: string) => void;
}

/**
 * 讀取 HTTP 請求的 JSON 主體內容
 */
function readJsonBody<T = Record<string, unknown>>(req: NodeHttpRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: string[] = [];
    req.on('data', (chunk) => {
      chunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf-8'));
    });
    req.on('end', () => {
      try {
        const raw = chunks.join('').trim();
        resolve((raw ? JSON.parse(raw) : {}) as T);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

/**
 * 統一回傳 JSON 回應與標頭
 */
function sendJson(res: NodeHttpResponse, statusCode: number, data: unknown): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

/**
 * 清理超過 2 小時未活動的過期對戰房間，避免記憶體堆積
 */
function cleanupStaleRooms(rooms: Map<string, RoomState>, now: number): void {
  const twoHoursMs = 2 * 60 * 60 * 1000;
  for (const [id, room] of rooms.entries()) {
    if (now - room.updatedAt > twoHoursMs) {
      rooms.delete(id);
    }
  }
}

/**
 * 跨手機即時房間同步伺服器 Vite Middleware Plugin
 * 透過 /api/rooms/* 讓兩台連上同一網站（如 Cloudflare Tunnel）的手機即時同步房間章節設定與對戰比分
 */
function physicsRoomServerPlugin(): Plugin {
  const rooms = new Map<string, RoomState>();

  return {
    name: 'physics-room-server',
    configureServer(server) {
      server.middlewares.use('/api/rooms', async (req: NodeHttpRequest, res: NodeHttpResponse, next: () => void) => {
        const method = (req.method || 'GET').toUpperCase();
        const parsedUrl = new URL(req.url || '/', 'http://localhost');
        const pathname = parsedUrl.pathname;
        const now = Date.now();

        cleanupStaleRooms(rooms, now);

        try {
          if (method === 'POST' && pathname === '/create') {
            const body = await readJsonBody<{
              roomId?: string;
              hostName?: string;
              clientId?: string;
              chapterId?: string;
              difficulty?: number;
              quizType?: RoomQuizType;
              gsatFilter?: string | number;
            }>(req);

            const roomId = String(body.roomId || '').trim();
            if (!roomId) {
              return sendJson(res, 400, { ok: false, error: 'Missing roomId' });
            }

            const hostName = String(body.hostName || '玩家').trim() || '玩家';
            const hostKey = String(body.clientId || hostName);
            const room: RoomState = {
              roomId,
              chapterId: String(body.chapterId || 'g11-ch1'),
              difficulty: Number(body.difficulty || 1),
              quizType: normalizeQuizType(body.quizType),
              gsatFilter: body.gsatFilter !== undefined ? body.gsatFilter : 'all',
              status: 'waiting',
              hostName,
              hostKey,
              guestName: null,
              scores: {
                [hostKey]: {
                  name: hostName,
                  score: 0,
                  correctCount: 0,
                  currentIndex: 0,
                  finished: false,
                  updatedAt: now,
                },
              },
              createdAt: now,
              updatedAt: now,
            };
            rooms.set(roomId, room);
            return sendJson(res, 200, { ok: true, room });
          }

          if (method === 'POST' && pathname === '/join') {
            const body = await readJsonBody<{
              roomId?: string;
              guestName?: string;
              clientId?: string;
              chapterId?: string;
              difficulty?: number;
              quizType?: RoomQuizType;
              gsatFilter?: string | number;
            }>(req);

            const roomId = String(body.roomId || '').trim();
            if (!roomId) {
              return sendJson(res, 400, { ok: false, error: 'Missing roomId' });
            }

            const guestName = String(body.guestName || '好友').trim() || '好友';
            const guestKey = String(body.clientId || guestName);
            const existing = rooms.get(roomId);

            if (existing) {
              if (guestKey !== existing.hostKey) {
                existing.guestName = guestName;
              }
              existing.scores[guestKey] = {
                name: guestName,
                score: 0,
                correctCount: 0,
                currentIndex: 0,
                finished: false,
                updatedAt: now,
              };
              existing.updatedAt = now;
              return sendJson(res, 200, { ok: true, found: true, room: existing });
            }

            // 若好友先輸入雙方約定之 4 位房號而房間尚未存在，自動建立房間並加入
            const createdRoom: RoomState = {
              roomId,
              chapterId: String(body.chapterId || 'g11-ch1'),
              difficulty: Number(body.difficulty || 1),
              quizType: normalizeQuizType(body.quizType),
              gsatFilter: body.gsatFilter !== undefined ? body.gsatFilter : 'all',
              status: 'playing',
              hostName: guestName,
              hostKey: guestKey,
              guestName: null,
              scores: {
                [guestKey]: {
                  name: guestName,
                  score: 0,
                  correctCount: 0,
                  currentIndex: 0,
                  finished: false,
                  updatedAt: now,
                },
              },
              createdAt: now,
              updatedAt: now,
            };
            rooms.set(roomId, createdRoom);
            return sendJson(res, 200, { ok: true, found: false, room: createdRoom });
          }

          if (method === 'POST' && pathname === '/start') {
            const body = await readJsonBody<{ roomId?: string }>(req);
            const roomId = String(body.roomId || '').trim();
            const room = rooms.get(roomId);
            if (!room) {
              return sendJson(res, 404, { ok: false, error: 'Room not found' });
            }
            room.status = 'playing';
            room.updatedAt = now;
            return sendJson(res, 200, { ok: true, room });
          }

          if (method === 'GET' && pathname === '/status') {
            const roomId = String(parsedUrl.searchParams.get('roomId') || '').trim();
            const room = rooms.get(roomId);
            if (!room) {
              return sendJson(res, 404, { ok: false, error: 'Room not found' });
            }
            return sendJson(res, 200, { ok: true, room });
          }

          if (method === 'POST' && pathname === '/sync') {
            const body = await readJsonBody<{
              roomId?: string;
              playerName?: string;
              clientId?: string;
              score?: number;
              correctCount?: number;
              currentIndex?: number;
              finished?: boolean;
            }>(req);

            const roomId = String(body.roomId || '').trim();
            if (!roomId) {
              return sendJson(res, 400, { ok: false, error: 'Missing roomId' });
            }

            const playerName = String(body.playerName || '玩家').trim() || '玩家';
            const playerKey = String(body.clientId || playerName);

            let room = rooms.get(roomId);
            if (!room) {
              room = {
                roomId,
                chapterId: 'g11-ch1',
                difficulty: 1,
                quizType: 'standard',
                status: 'playing',
                hostName: playerName,
                hostKey: playerKey,
                guestName: null,
                scores: {},
                createdAt: now,
                updatedAt: now,
              };
              rooms.set(roomId, room);
            }

            room.scores[playerKey] = {
              name: playerName,
              score: Number(body.score || 0),
              correctCount: Number(body.correctCount || 0),
              currentIndex: Number(body.currentIndex || 0),
              finished: Boolean(body.finished),
              updatedAt: now,
            };
            room.updatedAt = now;

            // 找出房間內非本人的真人對手最新成績
            const opponentEntries = Object.entries(room.scores)
              .filter(([key]) => key !== playerKey)
              .map(([, val]) => val)
              .sort((a, b) => b.updatedAt - a.updatedAt);

            if (opponentEntries.length > 0) {
              const opponent = opponentEntries[0];
              return sendJson(res, 200, {
                ok: true,
                hasRealOpponent: true,
                opponentName: opponent.name,
                opponentScore: opponent.score,
                opponentCorrectCount: opponent.correctCount,
                opponentCurrentIndex: opponent.currentIndex,
                opponentFinished: opponent.finished,
                status: room.status,
              });
            }

            return sendJson(res, 200, {
              ok: true,
              hasRealOpponent: false,
              opponentName: null,
              opponentScore: 0,
              opponentCorrectCount: 0,
              status: room.status,
            });
          }

          return next();
        } catch (error) {
          return sendJson(res, 500, {
            ok: false,
            error: error instanceof Error ? error.message : 'Internal room server error',
          });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), physicsRoomServerPlugin()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
});
