/**
 * 108 課綱高中三年段物理章節、34 課觀念黑板與 540 題完整題庫匯總中心
 * 包含：各章節 20 道標準精選題 + 每章各 10 道純觀念題 + 近 6 年（110~115）學測物理 60 題
 */
import {
  ChapterInfo,
  ConceptLesson,
  GradeLevel,
  PhysicsQuestion,
} from '../types/physics-types';
import { QUESTIONS_GRADE_10 } from './questions-grade10';
import { QUESTIONS_GRADE_11_PART1 } from './questions-grade11-part1';
import { QUESTIONS_GRADE_11_PART2 } from './questions-grade11-part2';
import { QUESTIONS_GRADE_12_PART1 } from './questions-grade12-part1';
import { QUESTIONS_GRADE_12_PART2 } from './questions-grade12-part2';
import { CONCEPT_QUESTIONS_GRADE_10 } from './questions-concepts-g10';
import { CONCEPT_QUESTIONS_GRADE_11 } from './questions-concepts-g11';
import { CONCEPT_QUESTIONS_GRADE_12 } from './questions-concepts-g12';
import { GSAT_PAST6YEARS_QUESTIONS } from './questions-gsat-past6years';

/** 年段標籤與副標題設定 */
export const GRADE_CONFIG: Record<
  GradeLevel,
  { label: string; shortLabel: string; subtitle: string; badge: string }
> = {
  grade10: {
    label: '高一必修物理',
    shortLabel: '高一必修',
    subtitle: '高中必修物理（學測自然科核心・含 40 題純觀念與 60 題近 6 年學測題）',
    badge: '學測核心・180 題',
  },
  grade11: {
    label: '高二選修 I・II',
    shortLabel: '高二選修',
    subtitle: '高中選修物理 I・II（力學與熱學・含 70 題純觀念題）的對戰練習',
    badge: '力學熱學・210 題',
  },
  grade12: {
    label: '高三選修 III~V',
    shortLabel: '高三選修',
    subtitle: '高中選修物理 III~V（光波・電磁・近代・含 50 題純觀念題）的對戰練習',
    badge: '分科測驗・150 題',
  },
};

/** 108 課綱三年段 16 章節清單（16 章基礎與純觀念題 480 題 + 近 6 年學測歷屆 60 題，全庫共 540 題） */
export const CHAPTER_LIST: ChapterInfo[] = [
  // ================= 高二：選修物理 I & II (7 章，共 140 題) =================
  {
    id: 'g11-ch1',
    grade: 'grade11',
    gradeLabel: '高二選修 I',
    volumeTitle: '選修物理 I（力學一）',
    code: 'Ch1',
    title: '測量與不確定度',
    botName: '法拉第 Bot',
    botTitle: '實驗物理宗師',
    description: 'SI 國際單位制、因次分析、A類與B類不確定度、有效數字與單位換算',
  },
  {
    id: 'g11-ch2',
    grade: 'grade11',
    gradeLabel: '高二選修 I',
    volumeTitle: '選修物理 I（力學一）',
    code: 'Ch2',
    title: '直線運動',
    botName: '伽利略 Bot',
    botTitle: '運動學先驅',
    description: '位移與路徑長、平均與瞬時速度、等加速度運動三大公式、自由落體與運動函數圖',
  },
  {
    id: 'g11-ch3',
    grade: 'grade11',
    gradeLabel: '高二選修 I',
    volumeTitle: '選修物理 I（力學一）',
    code: 'Ch3',
    title: '平面運動',
    botName: '惠更斯 Bot',
    botTitle: '擺鐘與圓周大師',
    description: '平面向量合成與分解、水平拋射、斜向拋射、等速率圓周運動與簡諧運動 (SHM)',
  },
  {
    id: 'g11-ch4',
    grade: 'grade11',
    gradeLabel: '高二選修 I',
    volumeTitle: '選修物理 I（力學一）',
    code: 'Ch4',
    title: '牛頓運動定律',
    botName: '牛頓 Bot',
    botTitle: '古典力學之父',
    description: '慣性定律、F=ma 連接體問題、作用與反作用力、動靜摩擦力、視重與假想力',
  },
  {
    id: 'g11-ch5',
    grade: 'grade11',
    gradeLabel: '高二選修 I',
    volumeTitle: '選修物理 I（力學一）',
    code: 'Ch5',
    title: '萬有引力定律',
    botName: '克卜勒 Bot',
    botTitle: '行星軌道立法者',
    description: '萬有引力定律、行星密度與表面重力加速度、人造衛星軌道速率與克卜勒三大定律',
  },
  {
    id: 'g11-ch6',
    grade: 'grade11',
    gradeLabel: '高二選修 II',
    volumeTitle: '選修物理 II（力學二）',
    code: 'Ch6',
    title: '動量、功與力學能',
    botName: '焦耳 Bot',
    botTitle: '能量守恆守門人',
    description: '衝量與動量守恆、質心運動、功能定理、重力位能與彈力位能、一維與二維彈性碰撞',
  },
  {
    id: 'g11-ch7',
    grade: 'grade11',
    gradeLabel: '高二選修 II',
    volumeTitle: '選修物理 II（熱學）',
    code: 'Ch7',
    title: '熱學與氣體動力論',
    botName: '波茲曼 Bot',
    botTitle: '統計熱力學宗師',
    description: '理想氣體方程式 PV=nRT、氣體分子方均根速率、單原子氣體內能與熱力學第一定律',
  },

  // ================= 高一：必修物理 (4 章，共 80 題) =================
  {
    id: 'g10-ch1',
    grade: 'grade10',
    gradeLabel: '高一必修',
    volumeTitle: '高一必修物理（學測範圍）',
    code: 'Ch1',
    title: '科學方法與物質組成',
    botName: '拉塞福 Bot',
    botTitle: '原子核探險家',
    description: 'SI 基本單位、原子與原子核結構、夸克與基本粒子、自然界四大基本交互作用',
  },
  {
    id: 'g10-ch2',
    grade: 'grade10',
    gradeLabel: '高一必修',
    volumeTitle: '高一必修物理（學測範圍）',
    code: 'Ch2',
    title: '物體的運動與天體',
    botName: '牛頓 Bot',
    botTitle: '古典力學之父',
    description: '生活中常見的運動、牛頓三大運動定律觀念判讀、克卜勒行星運動三大定律與萬有引力',
  },
  {
    id: 'g10-ch3',
    grade: 'grade10',
    gradeLabel: '高一必修',
    volumeTitle: '高一必修物理（學測範圍）',
    code: 'Ch3',
    title: '電與磁的統一',
    botName: '法拉第 Bot',
    botTitle: '電磁學巨擘',
    description: '庫侖靜電力、厄斯特電流磁效應、安培右手定則、法拉第電磁感應與冷次定律、電磁波譜',
  },
  {
    id: 'g10-ch4',
    grade: 'grade10',
    gradeLabel: '高一必修',
    volumeTitle: '高一必修物理（學測範圍）',
    code: 'Ch4',
    title: '能量與量子現象',
    botName: '愛因斯坦 Bot',
    botTitle: '近代物理領航員',
    description: '力學能守恆、熱功轉換、質能互換 E=mc²、黑體輻射、光電效應、物質波與氫原子光譜',
  },

  // ================= 高三：選修物理 III ~ V (5 章，共 100 題) =================
  {
    id: 'g12-ch1',
    grade: 'grade12',
    gradeLabel: '高三選修 III',
    volumeTitle: '選修物理 III（波動與聲波）',
    code: 'Ch1',
    title: '波動、駐波與都卜勒',
    botName: '都卜勒 Bot',
    botTitle: '聲光頻移大師',
    description: '週期波波速、繩波反射與透射、弦上駐波與空氣柱駐波、聲波共鳴與都卜勒效應計算',
  },
  {
    id: 'g12-ch2',
    grade: 'grade12',
    gradeLabel: '高三選修 III',
    volumeTitle: '選修物理 III（光學）',
    code: 'Ch2',
    title: '幾何光學與物理光學',
    botName: '楊氏 Bot',
    botTitle: '光的干涉先驅',
    description: '司乃耳折射定律、全反射與光纖、薄透鏡成像公式、楊氏雙狹縫干涉與單狹縫繞射條紋',
  },
  {
    id: 'g12-ch3',
    grade: 'grade12',
    gradeLabel: '高三選修 IV',
    volumeTitle: '選修物理 IV（靜電與電路）',
    code: 'Ch3',
    title: '靜電學與直流電路',
    botName: '庫侖 Bot',
    botTitle: '靜電場解析師',
    description: '電場與電力線、電位能與電位差、平行板電容器、歐姆定律、克希荷夫定律與惠司同電橋',
  },
  {
    id: 'g12-ch4',
    grade: 'grade12',
    gradeLabel: '高三選修 V',
    volumeTitle: '選修物理 V（電磁現象二）',
    code: 'Ch4',
    title: '電流磁效應與電磁感應',
    botName: '馬克士威 Bot',
    botTitle: '電磁方程統合者',
    description: '畢奧-沙伐定律、載流導線磁力 F=ILB、帶電質點在磁場中圓周運動、應電動勢 ε=-NΔΦ/Δt',
  },
  {
    id: 'g12-ch5',
    grade: 'grade12',
    gradeLabel: '高三選修 V',
    volumeTitle: '選修物理 V（量子與近代）',
    code: 'Ch5',
    title: '量子現象與原子結構',
    botName: '波耳 Bot',
    botTitle: '量子力學哥本哈根宗師',
    description: '愛因斯坦光電效應方程式、康普頓效應、德布羅意物質波、波耳氫原子能階與放射性半衰期',
  },
];

