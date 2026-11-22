import React, { useEffect, useRef, useState } from 'react';
import { FlaskConical, Pause, Play, RotateCcw } from 'lucide-react';

export type SimType = 'chase' | 'river' | 'projectile' | 'incline' | 'orbit';

interface PhysicsSimCanvasProps {
  simType: SimType;
}

export const LESSON_SIM_MAP: Record<string, SimType> = {
  'c-g10-2-2': 'chase',
  'c-g11-2-2': 'chase',
  'c-g11-3-1': 'river',
  'c-g11-3-2': 'projectile',
  'c-g11-4-1': 'incline',
  'c-g11-4-2': 'incline',
  'c-g10-2-1': 'orbit',
  'c-g11-5-2': 'orbit',
};

const SIM_META: Record<SimType, { title: string; subtitle: string }> = {
  chase: {
    title: '直線追趕與 v-t 圖互動模擬',
    subtitle: '拖曳參數觀察後車何時追上前車，以及兩車速率相等時的極值間距',
  },
  river: {
    title: '渡河速度向量合成模擬',
    subtitle: '調整船速、水速與船頭方向，觀察實際航線與最短渡河時間',
  },
  projectile: {
    title: '斜向拋射軌跡與互餘角模擬',
    subtitle: '比較不同仰角與初速下的最大高度 H、飛行時間 T 與水平射程 R',
  },
  incline: {
    title: '斜面受力分解與摩擦力模擬',
    subtitle: '調整傾角 θ 與摩擦係數 μ，即時檢視重力分量與物體加速度',
  },
  orbit: {
    title: '克卜勒橢圓軌道與等面積定律模擬',
    subtitle: '改變離心率 e，觀察近日點加速、遠日點減速與相等時間掃過面積',
  },
};

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  label?: string,
  lineWidth = 2.2
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 2) return;
  const angle = Math.atan2(dy, dx);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const head = 7;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  if (label) {
    ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
    ctx.fillText(label, x2 + 6 * Math.cos(angle), y2 + 6 * Math.sin(angle) + 3);
  }
  ctx.restore();
}

