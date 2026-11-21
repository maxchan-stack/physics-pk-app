import React, { useEffect, useState } from 'react';
import { Eraser, PenTool, X } from 'lucide-react';
import { useScratchpad } from '../hooks/useScratchpad';
import {
  ChapterInfo,
  DifficultyLevel,
  GameMode,
  PhysicsQuestion,
} from '../types/physics-types';
import { MathText } from './MathText';

interface QuizBattleViewProps {
  /** 遊戲模式 */
  mode: GameMode;
  /** 房間號碼 (若是好友對戰) */
  activeRoomId?: string | null;
  /** 真人好友對手暱稱 */
  realOpponentName?: string | null;
  /** 真人對手目前作答進度 (0-based 已完成題數) */
  opponentCurrentIndex?: number;
  /** 玩家暱稱 */
  playerNickname: string;
  /** 當前章節資訊 */
  chapter: ChapterInfo;
  /** 當前題目 */
  question: PhysicsQuestion;
  /** 目前題號索引 (0-based) */
  currentIndex: number;
  /** 總題數 */
  totalQuestions: number;
  /** 剩餘秒數 */
  remainingSeconds: number;
  /** 每題最大秒數 */
  maxSeconds: number;
  /** 玩家目前總分 */
  playerScore: number;
  /** 對手目前總分 */
  botScore: number;
  /** 剛點選的選項索引 */
  selectedOption: number | null;
  /** 是否正處於換題過渡動畫中 */
  isTransitioning: boolean;
  /** 本題獲得之加分 */
  lastScoreDelta: number | null;
  /** 點選答案之回呼 */
  onSubmitAnswer: (optionIndex: number) => void;
  /** 中途離開測驗之回呼 */
  onExitQuiz: () => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E'];

const PEN_COLORS = [
  { color: '#1f449c', label: '藍筆' },
  { color: '#b52459', label: '紅筆' },
  { color: '#232323', label: '墨黑' },
] as const;

/**
 * 對戰與單人計時作答視圖元件
 * 提供玩家 vs 對手同步計分板、直尺刻度倒數計時條、換題自動清空的高 DPI 手寫計算紙、
 * 鍵盤快捷選答（1~5 / A~E）與誤觸退出二次確認。
 *
 * @param props QuizBattleViewProps
 * @returns 作答畫面元件
 */
export function QuizBattleView({
  mode,
  activeRoomId,
  realOpponentName,
  opponentCurrentIndex = 0,
  playerNickname,
  chapter,
  question,
  currentIndex,
  totalQuestions,
  remainingSeconds,
  maxSeconds,
  playerScore,
  botScore,
  selectedOption,
  isTransitioning,
  lastScoreDelta,
  onSubmitAnswer,
  onExitQuiz,
}: QuizBattleViewProps): React.ReactElement {
  const scratchpad = useScratchpad(question.id);
  const [confirmExit, setConfirmExit] = useState<boolean>(false);

  // 支援鍵盤 1~5 或 A~E 快速作答
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      const targetTag = (e.target as HTMLElement | null)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT') {
        return;
      }

      const key = e.key.toUpperCase();
      let idx = -1;
      if (key >= '1' && key <= '5') {
        idx = Number(key) - 1;
      } else if (key >= 'A' && key <= 'E') {
        idx = OPTION_LABELS.indexOf(key);
      }

      if (idx >= 0 && idx < question.options.length) {
        e.preventDefault();
        onSubmitAnswer(idx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTransitioning, onSubmitAnswer, question.options.length]);

  const timePercentage = Math.max(
    0,
    Math.min(100, (remainingSeconds / maxSeconds) * 100)
  );
  const playerProgressPct = Math.min(100, ((currentIndex + 1) / totalQuestions) * 100);
  const opponentProgressPct =
    mode === 'room_pk'
      ? Math.min(100, (opponentCurrentIndex / totalQuestions) * 100)
      : playerProgressPct;

  const renderStars = (diff: DifficultyLevel) => '★'.repeat(diff);
  const isSoloOrDrill = mode === 'solo_timer' || mode === 'mistake_drill';

  const opponentLabel =
    mode === 'solo_timer'
      ? '單人計時模式'
      : mode === 'mistake_drill'
      ? '錯題特訓模式'
      : mode === 'room_pk'
      ? realOpponentName
        ? `${realOpponentName} (#${activeRoomId ?? ''})`
        : activeRoomId
        ? `好友玩家 (#${activeRoomId})`
        : '好友對戰'
      : chapter.botName;

  const isWrongFeedback =
    isTransitioning && selectedOption !== question.correctIndex;

