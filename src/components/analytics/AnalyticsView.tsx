'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Leaf,
  Clock,
  Award,
  Truck,
  DollarSign,
  Compass,
  Repeat,
} from 'lucide-react';

export function AnalyticsView() {
  const { t, lang } = useApp();

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold" />
            <span>{t.analytics} (Executive BI & Intelligence)</span>
          </h2>
          <p className="text-xs text-gray-300">
            {lang === 'ar'
              ? 'مؤشرات الأداء التنافسية، خفض الكيلومترات الفارغة، ربحية الممرات، وتأثير الاستدامة البيئية.'
              : 'Strategic competitive KPIs, empty-km reduction, corridor profitability, and ESG carbon metrics.'}
          </p>
        </div>
      </div>

      {/* Strategic KPIs (The Flywheel Advantage) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-emerald-500/30 shadow-lg">
          <div className="text-xs text-emerald-300 flex items-center justify-between mb-1">
            <span>Empty KM Reduction</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">-28.6%</div>
          <div className="text-[10px] text-gray-400 mt-1">Target: -35% by Q4</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Backhaul Match Rate</span>
            <Repeat className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-bold font-mono text-gold">41.8%</div>
          <div className="text-[10px] text-emerald-400 mt-1">+12.4% vs industry avg</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-sky-500/30 shadow-lg">
          <div className="text-xs text-sky-300 flex items-center justify-between mb-1">
            <span>Avg Match Time</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">3.8 min</div>
          <div className="text-[10px] text-gray-400 mt-1">Autonomous AI dispatch</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-emerald-500/30 shadow-lg">
          <div className="text-xs text-emerald-300 flex items-center justify-between mb-1">
            <span>CO₂ Emissions Saved</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300">142 Tons</div>
          <div className="text-[10px] text-gray-400 mt-1">Via Backhaul Optimization</div>
        </div>
      </div>

      {/* Corridor Profitability Analysis & Route Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 rounded-2xl bg-navy-900/90 border border-gold/20 p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" />
            <span>Corridor Volume & Profitability Breakdown</span>
          </h3>

          <div className="space-y-3">
            {[
              {
                route: 'Khartoum ➔ Port Sudan (Al-Tahaddi Corridor)',
                volume: '1,420 Loads',
                revenue: '4.88B SDG',
                margin: '14.2%',
                barWidth: '92%',
                barColor: 'bg-gold',
              },
              {
                route: 'Port Sudan ➔ Khartoum (Import Containers & Reefer)',
                volume: '1,180 Loads',
                revenue: '5.62B SDG',
                margin: '16.8%',
                barWidth: '82%',
                barColor: 'bg-sky-400',
              },
              {
                route: 'Gedaref ➔ Port Sudan (Agricultural Sesame/Grains)',
                volume: '840 Loads',
                revenue: '3.19B SDG',
                margin: '15.4%',
                barWidth: '65%',
                barColor: 'bg-emerald-400',
              },
              {
                route: 'Khartoum ➔ Wad Madani & Sennar (Consumer Cargo)',
                volume: '620 Loads',
                revenue: '1.24B SDG',
                margin: '12.1%',
                barWidth: '45%',
                barColor: 'bg-amber-400',
              },
            ].map((c, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>{c.route}</span>
                  <span className="font-mono text-gold">{c.revenue} (Margin: {c.margin})</span>
                </div>
                <div className="w-full bg-navy-900 rounded-full h-2 overflow-hidden border border-navy-800">
                  <div className={`${c.barColor} h-full rounded-full`} style={{ width: c.barWidth }}></div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Monthly Traffic: {c.volume}</span>
                  <span>97.6% SLA Compliance</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sudaneel Network Flywheel Card */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-navy-900/90 to-navy-950 border border-gold/25 p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold" />
              <span>Sudaneel Network Flywheel</span>
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Every returning empty truck matched increases carrier earnings, lowers shipper prices, and builds unmatched logistics network density.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/90 border border-gold/20 text-xs space-y-2 text-center">
            <div className="font-mono text-gold font-bold text-sm">More Certified Carriers</div>
            <div className="text-gray-400">↓</div>
            <div className="font-mono text-sky-400 font-bold text-sm">Higher Asset Density & Backhaul</div>
            <div className="text-gray-400">↓</div>
            <div className="font-mono text-emerald-400 font-bold text-sm">-28% Freight Cost for Shippers</div>
            <div className="text-gray-400">↓</div>
            <div className="font-mono text-white font-bold text-sm">Market Leadership in East Africa</div>
          </div>
        </div>
      </div>
    </div>
  );
}
