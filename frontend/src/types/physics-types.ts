/**
 * 物理大PK - 108課綱高中三年段物理複習測驗型別定義
 */

/** 高中年段代碼：高一必修、高二選修、高三選修 */
export type GradeLevel = 'grade10' | 'grade11' | 'grade12';

/** 難度星級：聚焦高中複習（1=★基礎, 2=★★段考；保留 3 型別相容舊題庫） */
export type DifficultyLevel = 1 | 2 | 3;

/** 遊戲與學習模式 */
export type GameMode = 'bot_pk' | 'solo_timer' | 'room_pk' | 'mistake_drill';

/** 應用程式主要導覽分頁 */
export type ActiveTab = 'lobby' | 'concepts' | 'weakness' | 'leaderboard';

/** 測驗題型分類（供結算重試保留原設定） */
export type QuizTypeKey = 'standard' | 'conceptual' | 'gsat' | 'mistake';

/**
 * 108 課綱章節定義
 */
export interface ChapterInfo {
  id: string;
  grade: GradeLevel;
  gradeLabel: string;
  volumeTitle: string;
  code: string;
  title: string;
  botName: string;
  botTitle: string;
  description: string;
}

/**
 * 觀念黑板圖解類型（34 堂課 1 對 1 專屬圖解）
 */
export type DiagramType =
  // 高一必修 (7)
  | 'quark_four_forces'
  | 'g10_newton_inertia'
  | 'kepler_laws'
  | 'oersted_right_hand'
  | 'em_induction_spectrum'
  | 'photoelectric_quantum'
  | 'energy_mass_equivalence'
  // 高二選修 I・II (17)
  | 'si_dimensions'
  | 'uncertainty_ruler'
  | 'displacement_numberline'
  | 'uniform_accel_vt'
  | 'vertical_throw_symmetry'
  | 'horizontal_projectile'
  | 'projectile_parabola'
  | 'circular_shm_projection'
  | 'newton_force_block'
  | 'friction_elevator'
  | 'gravity_field_profile'
  | 'satellite_binary_energy'
  | 'impulse_momentum_cm'
  | 'vertical_circle_energy'
  | 'collision_1d'
  | 'kinetic_theory_gas'
  | 'thermo_pv_first_law'
  // 高三選修 III~V (10)
  | 'standing_wave_string'
  | 'wave_doppler'
  | 'optics_refract_lens'
  | 'double_slit_diffraction'
  | 'electrostatics_capacitor'
  | 'dc_circuit_bridge'
  | 'lorentz_cyclotron'
  | 'electromagnetic_induction'
  | 'bohr_energy_levels'
  | 'nuclear_binding_halflife';

/**
 * 觀念教學 (黑板課堂) 資料結構
 */
export interface ConceptLesson {
  id: string;
  chapterId: string;
  grade: GradeLevel;
  code: string;
  title: string;
  diagramType: DiagramType;
  boardCaption: string;
  summaryHtmlParts: {
    text: string;
    bold?: boolean;
  }[];
  formulas: string[];
  keyTakeaway: string;
}

/**
 * 物理測驗題目結構
 */
export interface PhysicsQuestion {
  id: string;
  chapterId: string;
  chapterCode: string;
  chapterTitle: string;
  grade: GradeLevel;
  difficulty: DifficultyLevel;
  stem: string;
  options: string[];
  correctIndex: number;
  /** 簡短秒殺詳解（完美呈現圖 7 的黃底重點風格） */
  shortExplanation: string;
  /** 核心公式（用於進階展開詳解） */
  keyFormula: string;
  /** 完整推導步驟 */
  detailedSteps: string;
  /** 常見易錯陷阱 */
  commonTrap: string;
  /** 是否為純觀念釐清題（零計算，純考定義、物理圖像與因果關係） */
  isConceptual?: boolean;
  /** 歷屆學測年度（例如 110 ~ 115 代表 110~115 學年度學測自然科物理考題） */
  gsatYear?: number;
  /** 對應觀念黑板 ID */
  conceptId?: string;
}

/**
 * 單題作答紀錄
 */
export interface QuestionAttempt {
  question: PhysicsQuestion;
  selectedIndex: number | null;
  isCorrect: boolean;
  timeSpentSec: number;
  earnedScore: number;
  botEarnedScore: number;
  botCorrect: boolean;
}

/**
 * 單次對戰或練習總結
 */
export interface QuizSummary {
  mode: GameMode;
  playerNickname: string;
  playerScore: number;
  playerCorrectCount: number;
  totalQuestions: number;
  botName: string;
  botScore: number;
  botCorrectCount: number;
  isVictory: boolean;
  chapterId: string;
  difficulty: DifficultyLevel;
  attempts: QuestionAttempt[];
  completedAt: string;
  /** 房間 ID（僅好友對戰模式） */
  roomId?: string | null;
  /** 真人對手是否已完成全部題目（好友對戰結算同步用） */
  opponentFinished?: boolean;
  /** 保留原始題型與篩選設定，確保再練一次不會跳題型 */
  retryConfig?: {
    quizType: QuizTypeKey;
    gsatFilter?: 'all' | 'chapter' | 115 | 114 | 113 | 112 | 111 | 110;
  };
}

/**
 * 對戰勝負場次統計
 */
export interface PkBattleStats {
  totalMatches: number;
  wins: number;
}

/**
 * 弱點分析矩陣單一儲存格統計資料 (章節 × 難度)
 */
export interface MatrixCellStat {
  chapterId: string;
  difficulty: DifficultyLevel;
  totalAttempts: number;
  correctAttempts: number;
}

/**
 * 錯題本收錄項目
 */
export interface MistakeItem {
  questionId: string;
  chapterId: string;
  difficulty: DifficultyLevel;
  lastSelectedIndex: number | null;
  wrongCount: number;
  lastUpdated: string;
}
