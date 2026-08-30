'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClear?: () => void;
  width?: number;
  height?: number;
  label?: string;
}

export function SignaturePad({
  onSave,
  onClear,
  width = 420,
  height = 160,
  label = 'التوقيع الإلكتروني للمستلم (Consignee Digital Signature)',
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#171A20';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    if (onClear) onClear();
  };

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="space-y-2.5 font-sans">
      {label && (
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#5C5E62] font-[500] flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-[#3E6AE1]" />
            <span>{label}</span>
          </span>
          <span className="text-[11px] text-[#8E8E8E]">وقع بإصبعك أو الماوس</span>
        </div>
      )}

      <div className="border border-[#D0D1D2] rounded-[4px] bg-[#FFFFFF] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full touch-none cursor-crosshair block"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={handleClear}
          disabled={!hasDrawn}
          className="btn-tesla-secondary !min-h-[32px] !py-0.5 !px-3 text-[12px] flex items-center gap-1.5 disabled:opacity-40"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>مسح التوقيع</span>
        </button>

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!hasDrawn}
          className="btn-tesla-primary !min-h-[32px] !py-0.5 !px-4 text-[12px] flex items-center gap-1.5 disabled:opacity-40"
        >
          <Check className="w-3.5 h-3.5" />
          <span>اعتماد التوقيع</span>
        </button>
      </div>
    </div>
  );
}
