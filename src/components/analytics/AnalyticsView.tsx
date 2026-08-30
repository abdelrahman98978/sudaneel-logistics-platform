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
  ArrowUpRight,
} from 'lucide-react';

export function AnalyticsView() {
  const { t, lang, setCurrentView } = useApp();

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <BarChart3 className="w-4 h-4" />
            <span>Executive BI & Intelligence • لوحة التحليلات التنفيذية</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            تحليلات الأداء والذكاء اللوجستي (BI)
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            مؤشرات الأداء التنافسية، خفض الكيلومترات الفارغة، ربحية الممرات، وتأثير الاستدامة البيئية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('reports')}
            className="btn-shopify-pill"
          >
            <span>عرض التقارير المتقدمة</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Strategic KPIs (Shopify Card System with Aloe Featured Card) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="shopify-card-aloe p-6 space-y-2 shadow-[0_8px_20px_rgba(193,251,212,0.4)]">
          <div className="text-[12px] text-[#000000] font-[600] flex items-center justify-between">
            <span>Empty KM Reduction</span>
            <TrendingDown className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">-28.6%</div>
          <div className="text-[11.5px] text-[#000000]/80 font-[500]">Target: -35% by Q4</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>Backhaul Match</span>
            <Repeat className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">41.8%</div>
          <div className="text-[11.5px] text-[#000000] font-[500]">+12.4% vs industry avg</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>Avg Match Time</span>
            <Clock className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">3.8 min</div>
          <div className="text-[11.5px] text-[#71717a]">Autonomous AI dispatch</div>
        </div>

        <div className="shopify-card-pistachio p-6 space-y-2">
          <div className="text-[12px] text-[#000000] font-[600] flex items-center justify-between">
            <span>CO₂ Emissions Saved</span>
            <Leaf className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">142 Tons</div>
          <div className="text-[11.5px] text-[#000000]/80 font-[500]">Via Backhaul Engine</div>
        </div>
      </div>

      {/* Corridor Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[16px] text-[#000000]">
              أداء الممرات اللوجستية الرئيسية (Corridor Performance)
            </h3>
            <span className="shopify-tag-mint !text-[11px]">Q3 2026</span>
          </div>

          <div className="space-y-4">
            {[
              { route: 'Port Sudan ➔ Khartoum', volume: '1,420 Tons', profit: '+18.4%', backhaul: '64%' },
              { route: 'Khartoum ➔ Port Sudan (Exports)', volume: '980 Tons', profit: '+24.1%', backhaul: '82%' },
              { route: 'Gedaref ➔ Port Sudan (Grains)', volume: '2,100 Tons', profit: '+14.9%', backhaul: '51%' },
              { route: 'Khartoum ➔ El Obeid (Goods)', volume: '620 Tons', profit: '+9.2%', backhaul: '38%' },
            ].map((c, i) => (
              <div key={i} className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between">
                <div>
                  <div className="font-[600] text-[14px] text-[#000000]">{c.route}</div>
                  <div className="text-[12px] text-[#71717a] mt-0.5">الحجم المنقول: {c.volume}</div>
                </div>
                <div className="text-end">
                  <div className="font-mono font-[700] text-[#000000] text-[14px]">{c.profit}</div>
                  <div className="text-[11px] text-[#000000] font-mono bg-[#c1fbd4] px-2 py-0.5 rounded-full inline-block mt-0.5">
                    الرجوع المحمّل: {c.backhaul}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESG & Sustainability Analytics */}
        <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[16px] text-[#000000]">
              تقرير الأثر البيئي والاستدامة (ESG Impact)
            </h3>
            <span className="shopify-tag-pistachio !text-[11px]">Green Fleet Certified</span>
          </div>

          <div className="p-6 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-[#000000]" />
              <h4 className="font-[700] text-[15px] text-[#000000]">شهادة خفض البصمة الكربونية</h4>
            </div>
            <p className="text-[13px] text-[#000000]/80 leading-relaxed">
              ساهمت خوارزميات التوزيع الذكي للرحلات المرتدة (Backhaul Matching) في تقليل الكيلومترات المقطوعة بدون حمولة بمقدار 184,000 كم خلال هذا الربع.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
              <div className="font-mono font-[700] text-[20px] text-[#000000]">58,400 L</div>
              <div className="text-[12px] text-[#71717a] mt-1">وقود تم توفيره</div>
            </div>
            <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
              <div className="font-mono font-[700] text-[20px] text-[#000000]">$62,800</div>
              <div className="text-[12px] text-[#71717a] mt-1">وفر مالي للناقلين</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
