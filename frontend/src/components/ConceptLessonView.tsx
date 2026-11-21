import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Swords } from 'lucide-react';
import { CONCEPT_LESSONS, GRADE_CONFIG } from '../data/curriculum-data';
import {
  DifficultyLevel,
  GameMode,
  GradeLevel,
} from '../types/physics-types';
import { BlackboardDiagram } from './BlackboardDiagram';
import { MathText } from './MathText';

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
  const [filterGrade, setFilterGrade] = useState<GradeLevel | 'all'>('all');

  useEffect(() => {
    if (initialLessonId) {
      setSelectedLessonId(initialLessonId);
      const targetLesson = CONCEPT_LESSONS.find((l) => l.id === initialLessonId);
      if (targetLesson) {
        setFilterGrade((prev) =>
          prev !== 'all' && targetLesson.grade !== prev ? targetLesson.grade : prev
        );
      }
    }
  }, [initialLessonId]);

  const filteredLessons = useMemo(() => {
    if (filterGrade === 'all') {
      return CONCEPT_LESSONS;
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
        {(['all', 'grade10', 'grade11', 'grade12'] as const).map((gKey) => (
          <button
            key={gKey}
            type="button"
            onClick={() => {
              setFilterGrade(gKey);
              const firstMatch =
                gKey === 'all'
                  ? CONCEPT_LESSONS[0]
                  : CONCEPT_LESSONS.find((l) => l.grade === gKey);
              if (firstMatch) {
                setSelectedLessonId(firstMatch.id);
              }
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${
              filterGrade === gKey
                ? 'bg-[#24554F] text-white border-[#24554F]'
                : 'bg-white text-neutral-600 border-[#D5E2E0] hover:border-[#266461]'
            }`}
          >
            {gKey === 'all' ? '全部年段' : GRADE_CONFIG[gKey].shortLabel}
          </button>
        ))}
      </div>

      {/* 課堂膠囊選擇列 */}
      <div className="mb-3.5 flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {filteredLessons.map((lesson) => {
          const isActive = lesson.id === currentLesson.id;
          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setSelectedLessonId(lesson.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap transition-all ${
                isActive
                  ? 'border-[#24554F] border-2 bg-[#E3F3F0] text-[#1D4742] shadow-sm'
                  : 'border-[#D5E2E0] bg-white/80 text-neutral-600 hover:bg-white'
              }`}
            >
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
          <span className="font-bold text-[#C58B59]">💡 大考破題關鍵：</span>
          <MathText text={currentLesson.keyTakeaway} />
        </div>

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
