'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { BorderCrossing } from '@/types';
import {
  Globe2,
  MapPin,
  Clock,
  Truck,
  FileCheck2,
  ShieldCheck,
  Phone,
  AlertTriangle,
  Zap,
  Sparkles,
} from 'lucide-react';

export function CrossBorderView() {
  const { borderCrossings, showToast, lang } = useApp();
  const [selectedStation, setSelectedStation] = useState<BorderCrossing | null>(borderCrossings[0] || null);

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="shopify-tag-mint">
            <Globe2 className="w-4 h-4" />
            <span>Cross-Border Corridors • الممرات الإقليمية والشحن الدولي</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            الممرات الإقليمية والشحن عبر الحدود
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            إدارة الشحن البري الدولي مع مصر (أرقين وأشكيت) وإثيوبيا (القلابات) وتشاد، ومراقبة قوافل الترانزيت ووثائق الكومسيا.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="shopify-tag-mint font-mono font-[600]">
            COMESA & TIR Integrated
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>المنافذ الحدودية النشطة</span>
            <MapPin className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">3 Crossings</div>
          <div className="text-[11.5px] text-[#71717a]">Egypt, Ethiopia, Regional</div>
        </div>

        <div className="shopify-card-aloe p-6 space-y-2 shadow-[0_8px_20px_rgba(193,251,212,0.4)]">
          <div className="text-[12px] text-[#000000] font-[600] flex items-center justify-between">
            <span>شاحنات في طابور العبور</span>
            <Truck className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">48 Trucks</div>
          <div className="text-[11.5px] text-[#000000]/80 font-[500]">تخليص جمركي مسبق</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>متوسط زمن العبور</span>
            <Clock className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">4.2 Hours</div>
          <div className="text-[11.5px] text-[#71717a]">تحت مظلة المانيفست الموحد</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>وثائق الكومسيا الصادرة</span>
            <FileCheck2 className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">124 Permits</div>
          <div className="text-[11.5px] text-[#71717a]">اعتماد رقمي فوري</div>
        </div>
      </div>

      {/* Cross-border Posts and Corridor Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Border Posts List (5 cols) */}
        <div className="lg:col-span-5 shopify-card p-6 space-y-4 bg-[#ffffff]">
          <h3 className="font-[600] text-[16px] text-[#000000] pb-3 border-b border-[#e4e4e7]">
            المنافذ البرية المعتمدة (Border Crossings)
          </h3>

          <div className="space-y-3">
            {borderCrossings.map((station) => {
              const isSelected = station.id === selectedStation?.id;
              return (
                <div
                  key={station.id}
                  onClick={() => setSelectedStation(station)}
                  className={`p-4 rounded-[12px] text-start transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#ffffff] border-[#000000] ring-2 ring-[#c1fbd4] shadow-sm'
                      : 'bg-[#fbfbf5] border-[#e4e4e7] hover:border-[#a1a1aa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-[600] text-[14px] text-[#000000]">{station.nameAr || station.name}</span>
                    <span className={station.operatingStatus === 'normal' ? 'shopify-tag-mint !text-[10px]' : 'shopify-tag-shade !text-[10px]'}>
                      {station.operatingStatus}
                    </span>
                  </div>

                  <div className="text-[12px] text-[#71717a] mt-1">الدولة المجاورة: {station.countryTo}</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#e4e4e7] text-[12px]">
                    <span className="text-[#71717a]">متوسط زمن التخليص:</span>
                    <span className="font-mono font-[700] text-[#000000]">{station.averageClearanceHours} ساعات</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Station Operational Dossier (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedStation ? (
            <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
              <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
                <div>
                  <span className="shopify-tag-mint !text-[11px]">International Border Dossier</span>
                  <h3 className="font-[600] text-[18px] text-[#000000] mt-1">{selectedStation.nameAr || selectedStation.name}</h3>
                </div>
                <span className="shopify-tag-pistachio">{selectedStation.countryTo} Corridor</span>
              </div>

              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#71717a]">حالة المنفذ وحركة الشاحنات:</span>
                  <span className="font-[600] text-[#000000]">{selectedStation.operatingStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">عدد الشاحنات في الساحة:</span>
                  <span className="font-mono font-[700] text-[#000000]">{selectedStation.currentQueueTrucks} شاحنة</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">زمن الفحص بالأشعة السينية:</span>
                  <span className="font-mono font-[600] text-[#000000]">12 دقيقة / شاحنة</span>
                </div>
              </div>

              <div className="p-6 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] space-y-2">
                <div className="flex items-center gap-2 font-[700] text-[14px] text-[#000000]">
                  <ShieldCheck className="w-4 h-4 text-[#000000]" />
                  <span>بروتوكول القوافل المؤمنة والـ TIR الموحد</span>
                </div>
                <p className="text-[13px] text-[#000000]/80 leading-relaxed">
                  تضمن المنصة إصدار تصاريح المرور والـ Carnet TIR إلكترونياً مع تتبع الأختام الجمركية الذكية (Smart Seals) حتى وصول الشحنة لمقصدها النهائي.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => showToast('تم حجز موعد العبور', `تم إدراج الشاحنة في قافلة العبور القادمة عبر معبر ${selectedStation.nameAr || selectedStation.name}`, 'success')}
                  className="flex-1 btn-shopify-pill !py-3 text-[13.5px]"
                >
                  <Zap className="w-4 h-4 text-[#c1fbd4]" />
                  <span>حجز موعد عبور مسبق في القافلة الدولية</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="shopify-card p-8 text-center text-[#71717a]">
              اختر منفذاً لعرض التفاصيل
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