/**
 * 觀念教學 (黑板課堂) 完整 34 課列表（高一 7 課 + 高二 17 課 + 高三 10 課）
 * 每堂課均具備 1 對 1 專屬教室黑板 SVG 圖解、核心文字與便利貼公式整理
 */
export const CONCEPT_LESSONS: ConceptLesson[] = [
  // ================= 高一：必修物理 (7 課) =================
  {
    id: 'c-g10-1-1',
    chapterId: 'g10-ch1',
    grade: 'grade10',
    code: '高一 1-1',
    title: '物質的夸克組成與四大基本交互作用',
    diagramType: 'quark_four_forces',
    boardCaption: '質子 = uud (+1e)，中子 = udd (0)；強核力束縛原子核，弱核力主導 β 衰變',
    summaryHtmlParts: [
      { text: '基本粒子標準模型', bold: true },
      { text: '中，夸克與輕子（如電子、微中子）為不可分割的基本粒子。核子間靠交換膠子產生極強的' },
      { text: '強核力', bold: true },
      { text: '，克服質子間靜電斥力形成穩定原子核。' },
    ],
    formulas: [
      '上夸克 u = +⅔ e, 下夸克 d = -⅓ e ⇒ 質子 p (uud), 中子 n (udd)',
      '核尺度強度排序：強核力 (1) > 電磁力 (10⁻²) > 弱核力 (10⁻⁷) > 重力 (10⁻³⁸)',
      '力程範圍：重力與電磁力為無窮遠；強核力 (~10⁻¹⁵ m) 與弱核力 (~10⁻¹⁸ m) 為短程力',
    ],
    keyTakeaway: '看到「β 衰變（中子變質子放出電子與反微中子）」必選「弱核力」！',
  },
  {
    id: 'c-g10-2-2',
    chapterId: 'g10-ch2',
    grade: 'grade10',
    code: '高一 2-1',
    title: '直線運動圖形與牛頓三大定律',
    diagramType: 'g10_newton_inertia',
    boardCaption: '合力為 0 時物體保持原運動狀態（慣性）；作用力與反作用力作用在不同物體上，絕對不可相互抵消',
    summaryHtmlParts: [
      { text: '牛頓第一定律（慣性）', bold: true },
      { text: '指出物體有維持原速度大小與方向的傾向。區分力平衡與' },
      { text: '作用力與反作用力', bold: true },
      { text: '的唯一鐵則：前者作用於「同一物體」且可互相抵消；後者作用於「不同兩物體」，大小必相等、方向必相反。' },
    ],
    formulas: [
      'x-t 圖斜率 = 瞬時速度 ｜ v-t 圖斜率 = 加速度，圖下面積 = 位移',
      '牛頓第二定律 F_net = m a （雨滴達終端速度時合力為 0，作等速下降）',
      '電梯向上加速 a：磅秤視重 N = m(g + a)（超重）；向下加速：N = m(g - a)（失重）',
    ],
    keyTakeaway: '大貨車與小轎車相撞瞬間，兩車彼此所受撞擊力大小「1:1 完全相等」（牛頓第三定律）！',
  },
  {
    id: 'c-g10-2-1',
    chapterId: 'g10-ch2',
    grade: 'grade10',
    code: '高一 2-2',
    title: '克卜勒行星運動三大定律',
    diagramType: 'kepler_laws',
    boardCaption: '① 橢圓軌道定律、② 等面積定律（近日快、遠日慢）、③ 週期定律 (a³/T² = 定值)',
    summaryHtmlParts: [
      { text: '克卜勒三大定律', bold: true },
      { text: '由第谷觀測數據歸納而出，後由牛頓以萬有引力與角動量守恆完整證明。注意第三定律 a³/T² = 定值，僅適用於' },
      { text: '繞同一中心天體公轉', bold: true },
      { text: '的行星或衛星群！' },
    ],
    formulas: [
      '橢圓半長軸 a = (r_近日 + r_遠日) / 2',
      '等面積定律（近遠日點速率比）：r_近日 · v_近日 = r_遠日 · v_遠日',
      '週期定律：a₁³ / T₁² = a₂³ / T₂² = G M_中心 / (4π²)',
    ],
    keyTakeaway: '地球繞太陽 (1 AU, 1 年) 與小行星繞太陽可直接列 a³ = T²；但月球繞地球不能跟地球繞太陽混用！',
  },
  {
    id: 'c-g10-3-1',
    chapterId: 'g10-ch3',
    grade: 'grade10',
    code: '高一 3-1',
    title: '庫侖靜電力與電流磁效應',
    diagramType: 'oersted_right_hand',
    boardCaption: '厄斯特發現電流磁效應（電生磁）：安培右手大拇指指電流 I，四指環繞即磁場 B 方向',
    summaryHtmlParts: [
      { text: '安培右手定則', bold: true },
      { text: '用來判定電流周圍產生的磁場方向，磁針 N 極受力偏向與該處合磁場方向相同。兩條平行載流長直導線若通以' },
      { text: '同方向電流則互相吸引', bold: true },
      { text: '、反方向電流則互相排斥。' },
    ],
    formulas: [
      '庫侖靜電力 F = k |q₁ q₂| / r² （電荷量僅能是基本電荷 e = 1.6×10⁻¹⁹ C 的整數倍）',
      '平行導線磁力：同向相吸、反向相斥（與磁極同名相斥規則相反，切勿混淆！）',
      '正下方磁針判向：電流由南向北 → 右手大拇指朝北，正下方四指指向「西」偏轉',
    ],
    keyTakeaway: '北半球地理北極是「地磁 S 極」，且地磁磁力線具有「向北且向下進入地表」的分量！',
  },
  {
    id: 'c-g10-3-2',
    chapterId: 'g10-ch3',
    grade: 'grade10',
    code: '高一 3-2',
    title: '電磁感應、變壓器與電磁波譜',
    diagramType: 'em_induction_spectrum',
    boardCaption: '法拉第發現磁生電（冷次定律來拒去留）；電磁波橫波在真空均以光速 c = fλ 傳播',
    summaryHtmlParts: [
      { text: '法拉第電磁感應', bold: true },
      { text: '只有在穿過線圈的「磁通量發生變化」時才會產生感應電流，且感應磁場必定反抗原本磁通量的變化（冷次定律）。馬克士威統合電磁理論並預言' },
      { text: '電磁波在真空以光速 c 傳播', bold: true },
      { text: '。' },
    ],
    formulas: [
      '電磁波真空波速 c = f λ = 3 × 10⁸ m/s （橫波：E ⊥ B ⊥ 傳播方向）',
      '頻率與光子能量排序：γ 射線 > X 射線 > 紫外線 > 可見光 > 紅外線 > 微波 > 無線電波',
      '理想變壓器（僅適用交流電 AC）：V₁ / V₂ = N₁ / N₂，高壓輸電減少線損 P_損 = I² R',
    ],
    keyTakeaway: '理想變壓器絕不適用於穩恆直流電 (DC)！高壓輸電之所以省電是因為電流 I 減小，讓 I²R 熱損大幅降低。',
  },
  {
    id: 'c-g10-4-1',
    chapterId: 'g10-ch4',
    grade: 'grade10',
    code: '高一 4-1',
    title: '光電效應、波粒二象性與原子光譜',
    diagramType: 'photoelectric_quantum',
    boardCaption: '光量子能量 E = hf：只有入射光頻率 f ≥ 底限頻率 f₀ 時，才能擊出光電子！',
    summaryHtmlParts: [
      { text: '愛因斯坦光電效應', bold: true },
      { text: '證明光具有粒子性（光子）。能否產生光電子與光電子最大動能完全取決於光的' },
      { text: '頻率（顏色）', bold: true },
      { text: '；光強度只決定單位時間擊出的光電子數目（光電流大小）。' },
    ],
    formulas: [
      '單一光子能量 E = h f = h c / λ ≈ 1240 / λ(nm) (eV)',
      '光電效應方程式：E_k(max) = e V_s = h f - W （W = h f₀ 為金屬功函數）',
      '德布羅意物質波波長 λ = h / p = h / (m v) = h / √(2 m E_k)',
    ],
    keyTakeaway: '激發氫原子躍遷時，入射「光子」能量必須「剛好等於能階差」才會被吸收！',
  },
  {
    id: 'c-g10-4-2',
    chapterId: 'g10-ch4',
    grade: 'grade10',
    code: '高一 4-2',
    title: '力學能轉換、熱功當量與質能互換',
    diagramType: 'energy_mass_equivalence',
    boardCaption: '焦耳熱功當量 1 cal ≈ 4.2 J；愛因斯坦質能互換 E = Δm c²',
    summaryHtmlParts: [
      { text: '能量守恆定律', bold: true },
      { text: '指出宇宙總能量恆定不變，但可用能量在轉換過程中會因摩擦生熱而退化（熵增）。核反應中微小的' },
      { text: '質量虧損 Δm', bold: true },
      { text: '乘以光速平方即釋放龐大核能。' },
    ],
    formulas: [
      '單擺與自由落體力學能守恆：E_k1 + U_1 = E_k2 + U_2 （擺線張力恆垂直速度不作功）',
      '熱機效率 η = W_輸出 / Q_輸入 × 100% （恆小於 100%）',
      '質能互換 E = Δm c² （代入 Δm = 1 kg 可得 9 × 10¹⁶ J）',
    ],
    keyTakeaway: '核電廠發電為「鈾-235 核分裂（1 顆慢中子誘發產生 3 顆中子）」；太陽發光則為「氫核融合」！',
  },

  // ================= 高二：選修物理 I & II (17 課) =================
  {
    id: 'c-g11-1-1',
    chapterId: 'g11-ch1',
    grade: 'grade11',
    code: '1-1',
    title: '國際單位制 (SI) 與因次分析',
    diagramType: 'si_dimensions',
    boardCaption: 'SI 七大基本單位：公尺(m)、公斤(kg)、秒(s)、安培(A)、克耳文(K)、莫耳(mol)、燭光(cd)',
    summaryHtmlParts: [
      { text: '因次 (Dimension)', bold: true },
      { text: '代表物理量的本質構成。力學中所有導出量皆可表為 ' },
      { text: 'M^a L^b T^c', bold: true },
      { text: '，物理方程式等號兩側的因次必定完全相同。' },
    ],
    formulas: [
      '1 m/s = 3.6 km/h    1 m/s² = 3.6 (km/h)/s',
      '力 [F] = M L T⁻²    功與能 [E] = [τ] = M L² T⁻²',
      '功率 [P] = M L² T⁻³    壓力 [P] = M L⁻¹ T⁻²',
    ],
    keyTakeaway: '電學基本單位是「安培 (A)」而非庫侖 (C)；普朗克常數 h 的因次與角動量相同！',
  },
  {
    id: 'c-g11-1-2',
    chapterId: 'g11-ch1',
    grade: 'grade11',
    code: '1-2',
    title: '測量不確定度與有效數字',
    diagramType: 'uncertainty_ruler',
    boardCaption: '測量結果 = 最佳估計值 ± 組合不確定度（末位小數位數必須完全對齊）',
    summaryHtmlParts: [
      { text: 'A 類不確定度', bold: true },
      { text: '由多次測量統計標準差除以 √N 求得；' },
      { text: 'B 類不確定度', bold: true },
      { text: '由最小刻度除以 2√3（約 0.29 倍最小刻度）求得。' },
    ],
    formulas: [
      'A 類不確定度 u_A = s / √N    B 類不確定度 u_B = d / (2√3) ≈ 0.29 d',
      '組合標準不確定度 u_c = √(u_A² + u_B²)',
      '乘除法有效位數：與有效位數最少者相同',
    ],
    keyTakeaway: '108 課綱單次測量 B 類不確定度為 0.29 × 最小刻度，不再是舊課綱的 0.5 倍！',
  },
  {
    id: 'c-g11-2-1',
    chapterId: 'g11-ch2',
    grade: 'grade11',
    code: '2-1',
    title: '位移、速度與加速度',
    diagramType: 'displacement_numberline',
    boardCaption: '位移只看起點與終點；路徑長要把每一段的長度加起來',
    summaryHtmlParts: [
      { text: '位移', bold: true },
      { text: '是位置的變化（向量）；' },
      { text: '路徑長', bold: true },
      { text: '是實際走過的長度（純量）。只有不回頭的直線運動兩者大小才相等。' },
    ],
    formulas: [
      '平均速度 = 位移 / 時間    平均速率 = 路徑長 / 時間',
      '瞬時速度 = x-t 圖的切線斜率',
      '平均加速度 a = Δv / Δt    瞬時加速度 = v-t 圖的切線斜率',
    ],
    keyTakeaway: '看到「折返」或「往返」運動時，平均速度看頭尾位移，平均速率看總路程！',
  },
  {
    id: 'c-g11-2-2',
    chapterId: 'g11-ch2',
    grade: 'grade11',
    code: '2-2',
    title: '等加速度直線運動三大公式',
    diagramType: 'uniform_accel_vt',
    boardCaption: 'v-t 圖斜率 = 加速度 a；v-t 圖與時間軸所圍面積 = 位移 Δx',
    summaryHtmlParts: [
      { text: '等加速度運動', bold: true },
      { text: '中，任意時間區間的「平均速度」必等於該段「時間中點的瞬時速度」，且等於頭尾速度的算術平均數。' },
    ],
    formulas: [
      '① v = v₀ + a t    ② Δx = [(v₀ + v) / 2] t = v₀ t + ½ a t²',
      '③ v² = v₀² + 2 a Δx （不涉及時間 t 時最快！）',
      '位移中點瞬時速率 v_mid = √[(v₁² + v₂²) / 2]',
    ],
    keyTakeaway: '初速為 0 時，前 1、2、3 秒總位移比為 1:4:9；第 1、2、3 秒內個別位移比為 1:3:5！',
  },
  {
    id: 'c-g11-2-3',
    chapterId: 'g11-ch2',
    grade: 'grade11',
    code: '2-3',
    title: '自由落體與鉛直上拋對稱性',
    diagramType: 'vertical_throw_symmetry',
    boardCaption: '鉛直上拋在最高點 v = 0，但加速度仍為 g 鉛直向下（絕不為 0！）',
    summaryHtmlParts: [
      { text: '鉛直上拋', bold: true },
      { text: '具有完美的時間與速率對稱性：上升至最高點的時間等於落回原處的時間，且通過同一高度時上行與下行速率相等。' },
    ],
    formulas: [
      '上升時間 t_上 = v₀ / g    最大高度 H = v₀² / (2g) = ⅛ g T²',
      '同高處上拋落地時間 t₁、下拋落地時間 t₂ ⇒ 自由落體時間 t = √(t₁ t₂)',
      '空中兩拋體相對加速度 a_rel = g - g = 0（相對等速度運動）',
    ],
    keyTakeaway: '看到空中兩球相遇問題，改用相對運動 t = H / v_rel 可瞬間消去 1/2 gt²！',
  },
  {
    id: 'c-g11-3-1',
    chapterId: 'g11-ch3',
    grade: 'grade11',
    code: '3-1',
    title: '水平拋射與運動獨立性',
    diagramType: 'horizontal_projectile',
    boardCaption: '運動獨立性：水平方向等速度 (v_x = v₀)，鉛直方向自由落體 (y = ½ g t²)',
    summaryHtmlParts: [
      { text: '水平拋射', bold: true },
      { text: '的飛行時間只由鉛直高度 H 決定，與水平初速大小無關。任意時刻速度切線反向延伸，必交於水平位移的' },
      { text: '正中點', bold: true },
      { text: '。' },
    ],
    formulas: [
      '飛行時間 t = √(2H / g)    水平射程 R = v₀ √(2H / g)',
      '瞬時合速率 v = √(v₀² + (gt)²)    曲率半徑 ρ = v² / g_⊥',
      '速度角 θ 與位移角 α 恆滿足：tanθ = 2 tanα',
    ],
    keyTakeaway: '斜面上的平拋運動，破題關鍵在於「鉛直位移與水平位移比 y / x = tanθ」！',
  },
  {
    id: 'c-g11-3-2',
    chapterId: 'g11-ch3',
    grade: 'grade11',
    code: '3-2',
    title: '斜向拋射與互餘角射程性質',
    diagramType: 'projectile_parabola',
    boardCaption: '斜拋最高點 v_y = 0、v_x = v₀ cosθ；仰角 θ = 45° 時水平射程最遠',
    summaryHtmlParts: [
      { text: '斜向拋射', bold: true },
      { text: '分解為水平等速度 (v₀ cosθ) 與鉛直上拋 (v₀ sinθ)。當兩拋射仰角互餘（如 30° 與 60°）時，兩者的' },
      { text: '水平射程必完全相等', bold: true },
      { text: '！' },
    ],
    formulas: [
      '飛行總時間 T = (2 v₀ sinθ) / g    最大高度 H = (v₀ sinθ)² / (2g)',
      '水平射程 R = (v₀² sin2θ) / g = ½ g T² cotθ',
      '互餘角 (θ 與 90°-θ) 黃金公式：R = 4 √(H₁ H₂) = ½ g T₁ T₂',
    ],
    keyTakeaway: '已知斜拋飛行總時間 T 時，不必求初速即可直接用 H = 1/8 g T² 秒殺最大高度！',
  },
  {
    id: 'c-g11-3-3',
    chapterId: 'g11-ch3',
    grade: 'grade11',
    code: '3-3',
    title: '等速率圓周運動與簡諧運動 (SHM)',
    diagramType: 'circular_shm_projection',
    boardCaption: '簡諧運動為等速率圓周運動在直徑上的投影：a(x) = -ω² x',
    summaryHtmlParts: [
      { text: '簡諧運動 (SHM)', bold: true },
      { text: '中，物體在平衡點速度最大、加速度為 0；在兩端點速度為 0、加速度最大。利用' },
      { text: '參考圓角度投影', bold: true },
      { text: '可快速計算任意位移區間所需時間。' },
    ],
    formulas: [
      '向心加速度 a_c = v² / r = r ω² = (4π² / T²) r',
      'SHM 最大速度 v_max = A ω    最大加速度 a_max = A ω²',
      '彈簧週期 T = 2π √(m / k)    單擺週期 T = 2π √(L / g)',
    ],
    keyTakeaway: '由平衡點走至 A/2 對應參考圓轉過 30°，耗時 T/12；由 A/2 走至端點 A 轉過 60°，耗時 T/6！',
  },
  {
    id: 'c-g11-4-1',
    chapterId: 'g11-ch4',
    grade: 'grade11',
    code: '4-1',
    title: '牛頓運動定律與連接體內力分攤',
    diagramType: 'newton_force_block',
    boardCaption: '整體法求共同加速度 a = ΣF_外 / Σm；隔離法求系統內力（按後方質量比例分攤）',
    summaryHtmlParts: [
      { text: '連接體系統', bold: true },
      { text: '一起加速時，各物體加速度相同。中間繩張力或接觸面正向力等於內力，恆等於' },
      { text: '「後方被推拉的質量佔總質量的比例」乘上外力 F', bold: true },
      { text: '！' },
    ],
    formulas: [
      '牛頓第二定律 ΣF = m a    內力分攤 F_內 = [m_後 / (m_前 + m_後)] F',
      '阿特午機（滑輪兩端 m₁, m₂）：a = [(m₁ - m₂)/(m₁ + m₂)] g',
      '剪斷瞬間：輕繩張力立即變為 0，但彈簧彈力瞬間維持原值不變！',
    ],
    keyTakeaway: '處理剪斷瞬間加速度問題，切記「彈簧形變來不及改變，彈力在剪斷瞬間保持不變」！',
  },
  {
    id: 'c-g11-4-2',
    chapterId: 'g11-ch4',
    grade: 'grade11',
    code: '4-2',
    title: '動靜摩擦力、視重與加速座標系',
    diagramType: 'friction_elevator',
    boardCaption: '未滑動前靜摩擦力等於外力 (f_s = F_外)；滑動瞬間才代最大靜摩擦力 μ_s N',
    summaryHtmlParts: [
      { text: '電梯視重', bold: true },
      { text: '只看加速度方向：加速度向上（加速上升或減速下降）為超重 m(g+a)；加速度向下（減速上升或加速下降）為' },
      { text: '失重 m(g-a)', bold: true },
      { text: '。' },
    ],
    formulas: [
      '靜摩擦力 f_s ≤ μ_s N    動摩擦力 f_k = μ_k N',
      '斜面等速下滑（或恰開始滑動臨界角）：μ = tanθ',
      '水平加速車廂內單擺偏角 θ：a = g tanθ, 張力 T = m √(g² + a²)',
    ],
    keyTakeaway: '疊塊不相對滑動問題：「誰沒被外力直接拉，誰就靠最大靜摩擦力決定最大共同加速度 a_max」！',
  },
  {
    id: 'c-g11-5-1',
    chapterId: 'g11-ch5',
    grade: 'grade11',
    code: '5-1',
    title: '萬有引力與星球內外部重力場',
    diagramType: 'gravity_field_profile',
    boardCaption: '地表重力 g₀ = GM/R² = (4/3)πGρR；離地高度 h 處距地心為 r = R + h',
    summaryHtmlParts: [
      { text: '重力加速度 g', bold: true },
      { text: '在星球外部與距球心距離平方 r² 成反比；在均勻實心星球內部則因球殼抵消，與距球心距離 r 成' },
      { text: '線性正比', bold: true },
      { text: '！' },
    ],
    formulas: [
      '給質量 M：g = GM / R² ∝ M / R²    給密度 ρ：g = (4/3)πGρR ∝ ρ R',
      '離地面高度 h 處：g_h = g₀ [ R / (R + h) ]²',
      '均勻地球內部 (r ≤ R)：g(r) = g₀ (r / R) （地心處 g = 0）',
    ],
    keyTakeaway: '題目給「平均密度 ρ」時，務必改用黃金公式 g ∝ ρR（或 R ∝ (M/ρ)^(1/3)）！',
  },
  {
    id: 'c-g11-5-2',
    chapterId: 'g11-ch5',
    grade: 'grade11',
    code: '5-2',
    title: '人造衛星軌道、雙星系統與衛星能量',
    diagramType: 'satellite_binary_energy',
    boardCaption: '萬有引力提供向心力：越低軌的衛星線速率越快、週期越短、總力學能越低',
    summaryHtmlParts: [
      { text: '雙星系統', bold: true },
      { text: '繞共同質心同步轉動，彼此向心力大小、角速度與週期必為 ' },
      { text: '1 : 1', bold: true },
      { text: '；軌道半徑與線速率則與星球質量成反比。' },
    ],
    formulas: [
      '衛星圓軌道：v = √(GM/r), ω = √(GM/r³), T = 2π√(r³/GM), a_c = GM/r²',
      '衛星能量三連比：動能 E_k : 位能 U : 總能 E = (+1) : (-2) : (-1)',
      '雙星週期公式：T = 2π √[ L³ / G(m₁ + m₂) ] （L 為兩星總間距）',
    ],
    keyTakeaway: '同一橢圓軌道近遠日點速率比用 r₁v₁ = r₂v₂；不同圓軌道衛星速率比才用 v = √(GM/r)！',
  },
  {
    id: 'c-g11-6-1',
    chapterId: 'g11-ch6',
    grade: 'grade11',
    code: '6-1',
    title: '衝量、動量守恆與質心運動',
    diagramType: 'impulse_momentum_cm',
    boardCaption: '系統不受外力（或某方向外力為 0）時總動量守恆；若原靜止則質心位置永遠不變',
    summaryHtmlParts: [
      { text: '動量與衝量', bold: true },
      { text: '皆為向量，計算一維反彈時務必先設定正負號。人在靜止船上走動時，人與船對地的位移大小與質量成' },
      { text: '反比', bold: true },
      { text: '。' },
    ],
    formulas: [
      '衝量-動量定理：J = F_avg Δt = Δp = m v_末 - m v_初 （F-t 圖下面積）',
      '質心速度 v_c = (m₁v₁ + m₂v₂)/(m₁ + m₂)    質心加速度 a_c = ΣF_外 / M_總',
      '人在船上走動船後退距離：Δx_船 = [ m_人 / (m_人 + M_船) ] L',
    ],
    keyTakeaway: '靜止炸彈分裂或原子核衰變時，兩碎片動量大小 1:1，動能分配則與質量成反比 (E_k ∝ 1/m)！',
  },
  {
    id: 'c-g11-6-2',
    chapterId: 'g11-ch6',
    grade: 'grade11',
    code: '6-2',
    title: '功能定理、力學能守恆與鉛直圓周',
    diagramType: 'vertical_circle_energy',
    boardCaption: '合力所作總功 = 動能變化量 (W_net = ΔE_k)；僅保守力作功時力學能守恆',
    summaryHtmlParts: [
      { text: '鉛直圓周運動', bold: true },
      { text: '（如輕繩綁球或雲霄飛車內軌）通過最高點不脫軌的最小臨界速率為 ' },
      { text: '√(gR)', bold: true },
      { text: '，對應最低點至少需給予 √(5gR) 的初速率。' },
    ],
    formulas: [
      '功 W = F d cosθ （F-x 圖下面積）    瞬時功率 P = F v cosθ',
      '功能定理 W_合力 = ΔE_k = ½ m v₂² - ½ m v₁²',
      '輕繩鉛直圓周臨界速率：最高點 v_頂 = √(gR)，最低點 v_底 = √(5gR)',
    ],
    keyTakeaway: '定功率 P 啟動汽車：隨車速 v 增加，牽引力 F = P/v 減小，當 F = 阻力 f 時達最大速率 v_max = P/f！',
  },
  {
    id: 'c-g11-6-3',
    chapterId: 'g11-ch6',
    grade: 'grade11',
    code: '6-3',
    title: '一維彈性碰撞與完全非彈性碰撞',
    diagramType: 'collision_1d',
    boardCaption: '所有碰撞皆遵守「動量守恆」；唯獨彈性碰撞同時遵守「總動能守恆」',
    summaryHtmlParts: [
      { text: '一維彈性碰撞', bold: true },
      { text: '中，接近相對速度必等於分離相對速度；若兩球質量相等則碰撞後' },
      { text: '完全交換速度', bold: true },
      { text: '。完全非彈性碰撞（黏合）則會損失全部的內動能。' },
    ],
    formulas: [
      '一維彈性碰撞 (v₂=0)：v₁\' = [(m₁-m₂)/(m₁+m₂)] v₁, v₂\' = [2m₁/(m₁+m₂)] v₁',
      '系統總動能拆解：E_k總 = 質心動能 E_kc + 內動能 E_k內',
      '打入靜止靶 M 黏合（或壓彈簧至最緊）損失能量：ΔE_loss = [M / (m + M)] E_k0',
    ],
    keyTakeaway: '子彈 m 打入靜止木塊 M 黏合，損失的動能比例直接等於「目標質量佔總質量比 M/(m+M)」！',
  },
  {
    id: 'c-g11-7-1',
    chapterId: 'g11-ch7',
    grade: 'grade11',
    code: '7-1',
    title: '理想氣體方程式與氣體動力論',
    diagramType: 'kinetic_theory_gas',
    boardCaption: '理想氣體分子的平均移動動能 E_k = (3/2) k_B T 只與絕對溫度 T 有關！',
    summaryHtmlParts: [
      { text: '氣體動力論', bold: true },
      { text: '將巨觀壓力 P、溫度 T 與微觀分子的碰撞動量變化連結。在相同溫度下，任何理想氣體的' },
      { text: '分子平均動能皆 1:1 相等', bold: true },
      { text: '，方均根速率則與分子量開根號成反比。' },
    ],
    formulas: [
      '理想氣體方程式：P V = n R T = N k_B T    密度型：P M = ρ R T',
      '微觀壓力公式：P = ⅓ (N m / V) v_rms² = ⅓ ρ v_rms²',
      '方均根速率 v_rms = √(3 R T / M) = √(3 k_B T / m) ∝ √(T / M)',
    ],
    keyTakeaway: '計算前第一件事：把攝氏溫度 °C 加上 273 換成克耳文絕對溫度 K！',
  },
  {
    id: 'c-g11-7-2',
    chapterId: 'g11-ch7',
    grade: 'grade11',
    code: '7-2',
    title: '單原子氣體內能與熱力學第一定律',
    diagramType: 'thermo_pv_first_law',
    boardCaption: '單原子理想氣體總內能 U = (3/2) nRT = (3/2) PV；熱力學第一定律 ΔU = Q - W',
    summaryHtmlParts: [
      { text: '熱力學第一定律', bold: true },
      { text: '即能量守恆：氣體內能變化 ΔU 等於吸收熱量 Q 減去對外膨脹所作的功 W（P-V 圖下面積）。開口與大氣相通的房間加熱時，室內空氣' },
      { text: '總內能 U = (3/2)PV 維持不變', bold: true },
      { text: '！' },
    ],
    formulas: [
      '定壓作功 W = P ΔV （P-V 圖下面積）    內能變化 ΔU = 3/2 Δ(PV)',
      '單原子定壓過程比例：作功 W : 內能變化 ΔU : 吸熱 Q = 2 : 3 : 5',
      '絕熱剛性容器連通混合後壓力：P_f = (P₁V₁ + P₂V₂) / (V₁ + V₂)',
    ],
    keyTakeaway: '向真空「絕熱自由膨脹」時，Q = 0 且對外不作功 W = 0，故內能與溫度完全不變！',
  },

  // ================= 高三：選修物理 III ~ V (10 課) =================
  {
    id: 'c-g12-1-1',
    chapterId: 'g12-ch1',
    grade: 'grade12',
    code: '高三 1-1',
    title: '繩波反射透射與駐波',
    diagramType: 'standing_wave_string',
    boardCaption: '兩相鄰節點距為 λ/2；弦與開管具全諧音 (1:2:3)，閉管僅有奇數諧音 (1:3:5)',
    summaryHtmlParts: [
      { text: '駐波', bold: true },
      { text: '由兩個振幅、頻率相同且相向傳播的波疊加而成，能階在節點間往復振動卻不向前傳遞淨能量。繩波由輕繩傳向重繩（固定端）時，反射波會' },
      { text: '反相 180°', bold: true },
      { text: '，透射波則永遠與入射波同相。' },
    ],
    formulas: [
      '張力弦波速 v = √(F / μ) （線密度 μ = m/L）｜ 波速只由介質決定，頻率只由波源決定',
      '兩端固定弦 / 兩端開管駐波：λ_n = 2L / n, f_n = n (v / 2L) （n = 1, 2, 3...）',
      '一端閉口管駐波：λ_m = 4L / m, f_m = m (v / 4L) （m = 1, 3, 5... 僅奇數諧音）',
    ],
    keyTakeaway: '同相雙點波源干涉：中央中垂線為腹線（腹線奇數條、節線偶數條）；反相波源則完全對調！',
  },
  {
    id: 'c-g12-1-2',
    chapterId: 'g12-ch1',
    grade: 'grade12',
    code: '高三 1-2',
    title: '聲波共鳴與都卜勒效應',
    diagramType: 'wave_doppler',
    boardCaption: '波源移動壓縮或拉長波長（改分母）；觀察者移動僅改變相對波速（改分子）',
    summaryHtmlParts: [
      { text: '都卜勒效應', bold: true },
      { text: '解釋了為何救護車靠近時音調變高、遠離時變低。只要波源與觀察者之間有接近的相對趨勢，聽到的' },
      { text: '視頻率 f\' 就會升高', bold: true },
      { text: '。在空氣柱共鳴管實驗中，相鄰兩次共鳴的水面高度差固定為半個波長 λ/2。' },
    ],
    formulas: [
      '氣柱共鳴管實驗：相鄰兩次共鳴水面高度差 ΔL = L₂ - L₁ = λ / 2 （無須端點修正！）',
      '都卜勒公式：f\' = f · [ (v ± v_O) / (v ∓ v_S) ] （接近變高頻、遠離變低頻）',
      '拍頻（兩近頻聲波疊加）：f_beat = | f₁ - f₂ |',
    ],
    keyTakeaway: '有順風或逆風 v_wind 時，記得先把公式裡的介質聲速 v 全部換成 v ± v_wind！',
  },
  {
    id: 'c-g12-2-1',
    chapterId: 'g12-ch2',
    grade: 'grade12',
    code: '高三 2-1',
    title: '幾何光學折射、全反射與薄透鏡成像',
    diagramType: 'optics_refract_lens',
    boardCaption: '全反射條件：光密射向光疏 (n₁ > n₂) 且入射角 θ > 臨界角 θ_c (sinθ_c = n₂/n₁)',
    summaryHtmlParts: [
      { text: '薄透鏡成像', bold: true },
      { text: '遵守高斯公式 1/p + 1/q = 1/f。實物與光屏相距 L 時，必須滿足 ' },
      { text: 'L ≥ 4f', bold: true },
      { text: ' 才能在光屏上成清晰實像，且兩共軛位置實像高度滿足 h₀ = √(h₁ h₂)。' },
    ],
    formulas: [
      '司乃耳定律 n₁ sinθ₁ = n₂ sinθ₂    正視視深 d\' = (n_人 / n_物) d',
      '全反射臨界角 sinθ_c = n₂ / n₁ （光波進入光密介質時：頻率 f 不變，波速 v 與波長 λ 變慢減短）',
      '薄透鏡成像：1/p + 1/q = 1/f （凸透鏡 f > 0，凹透鏡 f < 0），放大率 m = -q / p',
    ],
    keyTakeaway: '把玻璃透鏡整個浸入水中時，透鏡與水之間折射率差距變小，因此焦距 f 會大幅變大！',
  },
  {
    id: 'c-g12-2-2',
    chapterId: 'g12-ch2',
    grade: 'grade12',
    code: '高三 2-2',
    title: '楊氏雙狹縫干涉與單狹縫繞射',
    diagramType: 'double_slit_diffraction',
    boardCaption: '雙狹縫條紋等寬（亮紋 Δy = Lλ/d）；單狹縫中央亮帶寬度為兩側亮帶的 2 倍（2Lλ/a）',
    summaryHtmlParts: [
      { text: '雙狹縫干涉與單狹縫繞射', bold: true },
      { text: '的關鍵差異在於明暗條紋條件與寬度分佈：雙狹縫各級亮紋等距且等亮，而單狹縫繞射的能量高度集中於兩倍寬的' },
      { text: '中央亮帶', bold: true },
      { text: '。' },
    ],
    formulas: [
      '楊氏雙狹縫亮紋間距 Δy = L λ / d ｜ d sinθ = m λ（亮紋）；(m + ½) λ（暗紋）',
      '單狹縫繞射暗紋條件：a sinθ = m λ (m = 1, 2, 3...) ｜ 中央亮帶寬度 = 2 L λ / a',
      '繞射光柵與薄膜干涉：薄膜反射逢密介面多半波相移（π 相位差），紫光波長短條紋較密',
    ],
    keyTakeaway: '口訣：「雙狹縫整數是亮紋，單狹縫整數 (m≥1) 反而是暗紋」！且若浸入折射率 n 液體中條紋間距縮為 1/n 倍。',
  },
  {
    id: 'c-g12-3-1',
    chapterId: 'g12-ch3',
    grade: 'grade12',
    code: '高三 3-1',
    title: '靜電場、電位與平行板電容器',
    diagramType: 'electrostatics_capacitor',
    boardCaption: '電場 E 是向量、電位 V 是純量；金屬球殼內部靜電屏蔽 E = 0，但電位 V = kQ/R ≠ 0！',
    summaryHtmlParts: [
      { text: '平行板電容器', bold: true },
      { text: '題目務必先確認是「接電池（電壓 V 定值）」還是「斷開電池（電量 Q 定值，此時板間電場 E = Q/(ε₀A) 與板距 d 無關）」！' },
    ],
    formulas: [
      '點電荷電場 E = k Q / r² （向量疊加）    電位 V = k Q / r （純量直接加減）',
      '平行板電容 C = ε₀ A / d    儲能 U = ½ C V² = ½ Q V = Q² / (2C)',
      '平行板間均勻電場 E = ΔV / d ｜ 密立根油滴平衡：q E = m g',
    ],
    keyTakeaway: '斷開電池後把平行板拉開（d 變大），電容 C 變小但電量 Q 不變，板間電場 E 保持定值、儲能 U 反而增加！',
  },
  {
    id: 'c-g12-3-2',
    chapterId: 'g12-ch3',
    grade: 'grade12',
    code: '高三 3-2',
    title: '歐姆定律、克希荷夫與電橋電路',
    diagramType: 'dc_circuit_bridge',
    boardCaption: '克希荷夫節點電流守恆、迴路電位升降總和為 0；當外電阻 R = 電池內阻 r 時輸出功率最大',
    summaryHtmlParts: [
      { text: '克希荷夫電路定律', bold: true },
      { text: '分別體現「電荷守恆（節點流入電流等於流出）」與「能量守恆（沿封閉迴路走一圈電位變化總和為 0）」。惠司同電橋在中間檢流計無電流時，滿足' },
      { text: '對角電阻乘積相等', bold: true },
      { text: '。' },
    ],
    formulas: [
      '體積固定拉長導線 n 倍：R = ρ L / A ∝ L² （變 n² 倍）；功率 P = IV = I²R = V²/R',
      '電池端電壓 V = ε - I r ｜ 最大輸出功率條件：R = r 時 P_max = ε² / (4r)',
      '惠司同電橋平衡條件 (I_G = 0)：R₁ R₄ = R₂ R₃',
    ],
    keyTakeaway: '電表改裝口訣：安培計「並聯小電阻 R_g/(n-1) 分流」；伏特計「串聯大電阻 (n-1)R_g 分壓」！',
  },
  {
    id: 'c-g12-4-1',
    chapterId: 'g12-ch4',
    grade: 'grade12',
    code: '高三 4-1',
    title: '載流磁場與帶電粒子磁場迴旋',
    diagramType: 'lorentz_cyclotron',
    boardCaption: '帶電質點在磁場中迴旋半徑 R = mv/(qB)，週期 T = 2πm/(qB) 與速率及半徑完全無關！',
    summaryHtmlParts: [
      { text: '勞侖茲磁力', bold: true },
      { text: 'F = q(v × B) 永遠垂直於粒子速度方向，因此純磁場對帶電粒子永遠' },
      { text: '不作功、不改變動能與速率', bold: true },
      { text: '，僅提供向心力使其作等速率圓周或螺旋線運動。' },
    ],
    formulas: [
      '三大磁場：長直導線 μ₀I/(2πr)、圓線圈圓心 μ₀NI/(2R)、螺線管內部 μ₀nI',
      '磁場圓周運動：半徑 R = mv/(qB) = √(2mE_k)/(qB)，週期 T = 2πm/(qB)（與 v 無關！）',
      '速度選擇器（直線通過不偏轉）：q E = q v B ⇒ v = E / B',
    ],
    keyTakeaway: '同動能 E_k 的質子 (1,1) 與 α 粒子 (4,2) 垂直射入同一磁場，因 R ∝ √m/q，迴旋半徑比恰為 1 : 1！',
  },
  {
    id: 'c-g12-4-2',
    chapterId: 'g12-ch4',
    grade: 'grade12',
    code: '高三 4-2',
    title: '法拉第電磁感應與動生電動勢',
    diagramType: 'electromagnetic_induction',
    boardCaption: '感應電動勢 ε = -N ΔΦ/Δt；金屬滑桿切割磁力線動生電動勢 ε = B L v',
    summaryHtmlParts: [
      { text: '法拉第定律與冷次定律', bold: true },
      { text: '結合能量守恆：金屬滑桿在磁場導軌中受外力推拉時，感應電流流經滑桿會產生與速度相反的' },
      { text: '安培磁阻力 F_B = B²L²v / R', bold: true },
      { text: '，外力所作的功精確等於電路消耗的焦耳熱。' },
    ],
    formulas: [
      '磁通量 Φ_B = B A cosθ （單位：Wb 韋伯）｜ 法拉第定律 ε = -N (ΔΦ_B / Δt)',
      '動生電動勢：垂直平移切割 ε = B L v ｜ 單端旋轉切割 ε = ½ B ω L²',
      '單匝流過總感應電荷量 ΔQ = ΔΦ_B / R_總 （與移動快慢 Δt 無關！）',
    ],
    keyTakeaway: '線圈在極短時間內翻轉 180°（由垂直 B 到反向垂直），磁通量變化量 |ΔΦ| = 2 B A（不要忘了 2 倍！）！',
  },
  {
    id: 'c-g12-5-1',
    chapterId: 'g12-ch5',
    grade: 'grade12',
    code: '高三 5-1',
    title: '波耳氫原子模型與光譜系列',
    diagramType: 'bohr_energy_levels',
    boardCaption: '角動量量子化 L_n = m v_n r_n = n(h/2π)；能階公式 E_n = -13.6 / n² (eV)',
    summaryHtmlParts: [
      { text: '波耳氫原子模型', bold: true },
      { text: '結合德布羅意駐波條件 (2πr_n = nλ)，推導出軌道半徑與 n² 成正比、速率與 1/n 成反比。一群處於第 n 能階的氫原子躍遷回基態最多可發出 ' },
      { text: 'n(n-1)/2 種光譜線', bold: true },
      { text: '。' },
    ],
    formulas: [
      '半徑 r_n = n² (0.53 Å) ∝ n²    速率 v_n ∝ 1/n    週期 T_n ∝ n³',
      '類氫離子能階 E_n = -13.6 × (Z² / n²) eV （氦離子 He⁺ 基態為 -54.4 eV）',
      'n → 1 萊曼系 (紫外光)；n → 2 巴耳末系 (可見光)；n → 3 帕申系 (紅外光)',
    ],
    keyTakeaway: '里德伯組合原理：能量與頻率可直接相加 (f₁ = f₂ + f₃)，波長則為倒數相加 (1/λ₁ = 1/λ₂ + 1/λ₃)！',
  },
  {
    id: 'c-g12-5-2',
    chapterId: 'g12-ch5',
    grade: 'grade12',
    code: '高三 5-2',
    title: 'X 射線、原子核結合能與放射性半衰期',
    diagramType: 'nuclear_binding_halflife',
    boardCaption: '鐵-56 (⁵⁶Fe) 平均每核子結合能最大最穩定；半衰期殘留量 M = M₀ (1/2)^(t/T)',
    summaryHtmlParts: [
      { text: '原子核結合能', bold: true },
      { text: '來自核子結合時的質量虧損 Δm c²。輕核融合與重核分裂皆朝向平均每核子結合能最大的' },
      { text: '鐵-56', bold: true },
      { text: '演進而釋放巨大能量。' },
    ],
    formulas: [
      'X 射線管最短截止波長：e V = h c / λ_min ⇒ λ_min = 12400 / V (Å) ∝ 1/V',
      '放射性衰變守恆：質量數 A 守恆、電荷數 Z 守恆（γ 射線不帶電在磁場中不偏轉）',
      '靜止母核 α 衰變動能分配：E_k子核 : E_kα = m_α : m_子核 = 4 : (A - 4)',
    ],
    keyTakeaway: '穿透力排序：γ > β > α；游離能力排序：α > β > γ！',
  },
];

