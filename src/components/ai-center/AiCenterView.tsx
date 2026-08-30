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
  Fuel,
  Anchor,
  CloudRain,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  BarChart3,
} from 'lucide-react';

export function AiCenterView() {
  const { digitalTwinScenarios, anomalyAlerts, showToast, t, lang } = useApp();

  const [activeTab, setActiveTab] = useState<'digital_twin' | 'anomaly_detection' | 'explainable_ai'>('digital_twin');
  const [selectedScenario, setSelectedScenario] = useState<DigitalTwinScenario>(digitalTwinScenarios[0]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Interactive Live Parameter Sliders for Digital Twin
  const [fuelInflation, setFuelInflation] = useState(20); // +20% fuel cost
  const [portCongestion, setPortCongestion] = useState(35); // +35% wait time in Port Sudan
  const [rainySeasonRisk, setRainySeasonRisk] = useState(true); // Western corridors rain blockages

  // Explainable AI Weight Tuning
  const [weightProximity, setWeightProximity] = useState(35);
  const [weightBackhaul, setWeightBackhaul] = useState(35);
  const [weightTrust, setWeightTrust] = useState(30);

  // Calculate live dynamic twin outputs
  const calculatedFleetUtilization = Math.min(96, Math.max(50, 85 - Math.round(portCongestion * 0.15) + (rainySeasonRisk ? -8 : 4)));
  const calculatedProfitMargin = (22 - (fuelInflation * 0.2) + (weightBackhaul > 30 ? 6.5 : 2)).toFixed(1);
  const calculatedEmptyKm = Math.max(6, 24 - Math.round(weightBackhaul * 0.35));

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      showToast(
        lang === 'ar' ? 'اكتملت محاكاة التوأم الرقمي' : 'Digital Twin Simulation Complete',
        lang === 'ar'
          ? `تم تحديث التوقعات: إشغال الأسطول ${calculatedFleetUtilization}%، هامش الأرباح +${calculatedProfitMargin}%، وخفض الرجوع الفارغ إلى ${calculatedEmptyKm}%!`
          : `Projections updated: Fleet utilization ${calculatedFleetUtilization}%, profit margin +${calculatedProfitMargin}%.`,
        'success'
      );
    }, 700);
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
          <h1 className="text-[26px] font-[600] text-[#000000] tracking-tight">
            مركز الذكاء الاصطناعي والتوأم الرقمي
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            محاكاة سيناريوهات الأسطول التشغيلية (تغير أسعار الوقود، مواسم الأمطار، وازدحام الموانئ)، كشف التلاعب بالوقود وGPS، وتفسير قرارات التوزيع الذكي.
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
              className={`px-4 py-2 rounded-full text-[13px] font-[600] transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#000000] text-[#c1fbd4] shadow-sm'
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
        <div className="space-y-6">
          {/* Interactive Parameter Control Bar */}
          <div className="shopify-card p-6 bg-[#ffffff] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#000000]" />
                <h3 className="font-[600] text-[16px] text-[#000000]">
                  لوحة تعديل متغيرات السوق المباشرة (Live Market Shocks)
                </h3>
              </div>
              <span className="shopify-tag-mint !text-[11px]">Dynamic Stress Testing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px]">
              {/* Slider 1: Fuel Inflation */}
              <div className="space-y-2 p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <div className="flex items-center justify-between">
                  <span className="font-[600] text-[#000000] flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-[#71717a]" />
                    <span>تغير أسعار الوقود:</span>
                  </span>
                  <span className="font-mono font-[700] text-[#000000]">+{fuelInflation}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={fuelInflation}
                  onChange={(e) => setFuelInflation(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#71717a]">
                  <span>مستقر (0%)</span>
                  <span>أزمة حادة (+60%)</span>
                </div>
              </div>

              {/* Slider 2: Port Congestion */}
              <div className="space-y-2 p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <div className="flex items-center justify-between">
                  <span className="font-[600] text-[#000000] flex items-center gap-1.5">
                    <Anchor className="w-4 h-4 text-[#71717a]" />
                    <span>ازدحام أرصفة الميناء:</span>
                  </span>
                  <span className="font-mono font-[700] text-[#000000]">+{portCongestion}% تأخير</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={portCongestion}
                  onChange={(e) => setPortCongestion(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#71717a]">
                  <span>انسيابي (0%)</span>
                  <span>اختناق بحري (+80%)</span>
                </div>
              </div>

              {/* Toggle 3: Rainy Season Weather Block */}
              <div className="space-y-2 p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-[600] text-[#000000] flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-[#71717a]" />
                    <span>موسم الخريف والطرق الترابية:</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={rainySeasonRisk}
                    onChange={(e) => setRainySeasonRisk(e.target.checked)}
                    className="w-5 h-5 accent-black rounded cursor-pointer"
                  />
                </div>
                <p className="text-[11.5px] text-[#71717a]">
                  {rainySeasonRisk
                    ? 'مفعل: إعادة التوجيه التلقائي عبر المسارات الإسفلتية المرتفعة'
                    : 'معطل: تشغيل كافة الطرق الطبيعية'}
                </p>
              </div>
            </div>
          </div>

          {/* Scenario Selector & Simulation Outcomes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Scenario Selector (5 cols) */}
            <div className="lg:col-span-5 shopify-card p-6 space-y-4 bg-[#ffffff]">
              <h3 className="font-[600] text-[16px] text-[#000000] pb-3 border-b border-[#e4e4e7]">
                سيناريوهات التوأم الرقمي المسجلة
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
                    <span className="shopify-tag-mint !text-[11px]">Real-Time Twin Engine</span>
                    <h3 className="font-[600] text-[18px] text-[#000000] mt-1">{selectedScenario.titleAr || selectedScenario.titleEn}</h3>
                  </div>
                  <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="btn-shopify-pill !py-2.5 !px-6 text-[13px] flex items-center gap-2"
                  >
                    <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
                    <span>{isSimulating ? 'جارٍ إعادة المحاكاة...' : 'تشغيل المحاكاة الفورية'}</span>
                  </button>
                </div>

                {/* Simulation Projected Impact Cards (3 metrics) */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                    <div className="text-[11.5px] text-[#71717a] font-[500]">إشغال الأسطول المتوقع</div>
                    <div className="font-mono font-[700] text-[22px] text-[#000000] mt-1">{calculatedFleetUtilization}%</div>
                  </div>

                  <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2]">
                    <div className="text-[11.5px] text-[#000000] font-[600]">هامش الأرباح الصافي</div>
                    <div className="font-mono font-[800] text-[22px] text-[#000000] mt-1">+{calculatedProfitMargin}%</div>
                  </div>

                  <div className="p-4 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf]">
                    <div className="text-[11.5px] text-[#000000] font-[600]">نسبة الرجوع الفارغ</div>
                    <div className="font-mono font-[800] text-[22px] text-[#000000] mt-1">{calculatedEmptyKm}%</div>
                  </div>
                </div>

                {/* AI Strategic Recommendation */}
                <div className="p-6 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] space-y-2">
                  <div className="flex items-center gap-2 font-[700] text-[14px] text-[#000000]">
                    <Sparkles className="w-4 h-4 text-[#000000]" />
                    <span>توصية الذكاء الاصطناعي التشغيلية (Autonomous Action)</span>
                  </div>
                  <p className="text-[13px] text-[#000000]/80 leading-relaxed font-[420]">
                    {fuelInflation > 25
                      ? `نظراً لارتفاع الوقود بنسبة +${fuelInflation}%، توصي الخوارزمية برفع أولوية عقود العودة الإلزامية (Backhaul Required) لضمان عدم تحرك أي شاحنة فارغة بين الخرطوم وبورتسودان.`
                      : selectedScenario.recommendationAr || selectedScenario.recommendationEn}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANOMALY DETECTION */}
      {activeTab === 'anomaly_detection' && (
        <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
            <div>
              <h3 className="font-[600] text-[16px] text-[#000000]">سجل تنبيهات الشذوذ والاحتيال الحي (Real-time Anomaly Stream)</h3>
              <p className="text-[12px] text-[#71717a] mt-0.5">مراقبة تيليماتري مستمرة لكشف التلاعب بأجهزة التتبع وسحب الوقود غير المصرح</p>
            </div>
            <span className="shopify-tag-mint">Telemetry Protection Guard</span>
          </div>

          <div className="space-y-3">
            {anomalyAlerts.map((alt) => (
              <div key={alt.id} className="p-5 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#000000] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5 text-[#c1fbd4]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-[600] text-[14.5px] text-[#000000]">{alt.titleAr || alt.titleEn}</span>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-white border border-[#e4e4e7] text-[#71717a]">
                        {alt.assetPlate} • {alt.driverName}
                      </span>
                    </div>
                    <div className="text-[12.5px] text-[#71717a] mt-1">{alt.explanationAr || alt.explanationEn}</div>
                    <div className="text-[11px] text-[#71717a] mt-1">الموقع: {alt.location}</div>
                  </div>
                </div>

                <div className="text-end flex-shrink-0 space-y-1">
                  <span className="font-mono text-[12px] text-[#71717a] block">{alt.detectedAt}</span>
                  <button
                    onClick={() => showToast('فحص الأمان', `تم قفل محرك المركبة ${alt.assetPlate} احترازياً وإرسال دورية تفتيش`, 'warning')}
                    className="btn-shopify-outline !py-1 !px-3 text-[11px]"
                  >
                    إجراء احترازي
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXPLAINABLE AI */}
      {activeTab === 'explainable_ai' && (
        <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
            <div>
              <h3 className="font-[600] text-[16px] text-[#000000]">تفسير قرارات خوارزمية التوزيع (Explainable AI - XAI)</h3>
              <p className="text-[12px] text-[#71717a] mt-0.5">أوزان اتخاذ القرار قابلة للضبط لتوجيه خوارزميات الذكاء الاصطناعي</p>
            </div>
            <span className="shopify-tag-pistachio">Weight Matrix 100% Transparent</span>
          </div>

          {/* Interactive Weight Tuning */}
          <div className="p-6 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-4">
            <span className="text-[13px] font-[600] text-[#000000] block">
              ضبط أوزان معادلة التوزيع الذكي (Dynamic Matrix Tuning):
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px]">
              <div className="space-y-2">
                <div className="flex justify-between font-[600]">
                  <span>القرب الجغرافي:</span>
                  <span className="font-mono">{weightProximity}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={weightProximity}
                  onChange={(e) => setWeightProximity(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-[600]">
                  <span>فرصة العودة الفارغة:</span>
                  <span className="font-mono">{weightBackhaul}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={weightBackhaul}
                  onChange={(e) => setWeightBackhaul(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-[600]">
                  <span>سجل الثقة والأمان:</span>
                  <span className="font-mono">{weightTrust}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  value={weightTrust}
                  onChange={(e) => setWeightTrust(Number(e.target.value))}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2">
              <span className="shopify-tag-mint !text-[11px]">وزن {weightProximity}%</span>
              <h4 className="font-[600] text-[15px] text-[#000000]">المسافة الجغرافية وقرب المركبة</h4>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed">
                حساب المسافة الفعلية الحية لأقرب شاحنة شاغرة من نقطة التحميل عبر خوارزميات Dijkstra المعدلة.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2">
              <span className="shopify-tag-mint !text-[11px]">وزن {weightBackhaul}%</span>
              <h4 className="font-[600] text-[15px] text-[#000000]">فرصة رحلة العودة (Backhaul Probability)</h4>
              <p className="text-[12.5px] text-[#71717a] leading-relaxed">
                توقع وجود حمولة معاكسة في نقطة المقصد لتقليل مسافة الرجوع الفارغ إلى الصفر.
              </p>
            </div>

            <div className="p-6 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2">
              <span className="shopify-tag-mint !text-[11px]">وزن {weightTrust}%</span>
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
