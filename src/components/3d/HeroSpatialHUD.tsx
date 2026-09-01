'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Ship, Truck, ShieldCheck, Radio, Sparkles, Navigation, ArrowRight, ArrowLeft } from 'lucide-react';
import { useApp } from '@/lib/store';

export function HeroSpatialBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Subtle floating glowing nodes
    const nodes = Array.from({ length: 35 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.6 ? 'rgba(215, 161, 30, ' : 'rgba(37, 99, 235, ',
    }));

    let mouse = { x: w / 2, y: h / 2, active: false };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    window.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Connecting lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.strokeStyle = `rgba(37, 99, 235, ${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0) node.x = w;
        if (node.x > w) node.x = 0;
        if (node.y < 0) node.y = h;
        if (node.y > h) node.y = 0;

        // Subtle mouse repulsion / attraction
        if (mouse.active) {
          const mdx = mouse.x - node.x;
          const mdy = mouse.y - node.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 120) {
            node.x -= (mdx / mDist) * 0.8;
            node.y -= (mdy / mDist) * 0.8;
          }
        }

        ctx.fillStyle = node.color + '0.6)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 opacity-70 w-full h-full"
    />
  );
}

export function HeroFloatingBadges() {
  const { lang } = useApp();

  return (
    <>
      {/* Top Left Spatial Glass Badge: Fleet Telemetry */}
      <div className="hidden xl:flex absolute top-28 start-8 z-20 items-center gap-3.5 p-3.5 rounded-[16px] bg-[#032C70]/50 backdrop-blur-xl border border-white/15 text-white shadow-[0_12px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-top-4 duration-700 hover:scale-105 transition-transform">
        <div className="w-10 h-10 rounded-[12px] bg-[#2563EB]/30 border border-[#2563EB]/40 flex items-center justify-center text-[#93C5FD]">
          <Truck className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#14A44D] animate-ping" />
            <span className="text-[12px] font-mono text-[#D7A11E] font-[600]">
              CONVOY #104 | 24 TRUCKS
            </span>
          </div>
          <div className="text-[13px] font-[500] text-white">
            {lang === 'ar' ? 'قافلة الخرطوم - بورتسودان' : 'Khartoum - Port Sudan Express'}
          </div>
          <div className="text-[11px] text-[#93C5FD]/80 font-mono">
            SPEED: 78 KM/H • TEMP: 4°C (REEFER)
          </div>
        </div>
      </div>

      {/* Top Right Spatial Glass Badge: Maritime AIS */}
      <div className="hidden xl:flex absolute top-28 end-8 z-20 items-center gap-3.5 p-3.5 rounded-[16px] bg-[#032C70]/50 backdrop-blur-xl border border-white/15 text-white shadow-[0_12px_32px_rgba(0,0,0,0.4)] animate-in fade-in slide-in-from-top-4 duration-700 hover:scale-105 transition-transform">
        <div className="w-10 h-10 rounded-[12px] bg-[#D7A11E]/20 border border-[#D7A11E]/40 flex items-center justify-center text-[#D7A11E]">
          <Ship className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#06B6D4] animate-ping" />
            <span className="text-[12px] font-mono text-[#06B6D4] font-[600]">
              PORT SUDAN SCT QUAY #8
            </span>
          </div>
          <div className="text-[13px] font-[500] text-white">
            {lang === 'ar' ? 'تفريغ فوري: M/V SUDAN VOYAGER' : 'Berthing: M/V SUDAN VOYAGER'}
          </div>
          <div className="text-[11px] text-[#93C5FD]/80 font-mono">
            ETA: DOCKED • 2,140 TEU CLEARED
          </div>
        </div>
      </div>
    </>
  );
}