/**
 * 108 課綱高中三年段物理完整題庫 (共 540 題)
 * - 高一必修物理 (Ch1 ~ Ch4)：180 題（含 40 題純觀念題與 60 題近 6 年學測歷屆試題）
 * - 高二選修物理 I & II (Ch1 ~ Ch7)：210 題（含 70 題純觀念題）
 * - 高三選修物理 III ~ V (Ch1 ~ Ch5)：150 題（含 50 題純觀念題）
 */
export const QUESTION_BANK: PhysicsQuestion[] = [
  ...QUESTIONS_GRADE_11_PART1,
  ...QUESTIONS_GRADE_11_PART2,
  ...QUESTIONS_GRADE_10,
  ...QUESTIONS_GRADE_12_PART1,
  ...QUESTIONS_GRADE_12_PART2,
  // 160 題純觀念免計算題
  ...CONCEPT_QUESTIONS_GRADE_10,
  ...CONCEPT_QUESTIONS_GRADE_11,
  ...CONCEPT_QUESTIONS_GRADE_12,
  // 60 題近 6 年（110~115）學測物理歷屆精選
  ...GSAT_PAST6YEARS_QUESTIONS,
];

export const GSAT_YEARS = [115, 114, 113, 112, 111, 110] as const;
export type GsatFilterMode = 'all' | 'chapter' | 115 | 114 | 113 | 112 | 111 | 110;