  return (
    <div className="pb-20 pt-3 px-4 max-w-[520px] mx-auto">
      {/* 頂部對戰比分與題數進度條（左右統一採用題數進度基準） */}
      <div className="mb-3">
        <div className="grid grid-cols-11 items-end">
          {/* 左側：玩家分數 */}
          <div className="col-span-5">
            <div className="text-[15px] font-bold text-[#232323] truncate">
              {playerNickname.trim() || '挑戰者'}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-hand text-[44px] font-bold leading-none text-[#24554F] tabular-nums">
                {playerScore}
              </span>
              {lastScoreDelta !== null && lastScoreDelta > 0 && (
                <span className="text-xs font-bold text-emerald-600 animate-bounce">
                  +{lastScoreDelta}
                </span>
              )}
            </div>
            <div className="mt-1.5 h-[6px] w-full bg-[#DCE6E4] rounded-sm overflow-hidden">
              <div
                className="h-full bg-[#266461] transition-all duration-300"
                style={{ width: `${playerProgressPct}%` }}
              />
            </div>
          </div>

          {/* 中間：VS / 模式圖示 */}
          <div className="col-span-1 text-center pb-3">
            <span className="text-[16px] font-medium text-[#C58B59]">
              {isSoloOrDrill ? '⏱️' : 'VS'}
            </span>
          </div>

          {/* 右側：對手分數或單人題數進度 */}
          <div className="col-span-5 text-right">
            <div className="text-[15px] font-bold text-[#232323] truncate">
              {opponentLabel}
            </div>
            <div className="flex items-baseline justify-end gap-1.5">
              {mode === 'room_pk' && !realOpponentName && (
                <span className="text-[11px] font-medium text-neutral-400">等待同步</span>
              )}
              <span className="font-hand text-[44px] font-bold leading-none text-[#C58B59] tabular-nums">
                {isSoloOrDrill ? `${currentIndex + 1}/${totalQuestions}` : botScore}
              </span>
            </div>
            <div className="mt-1.5 h-[6px] w-full bg-[#F1E6DC] rounded-sm overflow-hidden flex justify-end">
              <div
                className="h-full bg-[#C58B59] transition-all duration-300"
                style={{ width: `${opponentProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 黃色直尺刻度倒數計時條 */}
      <div
        aria-label="直尺倒數計時器"
        className="relative w-full h-[22px] rounded-[4px] border-[1.8px] border-[#24554F] bg-white overflow-hidden mb-4 shadow-sm"
      >
        <div
          className={`h-full transition-all duration-500 ${
            remainingSeconds <= 20 ? 'bg-red-400' : 'bg-[#f7e06d]'
          }`}
          style={{ width: `${timePercentage}%` }}
        />
        <div className="absolute inset-0 ruler-ticks ruler-major-ticks pointer-events-none" />
      </div>

      {/* 題目主卡片 */}
      <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] bg-white p-5 shadow-sm relative">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="text-[15px] text-neutral-600 font-medium flex items-center gap-1.5 flex-wrap">
            <span>
              第 {currentIndex + 1} / {totalQuestions} 題
            </span>
            <span className="text-[#C58B59] text-[15px]">
              {renderStars(question.difficulty)}
            </span>
            {question.gsatYear && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300 whitespace-nowrap">
                🏆 {question.gsatYear}學測
              </span>
            )}
            {question.isConceptual && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#9B8A5E]/15 text-[#7A6C4D] font-bold border border-[#9B8A5E]/30 whitespace-nowrap">
                💡 純觀念
              </span>
            )}
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#E3F3F0] border border-[#CBE2DF] text-[#24554F] text-[12.5px] font-bold">
            {question.chapterCode} {question.chapterTitle}
          </span>

          <div className="text-[15px] font-medium text-neutral-600 tabular-nums">
            {Math.floor(remainingSeconds / 60)}:{String(remainingSeconds % 60).padStart(2, '0')}
          </div>
        </div>

        {/* 題幹內容 */}
        <div className="my-4 text-[20px] sm:text-[21px] font-medium text-[#232323] leading-[1.6] tracking-wide">
          <MathText text={question.stem} />
        </div>

        {/* 行動端手寫計算紙工具列與畫布 */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scratchpad.setIsOpen((prev) => !prev)}
            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-colors ${
              scratchpad.isOpen
                ? 'bg-[#24554F] text-white border-[#24554F]'
                : 'bg-[#ECF2F2] text-[#24554F] border-[#D5E2E0] hover:border-[#266461]'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            {scratchpad.isOpen ? '收起手寫計算紙' : '✏️ 展開手寫計算紙'}
          </button>

          {scratchpad.isOpen && (
            <div className="flex items-center gap-2">
              {PEN_COLORS.map((pen) => (
                <button
                  key={pen.color}
                  type="button"
                  onClick={() => scratchpad.setPenColor(pen.color)}
                  style={{ backgroundColor: pen.color }}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${
                    scratchpad.penColor === pen.color
                      ? 'border-[#24554F] ring-2 ring-[#24554F]/30 scale-110'
                      : 'border-white shadow-sm'
                  }`}
                  title={pen.label}
                  aria-label={pen.label}
                />
              ))}
              <button
                type="button"
                onClick={scratchpad.clearCanvas}
                className="px-2 py-0.5 rounded-lg bg-[#ECF2F2] hover:bg-[#DCE6E4] text-xs text-[#24554F] font-bold flex items-center gap-1"
              >
                <Eraser className="w-3 h-3" />
                清除
              </button>
            </div>
          )}
        </div>

        {scratchpad.isOpen && (
          <div className="mb-4 relative h-[175px] w-full rounded-xl border-2 border-dashed border-[#266461]/45 bg-grid-paper overflow-hidden touch-none">
            {!scratchpad.hasStrokes && (
              <span className="absolute top-2 left-3 text-[11px] text-neutral-400 pointer-events-none select-none">
                在此直接用手指或滑鼠列算式、畫力圖（換題自動清空）...
              </span>
            )}
            <canvas
              ref={scratchpad.canvasRef}
              onMouseDown={scratchpad.handleStartDraw}
              onMouseMove={scratchpad.handleMoveDraw}
              onMouseUp={scratchpad.handleEndDraw}
              onMouseLeave={scratchpad.handleEndDraw}
              onTouchStart={scratchpad.handleStartDraw}
              onTouchMove={scratchpad.handleMoveDraw}
              onTouchEnd={scratchpad.handleEndDraw}
              className="w-full h-full cursor-crosshair"
            />
          </div>
        )}

        {/* 答錯時的單行即時正解提示 */}
        {isWrongFeedback && (
          <div className="mb-2.5 px-3 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-pop">
            本題正解為 {OPTION_LABELS[question.correctIndex]}
          </div>
        )}

        {/* 選項列表 A / B / C / D */}
        <div className="divide-y divide-[#E6EEED] border-t border-[#E6EEED]">
          {question.options.map((optText, idx) => {
            const isThisSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctIndex;

            let rowStyle = 'hover:bg-[#F3F9F8]';
            let circleStyle = 'border-[#24554F] text-[#24554F] bg-white';

            if (isTransitioning) {
              if (isCorrectOption) {
                rowStyle = 'bg-emerald-50/90';
                circleStyle = 'border-emerald-600 bg-emerald-600 text-white';
              } else if (isThisSelected && !isCorrectOption) {
                rowStyle = 'bg-rose-50/90';
                circleStyle = 'border-rose-600 bg-rose-600 text-white';
              }
            }

            return (
              <button
                key={`${question.id}-opt-${idx}`}
                type="button"
                disabled={isTransitioning}
                onClick={() => onSubmitAnswer(idx)}
                className={`w-full py-3.5 px-2 text-left flex items-center gap-3.5 transition-colors rounded-lg ${rowStyle}`}
              >
                <span
                  className={`w-[36px] h-[36px] rounded-full border-[1.8px] flex items-center justify-center text-[15px] font-bold flex-shrink-0 transition-colors ${circleStyle}`}
                >
                  {OPTION_LABELS[idx]}
                </span>
                <span className="text-[18px] sm:text-[19px] text-[#232323] font-normal leading-snug">
                  <MathText text={optText} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 底部中止測驗（含防誤觸二次確認） */}
      <div className="mt-4 flex justify-end">
        {confirmExit ? (
          <div className="w-full rounded-xl bg-white border border-rose-200 p-3 flex items-center justify-between gap-2 shadow-sm animate-pop">
            <span className="text-xs font-bold text-rose-700">
              確定要中止本局？作答進度將不保留
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setConfirmExit(false)}
                className="px-3 py-1.5 rounded-lg border border-[#D5E2E0] text-xs font-bold text-neutral-600 hover:bg-[#ECF2F2]"
              >
                繼續作答
              </button>
              <button
                type="button"
                onClick={onExitQuiz}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                確認離開
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmExit(true)}
            className="text-xs text-neutral-500 hover:text-rose-600 flex items-center gap-1 py-1 px-2"
          >
            <X className="w-3.5 h-3.5" />
            結束本局並返回首頁
          </button>
        )}
      </div>
    </div>
  );
}
