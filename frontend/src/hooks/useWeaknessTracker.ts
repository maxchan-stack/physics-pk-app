import { useCallback, useEffect, useState } from 'react';
import {
  DifficultyLevel,
  GameMode,
  MatrixCellStat,
  MistakeItem,
  PkBattleStats,
  QuestionAttempt,
} from '../types/physics-types';

const STORAGE_MATRIX_KEY = 'physics_pk_matrix_v3';
const STORAGE_MISTAKES_KEY = 'physics_pk_mistakes_v3';
const STORAGE_BEST_SCORE_KEY = 'physics_pk_best_score_v3';
const STORAGE_BATTLE_STATS_KEY = 'physics_pk_battle_stats_v3';

const EMPTY_BATTLE_STATS: PkBattleStats = {
  totalMatches: 0,
  wins: 0,
};

/**
 * 管理「章節 × 難度」弱點分析矩陣、錯題本與對戰勝率統計之 Custom Hook
 * NOTE: 改為真實記錄使用者作答歷程，錯題重練答對後將自動移出錯題本
 *
 * @returns 弱點統計查詢、作答紀錄寫入、錯題本與清空操作方法
 */
export function useWeaknessTracker() {
  const [matrixMap, setMatrixMap] = useState<Record<string, MatrixCellStat>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MATRIX_KEY);
      if (saved) {
        return JSON.parse(saved) as Record<string, MatrixCellStat>;
      }
    } catch {
      // 讀取失敗時以空紀錄開始
    }
    return {};
  });

  const [mistakes, setMistakes] = useState<MistakeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MISTAKES_KEY);
      if (saved) {
        return JSON.parse(saved) as MistakeItem[];
      }
    } catch {
      // 讀取失敗時以空清單開始
    }
    return [];
  });

  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BEST_SCORE_KEY);
      if (saved) {
        const parsed = Number(saved);
        if (Number.isFinite(parsed) && parsed > 0) {
          return parsed;
        }
      }
    } catch {
      // 忽略讀取錯誤
    }
    return 0;
  });

  const [pkStats, setPkStats] = useState<PkBattleStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BATTLE_STATS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<PkBattleStats>;
        return {
          totalMatches: Number(parsed.totalMatches) || 0,
          wins: Number(parsed.wins) || 0,
        };
      }
    } catch {
      // 忽略讀取錯誤
    }
    return EMPTY_BATTLE_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MATRIX_KEY, JSON.stringify(matrixMap));
    } catch {
      // 忽略儲存配額異常
    }
  }, [matrixMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MISTAKES_KEY, JSON.stringify(mistakes));
    } catch {
      // 忽略儲存配額異常
    }
  }, [mistakes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BEST_SCORE_KEY, String(bestScore));
    } catch {
      // 忽略儲存配額異常
    }
  }, [bestScore]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BATTLE_STATS_KEY, JSON.stringify(pkStats));
    } catch {
      // 忽略儲存配額異常
    }
  }, [pkStats]);

  /**
   * 查詢特定「章節 × 難度」格子的統計數據
   */
  const getCellStat = useCallback(
    (chapterId: string, difficulty: DifficultyLevel): MatrixCellStat => {
      const key = `${chapterId}_${difficulty}`;
      return (
        matrixMap[key] ?? {
          chapterId,
          difficulty,
          totalAttempts: 0,
          correctAttempts: 0,
        }
      );
    },
    [matrixMap]
  );

  /**
   * 將單次測驗的所有作答結果寫入弱點矩陣、錯題本、歷史最高分與對戰勝率
   */
  const recordAttempts = useCallback(
    (
      attempts: QuestionAttempt[],
      finalScore?: number,
      meta?: { mode?: GameMode; isVictory?: boolean }
    ) => {
      if (typeof finalScore === 'number' && Number.isFinite(finalScore)) {
        setBestScore((prev) => (finalScore > prev ? finalScore : prev));
      }

      if (meta?.mode === 'bot_pk' || meta?.mode === 'room_pk') {
        setPkStats((prev) => ({
          totalMatches: prev.totalMatches + 1,
          wins: prev.wins + (meta.isVictory ? 1 : 0),
        }));
      }

      setMatrixMap((prev) => {
        const next = { ...prev };
        for (const item of attempts) {
          const key = `${item.question.chapterId}_${item.question.difficulty}`;
          const existing = next[key] ?? {
            chapterId: item.question.chapterId,
            difficulty: item.question.difficulty,
            totalAttempts: 0,
            correctAttempts: 0,
          };
          next[key] = {
            ...existing,
            totalAttempts: existing.totalAttempts + 1,
            correctAttempts: existing.correctAttempts + (item.isCorrect ? 1 : 0),
          };
        }
        return next;
      });

      setMistakes((prev) => {
        const nextList = [...prev];
        const today = new Date().toISOString().slice(0, 10);

        for (const item of attempts) {
          const existingIndex = nextList.findIndex(
            (m) => m.questionId === item.question.id
          );

          if (item.isCorrect) {
            // 答對即代表已攻克該錯題，自動自錯題本移除
            if (existingIndex >= 0) {
              nextList.splice(existingIndex, 1);
            }
          } else if (existingIndex >= 0) {
            nextList[existingIndex] = {
              ...nextList[existingIndex],
              lastSelectedIndex: item.selectedIndex,
              wrongCount: nextList[existingIndex].wrongCount + 1,
              lastUpdated: today,
            };
          } else {
            nextList.unshift({
              questionId: item.question.id,
              chapterId: item.question.chapterId,
              difficulty: item.question.difficulty,
              lastSelectedIndex: item.selectedIndex,
              wrongCount: 1,
              lastUpdated: today,
            });
          }
        }
        return nextList;
      });
    },
    []
  );

  /**
   * 從錯題本移除已熟練題目
   */
  const removeMistake = useCallback((questionId: string) => {
    setMistakes((prev) => prev.filter((m) => m.questionId !== questionId));
  }, []);

  /**
   * 清空全部弱點統計、錯題本、最高分與對戰勝率紀錄
   */
  const clearAllStats = useCallback(() => {
    setMatrixMap({});
    setMistakes([]);
    setBestScore(0);
    setPkStats(EMPTY_BATTLE_STATS);
  }, []);

  return {
    matrixMap,
    mistakes,
    bestScore,
    pkStats,
    getCellStat,
    recordAttempts,
    removeMistake,
    clearAllStats,
  };
}
