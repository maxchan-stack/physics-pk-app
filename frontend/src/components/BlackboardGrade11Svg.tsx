import React from 'react';
import { DiagramType } from '../types/physics-types';

export type Grade11DiagramType = Extract<
  DiagramType,
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
>;

/**
 * 高二選修物理 I・II（17 堂課）教室黑板 SVG 繪圖渲染器
 * @param diagramType 高二黑板圖解型別
 * @returns 對應 SVG 元件
 */
export function renderGrade11BlackboardSvg(
  diagramType: Grade11DiagramType
): React.ReactElement {
  switch (diagramType) {
    case 'si_dimensions':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：SI 七大基本單位 */}
          <text x="102" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            SI 七大基本單位
          </text>
          {[
            { x: 18, y: 28, txt: '長度 m', hl: false },
            { x: 108, y: 28, txt: '質量 kg', hl: false },
            { x: 18, y: 54, txt: '時間 s', hl: false },
            { x: 108, y: 54, txt: '電流 A ★', hl: true },
            { x: 18, y: 80, txt: '溫度 K', hl: false },
            { x: 108, y: 80, txt: '物量 mol', hl: false },
            { x: 18, y: 106, txt: '光強 cd', hl: false },
          ].map((u, idx) => (
            <g key={idx}>
              <rect
                x={u.x}
                y={u.y}
                width="82"
                height="20"
                rx="4"
                fill={u.hl ? '#f7cf46' : '#2e5443'}
                fillOpacity={u.hl ? 0.25 : 1}
                stroke={u.hl ? '#f7cf46' : '#9eb8ae'}
                strokeWidth="1.2"
              />
              <text
                x={u.x + 41}
                y={u.y + 14}
                fill={u.hl ? '#f7cf46' : '#ffffff'}
                fontSize="10.8"
                fontWeight={u.hl ? '700' : '500'}
                textAnchor="middle"
              >
                {u.txt}
              </text>
            </g>
          ))}
          <text x="104" y="146" fill="#ff9494" fontSize="10.2" textAnchor="middle">
            注意：電流 A 是基本量（C=A·s 導出）
          </text>

          {/* 中央箭頭與分隔線 */}
          <line x1="205" y1="16" x2="205" y2="154" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：力學導出因次樹 */}
          <text x="312" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            力學因次推導 [M^a L^b T^c]
          </text>
          <rect x="220" y="28" width="184" height="22" rx="4" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.2" />
          <text x="312" y="43" fill="#e6f0ec" fontSize="11" textAnchor="middle">
            速度 [v] = L T⁻¹  →  加速度 [a] = L T⁻²
          </text>
          <rect x="220" y="58" width="184" height="22" rx="4" fill="#2e5443" stroke="#5e9eff" strokeWidth="1.2" />
          <text x="312" y="73" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">
            力 [F] = m a = M L T⁻² (牛頓 N)
          </text>
          <rect x="220" y="88" width="184" height="22" rx="4" fill="#36634f" stroke="#f7cf46" strokeWidth="1.4" />
          <text x="312" y="103" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">
            功・能・力矩 [E]=[τ] = M L² T⁻²
          </text>
          <rect x="220" y="118" width="184" height="22" rx="4" fill="#2e5443" stroke="#6ee7b7" strokeWidth="1.2" />
          <text x="312" y="133" fill="#6ee7b7" fontSize="10.8" fontWeight="600" textAnchor="middle">
            功率 [P]=ML²T⁻³ ｜ 壓強 [P]=ML⁻¹T⁻²
          </text>
          <text x="312" y="155" fill="#d1fae5" fontSize="10.2" textAnchor="middle">
            普朗克常數 [h] = [E·T] = 角動量因次
          </text>
        </svg>
      );

    case 'uncertainty_ruler':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：B類不確定度與直尺最小刻度 */}
          <text x="102" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            B 類不確定度（儀器刻度 d）
          </text>
          <rect x="20" y="42" width="166" height="44" rx="3" fill="#36634f" stroke="#9eb8ae" strokeWidth="1.6" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tick) => {
            const tx = 34 + tick * 14;
            const h = tick % 5 === 0 ? 18 : 10;
            return <line key={tick} x1={tx} y1="42" x2={tx} y2={42 + h} stroke="#ffffff" strokeWidth={tick % 5 === 0 ? 1.8 : 1.2} />;
          })}
          <text x="34" y="77" fill="#e6f0ec" fontSize="10" textAnchor="middle">0</text>
          <text x="104" y="77" fill="#e6f0ec" fontSize="10" textAnchor="middle">5</text>
          <text x="174" y="77" fill="#e6f0ec" fontSize="10" textAnchor="middle">10</text>
          {/* 單格寬 d */}
          <line x1="62" y1="36" x2="76" y2="36" stroke="#ff8585" strokeWidth="2.4" />
          <text x="69" y="32" fill="#ff9494" fontSize="10.5" fontWeight="700" textAnchor="middle">d</text>
          <text x="102" y="108" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            u_B = d / (2√3) ≈ 0.29 d
          </text>
          <text x="102" y="126" fill="#e6f0ec" fontSize="10.5" textAnchor="middle">
            單次測量均適用（非 0.5 d!）
          </text>

          {/* 中央分隔線 */}
          <line x1="206" y1="16" x2="206" y2="154" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：A類不確定度與組合 */}
          <text x="312" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            A 類不確定度（重複 N 次）
          </text>
          <line x1="224" y1="98" x2="400" y2="98" stroke="#9eb8ae" strokeWidth="1.4" />
          <path d="M 234 98 Q 272 95 288 64 Q 312 24 336 64 Q 352 95 390 98" fill="#5e9eff" fillOpacity="0.22" stroke="#5e9eff" strokeWidth="2.2" />
          <line x1="312" y1="36" x2="312" y2="98" stroke="#f7cf46" strokeWidth="1.6" strokeDasharray="3 2" />
          <text x="312" y="112" fill="#f7cf46" fontSize="10.5" fontWeight="700" textAnchor="middle">平均 x̄</text>
          <text x="312" y="129" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            u_A = s / √N
          </text>
          <text x="210" y="153" fill="#6ee7b7" fontSize="11" fontWeight="700" textAnchor="middle">
            組合 u_c = √(u_A² + u_B²) ｜ 最佳估計值末位與 u_c 小數位數對齊！
          </text>
        </svg>
      );

    case 'displacement_numberline':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="195" y="28" fill="#f7cf46" fontSize="13.5" fontWeight="500" textAnchor="middle">
            先向右 4 m
          </text>
          <line x1="90" y1="40" x2="292" y2="40" stroke="#f7cf46" strokeWidth="3" />
          <polygon points="306,40 290,32 290,48" fill="#f7cf46" />

          <line x1="305" y1="58" x2="156" y2="58" stroke="#f7cf46" strokeWidth="3" />
          <polygon points="142,58 158,50 158,66" fill="#f7cf46" />
          <text x="225" y="78" fill="#f7cf46" fontSize="13.5" fontWeight="500" textAnchor="middle">
            再向左 3 m
          </text>

          <line x1="68" y1="96" x2="368" y2="96" stroke="#9eb8ae" strokeWidth="1.6" />
          {[0, 1, 2, 3, 4, 5].map((meter) => {
            const xPos = 90 + meter * 53;
            return (
              <g key={meter}>
                <line x1={xPos} y1="90" x2={xPos} y2="102" stroke="#9eb8ae" strokeWidth="1.6" />
                <text x={xPos} y="118" fill="#9eb8ae" fontSize="13" textAnchor="middle">
                  {meter} m
                </text>
              </g>
            );
          })}

          <line x1="90" y1="142" x2="128" y2="142" stroke="#4f8df9" strokeWidth="3.5" />
          <polygon points="145,142 125,132 125,152" fill="#4f8df9" />
          <text x="152" y="147" fill="#5e9eff" fontSize="13.5" fontWeight="600">
            位移 = +1 m   路徑長 = 7 m
          </text>
        </svg>
      );

    case 'uniform_accel_vt':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="115" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            等加速度 v-t 圖（面積=位移・斜率=a）
          </text>
          {/* v-t 座標軸 */}
          <line x1="42" y1="126" x2="210" y2="126" stroke="#9eb8ae" strokeWidth="1.6" />
          <line x1="42" y1="26" x2="42" y2="126" stroke="#9eb8ae" strokeWidth="1.6" />
          <text x="36" y="34" fill="#9eb8ae" fontSize="11" textAnchor="end">v</text>
          <text x="220" y="129" fill="#9eb8ae" fontSize="10.5" textAnchor="end">t軸</text>

          {/* 梯形面積填色 */}
          <polygon points="42,96 186,40 186,126 42,126" fill="#5e9eff" fillOpacity="0.22" />
          <line x1="42" y1="96" x2="186" y2="40" stroke="#f7cf46" strokeWidth="3" />
          <line x1="114" y1="68" x2="114" y2="126" stroke="#6ee7b7" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="114" cy="68" r="4" fill="#6ee7b7" />

          <text x="36" y="100" fill="#f7cf46" fontSize="10.5" textAnchor="end">v₀</text>
          <text x="36" y="44" fill="#f7cf46" fontSize="10.5" textAnchor="end">v</text>
          <text x="114" y="140" fill="#6ee7b7" fontSize="10" textAnchor="middle">t/2</text>
          <text x="186" y="140" fill="#9eb8ae" fontSize="10" textAnchor="middle">t</text>
          <text x="110" y="54" fill="#f7cf46" fontSize="10.5" fontWeight="700" textAnchor="middle">斜率 = a</text>
          <text x="150" y="102" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">面積=Δx</text>

          {/* 右側三大公式與黃金比例 */}
          <rect x="232" y="24" width="176" height="122" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.3" />
          <text x="320" y="44" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">三大核心公式</text>
          <text x="242" y="64" fill="#ffffff" fontSize="11">① v = v₀ + a t</text>
          <text x="242" y="83" fill="#ffffff" fontSize="11">② Δx = [(v₀+v)/2] t</text>
          <text x="242" y="102" fill="#5e9eff" fontSize="11" fontWeight="600">③ v² = v₀² + 2 a Δx</text>
          <text x="242" y="121" fill="#6ee7b7" fontSize="10.5">v_t/2 = (v₀+v)/2 = v_avg</text>
          <text x="242" y="139" fill="#ff9494" fontSize="10.2">v₀=0 各秒位移比 1:3:5</text>
          <text x="122" y="155" fill="#d1fae5" fontSize="10.5" textAnchor="middle">
            無時間條件立刻用第③式！
          </text>
        </svg>
      );

    case 'vertical_throw_symmetry':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="115" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            鉛直上拋與自由落體時空對稱性
          </text>
          <line x1="28" y1="136" x2="218" y2="136" stroke="#9eb8ae" strokeWidth="2" />
          {/* 對稱上升下落拋物線視覺展開 */}
          <path d="M 62 136 Q 118 14 174 136" fill="none" stroke="#f7cf46" strokeWidth="2.6" strokeDasharray="5 3" />
          <circle cx="118" cy="75" r="5" fill="#ffffff" />
          <text x="118" y="62" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">最高點 v = 0</text>
          <line x1="118" y1="75" x2="118" y2="104" stroke="#ff8585" strokeWidth="2.6" />
          <polygon points="118,111 113,102 123,102" fill="#ff8585" />
          <text x="126" y="100" fill="#ff9494" fontSize="11" fontWeight="700">a = g ↓</text>

          {/* 同高度對稱虛線 */}
          <line x1="76" y1="98" x2="160" y2="98" stroke="#5e9eff" strokeWidth="1.4" strokeDasharray="3 2" />
          <circle cx="80" cy="98" r="4" fill="#6ee7b7" />
          <circle cx="156" cy="98" r="4" fill="#5e9eff" />
          <text x="58" y="96" fill="#6ee7b7" fontSize="10.5" textAnchor="end">v₀↑</text>
          <text x="176" y="96" fill="#5e9eff" fontSize="10.5">v₀↓</text>
          <text x="118" y="152" fill="#d1fae5" fontSize="10.5" textAnchor="middle">
            同高度速率等大：t_上 = t_下 = v₀/g
          </text>

          {/* 右側秒殺關係式 */}
          <rect x="226" y="26" width="182" height="122" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.3" />
          <text x="317" y="46" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">大考對稱秒殺公式</text>
          <text x="236" y="68" fill="#f7cf46" fontSize="11">H = v₀²/(2g) = ⅛ g T²</text>
          <text x="236" y="90" fill="#ffffff" fontSize="10.8">同高上拋 t₁、下拋 t₂：</text>
          <text x="242" y="107" fill="#6ee7b7" fontSize="11" fontWeight="700">自由落體時間 t = √(t₁ t₂)</text>
          <text x="236" y="128" fill="#ff9494" fontSize="10.5">空中兩球相對加速度 a_rel = 0</text>
          <text x="242" y="142" fill="#e6f0ec" fontSize="10.2">⇒ 相對等速相遇 t = H / v_rel</text>
        </svg>
      );

    case 'horizontal_projectile':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="210" y="17" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            水平拋射運動獨立性（水平等速 × 鉛直自由落體）
          </text>
          {/* 懸崖高 H 與地面 */}
          <rect x="30" y="42" width="44" height="92" fill="#36634f" stroke="#9eb8ae" strokeWidth="1.5" />
          <line x1="22" y1="134" x2="262" y2="134" stroke="#9eb8ae" strokeWidth="2" />
          <text x="52" y="92" fill="#e6f0ec" fontSize="11" textAnchor="middle">H</text>

          {/* 初速 v0 與拋物線 */}
          <line x1="74" y1="42" x2="112" y2="42" stroke="#5e9eff" strokeWidth="2.8" />
          <polygon points="118,42 109,38 109,46" fill="#5e9eff" />
          <text x="98" y="34" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">v₀</text>
          <path d="M 74 42 Q 164 44 218 134" fill="none" stroke="#f7cf46" strokeWidth="2.6" />

          {/* 位移正中點與切線反向延伸定理 */}
          <line x1="146" y1="42" x2="218" y2="134" stroke="#ff8585" strokeWidth="1.6" strokeDasharray="4 3" />
          <line x1="74" y1="42" x2="218" y2="134" stroke="#6ee7b7" strokeWidth="1.4" strokeDasharray="3 3" />
          <circle cx="146" cy="42" r="4" fill="#ff8585" />
          <text x="150" y="34" fill="#ff9494" fontSize="10.5" fontWeight="700">x / 2</text>
          <text x="224" y="128" fill="#f7cf46" fontSize="10.5">θ</text>
          <text x="108" y="148" fill="#6ee7b7" fontSize="10.8" fontWeight="600" textAnchor="middle">
            速度角 tanθ = 2 × 位移角 tanα
          </text>

          {/* 右側公式區 */}
          <rect x="266" y="28" width="144" height="122" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.3" />
          <text x="338" y="47" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">平拋重要公式</text>
          <text x="275" y="67" fill="#ffffff" fontSize="10.8">時間 t = √(2H / g)</text>
          <text x="275" y="86" fill="#f7cf46" fontSize="10.8">射程 R = v₀ √(2H / g)</text>
          <text x="275" y="106" fill="#e6f0ec" fontSize="10.5">v = √(v₀² + (gt)²)</text>
          <text x="275" y="125" fill="#6ee7b7" fontSize="10.5">斜面平拋：y/x = tanθ</text>
          <text x="275" y="142" fill="#ff9494" fontSize="10.2">曲率 ρ = v² / g_⊥</text>
        </svg>
      );

    case 'projectile_parabola':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 地面與坐標軸 */}
          <line x1="40" y1="132" x2="386" y2="132" stroke="#9eb8ae" strokeWidth="2" />
          <line x1="52" y1="20" x2="52" y2="136" stroke="#9eb8ae" strokeWidth="1.4" strokeDasharray="4 4" />
          {/* 互餘角軌道 (90°-θ，較高較窄但射程相同) */}
          <path d="M 52 132 Q 205 -52 358 132" fill="none" stroke="#5e9eff" strokeWidth="1.7" strokeDasharray="4 3" opacity="0.7" />
          <text x="160" y="34" fill="#5e9eff" fontSize="10.5" opacity="0.9">90°-θ（等射程）</text>
          {/* 主拋物線軌跡 */}
          <path d="M 52 132 Q 205 -12 358 132" fill="none" stroke="#f7cf46" strokeWidth="2.8" />
          {/* 初速度向量 */}
          <line x1="52" y1="132" x2="104" y2="76" stroke="#5e9eff" strokeWidth="3" />
          <polygon points="110,70 96,75 106,84" fill="#5e9eff" />
          <text x="102" y="64" fill="#5e9eff" fontSize="12.5" fontWeight="600">v₀ (仰角 θ)</text>
          {/* 最高點速度與重力 */}
          <circle cx="205" cy="60" r="5" fill="#f7cf46" />
          <line x1="205" y1="60" x2="256" y2="60" stroke="#4f8df9" strokeWidth="2.8" />
          <polygon points="264,60 252,54 252,66" fill="#4f8df9" />
          <text x="275" y="48" fill="#5e9eff" fontSize="12" textAnchor="middle">
            最高點 v_x = v₀cosθ (v_y = 0)
          </text>
          <line x1="205" y1="60" x2="205" y2="98" stroke="#ff8585" strokeWidth="2.5" />
          <polygon points="205,106 199,95 211,95" fill="#ff8585" />
          <text x="234" y="96" fill="#ff9494" fontSize="12">a = g 向下</text>
          <text x="210" y="152" fill="#d1fae5" fontSize="11.5" textAnchor="middle">
            R = v₀²sin2θ / g （45° 最遠）｜ 互餘角：R = 4√(H₁H₂)
          </text>
        </svg>
      );

    case 'circular_shm_projection':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="210" y="17" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            簡諧運動 (SHM) 為等速率圓周在直徑上的投影
          </text>
          {/* 左側參考圓 */}
          <circle cx="88" cy="82" r="46" fill="none" stroke="#5e9eff" strokeWidth="2" />
          <line x1="34" y1="82" x2="142" y2="82" stroke="#9eb8ae" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="88" y1="28" x2="88" y2="136" stroke="#9eb8ae" strokeWidth="1.2" strokeDasharray="3 3" />
          {/* 30° 參考位置 */}
          <line x1="88" y1="82" x2="128" y2="59" stroke="#f7cf46" strokeWidth="2" />
          <circle cx="128" cy="59" r="5" fill="#f7cf46" />
          {/* 水平投影虛線至右側 SHM 軸 */}
          <line x1="128" y1="59" x2="210" y2="59" stroke="#6ee7b7" strokeWidth="1.6" strokeDasharray="4 3" />
          <line x1="88" y1="36" x2="210" y2="36" stroke="#9eb8ae" strokeWidth="1.2" strokeDasharray="2 3" />
          <line x1="88" y1="128" x2="210" y2="128" stroke="#9eb8ae" strokeWidth="1.2" strokeDasharray="2 3" />
          <text x="88" y="148" fill="#5e9eff" fontSize="10.5" textAnchor="middle">a_c = rω² = v²/r</text>

          {/* 右側 SHM 鉛直軌道 */}
          <line x1="210" y1="34" x2="210" y2="130" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="210" cy="36" r="3.5" fill="#ff8585" />
          <circle cx="210" cy="82" r="4" fill="#6ee7b7" />
          <circle cx="210" cy="59" r="5" fill="#f7cf46" />
          <circle cx="210" cy="128" r="3.5" fill="#ff8585" />
          <text x="218" y="40" fill="#ff9494" fontSize="10">+A (a_max)</text>
          <text x="218" y="62" fill="#f7cf46" fontSize="10">A/2 (T/12)</text>
          <text x="218" y="85" fill="#6ee7b7" fontSize="10">0 (v_max)</text>
          <text x="218" y="131" fill="#ff9494" fontSize="10">-A</text>

          {/* 最右側關鍵公式 */}
          <rect x="282" y="28" width="128" height="114" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.3" />
          <text x="346" y="48" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">SHM 黃金式</text>
          <text x="290" y="68" fill="#ffffff" fontSize="10.5">a(x) = -ω² x</text>
          <text x="290" y="87" fill="#5e9eff" fontSize="10.5">v_max = A ω</text>
          <text x="290" y="106" fill="#ff9494" fontSize="10.5">a_max = A ω²</text>
          <text x="290" y="125" fill="#6ee7b7" fontSize="10">彈簧 T=2π√(m/k)</text>
          <text x="290" y="138" fill="#e6f0ec" fontSize="10">單擺 T=2π√(L/g)</text>
          <text x="295" y="156" fill="#d1fae5" fontSize="10" textAnchor="middle">0→A/2 耗 T/12；A/2→A 耗 T/6</text>
        </svg>
      );

    case 'newton_force_block':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <line x1="35" y1="120" x2="385" y2="120" stroke="#9eb8ae" strokeWidth="2" />
          <line x1="45" y1="82" x2="108" y2="82" stroke="#f7cf46" strokeWidth="3.5" />
          <polygon points="118,82 104,74 104,90" fill="#f7cf46" />
          <text x="76" y="68" fill="#f7cf46" fontSize="14" fontWeight="700" textAnchor="middle">
            外力 F
          </text>
          <rect x="120" y="52" width="76" height="68" rx="4" fill="#2e5443" stroke="#9eb8ae" strokeWidth="2" />
          <text x="158" y="90" fill="#ffffff" fontSize="15" fontWeight="700" textAnchor="middle">
            m₁
          </text>
          <rect x="198" y="38" width="98" height="82" rx="4" fill="#36634f" stroke="#f7cf46" strokeWidth="2" />
          <text x="247" y="84" fill="#ffffff" fontSize="15" fontWeight="700" textAnchor="middle">
            m₂
          </text>
          <line x1="198" y1="82" x2="235" y2="82" stroke="#5e9eff" strokeWidth="3" />
          <polygon points="244,82 232,75 232,89" fill="#5e9eff" />
          <text x="354" y="65" fill="#5e9eff" fontSize="12.5" fontWeight="600" textAnchor="middle">
            內力 N = [m₂/(m₁+m₂)] F
          </text>
          <text x="210" y="145" fill="#f7cf46" fontSize="13" textAnchor="middle">
            共同加速度 a = F / (m₁ + m₂) ｜ 彈簧剪斷瞬間彈力不變！
          </text>
        </svg>
      );

    case 'friction_elevator':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：靜摩擦與動摩擦曲線 */}
          <text x="102" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            摩擦力 f 與外力 F_外 關係
          </text>
          <line x1="34" y1="124" x2="196" y2="124" stroke="#9eb8ae" strokeWidth="1.5" />
          <line x1="34" y1="32" x2="34" y2="124" stroke="#9eb8ae" strokeWidth="1.5" />
          <text x="28" y="38" fill="#9eb8ae" fontSize="10.5" textAnchor="end">f</text>
          <text x="196" y="137" fill="#9eb8ae" fontSize="10.5" textAnchor="end">F_外</text>
          {/* f=F 45° 斜線至最大靜摩擦峰值，再降至動摩擦 */}
          <polyline points="34,124 102,44 102,68 188,68" fill="none" stroke="#f7cf46" strokeWidth="2.5" />
          <circle cx="102" cy="44" r="4" fill="#ff8585" />
          <text x="108" y="40" fill="#ff9494" fontSize="10.5" fontWeight="700">f_s,max = μ_s N</text>
          <text x="148" y="60" fill="#5e9eff" fontSize="10.5" fontWeight="700" textAnchor="middle">f_k = μ_k N</text>
          <text x="64" y="88" fill="#6ee7b7" fontSize="10" textAnchor="middle">f_s = F_外</text>
          <text x="105" y="152" fill="#d1fae5" fontSize="10.5" textAnchor="middle">
            斜面臨界滑動：μ_s = tanθ
          </text>

          {/* 中央分隔線 */}
          <line x1="210" y1="16" x2="210" y2="156" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：電梯視重 & 水平加速擺 */}
          <text x="315" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            視重（超重 / 失重）與假想力
          </text>
          <rect x="242" y="36" width="66" height="72" rx="4" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.8" />
          <rect x="252" y="96" width="46" height="8" fill="#f7cf46" />
          <circle cx="275" cy="64" r="7" fill="#e6f0ec" />
          <line x1="275" y1="71" x2="275" y2="96" stroke="#e6f0ec" strokeWidth="3" />
          <line x1="275" y1="36" x2="275" y2="24" stroke="#9eb8ae" strokeWidth="2" />

          <text x="362" y="54" fill="#ff9494" fontSize="11" fontWeight="700" textAnchor="middle">a ↑ 超重</text>
          <text x="362" y="70" fill="#ffffff" fontSize="10.8" textAnchor="middle">N = m(g + a)</text>
          <text x="362" y="94" fill="#5e9eff" fontSize="11" fontWeight="700" textAnchor="middle">a ↓ 失重</text>
          <text x="362" y="110" fill="#ffffff" fontSize="10.8" textAnchor="middle">N = m(g - a)</text>
          <text x="315" y="135" fill="#6ee7b7" fontSize="10.5" textAnchor="middle">
            水平加速車廂單擺：a = g tanθ
          </text>
          <text x="315" y="152" fill="#f7cf46" fontSize="10.2" textAnchor="middle">
            自由落體電梯內視重 N = 0
          </text>
        </svg>
      );

    case 'gravity_field_profile':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左側：地球剖面 */}
          <text x="86" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            均勻星球內部與外部重力
          </text>
          <circle cx="78" cy="78" r="38" fill="#2f5e4e" stroke="#f7cf46" strokeWidth="2.2" />
          <circle cx="78" cy="78" r="3" fill="#ffffff" />
          <line x1="78" y1="78" x2="116" y2="78" stroke="#f7cf46" strokeWidth="1.8" />
          <text x="97" y="72" fill="#f7cf46" fontSize="10.5" textAnchor="middle">R</text>
          <circle cx="78" cy="78" r="54" fill="none" stroke="#5e9eff" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="78" y="102" fill="#d1fae5" fontSize="10" textAnchor="middle">地心 g=0</text>
          <text x="86" y="148" fill="#5e9eff" fontSize="10.5" textAnchor="middle">
            給密度 ρ 用 g = (4/3)πGρR ∝ ρR
          </text>

          {/* 右側：g(r) 對 r 函數曲線 */}
          <line x1="168" y1="120" x2="402" y2="120" stroke="#9eb8ae" strokeWidth="1.5" />
          <line x1="168" y1="24" x2="168" y2="120" stroke="#9eb8ae" strokeWidth="1.5" />
          <text x="162" y="30" fill="#9eb8ae" fontSize="10.5" textAnchor="end">g(r)</text>
          <text x="402" y="134" fill="#9eb8ae" fontSize="10.5" textAnchor="end">r</text>
          {/* 內部線性正比 + 外部平方反比 */}
          <line x1="168" y1="120" x2="238" y2="38" stroke="#f7cf46" strokeWidth="2.8" />
          <path d="M 238 38 Q 272 92 388 112" fill="none" stroke="#5e9eff" strokeWidth="2.8" />
          <line x1="238" y1="38" x2="238" y2="120" stroke="#9eb8ae" strokeWidth="1.2" strokeDasharray="3 2" />
          <circle cx="238" cy="38" r="4" fill="#ffffff" />
          <text x="238" y="134" fill="#f7cf46" fontSize="10.5" fontWeight="700" textAnchor="middle">R (地表 g₀)</text>
          <text x="200" y="70" fill="#f7cf46" fontSize="10.5" textAnchor="end">g ∝ r</text>
          <text x="316" y="64" fill="#5e9eff" fontSize="11" fontWeight="700">g ∝ 1 / r²</text>
          <text x="318" y="84" fill="#e6f0ec" fontSize="10.5">g_h = g₀ [R/(R+h)]²</text>
          <text x="290" y="152" fill="#d1fae5" fontSize="10.5" textAnchor="middle">
            地表最大；進入地底深處反而減小！
          </text>
        </svg>
      );

    case 'satellite_binary_energy':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：雙星系統 */}
          <text x="102" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            雙星系統（繞共同質心 O 同步）
          </text>
          <circle cx="102" cy="76" r="24" fill="none" stroke="#f7cf46" strokeWidth="1.4" strokeDasharray="4 3" />
          <circle cx="102" cy="76" r="46" fill="none" stroke="#5e9eff" strokeWidth="1.4" strokeDasharray="4 3" />
          <line x1="78" y1="76" x2="148" y2="76" stroke="#9eb8ae" strokeWidth="1.5" />
          <circle cx="102" cy="76" r="3" fill="#ffffff" />
          <text x="102" y="69" fill="#ffffff" fontSize="10" textAnchor="middle">O</text>
          <circle cx="78" cy="76" r="8" fill="#f7cf46" />
          <text x="78" y="96" fill="#f7cf46" fontSize="10.5" fontWeight="700" textAnchor="middle">m₁</text>
          <circle cx="148" cy="76" r="5" fill="#5e9eff" />
          <text x="148" y="96" fill="#5e9eff" fontSize="10.5" fontWeight="700" textAnchor="middle">m₂</text>
          <text x="102" y="136" fill="#e6f0ec" fontSize="10.5" textAnchor="middle">
            F、ω、T 均 1:1；m₁ r₁ = m₂ r₂
          </text>
          <text x="102" y="152" fill="#f7cf46" fontSize="10.5" textAnchor="middle">
            T = 2π √[L³ / G(m₁+m₂)]
          </text>

          {/* 中央分隔線 */}
          <line x1="208" y1="16" x2="208" y2="156" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：高低軌衛星能量比 */}
          <text x="314" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            人造衛星軌道比較 & 能量
          </text>
          <rect x="220" y="28" width="188" height="72" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.2" />
          <text x="314" y="47" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">
            v = √(GM/r) ｜ a_c = GM/r²
          </text>
          <text x="314" y="66" fill="#6ee7b7" fontSize="10.8" textAnchor="middle">
            低軌（r 小）：v 大、ω 大、T 短
          </text>
          <text x="314" y="85" fill="#ff9494" fontSize="10.8" textAnchor="middle">
            高軌（r 大）：總力學能 E 較高！
          </text>

          <rect x="220" y="108" width="188" height="42" rx="6" fill="#36634f" stroke="#f7cf46" strokeWidth="1.4" />
          <text x="314" y="126" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            E_k : U : E = (+1) : (-2) : (-1)
          </text>
          <text x="314" y="142" fill="#e6f0ec" fontSize="10.2" textAnchor="middle">
            r₁v₁ = r₂v₂ 僅同橢圓；v=√(GM/r) 僅圓軌
          </text>
        </svg>
      );

    case 'impulse_momentum_cm':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：F-t 圖衝量面積 */}
          <text x="102" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            衝量-動量定理（F-t 圖面積）
          </text>
          <line x1="28" y1="116" x2="188" y2="116" stroke="#9eb8ae" strokeWidth="1.5" />
          <line x1="28" y1="30" x2="28" y2="116" stroke="#9eb8ae" strokeWidth="1.5" />
          <text x="22" y="36" fill="#9eb8ae" fontSize="10.5" textAnchor="end">F</text>
          <text x="188" y="128" fill="#9eb8ae" fontSize="10.5" textAnchor="end">t</text>
          <path d="M 48 116 Q 108 24 168 116 Z" fill="#5e9eff" fillOpacity="0.28" stroke="#f7cf46" strokeWidth="2.4" />
          <text x="108" y="88" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">面積 J = Δp</text>
          <text x="108" y="142" fill="#5e9eff" fontSize="10.8" textAnchor="middle">
            J = F_avg Δt = m(v_末 - v_初)
          </text>
          <text x="108" y="156" fill="#9eb8ae" fontSize="10" textAnchor="middle">
            反彈問題必先設定方向正負號！
          </text>

          {/* 中央分隔線 */}
          <line x1="204" y1="16" x2="204" y2="156" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：人在靜止船上走動、質心不動 */}
          <text x="312" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            外力為 0 ⇒ 質心位置不變
          </text>
          {/* 質心鉛直參考線 */}
          <line x1="312" y1="28" x2="312" y2="128" stroke="#f7cf46" strokeWidth="1.8" strokeDasharray="4 3" />
          <text x="312" y="39" fill="#f7cf46" fontSize="10.2" fontWeight="700" textAnchor="middle">質心 C 不動</text>
          {/* 水面波浪線與船 */}
          <line x1="220" y1="106" x2="404" y2="106" stroke="#5e9eff" strokeWidth="1.5" strokeDasharray="4 2" />
          <polygon points="246,88 370,88 354,106 262,106" fill="#36634f" stroke="#9eb8ae" strokeWidth="1.8" />
          {/* 人向右走、船向左退 */}
          <circle cx="332" cy="60" r="6" fill="#6ee7b7" />
          <line x1="332" y1="66" x2="332" y2="88" stroke="#6ee7b7" strokeWidth="3" />
          <line x1="340" y1="74" x2="364" y2="74" stroke="#6ee7b7" strokeWidth="2.2" />
          <polygon points="370,74 361,70 361,78" fill="#6ee7b7" />
          <line x1="290" y1="97" x2="256" y2="97" stroke="#ff8585" strokeWidth="2.2" />
          <polygon points="250,97 259,93 259,101" fill="#ff8585" />
          <text x="312" y="138" fill="#ffffff" fontSize="10.8" textAnchor="middle">
            Δx_船 = [ m_人 / (m_人 + M_船) ] L
          </text>
          <text x="312" y="154" fill="#d1fae5" fontSize="10.2" textAnchor="middle">
            靜止炸彈分裂動量 1:1，E_k ∝ 1/m
          </text>
        </svg>
      );

    case 'vertical_circle_energy':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          <text x="210" y="17" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            鉛直圓周臨界條件與能量守恆
          </text>
          {/* 鉛直圓軌道 */}
          <circle cx="106" cy="84" r="46" fill="none" stroke="#9eb8ae" strokeWidth="2.2" />
          <circle cx="106" cy="84" r="2.5" fill="#9eb8ae" />
          <line x1="106" y1="84" x2="140" y2="52" stroke="#9eb8ae" strokeWidth="1.2" strokeDasharray="3 2" />
          <text x="128" y="72" fill="#9eb8ae" fontSize="10.5">R</text>
          {/* 最高點球 */}
          <circle cx="106" cy="38" r="6" fill="#ff8585" />
          <line x1="106" y1="38" x2="72" y2="38" stroke="#ff8585" strokeWidth="2.2" />
          <polygon points="65,38 75,34 75,42" fill="#ff8585" />
          <text x="58" y="34" fill="#ff9494" fontSize="10.5" fontWeight="700" textAnchor="end">v_頂=√(gR)</text>
          {/* 最低點球 */}
          <circle cx="106" cy="130" r="6" fill="#f7cf46" />
          <line x1="106" y1="130" x2="148" y2="130" stroke="#f7cf46" strokeWidth="2.5" />
          <polygon points="155,130 145,126 145,134" fill="#f7cf46" />
          <text x="160" y="134" fill="#f7cf46" fontSize="10.5" fontWeight="700">v_底=√(5gR)</text>

          {/* 右側能量轉換箱 */}
          <rect x="218" y="28" width="190" height="122" rx="6" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.3" />
          <text x="313" y="48" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            功能定理：W_合力 = ΔE_k
          </text>
          <text x="226" y="70" fill="#ffffff" fontSize="10.8">輕繩/內軌最高點臨界 (N=0)：</text>
          <text x="232" y="88" fill="#ff9494" fontSize="11" fontWeight="700">mg = m v_頂² / R ⇒ v_頂 = √(gR)</text>
          <text x="226" y="109" fill="#6ee7b7" fontSize="10.5">力學能守恆降高 2R：v_底 = √(5gR)</text>
          <text x="226" y="129" fill="#f7cf46" fontSize="10.5">定功率車：P = Fv ⇒ v_max = P/f</text>
          <text x="226" y="144" fill="#e6f0ec" fontSize="10">輕桿支撐最高點臨界只需 v_頂 &gt; 0</text>
        </svg>
      );

    case 'collision_1d':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 上列：撞前 */}
          <rect x="20" y="12" width="380" height="36" rx="5" fill="#2e5443" stroke="#9eb8ae" strokeWidth="1.2" />
          <text x="32" y="34" fill="#9eb8ae" fontSize="11" fontWeight="700">撞前</text>
          <circle cx="115" cy="30" r="10" fill="#f7cf46" />
          <text x="115" y="34" fill="#233b30" fontSize="10.5" fontWeight="700" textAnchor="middle">m₁</text>
          <line x1="128" y1="30" x2="168" y2="30" stroke="#f7cf46" strokeWidth="2.4" />
          <polygon points="174,30 165,26 165,34" fill="#f7cf46" />
          <text x="148" y="24" fill="#f7cf46" fontSize="10">v₁</text>
          <circle cx="240" cy="30" r="11" fill="#5e9eff" />
          <text x="240" y="34" fill="#233b30" fontSize="10.5" fontWeight="700" textAnchor="middle">m₂</text>
          <text x="262" y="34" fill="#e6f0ec" fontSize="10.5">靜止 (v₂ = 0)</text>

          {/* 中列：一維彈性碰撞 */}
          <rect x="20" y="56" width="380" height="44" rx="5" fill="#36634f" stroke="#5e9eff" strokeWidth="1.5" />
          <text x="32" y="78" fill="#5e9eff" fontSize="11" fontWeight="700">彈性碰撞</text>
          <text x="32" y="92" fill="#6ee7b7" fontSize="10">p 與 E_k 皆守恆</text>
          <text x="132" y="75" fill="#ffffff" fontSize="11" fontWeight="600">
            接近相對速率 = 分離相對速率
          </text>
          <text x="132" y="92" fill="#f7cf46" fontSize="10.5">
            v₁' = [(m₁-m₂)/(m₁+m₂)] v₁ ｜ 若 m₁ = m₂ 則完全交換速度！
          </text>

          {/* 下列：完全非彈性（黏合） */}
          <rect x="20" y="108" width="380" height="46" rx="5" fill="#2e5443" stroke="#ff8585" strokeWidth="1.5" />
          <text x="32" y="128" fill="#ff9494" fontSize="11" fontWeight="700">完全非彈性</text>
          <text x="32" y="143" fill="#e6f0ec" fontSize="10">動量守恆・黏合</text>
          <circle cx="150" cy="131" r="9" fill="#f7cf46" />
          <circle cx="168" cy="131" r="10" fill="#5e9eff" />
          <line x1="182" y1="131" x2="212" y2="131" stroke="#ffffff" strokeWidth="2.2" />
          <polygon points="218,131 209,127 209,135" fill="#ffffff" />
          <text x="200" y="124" fill="#ffffff" fontSize="10">v_c</text>
          <text x="228" y="128" fill="#ff9494" fontSize="11" fontWeight="700">
            損失全部內動能！
          </text>
          <text x="228" y="144" fill="#f7cf46" fontSize="10.5">
            ΔE_loss = [m₂ / (m₁ + m₂)] E_k0
          </text>
        </svg>
      );

    case 'kinetic_theory_gas':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：氣體分子碰撞器壁模型 */}
          <text x="98" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            氣體動力論：微觀碰撞壓力
          </text>
          <rect x="30" y="32" width="136" height="84" rx="4" fill="#2e5443" stroke="#9eb8ae" strokeWidth="2" />
          <circle cx="62" cy="56" r="5" fill="#f7cf46" />
          <line x1="62" y1="56" x2="92" y2="44" stroke="#f7cf46" strokeWidth="1.6" />
          <circle cx="136" cy="70" r="5" fill="#5e9eff" />
          <line x1="136" y1="70" x2="162" y2="58" stroke="#5e9eff" strokeWidth="1.6" />
          <line x1="162" y1="58" x2="138" y2="46" stroke="#ff8585" strokeWidth="1.6" />
          <circle cx="88" cy="96" r="5" fill="#6ee7b7" />
          <line x1="88" y1="96" x2="60" y2="108" stroke="#6ee7b7" strokeWidth="1.6" />
          <text x="98" y="135" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">
            P = ⅓ ρ v_rms² ｜ PV = nRT
          </text>
          <text x="98" y="152" fill="#d1fae5" fontSize="10.2" textAnchor="middle">
            v_rms = √(3RT / M) ∝ √(T / M)
          </text>

          {/* 中央分隔線 */}
          <line x1="196" y1="16" x2="196" y2="156" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：馬克士威速率分佈曲線 */}
          <text x="308" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            馬克士威速率分佈（T₂ &gt; T₁）
          </text>
          <line x1="216" y1="114" x2="404" y2="114" stroke="#9eb8ae" strokeWidth="1.5" />
          <line x1="216" y1="30" x2="216" y2="114" stroke="#9eb8ae" strokeWidth="1.5" />
          {/* 低溫高窄曲線 */}
          <path d="M 216 114 Q 254 22 288 84 T 350 113" fill="none" stroke="#f7cf46" strokeWidth="2.4" />
          {/* 高溫寬矮右移曲線 */}
          <path d="M 216 114 Q 286 52 332 82 T 402 112" fill="none" stroke="#5e9eff" strokeWidth="2.4" />
          <text x="262" y="42" fill="#f7cf46" fontSize="10.5" fontWeight="700">低溫 T₁</text>
          <text x="342" y="64" fill="#5e9eff" fontSize="10.5" fontWeight="700">高溫 T₂</text>
          <text x="308" y="135" fill="#f7cf46" fontSize="11" fontWeight="700" textAnchor="middle">
            平均動能 E_k = (3/2) k_B T 只看 T
          </text>
          <text x="308" y="152" fill="#9eb8ae" fontSize="10.2" textAnchor="middle">
            溫度務必轉為絕對溫度 K = °C + 273
          </text>
        </svg>
      );

    case 'thermo_pv_first_law':
      return (
        <svg viewBox="0 0 420 165" className="w-full h-auto select-none">
          {/* 左半：P-V 圖作功面積 */}
          <text x="104" y="18" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">
            P-V 圖膨脹作功（圖下面積 W）
          </text>
          <line x1="34" y1="120" x2="192" y2="120" stroke="#9eb8ae" strokeWidth="1.5" />
          <line x1="34" y1="30" x2="34" y2="120" stroke="#9eb8ae" strokeWidth="1.5" />
          <text x="28" y="36" fill="#9eb8ae" fontSize="10.5" textAnchor="end">P</text>
          <text x="194" y="132" fill="#9eb8ae" fontSize="10.5" textAnchor="end">V</text>
          {/* 定壓膨脹 A -> B 矩形面積 */}
          <rect x="64" y="54" width="96" height="66" fill="#f7cf46" fillOpacity="0.22" stroke="#9eb8ae" strokeWidth="1" strokeDasharray="3 2" />
          <line x1="64" y1="54" x2="154" y2="54" stroke="#f7cf46" strokeWidth="3" />
          <polygon points="160,54 151,50 151,58" fill="#f7cf46" />
          <text x="64" y="47" fill="#ffffff" fontSize="10.5" textAnchor="middle">A</text>
          <text x="160" y="47" fill="#ffffff" fontSize="10.5" textAnchor="middle">B</text>
          <text x="112" y="92" fill="#f7cf46" fontSize="11.5" fontWeight="700" textAnchor="middle">W = P ΔV</text>
          <text x="64" y="134" fill="#9eb8ae" fontSize="10" textAnchor="middle">V₁</text>
          <text x="160" y="134" fill="#9eb8ae" fontSize="10" textAnchor="middle">V₂</text>
          <text x="112" y="152" fill="#5e9eff" fontSize="10.2" textAnchor="middle">
            膨脹 W &gt; 0；循環淨功 = 封閉面積
          </text>

          {/* 中央分隔線 */}
          <line x1="208" y1="16" x2="208" y2="156" stroke="#3b5c4d" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* 右半：熱力學第一定律與單原子氣體比例 */}
          <text x="314" y="18" fill="#5e9eff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            熱力學第一定律 & 單原子內能
          </text>
          <rect x="220" y="28" width="188" height="44" rx="6" fill="#36634f" stroke="#f7cf46" strokeWidth="1.5" />
          <text x="314" y="48" fill="#f7cf46" fontSize="12.5" fontWeight="700" textAnchor="middle">
            ΔU = Q - W
          </text>
          <text x="314" y="64" fill="#e6f0ec" fontSize="10.5" textAnchor="middle">
            單原子內能 U = (3/2) nRT = (3/2) PV
          </text>

          <rect x="220" y="80" width="188" height="40" rx="6" fill="#2e5443" stroke="#5e9eff" strokeWidth="1.3" />
          <text x="314" y="97" fill="#6ee7b7" fontSize="11" fontWeight="700" textAnchor="middle">
            單原子定壓加熱黃金比：
          </text>
          <text x="314" y="113" fill="#ffffff" fontSize="11.5" fontWeight="700" textAnchor="middle">
            W : ΔU : Q = 2 : 3 : 5
          </text>

          <text x="314" y="138" fill="#ff9494" fontSize="10.5" textAnchor="middle">
            絕熱自由膨脹：Q=0, W=0 ⇒ T 不變
          </text>
          <text x="314" y="153" fill="#d1fae5" fontSize="10.2" textAnchor="middle">
            循環回原狀態：ΔU_cycle = 0
          </text>
        </svg>
      );
  }
}
