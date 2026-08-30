'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { evaluateDispatchMatches, MatchEvaluation } from '@/lib/matching-engine';
import {
  Cpu,
  Truck,
  Package,
  Sparkles,
  MapPin,
  Leaf,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export function SmartDispatchView() {
  const {
    shipments,
    vehicles,
    drivers,
    carriers,
    assignVehicleToShipment,
    showToast,
    t,
    lang,
    setCurrentView,
  } = useApp();

  const unassignedShipments = shipments.filter(
    (s) => s.status === 'confirmed' || s.status === 'awaiting_carrier' || s.status === 'draft'
  );

  const [activeShipmentId, setActiveShipmentId] = useState<string>(
    unassignedShipments[0]?.id || shipments[0]?.id
  );
  const [selectedEvaluation, setSelectedEvaluation] = useState<MatchEvaluation | null>(null);
  const [isAutoDispatching, setIsAutoDispatching] = useState(false);

  const currentShipment = shipments.find((s) => s.id === activeShipmentId) || shipments[0];
  const availableFleet = vehicles.filter((v) => v.status === 'available' || v.status === 'returning_empty');

  const matches = currentShipment
    ? evaluateDispatchMatches(currentShipment, availableFleet, drivers, carriers)
    : [];

  const handleAutoDispatch = () => {
    setIsAutoDispatching(true);
    setTimeout(() => {
      if (matches.length > 0) {
        const top = matches[0];
        assignVehicleToShipment(
          currentShipment.id,
          top.vehicle.id,
          top.driver?.id || drivers[0].id
        );
      }
      setIsAutoDispatching(false);
      showToast(
        lang === 'ar' ? 'تم التوزيع الآلي الذكي' : 'AI Auto-Dispatch Complete',
        lang === 'ar'
          ? 'تم التوزيع الآلي بنجاح! تم تعيين أفضل شاحنة معتمدة بناءً على التكلفة ومطابقة العودة.'
          : 'Optimal asset assigned based on cost and backhaul fit.',
        'success'
      );
    }, 1000);
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Smart Dispatch Header */}
      <div className="p-8 shopify-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-[#ffffff]">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <Cpu className="w-4 h-4" />
            <span>AI Automated Matchmaking • محرك التوجيه الذكي</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            {t.smartDispatch}
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            محرك خوارزمي متقدم لمطابقة الشحنات مع أنسب أصول الأسطول، وتحسين رحلات العودة الفارغة (Backhaul) وخفض تكاليف الوقود.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAutoDispatch}
            disabled={isAutoDispatching || matches.length === 0}
            className="btn-shopify-pill disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#c1fbd4]" />
            <span>
              {isAutoDispatching
                ? (lang === 'ar' ? 'جاري التوزيع الخوارزمي...' : 'Optimizing Dispatch...')
                : (lang === 'ar' ? 'توزيع آلي فوري (AI Dispatch)' : 'Auto-Dispatch Optimal Asset')}
            </span>
          </button>

          <button
            onClick={() => setCurrentView('marketplace')}
            className="btn-shopify-outline"
          >
            <span>بورصة الشحن والعودة</span>
          </button>
        </div>
      </div>

      {/* Unassigned Shipments Carousel (Shopify Pill Tabs) */}
      <div className="shopify-card p-5 space-y-3">
        <div className="text-[12px] font-[600] text-[#71717a] uppercase tracking-wider">
          الشحنات الجاهزة للتكليف والتوجيه
        </div>
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
          {shipments.map((s) => {
            const isSelected = s.id === activeShipmentId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveShipmentId(s.id)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-full border text-[13px] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#000000] text-white border-[#000000] font-[500] shadow-sm'
                    : 'bg-[#ffffff] text-[#000000] border-[#e4e4e7] hover:bg-[#fbfbf5]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="font-mono">{s.trackingNumber}</span>
                <span className="text-[11px] opacity-75">
                  ({s.origin.city} ➔ {s.destination.city})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Shipment Summary Card (Shopify 12px rounded card) */}
      {currentShipment && (
        <div className="shopify-card p-6 bg-[#fbfbf5] border border-[#e4e4e7] grid grid-cols-1 sm:grid-cols-4 gap-4 text-[13px]">
          <div>
            <span className="text-[#71717a] text-[11px] block">رقم البوليصة</span>
            <span className="font-mono text-[#000000] font-[600] text-[15px]">{currentShipment.trackingNumber}</span>
          </div>
          <div>
            <span className="text-[#71717a] text-[11px] block">المسار والمسافة</span>
            <span className="font-[500] text-[#000000]">
              {currentShipment.origin.city} ➔ {currentShipment.destination.city} ({currentShipment.distanceKm} كم)
            </span>
          </div>
          <div>
            <span className="text-[#71717a] text-[11px] block">الحمولة والوزن</span>
            <span className="font-[500] text-[#000000]">
              {currentShipment.totalWeightKg.toLocaleString()} كجم • {currentShipment.cargoType}
            </span>
          </div>
          <div>
            <span className="text-[#71717a] text-[11px] block">حالة الشحنة</span>
            <span className="shopify-tag-mint !mt-1">
              {currentShipment.status}
            </span>
          </div>
        </div>
      )}

      {/* Match Engine Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-[600] text-[#000000]">
            المركبات المرشحة والمطابقات الخوارزمية ({matches.length})
          </h2>
          <span className="shopify-tag-shade !text-[11px]">
            خوارزمية Sudaneel Matrix 3.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((match, idx) => {
            const isTopMatch = idx === 0;
            return (
              <div
                key={match.vehicle.id}
                className={`p-6 rounded-[12px] transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isTopMatch
                    ? 'shopify-card-aloe shadow-[0_8px_20px_rgba(193,251,212,0.5)]'
                    : 'shopify-card hover:border-[#a1a1aa]'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Score Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#000000]" />
                      <span className="font-[600] text-[15px] font-mono text-[#000000]">
                        {match.vehicle.plateNumber}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-mono font-[700] ${
                        isTopMatch
                          ? 'bg-[#000000] text-[#c1fbd4]'
                          : 'bg-[#fbfbf5] text-[#000000] border border-[#e4e4e7]'
                      }`}
                    >
                      {match.matchScore}% تطابق
                    </span>
                  </div>

                  {/* Vehicle specs */}
                  <div className="text-[12.5px] space-y-1.5 pt-1 text-[#000000]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717a]">نوع المركبة:</span>
                      <span className="font-[500]">{match.vehicle.makeModel} ({match.vehicle.capacityTons} طن)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717a]">الموقع الحالي:</span>
                      <span className="font-[500]">{match.vehicle.currentCity} ({match.distanceToPickupKm} كم عن المنشأ)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717a]">السائق المقترح:</span>
                      <span className="font-[500]">{match.driver?.name || 'سائق معتمد'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717a]">التكلفة المقدرة:</span>
                      <span className="font-mono font-[600]">
                        {Math.round(currentShipment.price * (1 - match.expectedSavingsPercent / 100)).toLocaleString()} SDG
                      </span>
                    </div>
                  </div>

                  {/* Backhaul Match indicator */}
                  {match.isBackhaul && (
                    <div className="p-2.5 rounded-[8px] bg-white/70 border border-[#a8f5c2] flex items-center gap-2 text-[11.5px] font-[500] text-[#000000]">
                      <Leaf className="w-4 h-4 text-[#000000]" />
                      <span>مطابقة عودة فارغة (وفر 28% في الوقود)</span>
                    </div>
                  )}
                </div>

                {/* Dispatch Button */}
                <button
                  onClick={() => {
                    assignVehicleToShipment(
                      currentShipment.id,
                      match.vehicle.id,
                      match.driver?.id || drivers[0].id
                    );
                    showToast(
                      lang === 'ar' ? 'تم تكليف الشاحنة' : 'Asset Assigned',
                      lang === 'ar'
                        ? `تم تكليف الشاحنة ${match.vehicle.plateNumber} بالشحنة ${currentShipment.trackingNumber} بنجاح.`
                        : `Assigned ${match.vehicle.plateNumber} to ${currentShipment.trackingNumber}.`,
                      'success'
                    );
                  }}
                  className={`w-full py-2.5 rounded-full text-[13px] font-[600] transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    isTopMatch
                      ? 'bg-[#000000] text-white hover:bg-[#3f3f46]'
                      : 'btn-shopify-outline'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تكليف فوري وإصدار البوليصة</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
