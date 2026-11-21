import React from 'react';
import { DiagramType } from '../types/physics-types';

export type Grade12DiagramType = Extract<
  DiagramType,
  | 'standing_wave_string'
  | 'wave_doppler'
  | 'optics_refract_lens'
  | 'double_slit_diffraction'
  | 'electrostatics_capacitor'
  | 'dc_circuit_bridge'
  | 'lorentz_cyclotron'
  | 'electromagnetic_induction'
  | 'bohr_energy_levels'
  | 'nuclear_binding_halflife'
>;

/**
 * 高三選修物理 III~V（10 堂課）教室黑板 SVG 繪圖渲染器
 * @param diagramType 高三黑板圖解型別
 * @returns 對應 SVG 元件
 */
export function renderGrade12BlackboardSvg(
  diagramType: Grade12DiagramType
): React.ReactElement {
  switch (diagramType) {
    case 'standing_wave_string':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="210" y="18" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            兩端固定弦駐波（以第二諧音 n = 2 為例，弦長 L = λ）
          </text>
          {/* 左右固定牆 */}
          <rect x="44" y="34" width="8" height="66" fill="#9eb8ae" />
          <rect x="368" y="34" width="8" height="66" fill="#9eb8ae" />
          <line x1="52" y1="67" x2="368" y2="67" stroke="#9eb8ae" strokeWidth="1.2" strokeDasharray="3 3" />

          {/* 實線與虛線駐波包絡 */}
          <path d="M 52 67 Q 131 24 210 67 T 368 67" fill="none" stroke="#f7cf46" strokeWidth="2.8" />
          <path d="M 52 67 Q 131 110 210 67 T 368 67" fill="none" stroke="#5e9eff" strokeWidth="2" strokeDasharray="5 3" />

          {/* 節點 N 與腹點 A */}
          {[52, 210, 368].map((nx, idx) => (
            <g key={idx}>
              <circle cx={nx} cy="67" r="4.5" fill="#ff8585" />
              <text x={nx} y="83" fill="#ff9494" fontSize="10.5" fontWeight="700" textAnchor="middle">N</text>
            </g>
          ))}
          <text x="131" y="39" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">腹 A</text>
          <text x="289" y="39" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">腹 A</text>

          {/* 相鄰節點間距標示 */}
          <line x1="54" y1="98" x2="208" y2="98" stroke="#6ee7b7" strokeWidth="1.6" />
          <text x="131" y="112" fill="#6ee7b7" fontSize="10.8" fontWeight="700" textAnchor="middle">
            相鄰 N—N = λ / 2
          </text>
          <text x="290" y="112" fill="#e6f0ec" fontSize="10.8" textAnchor="middle">
            v = √(F / μ)
          </text>

          {/* 底部開管與閉管比對 */}
          <text x="210" y="135" fill="#5e9eff" fontSize="11.5" fontWeight="600" textAnchor="middle">
            弦與開管（兩端同為 N 或 A）：λ_n = 2L / n （諧音 1 : 2 : 3）
          </text>
          <text x="210" y="153" fill="#f7cf46" fontSize="11.5" fontWeight="600" textAnchor="middle">
            閉管（一端 N 一端 A）：λ_m = 4L / m （僅奇數諧音 1 : 3 : 5）
          </text>
        </svg>
      );

    case 'wave_doppler':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="210" y="18" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            都卜勒效應：移動波源使前方波前壓縮、後方拉長
          </text>
          {/* 偏心同心圓波前（波源向右移動） */}
          <circle cx="182" cy="76" r="56" fill="none" stroke="#9eb8ae" strokeWidth="1.5" />
          <circle cx="204" cy="76" r="38" fill="none" stroke="#5e9eff" strokeWidth="1.8" />
          <circle cx="224" cy="76" r="20" fill="none" stroke="#f7cf46" strokeWidth="2.2" />

          {/* 波源 S 與向右移動速度 v_S */}
          <circle cx="236" cy="76" r="6" fill="#ff8585" />
          <line x1="236" y1="76" x2="276" y2="76" stroke="#f7cf46" strokeWidth="2.6" />
          <polygon points="282,76 272,71 272,81" fill="#f7cf46" />
          <text x="262" y="66" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">S (v_S)</text>

          {/* 左側觀察者（遠離波源） */}
          <circle cx="48" cy="76" r="9" fill="#2e5443" stroke="#5e9eff" strokeWidth="1.8" />
          <text x="48" y="80" fill="#5e9eff" fontSize="10.5" fontWeight="700" textAnchor="middle">O₁</text>
          <text x="68" y="42" fill="#5e9eff" fontSize="11" fontWeight="600" textAnchor="middle">波源遠離</text>
          <text x="68" y="114" fill="#e6f0ec" fontSize="10.5" textAnchor="middle">λ' 變長 → f' 變低</text>

          {/* 右側觀察者（接近波源） */}
          <circle cx="372" cy="76" r="9" fill="#2e5443" stroke="#ff8585" strokeWidth="1.8" />
          <text x="372" y="80" fill="#ff9494" fontSize="10.5" fontWeight="700" textAnchor="middle">O₂</text>
          <text x="348" y="42" fill="#ff9494" fontSize="11" fontWeight="600" textAnchor="middle">波源逼近</text>
          <text x="348" y="114" fill="#f7cf46" fontSize="10.5" textAnchor="middle">λ' 縮短 → f' 變高</text>

          <text x="210" y="148" fill="#ffffff" fontSize="12" fontWeight="700" textAnchor="middle">
            f' = f × (v ± v_O) / (v ∓ v_S)   （分子改相對波速，分母改波長）
          </text>
        </svg>
      );

    case 'optics_refract_lens':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：全反射與光纖 */}
          <text x="98" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            折射與全反射 (n₁ &gt; n₂)
          </text>
          <rect x="20" y="76" width="160" height="54" fill="#5e9eff" fillOpacity="0.16" />
          <line x1="20" y1="76" x2="180" y2="76" stroke="#9eb8ae" strokeWidth="1.8" />
          <line x1="100" y1="32" x2="100" y2="128" stroke="#9eb8ae" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="150" y="66" fill="#9eb8ae" fontSize="10.5">光疏 n₂</text>
          <text x="150" y="94" fill="#5e9eff" fontSize="10.5">光密 n₁</text>
          {/* 全反射光線 */}
          <line x1="42" y1="120" x2="100" y2="76" stroke="#f7cf46" strokeWidth="2.4" />
          <polygon points="74,96 63,99 69,107" fill="#f7cf46" />
          <line x1="100" y1="76" x2="158" y2="120" stroke="#f7cf46" strokeWidth="2.4" />
          <polygon points="134,102 123,99 129,91" fill="#f7cf46" />
          <text x="72" y="106" fill="#f7cf46" fontSize="10.5">θ&gt;θ_c</text>
          <text x="100" y="148" fill="#e6f0ec" fontSize="10.8" textAnchor="middle">
            sinθ_c = n₂ / n₁（僅密→疏）
          </text>

          {/* 中央分隔線 */}
          <line x1="194" y1="16" x2="194" y2="154" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：凸透鏡成像 */}
          <text x="306" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            薄凸透鏡實像作圖
          </text>
          {/* 主軸與凸透鏡 */}
          <line x1="206" y1="80" x2="408" y2="80" stroke="#9eb8ae" strokeWidth="1.4" />
          <path d="M 302 32 Q 314 80 302 128 Q 290 80 302 32 Z" fill="#5e9eff" fillOpacity="0.22" stroke="#5e9eff" strokeWidth="1.8" />
          <circle cx="268" cy="80" r="2.8" fill="#ffffff" />
          <circle cx="336" cy="80" r="2.8" fill="#ffffff" />
          <text x="268" y="94" fill="#9eb8ae" fontSize="10" textAnchor="middle">F</text>
          <text x="336" y="94" fill="#9eb8ae" fontSize="10" textAnchor="middle">F'</text>

          {/* 實物箭頭 (p > 2f 或 > f) */}
          <line x1="230" y1="80" x2="230" y2="48" stroke="#f7cf46" strokeWidth="2.8" />
          <polygon points="230,42 225,50 235,50" fill="#f7cf46" />
          {/* 平行過焦點 + 過鏡心兩條光線 */}
          <polyline points="230,48 302,48 386,112" fill="none" stroke="#f7cf46" strokeWidth="1.6" />
          <line x1="230" y1="48" x2="386" y2="112" stroke="#6ee7b7" strokeWidth="1.6" />
          {/* 倒立實像 */}
          <line x1="364" y1="80" x2="364" y2="103" stroke="#ff8585" strokeWidth="2.6" />
          <polygon points="364,108 359,100 369,100" fill="#ff8585" />
          <text x="306" y="148" fill="#d1fae5" fontSize="10.8" textAnchor="middle">
            1/p + 1/q = 1/f；成像屏距 L ≥ 4f
          </text>
        </svg>
      );

    case 'double_slit_diffraction':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：楊氏雙狹縫干涉 */}
          <text x="104" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            楊氏雙狹縫（等距亮紋）
          </text>
          {/* 雙狹縫隔板 */}
          <line x1="48" y1="32" x2="48" y2="54" stroke="#9eb8ae" strokeWidth="4" />
          <line x1="48" y1="64" x2="48" y2="86" stroke="#9eb8ae" strokeWidth="4" />
          <line x1="48" y1="96" x2="48" y2="118" stroke="#9eb8ae" strokeWidth="4" />
          <text x="36" y="79" fill="#f7cf46" fontSize="10.5" textAnchor="end">d</text>
          {/* 光線連向螢幕 */}
          <line x1="48" y1="59" x2="162" y2="48" stroke="#f7cf46" strokeWidth="1.4" strokeDasharray="3 2" />
          <line x1="48" y1="91" x2="162" y2="48" stroke="#5e9eff" strokeWidth="1.4" strokeDasharray="3 2" />
          <line x1="48" y1="59" x2="162" y2="75" stroke="#f7cf46" strokeWidth="1.3" />
          <line x1="48" y1="91" x2="162" y2="75" stroke="#5e9eff" strokeWidth="1.3" />
          {/* 螢幕與條紋 */}
          <line x1="164" y1="30" x2="164" y2="122" stroke="#e6f0ec" strokeWidth="2.5" />
          {[36, 48, 61, 75, 89, 102, 114].map((ry, i) => (
            <rect key={i} x="168" y={ry - 3} width="12" height="6" rx="2" fill="#f7cf46" />
          ))}
          <text x="184" y="52" fill="#f7cf46" fontSize="10">Δy</text>
          <text x="104" y="138" fill="#5e9eff" fontSize="11" fontWeight="600" textAnchor="middle">
            亮紋距 Δy = Lλ / d
          </text>
          <text x="104" y="154" fill="#9eb8ae" fontSize="10" textAnchor="middle">
            d sinθ = mλ → 亮紋
          </text>

          {/* 中央分隔線 */}
          <line x1="210" y1="16" x2="210" y2="156" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：單狹縫繞射強度圖 */}
          <text x="315" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            單狹縫（中央亮帶 2 倍寬！）
          </text>
          <line x1="224" y1="116" x2="404" y2="116" stroke="#9eb8ae" strokeWidth="1.5" />
          {/* 中央高寬主峰 + 兩側較窄次峰 */}
          <path
            d="M 230 116 Q 248 92 266 116 Q 314 14 362 116 Q 380 92 398 116"
            fill="#5e9eff"
            fillOpacity="0.22"
            stroke="#f7cf46"
            strokeWidth="2.4"
          />
          <line x1="266" y1="120" x2="362" y2="120" stroke="#ff8585" strokeWidth="2" />
          <text x="314" y="106" fill="#ff9494" fontSize="10.5" fontWeight="700" textAnchor="middle">
            中央寬 2 Lλ / a
          </text>
          <text x="315" y="138" fill="#f7cf46" fontSize="11" fontWeight="600" textAnchor="middle">
            兩側第一亮帶僅 1 Lλ / a
          </text>
          <text x="315" y="154" fill="#9eb8ae" fontSize="10" textAnchor="middle">
            a sinθ = mλ (m≥1) → 暗紋
          </text>
        </svg>
      );

    case 'electrostatics_capacitor':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：球殼屏蔽 E=0, V!=0 */}
          <text x="102" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            帶電金屬球殼（靜電屏蔽）
          </text>
          <circle cx="102" cy="78" r="34" fill="#2e5443" stroke="#f7cf46" strokeWidth="2.8" />
          <circle cx="102" cy="78" r="50" fill="none" stroke="#5e9eff" strokeWidth="1.2" strokeDasharray="4 3" />
          {/* 外部輻射電力線 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                x1={102 + Math.cos(rad) * 35}
                y1={78 + Math.sin(rad) * 35}
                x2={102 + Math.cos(rad) * 52}
                y2={78 + Math.sin(rad) * 52}
                stroke="#f7cf46"
                strokeWidth="1.6"
              />
            );
          })}
          <text x="102" y="75" fill="#ffffff" fontSize="11.5" fontWeight="700" textAnchor="middle">內部 E = 0</text>
          <text x="102" y="91" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">V = kQ/R ≠ 0</text>
          <text x="102" y="148" fill="#d1fae5" fontSize="10.5" textAnchor="middle">
            等位面 ⊥ 電力線；內部等電位
          </text>

          {/* 中央分隔線 */}
          <line x1="210" y1="16" x2="210" y2="154" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：平行板電容器 */}
          <text x="315" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            平行板電容器 C = ε₀ A / d
          </text>
          <rect x="246" y="42" width="138" height="8" rx="2" fill="#ff8585" />
          <text x="394" y="49" fill="#ff9494" fontSize="11" fontWeight="700">+Q</text>
          <rect x="246" y="102" width="138" height="8" rx="2" fill="#5e9eff" />
          <text x="394" y="109" fill="#5e9eff" fontSize="11" fontWeight="700">-Q</text>
          {/* 均勻向下電場 */}
          {[268, 298, 328, 358].map((ex) => (
            <g key={ex}>
              <line x1={ex} y1="53" x2={ex} y2="94" stroke="#f7cf46" strokeWidth="1.8" />
              <polygon points={`${ex},100 ${ex - 4},91 ${ex + 4},91`} fill="#f7cf46" />
            </g>
          ))}
          <text x="234" y="79" fill="#9eb8ae" fontSize="11" textAnchor="middle">d</text>
          <text x="315" y="130" fill="#ffffff" fontSize="11" fontWeight="600" textAnchor="middle">
            接電池 V 定值 ｜ 斷電池 Q 定值(E固定)
          </text>
          <text x="315" y="148" fill="#f7cf46" fontSize="10.8" textAnchor="middle">
            儲能 U = ½CV² = Q²/(2C)
          </text>
        </svg>
      );

    case 'dc_circuit_bridge':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：真實電池 + 最大輸出功率 R=r */}
          <text x="102" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            電池內阻 r & 最大輸出功率
          </text>
          <rect x="34" y="34" width="136" height="68" rx="4" fill="none" stroke="#9eb8ae" strokeWidth="1.8" />
          {/* 左側電池 */}
          <line x1="24" y1="62" x2="44" y2="62" stroke="#f7cf46" strokeWidth="3" />
          <line x1="29" y1="70" x2="39" y2="70" stroke="#f7cf46" strokeWidth="2" />
          <text x="58" y="69" fill="#f7cf46" fontSize="11" fontWeight="700">ε, r</text>
          {/* 右側外電阻 R */}
          <rect x="160" y="54" width="20" height="28" rx="3" fill="#2e5443" stroke="#5e9eff" strokeWidth="2" />
          <text x="170" y="72" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">R</text>
          <text x="102" y="122" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">
            端電壓 V = ε - I r
          </text>
          <text x="102" y="140" fill="#f7cf46" fontSize="10.8" fontWeight="600" textAnchor="middle">
            R = r 時 P_max = ε² / (4r)
          </text>
          <text x="102" y="155" fill="#9eb8ae" fontSize="10" textAnchor="middle">
            導線拉長 n 倍 → R 變 n² 倍
          </text>

          {/* 中央分隔線 */}
          <line x1="210" y1="16" x2="210" y2="156" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：惠司同電橋 */}
          <text x="315" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            惠司同電橋（I_G = 0 平衡）
          </text>
          {/* 菱形邊 */}
          <polygon points="315,32 252,72 315,112 378,72" fill="none" stroke="#9eb8ae" strokeWidth="2" />
          {/* 中間檢流計 G */}
          <line x1="315" y1="32" x2="315" y2="112" stroke="#f7cf46" strokeWidth="1.8" />
          <circle cx="315" cy="72" r="11" fill="#233b30" stroke="#f7cf46" strokeWidth="2" />
          <text x="315" y="76" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">G</text>
          <text x="275" y="48" fill="#ffffff" fontSize="10.5" textAnchor="middle">R₁</text>
          <text x="355" y="48" fill="#ffffff" fontSize="10.5" textAnchor="middle">R₂</text>
          <text x="275" y="102" fill="#ffffff" fontSize="10.5" textAnchor="middle">R₃</text>
          <text x="355" y="102" fill="#ffffff" fontSize="10.5" textAnchor="middle">R₄</text>
          <text x="315" y="135" fill="#6ee7b7" fontSize="11.5" fontWeight="700" textAnchor="middle">
            對角乘積相等：R₁ R₄ = R₂ R₃
          </text>
          <text x="315" y="153" fill="#9eb8ae" fontSize="10.2" textAnchor="middle">
            安培計並聯小分流；伏特計串聯大分壓
          </text>
        </svg>
      );

    case 'lorentz_cyclotron':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="210" y="18" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            帶電粒子在均勻磁場 ⊗B 中的等速率圓周迴旋
          </text>
          {/* 磁場網格 ⊗ */}
          {[32, 76, 190].map((bx) =>
            [44, 82, 120].map((by) => (
              <text key={`${bx}-${by}`} x={bx} y={by} fill="#3b5c4d" fontSize="14" fontWeight="700" textAnchor="middle">
                ⊗
              </text>
            ))
          )}
          <text x="106" y="148" fill="#9eb8ae" fontSize="10.8" textAnchor="middle">均勻磁場 B (垂直入紙面)</text>

          {/* 圓周軌跡 */}
          <circle cx="110" cy="80" r="44" fill="none" stroke="#5e9eff" strokeWidth="2.4" strokeDasharray="5 3" />
          <circle cx="154" cy="80" r="6" fill="#f7cf46" />
          <text x="164" y="84" fill="#f7cf46" fontSize="11" fontWeight="700">+q</text>
          {/* 向上速度 v 與向心磁力 F_B */}
          <line x1="154" y1="80" x2="154" y2="42" stroke="#ffffff" strokeWidth="2.4" />
          <polygon points="154,35 149,44 159,44" fill="#ffffff" />
          <text x="162" y="45" fill="#ffffff" fontSize="11" fontWeight="700">v</text>

          <line x1="154" y1="80" x2="120" y2="80" stroke="#ff8585" strokeWidth="2.6" />
          <polygon points="113,80 122,75 122,85" fill="#ff8585" />
          <text x="132" y="70" fill="#ff9494" fontSize="10.5" fontWeight="700" textAnchor="middle">F=qvB</text>

          {/* 右側公式區 */}
          <rect x="206" y="30" width="202" height="120" rx="8" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.4" />
          <text x="307" y="50" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">
            勞侖茲力 ⊥ v（磁力永遠不作功！）
          </text>
          <text x="215" y="74" fill="#f7cf46" fontSize="10.8" fontWeight="700">
            R = mv/(qB) = √(2mE_k)/(qB)
          </text>
          <text x="215" y="96" fill="#ffffff" fontSize="10.8" fontWeight="700">
            週期 T = 2πm/(qB)（與 v 無關！）
          </text>
          <text x="218" y="118" fill="#6ee7b7" fontSize="11">
            長直磁場 μ₀I/(2πr) ｜ 螺線管 μ₀nI
          </text>
          <text x="218" y="136" fill="#e6f0ec" fontSize="10.5">
            同動能質子與 α 粒子半徑比 = 1 : 1
          </text>
        </svg>
      );

    case 'electromagnetic_induction':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="210" y="18" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            金屬滑桿切割磁力線：動生電動勢 ε = BLv 與安培磁阻力
          </text>
          {/* U 型金屬導軌 */}
          <polyline points="204,42 46,42 46,120 204,120" fill="none" stroke="#9eb8ae" strokeWidth="3" />
          <rect x="38" y="66" width="16" height="30" rx="2" fill="#2e5443" stroke="#5e9eff" strokeWidth="1.8" />
          <text x="46" y="85" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">R</text>
          {/* 磁場符號 */}
          {[76, 114, 152].map((bx) =>
            [64, 102].map((by) => (
              <text key={`${bx}-${by}`} x={bx} y={by} fill="#3b5c4d" fontSize="14" fontWeight="700" textAnchor="middle">
                ⊗
              </text>
            ))
          )}
          {/* 右側滑桿 L */}
          <line x1="158" y1="36" x2="158" y2="126" stroke="#f7cf46" strokeWidth="5" />
          <text x="148" y="84" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="end">L</text>
          {/* 速度 v 與向左磁阻力 F_B */}
          <line x1="162" y1="81" x2="202" y2="81" stroke="#ffffff" strokeWidth="2.6" />
          <polygon points="208,81 198,76 198,86" fill="#ffffff" />
          <text x="190" y="72" fill="#ffffff" fontSize="11" fontWeight="700">v →</text>

          <line x1="154" y1="62" x2="120" y2="62" stroke="#ff8585" strokeWidth="2.4" />
          <polygon points="113,62 123,57 123,67" fill="#ff8585" />
          <text x="134" y="54" fill="#ff9494" fontSize="10.5" fontWeight="700" textAnchor="middle">F_B</text>

          {/* 右側公式區 */}
          <rect x="218" y="32" width="190" height="114" rx="8" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.4" />
          <text x="313" y="54" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            ε = -N (ΔΦ / Δt)
          </text>
          <text x="313" y="76" fill="#ffffff" fontSize="11.5" fontWeight="600" textAnchor="middle">
            平移滑桿：ε = B L v
          </text>
          <text x="313" y="96" fill="#5e9eff" fontSize="11.5" fontWeight="600" textAnchor="middle">
            單端旋轉桿：ε = ½ B ω L²
          </text>
          <text x="313" y="118" fill="#ff9494" fontSize="11" fontWeight="600" textAnchor="middle">
            安培阻力 F_B = B² L² v / R
          </text>
          <text x="313" y="136" fill="#6ee7b7" fontSize="10.5" textAnchor="middle">
            功率平衡：F_外 v = I² R = ε² / R
          </text>
        </svg>
      );

    case 'bohr_energy_levels':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="115" y="18" fill="#f7cf46" fontSize="12" fontWeight="700" textAnchor="middle">
            波耳氫原子能階 E_n = -13.6 / n² (eV)
          </text>
          {/* 5 條橫向能階線 */}
          {[
            { y: 34, n: 'n = ∞', e: '0 eV' },
            { y: 52, n: 'n = 4', e: '-0.85' },
            { y: 70, n: 'n = 3', e: '-1.51' },
            { y: 98, n: 'n = 2', e: '-3.40' },
            { y: 140, n: 'n = 1', e: '-13.6 eV' },
          ].map((lv, idx) => (
            <g key={idx}>
              <line x1="56" y1={lv.y} x2="250" y2={lv.y} stroke="#9eb8ae" strokeWidth={idx === 4 ? 2.4 : 1.5} strokeDasharray={idx === 0 ? '4 3' : undefined} />
              <text x="50" y={lv.y + 4} fill="#e6f0ec" fontSize="10.5" textAnchor="end">{lv.n}</text>
              <text x="256" y={lv.y + 4} fill="#9eb8ae" fontSize="10.5">{lv.e}</text>
            </g>
          ))}

          {/* 三組光譜躍遷箭頭 */}
          {/* 萊曼系 n->1 */}
          <line x1="92" y1="98" x2="92" y2="133" stroke="#d8b4fe" strokeWidth="2.4" />
          <polygon points="92,139 88,131 96,131" fill="#d8b4fe" />
          <line x1="112" y1="70" x2="112" y2="133" stroke="#d8b4fe" strokeWidth="2" />
          <polygon points="112,139 108,131 116,131" fill="#d8b4fe" />
          <text x="102" y="155" fill="#d8b4fe" fontSize="10.5" fontWeight="700" textAnchor="middle">萊曼(UV)</text>

          {/* 巴耳末系 n->2 */}
          <line x1="162" y1="70" x2="162" y2="91" stroke="#5e9eff" strokeWidth="2.4" />
          <polygon points="162,97 158,89 166,89" fill="#5e9eff" />
          <line x1="182" y1="52" x2="182" y2="91" stroke="#5e9eff" strokeWidth="2" />
          <polygon points="182,97 178,89 186,89" fill="#5e9eff" />
          <text x="174" y="114" fill="#5e9eff" fontSize="10.5" fontWeight="700" textAnchor="middle">巴耳末(可見光)</text>

          {/* 帕申系 n->3 */}
          <line x1="224" y1="52" x2="224" y2="63" stroke="#ff8585" strokeWidth="2.4" />
          <polygon points="224,69 220,61 228,61" fill="#ff8585" />
          <text x="228" y="84" fill="#ff9494" fontSize="10" fontWeight="700" textAnchor="middle">帕申(IR)</text>

          {/* 右側比例整理 */}
          <rect x="300" y="28" width="110" height="122" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.2" />
          <text x="355" y="48" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">波耳量子化</text>
          <text x="308" y="68" fill="#ffffff" fontSize="10.5">2πr_n = nλ</text>
          <text x="308" y="87" fill="#5e9eff" fontSize="10.5">r_n ∝ n² (0.53Å)</text>
          <text x="308" y="106" fill="#6ee7b7" fontSize="10.5">v_n ∝ 1 / n</text>
          <text x="308" y="125" fill="#ff9494" fontSize="10.5">譜線 n(n-1)/2</text>
          <text x="308" y="143" fill="#e6f0ec" fontSize="10">類氫 × Z²</text>
        </svg>
      );

    case 'nuclear_binding_halflife':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：每核子平均結合能曲線 */}
          <text x="104" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            平均每核子結合能曲線
          </text>
          <line x1="24" y1="118" x2="196" y2="118" stroke="#9eb8ae" strokeWidth="1.5" />
          <line x1="24" y1="30" x2="24" y2="118" stroke="#9eb8ae" strokeWidth="1.5" />
          <path d="M 28 112 Q 52 38 78 40 Q 130 46 190 58" fill="none" stroke="#f7cf46" strokeWidth="2.4" />
          <circle cx="75" cy="40" r="4.5" fill="#6ee7b7" />
          <text x="75" y="32" fill="#6ee7b7" fontSize="10.5" fontWeight="700" textAnchor="middle">⁵⁶Fe (最穩)</text>
          <text x="52" y="100" fill="#5e9eff" fontSize="10">融合→</text>
          <text x="150" y="75" fill="#ff9494" fontSize="10">←分裂</text>
          <text x="108" y="135" fill="#e6f0ec" fontSize="10.5" textAnchor="middle">質量數 A</text>
          <text x="108" y="152" fill="#d1fae5" fontSize="10.2" textAnchor="middle">穿透 γ&gt;β&gt;α ｜ 游離 α&gt;β&gt;γ</text>

          {/* 中央分隔線 */}
          <line x1="212" y1="16" x2="212" y2="156" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：放射性半衰期衰減曲線 */}
          <text x="316" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            半衰期 N = N₀ (½)^(t/T)
          </text>
          <line x1="236" y1="118" x2="404" y2="118" stroke="#9eb8ae" strokeWidth="1.5" />
          <line x1="236" y1="30" x2="236" y2="118" stroke="#9eb8ae" strokeWidth="1.5" />
          <path d="M 236 38 Q 272 86 384 112" fill="none" stroke="#5e9eff" strokeWidth="2.5" />
          {/* T, 2T, 3T 節點 */}
          <circle cx="282" cy="78" r="3.5" fill="#f7cf46" />
          <text x="282" y="132" fill="#9eb8ae" fontSize="10" textAnchor="middle">T</text>
          <text x="282" y="70" fill="#f7cf46" fontSize="10" textAnchor="middle">½N₀</text>
          <circle cx="328" cy="98" r="3.5" fill="#f7cf46" />
          <text x="328" y="132" fill="#9eb8ae" fontSize="10" textAnchor="middle">2T</text>
          <text x="328" y="90" fill="#f7cf46" fontSize="10" textAnchor="middle">¼N₀</text>
          <circle cx="374" cy="108" r="3.5" fill="#f7cf46" />
          <text x="374" y="132" fill="#9eb8ae" fontSize="10" textAnchor="middle">3T</text>
          <text x="316" y="152" fill="#f7cf46" fontSize="10.2" textAnchor="middle">
            X 射線截止 λ_min = 12400 / V (Å)
          </text>
        </svg>
      );
  }
}
