'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Incident } from '@/types';
import {
  ShieldAlert,
  AlertTriangle,
  Wrench,
  Navigation,
  Truck,
  Phone,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
} from 'lucide-react';

export function IncidentCenterView() {
  const { incidents, t, lang } = useApp();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950 via-navy-950 to-navy-900 border border-rose-500/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'مركز إدارة الطوارئ والإنقاذ اللوجستي (Rescue Operations)' : 'Emergency & Logistics Rescue Response Center'}
            </h2>
          </div>
          <p className="text-xs text-gray-300">
            {lang === 'ar'
              ? 'مراقبة الأعطال، الحوادث، ونقاط التفتيش مع نظام توجيه أقرب مركبة إنقاذ وفريق صيانة متنقل.'
              : 'Continuous incident monitoring, breakdown mitigation, and automated nearby rescue vehicle dispatch.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold">
            {incidents.length} Active Tickets
          </span>
        </div>
      </div>

      {/* Incident Tickets and Rescue Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Incident Tickets List (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-navy-900/90 border border-gold/20 p-4 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Active Incident Tickets</span>
          </h3>

          <div className="space-y-2">
            {incidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`w-full p-3.5 rounded-xl text-start transition-all cursor-pointer ${
                  inc.id === selectedIncident?.id
                    ? 'bg-rose-950/40 border border-rose-500/60 shadow-lg'
                    : 'bg-navy-950/70 border border-navy-800 hover:bg-navy-800 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-rose-400">{inc.incidentNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-200 uppercase font-mono font-bold">
                    {inc.severity}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">
                  {lang === 'ar' ? inc.titleAr : inc.titleEn}
                </div>
                <div className="text-[11px] text-gray-400 mt-1 flex items-center justify-between">
                  <span>{inc.location}</span>
                  <span className="font-mono text-gray-500">{inc.createdAt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Rescue Workflow Resolution Board (7 cols) */}
        {selectedIncident && (
          <div className="lg:col-span-7 rounded-2xl bg-navy-900/90 border border-gold/25 p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gold/15">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase font-bold">
                  {selectedIncident.type}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">
                  {lang === 'ar' ? selectedIncident.titleAr : selectedIncident.titleEn}
                </h3>
                <div className="text-xs text-gray-400">{selectedIncident.location}</div>
              </div>

              <div className="text-end">
                <span className="text-xs font-mono font-bold text-gold bg-navy-950 px-2.5 py-1 rounded-lg border border-gold/20">
                  {selectedIncident.status}
                </span>
              </div>
            </div>

            {/* Description Box */}
            <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 text-xs text-gray-300">
              <span className="text-gray-400 font-bold block mb-1">Details / التفاصيل:</span>
              {selectedIncident.description}
            </div>

            {/* Rescue Pipeline Diagram */}
            <div className="p-4 rounded-xl bg-navy-950/90 border border-gold/20 space-y-3">
              <div className="text-xs font-bold text-gold uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-gold" />
                <span>Automated Rescue Pipeline (مسار الإنقاذ الآلي)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-center">
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                  <div className="font-bold">1. Geo Located</div>
                  <div className="text-[10px] text-gray-400">16.70°N, 33.42°E</div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                  <div className="font-bold">2. Nearest Service</div>
                  <div className="text-[10px] text-gray-400">Atbara Station (18 km)</div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300">
                  <div className="font-bold">3. Rescue ETA</div>
                  <div className="text-[10px] text-gray-400">25 mins estimated</div>
                </div>

                <div className="p-2.5 rounded-lg bg-navy-900 border border-navy-800 text-gray-400">
                  <div className="font-bold">4. Cargo Transfer</div>
                  <div className="text-[10px]">Zero damage protocol</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => alert(lang === 'ar' ? 'تم توجيه أمر الإنقاذ إلى الشاحنة الاحتياطية' : 'Rescue dispatch signal confirmed')}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer text-center"
              >
                {lang === 'ar' ? 'تأكيد توجيه فريق الإنقاذ والصيانة' : 'Confirm Rescue Dispatch'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
