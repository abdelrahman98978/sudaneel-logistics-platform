'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { DigitalTwinScenario } from '@/types';
import {
  Cpu,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Sliders,
  Play,
  Zap,
  Layers,
} from 'lucide-react';

export function AiCenterView() {
  const { digitalTwinScenarios, anomalyAlerts, showToast, t, lang } = useApp();

  const [activeTab, setActiveTab] = useState<'digital_twin' | 'anomaly_detection' | 'explainable_ai'>('digital_twin');
  const [selectedScenario, setSelectedScenario] = useState<DigitalTwinScenario>(digitalTwinScenarios[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [customDemandMultiplier, setCustomDemandMultiplier] = useState(30);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      showToast(
        lang === 'ar' ? 'اكتملت محاكاة التوأم الرقمي' : 'Digital Twin Simulation Complete',
        lang === 'ar'
          ? 'تم تشغيل محاكاة التوأم الرقمي بنجاح! تم تحديث توقعات استخدام الأسطول وهوامش الأرباح.'
          : 'Fleet utilization and profit projections updated.',
        'success'
      );
    }, 800);
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="shopify-tag-mint">
            <Cpu className="w-4 h-4" />
            <span>Autonomous Intelligence & Digital Twin • مختبر المحاكاة والذكاء الاصطناعي</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            مركز الذكاء الاصطناعي والتوأم الرقمي
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            محاكاة سيناريوهات الأسطول التشغيلية (ماذا لو زاد الطلب 30%؟)، كشف التلاعب بالوقود وGPS، وتفسير قرارات التوزيع الذكي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'digital_twin', label: 'التوأم الرقمي والمحاكاة' },
            { id: 'anomaly_detection', label: 'كشف الاحتيال والشذوذ' },
            { id: 'explainable_ai', label: 'تفسير الخوارزميات (XAI)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-[13px] font-[500] transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: DIGITAL TWIN SIMULATION */}
      {activeTab === 'digital_twin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Scenario Selector (5 cols) */}
          <div className="lg:col-span-5 shopify-card p-6 space-y-4 bg-[#ffffff]">
            <h3 className="font-[600] text-[16px] text-[#000000] pb-3 border-b border-[#e4e4e7]">
              سيناريوهات المحاكاة الاستراتيجية
            </h3>

            <div className="space-y-3">
              {digitalTwinScenarios.map((sc) => {
                const isSelected = sc.id === selectedScenario.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => setSelectedScenario(sc)}
                    className={`p-4 rounded-[12px] text-start transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'shopify-card-aloe shadow-[0_8px_16px_rgba(193,251,212,0.4)]'
                        : 'bg-[#fbfbf5] border-[#e4e4e7] hover:border-[#a1a1aa]'
                    }`}
                  >
                    <div className="font-[600] text-[14px] text-[#000000]">{sc.titleAr || sc.titleEn}</div>
                    <div className="text-[12px] text-[#71717a] mt-1 line-clamp-2">{sc.descriptionAr || sc.descriptionEn}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scenario Execution & Outcomes (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
              <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
                <div>
                  <span className="shopify-tag-mint !text-[11px]">Active Twin Model</span>
                  <h3 className="font-[600] text-[18px] text-[#000000] mt-1">{selectedScenario.titleAr || selectedScenario.titleEn}</h3>
                </div>
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="btn-shopify-pill !py-2 !px-5 text-[13px] flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isSimulating ? 'جارٍ تشغيل المحاكاة...' : 'تشغيل المحاكاة الفورية'}</span>
                </button>
              </div>

              {/* Simulation Projected Impact Cards */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                  <div className="text-[11.5px] text-[#71717a] font-[500]">نسبة إشغال الأسطول المتوقعة</div>
                  <div className="font-mono font-[700] text-[22px] text-[#000000] mt-1">{selectedScenario.simulatedFleetUtilization}%</div>
                </div>

                <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2]">
                  <div className="text-[11.5px] text-[#000000] font-[600]">الأثر المتوقع على الأرباح</div>
                  <div className="font-mono font-[800] text-[22px] text-[#000000] mt-1">{selectedScenario.simulatedProfitMarginChange}</div>
                </div>
              </div>

              {/* AI Strategic Recommendation */}
              <div className="p-6 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] space-y-2">
                <div className="flex items-center gap-2 font-[700] text-[14px] text-[#000000]">
                  <Sparkles className="w-4 h-4 text-[#000000]" />
                  <span>توصية الذكاء الاصطناعي التشغيلية (AI Recommendation)</span>
                </div>
                <p className="text-[13px] text-[#000000]/80 leading-relaxed font-[420]">
                  {selectedScenario.recommendationAr || selectedScenario.recommendationEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANOMALY DETECTION */}
      {activeTab === 'anomaly_detection' && (
        <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[16px] text-[#000000]">سجل تنبيهات الشذوذ والاحتيال الحي (Real-time Anomaly Stream)</h3>
            <span className="shopify-tag-mint">Telemetry Protection Guard</span>
          </div>

          <div className="space-y-3">
            {anomalyAlerts.map((alt) => (
              <div key={alt.id} className="p-5 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#000000] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5 text-[#c1fbd4]" />
                  </div>
                  <div>
                    <div className="font-[600] text-[14.5px] text-[#000000]">{alt.titleAr || alt.titleEn}</div>
                    <div className="text-[12.5px] text-[#71717a] mt-1">{alt.explanationAr || alt.explanationEn}</div>
                  </div>
                </div>
                <span className="font-mono text-[12px] text-[#71717a] flex-shrink-0">{alt.detectedAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXPLAINABLE AI */}
      {activeTab === 'explainable_ai' && (
        <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[16px] text-[#000000]">تفسير قرارات خوارزمية التوزيع (Explainable AI - XAI)</h3>
            <span className="shopify-tag-pistachio">Weight Matrix 100% Transparent</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2">
              <span className="shopify-tag-mint !text-[11px]">وزن 35%</span>
              <h4 className="font-[600] text-[15px] text-[#000000]">المسافة الجغرافية وقرب المركبة</h4>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed">
                حساب المسافة الفعلية الحية لأقرب شاحنة شاغرة من نقطة التحميل عبر خوارزميات Dijkstra المعدلة.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2">
              <span className="shopify-tag-mint !text-[11px]">وزن 30%</span>
              <h4 className="font-[600] text-[15px] text-[#000000]">فرصة رحلة العودة (Backhaul Probability)</h4>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed">
                توقع وجود حمولة معاكسة في نقطة المقصد لتقليل مسافة الرجوع الفارغ إلى الصفر.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2">
              <span className="shopify-tag-mint !text-[11px]">وزن 35%</span>
              <h4 className="font-[600] text-[15px] text-[#000000]">تقييم الناقل وسجل السلامة</h4>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed">
                اعتماد مؤشر الثقة التاريخي (Trust Score) ونسبة الالتزام بمواعيد التسليم (OTD).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
