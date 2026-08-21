'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Vehicle } from '@/types';
import {
  Truck,
  Fuel,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  TrendingUp,
  Search,
  PlusCircle,
} from 'lucide-react';

export function FleetView() {
  const { vehicles, t, lang } = useApp();
  const [filterType, setFilterType] = useState('all');

  const filteredVehicles = vehicles.filter(
    (v) => filterType === 'all' || v.type === filterType
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-navy-900/90 border border-gold/25 shadow-xl">
        <div>
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-gold" />
            <span>{t.fleetManagement} ({vehicles.length})</span>
          </h2>
          <p className="text-xs text-gray-400">
            {lang === 'ar'
              ? 'مراقبة الشاحنات الحية، جدول الصيانة الوقائية، وتتبع كفاءة استهلاك الوقود.'
              : 'Live fleet telemetry, preventive maintenance scheduler, and fuel consumption analytics.'}
          </p>
        </div>

        <button
          onClick={() => alert(lang === 'ar' ? 'إضافة مركبة جديدة للأسطول' : 'Add new fleet vehicle')}
          className="px-4 py-2 rounded-xl bg-gold text-navy-950 font-bold text-xs hover:brightness-110 flex items-center gap-1.5 cursor-pointer shadow-lg"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'ar' ? 'إضافة شاحنة' : 'Add Vehicle'}</span>
        </button>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((v) => (
          <div
            key={v.id}
            className="p-4 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-3 hover:border-gold/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold font-mono text-white text-base">{v.plateNumber}</div>
                <div className="text-xs text-gray-400">{v.makeModel} ({v.year})</div>
                <div className="text-[11px] text-gold font-semibold">{v.carrierName}</div>
              </div>

              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
                  v.isReturningEmpty
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : v.status === 'in_transit'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-navy-800 text-gray-300 border-gray-700'
                }`}
              >
                {v.isReturningEmpty ? 'Empty Backhaul' : v.status}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                <span className="text-[10px] text-gray-400 block">Payload</span>
                <span className="font-bold text-gold font-mono">{v.capacityTons}T</span>
              </div>
              <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                <span className="text-[10px] text-gray-400 block">Fuel Level</span>
                <span className="font-bold text-emerald-400 font-mono">{v.fuelLevelPercent}%</span>
              </div>
              <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                <span className="text-[10px] text-gray-400 block">Speed</span>
                <span className="font-bold text-sky-400 font-mono">{v.speedKmh} km/h</span>
              </div>
            </div>

            {/* Driver & Maintenance Alert */}
            <div className="text-xs text-gray-300 space-y-1 bg-navy-950/60 p-2.5 rounded-xl border border-navy-800">
              <div className="flex justify-between">
                <span className="text-gray-400">Driver:</span>
                <span className="font-semibold text-white">{v.driverName || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Next Service:</span>
                <span className="font-mono text-gray-300">{(v.nextMaintenanceKm - v.mileageKm).toLocaleString()} km left</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
