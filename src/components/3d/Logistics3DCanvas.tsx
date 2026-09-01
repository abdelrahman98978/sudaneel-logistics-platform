'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Truck, Anchor, Globe2, Rotate3d, Play, Pause, Sparkles, Compass } from 'lucide-react';

type Mode3D = 'truck' | 'port' | 'corridors';

export function Logistics3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef<HTMLSpanElement>(null);
  const [activeMode, setActiveMode] = useState<Mode3D>('truck');
  const [isRotating, setIsRotating] = useState(true);

  // Mouse interaction state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 15, y: 35 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 460);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(canvas.parentElement.clientWidth * 0.55, 480);
    };

    window.addEventListener('resize', handleResize);

    // Particle network for cyber-maritime ambient depth
    const particles = Array.from({ length: 45 }, () => ({
      x: (Math.random() - 0.5) * width,
      y: (Math.random() - 0.5) * height,
      z: Math.random() * 400 - 200,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.4 + 0.1,
    }));

    // Trade Nodes (Port Sudan, Khartoum, Gallabat, Nyala)
    const nodes = [
      { name: 'بورتسودان (Port Sudan)', x: 140, y: -60, z: 20, color: '#D7A11E', type: 'port' },
      { name: 'الخرطوم (Khartoum)', x: 0, y: 10, z: 40, color: '#2563EB', type: 'hub' },
      { name: 'القلابات (Gallabat)', x: 80, y: 80, z: -20, color: '#14A44D', type: 'border' },
      { name: 'نيالا (Nyala)', x: -140, y: 70, z: -10, color: '#06B6D4', type: 'corridor' },
    ];

    let t = 0;

    const render = () => {
      t += 0.015;
      if (isRotating && !isDragging.current) {
        rotation.current.y += 0.5;
        if (rotation.current.y >= 360) rotation.current.y = 0;
        if (angleRef.current) {
          angleRef.current.textContent = `${Math.round(rotation.current.y)}°`;
        }
      }

      ctx.clearRect(0, 0, width, height);

      // Deep Cyber Gradient Background
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        20,
        width / 2,
        height / 2,
        width / 1.5
      );
      bgGrad.addColorStop(0, 'rgba(8, 73, 168, 0.25)');
      bgGrad.addColorStop(0.5, 'rgba(3, 44, 112, 0.45)');
      bgGrad.addColorStop(1, 'rgba(1, 15, 45, 0.85)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 3D Isometric Grid Floor with Depth Perspective
      ctx.save();
      ctx.translate(width / 2, height / 2 + 120);

      const radY = (rotation.current.y * Math.PI) / 180;
      const radX = (rotation.current.x * Math.PI) / 180;

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.15)';
      ctx.lineWidth = 1;
      const gridSize = 160;
      const gridSteps = 8;
      const step = gridSize / gridSteps;

      for (let i = -gridSteps; i <= gridSteps; i++) {
        const xVal = i * step;
        ctx.beginPath();
        // Project onto isometric tilted plane
        const p1x = xVal * Math.cos(radY) - -gridSize * Math.sin(radY);
        const p1y = (xVal * Math.sin(radY) + -gridSize * Math.cos(radY)) * Math.sin(radX);
        const p2x = xVal * Math.cos(radY) - gridSize * Math.sin(radY);
        const p2y = (xVal * Math.sin(radY) + gridSize * Math.cos(radY)) * Math.sin(radX);
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.stroke();
      }

      // Draw Concentric Radar Rings
      ctx.strokeStyle = 'rgba(215, 161, 30, 0.2)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 150, 150 * Math.sin(radX), 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 90, 90 * Math.sin(radX), 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // Render Floating 3D Particles
      particles.forEach((p) => {
        p.y += p.speed;
        if (p.y > height / 2) p.y = -height / 2;

        const pX = width / 2 + p.x;
        const pY = height / 2 + p.y;
        const scale = (p.z + 300) / 400;

        ctx.fillStyle = `rgba(215, 161, 30, ${Math.max(0.1, scale * 0.5)})`;
        ctx.beginPath();
        ctx.arc(pX, pY, p.size * scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3D Object Rendering based on activeMode
      ctx.save();
      ctx.translate(width / 2, height / 2 + 20);

      const rotRadY = (rotation.current.y * Math.PI) / 180;
      const rotRadX = (rotation.current.x * Math.PI) / 180;

      if (activeMode === 'truck') {
        // Render 3D Heavy Haulage Truck & Container
        render3DTruck(ctx, rotRadY, rotRadX, t);
      } else if (activeMode === 'port') {
        // Render Port Sudan Maritime Terminal
        render3DPort(ctx, rotRadY, rotRadX, t);
      } else {
        // Render 3D Trade Corridors Network
        render3DCorridors(ctx, rotRadY, rotRadX, nodes, t);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeMode, isRotating]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    rotation.current.y += deltaX * 0.8;
    rotation.current.x = Math.max(5, Math.min(60, rotation.current.x + deltaY * 0.4));

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
    if (angleRef.current) {
      angleRef.current.textContent = `${Math.round(rotation.current.y % 360)}°`;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative w-full rounded-[24px] overflow-hidden border border-[#2563EB]/30 bg-[#021333] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* 3D Mode Switcher Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-2 rounded-[16px] bg-[#032C70]/70 backdrop-blur-xl border border-white/10 text-white text-[12px]">
        {/* Mode Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveMode('truck')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-[500] transition-all duration-200 cursor-pointer ${
              activeMode === 'truck'
                ? 'bg-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>الأسطول الثقيل (Heavy Fleet 3D)</span>
          </button>

          <button
            onClick={() => setActiveMode('port')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-[500] transition-all duration-200 cursor-pointer ${
              activeMode === 'port'
                ? 'bg-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>ميناء بورتسودان (Port Sudan Hub)</span>
          </button>

          <button
            onClick={() => setActiveMode('corridors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-[500] transition-all duration-200 cursor-pointer ${
              activeMode === 'corridors'
                ? 'bg-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>الممرات السيادية (Trade Corridors)</span>
          </button>
        </div>

        {/* 360 Rotation Controls */}
        <div className="flex items-center gap-2 text-white/80">
          <span className="font-mono text-[11px] text-[#D7A11E] flex items-center gap-1">
            <Rotate3d className="w-3.5 h-3.5 animate-spin" />
            <span ref={angleRef}>35°</span>
          </span>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title={isRotating ? 'إيقاف الدوران التلقائي' : 'تشغيل الدوران'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full h-[460px] cursor-grab active:cursor-grabbing block"
      />

      {/* Footer Info HUD Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-[14px] bg-[#032C70]/70 backdrop-blur-xl border border-white/10 text-white text-[11.5px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#14A44D] animate-ping" />
          <span className="font-[500]">تفاعل ثلاثي الأبعاد حي (WebGL Live Matrix)</span>
          <span className="text-white/50 hidden sm:inline">| اسحب بالماوس للتدوير 360°</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-white/70">
          <span>LAT: 19.6158° N</span>
          <span>LNG: 37.2164° E</span>
          <span className="text-[#D7A11E]">SUDANEEL-3D-V3</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 3D Rendering Helper Functions
// ============================================================

function project3D(x: number, y: number, z: number, radY: number, radX: number) {
  // Rotate around Y-axis
  const x1 = x * Math.cos(radY) + z * Math.sin(radY);
  const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

  // Rotate around X-axis
  const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
  const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

  return { x: x1, y: y2, z: z2 };
}

function render3DTruck(ctx: CanvasRenderingContext2D, radY: number, radX: number, t: number) {
  // Container dimensions
  const cW = 120;
  const cH = 55;
  const cD = 50;

  // Cab dimensions
  const cabW = 45;
  const cabH = 50;
  const cabD = 48;

  // Draw Cab
  drawBox(ctx, -75, -cabH / 2, 0, cabW, cabH, cabD, radY, radX, '#0849A8', '#0B5ED7', '#2563EB');

  // Draw Container with Sudaneel Logo Branding
  drawBox(ctx, 15, -cH / 2, 0, cW, cH, cD, radY, radX, '#032C70', '#0849A8', '#D7A11E');

  // Truck Headlights Laser Beams
  const lightOrigin = project3D(-95, 10, 0, radY, radX);
  const lightTarget1 = project3D(-180, 25, -35, radY, radX);
  const lightTarget2 = project3D(-180, 25, 35, radY, radX);

  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(lightOrigin.x, lightOrigin.y);
  ctx.lineTo(lightTarget1.x, lightTarget1.y);
  ctx.moveTo(lightOrigin.x, lightOrigin.y);
  ctx.lineTo(lightTarget2.x, lightTarget2.y);
  ctx.stroke();

  // Wheels
  const wheelPositions = [
    { x: -75, y: 25, z: 24 },
    { x: -75, y: 25, z: -24 },
    { x: 30, y: 25, z: 24 },
    { x: 30, y: 25, z: -24 },
    { x: 65, y: 25, z: 24 },
    { x: 65, y: 25, z: -24 },
  ];

  wheelPositions.forEach((w) => {
    const p = project3D(w.x, w.y, w.z, radY, radX);
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#D7A11E';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
}

function render3DPort(ctx: CanvasRenderingContext2D, radY: number, radX: number, t: number) {
  // Container stacks
  drawBox(ctx, -60, 0, -40, 50, 40, 25, radY, radX, '#D7A11E', '#E5A922', '#FDE047');
  drawBox(ctx, -60, -40, -40, 50, 40, 25, radY, radX, '#0849A8', '#0B5ED7', '#2563EB');
  drawBox(ctx, 0, 0, -40, 50, 40, 25, radY, radX, '#14A44D', '#16A34A', '#4ADE80');
  drawBox(ctx, 60, 0, -40, 50, 40, 25, radY, radX, '#DC2626', '#EF4444', '#F87171');

  // Gantry Crane Tower
  const tower = project3D(30, -100, 20, radY, radX);
  const base1 = project3D(0, 20, 20, radY, radX);
  const base2 = project3D(60, 20, 20, radY, radX);

  ctx.strokeStyle = '#D7A11E';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(base1.x, base1.y);
  ctx.lineTo(tower.x, tower.y);
  ctx.lineTo(base2.x, base2.y);
  ctx.stroke();

  // Ship Vessel Outline
  const shipBow = project3D(-140, 30, 40, radY, radX);
  const shipStern = project3D(140, 30, 40, radY, radX);
  ctx.strokeStyle = 'rgba(37, 99, 235, 0.7)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(shipBow.x, shipBow.y);
  ctx.lineTo(shipStern.x, shipStern.y);
  ctx.stroke();
}

function render3DCorridors(
  ctx: CanvasRenderingContext2D,
  radY: number,
  radX: number,
  nodes: Array<{ name: string; x: number; y: number; z: number; color: string; type: string }>,
  t: number
) {
  // Connect nodes with glowing corridor lines
  for (let i = 0; i < nodes.length - 1; i++) {
    const p1 = project3D(nodes[i].x, nodes[i].y, nodes[i].z, radY, radX);
    const p2 = project3D(nodes[i + 1].x, nodes[i + 1].y, nodes[i + 1].z, radY, radX);

    // Glowing beam
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Pulse animation moving along line
    const pulseT = (t * 0.8 + i * 0.3) % 1;
    const pulseX = p1.x + (p2.x - p1.x) * pulseT;
    const pulseY = p1.y + (p2.y - p1.y) * pulseT;

    ctx.fillStyle = '#D7A11E';
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw Nodes
  nodes.forEach((n) => {
    const p = project3D(n.x, n.y, n.z, radY, radX);

    // Node Outer Ring
    ctx.strokeStyle = n.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10 + Math.sin(t * 3) * 2, 0, Math.PI * 2);
    ctx.stroke();

    // Node Core
    ctx.fillStyle = n.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Node Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(n.name, p.x, p.y - 14);
  });
}

function drawBox(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  cz: number,
  w: number,
  h: number,
  d: number,
  radY: number,
  radX: number,
  colTop: string,
  colFront: string,
  colSide: string
) {
  const hw = w / 2;
  const hh = h / 2;
  const hd = d / 2;

  // 8 vertices of a 3D box
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

  // Draw Faces
  // Front face (v4, v5, v6, v7)
  ctx.fillStyle = colFront;
  ctx.beginPath();
  ctx.moveTo(v[4].x, v[4].y);
  ctx.lineTo(v[5].x, v[5].y);
  ctx.lineTo(v[6].x, v[6].y);
  ctx.lineTo(v[7].x, v[7].y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.stroke();

  // Top face (v0, v1, v5, v4)
  ctx.fillStyle = colTop;
  ctx.beginPath();
  ctx.moveTo(v[0].x, v[0].y);
  ctx.lineTo(v[1].x, v[1].y);
  ctx.lineTo(v[5].x, v[5].y);
  ctx.lineTo(v[4].x, v[4].y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.stroke();

  // Right Side face (v1, v2, v6, v5)
  ctx.fillStyle = colSide;
  ctx.beginPath();
  ctx.moveTo(v[1].x, v[1].y);
  ctx.lineTo(v[2].x, v[2].y);
  ctx.lineTo(v[6].x, v[6].y);
  ctx.lineTo(v[5].x, v[5].y);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.stroke();
}
