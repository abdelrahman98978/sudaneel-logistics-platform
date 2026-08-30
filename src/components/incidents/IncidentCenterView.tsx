'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Incident } from '@/types';
import {
  ShieldAlert,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export function IncidentCenterView() {
  const { incidents, lang } = useApp();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'مركز إدارة الطوارئ والإنقاذ اللوجستي (Rescue Operations)' : 'Emergency & Logistics Rescue Response Center'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] mt-1">
            {lang === 'ar'
              ? 'مراقبة الأعطال، الحوادث، ونقاط التفتيش مع نظام توجيه أقرب مركبة إنقاذ وفريق صيانة متنقل.'
              : 'Continuous incident monitoring, breakdown mitigation, and automated nearby rescue vehicle dispatch.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-[4px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] text-[12px] font-mono font-[500]">
            {incidents.length} Active Tickets
          </span>
        </div>
      </div>

      {/* Incident Tickets and Rescue Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Tickets List (5 cols) */}
        <div className="lg:col-span-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
            <AlertTriangle className="w-4 h-4 text-[#3E6AE1]" />
            <span>Active Incident Tickets</span>
          </h3>

          <div className="space-y-2">
            {incidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`w-full p-4 rounded-[4px] text-start transition-colors duration-330 cursor-pointer border ${
                  inc.id === selectedIncident?.id
                    ? 'bg-[#F4F4F4] border-[#171A20]'
                    : 'bg-[#FFFFFF] border-[#EEEEEE] hover:bg-[#F4F4F4]'
                }`}
              >
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="font-mono font-[500] text-[#3E6AE1]">{inc.incidentNumber}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-[2px] bg-white text-[#171A20] border border-[#D0D1D2] uppercase font-mono font-[500]">
                    {inc.severity}
                  </span>
                </div>
                <div className="font-[500] text-[#171A20] text-[13px]">
                  {lang === 'ar' ? inc.titleAr : inc.titleEn}
                </div>
                <div className="text-[11px] text-[#5C5E62] mt-1 flex items-center justify-between">
                  <span>{inc.location}</span>
                  <span className="font-mono text-[#8E8E8E]">{inc.createdAt}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Rescue Workflow Resolution Board (7 cols) */}
        {selectedIncident && (
          <div className="lg:col-span-7 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#EEEEEE]">
              <div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] uppercase font-[500]">
                  {selectedIncident.type}
                </span>
                <h3 className="text-[16px] font-[500] text-[#171A20] mt-1.5">
                  {lang === 'ar' ? selectedIncident.titleAr : selectedIncident.titleEn}
                </h3>
                <div className="text-[13px] text-[#5C5E62]">{selectedIncident.location}</div>
              </div>

              <div className="text-end">
                <span className="text-[12px] font-mono font-[500] text-[#171A20] bg-[#F4F4F4] px-2.5 py-1 rounded-[2px] border border-[#EEEEEE]">
                  {selectedIncident.status}
                </span>
              </div>
            </div>

            {/* Description Box */}
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-[13px] text-[#171A20]">
              <span className="text-[#5C5E62] font-[500] block mb-1">Details / التفاصيل:</span>
              {selectedIncident.description}
            </div>

            {/* Rescue Pipeline */}
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-3">
              <div className="text-[12px] font-[500] text-[#171A20] uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#3E6AE1]" />
                <span>Automated Rescue Pipeline (مسار الإنقاذ الآلي)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[12px] text-center">
                <div className="p-2.5 rounded-[2px] bg-[#FFFFFF] border border-[#EEEEEE] text-[#171A20]">
                  <div className="font-[500]">1. Geo Located</div>
                  <div className="text-[10px] text-[#8E8E8E]">16.70°N, 33.42°E</div>
                </div>

                <div className="p-2.5 rounded-[2px] bg-[#FFFFFF] border border-[#EEEEEE] text-[#171A20]">
                  <div className="font-[500]">2. Service Hub</div>
                  <div className="text-[10px] text-[#8E8E8E]">Atbara (18 km)</div>
                </div>

                <div className="p-2.5 rounded-[2px] bg-[#FFFFFF] border border-[#EEEEEE] text-[#171A20]">
                  <div className="font-[500]">3. Rescue ETA</div>
                  <div className="text-[10px] text-[#3E6AE1]">25 mins est.</div>
                </div>

                <div className="p-2.5 rounded-[2px] bg-[#FFFFFF] border border-[#EEEEEE] text-[#171A20]">
                  <div className="font-[500]">4. Transfer</div>
                  <div className="text-[10px] text-[#8E8E8E]">Safe protocol</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                onClick={() => alert(lang === 'ar' ? 'تم توجيه أمر الإنقاذ إلى الشاحنة الاحتياطية' : 'Rescue dispatch signal confirmed')}
                className="btn-tesla-primary w-full !min-h-[38px] text-[13px]"
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
