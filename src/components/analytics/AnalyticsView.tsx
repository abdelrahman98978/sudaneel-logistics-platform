'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Leaf,
  Clock,
  Repeat,
  Compass,
} from 'lucide-react';

export function AnalyticsView() {
  const { t, lang } = useApp();

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-[500] text-[#171A20] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#3E6AE1]" />
            <span>{t.analytics} (Executive BI & Intelligence)</span>
          </h2>
          <p className="text-[13px] font-[400] text-[#5C5E62] mt-1">
            {lang === 'ar'
              ? 'مؤشرات الأداء التنافسية، خفض الكيلومترات الفارغة، ربحية الممرات، وتأثير الاستدامة البيئية.'
              : 'Strategic competitive KPIs, empty-km reduction, corridor profitability, and ESG carbon metrics.'}
          </p>
        </div>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Empty KM Reduction</span>
            <TrendingDown className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#3E6AE1]">-28.6%</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Target: -35% by Q4</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Backhaul Match</span>
            <Repeat className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">41.8%</div>
          <div className="text-[11px] text-[#3E6AE1] mt-1">+12.4% vs industry avg</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Avg Match Time</span>
            <Clock className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">3.8 min</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Autonomous AI dispatch</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>CO₂ Emissions Saved</span>
            <Leaf className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#3E6AE1]">142 Tons</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Via Backhaul Engine</div>
        </div>
      </div>

      {/* Corridor Profitability Analysis & Route Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-6 space-y-4">
          <h3 className="font-[500] text-[15px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
            <TrendingUp className="w-4 h-4 text-[#3E6AE1]" />
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
              },
              {
                route: 'Port Sudan ➔ Khartoum (Import Containers & Reefer)',
                volume: '1,180 Loads',
                revenue: '5.62B SDG',
                margin: '16.8%',
                barWidth: '82%',
              },
              {
                route: 'Gedaref ➔ Port Sudan (Agricultural Sesame/Grains)',
                volume: '840 Loads',
                revenue: '3.19B SDG',
                margin: '15.4%',
                barWidth: '65%',
              },
              {
                route: 'Khartoum ➔ Wad Madani & Sennar (Consumer Cargo)',
                volume: '620 Loads',
                revenue: '1.24B SDG',
                margin: '12.1%',
                barWidth: '45%',
              },
            ].map((c, idx) => (
              <div key={idx} className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2 text-[13px]">
                <div className="flex items-center justify-between text-[#171A20] font-[500]">
                  <span>{c.route}</span>
                  <span className="font-mono text-[#3E6AE1]">{c.revenue} (Margin: {c.margin})</span>
                </div>
                <div className="w-full bg-[#EEEEEE] rounded-[2px] h-1.5 overflow-hidden">
                  <div className="bg-[#3E6AE1] h-full rounded-[2px]" style={{ width: c.barWidth }}></div>
                </div>
                <div className="flex justify-between text-[11px] text-[#5C5E62]">
                  <span>Monthly Traffic: {c.volume}</span>
                  <span>97.6% SLA Compliance</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sudaneel Network Flywheel Card */}
        <div className="lg:col-span-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-[500] text-[15px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
              <Compass className="w-4 h-4 text-[#3E6AE1]" />
              <span>Sudaneel Network Flywheel</span>
            </h3>
            <p className="text-[13px] text-[#5C5E62] mt-2">
              Every returning empty truck matched increases carrier earnings, lowers shipper prices, and builds unmatched logistics network density.
            </p>
          </div>

          <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-[13px] space-y-2 text-center">
            <div className="font-mono text-[#171A20] font-[500]">More Certified Carriers</div>
            <div className="text-[#8E8E8E]">↓</div>
            <div className="font-mono text-[#3E6AE1] font-[500]">Higher Asset Density & Backhaul</div>
            <div className="text-[#8E8E8E]">↓</div>
            <div className="font-mono text-[#171A20] font-[500]">-28% Freight Cost for Shippers</div>
            <div className="text-[#8E8E8E]">↓</div>
            <div className="font-mono text-[#3E6AE1] font-[500]">Market Leadership in East Africa</div>
          </div>
        </div>
      </div>
    </div>
  );
}
