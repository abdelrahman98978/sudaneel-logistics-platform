'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Truck,
  PlusCircle,
} from 'lucide-react';

export function FleetView() {
  const { vehicles, showToast, t, lang } = useApp();
  const [filterType] = useState('all');

  const filteredVehicles = vehicles.filter(
    (v) => filterType === 'all' || v.type === filterType
  );

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
        <div>
          <h2 className="font-[500] text-[17px] text-[#171A20] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#3E6AE1]" />
            <span>{t.fleetManagement} ({vehicles.length})</span>
          </h2>
          <p className="text-[13px] font-[400] text-[#5C5E62]">
            {lang === 'ar'
              ? 'مراقبة الشاحنات الحية، جدول الصيانة الوقائية، وتتبع كفاءة استهلاك الوقود.'
              : 'Live fleet telemetry, preventive maintenance scheduler, and fuel consumption analytics.'}
          </p>
        </div>

        <button
          onClick={() => showToast(
            lang === 'ar' ? 'إضافة مركبة جديدة للأسطول' : 'Add Vehicle',
            lang === 'ar' ? 'تم فتح نموذج تسجيل بيانات الشاحنة وتفعيل جهاز التتبع السيادي GPS' : 'Vehicle registration form initiated with GPS pairing',
            'info'
          )}
          className="btn-tesla-primary !min-w-[140px] !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة شاحنة' : 'Add Vehicle'}</span>
        </button>
      </div>

      {/* Official Fleet Showcase Banner */}
      <div className="rounded-[4px] border border-[#EEEEEE] bg-[#FFFFFF] overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
        <div className="md:col-span-5 relative min-h-[220px] bg-[#171A20] p-4 flex items-center justify-center">
          <img
            src="/images/fleet-vehicles.jpg"
            alt="Sudaneel Official Fleet"
            className="w-full h-auto max-h-[200px] object-contain drop-shadow-md"
          />
          <div className="absolute top-3 start-3">
            <span className="px-2.5 py-1 rounded-[2px] bg-[#171A20]/80 backdrop-blur-md text-white text-[11px] font-mono border border-white/20">
              Euro 5/6 Heavy & Express Fleet
            </span>
          </div>
        </div>

        <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 text-[#3E6AE1] text-[12px] font-[500] uppercase font-mono mb-1">
              <span>National & Cross-Border Fleet • أسطول النقل الوطني والإقليمي</span>
            </div>
            <h3 className="text-[17px] font-[500] text-[#171A20]">
              شاحنات ثقيلة مبردة وجافة وفانات توصيل سريع موحدة الهوية
            </h3>
            <p className="text-[13px] text-[#5C5E62] leading-relaxed">
              أسطول حديث ومزود بأجهزة تتبع لحظية للأقمار الصناعية (GPS/IoT)، حساسات حرارة للحمولات المبردة، وأختام إلكترونية مؤمنة تضمن سلامة وسرعة وصول الشحنات.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#EEEEEE] text-[12px]">
            <div className="p-2.5 rounded-[2px] bg-[#F4F4F4]">
              <span className="text-[#8E8E8E] block text-[11px]">حجم الحمولة</span>
              <span className="font-[500] font-mono text-[#171A20]">35 - 50 Ton</span>
            </div>
            <div className="p-2.5 rounded-[2px] bg-[#F4F4F4]">
              <span className="text-[#8E8E8E] block text-[11px]">تتبع GPS حي</span>
              <span className="font-[500] text-[#3E6AE1]">4s Refresh</span>
            </div>
            <div className="p-2.5 rounded-[2px] bg-[#F4F4F4]">
              <span className="text-[#8E8E8E] block text-[11px]">جاهزية الرحلات</span>
              <span className="font-[500] font-mono text-[#171A20]">98.6% Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-[500] font-mono text-[#171A20] text-[16px]">{v.plateNumber}</div>
                <div className="text-[13px] text-[#5C5E62]">{v.makeModel} ({v.year})</div>
                <div className="text-[12px] text-[#3E6AE1] font-[500]">{v.carrierName}</div>
              </div>

              <span
                className={`text-[11px] px-2 py-0.5 rounded-[2px] font-mono font-[500] border ${
                  v.isReturningEmpty
                    ? 'bg-[#F4F4F4] text-[#3E6AE1] border-[#3E6AE1]'
                    : v.status === 'in_transit'
                    ? 'bg-[#F4F4F4] text-[#171A20] border-[#D0D1D2]'
                    : 'bg-[#F4F4F4] text-[#5C5E62] border-[#EEEEEE]'
                }`}
              >
                {v.isReturningEmpty ? 'Empty Backhaul' : v.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 text-[12px] text-center">
              <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                <span className="text-[10px] text-[#8E8E8E] block">Payload</span>
                <span className="font-[500] text-[#171A20] font-mono">{v.capacityTons}T</span>
              </div>
              <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                <span className="text-[10px] text-[#8E8E8E] block">Fuel</span>
                <span className="font-[500] text-[#171A20] font-mono">{v.fuelLevelPercent}%</span>
              </div>
              <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                <span className="text-[10px] text-[#8E8E8E] block">Speed</span>
                <span className="font-[500] text-[#3E6AE1] font-mono">{v.speedKmh} km/h</span>
              </div>
            </div>

            {/* Driver & Maintenance Alert */}
            <div className="text-[12px] text-[#5C5E62] space-y-1 bg-[#F4F4F4] p-3 rounded-[4px] border border-[#EEEEEE]">
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">Driver:</span>
                <span className="font-[500] text-[#171A20]">{v.driverName || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">Current City:</span>
                <span className="font-[500] text-[#171A20]">{v.currentCity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
