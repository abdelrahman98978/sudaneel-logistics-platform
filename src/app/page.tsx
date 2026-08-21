'use client';

import React from 'react';
import { ShieldCheck, Lock, Radio, Server } from 'lucide-react';

export default function ProductionLockedPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-gray-100 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full p-8 rounded-3xl bg-navy-900/90 border border-gold/30 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gold/15 text-gold border border-gold/40 flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-950 border border-gold/20 text-gold text-xs font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse text-gold" />
            <span>ENVIRONMENT: PRODUCTION (LOCKED)</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white">
            بيئة الإنتاج مغلقة حالياً
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            تم تحويل كافة العمليات والأنشطة اللوجستية حصرياً إلى <span className="text-gold font-bold">بيئة الاستيق والتطوير (Staging Environment)</span> بناءً على السياسة التشغيلية المعتمدة.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 text-xs text-gray-400 space-y-1.5 text-start">
          <div className="flex justify-between">
            <span>Platform Status:</span>
            <span className="text-amber-400 font-mono font-bold">Staging Active Only</span>
          </div>
          <div className="flex justify-between">
            <span>Production Deployment:</span>
            <span className="text-gray-500 font-mono">Zero Active Operations</span>
          </div>
        </div>

        <div className="text-[11px] text-gray-500 pt-2 border-t border-navy-800">
          Sudaneel Logistics Intelligence Platform • Enterprise Security Protocol
        </div>
      </div>
    </div>
  );
}
