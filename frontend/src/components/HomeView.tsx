import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import {
  CHAPTER_LIST,
  GRADE_CONFIG,
  GSAT_YEARS,
  GsatFilterMode,
  QUESTION_BANK,
  getGsatQuestions,
  getQuestionsByChapter,
} from '../data/curriculum-data';
import { getRoomClientId } from '../hooks/useQuizSession';
import {
  DifficultyLevel,
  GameMode,
  GradeLevel,
  PhysicsQuestion,
  QuizSummary,
} from '../types/physics-types';

type QuizTypeMode = 'standard' | 'conceptual' | 'gsat';

interface WaitingRoomState {
  roomId: string;
  hostName: string;
  chapterId: string;
  difficulty: DifficultyLevel;
  quizType: QuizTypeMode;
  gsatFilter: GsatFilterMode;
}

function normalizeQuizType(raw: unknown): QuizTypeMode {
  if (raw === 'conceptual' || raw === 'gsat') return raw;
  return 'standard';
}

function parseDifficulty(raw: unknown): DifficultyLevel {
  const num = Number(raw);
  if (num === 2) return 2;
  if (num === 3) return 3;
  return 1;
}

function parseGsatFilter(raw: unknown): GsatFilterMode {
  if (raw === 'chapter') return 'chapter';
  const num = Number(raw);
  if (GSAT_YEARS.includes(num as (typeof GSAT_YEARS)[number])) {
    return num as GsatFilterMode;
  }
  return 'all';
}

/**
 * 根據目前選擇的題目類型取得對應客製化題組
 */
function resolveCustomQuestions(
  targetType: QuizTypeMode,
  chapterId: string,
  gsatFilter: GsatFilterMode
): PhysicsQuestion[] | undefined {
  if (targetType === 'conceptual') {
    return getQuestionsByChapter(chapterId, true);
  }
  if (targetType === 'gsat') {
    return getGsatQuestions(gsatFilter, chapterId);
  }
  return undefined;
}

/** 組合題型與範圍說明文字，供等待室彈窗顯示 */
function formatScopeLabel(
  quizType: QuizTypeMode,
  gsatFilter: GsatFilterMode,
  chapterId: string
): string {
  const chTitle = CHAPTER_LIST.find((c) => c.id === chapterId)?.title ?? '';
  if (quizType === 'gsat') {
    if (typeof gsatFilter === 'number') return `🏆 ${gsatFilter}學測`;
    if (gsatFilter === 'chapter') return `🏆 ${chTitle}・本章學測`;
    return '🏆 學測近6年綜合';
  }
  if (quizType === 'conceptual') {
    return `💡 ${chTitle}・純觀念`;
  }
  return `🎯 ${chTitle}`;
}

