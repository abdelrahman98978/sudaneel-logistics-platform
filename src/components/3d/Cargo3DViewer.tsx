'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Lock, Thermometer, ShieldCheck, Rotate3d, Play, Pause } from 'lucide-react';

interface Cargo3DViewerProps {
  containerId?: string;
  sealNumber?: string;
  temperature?: number;
  cargoType?: string;
  isReefer?: boolean;
}

export function Cargo3DViewer({
  containerId = 'SUDU-482910-2',
  sealNumber = 'ES-994821',
  temperature = 4.2,
  cargoType = 'سمسم أبيض ممتاز (Grade 1 Export Sesame)',
  isReefer = false,
}: Cargo3DViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef<HTMLSpanElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: 20, y: 45 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let h = (canvas.height = 300);

    const onResize = () => {
      if (!canvas.parentElement) return;
      w = canvas.width = canvas.parentElement.clientWidth;
      h = canvas.height = Math.min(canvas.parentElement.clientWidth * 0.6, 320);
    };
    window.addEventListener('resize', onResize);

    const render = () => {
      if (isRotating && !isDragging.current) {
        rot.current.y += 0.6;
        if (rot.current.y >= 360) rot.current.y = 0;
        if (angleRef.current) {
          angleRef.current.textContent = `${Math.round(rot.current.y)}°`;
        }
      }

      ctx.clearRect(0, 0, w, h);

      // Deep radial glow backdrop
      const grad = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 1.5);
      grad.addColorStop(0, 'rgba(8, 73, 168, 0.25)');
      grad.addColorStop(0.6, 'rgba(3, 44, 112, 0.5)');
      grad.addColorStop(1, 'rgba(1, 13, 38, 0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const radY = (rot.current.y * Math.PI) / 180;
      const radX = (rot.current.x * Math.PI) / 180;

      // Draw Grid Base
      ctx.save();
      ctx.translate(w / 2, h / 2 + 75);
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
      ctx.lineWidth = 1;
      for (let i = -5; i <= 5; i++) {
        const p1 = project3D(i * 25, 0, -125, radY, radX);
        const p2 = project3D(i * 25, 0, 125, radY, radX);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();

      // Draw 3D Container (Length: 160, Height: 70, Depth: 70)
      ctx.save();
      ctx.translate(w / 2, h / 2);

      const cL = 160;
      const cH = 70;
      const cD = 70;

      // Primary Body
      drawContainerBox(ctx, 0, 0, 0, cL, cH, cD, radY, radX, isReefer);

      // Smart E-Seal Lock indicator on container rear door
      const sealPos = project3D(-cL / 2 - 2, 0, 0, radY, radX);
      ctx.fillStyle = '#14A44D';
      ctx.beginPath();
      ctx.arc(sealPos.x, sealPos.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [isRotating, isReefer]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - prevMouse.current.x;
    const dy = e.clientY - prevMouse.current.y;
    rot.current.y += dx * 0.8;
    rot.current.x = Math.max(5, Math.min(60, rot.current.x + dy * 0.4));
    prevMouse.current = { x: e.clientX, y: e.clientY };
    if (angleRef.current) {
      angleRef.current.textContent = `${Math.round(rot.current.y % 360)}°`;
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative rounded-[20px] overflow-hidden border border-[#2563EB]/30 bg-[#021333] text-white">
      {/* Top Header Controls */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 p-2 rounded-[14px] bg-[#032C70]/70 backdrop-blur-md border border-white/10 text-[12px]">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-[#D7A11E]" />
          <span className="font-mono font-[600] text-white">{containerId}</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#14A44D]/20 text-[#4ADE80] border border-[#14A44D]/30 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>SEAL: {sealNumber}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-[#D7A11E] flex items-center gap-1">
            <Rotate3d className="w-3.5 h-3.5 animate-spin" />
            <span ref={angleRef}>45°</span>
          </span>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="w-full h-[280px] sm:h-[300px] cursor-grab active:cursor-grabbing block"
      />

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-[12px] bg-[#032C70]/70 backdrop-blur-md border border-white/10 text-[11.5px]">
        <div className="flex items-center gap-2">
          <Thermometer className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>حالة التبريد والرطوبة:</span>
          <span className="font-mono font-[600] text-[#06B6D4]">{temperature}°C (Optimal)</span>
        </div>

        <div className="text-white/60 font-mono text-[11px]">
          <span>40FT HIGH CUBE ISO • 32,500 KG MAX</span>
        </div>
      </div>
    </div>
  );
}

function project3D(x: number, y: number, z: number, radY: number, radX: number) {
  const x1 = x * Math.cos(radY) + z * Math.sin(radY);
  const z1 = -x * Math.sin(radY) + z * Math.cos(radY);
  const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
  const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);
  return { x: x1, y: y2, z: z2 };
}

function drawContainerBox(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  cz: number,
  w: number,
  h: number,
  d: number,
  radY: number,
  radX: number,
  isReefer: boolean
) {
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;

  const v = [
    project3D(cx - hw, cy - hh, cz - hd, radY, radX),
    project3D(cx + hw, cy - hh, cz - hd, radY, radX),
    project3D(cx + hw, cy + hh, cz - hd, radY, radX),
    project3D(cx - hw, cy + hh, cz - hd, radY, radX),
    project3D(cx - hw, cy - hh, cz + hd, radY, radX),
    project3D(cx + hw, cy - hh, cz + hd, radY, radX),
    project3D(cx + hw, cy + hh, cz + hd, radY, radX),
    project3D(cx - hw, cy + hh, cz + hd, radY, radX),
  ];

  const colFront = isReefer ? '#0849A8' : '#032C70';
  const colTop = isReefer ? '#0B5ED7' : '#0849A8';
  const colSide = isReefer ? '#021333' : '#011538';

  // Front Face
  ctx.fillStyle = colFront;
  ctx.beginPath();
  ctx.moveTo(v[4].x, v[4].y);
  ctx.lineTo(v[5].x, v[5].y);
  ctx.lineTo(v[6].x, v[6].y);
  ctx.lineTo(v[7].x, v[7].y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(215, 161, 30, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Corrugation Vertical Grooves on Front
  const numGrooves = 12;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  for (let i = 1; i < numGrooves; i++) {
    const gx = cx - hw + (w / numGrooves) * i;
    const pTop = project3D(gx, cy - hh, cz + hd, radY, radX);
    const pBottom = project3D(gx, cy + hh, cz + hd, radY, radX);
    ctx.beginPath();
    ctx.moveTo(pTop.x, pTop.y);
    ctx.lineTo(pBottom.x, pBottom.y);
    ctx.stroke();
  }

  // Top Face
  ctx.fillStyle = colTop;
  ctx.beginPath();
  ctx.moveTo(v[0].x, v[0].y);
  ctx.lineTo(v[1].x, v[1].y);
  ctx.lineTo(v[5].x, v[5].y);
  ctx.lineTo(v[4].x, v[4].y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.stroke();

  // Side Face
  ctx.fillStyle = colSide;
  ctx.beginPath();
  ctx.moveTo(v[1].x, v[1].y);
  ctx.lineTo(v[2].x, v[2].y);
  ctx.lineTo(v[6].x, v[6].y);
  ctx.lineTo(v[5].x, v[5].y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.stroke();

  // Container Brand Text
  const centerFront = project3D(cx, cy, cz + hd + 1, radY, radX);
  ctx.fillStyle = '#D7A11E';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SUDANEEL CARGO', centerFront.x, centerFront.y);
}
