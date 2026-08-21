'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Shipment, Vehicle } from '@/types';
import { evaluateDispatchMatches, MatchEvaluation } from '@/lib/matching-engine';
import {
  Cpu,
  Truck,
  Package,
  Sparkles,
  Zap,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Info,
  Layers,
} from 'lucide-react';

export function SmartDispatchView() {
  const {
    shipments,
    vehicles,
    drivers,
    carriers,
    assignVehicleToShipment,
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
      // Auto-assign top match for the active shipment
      if (matches.length > 0) {
        const top = matches[0];
        assignVehicleToShipment(
          currentShipment.id,
          top.vehicle.id,
          top.driver?.id || drivers[0].id
        );
      }
      setIsAutoDispatching(false);
      alert(
        lang === 'ar'
          ? 'تم التوزيع الآلي بنجاح! تم تعيين أفضل شاحنة معتمدة بناءً على التكلفة ومطابقة العودة.'
          : 'AI Auto-Dispatch complete! Optimal asset assigned based on cost and backhaul fit.'
      );
    }, 1200);
  };

  return (
    <div className="space-y-4">
      {/* Smart Dispatch Header */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-gold" />
            <h2 className="font-bold text-lg text-white">
              {lang === 'ar' ? 'مركز التوزيع الذكي وخوارزميات المطابقة (AI Dispatch)' : 'AI Smart Dispatch & Fleet Allocation Center'}
            </h2>
          </div>
          <p className="text-xs text-gray-300">
            {lang === 'ar'
              ? 'تخصيص الشاحنات والسائقين بناءً على المسافة، السعة، مؤشر الثقة (Trust Score)، والرحلات العائدة.'
              : 'Allocate fleet assets dynamically based on proximity, payload, trust score, and backhaul empty optimization.'}
          </p>
        </div>

        <button
          onClick={handleAutoDispatch}
          disabled={isAutoDispatching || matches.length === 0}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-xl shadow-gold/10 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 text-navy-950 ${isAutoDispatching ? 'animate-spin' : 'animate-bounce'}`} />
          <span>{isAutoDispatching ? 'Optimizing Fleet...' : t.autoDispatchBtn}</span>
        </button>
      </div>

      {/* 3-Panel Dispatch Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Panel 1: Unassigned Shipments Queue (3.5 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-navy-900/90 border border-gold/25 p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-gold/15">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-gold" />
              <span>Unassigned Loads ({unassignedShipments.length})</span>
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">Queue</span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto custom-scrollbar">
            {unassignedShipments.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveShipmentId(s.id)}
                className={`w-full p-3 rounded-xl text-start transition-all cursor-pointer ${
                  s.id === currentShipment?.id
                    ? 'bg-gradient-to-r from-gold/20 to-navy-800 border border-gold/50 shadow-md'
                    : 'bg-navy-950/70 border border-navy-800 hover:bg-navy-800/80 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold font-mono text-gold">{s.trackingNumber}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{s.distanceKm} km</span>
                </div>
                <div className="font-semibold text-white text-xs">
                  {s.origin.city} ➔ {s.destination.city}
                </div>
                <div className="text-[11px] text-gray-400 truncate mt-0.5">
                  {s.cargoDescription} ({(s.totalWeightKg / 1000).toFixed(1)}T)
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Panel 2 & 3: Active Load Route Summary & AI Candidate Match Breakdown (8.5 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Target Load Profile Card */}
          {currentShipment && (
            <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/30 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gold/15 gap-2">
                <div>
                  <div className="text-xs text-gold font-mono font-bold">{currentShipment.trackingNumber}</div>
                  <h3 className="text-base font-bold text-white">
                    {currentShipment.origin.city} ➔ {currentShipment.destination.city}
                  </h3>
                  <div className="text-xs text-gray-300">{currentShipment.customerNameAr || currentShipment.customerName}</div>
                </div>

                <div className="text-end">
                  <div className="text-lg font-bold text-white font-mono">
                    {currentShipment.price.toLocaleString()} SDG
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">Required: {currentShipment.requiredVehicleType}</div>
                </div>
              </div>

              {/* Route & Cargo Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Distance:</span>
                  <span className="font-bold text-white font-mono">{currentShipment.distanceKm} KM</span>
                </div>
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Cargo Weight:</span>
                  <span className="font-bold text-gold font-mono">{(currentShipment.totalWeightKg / 1000).toFixed(1)} Tons</span>
                </div>
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Pickup Date:</span>
                  <span className="font-semibold text-gray-200">{currentShipment.pickupDate}</span>
                </div>
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Priority:</span>
                  <span className="font-semibold text-amber-400 uppercase font-mono">{currentShipment.priority}</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Recommended Candidate Fleet Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-gold uppercase px-1">
              <span>AI Ranked Fleet Matches ({matches.length} Candidates)</span>
              <span className="text-gray-400 text-[10px]">Scored by Proximity, Capacity, Trust & Backhaul</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {matches.map((match, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl bg-navy-900/90 border shadow-lg space-y-3 transition-all ${
                    match.matchScore >= 90
                      ? 'border-gold/40 hover:border-gold shadow-gold/5'
                      : 'border-navy-800 hover:border-navy-700'
                  }`}
                >
                  {/* Match Score Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                            match.matchScore >= 90
                              ? 'bg-gold/20 text-gold border-gold/40'
                              : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          }`}
                        >
                          {match.matchScore}% Match
                        </span>
                        {match.isBackhaul && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Backhaul Asset
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-white font-mono text-sm mt-1.5">{match.vehicle.plateNumber}</h4>
                      <div className="text-xs text-gray-400">{match.carrier?.name}</div>
                    </div>

                    <div className="text-end">
                      <div className="text-xs font-bold text-gold font-mono">{match.vehicle.capacityTons}T Payload</div>
                      <div className="text-[10px] text-gray-400">{match.distanceToPickupKm} km from pickup</div>
                    </div>
                  </div>

                  {/* Explainable Factor Pills */}
                  <div className="space-y-1 text-xs">
                    {match.factors.slice(0, 2).map((factor, fIdx) => (
                      <div key={fIdx} className="text-[11px] text-gray-300 flex items-center gap-1.5">
                        <span className="text-gold">•</span>
                        <span>{lang === 'ar' ? factor.descriptionAr : factor.descriptionEn}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gold/10">
                    <button
                      onClick={() => setSelectedEvaluation(match)}
                      className="px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'شرح التقييم' : 'Explain Score'}</span>
                    </button>
                    <button
                      onClick={() => {
                        assignVehicleToShipment(
                          currentShipment.id,
                          match.vehicle.id,
                          match.driver?.id || drivers[0].id
                        );
                        alert(
                          lang === 'ar'
                            ? `تم تعيين المركبة ${match.vehicle.plateNumber} للشحنة ${currentShipment.trackingNumber}`
                            : `Vehicle ${match.vehicle.plateNumber} assigned to ${currentShipment.trackingNumber}`
                        );
                      }}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-md transition-transform hover:scale-105 cursor-pointer text-center"
                    >
                      {lang === 'ar' ? 'تأكيد التعيين الفوري' : 'Assign to Load'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Explainable AI Factor Breakdown Modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-navy-900 border border-gold/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gold/20">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <span>Explainable AI Match Breakdown</span>
                </h3>
                <div className="text-xs text-gray-400 font-mono">{selectedEvaluation.vehicle.plateNumber}</div>
              </div>
              <button onClick={() => setSelectedEvaluation(null)} className="text-gray-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {selectedEvaluation.factors.map((f, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{lang === 'ar' ? f.nameAr : f.nameEn}</span>
                    <span className="font-bold font-mono text-gold">{f.score}/100</span>
                  </div>
                  <div className="text-xs text-gray-300">{lang === 'ar' ? f.descriptionAr : f.descriptionEn}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedEvaluation(null)}
              className="w-full py-2 rounded-xl bg-navy-800 text-gray-200 font-bold text-xs hover:bg-navy-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