export function PhysicsSimCanvas({ simType }: PhysicsSimCanvasProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState<boolean>(true);
  const [resetTick, setResetTick] = useState<number>(0);

  // 1. Chase params
  const [vFront, setVFront] = useState<number>(12);
  const [aRear, setARear] = useState<number>(4);
  const [gap0, setGap0] = useState<number>(24);

  // 2. River params
  const [vBoat, setVBoat] = useState<number>(5);
  const [vRiver, setVRiver] = useState<number>(3);
  const [boatAngle, setBoatAngle] = useState<number>(0); // degrees upstream (+) / downstream (-)

  // 3. Projectile params
  const [projV0, setProjV0] = useState<number>(28);
  const [projDeg, setProjDeg] = useState<number>(45);
  const [showComplement, setShowComplement] = useState<boolean>(true);

  // 4. Incline params
  const [inclineDeg, setInclineDeg] = useState<number>(30);
  const [mu, setMu] = useState<number>(0.25);

  // 5. Orbit params
  const [ecc, setEcc] = useState<number>(0.55);

  const timeRef = useRef<number>(0);

  useEffect(() => {
    timeRef.current = 0;
  }, [simType, resetTick, vFront, aRear, gap0, vBoat, vRiver, boatAngle, projV0, projDeg, inclineDeg, mu, ecc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let lastTs = performance.now();

    const draw = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      if (playing) {
        timeRef.current += dt;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssW = canvas.clientWidth || 440;
      const cssH = 220;
      if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Chalkboard background matching user's pine-green aesthetic
      ctx.fillStyle = '#1b3630';
      ctx.fillRect(0, 0, cssW, cssH);

      // Subtle chalkboard grid
      ctx.strokeStyle = 'rgba(227, 243, 240, 0.08)';
      ctx.lineWidth = 1;
      for (let gx = 20; gx < cssW; gx += 20) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, cssH);
        ctx.stroke();
      }
      for (let gy = 20; gy < cssH; gy += 20) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(cssW, gy);
        ctx.stroke();
      }

      const t = timeRef.current;

      if (simType === 'chase') {
        // Rear car: x1 = 0.5 * a * t^2, Front car: x2 = gap0 + vFront * t
        const disc = vFront * vFront + 2 * aRear * gap0;
        const tCatch = (vFront + Math.sqrt(disc)) / aRear;
        const tMax = Math.max(tCatch + 1.2, 6);
        const simT = t % tMax;

        const xRear = 0.5 * aRear * simT * simT;
        const xFront = gap0 + vFront * simT;
        const xScale = (cssW - 60) / Math.max(gap0 + vFront * tMax, 0.5 * aRear * tMax * tMax, 1);

        // Road track
        const roadY = 64;
        ctx.strokeStyle = 'rgba(232,243,240,0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(24, roadY);
        ctx.lineTo(cssW - 24, roadY);
        ctx.stroke();

        const rx = 28 + Math.min(xRear * xScale, cssW - 64);
        const fx = 28 + Math.min(xFront * xScale, cssW - 64);

        // Rear car (gold)
        ctx.fillStyle = '#fce258';
        ctx.fillRect(rx - 10, roadY - 16, 20, 11);
        ctx.font = 'bold 10px "Noto Sans TC", sans-serif';
        ctx.fillText('後車(加速)', Math.max(12, rx - 22), roadY - 22);

        // Front car (mint)
        ctx.fillStyle = '#7dd3c8';
        ctx.fillRect(fx - 10, roadY - 16, 20, 11);
        ctx.fillText('前車(等速)', Math.max(12, fx - 22), roadY + 14);

        // Mini v-t chart at bottom
        const gx0 = 38;
        const gy0 = 192;
        const gw = cssW - 76;
        const gh = 78;
        ctx.strokeStyle = 'rgba(232,243,240,0.5)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(gx0, gy0 - gh);
        ctx.lineTo(gx0, gy0);
        ctx.lineTo(gx0 + gw, gy0);
        ctx.stroke();

        const vMax = Math.max(vFront * 1.6, aRear * tMax, 10);
        // Front car v-t horizontal line
        const yVf = gy0 - (vFront / vMax) * gh;
        ctx.strokeStyle = '#7dd3c8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gx0, yVf);
        ctx.lineTo(gx0 + gw, yVf);
        ctx.stroke();

        // Rear car v-t slope line
        ctx.strokeStyle = '#fce258';
        ctx.beginPath();
        ctx.moveTo(gx0, gy0);
        ctx.lineTo(gx0 + gw, gy0 - Math.min(1, (aRear * tMax) / vMax) * gh);
        ctx.stroke();

        // Current time cursor
        const tx = gx0 + (simT / tMax) * gw;
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(tx, gy0 - gh);
        ctx.lineTo(tx, gy0);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#e8f3f0';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        ctx.fillText(`t = ${simT.toFixed(1)} s`, gx0 + 4, gy0 - gh + 10);
        ctx.fillStyle = '#fce258';
        ctx.fillText(`追上時間 ≈ ${tCatch.toFixed(2)} s｜最遠距在 t = ${(vFront / aRear).toFixed(2)} s`, 20, 18);
      } else if (simType === 'river') {
        const rad = (boatAngle * Math.PI) / 180;
        const vx = vRiver - vBoat * Math.sin(rad); // downstream (+)
        const vy = vBoat * Math.cos(rad); // across river
        const riverW = 120; // visual px representing 60 m
        const topY = 48;
        const botY = topY + riverW;

        // River banks
        ctx.fillStyle = 'rgba(197,139,89,0.22)';
        ctx.fillRect(0, 26, cssW, 22);
        ctx.fillRect(0, botY, cssW, 24);
        ctx.fillStyle = 'rgba(125,211,200,0.14)';
        ctx.fillRect(0, topY, cssW, riverW);

        // Flow dashes
        ctx.strokeStyle = 'rgba(125,211,200,0.35)';
        ctx.lineWidth = 1.2;
        const offset = (t * vRiver * 14) % 40;
        for (let row = 0; row < 3; row++) {
          const y = topY + 26 + row * 34;
          for (let x = -40 + offset; x < cssW; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 18, y);
            ctx.stroke();
          }
        }

        const startX = cssW * 0.36;
        const tCross = 60 / Math.max(vy, 0.2);
        const loopT = t % (tCross + 1.2);
        const frac = Math.min(1, loopT / tCross);
        const driftPx = (vx / Math.max(vy, 0.2)) * riverW;
        const bx = startX + driftPx * frac;
        const by = botY - riverW * frac;

        // Dashed path
        ctx.strokeStyle = 'rgba(252,226,88,0.6)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(startX, botY);
        ctx.lineTo(startX + driftPx, topY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Boat dot & vectors
        ctx.fillStyle = '#fce258';
        ctx.beginPath();
        ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
        ctx.fill();

        const vScale = 8;
        drawArrow(ctx, bx, by, bx - vBoat * Math.sin(rad) * vScale, by - vBoat * Math.cos(rad) * vScale, '#7dd3c8', 'v船');
        drawArrow(ctx, bx, by, bx + vRiver * vScale, by, '#f5a97f', 'v水');
        drawArrow(ctx, bx, by, bx + vx * vScale, by - vy * vScale, '#fce258', 'v合', 2.6);

        ctx.fillStyle = '#e8f3f0';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        const driftM = vx * tCross;
        ctx.fillText(
          `河寬 60 m｜渡河時間 ${tCross.toFixed(1)} s｜下游偏移 ${driftM >= 0 ? '+' : ''}${driftM.toFixed(1)} m`,
          14,
          18
        );
      } else if (simType === 'projectile') {
        const g = 9.8;
        const rad = (projDeg * Math.PI) / 180;
        const vx = projV0 * Math.cos(rad);
        const vy0 = projV0 * Math.sin(rad);
        const tFlight = (2 * vy0) / g;
        const range = vx * tFlight;
        const maxH = (vy0 * vy0) / (2 * g);

        const maxScaleR = Math.max(range, (projV0 * projV0) / g, 40);
        const maxScaleH = Math.max(maxH, (projV0 * projV0) / (2 * g), 20);
        const originX = 32;
        const groundY = 188;
        const sx = (cssW - 64) / maxScaleR;
        const sy = 140 / maxScaleH;

        // Ground
        ctx.strokeStyle = 'rgba(232,243,240,0.45)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(16, groundY);
        ctx.lineTo(cssW - 16, groundY);
        ctx.stroke();

        // Optional complementary angle (90 - deg) trajectory
        if (showComplement && projDeg !== 45) {
          const cRad = ((90 - projDeg) * Math.PI) / 180;
          const cvx = projV0 * Math.cos(cRad);
          const cvy = projV0 * Math.sin(cRad);
          const ctF = (2 * cvy) / g;
          ctx.strokeStyle = 'rgba(125,211,200,0.45)';
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          for (let i = 0; i <= 50; i++) {
            const ti = (ctF * i) / 50;
            const px = originX + cvx * ti * sx;
            const py = groundY - (cvy * ti - 0.5 * g * ti * ti) * sy;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Main parabola
        ctx.strokeStyle = '#fce258';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const ti = (tFlight * i) / 60;
          const px = originX + vx * ti * sx;
          const py = groundY - (vy0 * ti - 0.5 * g * ti * ti) * sy;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Moving ball
        const simT = t % (tFlight + 0.9);
        const curT = Math.min(simT, tFlight);
        const bx = originX + vx * curT * sx;
        const by = groundY - (vy0 * curT - 0.5 * g * curT * curT) * sy;
        const curVy = vy0 - g * curT;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
        ctx.fill();

        drawArrow(ctx, bx, by, bx + vx * 1.1, by, '#7dd3c8', 'vx', 1.8);
        drawArrow(ctx, bx, by, bx, by - curVy * 1.1, '#f5a97f', 'vy', 1.8);

        ctx.fillStyle = '#e8f3f0';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        ctx.fillText(
          `最大高度 H = ${maxH.toFixed(1)} m｜水平射程 R = ${range.toFixed(1)} m｜飛行 ${tFlight.toFixed(2)} s`,
          14,
          18
        );
      } else if (simType === 'incline') {
        const g = 9.8;
        const rad = (inclineDeg * Math.PI) / 180;
        const sinT = Math.sin(rad);
        const cosT = Math.cos(rad);
        const netAcc = Math.max(0, g * (sinT - mu * cosT));
        const sliding = netAcc > 0.01;

        const baseX = cssW * 0.78;
        const baseY = 190;
        const slopeLen = 195;
        const topX = baseX - slopeLen * cosT;
        const topY = baseY - slopeLen * sinT;

        // Ramp triangle
        ctx.fillStyle = 'rgba(227,243,240,0.12)';
        ctx.strokeStyle = 'rgba(227,243,240,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(baseX, baseY);
        ctx.lineTo(topX, baseY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Block position along slope
        const maxDist = slopeLen - 44;
        const slideT = sliding ? t % (Math.sqrt((2 * maxDist) / (netAcc * 28)) + 0.9) : 0;
        const dist = sliding ? Math.min(maxDist, 0.5 * netAcc * 28 * slideT * slideT) : 28;
        const cx = topX + (dist + 22) * cosT + 11 * sinT;
        const cy = topY + (dist + 22) * sinT - 11 * cosT;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rad);
        ctx.fillStyle = '#fce258';
        ctx.fillRect(-14, -10, 28, 20);
        ctx.restore();

        // Force vectors
        const fScale = 48;
        drawArrow(ctx, cx, cy, cx, cy + fScale, '#f5a97f', 'mg');
        drawArrow(ctx, cx, cy, cx + fScale * sinT * cosT, cy + fScale * sinT * sinT, '#fce258', 'mg sinθ', 2);
        drawArrow(ctx, cx, cy, cx + fScale * cosT * sinT, cy - fScale * cosT * cosT, '#7dd3c8', 'N', 2);
        const fLen = Math.min(sinT, mu * cosT) * fScale;
        drawArrow(ctx, cx, cy, cx - fLen * cosT, cy - fLen * sinT, '#a5f3fc', 'f', 2);

        ctx.fillStyle = '#e8f3f0';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        ctx.fillText(
          sliding
            ? `下滑中｜a = g(sinθ - μcosθ) = ${netAcc.toFixed(2)} m/s²`
            : `靜止平衡｜tanθ = ${Math.tan(rad).toFixed(2)} ≤ μ = ${mu.toFixed(2)}（a = 0）`,
          14,
          18
        );
      } else if (simType === 'orbit') {
        const a = Math.min(cssW * 0.34, 130);
        const b = a * Math.sqrt(1 - ecc * ecc);
        const c = a * ecc;
        const centerX = cssW * 0.5;
        const centerY = 118;
        const sunX = centerX - c;
        const sunY = centerY;

        // Solve Kepler's equation M = E - e sin(E)
        const M = (t * 0.9) % (Math.PI * 2);
        let E = M;
        for (let k = 0; k < 5; k++) {
          E = E - (E - ecc * Math.sin(E) - M) / (1 - ecc * Math.cos(E));
        }
        const px = centerX + a * Math.cos(E);
        const py = centerY + b * Math.sin(E);

        // Sweep equal-time wedge (ΔM = 0.45 rad)
        const M0 = M - 0.45;
        ctx.fillStyle = 'rgba(252,226,88,0.22)';
        ctx.beginPath();
        ctx.moveTo(sunX, sunY);
        for (let i = 0; i <= 16; i++) {
          const mi = M0 + (0.45 * i) / 16;
          let ei = mi;
          for (let k = 0; k < 4; k++) ei = ei - (ei - ecc * Math.sin(ei) - mi) / (1 - ecc * Math.cos(ei));
          ctx.lineTo(centerX + a * Math.cos(ei), centerY + b * Math.sin(ei));
        }
        ctx.closePath();
        ctx.fill();

        // Orbit ellipse
        ctx.strokeStyle = 'rgba(227,243,240,0.45)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Sun at left focus
        ctx.fillStyle = '#fce258';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 9, 0, Math.PI * 2);
        ctx.fill();

        // Planet
        ctx.fillStyle = '#7dd3c8';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        const rNorm = 1 - ecc * Math.cos(E);
        const vRatio = Math.sqrt((1 + ecc) / (1 - ecc));
        ctx.fillStyle = '#e8f3f0';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        ctx.fillText(
          `離心率 e = ${ecc.toFixed(2)}｜近日/遠日速率比 = ${vRatio.toFixed(2)}｜目前 r/a = ${rNorm.toFixed(2)}`,
          14,
          18
        );
      }

      ctx.restore();
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [simType, playing, vFront, aRear, gap0, vBoat, vRiver, boatAngle, projV0, projDeg, showComplement, inclineDeg, mu, ecc]);

  const meta = SIM_META[simType];

  return (
    <section className="mt-5 rounded-xl border border-[#24554F]/30 bg-[#F4F8F7] p-3.5">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#24554F] uppercase">
            <FlaskConical className="w-3.5 h-3.5 text-[#C58B59]" />
            互動物理實驗室
          </div>
          <h3 className="text-[15px] font-bold text-[#1D4742] leading-snug mt-0.5">
            {meta.title}
          </h3>
          <p className="text-[12px] text-neutral-600 mt-0.5">{meta.subtitle}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? '暫停模擬' : '播放模擬'}
            className="p-1.5 rounded-lg border border-[#D5E2E0] bg-white text-[#24554F] hover:bg-[#E3F3F0]"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setResetTick((n) => n + 1)}
            aria-label="重播模擬"
            className="p-1.5 rounded-lg border border-[#D5E2E0] bg-white text-[#24554F] hover:bg-[#E3F3F0]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-[220px] rounded-lg border border-[#24554F]/40 block"
      />

      <div className="mt-3 space-y-2 text-[12px] text-neutral-700">
        {simType === 'chase' && (
          <>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">前車等速：{vFront} m/s</span>
              <input type="range" min={4} max={24} step={1} value={vFront} onChange={(e) => setVFront(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">後車加速度：{aRear} m/s²</span>
              <input type="range" min={1} max={10} step={0.5} value={aRear} onChange={(e) => setARear(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">初始間距：{gap0} m</span>
              <input type="range" min={5} max={60} step={5} value={gap0} onChange={(e) => setGap0(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
          </>
        )}

        {simType === 'river' && (
          <>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">靜水船速：{vBoat} m/s</span>
              <input type="range" min={2} max={10} step={0.5} value={vBoat} onChange={(e) => setVBoat(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">河流流速：{vRiver} m/s</span>
              <input type="range" min={0} max={8} step={0.5} value={vRiver} onChange={(e) => setVRiver(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">船頭偏上游角度：{boatAngle}°</span>
              <input type="range" min={-45} max={60} step={5} value={boatAngle} onChange={(e) => setBoatAngle(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
          </>
        )}

        {simType === 'projectile' && (
          <>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">拋射初速：{projV0} m/s</span>
              <input type="range" min={14} max={42} step={2} value={projV0} onChange={(e) => setProjV0(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">拋射仰角：{projDeg}°</span>
              <input type="range" min={15} max={75} step={5} value={projDeg} onChange={(e) => setProjDeg(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="inline-flex items-center gap-2 text-xs text-[#24554F] font-semibold cursor-pointer">
              <input type="checkbox" checked={showComplement} onChange={(e) => setShowComplement(e.target.checked)} className="accent-[#24554F]" />
              <span>同時顯示互餘角（{90 - projDeg}°）虛線軌跡對比</span>
            </label>
          </>
        )}

        {simType === 'incline' && (
          <>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">斜面傾角 θ：{inclineDeg}°</span>
              <input type="range" min={10} max={55} step={1} value={inclineDeg} onChange={(e) => setInclineDeg(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">摩擦係數 μ：{mu.toFixed(2)}</span>
              <input type="range" min={0} max={0.9} step={0.05} value={mu} onChange={(e) => setMu(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
          </>
        )}

        {simType === 'orbit' && (
          <label className="flex items-center justify-between gap-3">
            <span className="font-semibold text-[#1D4742] whitespace-nowrap">軌道離心率 e：{ecc.toFixed(2)}</span>
            <input type="range" min={0} max={0.8} step={0.05} value={ecc} onChange={(e) => setEcc(Number(e.target.value))} className="w-40 accent-[#24554F]" />
          </label>
        )}
      </div>
    </section>
  );
}