/** 單一膠囊按鈕（模式 / 題型 / 難度共用） */
function Pill({
  active,
  onClick,
  children,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  sub?: string;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-2.5 px-2 rounded-xl text-[13px] font-bold border transition-all flex flex-col items-center justify-center leading-tight ${
        active
          ? 'bg-[#24554F] text-white border-[#24554F] shadow-sm'
          : 'bg-white text-neutral-700 border-[#D5E2E0] hover:bg-[#ECF2F2]'
      }`}
    >
      <span>{children}</span>
      {sub && <span className="text-[10px] font-medium opacity-80 mt-0.5">{sub}</span>}
    </button>
  );
}

interface HomeViewProps {
  /** 目前選取的年段 */
  selectedGrade: GradeLevel;
  /** 切換年段回呼 */
  onSelectGrade: (grade: GradeLevel) => void;
  /** 玩家暱稱 */
  playerNickname: string;
  /** 選取的章節 ID */
  selectedChapterId: string;
  /** 切換章節 ID */
  onSelectChapter: (chapterId: string) => void;
  /** 選取的難度 */
  selectedDifficulty: DifficultyLevel;
  /** 切換難度 */
  onSelectDifficulty: (diff: DifficultyLevel) => void;
  /** 透過 ?room=XXXX 邀請連結帶入之初始房號 */
  initialInviteRoomId?: string | null;
  /** 來自首頁外層的操作提醒（如對戰結束後重新建房提示） */
  lobbyNotice?: string | null;
  /** 關閉首頁提醒訊息 */
  onDismissLobbyNotice?: () => void;
  /** 啟動測驗 */
  onStartQuiz: (
    mode: GameMode,
    chapterId: string,
    difficulty: DifficultyLevel,
    customQuestions?: PhysicsQuestion[],
    roomId?: string,
    retryConfig?: QuizSummary['retryConfig']
  ) => void;
  /** 尚未輸入暱稱時，開啟頂部暱稱面板並在填寫完成後自動接續原操作 */
  onRequireNickname: (afterConfirm?: (confirmedNickname?: string) => void) => void;
}

/**
 * 首頁「快速開始測驗」單一面板
 * 流程：① 遊玩模式 → ② 題目類型 → ③ 範圍（支援 1~3 星難度） → 開始／好友等待室
 *
 * @param props HomeViewProps
 * @returns 首頁元件
 */
export function HomeView({
  selectedGrade,
  onSelectGrade,
  playerNickname,
  selectedChapterId,
  onSelectChapter,
  selectedDifficulty,
  onSelectDifficulty,
  initialInviteRoomId,
  lobbyNotice,
  onDismissLobbyNotice,
  onStartQuiz,
  onRequireNickname,
}: HomeViewProps): React.ReactElement {
  const [playMode, setPlayMode] = useState<GameMode>('bot_pk');
  const [quizType, setQuizType] = useState<QuizTypeMode>('standard');
  const [gsatFilter, setGsatFilter] = useState<GsatFilterMode>('all');

  const [roomInput, setRoomInput] = useState<string>('');
  const [roomAlert, setRoomAlert] = useState<string | null>(null);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [joinedGuestName, setJoinedGuestName] = useState<string | null>(null);
  const [waitingRoom, setWaitingRoom] = useState<WaitingRoomState | null>(null);
  const [isJoiningRoom, setIsJoiningRoom] = useState<boolean>(false);
  const [copiedAlert, setCopiedAlert] = useState<boolean>(false);
  const [copiedLinkAlert, setCopiedLinkAlert] = useState<boolean>(false);

  const gradeChapters = CHAPTER_LIST.filter((ch) => ch.grade === selectedGrade);
  const nickname = playerNickname.trim();

  // 範圍顯示規則：學測（非本章節）不需章節；只有標準段考題需要難度星級
  const showChapterPicker = quizType !== 'gsat' || gsatFilter === 'chapter';
  const showDifficulty = quizType === 'standard';

  // 若透過邀請連結 ?room=XXXX 開啟，自動切換到好友對戰並預填房號
  useEffect(() => {
    if (!initialInviteRoomId) return;
    setPlayMode('room_pk');
    setRoomInput(initialInviteRoomId);
    setRoomAlert(`已帶入好友邀請房號 #${initialInviteRoomId}，點擊「加入」即可進入等待室！`);
  }, [initialInviteRoomId]);

  // 房主等待室開啟時每秒輪詢房間狀態，偵測好友是否已加入
  useEffect(() => {
    if (!createdRoomId) {
      return;
    }
    const pollStatus = async () => {
      try {
        const res = await fetch(`/api/rooms/status?roomId=${encodeURIComponent(createdRoomId)}`);
        if (!res.ok) return;
        const data = (await res.json()) as { ok?: boolean; room?: { guestName?: string | null } };
        if (data.ok && data.room?.guestName) {
          setJoinedGuestName(data.room.guestName);
        }
      } catch {
        // 離線時略過輪詢
      }
    };
    void pollStatus();
    const timer = window.setInterval(pollStatus, 1000);
    return () => window.clearInterval(timer);
  }, [createdRoomId]);

  const launchWaitingRoomBattle = useCallback(
    (room: WaitingRoomState) => {
      const questions = resolveCustomQuestions(
        room.quizType,
        room.chapterId,
        room.gsatFilter
      );
      setWaitingRoom(null);
      onStartQuiz('room_pk', room.chapterId, room.difficulty, questions, room.roomId, {
        quizType: room.quizType,
        gsatFilter: room.quizType === 'gsat' ? room.gsatFilter : undefined,
      });
    },
    [onStartQuiz]
  );

  // 好友等待室每秒輪詢房主是否已按下「開始對戰」
  useEffect(() => {
    if (!waitingRoom) {
      return;
    }
    const pollRoomStart = async () => {
      try {
        const res = await fetch(
          `/api/rooms/status?roomId=${encodeURIComponent(waitingRoom.roomId)}`
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          ok?: boolean;
          room?: { status?: string; hostName?: string };
        };
        if (data.ok && data.room?.status === 'playing') {
          launchWaitingRoomBattle(waitingRoom);
        }
      } catch {
        // 離線時略過輪詢
      }
    };
    void pollRoomStart();
    const timer = window.setInterval(pollRoomStart, 1000);
    return () => window.clearInterval(timer);
  }, [waitingRoom, launchWaitingRoomBattle]);

  // 支援按 Esc 鍵關閉房主或好友等待室彈窗
  useEffect(() => {
    if (!createdRoomId && !waitingRoom) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCreatedRoomId(null);
        setWaitingRoom(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createdRoomId, waitingRoom]);

  // ref 確保等待室非同步啟動時不會讀到過期閉包
  const latestQuizSettingsRef = useRef({
    selectedChapterId,
    selectedDifficulty,
    quizType,
    gsatFilter,
  });
  latestQuizSettingsRef.current = {
    selectedChapterId,
    selectedDifficulty,
    quizType,
    gsatFilter,
  };

  const handleGradeSwitch = (grade: GradeLevel) => {
    onSelectGrade(grade);
    const firstChapter = CHAPTER_LIST.find((ch) => ch.grade === grade);
    if (firstChapter) {
      onSelectChapter(firstChapter.id);
    }
  };

  const handleStart = () => {
    const customQuestions = resolveCustomQuestions(quizType, selectedChapterId, gsatFilter);
    onStartQuiz(playMode, selectedChapterId, selectedDifficulty, customQuestions, undefined, {
      quizType,
      gsatFilter: quizType === 'gsat' ? gsatFilter : undefined,
    });
  };

  const executeCreateRoom = (confirmedName?: string) => {
    const activeName = (confirmedName ?? nickname).trim();
    if (!activeName) {
      onRequireNickname((name) => executeCreateRoom(name));
      return;
    }

    const { selectedChapterId: chId, selectedDifficulty: diff, quizType: qt, gsatFilter: gf } =
      latestQuizSettingsRef.current;

    const randomRoom = Math.floor(1000 + Math.random() * 9000).toString();
    setCreatedRoomId(randomRoom);
    setJoinedGuestName(null);
    setCopiedAlert(false);
    setCopiedLinkAlert(false);

    void fetch('/api/rooms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId: randomRoom,
        hostName: activeName,
        clientId: getRoomClientId(),
        chapterId: chId,
        difficulty: diff,
        quizType: qt,
        gsatFilter: gf,
      }),
    }).catch(() => {
      // 離線模式下仍保留房號種子組卷機能
    });
  };

  const handleCopyRoomId = (roomId: string) => {
    navigator.clipboard?.writeText(roomId);
    setCopiedAlert(true);
    window.setTimeout(() => setCopiedAlert(false), 2000);
  };

  const handleCopyInviteLink = (roomId: string) => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLinkAlert(true);
    window.setTimeout(() => setCopiedLinkAlert(false), 2200);
  };

  const handleStartHostBattle = () => {
    if (!createdRoomId) return;
    const targetRoom = createdRoomId;
    void fetch('/api/rooms/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: targetRoom }),
    }).catch(() => {});

    const questions = resolveCustomQuestions(quizType, selectedChapterId, gsatFilter);
    onStartQuiz('room_pk', selectedChapterId, selectedDifficulty, questions, targetRoom, {
      quizType,
      gsatFilter: quizType === 'gsat' ? gsatFilter : undefined,
    });
    setCreatedRoomId(null);
  };

  /**
   * 加入好友房間：自動同步房主的章節、難度、題型與學測範圍；若房主尚未開戰則進入等待室
   */
  const executeJoinRoom = async (confirmedName?: string) => {
    const cleanCode = roomInput.trim();
    if (!/^\d{4}$/.test(cleanCode)) {
      setRoomAlert('請輸入 4 位數房號（例如：8246）');
      window.setTimeout(() => setRoomAlert(null), 2800);
      return;
    }

    const activeName = (confirmedName ?? nickname).trim();
    if (!activeName) {
      onRequireNickname((name) => {
        void executeJoinRoom(name);
      });
      return;
    }

    const { selectedChapterId: chId, selectedDifficulty: diff, quizType: qt, gsatFilter: gf } =
      latestQuizSettingsRef.current;

    setIsJoiningRoom(true);
    try {
      const res = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: cleanCode,
          guestName: activeName,
          clientId: getRoomClientId(),
          chapterId: chId,
          difficulty: diff,
          quizType: qt,
          gsatFilter: gf,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          ok?: boolean;
          found?: boolean;
          room?: {
            chapterId?: string;
            difficulty?: number;
            quizType?: string;
            gsatFilter?: string | number;
            status?: 'waiting' | 'playing';
            hostName?: string;
          };
        };
        if (data.ok && data.room) {
          const syncedChapterId = data.room.chapterId || chId;
          const syncedDifficulty = parseDifficulty(data.room.difficulty);
          const syncedQuizType = normalizeQuizType(data.room.quizType);
          const syncedGsatFilter = parseGsatFilter(data.room.gsatFilter);

          const chapterMeta = CHAPTER_LIST.find((c) => c.id === syncedChapterId);
          if (chapterMeta) {
            onSelectGrade(chapterMeta.grade);
          }
          onSelectChapter(syncedChapterId);
          onSelectDifficulty(syncedDifficulty);
          setQuizType(syncedQuizType);
          setGsatFilter(syncedGsatFilter);

          // 房主尚未按下開始對戰時，先進入等待室同步起跑
          if (data.found === true && data.room.status === 'waiting') {
            setWaitingRoom({
              roomId: cleanCode,
              hostName: data.room.hostName || '房主',
              chapterId: syncedChapterId,
              difficulty: syncedDifficulty,
              quizType: syncedQuizType,
              gsatFilter: syncedGsatFilter,
            });
            return;
          }

          const syncedQuestions = resolveCustomQuestions(
            syncedQuizType,
            syncedChapterId,
            syncedGsatFilter
          );
          onStartQuiz(
            'room_pk',
            syncedChapterId,
            syncedDifficulty,
            syncedQuestions,
            cleanCode,
            {
              quizType: syncedQuizType,
              gsatFilter: syncedQuizType === 'gsat' ? syncedGsatFilter : undefined,
            }
          );
          return;
        }
      }
    } catch {
      // 網路錯誤時優雅降級：以本地設定啟動同種子房間
    } finally {
      setIsJoiningRoom(false);
    }

    const questions = resolveCustomQuestions(qt, chId, gf);
    onStartQuiz('room_pk', chId, diff, questions, cleanCode, {
      quizType: qt,
      gsatFilter: qt === 'gsat' ? gf : undefined,
    });
  };

  const startLabel =
    quizType === 'conceptual'
      ? '開始觀念速測（10 題）'
      : quizType === 'gsat'
      ? `開始學測實戰（${
          typeof gsatFilter === 'number'
            ? `${gsatFilter}學測`
            : gsatFilter === 'chapter'
            ? '本章節學測'
            : '近6年綜合'
        }）`
      : '開始段考練習（10 題）';

  return (
    <div className="pb-24 pt-4 px-4 max-w-[520px] mx-auto">
      <header className="mb-3 animate-pop">
        <div className="text-[11px] font-bold tracking-[0.15em] text-[#C58B59] uppercase mb-0.5">
          QUICK QUIZ
        </div>
        <h1 className="font-serif text-[26px] font-bold text-[#232323] leading-tight">
          選擇模式與範圍
        </h1>
        <p className="text-[13px] text-neutral-500 mt-0.5">
          全庫 {QUESTION_BANK.length} 題・每題 2 分鐘作答時間
        </p>
      </header>

      {lobbyNotice && (
        <div className="mb-3 p-3 rounded-xl bg-[#E3F3F0] border border-[#CBE2DF] text-xs text-[#1D4742] font-medium flex items-center justify-between gap-2 animate-pop">
          <span>{lobbyNotice}</span>
          {onDismissLobbyNotice && (
            <button
              type="button"
              onClick={onDismissLobbyNotice}
              aria-label="關閉提醒"
              className="p-1 text-[#24554F] hover:text-[#1D4742]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] bg-white p-4 shadow-sm space-y-4">
        {/* 步驟 1：遊玩模式 */}
        <section>
          <h2 className="text-[13px] font-bold text-[#24554F] mb-1.5">① 遊玩模式</h2>
          <div className="grid grid-cols-3 gap-1.5">
            <Pill active={playMode === 'bot_pk'} onClick={() => setPlayMode('bot_pk')}>
              🤖 挑戰電腦
            </Pill>
            <Pill active={playMode === 'solo_timer'} onClick={() => setPlayMode('solo_timer')}>
              ⏱️ 單人計時
            </Pill>
            <Pill active={playMode === 'room_pk'} onClick={() => setPlayMode('room_pk')}>
              🏠 好友對戰
            </Pill>
          </div>
        </section>

        {/* 步驟 2：題目類型（觀念／段考／學測） */}
        <section>
          <h2 className="text-[13px] font-bold text-[#24554F] mb-1.5">② 題目類型</h2>
          <div className="grid grid-cols-3 gap-1.5">
            <Pill active={quizType === 'conceptual'} onClick={() => setQuizType('conceptual')} sub="免計算">
              💡 觀念
            </Pill>
            <Pill active={quizType === 'standard'} onClick={() => setQuizType('standard')} sub="含計算">
              🎯 段考
            </Pill>
            <Pill active={quizType === 'gsat'} onClick={() => setQuizType('gsat')} sub="110~115">
              🏆 學測
            </Pill>
          </div>
        </section>

        {/* 步驟 3：範圍（依題型智慧顯示） */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-bold text-[#24554F]">③ 範圍</h2>

          {quizType === 'gsat' && (
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { key: 'all' as GsatFilterMode, label: '近6年綜合' },
                  { key: 'chapter' as GsatFilterMode, label: '依章節' },
                  ...GSAT_YEARS.map((y) => ({ key: y as GsatFilterMode, label: `${y}學測` })),
                ] as const
              ).map((item) => (
                <button
                  key={String(item.key)}
                  type="button"
                  onClick={() => setGsatFilter(item.key)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
                    gsatFilter === item.key
                      ? 'bg-[#24554F] text-white border-[#24554F]'
                      : 'bg-[#E3F3F0] text-[#1D4742] border-[#CBE2DF] hover:bg-[#d6ece8]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {showChapterPicker && (
            <>
              <div className="grid grid-cols-3 gap-1 bg-[#E7F0EF] p-1 rounded-xl border border-[#D5E2E0]">
                {(['grade10', 'grade11', 'grade12'] as GradeLevel[]).map((gradeKey) => (
                  <button
                    key={gradeKey}
                    type="button"
                    onClick={() => handleGradeSwitch(gradeKey)}
                    className={`py-1.5 rounded-lg text-[12.5px] font-bold transition-all ${
                      selectedGrade === gradeKey
                        ? 'bg-[#24554F] text-white shadow-sm'
                        : 'text-neutral-700 hover:bg-white/70'
                    }`}
                  >
                    {GRADE_CONFIG[gradeKey].shortLabel}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                {gradeChapters.map((ch) => {
                  const isSelected = ch.id === selectedChapterId;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => onSelectChapter(ch.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl bg-white transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-2 border-[#24554F] bg-[#F3F9F8]'
                          : 'border border-[#D5E2E0] hover:bg-[#ECF2F2]'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex-shrink-0 border-2 ${
                          isSelected ? 'bg-[#24554F] border-[#24554F]' : 'bg-white border-[#9FBDB9]'
                        }`}
                      />
                      <span
                        className={`text-[14.5px] ${
                          isSelected ? 'font-bold text-[#24554F]' : 'text-neutral-700'
                        }`}
                      >
                        {ch.code} {ch.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {showDifficulty && (
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { level: 1 as DifficultyLevel, label: '★ 基礎' },
                  { level: 2 as DifficultyLevel, label: '★★ 段考' },
                  { level: 3 as DifficultyLevel, label: '★★★ 挑戰' },
                ] as const
              ).map((item) => (
                <Pill
                  key={item.level}
                  active={selectedDifficulty === item.level}
                  onClick={() => onSelectDifficulty(item.level)}
                >
                  {item.label}
                </Pill>
              ))}
            </div>
          )}

          {quizType === 'gsat' && !showChapterPicker && (
            <p className="text-[12px] text-neutral-500">
              學測卷固定由歷屆真題組成，無需選章節與難度。
            </p>
          )}
        </section>

        {/* 開始區：好友對戰顯示建房 / 加入，其餘顯示開始鈕 */}
        {playMode === 'room_pk' ? (
          <section className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => executeCreateRoom()}
              className="w-full py-3.5 rounded-xl bg-[#24554F] hover:bg-[#1D4742] text-white font-bold text-[16px] shadow-sm transition-colors"
            >
              🏠 建立房間
            </button>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value.replace(/\D/g, ''))}
                placeholder="輸入好友的 4 位房號"
                className="w-full px-3.5 py-3 rounded-xl border border-[#D5E2E0] text-[15px] text-center tracking-widest text-[#232323] focus:outline-none focus:border-[#266461]"
              />
              <button
                type="button"
                disabled={isJoiningRoom}
                onClick={() => void executeJoinRoom()}
                className="px-5 py-3 rounded-xl border border-[#24554F] text-[#24554F] bg-white hover:bg-[#E3F3F0] disabled:opacity-60 font-bold text-[15px] transition-colors"
              >
                {isJoiningRoom ? '連線中…' : '加入'}
              </button>
            </div>
            {roomAlert && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-900 font-medium">
                {roomAlert}
              </div>
            )}
            <p className="text-[11.5px] text-neutral-500">
              好友加入後會自動同步你選的題型與範圍，等房主按下開始即同步開戰。
            </p>
          </section>
        ) : (
          <button
            type="button"
            onClick={handleStart}
            className="w-full py-4 rounded-xl bg-[#24554F] hover:bg-[#1D4742] active:scale-[0.99] text-white font-bold text-[17px] tracking-wide shadow-sm transition-all"
          >
            🚀 {startLabel}
          </button>
        )}
      </div>

      {/* 房主建立房間等待彈窗 */}
      {createdRoomId && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="房主等待室"
          onClick={(e) => {
            if (e.target === e.currentTarget) setCreatedRoomId(null);
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-pop"
        >
          <div className="bg-white rounded-2xl border-t-[3.5px] border-t-[#24554F] border border-[#D5E2E0] shadow-2xl max-w-[390px] w-full p-5 text-center">
            <div className="text-[12px] font-bold text-[#C58B59] tracking-[0.15em] uppercase mb-1">
              ROOM CREATED
            </div>
            <h3 className="font-serif text-[19px] font-bold text-[#232323] mb-3">
              請好友輸入這組房號
            </h3>

            <div className="bg-[#ECF2F2] border-2 border-dashed border-[#266461] rounded-xl py-3 px-4 mb-2.5 flex items-center justify-center gap-3">
              <span className="font-mono text-[36px] font-extrabold tracking-[0.25em] text-[#24554F] pl-2">
                {createdRoomId}
              </span>
              <button
                type="button"
                onClick={() => handleCopyRoomId(createdRoomId)}
                className="px-2.5 py-1 text-xs rounded-lg bg-white border border-[#266461]/40 text-[#24554F] font-bold hover:bg-[#24554F] hover:text-white transition-colors"
              >
                {copiedAlert ? '✓ 已複製' : '複製房號'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleCopyInviteLink(createdRoomId)}
              className="w-full mb-3 py-2 rounded-xl border border-[#CBE2DF] bg-[#F3F9F8] hover:bg-[#E3F3F0] text-[#1D4742] text-xs font-bold transition-colors"
            >
              {copiedLinkAlert ? '✓ 已複製邀請連結，傳給好友點擊即帶入房號！' : '🔗 複製邀請連結'}
            </button>

            <div className="text-xs text-neutral-600 mb-3 bg-[#F4F5F7] rounded-lg p-2.5 text-left space-y-1">
              <div>
                • 房主：<span className="font-bold text-[#232323]">{nickname}</span>
              </div>
              <div>
                • 範圍：
                <span className="font-bold text-[#232323]">
                  {formatScopeLabel(quizType, gsatFilter, selectedChapterId)}
                </span>
              </div>
            </div>

            {joinedGuestName ? (
              <div className="mb-3.5 p-2.5 rounded-lg bg-[#E3F3F0] border border-[#CBE2DF] text-[#1D4742] text-xs font-bold animate-pop">
                🎉 好友 {joinedGuestName} 已進入等待室！
              </div>
            ) : (
              <div className="mb-3.5 p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-800 text-xs">
                ⏳ 等待好友輸入房號或點連結加入…
              </div>
            )}

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleStartHostBattle}
                className="w-full py-3 rounded-xl bg-[#24554F] hover:bg-[#1D4742] text-white font-bold text-[16px] shadow-sm transition-colors"
              >
                開始對戰
              </button>
              <button
                type="button"
                onClick={() => setCreatedRoomId(null)}
                className="w-full py-2.5 rounded-xl border border-[#D5E2E0] bg-white hover:bg-[#ECF2F2] text-neutral-600 font-medium text-[14px] transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 好友加入等待室彈窗（防止在房主按下開始前提前起跑） */}
      {waitingRoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="好友等待室"
          onClick={(e) => {
            if (e.target === e.currentTarget) setWaitingRoom(null);
          }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-pop"
        >
          <div className="bg-white rounded-2xl border-t-[3.5px] border-t-[#24554F] border border-[#D5E2E0] shadow-2xl max-w-[390px] w-full p-5 text-center">
            <div className="text-[12px] font-bold text-[#C58B59] tracking-[0.15em] uppercase mb-1">
              WAITING ROOM #{waitingRoom.roomId}
            </div>
            <h3 className="font-serif text-[19px] font-bold text-[#232323] mb-3">
              已同步房間設定，準備開戰
            </h3>

            <div className="text-xs text-neutral-600 mb-3 bg-[#F4F5F7] rounded-xl p-3 text-left space-y-1.5">
              <div>
                • 房主：<span className="font-bold text-[#232323]">{waitingRoom.hostName}</span>
              </div>
              <div>
                • 你的暱稱：<span className="font-bold text-[#24554F]">{nickname}</span>
              </div>
              <div>
                • 對戰範圍：
                <span className="font-bold text-[#232323]">
                  {formatScopeLabel(
                    waitingRoom.quizType,
                    waitingRoom.gsatFilter,
                    waitingRoom.chapterId
                  )}
                </span>
              </div>
            </div>

            <div className="mb-4 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs font-medium">
              ⏳ 等待房主按下「開始對戰」後自動同步開局…
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => launchWaitingRoomBattle(waitingRoom)}
                className="w-full py-3 rounded-xl bg-[#24554F] hover:bg-[#1D4742] text-white font-bold text-[15px] shadow-sm transition-colors"
              >
                不等房主，先開始作答
              </button>
              <button
                type="button"
                onClick={() => setWaitingRoom(null)}
                className="w-full py-2.5 rounded-xl border border-[#D5E2E0] bg-white hover:bg-[#ECF2F2] text-neutral-600 font-medium text-[14px] transition-colors"
              >
                離開房間
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
