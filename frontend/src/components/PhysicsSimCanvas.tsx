import React, { useEffect, useRef, useState } from 'react';
import { FlaskConical, Pause, Play, RotateCcw } from 'lucide-react';

export type SimType =
  | 'vernier'
  | 'chase'
  | 'vertical'
  | 'river'
  | 'projectile'
  | 'shm'
  | 'incline'
  | 'orbit'
  | 'collision'
  | 'standing_wave';

interface PhysicsSimCanvasProps {
  simType: SimType;
}

export const LESSON_SIM_MAP: Record<string, SimType> = {
  'c-g11-1-2': 'vernier',
  'c-g10-2-2': 'chase',
  'c-g11-2-2': 'chase',
  'c-g11-2-3': 'vertical',
  'c-g11-3-1': 'river',
  'c-g11-3-2': 'projectile',
  'c-g11-3-3': 'shm',
  'c-g11-4-1': 'incline',
  'c-g11-4-2': 'incline',
  'c-g10-2-1': 'orbit',
  'c-g11-5-2': 'orbit',
  'c-g11-6-1': 'collision',
  'c-g11-6-3': 'collision',
  'c-g12-1-1': 'standing_wave',
};

const SIM_META: Record<SimType, { title: string; subtitle: string }> = {
  vernier: {
    title: '游標尺精密讀數互動模擬（精度 0.05 mm）',
    subtitle: '拖曳待測物寬度，觀察主尺整數刻度與游標尺 20 格中哪一條刻線完全對齊',
  },
  chase: {
    title: '直線追趕與 v-t 圖互動模擬',
    subtitle: '拖曳參數觀察後車何時追上前車，以及兩車速率相等時的極值間距',
  },
  vertical: {
    title: '鉛直上拋與自由落體對稱性模擬',
    subtitle: '調整初速與重力加速度（可模擬地球或月球），觀察上升與下降時間及速度對稱',
  },
  river: {
    title: '渡河速度向量合成模擬',
    subtitle: '調整船速、水速與船頭方向，觀察實際航線與最短渡河時間',
  },
  projectile: {
    title: '斜向拋射軌跡與互餘角模擬',
    subtitle: '比較不同仰角與初速下的最大高度 H、飛行時間 T 與水平射程 R',
  },
  shm: {
    title: '等速率圓周運動與簡諧運動 (SHM) 投影模擬',
    subtitle: '調整振幅 A 與角頻率 ω，觀察參考圓投影如何生成簡諧振盪與餘弦波形',
  },
  incline: {
    title: '斜面受力分解與摩擦力模擬',
    subtitle: '調整傾角 θ 與摩擦係數 μ，即時檢視重力分量與物體加速度',
  },
  orbit: {
    title: '克卜勒橢圓軌道與等面積定律模擬',
    subtitle: '改變離心率 e，觀察近日點加速、遠日點減速與相等時間掃過面積',
  },
  collision: {
    title: '一維彈性與非彈性碰撞模擬',
    subtitle: '調整兩球質量、初速與恢復係數 e，驗證總動量守恆與動能損耗差異',
  },
  standing_wave: {
    title: '弦上駐波與諧音節點模擬',
    subtitle: '切換第 n 諧音，觀察入射波與反射波疊加如何形成固定不動的波節 (N) 與波腹 (A)',
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

  // 0. Vernier params
  const [vernierMm, setVernierMm] = useState<number>(12.35);

  // 1. Chase params
  const [vFront, setVFront] = useState<number>(12);
  const [aRear, setARear] = useState<number>(4);
  const [gap0, setGap0] = useState<number>(24);

  // 2. Vertical throw params
  const [vertV0, setVertV0] = useState<number>(25);
  const [vertG, setVertG] = useState<number>(9.8);

  // 3. River params
  const [vBoat, setVBoat] = useState<number>(5);
  const [vRiver, setVRiver] = useState<number>(3);
  const [boatAngle, setBoatAngle] = useState<number>(0);

  // 4. Projectile params
  const [projV0, setProjV0] = useState<number>(28);
  const [projDeg, setProjDeg] = useState<number>(45);
  const [showComplement, setShowComplement] = useState<boolean>(true);

  // 5. SHM params
  const [shmAmp, setShmAmp] = useState<number>(48);
  const [shmOmega, setShmOmega] = useState<number>(2.0);

  // 6. Incline params
  const [inclineDeg, setInclineDeg] = useState<number>(30);
  const [mu, setMu] = useState<number>(0.25);

  // 7. Orbit params
  const [ecc, setEcc] = useState<number>(0.55);

  // 8. Collision params
  const [m1, setM1] = useState<number>(2);
  const [m2, setM2] = useState<number>(4);
  const [u1, setU1] = useState<number>(6);
  const [restitution, setRestitution] = useState<number>(1.0);

  // 9. Standing wave params
  const [harmonicN, setHarmonicN] = useState<number>(3);
  const [showComponents, setShowComponents] = useState<boolean>(true);

  const timeRef = useRef<number>(0);

  useEffect(() => {
    timeRef.current = 0;
  }, [
    simType,
    resetTick,
    vFront,
    aRear,
    gap0,
    vertV0,
    vertG,
    vBoat,
    vRiver,
    boatAngle,
    projV0,
    projDeg,
    shmAmp,
    shmOmega,
    inclineDeg,
    mu,
    ecc,
    m1,
    m2,
    u1,
    restitution,
    harmonicN,
  ]);

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

      // Pine-green chalkboard background
      ctx.fillStyle = '#1b3630';
      ctx.fillRect(0, 0, cssW, cssH);

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

      if (simType === 'vernier') {
        const mainInt = Math.floor(vernierMm + 1e-6);
        const vernierIdx = Math.round((vernierMm - mainInt) / 0.05) % 20;
        const pxPerMm = Math.min(11, (cssW - 60) / 36);
        const zeroX = 36;
        const mainY = 96;
        const vernY = 128;

        // Main scale bar
        ctx.fillStyle = 'rgba(232,243,240,0.14)';
        ctx.fillRect(18, mainY - 34, cssW - 36, 34);
        ctx.strokeStyle = '#e8f3f0';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(18, mainY);
        ctx.lineTo(cssW - 18, mainY);
        ctx.stroke();

        // Main scale ticks (0..38 mm)
        ctx.font = '10px "Montserrat", sans-serif';
        ctx.fillStyle = '#e8f3f0';
        for (let mm = 0; mm <= 38; mm++) {
          const x = zeroX + mm * pxPerMm;
          if (x > cssW - 22) break;
          const isTen = mm % 10 === 0;
          const isFive = mm % 5 === 0;
          const h = isTen ? 18 : isFive ? 13 : 8;
          ctx.beginPath();
          ctx.moveTo(x, mainY);
          ctx.lineTo(x, mainY - h);
          ctx.stroke();
          if (isTen) {
            ctx.fillText(String(mm), x - 5, mainY - 21);
          }
        }

        // Measured object highlight between 0 and vernierMm
        const vZeroX = zeroX + vernierMm * pxPerMm;
        ctx.fillStyle = 'rgba(125,211,200,0.28)';
        ctx.fillRect(zeroX, mainY + 2, Math.max(0, vZeroX - zeroX), 26);

        // Vernier sliding scale (20 divisions spanning 19 mm -> each div = 0.95 mm)
        ctx.fillStyle = 'rgba(252,226,88,0.15)';
        ctx.fillRect(vZeroX - 6, vernY, 19 * pxPerMm + 16, 36);
        ctx.strokeStyle = '#fce258';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(vZeroX - 6, vernY);
        ctx.lineTo(vZeroX + 19 * pxPerMm + 10, vernY);
        ctx.stroke();

        for (let k = 0; k <= 20; k++) {
          const x = vZeroX + k * 0.95 * pxPerMm;
          const aligned = k === vernierIdx;
          ctx.strokeStyle = aligned ? '#ffdf5d' : 'rgba(252,226,88,0.75)';
          ctx.lineWidth = aligned ? 2.4 : 1.1;
          const h = k % 5 === 0 ? 16 : 10;
          ctx.beginPath();
          ctx.moveTo(x, vernY);
          ctx.lineTo(x, vernY + h);
          ctx.stroke();
          if (aligned) {
            ctx.strokeStyle = 'rgba(255,223,93,0.7)';
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(x, mainY - 20);
            ctx.lineTo(x, vernY + 28);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          if (k % 5 === 0) {
            ctx.fillStyle = aligned ? '#ffdf5d' : '#e8f3f0';
            ctx.fillText(String(k), x - 3, vernY + 29);
          }
        }

        ctx.fillStyle = '#fce258';
        ctx.font = 'bold 12px "Noto Sans TC", sans-serif';
        ctx.fillText(
          `主尺 ${mainInt} mm + 游標第 ${vernierIdx} 格 × 0.05 = ${vernierMm.toFixed(2)} mm`,
          16,
          22
        );
        ctx.fillStyle = '#7dd3c8';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        ctx.fillText('黃色虛線標示主尺與游標尺完全對齊的刻線位置', 16, 40);
      } else if (simType === 'chase') {
        const disc = vFront * vFront + 2 * aRear * gap0;
        const tCatch = (vFront + Math.sqrt(disc)) / aRear;
        const tMax = Math.max(tCatch + 1.2, 6);
        const simT = t % tMax;

        const xRear = 0.5 * aRear * simT * simT;
        const xFront = gap0 + vFront * simT;
        const xScale = (cssW - 60) / Math.max(gap0 + vFront * tMax, 0.5 * aRear * tMax * tMax, 1);

        const roadY = 64;
        ctx.strokeStyle = 'rgba(232,243,240,0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(24, roadY);
        ctx.lineTo(cssW - 24, roadY);
        ctx.stroke();

        const rx = 28 + Math.min(xRear * xScale, cssW - 64);
        const fx = 28 + Math.min(xFront * xScale, cssW - 64);

        ctx.fillStyle = '#fce258';
        ctx.fillRect(rx - 10, roadY - 16, 20, 11);
        ctx.font = 'bold 10px "Noto Sans TC", sans-serif';
        ctx.fillText('後車(加速)', Math.max(12, rx - 22), roadY - 22);

        ctx.fillStyle = '#7dd3c8';
        ctx.fillRect(fx - 10, roadY - 16, 20, 11);
        ctx.fillText('前車(等速)', Math.max(12, fx - 22), roadY + 14);

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
        const yVf = gy0 - (vFront / vMax) * gh;
        ctx.strokeStyle = '#7dd3c8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gx0, yVf);
        ctx.lineTo(gx0 + gw, yVf);
        ctx.stroke();

        ctx.strokeStyle = '#fce258';
        ctx.beginPath();
        ctx.moveTo(gx0, gy0);
        ctx.lineTo(gx0 + gw, gy0 - Math.min(1, (aRear * tMax) / vMax) * gh);
        ctx.stroke();

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
      } else if (simType === 'vertical') {
        const tPeak = vertV0 / vertG;
        const tTotal = 2 * tPeak;
        const maxH = (vertV0 * vertV0) / (2 * vertG);
        const simT = t % (tTotal + 0.8);
        const curT = Math.min(simT, tTotal);
        const curY = Math.max(0, vertV0 * curT - 0.5 * vertG * curT * curT);
        const curV = vertV0 - vertG * curT;

        // Left side: vertical motion tube
        const trackX = 72;
        const botY = 192;
        const topY = 42;
        const hPx = botY - topY;

        ctx.strokeStyle = 'rgba(232,243,240,0.45)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(trackX - 24, botY);
        ctx.lineTo(trackX + 24, botY);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(232,243,240,0.22)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(trackX, botY);
        ctx.lineTo(trackX, topY);
        ctx.stroke();
        ctx.setLineDash([]);

        const ballY = botY - (curY / Math.max(maxH, 1)) * hPx;
        ctx.fillStyle = '#fce258';
        ctx.beginPath();
        ctx.arc(trackX, ballY, 7, 0, Math.PI * 2);
        ctx.fill();

        const vArrow = (curV / Math.max(vertV0, 1)) * 38;
        if (Math.abs(vArrow) > 2) {
          drawArrow(ctx, trackX + 14, ballY, trackX + 14, ballY - vArrow, curV >= 0 ? '#7dd3c8' : '#f5a97f', 'v');
        }

        // Right side: y-t parabola showing symmetry
        const gx0 = 150;
        const gy0 = 192;
        const gw = cssW - 176;
        const gh = 132;
        ctx.strokeStyle = 'rgba(232,243,240,0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(gx0, gy0 - gh);
        ctx.lineTo(gx0, gy0);
        ctx.lineTo(gx0 + gw, gy0);
        ctx.stroke();

        // Symmetry vertical line at tPeak
        ctx.strokeStyle = 'rgba(252,226,88,0.45)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(gx0 + gw * 0.5, gy0 - gh);
        ctx.lineTo(gx0 + gw * 0.5, gy0);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = '#7dd3c8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 50; i++) {
          const ti = (tTotal * i) / 50;
          const yi = vertV0 * ti - 0.5 * vertG * ti * ti;
          const px = gx0 + (ti / tTotal) * gw;
          const py = gy0 - (yi / Math.max(maxH, 1)) * gh;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        const dotX = gx0 + (curT / tTotal) * gw;
        const dotY = gy0 - (curY / Math.max(maxH, 1)) * gh;
        ctx.fillStyle = '#fce258';
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e8f3f0';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        ctx.fillText(
          `最高點 H = ${maxH.toFixed(1)} m｜上升 = 下降 = ${tPeak.toFixed(2)} s｜v = ${curV.toFixed(1)} m/s`,
          14,
          18
        );
      } else if (simType === 'river') {
        const rad = (boatAngle * Math.PI) / 180;
        const vx = vRiver - vBoat * Math.sin(rad);
        const vy = vBoat * Math.cos(rad);
        const riverW = 120;
        const topY = 48;
        const botY = topY + riverW;

        ctx.fillStyle = 'rgba(197,139,89,0.22)';
        ctx.fillRect(0, 26, cssW, 22);
        ctx.fillRect(0, botY, cssW, 24);
        ctx.fillStyle = 'rgba(125,211,200,0.14)';
        ctx.fillRect(0, topY, cssW, riverW);

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

        ctx.strokeStyle = 'rgba(252,226,88,0.6)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(startX, botY);
        ctx.lineTo(startX + driftPx, topY);
        ctx.stroke();
        ctx.setLineDash([]);

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

        ctx.strokeStyle = 'rgba(232,243,240,0.45)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(16, groundY);
        ctx.lineTo(cssW - 16, groundY);
        ctx.stroke();

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
      } else if (simType === 'shm') {
        const cx = 82;
        const cy = 122;
        const r = shmAmp;
        const theta = t * shmOmega;
        const px = cx + r * Math.cos(theta);
        const py = cy - r * Math.sin(theta);

        // Reference circle
        ctx.strokeStyle = 'rgba(227,243,240,0.45)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();

        // Radius vector
        drawArrow(ctx, cx, cy, px, py, '#7dd3c8', '', 2);
        ctx.fillStyle = '#7dd3c8';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();

        // Projection line to wave origin
        const waveX0 = 166;
        const waveW = cssW - waveX0 - 18;
        ctx.strokeStyle = 'rgba(252,226,88,0.6)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(waveX0, py);
        ctx.stroke();
        ctx.setLineDash([]);

        // Center axis for wave
        ctx.strokeStyle = 'rgba(227,243,240,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(waveX0, cy);
        ctx.lineTo(waveX0 + waveW, cy);
        ctx.stroke();

        // Oscillating block on vertical axis at waveX0
        ctx.fillStyle = '#fce258';
        ctx.beginPath();
        ctx.arc(waveX0, py, 6, 0, Math.PI * 2);
        ctx.fill();

        // Sine wave trail
        ctx.strokeStyle = '#fce258';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 80; i++) {
          const wx = waveX0 + (waveW * i) / 80;
          const phase = theta - (i / 80) * Math.PI * 3;
          const wy = cy - r * Math.sin(phase);
          if (i === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();

        const period = (2 * Math.PI) / shmOmega;
        ctx.fillStyle = '#e8f3f0';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        ctx.fillText(
          `週期 T = ${period.toFixed(2)} s｜v_max = ωA = ${(shmOmega * (shmAmp / 10)).toFixed(1)}｜a_max = ω²A = ${(shmOmega * shmOmega * (shmAmp / 10)).toFixed(1)}`,
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

        const M = (t * 0.9) % (Math.PI * 2);
        let E = M;
        for (let k = 0; k < 5; k++) {
          E = E - (E - ecc * Math.sin(E) - M) / (1 - ecc * Math.cos(E));
        }
        const px = centerX + a * Math.cos(E);
        const py = centerY + b * Math.sin(E);

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

        ctx.strokeStyle = 'rgba(227,243,240,0.45)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#fce258';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 9, 0, Math.PI * 2);
        ctx.fill();

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
      } else if (simType === 'collision') {
        // Block 1 moves right with u1, Block 2 initially at rest (u2 = 0)
        const v1Final = ((m1 - restitution * m2) * u1) / (m1 + m2);
        const v2Final = ((1 + restitution) * m1 * u1) / (m1 + m2);
        const pTotal = m1 * u1;
        const keBefore = 0.5 * m1 * u1 * u1;
        const keAfter = 0.5 * m1 * v1Final * v1Final + 0.5 * m2 * v2Final * v2Final;
        const keLossPct = keBefore > 0 ? ((keBefore - keAfter) / keBefore) * 100 : 0;

        const floorY = 148;
        ctx.strokeStyle = 'rgba(232,243,240,0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, floorY);
        ctx.lineTo(cssW - 20, floorY);
        ctx.stroke();

        const w1 = 22 + m1 * 3;
        const w2 = 22 + m2 * 3;
        const startX1 = 44;
        const startX2 = cssW * 0.48;
        const pxPerUnit = 18;
        const tHit = (startX2 - (startX1 + w1)) / Math.max(u1 * pxPerUnit, 1);
        const loopT = t % (tHit + 2.4);

        let x1: number;
        let x2: number;
        let curV1: number;
        let curV2: number;
        if (loopT < tHit) {
          x1 = startX1 + u1 * pxPerUnit * loopT;
          x2 = startX2;
          curV1 = u1;
          curV2 = 0;
        } else {
          const dtAfter = loopT - tHit;
          x1 = startX2 - w1 + v1Final * pxPerUnit * dtAfter;
          x2 = startX2 + v2Final * pxPerUnit * dtAfter;
          curV1 = v1Final;
          curV2 = v2Final;
        }

        // Draw blocks
        ctx.fillStyle = '#fce258';
        ctx.fillRect(x1, floorY - w1, w1, w1);
        ctx.fillStyle = '#1b3630';
        ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
        ctx.fillText(`m₁`, x1 + w1 / 2 - 8, floorY - w1 / 2 + 4);

        ctx.fillStyle = '#7dd3c8';
        ctx.fillRect(x2, floorY - w2, w2, w2);
        ctx.fillStyle = '#1b3630';
        ctx.fillText(`m₂`, x2 + w2 / 2 - 8, floorY - w2 / 2 + 4);

        if (Math.abs(curV1) > 0.1) {
          drawArrow(ctx, x1 + w1 / 2, floorY - w1 - 12, x1 + w1 / 2 + curV1 * 8, floorY - w1 - 12, '#fce258', `v₁=${curV1.toFixed(1)}`);
        }
        if (Math.abs(curV2) > 0.1) {
          drawArrow(ctx, x2 + w2 / 2, floorY - w2 - 12, x2 + w2 / 2 + curV2 * 8, floorY - w2 - 12, '#7dd3c8', `v₂=${curV2.toFixed(1)}`);
        }

        ctx.fillStyle = '#e8f3f0';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        ctx.fillText(`碰後速度：v₁' = ${v1Final.toFixed(2)} m/s｜v₂' = ${v2Final.toFixed(2)} m/s`, 14, 18);
        ctx.fillStyle = '#fce258';
        ctx.fillText(`總動量守恆 P = ${pTotal.toFixed(1)} kg·m/s｜動能損耗 ${keLossPct.toFixed(1)}%`, 14, 198);
      } else if (simType === 'standing_wave') {
        const leftX = 32;
        const rightX = cssW - 32;
        const L = rightX - leftX;
        const midY = 122;
        const amp = 46;
        const omega = 3.2;

        // Equilibrium line
        ctx.strokeStyle = 'rgba(232,243,240,0.28)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftX, midY);
        ctx.lineTo(rightX, midY);
        ctx.stroke();

        // Optional incident & reflected traveling waves
        if (showComponents) {
          ctx.setLineDash([4, 4]);
          ctx.lineWidth = 1.3;
          ctx.strokeStyle = 'rgba(125,211,200,0.45)';
          ctx.beginPath();
          for (let i = 0; i <= 100; i++) {
            const frac = i / 100;
            const y = midY - (amp / 2) * Math.sin(harmonicN * Math.PI * frac - omega * t);
            if (i === 0) ctx.moveTo(leftX + frac * L, y);
            else ctx.lineTo(leftX + frac * L, y);
          }
          ctx.stroke();

          ctx.strokeStyle = 'rgba(245,169,127,0.45)';
          ctx.beginPath();
          for (let i = 0; i <= 100; i++) {
            const frac = i / 100;
            const y = midY - (amp / 2) * Math.sin(harmonicN * Math.PI * frac + omega * t);
            if (i === 0) ctx.moveTo(leftX + frac * L, y);
            else ctx.lineTo(leftX + frac * L, y);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Superposed standing wave
        ctx.strokeStyle = '#fce258';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) {
          const frac = i / 120;
          const y = midY - amp * Math.sin(harmonicN * Math.PI * frac) * Math.cos(omega * t);
          if (i === 0) ctx.moveTo(leftX + frac * L, y);
          else ctx.lineTo(leftX + frac * L, y);
        }
        ctx.stroke();

        // Nodes (N) & Antinodes (A)
        ctx.font = 'bold 10px "Noto Sans TC", sans-serif';
        for (let k = 0; k <= harmonicN; k++) {
          const nx = leftX + (k / harmonicN) * L;
          ctx.fillStyle = '#f5a97f';
          ctx.beginPath();
          ctx.arc(nx, midY, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillText('N', nx - 4, midY + 18);
        }
        for (let k = 0; k < harmonicN; k++) {
          const ax = leftX + ((k + 0.5) / harmonicN) * L;
          ctx.fillStyle = '#7dd3c8';
          ctx.fillText('A', ax - 4, midY - amp - 8);
        }

        ctx.fillStyle = '#e8f3f0';
        ctx.font = '11px "Noto Sans TC", sans-serif';
        ctx.fillText(
          `第 ${harmonicN} 諧音｜波節 ${harmonicN + 1} 個、波腹 ${harmonicN} 個｜λ = 2L / ${harmonicN}`,
          14,
          18
        );
      }

      ctx.restore();
      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [
    simType,
    playing,
    vernierMm,
    vFront,
    aRear,
    gap0,
    vertV0,
    vertG,
    vBoat,
    vRiver,
    boatAngle,
    projV0,
    projDeg,
    showComplement,
    shmAmp,
    shmOmega,
    inclineDeg,
    mu,
    ecc,
    m1,
    m2,
    u1,
    restitution,
    harmonicN,
    showComponents,
  ]);

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
        {simType !== 'vernier' && (
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
        )}
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-[220px] rounded-lg border border-[#24554F]/40 block"
      />

      <div className="mt-3 space-y-2 text-[12px] text-neutral-700">
        {simType === 'vernier' && (
          <label className="flex items-center justify-between gap-3">
            <span className="font-semibold text-[#1D4742] whitespace-nowrap">待測物寬度：{vernierMm.toFixed(2)} mm</span>
            <input type="range" min={0} max={28} step={0.05} value={vernierMm} onChange={(e) => setVernierMm(Number(e.target.value))} className="w-44 accent-[#24554F]" />
          </label>
        )}

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

        {simType === 'vertical' && (
          <>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">上拋初速 v₀：{vertV0} m/s</span>
              <input type="range" min={10} max={40} step={1} value={vertV0} onChange={(e) => setVertV0(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">重力加速度 g：{vertG.toFixed(1)} m/s²</span>
              <input type="range" min={1.6} max={15} step={0.2} value={vertG} onChange={(e) => setVertG(Number(e.target.value))} className="w-40 accent-[#24554F]" />
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

        {simType === 'shm' && (
          <>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">振幅 A：{(shmAmp / 10).toFixed(1)} cm</span>
              <input type="range" min={20} max={62} step={2} value={shmAmp} onChange={(e) => setShmAmp(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">角頻率 ω：{shmOmega.toFixed(1)} rad/s</span>
              <input type="range" min={0.6} max={4.5} step={0.1} value={shmOmega} onChange={(e) => setShmOmega(Number(e.target.value))} className="w-40 accent-[#24554F]" />
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

        {simType === 'collision' && (
          <>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">左球質量 m₁：{m1} kg</span>
              <input type="range" min={1} max={8} step={1} value={m1} onChange={(e) => setM1(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">右球質量 m₂：{m2} kg</span>
              <input type="range" min={1} max={8} step={1} value={m2} onChange={(e) => setM2(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">左球初速 u₁：{u1} m/s</span>
              <input type="range" min={2} max={10} step={1} value={u1} onChange={(e) => setU1(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">恢復係數 e：{restitution.toFixed(1)}（{restitution === 1 ? '彈性' : restitution === 0 ? '完全非彈性' : '部分非彈性'}）</span>
              <input type="range" min={0} max={1} step={0.1} value={restitution} onChange={(e) => setRestitution(Number(e.target.value))} className="w-32 accent-[#24554F]" />
            </label>
          </>
        )}

        {simType === 'standing_wave' && (
          <>
            <label className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#1D4742] whitespace-nowrap">諧音數 n：第 {harmonicN} 諧音</span>
              <input type="range" min={1} max={6} step={1} value={harmonicN} onChange={(e) => setHarmonicN(Number(e.target.value))} className="w-40 accent-[#24554F]" />
            </label>
            <label className="inline-flex items-center gap-2 text-xs text-[#24554F] font-semibold cursor-pointer">
              <input type="checkbox" checked={showComponents} onChange={(e) => setShowComponents(e.target.checked)} className="accent-[#24554F]" />
              <span>顯示入射波（青虛線）與反射波（橘虛線）疊加分解</span>
            </label>
          </>
        )}
      </div>
    </section>
  );
}
