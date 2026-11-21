import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { QuizSummary } from '../types/physics-types';
import { MathText } from './MathText';

interface ResultExplanationViewProps {
  /** 測驗結算總結資料 */
  summary: QuizSummary;
  /** 再挑戰一次 / 再練一次 */
  onRetry: () => void;
  /** 查看排行榜 */
  onViewLeaderboard: () => void;
  /** 回首頁 */
  onBackHome: () => void;
  /** 跳轉至特定觀念黑板課堂 */
  onOpenConceptLesson: (conceptId?: string, chapterId?: string) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];

/**
 * 對戰結算與強化版詳解列表視圖元件
 * 採用松柏深綠圓角設計系統，支援對戰結算同步等待、只看錯題篩選、
 * 完整數學式呈現之「你的作答 vs 正解對比」、三段式公式推導展開與一鍵開啟觀念黑板。
 *
 * @param props ResultExplanationViewProps
 * @returns 結算與詳解畫面元件
 */
export function ResultExplanationView({
  summary,
  onRetry,
  onViewLeaderboard,
  onBackHome,
  onOpenConceptLesson,
}: ResultExplanationViewProps): React.ReactElement {
  const [onlyMistakes, setOnlyMistakes] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const isPkMode = summary.mode === 'bot_pk' || summary.mode === 'room_pk';
  const isWaitingOpponent =
    summary.mode === 'room_pk' && summary.opponentFinished === false;

  const filteredAttempts = onlyMistakes
    ? summary.attempts.filter((a) => !a.isCorrect)
    : summary.attempts;

  const toggleExpand = (itemKey: string) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  return (
    <div className="pb-24 pt-5 px-4 max-w-[520px] mx-auto">
      {/* 頂部結算標題 */}
      {isWaitingOpponent ? (
        <div className="text-center mb-4 animate-pop">
          <h1 className="font-serif text-[38px] font-bold text-[#24554F] leading-tight">
            已完賽！
          </h1>
          <p className="text-[13px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-2 inline-block font-medium">
            ⏳ 等待 {summary.botName} 完成剩餘題目，最終勝負將即時更新…
          </p>
        </div>
      ) : isPkMode ? (
        <div className="text-center mb-4 animate-pop">
          <h1 className="font-serif text-[44px] font-bold text-[#232323] leading-tight inline-block highlighter-yellow">
            {summary.isVictory ? '勝利！' : '惜敗！'}
          </h1>
          <p className="text-[12.5px] text-neutral-500 mt-2 font-medium">
            {summary.mode === 'room_pk'
              ? '好友對戰結算完成・最高分已自動寫入排行榜'
              : '對戰結算完成・最高分與勝率已自動記錄'}
          </p>
        </div>
      ) : (
        <div className="text-center mb-5 animate-pop">
          <div className="text-[11px] font-bold tracking-[0.15em] text-[#C58B59] uppercase mb-0.5">
            PRACTICE SUMMARY
          </div>
          <h1 className="font-serif text-[34px] font-bold text-[#232323] tracking-wider">
            {summary.mode === 'mistake_drill' ? '錯題特訓結束' : '練習結束'}
          </h1>
        </div>
      )}

      {/* 比分卡片區（統一松柏深綠與暖金銅配色） */}
      {isPkMode ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] bg-white py-4 px-3 text-center shadow-sm">
            <div className="text-[16px] font-bold text-[#232323] truncate">
              {summary.playerNickname}
            </div>
            <div className="font-hand text-[42px] font-bold text-[#24554F] leading-tight my-1 tabular-nums">
              {summary.playerScore}
            </div>
            <div className="text-[13px] text-neutral-500">
              答對 {summary.playerCorrectCount} / {summary.totalQuestions}
            </div>
          </div>

          <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#C58B59] bg-white py-4 px-3 text-center shadow-sm">
            <div className="text-[16px] font-bold text-[#232323] truncate">
              {summary.botName}
            </div>
            <div className="font-hand text-[42px] font-bold text-[#C58B59] leading-tight my-1 tabular-nums">
              {summary.botScore}
            </div>
            <div className="text-[13px] text-neutral-500">
              {isWaitingOpponent
                ? '作答中…'
                : `答對 ${summary.botCorrectCount} / ${summary.totalQuestions}`}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] bg-white py-5 px-4 text-center shadow-sm mb-4">
          <div className="text-[17px] font-bold text-[#232323]">
            {summary.playerNickname}
          </div>
          <div className="font-hand text-[44px] font-bold text-[#24554F] leading-tight my-1 tabular-nums">
            {summary.playerScore}
          </div>
          <div className="text-[14px] text-neutral-500">
            答對 {summary.playerCorrectCount} / {summary.totalQuestions}
          </div>
        </div>
      )}

      {/* 行動按鈕群 */}
      <div className="space-y-2.5 mb-5">
        <button
          type="button"
          onClick={onRetry}
          className="w-full py-3.5 rounded-xl bg-[#24554F] hover:bg-[#1D4742] text-white font-bold text-[16px] tracking-wide shadow-sm transition-colors"
        >
          {summary.mode === 'room_pk'
            ? '開啟新房間再戰一局'
            : isPkMode
            ? '再挑戰一次'
            : '再練一次'}
        </button>

        {isPkMode && (
          <button
            type="button"
            onClick={onViewLeaderboard}
            className="w-full py-3 rounded-xl border border-[#D5E2E0] bg-white hover:bg-[#ECF2F2] text-[#232323] font-bold text-[15px] transition-colors"
          >
            看排行榜
          </button>
        )}

        <button
          type="button"
          onClick={onBackHome}
          className="w-full py-3 rounded-xl border border-[#D5E2E0] bg-white hover:bg-[#ECF2F2] text-neutral-700 font-bold text-[15px] transition-colors"
        >
          回首頁
        </button>
      </div>

      {/* 詳解外框卡片 */}
      <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between pb-2.5 border-b border-dashed border-[#D5E2E0] mb-3">
          <h2 className="text-[18px] font-bold text-[#232323]">題目詳解</h2>
          <button
            type="button"
            onClick={() => setOnlyMistakes((prev) => !prev)}
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 transition-colors ${
              onlyMistakes
                ? 'bg-[#24554F] text-white border-[#24554F]'
                : 'bg-[#ECF2F2] text-[#24554F] border-[#D5E2E0]'
            }`}
          >
            <Filter className="w-3 h-3" />
            {onlyMistakes ? '顯示全部題目' : '只看答錯題目'}
          </button>
        </div>

        {filteredAttempts.length === 0 ? (
          <div className="py-8 text-center text-neutral-500 text-sm">
            太強了！本局全部答對，沒有任何錯題 🎉
          </div>
        ) : (
          <div className="divide-y divide-dashed divide-[#D5E2E0]">
            {filteredAttempts.map((item) => {
              const originalIndex = summary.attempts.indexOf(item);
              const q = item.question;
              const itemKey = `${q.id}-${originalIndex}`;
              const stars = '★'.repeat(q.difficulty);
              const correctLetter = OPTION_LETTERS[q.correctIndex] ?? 'A';
              const correctText = q.options[q.correctIndex] ?? '';
              const userLetter =
                item.selectedIndex !== null
                  ? OPTION_LETTERS[item.selectedIndex]
                  : '未作答';
              const userText =
                item.selectedIndex !== null ? q.options[item.selectedIndex] : '超時';
              const isExpanded = Boolean(expandedKeys[itemKey]);

              return (
                <div key={itemKey} className="py-4 first:pt-1">
                  <div className="text-[13px] text-neutral-600 mb-1.5 flex flex-wrap items-center gap-1">
                    <span>
                      第 {originalIndex + 1} 題・{q.chapterCode} {q.chapterTitle}・
                      {stars}・
                    </span>
                    <span
                      className={`font-bold ${
                        item.isCorrect ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {item.isCorrect ? '答對' : '答錯'}
                    </span>
                    {q.gsatYear && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                        🏆 {q.gsatYear}學測
                      </span>
                    )}
                    {q.isConceptual && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#9B8A5E]/15 text-[#7A6C4D] font-bold border border-[#9B8A5E]/30">
                        💡 純觀念
                      </span>
                    )}
                    <span className="text-xs text-neutral-400 ml-auto">
                      耗時 {item.timeSpentSec}s
                    </span>
                  </div>

                  {/* 題幹 */}
                  <p className="text-[16px] text-[#232323] font-medium leading-relaxed mb-2">
                    <MathText text={q.stem} />
                  </p>

                  {/* 正解與你的作答對比（皆套用 MathText） */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-2.5 text-[14.5px]">
                    <div className="text-emerald-700 font-medium">
                      正解：{correctLetter}. <MathText text={correctText} />
                    </div>
                    {!item.isCorrect && (
                      <div className="text-rose-700 font-medium bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-lg text-[13px]">
                        你的作答：{userLetter} (<MathText text={userText} />)
                      </div>
                    )}
                  </div>

                  {/* 黃底左粗線秒殺解析 */}
                  <div className="bg-[#fdf9e2] border-l-[4px] border-[#e8c63c] rounded-r-lg px-3.5 py-2.5 text-[15px] text-[#232323] leading-relaxed">
                    <MathText text={q.shortExplanation} />
                  </div>

                  {/* 展開完整公式推導 & 觀念黑板連動 */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleExpand(itemKey)}
                      className="text-xs font-bold text-[#24554F] hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          收起完整公式與易錯陷阱
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          查看完整公式推導 & 易錯陷阱
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenConceptLesson(q.conceptId, q.chapterId)}
                      className="text-xs font-bold text-[#C58B59] hover:text-[#a87242] hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      對應觀念黑板
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 p-3.5 rounded-xl bg-[#ECF2F2]/70 border border-[#D5E2E0] text-[13.5px] space-y-2 animate-pop">
                      <div>
                        <span className="font-bold text-[#24554F]">【破題公式】</span>{' '}
                        <span className="text-neutral-800 font-medium">
                          <MathText text={q.keyFormula} />
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-neutral-800">【完整推導】</span>{' '}
                        <span className="text-neutral-700">
                          <MathText text={q.detailedSteps} />
                        </span>
                      </div>
                      <div className="text-rose-700">
                        <span className="font-bold">【易錯陷阱】</span>{' '}
                        <MathText text={q.commonTrap} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
