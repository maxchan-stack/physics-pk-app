import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 行動端「手寫計算塗鴉板」邏輯之 Custom Hook
 * 支援高 DPI 螢幕解析度縮放、換題自動清空筆跡與多色畫筆切換
 *
 * @param resetKey 題目識別鍵，變動時自動清空畫布以免殘留上一題算式
 * @returns Canvas Ref、畫筆狀態、筆跡狀態與繪圖事件處理器
 */
export function useScratchpad(resetKey?: string | number) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasStrokes, setHasStrokes] = useState<boolean>(false);
  const [penColor, setPenColor] = useState<string>('#1f449c');

  /**
   * 依據容器尺寸與裝置像素比 (devicePixelRatio) 初始化高清晰畫布
   */
  const syncCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    const targetWidth = Math.max(1, Math.floor(parent.clientWidth * dpr));
    const targetHeight = Math.max(1, Math.floor(parent.clientHeight * dpr));

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      setHasStrokes(false);
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  /**
   * 清除整個計算紙畫布
   */
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setHasStrokes(false);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    setHasStrokes(false);
  }, []);

  // 展開時初始化畫布尺寸，並監聽容器寬高變化
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    syncCanvasDimensions();

    const parent = canvasRef.current?.parentElement;
    if (!parent || typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', syncCanvasDimensions);
      return () => window.removeEventListener('resize', syncCanvasDimensions);
    }

    const observer = new ResizeObserver(() => {
      syncCanvasDimensions();
    });
    observer.observe(parent);
    return () => observer.disconnect();
  }, [isOpen, syncCanvasDimensions]);

  // 切換題目時自動清空上一題的計算筆跡
  useEffect(() => {
    setIsDrawing(false);
    clearCanvas();
  }, [resetKey, clearCanvas]);

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      if (!touch) {
        return null;
      }
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleStartDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!coords || !canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasStrokes(true);
  };

  const handleMoveDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) {
      return;
    }
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    if (!coords || !canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const handleEndDraw = () => {
    setIsDrawing(false);
  };

  return {
    canvasRef,
    isOpen,
    setIsOpen,
    penColor,
    setPenColor,
    hasStrokes,
    clearCanvas,
    handleStartDraw,
    handleMoveDraw,
    handleEndDraw,
  };
}
