import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, RotateCcw, Swords, Timer, Trash2 } from 'lucide-react';
import { CHAPTER_LIST, GRADE_CONFIG, QUESTION_BANK } from '../data/curriculum-data';
import {
  ChapterInfo,
  DifficultyLevel,
  GameMode,
  GradeLevel,
  MatrixCellStat,
  MistakeItem,
  PhysicsQuestion,
  QuizSummary,
} from '../types/physics-types';
import { MathText } from './MathText';

interface WeaknessMatrixViewProps {
  /** 目前選取的年段 */
  selectedGrade: GradeLevel;
  /** 切換年段回呼 */
  onSelectGrade: (grade: GradeLevel) => void;
  /** 查詢單格統計函式 */
  getCellStat: (chapterId: string, difficulty: DifficultyLevel) => MatrixCellStat;
  /** 錯題本清單 */
  mistakes: MistakeItem[];
  /** 移除已熟練錯題 */
  onRemoveMistake: (questionId: string) => void;
  /** 清空所有統計與錯題紀錄 */
  onResetStats: () => void;
  /** 點擊矩陣格或錯題本啟動測驗 */
  onStartQuiz: (
    mode: GameMode,
    chapterId: string,
    difficulty: DifficultyLevel,
    customQuestions?: PhysicsQuestion[],
    roomId?: string,
    retryConfig?: QuizSummary['retryConfig']
  ) => void;
  /** 跳轉至該章節的觀念黑板 */
  onOpenChapterConcept: (chapterId: string) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'];
const DIFFICULTY_LEVELS: DifficultyLevel[] = [1, 2, 3];

/**
 * 弱點分析矩陣 (章節 × 1~3 星難度紅黃綠熱力圖) 與智慧錯題本視圖元件
 * 採用統一松柏深綠圓角設計語言，支援點擊任一格進行特訓、答對錯題自動消除及安全清空確認。
 *
 * @param props WeaknessMatrixViewProps
 * @returns 弱點分析視圖元件
 */
export function WeaknessMatrixView({
  selectedGrade,
  onSelectGrade,
  getCellStat,
  mistakes,
  onRemoveMistake,
  onResetStats,
  onStartQuiz,
  onOpenChapterConcept,
}: WeaknessMatrixViewProps): React.ReactElement {
  const [subMode, setSubMode] = useState<'matrix' | 'mistakes'>('matrix');
  const [confirmReset, setConfirmReset] = useState<boolean>(false);
  const [activeCellModal, setActiveCellModal] = useState<{
    chapter: ChapterInfo;
    difficulty: DifficultyLevel;
    stat: MatrixCellStat;
  } | null>(null);

  const gradeChapters = CHAPTER_LIST.filter((ch) => ch.grade === selectedGrade);

  // 判斷目前整體是否尚無作答紀錄，供顯示新手引導
  const hasAnyAttempt = useMemo(() => {
    return CHAPTER_LIST.some((ch) =>
      DIFFICULTY_LEVELS.some((diff) => getCellStat(ch.id, diff).totalAttempts > 0)
    );
  }, [getCellStat]);

  // 支援按 Esc 鍵關閉底部特訓選單
  useEffect(() => {
    if (!activeCellModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveCellModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCellModal]);

  /**
   * 根據正確率計算格子的紅/黃/綠背景色與邊框（綠 ≥ 80%、黃 60~79%、紅 < 60%）
   */
  const getCellAppearance = (stat: MatrixCellStat) => {
    if (stat.totalAttempts === 0) {
      return {
        bgClass: 'bg-[#F4F5F7] border-[#D5E2E0] text-neutral-500',
        rateText: '—',
      };
    }
    const accuracy = Math.round((stat.correctAttempts / stat.totalAttempts) * 100);
    if (accuracy >= 80) {
      return {
        bgClass: 'bg-[#bcecd6] border-[#96d4b7] text-[#173829]',
        rateText: `${accuracy}%`,
      };
    }
    if (accuracy >= 60) {
      return {
        bgClass: 'bg-[#fef0b5] border-[#e0c86c] text-[#423608]',
        rateText: `${accuracy}%`,
      };
    }
    return {
      bgClass: 'bg-[#fad2d2] border-[#e39b9b] text-[#4a1515]',
      rateText: `${accuracy}%`,
    };
  };

  /**
   * 啟動全部錯題重練（帶入 retryConfig: { quizType: 'mistake' }）
   */
  const handleStartMistakeDrill = () => {
    const mistakeQuestions = mistakes
      .map((m) => QUESTION_BANK.find((q) => q.id === m.questionId))
      .filter((q): q is PhysicsQuestion => Boolean(q));

    if (mistakeQuestions.length === 0) {
      return;
    }

    onStartQuiz(
      'mistake_drill',
      mistakeQuestions[0].chapterId,
      mistakeQuestions[0].difficulty,
      mistakeQuestions,
      undefined,
      { quizType: 'mistake' }
    );
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-[520px] mx-auto">
      {/* 統一頁首設計語言 */}
      <header className="mb-3 animate-pop">
        <div className="text-[11px] font-bold tracking-[0.15em] text-[#C58B59] uppercase mb-0.5">
          WEAKNESS & MISTAKES
        </div>
        <h1 className="font-serif text-[26px] font-bold text-[#232323] leading-tight">
          弱點分析與錯題本
        </h1>
        <p className="text-[13px] text-neutral-500 mt-0.5">
          自動統計各章節 1～3 星作答表現，錯題重練答對自動消除
        </p>
      </header>

      {/* 子功能切換：弱點熱力圖矩陣 vs 錯題本 */}
      <div className="grid grid-cols-2 gap-2 mb-3.5">
        <button
          type="button"
          onClick={() => setSubMode('matrix')}
          className={`py-2.5 px-3 rounded-xl text-[13.5px] font-bold border transition-all ${
            subMode === 'matrix'
              ? 'bg-[#24554F] text-white border-[#24554F] shadow-sm'
              : 'border-[#D5E2E0] bg-white text-neutral-600 hover:bg-[#ECF2F2]'
          }`}
        >
          📊 章節 × 難度矩陣
        </button>
        <button
          type="button"
          onClick={() => setSubMode('mistakes')}
          className={`py-2.5 px-3 rounded-xl text-[13.5px] font-bold border transition-all ${
            subMode === 'mistakes'
              ? 'bg-[#24554F] text-white border-[#24554F] shadow-sm'
              : 'border-[#D5E2E0] bg-white text-neutral-600 hover:bg-[#ECF2F2]'
          }`}
        >
          📓 智慧錯題本 ({mistakes.length})
        </button>
      </div>

      {subMode === 'matrix' ? (
        <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] bg-white p-4 shadow-sm">
          {/* 高一 / 高二 / 高三 年段切換膠囊 */}
          <div className="grid grid-cols-3 gap-1 bg-[#E7F0EF] p-1 rounded-xl border border-[#D5E2E0] mb-4">
            {(['grade10', 'grade11', 'grade12'] as GradeLevel[]).map((gKey) => {
              const isActive = selectedGrade === gKey;
              return (
                <button
                  key={gKey}
                  type="button"
                  onClick={() => onSelectGrade(gKey)}
                  className={`py-1.5 px-2 rounded-lg text-[12.5px] font-bold transition-all ${
                    isActive
                      ? 'bg-[#24554F] text-white shadow-sm'
                      : 'text-neutral-700 hover:bg-white/70'
                  }`}
                >
                  {GRADE_CONFIG[gKey].shortLabel}
                </button>
              );
            })}
          </div>

          {!hasAnyAttempt && (
            <div className="mb-3.5 p-3 rounded-xl bg-[#F3F9F8] border border-[#CBE2DF] text-xs text-[#1D4742] font-medium">
              💡 尚未有作答紀錄！點擊下方任一難度方格即可直接特訓，累積專屬紅黃綠熱力圖。
            </div>
          )}

          {/* 矩陣星級標頭：★ 基礎 | ★★ 段考 | ★★★ 挑戰 */}
          <div className="grid grid-cols-12 items-center mb-2">
            <div className="col-span-4 text-[11px] font-bold text-neutral-400">章節</div>
            <div className="col-span-8 grid grid-cols-3 text-center text-[#9e6b1b] text-[12px] font-bold">
              <div>★ 基礎</div>
              <div>★★ 段考</div>
              <div>★★★ 挑戰</div>
            </div>
          </div>

          {/* 章節 × 難度 3 欄矩陣列 */}
          <div className="space-y-2.5">
            {gradeChapters.map((ch) => (
              <div
                key={ch.id}
                className="grid grid-cols-12 items-center gap-1.5"
              >
                <div className="col-span-4 pr-1">
                  <div className="text-[15px] font-bold text-[#24554F] leading-tight">
                    {ch.code}
                  </div>
                  <div className="text-[12.5px] text-neutral-600 leading-snug mt-0.5">
                    {ch.title}
                  </div>
                </div>

                <div className="col-span-8 grid grid-cols-3 gap-1.5">
                  {DIFFICULTY_LEVELS.map((diff) => {
                    const stat = getCellStat(ch.id, diff);
                    const { bgClass, rateText } = getCellAppearance(stat);
                    return (
                      <button
                        key={`${ch.id}-${diff}`}
                        type="button"
                        onClick={() =>
                          setActiveCellModal({
                            chapter: ch,
                            difficulty: diff,
                            stat,
                          })
                        }
                        className={`h-[72px] rounded-xl border flex flex-col items-center justify-center transition-transform active:scale-95 hover:brightness-95 ${bgClass}`}
                      >
                        <span className="font-hand text-[20px] font-bold leading-none tabular-nums">
                          {rateText}
                        </span>
                        <span className="text-[11.5px] opacity-80 mt-1">
                          {stat.totalAttempts} 次
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 底部圖例說明與清空確認 */}
          <div className="mt-5 pt-3 border-t border-[#E6EEED] space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[12.5px] text-neutral-600 leading-relaxed">
                綠 ≥ 80%、黃 60～79%、紅 &lt; 60%。點任一格即可針對該章節與難度進行特訓！
              </p>
              <button
                type="button"
                onClick={() => setConfirmReset((prev) => !prev)}
                title="清空統計資料"
                aria-label="清空統計資料"
                className="p-2 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 flex-shrink-0 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {confirmReset && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-2 animate-pop">
                <span className="text-xs font-bold text-rose-800">
                  確定清空全部弱點統計、錯題本與最高分？
                </span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#D5E2E0] text-xs font-bold text-neutral-600"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetStats();
                      setConfirmReset(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    確認清空
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* 智慧錯題本模式 */
        <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#E6EEED]">
            <div>
              <h2 className="text-[17px] font-bold text-[#232323]">
                待攻克錯題清單
              </h2>
              <p className="text-xs text-neutral-500">
                自動收錄答錯題目，重練答對後將自動移出清單
              </p>
            </div>
            {mistakes.length > 0 && (
              <button
                type="button"
                onClick={handleStartMistakeDrill}
                className="px-3 py-2 rounded-xl bg-[#24554F] hover:bg-[#1D4742] text-white text-xs font-bold shadow-sm flex-shrink-0 transition-colors"
              >
                ⚔️ 錯題重練 ({mistakes.length} 題)
              </button>
            )}
          </div>

          {mistakes.length === 0 ? (
            <div className="py-10 text-center text-neutral-500 text-sm">
              目前沒有待攻克的錯題！繼續挑戰各章節 ★★ 段考或 ★★★ 挑戰題吧 🎯
            </div>
          ) : (
            <div className="divide-y divide-dashed divide-[#D5E2E0]">
              {mistakes.map((m) => {
                const q = QUESTION_BANK.find((item) => item.id === m.questionId);
                if (!q) return null;
                return (
                  <div key={m.questionId} className="py-3.5 first:pt-1">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                      <span className="font-bold text-[#24554F]">
                        {q.chapterCode} {q.chapterTitle} ・ {'★'.repeat(q.difficulty)}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold">
                          累計答錯 {m.wrongCount} 次
                        </span>
                        <button
                          type="button"
                          onClick={() => onRemoveMistake(m.questionId)}
                          className="p-1 text-neutral-400 hover:text-emerald-600 flex items-center gap-0.5"
                          title="標記已熟練並移除"
                          aria-label="標記已熟練並移除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-[15px] font-medium text-[#232323] mb-1.5 leading-relaxed">
                      <MathText text={q.stem} />
                    </p>
                    <div className="text-xs text-emerald-700 font-bold mb-1.5">
                      正解：{OPTION_LETTERS[q.correctIndex]}.{' '}
                      <MathText text={q.options[q.correctIndex] ?? ''} />
                    </div>
                    <div className="bg-[#fdf9e2] border-l-[3px] border-[#e8c63c] rounded-r-lg px-3 py-2 text-xs text-neutral-800 leading-relaxed">
                      <MathText text={q.shortExplanation} />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => onOpenChapterConcept(q.chapterId)}
                        className="text-xs font-bold text-[#C58B59] hover:text-[#a87242] hover:underline flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        對應觀念黑板
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 點擊矩陣格彈出的行動端底部特訓選單 (Bottom Action Sheet) */}
      {activeCellModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="章節難度特訓選單"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveCellModal(null);
          }}
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px] flex items-end justify-center p-3"
        >
          <div className="w-full max-w-[460px] rounded-2xl bg-white border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] p-5 shadow-2xl animate-slide-up">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#fef7cd] border border-[#e8d058] text-neutral-800">
                  {activeCellModal.difficulty === 1
                    ? '★ 基礎特訓'
                    : activeCellModal.difficulty === 2
                    ? '★★ 段考特訓'
                    : '★★★ 挑戰特訓'}
                </span>
                <h3 className="text-xl font-bold text-[#232323] mt-1.5">
                  {activeCellModal.chapter.code} {activeCellModal.chapter.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  目前紀錄：已作答 {activeCellModal.stat.totalAttempts} 次・正確{' '}
                  {activeCellModal.stat.correctAttempts} 題
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCellModal(null)}
                aria-label="關閉選單"
                className="text-sm font-bold text-neutral-400 hover:text-neutral-800 px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 mt-4">
              <button
                type="button"
                onClick={() => {
                  const { chapter, difficulty } = activeCellModal;
                  setActiveCellModal(null);
                  onStartQuiz('bot_pk', chapter.id, difficulty, undefined, undefined, {
                    quizType: 'standard',
                  });
                }}
                className="w-full py-3.5 rounded-xl bg-[#24554F] hover:bg-[#1D4742] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Swords className="w-4 h-4" />
                挑戰 {activeCellModal.chapter.botName} (10 題對戰)
              </button>

              <button
                type="button"
                onClick={() => {
                  const { chapter, difficulty } = activeCellModal;
                  setActiveCellModal(null);
                  onStartQuiz('solo_timer', chapter.id, difficulty, undefined, undefined, {
                    quizType: 'standard',
                  });
                }}
                className="w-full py-3 rounded-xl border border-[#24554F] bg-white hover:bg-[#ECF2F2] text-[#24554F] font-bold text-[15px] flex items-center justify-center gap-2 transition-colors"
              >
                <Timer className="w-4 h-4" />
                開始單人計時特訓 (10 題)
              </button>

              <button
                type="button"
                onClick={() => {
                  const { chapter } = activeCellModal;
                  setActiveCellModal(null);
                  onOpenChapterConcept(chapter.id);
                }}
                className="w-full py-3 rounded-xl border border-[#D5E2E0] bg-[#ECF2F2]/60 hover:bg-[#ECF2F2] text-neutral-800 font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#C58B59]" />
                先複習本章「觀念黑板」
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
