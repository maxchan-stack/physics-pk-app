import React, { useState } from 'react';
import { INITIAL_LEADERBOARD } from '../data/curriculum-data';
import { PkBattleStats } from '../types/physics-types';

interface LeaderboardViewProps {
  /** 目前玩家暱稱 */
  playerNickname: string;
  /** 玩家歷史最高分 */
  playerBestScore: number;
  /** 玩家實際累積的對戰場次與勝場數 */
  pkStats: PkBattleStats;
}

/**
 * 全國積分排行榜（純榜單，顯示玩家真實對戰勝率與最高分）
 *
 * @param props LeaderboardViewProps
 * @returns 排行榜元件
 */
export function LeaderboardView({
  playerNickname,
  playerBestScore,
  pkStats,
}: LeaderboardViewProps): React.ReactElement {
  const [filterGrade, setFilterGrade] = useState<'all' | '高一' | '高二' | '高三'>('all');

  const realWinRateText =
    pkStats.totalMatches === 0
      ? '尚無對戰紀錄'
      : `對戰勝率 ${Math.round((pkStats.wins / pkStats.totalMatches) * 100)}%（${pkStats.wins}/${pkStats.totalMatches}勝）`;

  const boardList = INITIAL_LEADERBOARD.map((entry) => {
    if (entry.isCurrentUser) {
      return {
        ...entry,
        name: playerNickname.trim() || '你（尚未設定暱稱）',
        score: playerBestScore,
        winRateLabel: realWinRateText,
      };
    }
    return {
      ...entry,
      winRateLabel: `對戰勝率 ${entry.winRate}`,
    };
  }).sort((a, b) => b.score - a.score);

  const filteredList = boardList.filter(
    (item) => filterGrade === 'all' || item.gradeBadge === filterGrade || item.isCurrentUser
  );

  return (
    <div className="pb-24 pt-4 px-4 max-w-[520px] mx-auto">
      <header className="mb-3 animate-pop">
        <div className="text-[11px] font-bold tracking-[0.15em] text-[#C58B59] uppercase mb-0.5">
          LEADERBOARD
        </div>
        <h1 className="font-serif text-[26px] font-bold text-[#232323] leading-tight">
          物理排行榜
        </h1>
      </header>

      <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] bg-white p-4 shadow-sm">
        <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
          {(['all', '高一', '高二', '高三'] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setFilterGrade(g)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                filterGrade === g
                  ? 'bg-[#24554F] text-white border-[#24554F]'
                  : 'bg-[#ECF2F2] text-neutral-600 border-[#D5E2E0]'
              }`}
            >
              {g === 'all' ? '全部' : `${g}榜`}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[#E6EEED]">
          {filteredList.map((user, index) => {
            const displayRank = index + 1;
            return (
              <div
                key={`${user.rank}-${user.isCurrentUser ? 'me' : user.name}`}
                className={`py-3 px-2.5 flex items-center justify-between rounded-xl ${
                  user.isCurrentUser ? 'bg-[#E3F3F0] font-bold' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      displayRank === 1
                        ? 'bg-amber-400 text-neutral-900'
                        : displayRank === 2
                        ? 'bg-neutral-300 text-neutral-800'
                        : displayRank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-[#ECF2F2] text-neutral-600'
                    }`}
                  >
                    {displayRank}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[15px] text-[#232323] truncate">{user.name}</span>
                      {user.isCurrentUser && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#24554F] text-white font-bold">
                          你
                        </span>
                      )}
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#ECF2F2] border border-[#D5E2E0] text-neutral-700 font-medium">
                        {user.gradeBadge}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{user.winRateLabel}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <span className="font-hand text-2xl font-bold text-[#24554F]">{user.score}</span>
                  <span className="text-xs text-neutral-500 ml-1">分</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
