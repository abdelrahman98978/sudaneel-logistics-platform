'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Truck,
  PlusCircle,
  Wrench,
  Fuel,
  MapPin,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export function FleetView() {
  const { vehicles, showToast, t, lang } = useApp();
  const [filterType] = useState('all');

  const filteredVehicles = vehicles.filter(
    (v) => filterType === 'all' || v.type === filterType
  );

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 shopify-card bg-[#ffffff]">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <Truck className="w-4 h-4" />
            <span>Telemetry & Maintenance • عمليات وإدارة الأسطول</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            {t.fleetManagement} ({vehicles.length})
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            {lang === 'ar'
              ? 'مراقبة الشاحنات الحية، جدول الصيانة الوقائية، وتتبع كفاءة استهلاك الوقود والانبعاثات.'
              : 'Live fleet telemetry, preventive maintenance scheduler, and fuel consumption analytics.'}
          </p>
        </div>

        <button
          onClick={() => showToast(
            lang === 'ar' ? 'إضافة مركبة جديدة للأسطول' : 'Add Vehicle',
            lang === 'ar' ? 'تم فتح نموذج تسجيل بيانات الشاحنة وتفعيل جهاز التتبع السيادي GPS' : 'Vehicle registration form initiated with GPS pairing',
            'info'
          )}
          className="btn-shopify-pill"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة شاحنة جديدة' : 'Add Vehicle'}</span>
        </button>
      </div>

      {/* Official Fleet Showcase Banner (Shopify 20px Card) */}
      <div className="shopify-card overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 bg-[#ffffff]">
        <div className="md:col-span-5 relative min-h-[220px] bg-[#000000] p-6 flex items-center justify-center">
          <img
            src="/images/fleet-vehicles.jpg"
            alt="Sudaneel Official Fleet"
            className="w-full h-auto max-h-[200px] object-contain drop-shadow-md"
          />
          <div className="absolute top-4 start-4">
            <span className="shopify-tag-mint !text-[10px]">
              Euro 5/6 Heavy & Express Fleet
            </span>
          </div>
        </div>

        <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="shopify-tag-pistachio !text-[11px]">
              National & Cross-Border Fleet • أسطول النقل الوطني والإقليمي
            </div>
            <h3 className="text-[20px] font-[600] text-[#000000] tracking-tight">
              شاحنات ثقيلة مبردة وجافة وفانات توصيل سريع موحدة الهوية
            </h3>
            <p className="text-[14px] text-[#71717a] leading-relaxed">
              أسطول حديث مجهز بأجهزة تتبع دقيقة عبر الأقمار الصناعية (GPS/IoT)، وحساسات لدرجة الحرارة والرطوبة لضمان سلامة سلسلة التبريد والأدوية والمواد الغذائية.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#e4e4e7] text-center">
            <div className="p-2.5 rounded-[8px] bg-[#fbfbf5]">
              <div className="font-mono text-[16px] font-[700] text-[#000000]">99.1%</div>
              <div className="text-[11px] text-[#71717a]">جاهزية الأسطول</div>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#fbfbf5]">
              <div className="font-mono text-[16px] font-[700] text-[#000000]">32.4 L</div>
              <div className="text-[11px] text-[#71717a]">معدل استهلاك/100كم</div>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#c1fbd4]">
              <div className="font-mono text-[16px] font-[700] text-[#000000]">0%</div>
              <div className="text-[11px] text-[#000000] font-[500]">حوادث حرجة (YTD)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((v) => (
          <div key={v.id} className="shopify-card p-6 space-y-4 hover:border-[#a1a1aa] transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center text-[#000000]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-[600] text-[15px] font-mono text-[#000000]">{v.plateNumber}</div>
                  <div className="text-[11px] text-[#71717a]">{v.makeModel} ({v.capacityTons} طن)</div>
                </div>
              </div>
              <span className={v.status === 'available' ? 'shopify-tag-mint' : 'shopify-tag-shade'}>
                {v.status}
              </span>
            </div>

            <div className="space-y-2 text-[13px] text-[#000000]">
              <div className="flex items-center justify-between">
                <span className="text-[#71717a]">الموقع الحالي:</span>
                <span className="font-[500]">{v.currentCity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717a]">مستوى الوقود:</span>
                <span className="font-mono font-[600]">{v.fuelLevelPercent}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#71717a]">عداد الكيلومترات:</span>
                <span className="font-mono font-[600]">{v.mileageKm.toLocaleString()} كم</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast('فحص المركبة', `تم سحب التقرير الفني المباشر للمركبة ${v.plateNumber}`, 'info')}
                className="w-full btn-shopify-outline !py-2 text-[12.5px]"
              >
                <span>فحص التيليماتري والتشخيص</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
