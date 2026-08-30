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
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Smart Dispatch Header */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="font-[500] text-[17px] text-[#171A20]">
              {lang === 'ar' ? 'مركز التوزيع الذكي وخوارزميات المطابقة (AI Dispatch)' : 'AI Smart Dispatch & Fleet Allocation Center'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] mt-1">
            {lang === 'ar'
              ? 'تخصيص الشاحنات والسائقين بناءً على المسافة، السعة، مؤشر الثقة (Trust Score)، والرحلات العائدة.'
              : 'Allocate fleet assets dynamically based on proximity, payload, trust score, and backhaul optimization.'}
          </p>
        </div>

        <button
          onClick={handleAutoDispatch}
          disabled={isAutoDispatching || matches.length === 0}
          className="btn-tesla-primary !min-w-[160px] !min-h-[38px] !py-1 !px-4 text-[13px] flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAutoDispatching ? 'Optimizing Fleet...' : t.autoDispatchBtn}</span>
        </button>
      </div>

      {/* 3-Panel Dispatch Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1: Unassigned Shipments Queue (3.5 cols) */}
        <div className="lg:col-span-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#3E6AE1]" />
              <span>قائمة انتظار التوزيع ({unassignedShipments.length})</span>
            </h3>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto custom-scrollbar">
            {unassignedShipments.map((shp) => {
              const isSelected = shp.id === activeShipmentId;
              return (
                <button
                  key={shp.id}
                  onClick={() => {
                    setActiveShipmentId(shp.id);
                    setSelectedEvaluation(null);
                  }}
                  className={`w-full p-3.5 rounded-[4px] text-start transition-colors duration-330 border cursor-pointer ${
                    isSelected
                      ? 'bg-[#F4F4F4] border-[#171A20]'
                      : 'bg-[#FFFFFF] border-[#EEEEEE] hover:bg-[#F4F4F4]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-[500] text-[#171A20] text-[13px]">{shp.trackingNumber}</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-[2px] bg-white border border-[#D0D1D2]">
                      {(shp.totalWeightKg / 1000).toFixed(1)} T
                    </span>
                  </div>
                  <div className="text-[13px] font-[500] text-[#171A20] mt-1">{shp.customerNameAr || shp.customerName}</div>
                  <div className="text-[12px] text-[#5C5E62] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#3E6AE1]" />
                    <span>{shp.origin.city} ➔ {shp.destination.city}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Ranked AI Matches (5 cols) */}
        <div className="lg:col-span-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
            <div>
              <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#3E6AE1]" />
                <span>المركبات المطابقة آلياً</span>
              </h3>
              <span className="text-[12px] text-[#5C5E62]">{currentShipment?.trackingNumber}</span>
            </div>
            <span className="text-[12px] font-mono font-[500] text-[#3E6AE1]">{matches.length} Candidates</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
            {matches.map((match, idx) => {
              const isSelected = selectedEvaluation?.vehicle.id === match.vehicle.id;
              return (
                <div
                  key={match.vehicle.id}
                  onClick={() => setSelectedEvaluation(match)}
                  className={`p-4 rounded-[4px] border transition-colors duration-330 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F4F4F4] border-[#3E6AE1]'
                      : 'bg-[#FFFFFF] border-[#EEEEEE] hover:bg-[#F4F4F4]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-[500] font-mono text-[14px] text-[#171A20]">{match.vehicle.plateNumber}</span>
                        {idx === 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-[2px] bg-[#171A20] text-white font-[500]">
                            BEST FIT
                          </span>
                        )}
                      </div>
                      <div className="text-[13px] text-[#5C5E62] mt-0.5">{match.carrier?.name} • {match.driver?.name}</div>
                    </div>

                    <div className="text-end">
                      <span className="text-[18px] font-[500] font-mono text-[#3E6AE1]">
                        {match.matchScore}%
                      </span>
                      <span className="text-[10px] text-[#8E8E8E] block">AI Match Score</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-[#5C5E62] mt-2 pt-2 border-t border-[#EEEEEE]">
                    <div>
                      <span className="block text-[10px] text-[#8E8E8E]">Location</span>
                      <span className="font-[500] text-[#171A20]">{match.vehicle.currentCity}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#8E8E8E]">Capacity</span>
                      <span className="font-mono font-[500] text-[#171A20]">{match.vehicle.capacityTons} T</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#8E8E8E]">Trust Score</span>
                      <span className="font-mono font-[500] text-[#3E6AE1]">{match.carrier?.trustScore}/100</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#EEEEEE]">
                    {match.isBackhaul ? (
                      <span className="text-[11px] text-[#3E6AE1] flex items-center gap-1 font-[500]">
                        <Leaf className="w-3.5 h-3.5" /> Backhaul Optimization (-{match.expectedSavingsPercent}%)
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#8E8E8E]">Standard Routing</span>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        assignVehicleToShipment(
                          currentShipment.id,
                          match.vehicle.id,
                          match.driver?.id || drivers[0].id
                        );
                        showToast(
                          lang === 'ar' ? 'تم تعيين المركبة' : 'Vehicle Assigned',
                          lang === 'ar' ? `تم إسناد الشاحنة ${match.vehicle.plateNumber} للشحنة ${currentShipment.trackingNumber} بنجاح` : `Assigned ${match.vehicle.plateNumber} to ${currentShipment.trackingNumber}!`,
                          'success'
                        );
                      }}
                      className="btn-tesla-primary !min-w-[100px] !min-h-[30px] !py-0.5 !px-3 text-[12px]"
                    >
                      تثبيت التعيين
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 3: Match Evaluation Details (3 cols) */}
        <div className="lg:col-span-3 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <div className="pb-3 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[14px] text-[#171A20]">تفاصيل التحليل الخوارزمي</h3>
            <span className="text-[12px] text-[#5C5E62]">Multi-Criteria Weighting</span>
          </div>

          {selectedEvaluation ? (
            <div className="space-y-4 text-[13px]">
              <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-1">
                <span className="text-[11px] text-[#8E8E8E] block">Selected Fleet Unit</span>
                <div className="font-[500] text-[#171A20]">{selectedEvaluation.vehicle.plateNumber}</div>
                <div className="text-[12px] text-[#5C5E62]">{selectedEvaluation.carrier?.name}</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#5C5E62]">Match Score:</span>
                  <span className="font-mono font-[500] text-[#171A20]">{selectedEvaluation.matchScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5E62]">Distance to Pickup:</span>
                  <span className="font-mono font-[500] text-[#171A20]">{selectedEvaluation.distanceToPickupKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C5E62]">Carrier Trust:</span>
                  <span className="font-mono font-[500] text-[#171A20]">{selectedEvaluation.carrier?.trustScore}%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  assignVehicleToShipment(
                    currentShipment.id,
                    selectedEvaluation.vehicle.id,
                    selectedEvaluation.driver?.id || drivers[0].id
                  );
                  showToast(
                    lang === 'ar' ? 'تم تأكيد التعيين الفوري' : 'Assignment Confirmed',
                    lang === 'ar' ? `تم إسناد الشاحنة ${selectedEvaluation.vehicle.plateNumber} للشحنة ${currentShipment.trackingNumber}` : `Assigned ${selectedEvaluation.vehicle.plateNumber} to ${currentShipment.trackingNumber}!`,
                    'success'
                  );
                }}
                className="btn-tesla-primary w-full !min-h-[36px] text-[13px]"
              >
                تأكيد التعيين الفوري
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-[#8E8E8E] text-[13px]">
              اختر مركبة من القائمة لعرض تفاصيل التحليل الرياضي
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
