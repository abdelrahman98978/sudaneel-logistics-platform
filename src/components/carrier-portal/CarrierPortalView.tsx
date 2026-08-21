'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  Building2,
  Truck,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  CheckCircle2,
  Calendar,
  Users,
  Award,
} from 'lucide-react';

export function CarrierPortalView() {
  const { carriers, vehicles, drivers, shipments, t, lang } = useApp();
  const currentCarrier = carriers[0];

  return (
    <div className="space-y-5">
      {/* Carrier Top Profile Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/30 to-amber-500/20 border border-gold/50 flex items-center justify-center text-gold shadow-lg">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white">{currentCarrier.name}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-semibold font-mono">
                {currentCarrier.ratingCategory} Certified
              </span>
            </div>
            <p className="text-xs text-gray-300">
              {currentCarrier.city}, Sudan • {currentCarrier.phone} • {currentCarrier.email}
            </p>
          </div>
        </div>

        {/* Trust Score Radial/Pill */}
        <div className="flex items-center gap-3 bg-navy-950 p-3 rounded-xl border border-gold/30">
          <Award className="w-8 h-8 text-gold" />
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-bold">Sudaneel Trust Score</div>
            <div className="text-xl font-bold font-mono text-gold">{currentCarrier.trustScore} / 100</div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Fleet Size</span>
            <Truck className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl font-bold font-mono text-white">{currentCarrier.fleetCount} Trucks</div>
          <div className="text-[10px] text-emerald-400 mt-1">{currentCarrier.activeTrips} On Trips</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>On-Time Delivery</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">{currentCarrier.onTimeDeliveryRate}%</div>
          <div className="text-[10px] text-gray-400 mt-1">1,840 Total Trips</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Monthly Payouts</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-gold">48.5M <span className="text-xs">SDG</span></div>
          <div className="text-[10px] text-emerald-400 mt-1">Settled within 24h of POD</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Active Drivers</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-sky-400">30 Drivers</div>
          <div className="text-[10px] text-gray-400 mt-1">100% License Verified</div>
        </div>
      </div>

      {/* Carrier Drivers & Fleet List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Drivers */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-gold" />
            <span>Assigned Drivers & Scores</span>
          </h3>
          <div className="space-y-2">
            {drivers.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-xl bg-navy-950/70 border border-navy-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{d.nameAr || d.name}</div>
                  <div className="text-[10px] text-gray-400">{d.phone} • {d.totalTrips} Trips</div>
                </div>
                <div className="text-end">
                  <span className="font-mono font-bold text-gold bg-navy-900 px-2 py-0.5 rounded border border-gold/20">
                    Trust: {d.trustScore}
                  </span>
                  <div className="text-[10px] text-emerald-400 mt-1">{d.onTimeRate}% OTD</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Trucks */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-gold" />
            <span>Fleet Availability</span>
          </h3>
          <div className="space-y-2">
            {vehicles.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-xl bg-navy-950/70 border border-navy-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-mono font-bold text-white">{v.plateNumber}</div>
                  <div className="text-[10px] text-gray-400">{v.makeModel} ({v.capacityTons}T)</div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    v.status === 'in_transit'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
