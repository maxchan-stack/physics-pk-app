import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpenCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FlaskConical,
  Swords,
} from 'lucide-react';
import {
  CONCEPT_LESSONS,
  GRADE_CONFIG,
  QUESTION_BANK,
} from '../data/curriculum-data';
import {
  DifficultyLevel,
  GameMode,
  GradeLevel,
  PhysicsQuestion,
} from '../types/physics-types';
import { BlackboardDiagram } from './BlackboardDiagram';
import { MathText } from './MathText';
import { LESSON_SIM_MAP, PhysicsSimCanvas } from './PhysicsSimCanvas';

interface ConceptLessonViewProps {
  /** 預設選取的觀念課堂 ID（預設為 c-g11-2-1「2-1 位移、速度與加速度」） */
  initialLessonId?: string;
  /** 從觀念黑板直接發起該章節測驗 */
  onStartChapterQuiz: (
    mode: GameMode,
    chapterId: string,
    difficulty: DifficultyLevel
  ) => void;
}

/**
 * 觀念教學 (教室黑板圖解與便利貼公式) 視圖元件
 * 呈現 34 堂高一至高三物理核心黑板圖解、粗體重點內文與黃色便利貼公式框。
 *
 * @param props ConceptLessonViewProps
 * @returns 觀念黑板教學視圖元件
 */
