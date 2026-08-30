'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  Building2,
  Truck,
  CheckCircle2,
  DollarSign,
  Users,
  Award,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export function CarrierPortalView() {
  const { carriers, vehicles, drivers, setCurrentView } = useApp();
  const currentCarrier = carriers[0];

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir="rtl">
      {/* Carrier Top Profile Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#000000] flex items-center justify-center text-[#c1fbd4]">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[24px] font-[600] text-[#000000]">{currentCarrier.name}</h1>
              <span className="shopify-tag-mint !text-[11px] font-mono">
                {currentCarrier.ratingCategory} Certified
              </span>
            </div>
            <p className="text-[13.5px] text-[#71717a]">
              {currentCarrier.city} • هاتف: {currentCarrier.phone} • بريد: {currentCarrier.email}
            </p>
          </div>
        </div>

        {/* Trust Score */}
        <div className="flex items-center gap-3 bg-[#c1fbd4] p-4 rounded-[12px] border border-[#a8f5c2] shadow-sm">
          <Award className="w-7 h-7 text-[#000000]" />
          <div>
            <div className="text-[11px] text-[#000000]/70 uppercase font-[600]">مؤشر الموثوقية السيادي</div>
            <div className="text-[22px] font-[800] font-mono text-[#000000]">{currentCarrier.trustScore} / 100</div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>حجم الأسطول</span>
            <Truck className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{currentCarrier.fleetCount} شاحنات</div>
          <div className="text-[12px] text-[#000000] font-[500]">{currentCarrier.activeTrips} في رحلات نشطة</div>
        </div>

        <div className="shopify-card-aloe p-6 space-y-2 shadow-[0_8px_20px_rgba(193,251,212,0.4)]">
          <div className="text-[12px] text-[#000000] font-[600] flex items-center justify-between">
            <span>الرحلات المكتملة</span>
            <CheckCircle2 className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{currentCarrier.totalTrips}</div>
          <div className="text-[12px] text-[#000000]/80 font-[500]">نسبة نجاح التسليم 99.2%</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>رصيد المحفظة المتاح</span>
            <DollarSign className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">8.4M SDG</div>
          <div className="text-[12px] text-[#71717a]">تسوية فورية عبر EBS</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>السائقون المعتمدون</span>
            <Users className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{drivers.length}</div>
          <div className="text-[12px] text-[#71717a]">رخص مهنية سارية</div>
        </div>
      </div>

      {/* Carrier Vehicles & Driver Assignment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[16px] text-[#000000]">الشاحنات المسجلة في أسطول الناقل</h3>
            <span className="shopify-tag-mint">{vehicles.length} شاحنات</span>
          </div>

          <div className="space-y-3">
            {vehicles.slice(0, 4).map((v) => (
              <div key={v.id} className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between">
                <div>
                  <div className="font-mono font-[700] text-[#000000] text-[14px]">{v.plateNumber}</div>
                  <div className="text-[12px] text-[#71717a]">{v.makeModel} • {v.capacityTons} طن</div>
                </div>
                <span className={v.status === 'available' ? 'shopify-tag-mint' : 'shopify-tag-shade'}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[16px] text-[#000000]">السائقون وفرق القيادة المعتمدة</h3>
            <span className="shopify-tag-pistachio">{drivers.length} سائقين</span>
          </div>

          <div className="space-y-3">
            {drivers.map((d) => (
              <div key={d.id} className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between">
                <div>
                  <div className="font-[600] text-[#000000] text-[14px]">{d.name}</div>
                  <div className="text-[12px] text-[#71717a] font-mono">{d.phone} • {d.licenseNumber}</div>
                </div>
                <div className="text-end">
                  <div className="font-mono font-[700] text-[#000000] text-[13px]">★ {d.rating}</div>
                  <div className="text-[11px] text-[#71717a]">{d.totalTrips} رحلة</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