/**
 * 篩選指定章節題目的工具函式
 * @param chapterId 章節代號
 * @param onlyConceptual 是否只篩選純觀念題
 */
export function getQuestionsByChapter(chapterId: string, onlyConceptual = false): PhysicsQuestion[] {
  return QUESTION_BANK.filter(q => {
    if (q.chapterId !== chapterId) return false;
    if (onlyConceptual) return q.isConceptual === true;
    return true;
  });
}

/**
 * 取得近 6 年（110~115 學年度）歷屆學測物理測驗題組
 * @param filter 篩選模式：'all'=近6年綜合、'chapter'=優先該章節學測題並補齊至10題、或指定學年度
 * @param chapterId 當 filter 為 'chapter' 時之目標章節代號
 */
export function getGsatQuestions(
  filter: GsatFilterMode = 'all',
  chapterId?: string
): PhysicsQuestion[] {
  if (filter === 'all') {
    return GSAT_PAST6YEARS_QUESTIONS;
  }

  if (filter === 'chapter') {
    if (!chapterId) {
      return GSAT_PAST6YEARS_QUESTIONS;
    }
    const matched = GSAT_PAST6YEARS_QUESTIONS.filter((q) => q.chapterId === chapterId);
    if (matched.length === 0) {
      return GSAT_PAST6YEARS_QUESTIONS;
    }
    if (matched.length >= 10) {
      return matched;
    }
    const others = GSAT_PAST6YEARS_QUESTIONS.filter((q) => q.chapterId !== chapterId);
    return [...matched, ...others.slice(0, 10 - matched.length)];
  }

  return GSAT_PAST6YEARS_QUESTIONS.filter((q) => q.gsatYear === filter);
}

/**
 * 排行榜預設玩家資料
 */
export const INITIAL_LEADERBOARD = [
  { rank: 1, name: '馬克士威的惡魔', gradeBadge: '高三', score: 2680, winRate: '94%' },
  { rank: 2, name: '薛丁格的貓咪', gradeBadge: '高三', score: 2490, winRate: '89%' },
  { rank: 3, name: '建中牛頓哥', gradeBadge: '高二', score: 2150, winRate: '85%' },
  { rank: 4, name: '北一法拉第', gradeBadge: '高二', score: 1980, winRate: '82%' },
  { rank: 5, name: '我', gradeBadge: '玩家', score: 0, winRate: '—', isCurrentUser: true },
  { rank: 6, name: '台中一中伽利略', gradeBadge: '高一', score: 1240, winRate: '76%' },
  { rank: 7, name: '雄中愛因斯坦', gradeBadge: '高一', score: 1120, winRate: '71%' },
];
