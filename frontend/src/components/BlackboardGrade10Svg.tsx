import React from 'react';
import { DiagramType } from '../types/physics-types';

export type Grade10DiagramType = Extract<
  DiagramType,
  | 'quark_four_forces'
  | 'g10_newton_inertia'
  | 'kepler_laws'
  | 'oersted_right_hand'
  | 'em_induction_spectrum'
  | 'photoelectric_quantum'
  | 'energy_mass_equivalence'
>;

/**
 * 高一必修物理（7 堂課）教室黑板 SVG 繪圖渲染器
 * @param diagramType 高一黑板圖解型別
 * @returns 對應 SVG 元件
 */
export function renderGrade10BlackboardSvg(
  diagramType: Grade10DiagramType
): React.ReactElement {
  switch (diagramType) {
    case 'quark_four_forces':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：原子 -> 原子核 -> 質子(uud) / 中子(udd) */}
          <text x="108" y="18" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            物質尺度與夸克組成
          </text>
          <circle cx="52" cy="76" r="32" fill="none" stroke="#9eb8ae" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="52" cy="76" r="7" fill="#f7cf46" />
          <circle cx="75" cy="54" r="3.5" fill="#5e9eff" />
          <text x="52" y="122" fill="#e6f0ec" fontSize="10.5" textAnchor="middle">
            原子 10⁻¹⁰ m
          </text>
          <text x="52" y="136" fill="#9eb8ae" fontSize="10" textAnchor="middle">
            核 10⁻¹⁵ m
          </text>

          {/* 連接線放大到質子與中子 */}
          <line x1="60" y1="73" x2="105" y2="54" stroke="#f7cf46" strokeWidth="1.4" strokeDasharray="3 2" />
          <line x1="60" y1="79" x2="105" y2="106" stroke="#9eb8ae" strokeWidth="1.4" strokeDasharray="3 2" />

          {/* 質子 p (uud) */}
          <rect x="108" y="34" width="96" height="40" rx="8" fill="#2e5443" stroke="#f7cf46" strokeWidth="1.6" />
          <circle cx="126" cy="50" r="6" fill="#ff8585" />
          <text x="126" y="53" fill="#233b30" fontSize="9.5" fontWeight="700" textAnchor="middle">u</text>
          <circle cx="141" cy="50" r="6" fill="#ff8585" />
          <text x="141" y="53" fill="#233b30" fontSize="9.5" fontWeight="700" textAnchor="middle">u</text>
          <circle cx="133" cy="63" r="6" fill="#5e9eff" />
          <text x="133" y="66" fill="#233b30" fontSize="9.5" fontWeight="700" textAnchor="middle">d</text>
          <text x="176" y="51" fill="#ffffff" fontSize="11.5" fontWeight="700" textAnchor="middle">質子 p</text>
          <text x="176" y="65" fill="#f7cf46" fontSize="10.5" textAnchor="middle">+1e</text>

          {/* 中子 n (udd) */}
          <rect x="108" y="88" width="96" height="40" rx="8" fill="#2e5443" stroke="#5e9eff" strokeWidth="1.6" />
          <circle cx="126" cy="104" r="6" fill="#ff8585" />
          <text x="126" y="107" fill="#233b30" fontSize="9.5" fontWeight="700" textAnchor="middle">u</text>
          <circle cx="141" cy="104" r="6" fill="#5e9eff" />
          <text x="141" y="107" fill="#233b30" fontSize="9.5" fontWeight="700" textAnchor="middle">d</text>
          <circle cx="133" cy="117" r="6" fill="#5e9eff" />
          <text x="133" y="120" fill="#233b30" fontSize="9.5" fontWeight="700" textAnchor="middle">d</text>
          <text x="176" y="105" fill="#ffffff" fontSize="11.5" fontWeight="700" textAnchor="middle">中子 n</text>
          <text x="176" y="119" fill="#5e9eff" fontSize="10.5" textAnchor="middle">電中性 0</text>

          {/* 中央分隔線 */}
          <line x1="214" y1="16" x2="214" y2="152" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：四大基本交互作用強度階梯 */}
          <text x="314" y="18" fill="#5e9eff" fontSize="12" fontWeight="700" textAnchor="middle">
            四大基本交互作用（強度序）
          </text>
          <rect x="226" y="32" width="176" height="18" rx="4" fill="#f7cf46" fillOpacity="0.25" stroke="#f7cf46" strokeWidth="1.4" />
          <text x="233" y="45" fill="#f7cf46" fontSize="11" fontWeight="700">1. 強核力</text>
          <text x="396" y="45" fill="#ffffff" fontSize="10.5" textAnchor="end">膠子・束縛原子核</text>

          <rect x="226" y="58" width="142" height="18" rx="4" fill="#5e9eff" fillOpacity="0.25" stroke="#5e9eff" strokeWidth="1.4" />
          <text x="233" y="71" fill="#5e9eff" fontSize="11" fontWeight="700">2. 電磁力</text>
          <text x="396" y="71" fill="#e6f0ec" fontSize="10.5" textAnchor="end">日常摩擦與化學鍵</text>

          <rect x="226" y="84" width="102" height="18" rx="4" fill="#6ee7b7" fillOpacity="0.22" stroke="#6ee7b7" strokeWidth="1.4" />
          <text x="233" y="97" fill="#6ee7b7" fontSize="11" fontWeight="700">3. 弱核力</text>
          <text x="396" y="97" fill="#e6f0ec" fontSize="10.5" textAnchor="end">β 衰變（改變味）</text>

          <rect x="226" y="110" width="68" height="18" rx="4" fill="#ff8585" fillOpacity="0.22" stroke="#ff8585" strokeWidth="1.4" />
          <text x="233" y="123" fill="#ff9494" fontSize="11" fontWeight="700">4. 重力</text>
          <text x="396" y="123" fill="#e6f0ec" fontSize="10.5" textAnchor="end">僅吸引・天體主導</text>

          <text x="210" y="152" fill="#d1fae5" fontSize="11" textAnchor="middle">
            u = +2/3 e，d = -1/3 e；重力與電磁力為無窮遠長程力
          </text>
        </svg>
      );

    case 'g10_newton_inertia':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：慣性定律 */}
          <text x="102" y="18" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            牛頓第一定律（慣性）
          </text>
          <line x1="20" y1="112" x2="188" y2="112" stroke="#9eb8ae" strokeWidth="2" />
          {/* 公車輪廓與乘客前傾 */}
          <rect x="44" y="64" width="116" height="40" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.8" />
          <circle cx="68" cy="108" r="6" fill="#e6f0ec" />
          <circle cx="136" cy="108" r="6" fill="#e6f0ec" />
          {/* 急煞車：車向左減速（實為車向右行駛，加速度向左 a） */}
          <line x1="164" y1="84" x2="195" y2="84" stroke="#5e9eff" strokeWidth="2.5" />
          <polygon points="201,84 191,79 191,89" fill="#5e9eff" />
          <text x="182" y="75" fill="#5e9eff" fontSize="10.5" textAnchor="middle">v 行進</text>
          <line x1="102" y1="54" x2="62" y2="54" stroke="#ff8585" strokeWidth="2.5" />
          <polygon points="55,54 65,49 65,59" fill="#ff8585" />
          <text x="102" y="45" fill="#ff9494" fontSize="10.5" textAnchor="middle">煞車加速度 a ←</text>
          {/* 車內乘客向前（右）傾 */}
          <line x1="102" y1="102" x2="115" y2="78" stroke="#f7cf46" strokeWidth="3" />
          <circle cx="118" cy="73" r="5" fill="#f7cf46" />
          <text x="104" y="132" fill="#e6f0ec" fontSize="11" textAnchor="middle">
            急煞時人維持原向右速度 → 前傾
          </text>
          <text x="104" y="148" fill="#9eb8ae" fontSize="10.5" textAnchor="middle">
            ΣF = 0 ⇔ 靜者恆靜、動者恆等速
          </text>

          {/* 中央分隔線 */}
          <line x1="210" y1="16" x2="210" y2="152" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：反作用力 vs 二力平衡 */}
          <text x="315" y="18" fill="#5e9eff" fontSize="12" fontWeight="700" textAnchor="middle">
            反作用力 vs 二力平衡
          </text>
          {/* 桌面與課本 */}
          <rect x="242" y="92" width="146" height="14" rx="2" fill="#36634f" stroke="#9eb8ae" strokeWidth="1.5" />
          <text x="364" y="103" fill="#e6f0ec" fontSize="10" textAnchor="middle">桌面</text>
          <rect x="280" y="64" width="66" height="26" rx="3" fill="#2e5443" stroke="#f7cf46" strokeWidth="1.8" />
          <text x="313" y="81" fill="#ffffff" fontSize="11.5" fontWeight="700" textAnchor="middle">課本</text>

          {/* 書所受重力與桌支撐力（平衡：同作用在書上） */}
          <line x1="298" y1="64" x2="298" y2="34" stroke="#f7cf46" strokeWidth="2.4" />
          <polygon points="298,27 293,37 303,37" fill="#f7cf46" />
          <text x="292" y="34" fill="#f7cf46" fontSize="10" textAnchor="end">N(桌→書)</text>

          <line x1="298" y1="90" x2="298" y2="126" stroke="#f7cf46" strokeWidth="2.4" />
          <polygon points="298,133 293,123 303,123" fill="#f7cf46" />
          <text x="292" y="128" fill="#f7cf46" fontSize="10" textAnchor="end">W(地→書)</text>

          {/* 書壓桌 vs 桌撐書（互為反作用力：作用在不同物） */}
          <line x1="332" y1="90" x2="332" y2="122" stroke="#ff8585" strokeWidth="2.4" />
          <polygon points="332,129 327,119 337,119" fill="#ff8585" />
          <text x="339" y="124" fill="#ff9494" fontSize="10">書壓桌</text>

          <line x1="332" y1="64" x2="332" y2="36" stroke="#5e9eff" strokeWidth="2.4" />
          <polygon points="332,29 327,39 337,39" fill="#5e9eff" />
          <text x="339" y="42" fill="#5e9eff" fontSize="10">桌撐書</text>

          <text x="315" y="150" fill="#d1fae5" fontSize="10.5" textAnchor="middle">
            同物抵消=平衡；異物互施=作用力對
          </text>
        </svg>
      );

    case 'kepler_laws':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 橢圓軌道與長軸虛線 */}
          <ellipse cx="165" cy="80" rx="130" ry="56" fill="none" stroke="#9eb8ae" strokeWidth="2" />
          <line x1="30" y1="80" x2="300" y2="80" stroke="#9eb8ae" strokeWidth="1.2" strokeDasharray="4 4" />
          {/* 焦點太陽 */}
          <circle cx="80" cy="80" r="13" fill="#f7cf46" />
          <text x="80" y="84" fill="#233b30" fontSize="11" fontWeight="700" textAnchor="middle">太陽</text>

          {/* 近日點扇形 A1 (較寬弧) */}
          <path d="M 80 80 L 42 56 A 130 56 0 0 0 42 104 Z" fill="#f7cf46" fillOpacity="0.28" stroke="#f7cf46" strokeWidth="1.4" />
          <circle cx="35" cy="80" r="5" fill="#f7cf46" />
          <text x="58" y="46" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">近日點 A₁</text>
          <text x="56" y="128" fill="#f7cf46" fontSize="10.5" textAnchor="middle">r₁ 小・v₁ 快</text>

          {/* 遠日點扇形 A2 (窄長弧) */}
          <path d="M 80 80 L 292 68 A 130 56 0 0 1 292 92 Z" fill="#5e9eff" fillOpacity="0.28" stroke="#5e9eff" strokeWidth="1.4" />
          <circle cx="295" cy="80" r="5" fill="#5e9eff" />
          <text x="242" y="60" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">遠日點 A₂</text>
          <text x="242" y="106" fill="#5e9eff" fontSize="10.5" textAnchor="middle">r₂ 大・v₂ 慢</text>

          {/* 右側定律整理 */}
          <rect x="306" y="22" width="104" height="114" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.2" />
          <text x="358" y="41" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">克卜勒三律</text>
          <text x="313" y="61" fill="#ffffff" fontSize="10.5">① 橢圓・焦點</text>
          <text x="313" y="81" fill="#f7cf46" fontSize="10.5">② 等面積 A₁=A₂</text>
          <text x="318" y="97" fill="#e6f0ec" fontSize="10.5">⇒ r₁v₁ = r₂v₂</text>
          <text x="313" y="118" fill="#5e9eff" fontSize="10.5">③ a³ / T² = 常數</text>
          <text x="210" y="154" fill="#d1fae5" fontSize="11" textAnchor="middle">
            半長軸 a = (r₁ + r₂) / 2；僅限「繞同一中心天體」天體共用比值！
          </text>
        </svg>
      );

    case 'oersted_right_hand':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：厄斯特電流磁效應 + 磁針偏轉 */}
          <text x="115" y="18" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            安培右手定則（導線正下方磁針）
          </text>
          {/* 方位標示 */}
          <text x="42" y="96" fill="#9eb8ae" fontSize="11" fontWeight="700">南 (S)</text>
          <text x="196" y="42" fill="#9eb8ae" fontSize="11" fontWeight="700">北 (N)</text>

          {/* 環繞磁力線橢圓 */}
          <ellipse cx="122" cy="68" rx="16" ry="30" fill="none" stroke="#5e9eff" strokeWidth="1.8" strokeDasharray="4 3" />
          <polygon points="122,98 129,92 117,91" fill="#5e9eff" />
          <text x="164" y="92" fill="#5e9eff" fontSize="10">下方 B 向西</text>

          {/* 長直導線由南向北 */}
          <line x1="65" y1="88" x2="184" y2="48" stroke="#f7cf46" strokeWidth="3.5" />
          <polygon points="193,45 178,43 183,55" fill="#f7cf46" />
          <text x="112" y="60" fill="#f7cf46" fontSize="12" fontWeight="700">電流 I</text>

          {/* 正下方水平羅盤 */}
          <ellipse cx="122" cy="126" rx="34" ry="16" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.6" />
          {/* 偏轉向西（左上）之磁針 */}
          <line x1="142" y1="130" x2="102" y2="122" stroke="#ffffff" strokeWidth="2.2" />
          <polygon points="94,120 107,117 105,127" fill="#ff8585" />
          <text x="72" y="124" fill="#ff9494" fontSize="11" fontWeight="700" textAnchor="end">N 向西</text>
          <text x="122" y="155" fill="#e6f0ec" fontSize="10.5" textAnchor="middle">
            大拇指朝電流 N → 下方四指指西
          </text>

          {/* 中央分隔線 */}
          <line x1="236" y1="16" x2="236" y2="152" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：庫侖靜電力 */}
          <text x="328" y="18" fill="#5e9eff" fontSize="12" fontWeight="700" textAnchor="middle">
            庫侖靜電力定律
          </text>
          <circle cx="272" cy="68" r="14" fill="#ff8585" fillOpacity="0.25" stroke="#ff8585" strokeWidth="2" />
          <text x="272" y="72" fill="#ff9494" fontSize="12" fontWeight="700" textAnchor="middle">+q₁</text>
          <circle cx="384" cy="68" r="14" fill="#5e9eff" fillOpacity="0.25" stroke="#5e9eff" strokeWidth="2" />
          <text x="384" y="72" fill="#5e9eff" fontSize="12" fontWeight="700" textAnchor="middle">-q₂</text>
          {/* 互吸箭頭 */}
          <line x1="290" y1="68" x2="314" y2="68" stroke="#f7cf46" strokeWidth="2.5" />
          <polygon points="321,68 311,63 311,73" fill="#f7cf46" />
          <line x1="366" y1="68" x2="342" y2="68" stroke="#f7cf46" strokeWidth="2.5" />
          <polygon points="335,68 345,63 345,73" fill="#f7cf46" />
          <text x="328" y="96" fill="#9eb8ae" fontSize="11" textAnchor="middle">← 距離 r →</text>
          <text x="328" y="122" fill="#ffffff" fontSize="12.5" fontWeight="700" textAnchor="middle">
            F = k |q₁ q₂| / r²
          </text>
          <text x="328" y="144" fill="#d1fae5" fontSize="10.5" textAnchor="middle">
            同性相斥・異性相吸・等大反向
          </text>
        </svg>
      );

    case 'em_induction_spectrum':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 上半左：冷次定律 + 變壓器 */}
          <text x="102" y="17" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            冷次定律 & 理想變壓器 (AC)
          </text>
          <rect x="20" y="34" width="54" height="24" rx="3" fill="#c53030" stroke="#ffffff" strokeWidth="1.2" />
          <text x="32" y="50" fill="#fed7d7" fontSize="12" fontWeight="700">S</text>
          <text x="58" y="50" fill="#ffffff" fontSize="12" fontWeight="700">N</text>
          <line x1="80" y1="46" x2="108" y2="46" stroke="#f7cf46" strokeWidth="2.5" />
          <polygon points="116,46 105,41 105,51" fill="#f7cf46" />
          <ellipse cx="136" cy="46" rx="12" ry="22" fill="none" stroke="#5e9eff" strokeWidth="2.8" />
          <text x="156" y="42" fill="#5e9eff" fontSize="10.5" fontWeight="700">來拒去留</text>
          <text x="156" y="57" fill="#e6f0ec" fontSize="10">感應 N 抗拒</text>

          <rect x="20" y="72" width="174" height="26" rx="4" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.2" />
          <text x="107" y="89" fill="#f7cf46" fontSize="11" fontWeight="600" textAnchor="middle">
            變壓器 V₁/V₂ = N₁/N₂ (僅交流電)
          </text>

          {/* 上半右：電磁波橫波結構 E ⊥ B ⊥ c */}
          <text x="315" y="17" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            電磁波（E ⊥ B ⊥ 波速 c）
          </text>
          <line x1="224" y1="62" x2="404" y2="62" stroke="#9eb8ae" strokeWidth="1.5" />
          <polygon points="410,62 400,58 400,66" fill="#9eb8ae" />
          <path d="M 230 62 Q 260 22 290 62 T 350 62 T 400 62" fill="none" stroke="#f7cf46" strokeWidth="2.2" />
          <path d="M 230 62 Q 260 88 290 62 T 350 62 T 400 62" fill="none" stroke="#5e9eff" strokeWidth="1.8" strokeDasharray="3 2" />
          <text x="260" y="34" fill="#f7cf46" fontSize="10.5" fontWeight="700" textAnchor="middle">E (縱振)</text>
          <text x="275" y="92" fill="#5e9eff" fontSize="10.5" fontWeight="700" textAnchor="middle">B (橫振)</text>
          <text x="394" y="52" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="end">c</text>

          {/* 下半全寬：電磁波譜 */}
          <rect x="16" y="108" width="388" height="24" rx="5" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.4" />
          <text x="44" y="124" fill="#ff9494" fontSize="11" fontWeight="700" textAnchor="middle">γ 射線</text>
          <text x="92" y="124" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">X 光</text>
          <text x="136" y="124" fill="#d8b4fe" fontSize="11" fontWeight="700" textAnchor="middle">UV</text>
          <text x="192" y="124" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">可見光(紫→紅)</text>
          <text x="256" y="124" fill="#fca5a5" fontSize="11" fontWeight="700" textAnchor="middle">IR 紅外</text>
          <text x="308" y="124" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">微波</text>
          <text x="366" y="124" fill="#6ee7b7" fontSize="11" fontWeight="700" textAnchor="middle">無線電波</text>

          <text x="210" y="152" fill="#d1fae5" fontSize="10.8" textAnchor="middle">
            ← 頻率 f 高・光子能量大 (E=hf) ｜ 波長 λ 長・繞射強 →（真空波速均為 c）
          </text>
        </svg>
      );

    case 'photoelectric_quantum':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：光子擊出光電子裝置 */}
          <rect x="20" y="114" width="212" height="22" rx="3" fill="#496b5c" stroke="#9eb8ae" strokeWidth="1.8" />
          <text x="126" y="129" fill="#e2e8f0" fontSize="11.5" textAnchor="middle">
            金屬板（功函數 W = hf₀）
          </text>
          {/* 入射光子波包 */}
          <path d="M 32 32 L 100 106" stroke="#f7cf46" strokeWidth="3" strokeDasharray="6 3" />
          <polygon points="106,112 93,106 103,97" fill="#f7cf46" />
          <text x="88" y="34" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            光子 E = hf
          </text>
          {/* 擊出之光電子 */}
          <line x1="118" y1="108" x2="196" y2="42" stroke="#5e9eff" strokeWidth="2.8" />
          <polygon points="204,35 189,40 197,49" fill="#5e9eff" />
          <circle cx="164" cy="69" r="7" fill="#5e9eff" />
          <text x="164" y="73" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">e⁻</text>
          <text x="176" y="96" fill="#5e9eff" fontSize="11" fontWeight="600" textAnchor="middle">
            E_k = hf - W
          </text>

          {/* 右半：K_max - f 斜線圖（斜率=h） */}
          <line x1="256" y1="122" x2="402" y2="122" stroke="#9eb8ae" strokeWidth="1.6" />
          <line x1="256" y1="26" x2="256" y2="132" stroke="#9eb8ae" strokeWidth="1.6" />
          <text x="396" y="137" fill="#9eb8ae" fontSize="11" textAnchor="end">f (頻率)</text>
          <text x="262" y="28" fill="#9eb8ae" fontSize="11">K_max</text>
          <line x1="296" y1="122" x2="380" y2="40" stroke="#f7cf46" strokeWidth="2.6" />
          <line x1="264" y1="152" x2="296" y2="122" stroke="#f7cf46" strokeWidth="1.6" strokeDasharray="3 3" />
          <line x1="330" y1="122" x2="398" y2="54" stroke="#5e9eff" strokeWidth="2.2" />
          <circle cx="296" cy="122" r="3" fill="#f7cf46" />
          <circle cx="330" cy="122" r="3" fill="#5e9eff" />
          <text x="296" y="136" fill="#f7cf46" fontSize="10" textAnchor="middle">f₀</text>
          <text x="330" y="136" fill="#5e9eff" fontSize="10" textAnchor="middle">f₀'</text>
          <text x="336" y="42" fill="#ffffff" fontSize="10.5" fontWeight="700" textAnchor="middle">
            斜率必等於 h（互相平行）
          </text>
          <text x="210" y="156" fill="#d1fae5" fontSize="10.8" textAnchor="middle">
            f ≥ f₀ 才會發射；光強度只增減光電子數（光電流）
          </text>
        </svg>
      );

    case 'energy_mass_equivalence':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：單擺力學能互換 */}
          <text x="104" y="18" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            位能 ↔ 動能互換（力學能守恆）
          </text>
          <line x1="56" y1="30" x2="152" y2="30" stroke="#9eb8ae" strokeWidth="2" />
          {/* 擺弧軌跡 */}
          <path d="M 52 92 Q 104 128 156 92" fill="none" stroke="#9eb8ae" strokeWidth="1.4" strokeDasharray="4 3" />
          {/* 最高點擺球 */}
          <line x1="104" y1="30" x2="52" y2="92" stroke="#f7cf46" strokeWidth="1.8" strokeDasharray="4 3" />
          <circle cx="52" cy="92" r="7" fill="#f7cf46" />
          <text x="38" y="78" fill="#f7cf46" fontSize="10.5" fontWeight="700" textAnchor="middle">最高點</text>
          <text x="38" y="114" fill="#e6f0ec" fontSize="10" textAnchor="middle">U = mgh</text>
          {/* 最低點擺球 + 張力 T 與速度 v */}
          <line x1="104" y1="30" x2="104" y2="110" stroke="#5e9eff" strokeWidth="2.2" />
          <circle cx="104" cy="110" r="8" fill="#5e9eff" />
          <line x1="104" y1="110" x2="104" y2="78" stroke="#6ee7b7" strokeWidth="2.2" />
          <polygon points="104,72 100,81 108,81" fill="#6ee7b7" />
          <text x="112" y="84" fill="#6ee7b7" fontSize="10.5">T</text>
          <line x1="112" y1="110" x2="146" y2="110" stroke="#ffffff" strokeWidth="2.2" />
          <polygon points="152,110 142,106 142,114" fill="#ffffff" />
          <text x="155" y="114" fill="#ffffff" fontSize="10.5">v</text>
          <text x="104" y="138" fill="#5e9eff" fontSize="10.5" textAnchor="middle">
            T ⊥ v 恆不作功 ⇒ E_k = mgh
          </text>

          {/* 中央分隔線 */}
          <line x1="212" y1="16" x2="212" y2="152" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：熱功當量與質能互換 */}
          <text x="316" y="18" fill="#5e9eff" fontSize="12" fontWeight="700" textAnchor="middle">
            熱功轉換 & 質能互換
          </text>
          <rect x="226" y="34" width="180" height="44" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.4" />
          <text x="316" y="52" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            焦耳熱功當量：1 cal ≈ 4.2 J
          </text>
          <text x="316" y="69" fill="#e6f0ec" fontSize="10.5" textAnchor="middle">
            熱機效率 η = W_out / Q_in &lt; 100%
          </text>

          <rect x="226" y="90" width="180" height="48" rx="6" fill="#36634f" stroke="#f7cf46" strokeWidth="1.6" />
          <text x="316" y="110" fill="#ffffff" fontSize="12.5" fontWeight="700" textAnchor="middle">
            E = Δm c²
          </text>
          <text x="316" y="128" fill="#d1fae5" fontSize="10.5" textAnchor="middle">
            電廠：重核分裂 ｜ 太陽：輕核融合
          </text>
          <text x="210" y="155" fill="#9eb8ae" fontSize="10.5" textAnchor="middle">
            宇宙總能守恆，但可用能量轉換必因摩擦生熱而遞減（熵增）
          </text>
        </svg>
      );
  }
}
