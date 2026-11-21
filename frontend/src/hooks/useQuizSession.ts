import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CHAPTER_LIST, QUESTION_BANK } from '../data/curriculum-data';
import {
  DifficultyLevel,
  GameMode,
  PhysicsQuestion,
  QuestionAttempt,
  QuizSummary,
} from '../types/physics-types';

/** 每題作答倒數上限：2 分鐘（120 秒） */
const MAX_SECONDS_PER_QUESTION = 120;
const STORAGE_NICKNAME_KEY = 'physics_pk_nickname_v1';

interface UseQuizSessionOptions {
  /** 測驗完成時的回呼函式（寫入弱點矩陣、錯題本、歷史最高分與對戰統計） */
  onQuizCompleted: (
    attempts: QuestionAttempt[],
    finalScore: number,
    meta?: { mode?: GameMode; isVictory?: boolean }
  ) => void;
}

/**
 * 取得或建立目前瀏覽器分頁的唯一房間客戶端識別碼
 * NOTE: 即使兩位玩家使用相同暱稱，後端仍可準確區分不同裝置的即時比分
 */
export function getRoomClientId(): string {
  const storageKey = 'physics_room_client_id_v1';
  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) {
      return existing;
    }
    const generated = `cli-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
    sessionStorage.setItem(storageKey, generated);
    return generated;
  } catch {
    return `cli-${Math.random().toString(36).slice(2, 10)}`;
  }
}

/**
 * 簡易種子隨機數產生器 (LCG)
 * 確保同房號的兩名好友洗出 100% 相同題序與題組
 */
function createSeededRandom(seed: number) {
  let s = Math.abs(seed) % 2147483647;
  if (s <= 0) s = 1234567;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * 處理《物理試試看》對戰與單人計時測驗狀態機之 Custom Hook
 * 包含：10 題組卷邏輯（涵蓋 1~3 星全題庫）、2 分鐘直尺倒數計時、速度加成計分、
 * 跨手機房間即時同步（含結算後等待對手完賽）與 Bot 對戰模擬。
 *
 * @param options UseQuizSessionOptions
 * @returns 測驗狀態與操作控制方法
 */
export function useQuizSession({ onQuizCompleted }: UseQuizSessionOptions) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mode, setMode] = useState<GameMode>('bot_pk');
  const [playerNickname, setPlayerNicknameState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_NICKNAME_KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [realOpponentName, setRealOpponentName] = useState<string | null>(null);
  const [hasRealOpponent, setHasRealOpponent] = useState<boolean>(false);
  const [opponentCurrentIndex, setOpponentCurrentIndex] = useState<number>(0);
  const [opponentFinished, setOpponentFinished] = useState<boolean>(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string>('g11-ch1');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(1);

  const [questions, setQuestions] = useState<PhysicsQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(MAX_SECONDS_PER_QUESTION);
  const [attempts, setAttempts] = useState<QuestionAttempt[]>([]);

  // 作答瞬間的視覺回饋狀態
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [lastScoreDelta, setLastScoreDelta] = useState<number | null>(null);

  const [playerScore, setPlayerScore] = useState<number>(0);
  const [botScore, setBotScore] = useState<number>(0);
  const [botCorrectCount, setBotCorrectCount] = useState<number>(0);
  const [quizSummary, setQuizSummary] = useState<QuizSummary | null>(null);

  const questionStartTimeRef = useRef<number>(Date.now());
  const transitionTimerRef = useRef<number | null>(null);
  const retryConfigRef = useRef<QuizSummary['retryConfig']>(undefined);
  const hasRealOpponentRef = useRef<boolean>(false);
  const realOpponentNameRef = useRef<string | null>(null);
  const realOpponentScoreRef = useRef<number>(0);
  const realOpponentCorrectRef = useRef<number>(0);
  const opponentCurrentIndexRef = useRef<number>(0);
  const opponentFinishedRef = useRef<boolean>(false);
  const latestProgressRef = useRef<{
    playerScore: number;
    correctCount: number;
    currentIndex: number;
  }>({ playerScore: 0, correctCount: 0, currentIndex: 0 });

  latestProgressRef.current = {
    playerScore,
    correctCount: attempts.filter((a) => a.isCorrect).length,
    currentIndex,
  };

  /**
   * 更新玩家暱稱並持久化至 localStorage
   */
  const setPlayerNickname = useCallback((nextName: string) => {
    setPlayerNicknameState(nextName);
    try {
      if (nextName.trim()) {
        localStorage.setItem(STORAGE_NICKNAME_KEY, nextName);
      } else {
        localStorage.removeItem(STORAGE_NICKNAME_KEY);
      }
    } catch {
      // 忽略儲存配額異常
    }
  }, []);

  /**
   * 同步當前玩家房間對戰分數並取回真人對手最新戰況
   */
  const syncRoomProgress = useCallback(
    async (
      targetRoomId: string,
      nickname: string,
      score: number,
      correctCount: number,
      index: number,
      finished: boolean
    ) => {
      try {
        const res = await fetch('/api/rooms/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId: targetRoomId,
            playerName: nickname.trim() || '玩家',
            clientId: getRoomClientId(),
            score,
            correctCount,
            currentIndex: index,
            finished,
          }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as {
          ok?: boolean;
          hasRealOpponent?: boolean;
          opponentName?: string | null;
          opponentScore?: number;
          opponentCorrectCount?: number;
          opponentCurrentIndex?: number;
          opponentFinished?: boolean;
        };
        if (data.ok && data.hasRealOpponent && data.opponentName) {
          hasRealOpponentRef.current = true;
          realOpponentNameRef.current = data.opponentName;
          realOpponentScoreRef.current = Number(data.opponentScore || 0);
          realOpponentCorrectRef.current = Number(data.opponentCorrectCount || 0);
          opponentCurrentIndexRef.current = Number(data.opponentCurrentIndex || 0);
          opponentFinishedRef.current = Boolean(data.opponentFinished);
          setHasRealOpponent(true);
          setRealOpponentName(data.opponentName);
          setBotScore(realOpponentScoreRef.current);
          setBotCorrectCount(realOpponentCorrectRef.current);
          setOpponentCurrentIndex(opponentCurrentIndexRef.current);
          setOpponentFinished(opponentFinishedRef.current);
        }
        return data;
      } catch {
        // 離線或單機環境靜默略過網路錯誤
        return null;
      }
    },
    []
  );

  const currentChapter = useMemo(
    () => CHAPTER_LIST.find((ch) => ch.id === selectedChapterId) ?? CHAPTER_LIST[0],
    [selectedChapterId]
  );

  /**
   * 根據章節與難度隨機洗牌組出 10 道練習題
   * NOTE: 採用群組保護型 Fisher-Yates 洗牌演算法，確保不會將「承上題」拆散或排在首題；
   * 並開放 1/2/3 星全難度，優先抽同章節同難度，不足 10 題再依難度距離由近到遠補齊。
   */
  const buildQuestionDeck = useCallback(
    (
      chapterId: string,
      difficulty: DifficultyLevel,
      customQuestions?: PhysicsQuestion[],
      roomId?: string
    ): PhysicsQuestion[] => {
      const rng = roomId ? createSeededRandom(parseInt(roomId, 10)) : Math.random;

      const shuffleWithDependencyGuard = (
        list: PhysicsQuestion[]
      ): PhysicsQuestion[] => {
        const groups: PhysicsQuestion[][] = [];
        for (const q of list) {
          const isFollowUp = q.stem.includes('承上題');
          if (isFollowUp && groups.length > 0) {
            groups[groups.length - 1].push(q);
          } else {
            groups.push([q]);
          }
        }
        for (let i = groups.length - 1; i > 0; i -= 1) {
          const j = Math.floor(rng() * (i + 1));
          const temp = groups[i];
          groups[i] = groups[j];
          groups[j] = temp;
        }
        return groups.flat();
      };

      if (customQuestions && customQuestions.length > 0) {
        return shuffleWithDependencyGuard(customQuestions).slice(0, 10);
      }

      const chapterObj = CHAPTER_LIST.find((c) => c.id === chapterId);
      const targetGrade = chapterObj?.grade ?? 'grade11';

      const exactMatches = shuffleWithDependencyGuard(
        QUESTION_BANK.filter(
          (q) => q.chapterId === chapterId && q.difficulty === difficulty && !q.isConceptual
        )
      );

      // 依難度距離由近到遠分層補齊同章節標準題（例如 3 星先補 2 星再補 1 星）
      const nearbyLevels = ([1, 2, 3] as DifficultyLevel[])
        .filter((d) => d !== difficulty)
        .sort((a, b) => Math.abs(a - difficulty) - Math.abs(b - difficulty));

      const sameChapterOthers = nearbyLevels.flatMap((lvl) =>
        shuffleWithDependencyGuard(
          QUESTION_BANK.filter(
            (q) => q.chapterId === chapterId && q.difficulty === lvl && !q.isConceptual
          )
        )
      );

      const sameChapterConceptFallback = shuffleWithDependencyGuard(
        QUESTION_BANK.filter(
          (q) => q.chapterId === chapterId && q.isConceptual === true
        )
      );

      const sameGradeOthers = shuffleWithDependencyGuard(
        QUESTION_BANK.filter(
          (q) =>
            q.grade === targetGrade &&
            q.chapterId !== chapterId &&
            !q.isConceptual
        )
      );

      const combined = [
        ...exactMatches,
        ...sameChapterOthers,
        ...sameChapterConceptFallback,
        ...sameGradeOthers,
      ];

      const selected = combined.slice(0, 10);
      if (selected.length > 1 && selected[0].stem.includes('承上題')) {
        const nonFollowUpIdx = selected.findIndex(
          (q) => !q.stem.includes('承上題')
        );
        if (nonFollowUpIdx > 0) {
          const temp = selected[0];
          selected[0] = selected[nonFollowUpIdx];
          selected[nonFollowUpIdx] = temp;
        }
      }
      return selected;
    },
    []
  );

  /**
   * 清理換題延遲計時器
   */
  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  /**
   * 啟動新的一局對戰或單人計時
   */
  const startQuiz = useCallback(
    (
      targetMode: GameMode,
      chapterId: string,
      difficulty: DifficultyLevel,
      customQuestions?: PhysicsQuestion[],
      roomId?: string,
      retryConfig?: QuizSummary['retryConfig']
    ) => {
      clearTransitionTimer();
      const deck = buildQuestionDeck(chapterId, difficulty, customQuestions, roomId);
      retryConfigRef.current = retryConfig;
      setMode(targetMode);
      setActiveRoomId(roomId ?? null);
      hasRealOpponentRef.current = false;
      realOpponentNameRef.current = null;
      realOpponentScoreRef.current = 0;
      realOpponentCorrectRef.current = 0;
      opponentCurrentIndexRef.current = 0;
      opponentFinishedRef.current = false;
      setHasRealOpponent(false);
      setRealOpponentName(null);
      setOpponentCurrentIndex(0);
      setOpponentFinished(false);

      setSelectedChapterId(chapterId);
      setSelectedDifficulty(difficulty);
      setQuestions(deck);
      setCurrentIndex(0);
      setRemainingSeconds(MAX_SECONDS_PER_QUESTION);
      setAttempts([]);
      setSelectedOption(null);
      setIsTransitioning(false);
      setLastScoreDelta(null);
      setPlayerScore(0);
      setBotScore(0);
      setBotCorrectCount(0);
      setQuizSummary(null);
      questionStartTimeRef.current = Date.now();
      setIsPlaying(true);
    },
    [buildQuestionDeck, clearTransitionTimer]
  );

  /**
   * 處理單題作答提交（或超時自動交卷）
   */
  const submitAnswer = useCallback(
    (optionIndex: number | null) => {
      if (!isPlaying || isTransitioning || currentIndex >= questions.length) {
        return;
      }

      setIsTransitioning(true);
      setSelectedOption(optionIndex);

      const currentQuestion = questions[currentIndex];
      const elapsedSec = Math.min(
        MAX_SECONDS_PER_QUESTION,
        Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000))
      );
      const isCorrect = optionIndex !== null && optionIndex === currentQuestion.correctIndex;

      // 基礎分 100 + 剩餘時間速度加成
      const speedBonus = Math.round((remainingSeconds / MAX_SECONDS_PER_QUESTION) * 55);
      const earnedScore = isCorrect ? 100 + speedBonus : 0;
      setLastScoreDelta(earnedScore);

      // 僅在電腦挑戰模式 (bot_pk) 下模擬 Bot 分數，room_pk 完全採真人同步成績
      const isBotMode = mode === 'bot_pk';
      const botProbMap: Record<DifficultyLevel, number> = { 1: 0.42, 2: 0.55, 3: 0.7 };
      const botCorrect =
        isBotMode &&
        ((currentIndex * 7 + currentQuestion.correctIndex * 3) % 10) / 10 <
          botProbMap[selectedDifficulty];
      const botEarnedScore = botCorrect ? 115 + ((currentIndex * 13) % 25) : 0;

      const nextPlayerScore = playerScore + earnedScore;
      const nextBotScore =
        mode === 'room_pk'
          ? realOpponentScoreRef.current
          : isBotMode
          ? botScore + botEarnedScore
          : 0;
      const nextBotCorrectCount =
        mode === 'room_pk'
          ? realOpponentCorrectRef.current
          : isBotMode
          ? botCorrectCount + (botCorrect ? 1 : 0)
          : 0;

      setPlayerScore(nextPlayerScore);
      if (isBotMode) {
        setBotScore(nextBotScore);
        setBotCorrectCount(nextBotCorrectCount);
      }

      const newAttempt: QuestionAttempt = {
        question: currentQuestion,
        selectedIndex: optionIndex,
        isCorrect,
        timeSpentSec: elapsedSec,
        earnedScore,
        botEarnedScore: isBotMode ? botEarnedScore : 0,
        botCorrect: isBotMode ? botCorrect : false,
      };

      const updatedAttempts = [...attempts, newAttempt];
      setAttempts(updatedAttempts);
      const nextPlayerCorrectCount = updatedAttempts.filter((a) => a.isCorrect).length;
      const isLastQuestion = currentIndex + 1 >= questions.length;

      if (mode === 'room_pk' && activeRoomId) {
        void syncRoomProgress(
          activeRoomId,
          playerNickname,
          nextPlayerScore,
          nextPlayerCorrectCount,
          currentIndex + 1,
          isLastQuestion
        );
      }

      // 答對停留 800ms，答錯停留 1400ms 讓玩家看清正確選項
      const transitionDelayMs = isCorrect ? 800 : 1400;
      clearTransitionTimer();
      transitionTimerRef.current = window.setTimeout(() => {
        transitionTimerRef.current = null;
        if (!isLastQuestion) {
          setCurrentIndex((prev) => prev + 1);
          setRemainingSeconds(MAX_SECONDS_PER_QUESTION);
          setSelectedOption(null);
          setLastScoreDelta(null);
          setIsTransitioning(false);
          questionStartTimeRef.current = Date.now();
        } else {
          const chapterObj =
            CHAPTER_LIST.find((ch) => ch.id === selectedChapterId) ?? CHAPTER_LIST[0];

          const finalBotScore =
            mode === 'room_pk' ? realOpponentScoreRef.current : nextBotScore;
          const finalBotCorrect =
            mode === 'room_pk' ? realOpponentCorrectRef.current : nextBotCorrectCount;
          const resolvedOpponentName =
            mode === 'room_pk'
              ? realOpponentNameRef.current ||
                (activeRoomId ? `好友玩家 (#${activeRoomId})` : '好友玩家')
              : chapterObj.botName;

          const isVictory = nextPlayerScore >= finalBotScore;

          const summary: QuizSummary = {
            mode,
            playerNickname: playerNickname.trim() || '挑戰者',
            playerScore: nextPlayerScore,
            playerCorrectCount: nextPlayerCorrectCount,
            totalQuestions: questions.length,
            botName: resolvedOpponentName,
            botScore: finalBotScore,
            botCorrectCount: finalBotCorrect,
            isVictory,
            chapterId: selectedChapterId,
            difficulty: selectedDifficulty,
            attempts: updatedAttempts,
            completedAt: new Date().toLocaleTimeString('zh-TW', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            roomId: activeRoomId,
            opponentFinished: mode === 'room_pk' ? opponentFinishedRef.current : true,
            retryConfig: retryConfigRef.current,
          };

          onQuizCompleted(updatedAttempts, nextPlayerScore, { mode, isVictory });
          setIsPlaying(false);
          setIsTransitioning(false);
          setQuizSummary(summary);
        }
      }, transitionDelayMs);
    },
    [
      activeRoomId,
      attempts,
      botCorrectCount,
      botScore,
      clearTransitionTimer,
      currentIndex,
      isPlaying,
      isTransitioning,
      mode,
      onQuizCompleted,
      playerNickname,
      playerScore,
      questions,
      remainingSeconds,
      selectedChapterId,
      selectedDifficulty,
      syncRoomProgress,
    ]
  );

  // 好友房間對戰即時比分同步輪詢（每 1.2 秒與伺服器同步一次）
  useEffect(() => {
    if (!isPlaying || mode !== 'room_pk' || !activeRoomId) {
      return;
    }

    const triggerSync = () => {
      const { playerScore: pScore, correctCount, currentIndex: idx } = latestProgressRef.current;
      void syncRoomProgress(activeRoomId, playerNickname, pScore, correctCount, idx, false);
    };

    triggerSync();
    const timer = window.setInterval(triggerSync, 1200);
    return () => window.clearInterval(timer);
  }, [isPlaying, mode, activeRoomId, playerNickname, syncRoomProgress]);

  // 好友對戰結算頁：若對手尚未完賽，持續同步直到對手交卷更新最終勝負
  useEffect(() => {
    if (
      isPlaying ||
      !quizSummary ||
      quizSummary.mode !== 'room_pk' ||
      !quizSummary.roomId ||
      quizSummary.opponentFinished
    ) {
      return;
    }

    const roomId = quizSummary.roomId;
    const pollFinalResult = async () => {
      const data = await syncRoomProgress(
        roomId,
        quizSummary.playerNickname,
        quizSummary.playerScore,
        quizSummary.playerCorrectCount,
        quizSummary.totalQuestions,
        true
      );
      if (!data || !data.ok || !data.hasRealOpponent || !data.opponentName) {
        return;
      }

      const nextOpponentScore = Number(data.opponentScore || 0);
      const nextOpponentCorrect = Number(data.opponentCorrectCount || 0);
      const nextFinished = Boolean(data.opponentFinished);
      const nextOpponentName = data.opponentName;

      setQuizSummary((prev) => {
        if (!prev || prev.roomId !== roomId) return prev;
        if (
          prev.botName === nextOpponentName &&
          prev.botScore === nextOpponentScore &&
          prev.botCorrectCount === nextOpponentCorrect &&
          prev.opponentFinished === nextFinished
        ) {
          return prev;
        }
        return {
          ...prev,
          botName: nextOpponentName,
          botScore: nextOpponentScore,
          botCorrectCount: nextOpponentCorrect,
          opponentFinished: nextFinished,
          isVictory: prev.playerScore >= nextOpponentScore,
        };
      });
    };

    void pollFinalResult();
    const timer = window.setInterval(() => {
      void pollFinalResult();
    }, 1500);
    return () => window.clearInterval(timer);
  }, [isPlaying, quizSummary, syncRoomProgress]);

  // 每秒倒數計時器
  useEffect(() => {
    if (!isPlaying || isTransitioning) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          submitAnswer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPlaying, isTransitioning, submitAnswer]);

  // 元件卸載時清除延遲計時器
  useEffect(() => {
    return () => clearTransitionTimer();
  }, [clearTransitionTimer]);

  /**
   * 離開結算或中止測驗返回主畫面
   */
  const exitQuiz = useCallback(() => {
    clearTransitionTimer();
    setIsPlaying(false);
    setQuizSummary(null);
    setIsTransitioning(false);
  }, [clearTransitionTimer]);

  return {
    isPlaying,
    mode,
    activeRoomId,
    realOpponentName,
    hasRealOpponent,
    opponentCurrentIndex,
    opponentFinished,
    playerNickname,
    setPlayerNickname,
    selectedChapterId,
    setSelectedChapterId,
    selectedDifficulty,
    setSelectedDifficulty,
    currentChapter,
    questions,
    currentQuestion: questions[currentIndex] ?? null,
    currentIndex,
    remainingSeconds,
    maxSeconds: MAX_SECONDS_PER_QUESTION,
    selectedOption,
    isTransitioning,
    lastScoreDelta,
    playerScore,
    botScore,
    botCorrectCount,
    quizSummary,
    startQuiz,
    submitAnswer,
    exitQuiz,
  };
}
