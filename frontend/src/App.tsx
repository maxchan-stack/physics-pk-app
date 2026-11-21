import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { BottomNavBar } from './components/BottomNavBar';
import { ConceptLessonView } from './components/ConceptLessonView';
import { HomeView } from './components/HomeView';
import { LeaderboardView } from './components/LeaderboardView';
import { QuizBattleView } from './components/QuizBattleView';
import { ResultExplanationView } from './components/ResultExplanationView';
import { WeaknessMatrixView } from './components/WeaknessMatrixView';
import {
  CONCEPT_LESSONS,
  QUESTION_BANK,
  getGsatQuestions,
  getQuestionsByChapter,
} from './data/curriculum-data';
import { useQuizSession } from './hooks/useQuizSession';
import { useWeaknessTracker } from './hooks/useWeaknessTracker';
import {
  ActiveTab,
  DifficultyLevel,
  GameMode,
  GradeLevel,
  PhysicsQuestion,
  QuizSummary,
} from './types/physics-types';

/**
 * 物理試試看 - 108 課綱高中三年段物理概念複習與對戰測驗
 * 採用松柏深綠 × 冷霧格線計算紙筆記風格
 *
 * @returns 應用程式根元件
 */
export function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lobby');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('grade11');
  const [targetConceptId, setTargetConceptId] = useState<string>('c-g11-2-1');
  const [isNamePanelOpen, setIsNamePanelOpen] = useState<boolean>(false);
  const [lobbyNotice, setLobbyNotice] = useState<string | null>(null);
  const [initialInviteRoomId, setInitialInviteRoomId] = useState<string | null>(() => {
    try {
      const roomParam = new URLSearchParams(window.location.search).get('room')?.trim() ?? '';
      return /^\d{4}$/.test(roomParam) ? roomParam : null;
    } catch {
      return null;
    }
  });

  // 暫存因缺暱稱而中斷的操作，填寫確定後自動續行
  const pendingActionRef = useRef<((confirmedNickname?: string) => void) | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'classic-pk');
  }, []);

  // 若網址帶有 ?room=XXXX 邀請碼，讀取後清理網址列 query 以免重整重複觸發
  useEffect(() => {
    if (!initialInviteRoomId) return;
    try {
      const cleanUrl = `${window.location.pathname}${window.location.hash}`;
      window.history.replaceState({}, '', cleanUrl);
    } catch {
      // 忽略瀏覽器歷史紀錄操作限制
    }
  }, [initialInviteRoomId]);

  // 支援按 Esc 鍵關閉頂部暱稱面板
  useEffect(() => {
    if (!isNamePanelOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        pendingActionRef.current = null;
        setIsNamePanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNamePanelOpen]);

  const weaknessTracker = useWeaknessTracker();
  const quizSession = useQuizSession({
    onQuizCompleted: weaknessTracker.recordAttempts,
  });

  const activeSummary = quizSession.quizSummary;

  /**
   * 要求輸入暱稱，並暫存後續接續動作
   */
  const handleRequireNickname = (afterConfirm?: (confirmedNickname?: string) => void) => {
    pendingActionRef.current = afterConfirm ?? null;
    setIsNamePanelOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 啟動測驗：單人與錯題練習免強制填暱稱；電腦／好友對戰缺暱稱時填完自動啟動
   */
  const handleStartQuiz = (
    mode: GameMode,
    chapterId: string,
    difficulty: DifficultyLevel,
    customQuestions?: PhysicsQuestion[],
    roomId?: string,
    retryConfig?: QuizSummary['retryConfig']
  ) => {
    const requiresNickname = mode === 'bot_pk' || mode === 'room_pk';
    if (requiresNickname && !quizSession.playerNickname.trim()) {
      handleRequireNickname(() => {
        setLobbyNotice(null);
        quizSession.startQuiz(
          mode,
          chapterId,
          difficulty,
          customQuestions,
          roomId,
          retryConfig
        );
      });
      return;
    }

    setLobbyNotice(null);
    quizSession.startQuiz(
      mode,
      chapterId,
      difficulty,
      customQuestions,
      roomId,
      retryConfig
    );
  };

  /**
   * 切換底部導覽分頁
   */
  const handleSelectTab = (tab: ActiveTab) => {
    quizSession.exitQuiz();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 從詳解或弱點矩陣跳轉至對應觀念黑板
   * NOTE: 若題目的 conceptId 不存在於目前黑板課堂，自動依 chapterId 精準降級查找
   */
  const handleOpenConcept = (conceptId?: string, chapterId?: string) => {
    quizSession.exitQuiz();
    const hasExactConcept = Boolean(
      conceptId && CONCEPT_LESSONS.some((c) => c.id === conceptId)
    );
    if (hasExactConcept && conceptId) {
      setTargetConceptId(conceptId);
    } else if (chapterId) {
      const matched = CONCEPT_LESSONS.find((c) => c.chapterId === chapterId);
      if (matched) {
        setTargetConceptId(matched.id);
      }
    }
    setActiveTab('concepts');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 儲存暱稱並關閉輸入面板，若有待執行動作則自動接續執行
   */
  const handleConfirmNickname = () => {
    const cleanName = quizSession.playerNickname.trim();
    if (!cleanName) return;

    setIsNamePanelOpen(false);
    const nextAction = pendingActionRef.current;
    pendingActionRef.current = null;
    if (nextAction) {
      nextAction(cleanName);
    }
  };

  /**
   * 關閉暱稱面板並清除暫存動作
   */
  const handleCancelNamePanel = () => {
    pendingActionRef.current = null;
    setIsNamePanelOpen(false);
  };

  /**
   * 處理結算頁「再挑戰一次／再練一次」，完整保留原始題型、學測篩選或錯題來源
   */
  const handleRetryFromSummary = (summary: QuizSummary) => {
    if (summary.mode === 'room_pk') {
      quizSession.exitQuiz();
      setActiveTab('lobby');
      setLobbyNotice('好友對戰已結束，請重新建立房間或輸入新房號邀請好友開戰！');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const retryConfig = summary.retryConfig;
    if (retryConfig?.quizType === 'conceptual') {
      const custom = getQuestionsByChapter(summary.chapterId, true);
      handleStartQuiz(
        summary.mode,
        summary.chapterId,
        summary.difficulty,
        custom,
        undefined,
        retryConfig
      );
      return;
    }

    if (retryConfig?.quizType === 'gsat') {
      const custom = getGsatQuestions(retryConfig.gsatFilter ?? 'all', summary.chapterId);
      handleStartQuiz(
        summary.mode,
        summary.chapterId,
        summary.difficulty,
        custom,
        undefined,
        retryConfig
      );
      return;
    }

    if (retryConfig?.quizType === 'mistake') {
      const remainingMistakes = weaknessTracker.mistakes
        .map((m) => QUESTION_BANK.find((q) => q.id === m.questionId))
        .filter((q): q is PhysicsQuestion => Boolean(q));

      if (remainingMistakes.length === 0) {
        quizSession.exitQuiz();
        setActiveTab('weakness');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      handleStartQuiz(
        'mistake_drill',
        remainingMistakes[0].chapterId,
        remainingMistakes[0].difficulty,
        remainingMistakes,
        undefined,
        retryConfig
      );
      return;
    }

    handleStartQuiz(
      summary.mode,
      summary.chapterId,
      summary.difficulty,
      undefined,
      undefined,
      retryConfig
    );
  };

  return (
    <div className="min-h-screen bg-grid-paper text-[#232323] flex flex-col font-sans">
      {/* 頂部橫幅：站名與玩家暱稱 */}
      <header className="sticky top-0 z-30 bg-[#266461] text-white border-b border-[#1D4742] shadow-sm">
        <div className="max-w-[520px] mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleSelectTab('lobby')}
            className="text-[18px] font-bold tracking-wide text-white"
          >
            物理試試看
          </button>

          <button
            type="button"
            onClick={() => {
              if (isNamePanelOpen) {
                handleCancelNamePanel();
              } else {
                pendingActionRef.current = null;
                setIsNamePanelOpen(true);
              }
            }}
            className={`px-3 py-1 rounded-full border text-[12.5px] font-bold transition-colors max-w-[165px] truncate ${
              quizSession.playerNickname.trim()
                ? 'bg-white/15 hover:bg-white/25 border-white/25 text-white'
                : 'bg-amber-300 border-amber-200 text-[#3a2a00]'
            }`}
          >
            {quizSession.playerNickname.trim()
              ? `👤 ${quizSession.playerNickname.trim()}`
              : '✎ 設定暱稱'}
          </button>
        </div>

        {isNamePanelOpen && (
          <div className="max-w-[520px] mx-auto px-4 pb-3 animate-pop">
            <div className="bg-white rounded-xl p-2.5 flex items-center gap-2 shadow-md">
              <input
                autoFocus
                type="text"
                maxLength={20}
                value={quizSession.playerNickname}
                onChange={(e) => quizSession.setPlayerNickname(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmNickname();
                }}
                placeholder="輸入對戰暱稱（如：Kiwi）"
                className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-[#D5E2E0] text-[15px] text-[#232323] focus:outline-none focus:border-[#266461]"
              />
              <button
                type="button"
                onClick={handleConfirmNickname}
                disabled={!quizSession.playerNickname.trim()}
                className="px-4 py-2 rounded-lg bg-[#24554F] hover:bg-[#1D4742] text-white text-[14px] font-bold disabled:opacity-40 whitespace-nowrap"
              >
                確定
              </button>
              <button
                type="button"
                onClick={handleCancelNamePanel}
                aria-label="關閉暱稱輸入"
                className="p-2 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 主內容容器 */}
      <main className="flex-1 w-full">
        {quizSession.isPlaying && quizSession.currentQuestion ? (
          <QuizBattleView
            mode={quizSession.mode}
            activeRoomId={quizSession.activeRoomId}
            realOpponentName={quizSession.realOpponentName}
            opponentCurrentIndex={quizSession.opponentCurrentIndex}
            playerNickname={quizSession.playerNickname}
            chapter={quizSession.currentChapter}
            question={quizSession.currentQuestion}
            currentIndex={quizSession.currentIndex}
            totalQuestions={quizSession.questions.length}
            remainingSeconds={quizSession.remainingSeconds}
            maxSeconds={quizSession.maxSeconds}
            playerScore={quizSession.playerScore}
            botScore={quizSession.botScore}
            selectedOption={quizSession.selectedOption}
            isTransitioning={quizSession.isTransitioning}
            lastScoreDelta={quizSession.lastScoreDelta}
            onSubmitAnswer={quizSession.submitAnswer}
            onExitQuiz={quizSession.exitQuiz}
          />
        ) : activeSummary ? (
          <ResultExplanationView
            summary={activeSummary}
            onRetry={() => handleRetryFromSummary(activeSummary)}
            onViewLeaderboard={() => handleSelectTab('leaderboard')}
            onBackHome={() => handleSelectTab('lobby')}
            onOpenConceptLesson={handleOpenConcept}
          />
        ) : activeTab === 'concepts' ? (
          <ConceptLessonView
            initialLessonId={targetConceptId}
            onStartChapterQuiz={(mode, chapterId, difficulty) =>
              handleStartQuiz(mode, chapterId, difficulty, undefined, undefined, {
                quizType: 'standard',
              })
            }
          />
        ) : activeTab === 'weakness' ? (
          <WeaknessMatrixView
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
            getCellStat={weaknessTracker.getCellStat}
            mistakes={weaknessTracker.mistakes}
            onRemoveMistake={weaknessTracker.removeMistake}
            onResetStats={weaknessTracker.clearAllStats}
            onStartQuiz={handleStartQuiz}
            onOpenChapterConcept={(chId) => handleOpenConcept(undefined, chId)}
          />
        ) : activeTab === 'leaderboard' ? (
          <LeaderboardView
            playerNickname={quizSession.playerNickname}
            playerBestScore={weaknessTracker.bestScore}
            pkStats={weaknessTracker.pkStats}
          />
        ) : (
          <HomeView
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
            playerNickname={quizSession.playerNickname}
            selectedChapterId={quizSession.selectedChapterId}
            onSelectChapter={quizSession.setSelectedChapterId}
            selectedDifficulty={quizSession.selectedDifficulty}
            onSelectDifficulty={quizSession.setSelectedDifficulty}
            initialInviteRoomId={initialInviteRoomId}
            lobbyNotice={lobbyNotice}
            onDismissLobbyNotice={() => setLobbyNotice(null)}
            onStartQuiz={handleStartQuiz}
            onRequireNickname={handleRequireNickname}
          />
        )}
      </main>

      {/* 行動端底部固定導覽列（測驗作答進行中自動隱藏以防誤觸） */}
      {!quizSession.isPlaying && (
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          mistakeCount={weaknessTracker.mistakes.length}
        />
      )}
    </div>
  );
}
