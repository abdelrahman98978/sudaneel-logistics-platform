'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Incident } from '@/types';
import {
  ShieldAlert,
  AlertTriangle,
  Zap,
  Truck,
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';

export function IncidentCenterView() {
  const { incidents, showToast, lang } = useApp();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="shopify-tag-mint">
            <ShieldAlert className="w-4 h-4" />
            <span>Rescue & Emergency Response • مركز إدارة الطوارئ والإنقاذ</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            مركز إدارة الطوارئ والإنقاذ اللوجستي
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            مراقبة الأعطال، الحوادث، ونقاط التفتيش مع نظام توجيه أقرب مركبة إنقاذ وفريق صيانة متنقل على كافة الطرق القومية.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="shopify-tag-shade font-mono font-[600]">
            {incidents.length} Active Tickets
          </span>
        </div>
      </div>

      {/* Incident Tickets and Rescue Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Tickets List (5 cols) */}
        <div className="lg:col-span-5 shopify-card p-6 space-y-4 bg-[#ffffff]">
          <h3 className="font-[600] text-[16px] text-[#000000] flex items-center gap-2 pb-3 border-b border-[#e4e4e7]">
            <AlertTriangle className="w-4 h-4 text-[#000000]" />
            <span>بلاغات الطوارئ النشطة (Active Incidents)</span>
          </h3>

          <div className="space-y-3">
            {incidents.map((inc) => {
              const isSelected = inc.id === selectedIncident?.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-[12px] text-start transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#ffffff] border-[#000000] ring-2 ring-[#c1fbd4] shadow-sm'
                      : 'bg-[#fbfbf5] border-[#e4e4e7] hover:border-[#a1a1aa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-[700] text-[14px] text-[#000000]">{inc.id}</span>
                    <span className={inc.severity === 'critical' ? 'shopify-tag-shade !text-[10px]' : 'shopify-tag-pistachio !text-[10px]'}>
                      {inc.severity}
                    </span>
                  </div>

                  <div className="font-[600] text-[13.5px] text-[#000000] mt-2">{inc.titleAr || inc.type}</div>
                  <div className="text-[12px] text-[#71717a] mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#71717a]" />
                    <span>{inc.location}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Incident Action & Telemetry Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedIncident ? (
            <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
              <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
                <div>
                  <span className="shopify-tag-mint !text-[11px]">Incident Telemetry Lock</span>
                  <h3 className="font-[600] text-[18px] text-[#000000] mt-1">{selectedIncident.titleAr || selectedIncident.type}</h3>
                </div>
                <span className="font-mono text-[12px] text-[#71717a]">{selectedIncident.createdAt}</span>
              </div>

              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#71717a]">رقم الشحنة / المركبة:</span>
                  <span className="font-mono font-[700] text-[#000000]">{selectedIncident.shipmentId || selectedIncident.vehiclePlate || 'VEH-SDN-489'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">الموقع الدقيق:</span>
                  <span className="font-[600] text-[#000000]">{selectedIncident.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">وصف البلاغ:</span>
                  <span className="font-[500] text-[#000000]">{selectedIncident.description}</span>
                </div>
              </div>

              {/* Recommended Rescue Protocol */}
              <div className="p-6 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] space-y-2">
                <div className="flex items-center gap-2 font-[700] text-[14px] text-[#000000]">
                  <Wrench className="w-4 h-4 text-[#000000]" />
                  <span>بروتوكول التدخل السريع الموصى به (AI Rescue Action)</span>
                </div>
                <p className="text-[13px] text-[#000000]/80 leading-relaxed">
                  تم تحديد شاحنة صيانة متنقلة وفريق دعم فني على بُعد 14 كم من موقع الحادث. وقت الوصول التقديري: 18 دقيقة.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => showToast('تم إطلاق فريق الإنقاذ', `تم توجيه وحدة التدخل السريع إلى ${selectedIncident.location}`, 'success')}
                  className="flex-1 btn-shopify-pill !py-3 text-[13.5px] flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-[#c1fbd4]" />
                  <span>توجيه وحدة الإنقاذ الميداني فوراً</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="shopify-card p-8 text-center text-[#71717a]">
              اختر بلاغاً لعرض التفاصيل
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