export function ConceptLessonView({
  initialLessonId = 'c-g11-2-1',
  onStartChapterQuiz,
}: ConceptLessonViewProps): React.ReactElement {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(initialLessonId);
  const [filterGrade, setFilterGrade] = useState<GradeLevel | 'all' | 'sims'>('all');
  const [expandedExampleIds, setExpandedExampleIds] = useState<Record<string, boolean>>({});
  const [pickedOptionMap, setPickedOptionMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (initialLessonId) {
      setSelectedLessonId(initialLessonId);
      const targetLesson = CONCEPT_LESSONS.find((l) => l.id === initialLessonId);
      if (targetLesson) {
        setFilterGrade((prev) =>
          prev !== 'all' && prev !== 'sims' && targetLesson.grade !== prev
            ? targetLesson.grade
            : prev
        );
      }
    }
  }, [initialLessonId]);

  useEffect(() => {
    setExpandedExampleIds({});
    setPickedOptionMap({});
  }, [selectedLessonId]);

  const filteredLessons = useMemo(() => {
    if (filterGrade === 'all') {
      return CONCEPT_LESSONS;
    }
    if (filterGrade === 'sims') {
      return CONCEPT_LESSONS.filter((item) => Boolean(LESSON_SIM_MAP[item.id]));
    }
    return CONCEPT_LESSONS.filter((item) => item.grade === filterGrade);
  }, [filterGrade]);

  const currentLesson = useMemo(() => {
    return (
      CONCEPT_LESSONS.find((l) => l.id === selectedLessonId) ??
      filteredLessons[0] ??
      CONCEPT_LESSONS[0]
    );
  }, [filteredLessons, selectedLessonId]);

  const currentSim = LESSON_SIM_MAP[currentLesson.id];

  const lessonExamples = useMemo<PhysicsQuestion[]>(() => {
    const exact = QUESTION_BANK.filter((q) => q.conceptId === currentLesson.id);
    const pool =
      exact.length >= 2
        ? exact
        : [
            ...exact,
            ...QUESTION_BANK.filter(
              (q) =>
                q.chapterId === currentLesson.chapterId &&
                !exact.some((e) => e.id === q.id)
            ),
          ];
    const easy = pool.find((q) => q.difficulty === 1) ?? pool[0];
    const exam =
      pool.find((q) => q.difficulty >= 2 && q.id !== easy?.id) ??
      pool.find((q) => q.id !== easy?.id);
    return [easy, exam].filter((q): q is PhysicsQuestion => Boolean(q));
  }, [currentLesson.id, currentLesson.chapterId]);

  const lessonPitfalls = useMemo<string[]>(() => {
    const traps = lessonExamples
      .map((q) => q.commonTrap?.trim())
      .filter((t): t is string => Boolean(t));
    return [...new Set(traps)];
  }, [lessonExamples]);

  const currentIndex = filteredLessons.findIndex((l) => l.id === currentLesson.id);

  const handlePrev = () => {
    if (filteredLessons.length === 0) return;
    const prevIdx = (currentIndex - 1 + filteredLessons.length) % filteredLessons.length;
    setSelectedLessonId(filteredLessons[prevIdx].id);
  };

  const handleNext = () => {
    if (filteredLessons.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredLessons.length;
    setSelectedLessonId(filteredLessons[nextIdx].id);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-[520px] mx-auto">
      {/* 統一頁首設計語言 */}
      <header className="mb-3 animate-pop">
        <div className="text-[11px] font-bold tracking-[0.15em] text-[#C58B59] uppercase mb-0.5">
          CONCEPT BLACKBOARD
        </div>
        <h1 className="font-serif text-[26px] font-bold text-[#232323] leading-tight">
          {currentLesson.code} {currentLesson.title}
        </h1>
      </header>

      {/* 年段篩選與課堂橫向快速切換列 */}
      <div className="mb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {(['all', 'sims', 'grade10', 'grade11', 'grade12'] as const).map((gKey) => (
          <button
            key={gKey}
            type="button"
            onClick={() => {
              setFilterGrade(gKey);
              const firstMatch =
                gKey === 'all'
                  ? CONCEPT_LESSONS[0]
                  : gKey === 'sims'
                  ? CONCEPT_LESSONS.find((l) => Boolean(LESSON_SIM_MAP[l.id]))
                  : CONCEPT_LESSONS.find((l) => l.grade === gKey);
              if (firstMatch) {
                setSelectedLessonId(firstMatch.id);
              }
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap transition-colors inline-flex items-center gap-1 ${
              filterGrade === gKey
                ? 'bg-[#24554F] text-white border-[#24554F]'
                : 'bg-white text-neutral-600 border-[#D5E2E0] hover:border-[#266461]'
            }`}
          >
            {gKey === 'sims' && <FlaskConical className="w-3 h-3" />}
            {gKey === 'all'
              ? '全部年段'
              : gKey === 'sims'
              ? '互動實驗模擬'
              : GRADE_CONFIG[gKey].shortLabel}
          </button>
        ))}
      </div>

      {/* 課堂膠囊選擇列 */}
      <div className="mb-3.5 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {filteredLessons.map((lesson) => {
          const isActive = lesson.id === currentLesson.id;
          const hasSim = Boolean(LESSON_SIM_MAP[lesson.id]);
          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition-all inline-flex items-center gap-1 ${
                isActive
                  ? 'border-[#24554F] border-2 bg-[#E3F3F0] text-[#1D4742] shadow-sm'
                  : 'border-[#D5E2E0] bg-white/80 text-neutral-600 hover:bg-white'
              }`}
            >
              {hasSim && <FlaskConical className="w-3 h-3 text-[#C58B59] shrink-0" />}
              {lesson.code} {lesson.title}
            </button>
          );
        })}
      </div>

      {/* 觀念黑板主卡片（統一松柏深綠頂線 + 大圓角白底） */}
      <div className="rounded-2xl border border-[#D5E2E0] border-t-[3.5px] border-t-[#24554F] bg-white p-4 sm:p-5 shadow-sm">
        {/* 深綠木框黑板 SVG 向量與物理圖解 */}
        <BlackboardDiagram
          diagramType={currentLesson.diagramType}
          caption={currentLesson.boardCaption}
        />

        {/* 核心觀念段落文字 */}
        <p className="mt-5 mb-5 text-[18px] leading-[1.75] text-[#232323] tracking-wide">
          {currentLesson.summaryHtmlParts.map((part, idx) =>
            part.bold ? (
              <strong key={idx} className="font-bold text-[#1D4742]">
                {part.text}
              </strong>
            ) : (
              <span key={idx}>{part.text}</span>
            )
          )}
        </p>

        {/* 黃色便利貼底色公式區 */}
        <div className="bg-[#fef7cd] border border-[#e8d058]/60 rounded-xl px-4 py-4 space-y-2.5 text-[16px] leading-[1.65] text-[#232323]">
          {currentLesson.formulas.map((formulaLine, idx) => (
            <div key={idx} className="font-normal tracking-wide">
              <MathText text={formulaLine} />
            </div>
          ))}
        </div>

        {/* 破題秒殺小叮嚀 */}
        <div className="mt-4 p-3 rounded-xl bg-[#ECF2F2] border border-[#D5E2E0] text-[13.5px] text-neutral-700">
          <span className="font-bold text-[#C58B59]">大考破題關鍵：</span>
          <MathText text={currentLesson.keyTakeaway} />
        </div>

        {/* Canvas 互動物理模擬實驗室（對應章節自動啟用） */}
        {currentSim && <PhysicsSimCanvas simType={currentSim} />}

        {/* 常見迷思與易錯陷阱提醒 */}
        {lessonPitfalls.length > 0 && (
          <div className="mt-4 rounded-xl border border-[#C58B59]/45 bg-[#FDF7F0] p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#A56A2A] mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              常見易錯陷阱提醒
            </div>
            <ul className="space-y-1.5 text-[13px] leading-relaxed text-neutral-700 list-disc pl-4">
              {lessonPitfalls.map((trap, idx) => (
                <li key={idx}>
                  <MathText text={trap} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 互動精選例題（先試答或展開看解題步驟） */}
        {lessonExamples.length > 0 && (
          <section className="mt-5 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#24554F] uppercase">
              <BookOpenCheck className="w-4 h-4 text-[#C58B59]" />
              精選互動例題演練
            </div>
            {lessonExamples.map((ex, exIdx) => {
              const isOpen = Boolean(expandedExampleIds[ex.id]);
              const picked = pickedOptionMap[ex.id];
              const hasPicked = picked !== undefined;
              const isCorrect = picked === ex.correctIndex;
              const levelLabel =
                ex.difficulty >= 3
                  ? '★★★ 進階挑戰'
                  : ex.difficulty === 2
                  ? '★★ 段考必考'
                  : '★ 基礎觀念';
              return (
                <div
                  key={ex.id}
                  className="rounded-xl border border-[#D5E2E0] bg-[#F9FBFA] p-3.5"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#E3F3F0] text-[#1D4742]">
                      例題 {exIdx + 1} · {levelLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedExampleIds((prev) => ({
                          ...prev,
                          [ex.id]: !prev[ex.id],
                        }))
                      }
                      className="text-xs font-bold text-[#24554F] hover:text-[#1D4742] inline-flex items-center gap-1"
                    >
                      {isOpen ? '收合詳解' : '展開詳解'}
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-[14px] leading-relaxed text-[#232323] font-medium mb-2.5">
                    <MathText text={ex.stem} />
                  </p>

                  <div className="grid grid-cols-1 gap-1.5">
                    {ex.options.map((opt, optIdx) => {
                      const optCode = ['A', 'B', 'C', 'D', 'E'][optIdx] ?? String(optIdx + 1);
                      let btnStyle =
                        'border-[#D5E2E0] bg-white text-neutral-700 hover:border-[#24554F]';
                      if (hasPicked) {
                        if (optIdx === ex.correctIndex) {
                          btnStyle =
                            'border-[#24554F] bg-[#E3F3F0] text-[#1D4742] font-bold';
                        } else if (optIdx === picked) {
                          btnStyle =
                            'border-[#C58B59] bg-[#FDF2EB] text-[#9A4E28]';
                        } else {
                          btnStyle = 'border-[#E5EEEC] bg-white/60 text-neutral-400';
                        }
                      }
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            setPickedOptionMap((prev) => ({ ...prev, [ex.id]: optIdx }));
                            setExpandedExampleIds((prev) => ({ ...prev, [ex.id]: true }));
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-[13px] transition-colors ${btnStyle}`}
                        >
                          <span className="font-bold mr-1.5">({optCode})</span>
                          <MathText text={opt} />
                        </button>
                      );
                    })}
                  </div>

                  {hasPicked && (
                    <div
                      className={`mt-2 text-xs font-bold ${
                        isCorrect ? 'text-[#24554F]' : 'text-[#A56A2A]'
                      }`}
                    >
                      {isCorrect
                        ? '答對了！可核對下方完整推導步驟。'
                        : `正確答案為 (${['A', 'B', 'C', 'D', 'E'][ex.correctIndex]})，請參考下方詳解。`}
                    </div>
                  )}

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-[#D5E2E0] space-y-2 text-[13px] leading-relaxed text-neutral-700">
                      {ex.keyFormula && (
                        <div className="bg-[#fef7cd] border border-[#e8d058]/60 rounded-lg px-3 py-1.5 text-[#232323]">
                          <span className="font-bold text-[#1D4742]">核心公式：</span>
                          <MathText text={ex.keyFormula} />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-[#1D4742]">秒殺思路：</span>
                        <MathText text={ex.shortExplanation} />
                      </div>
                      {ex.detailedSteps && (
                        <div>
                          <span className="font-bold text-[#1D4742]">推導步驟：</span>
                          <MathText text={ex.detailedSteps} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* 上一課 / 下一課 & 立即刷題連動按鈕 */}
        <div className="mt-5 pt-4 border-t border-[#E5EEEC] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="px-3 py-2.5 rounded-xl border border-[#D5E2E0] text-xs font-bold text-[#24554F] hover:bg-[#ECF2F2] flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            上一課
          </button>

          <button
            type="button"
            onClick={() =>
              onStartChapterQuiz('bot_pk', currentLesson.chapterId, 1)
            }
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#24554F] hover:bg-[#1D4742] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Swords className="w-3.5 h-3.5" />
            立即實戰本章題目
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-3 py-2.5 rounded-xl border border-[#D5E2E0] text-xs font-bold text-[#24554F] hover:bg-[#ECF2F2] flex items-center gap-1"
          >
            下一課
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
