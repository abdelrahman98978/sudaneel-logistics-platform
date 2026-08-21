'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { DigitalTwinScenario, AnomalyAlert } from '@/types';
import {
  Cpu,
  Sparkles,
  Play,
  RotateCcw,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Truck,
  Repeat,
  Radio,
  Zap,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

export function AiCenterView() {
  const { digitalTwinScenarios, anomalyAlerts, t, lang } = useApp();

  const [activeTab, setActiveTab] = useState<'digital_twin' | 'anomaly_detection' | 'explainable_ai'>('digital_twin');
  const [selectedScenario, setSelectedScenario] = useState<DigitalTwinScenario>(digitalTwinScenarios[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [customDemandMultiplier, setCustomDemandMultiplier] = useState(30);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      alert(
        lang === 'ar'
          ? 'تم تشغيل محاكاة التوأم الرقمي بنجاح! تم تحديث توقعات استخدام الأسطول وهوامش الأرباح.'
          : 'Digital Twin simulation completed! Fleet utilization and profit projections updated.'
      );
    }, 1200);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'مركز الذكاء الاصطناعي والتوأم الرقمي (Sudaneel AI & Digital Twin)' : 'AI Center & Digital Twin Simulation Lab'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            {lang === 'ar'
              ? 'محاكاة سيناريوهات الأسطول التشغيلية (ماذا لو زاد الطلب 30%؟)، كشف التلاعب بالوقود وGPS، وتفسير قرارات التوزيع الذكي.'
              : 'Execute fleet stress-tests, anomaly fraud detection, and explainable dispatch matching algorithms.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('digital_twin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'digital_twin' ? 'bg-gold text-navy-950 shadow-md' : 'bg-navy-800 text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'التوأم الرقمي (Digital Twin)' : 'Digital Twin'}
          </button>
          <button
            onClick={() => setActiveTab('anomaly_detection')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'anomaly_detection' ? 'bg-gold text-navy-950 shadow-md' : 'bg-navy-800 text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'كشف الاحتيال والشذوذ' : 'Anomaly Radar'} ({anomalyAlerts.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Digital Twin Sandbox Simulator */}
      {activeTab === 'digital_twin' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Scenarios Palette (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl bg-navy-900/90 border border-gold/20 p-5 shadow-xl space-y-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-gold/15">
                <Sliders className="w-4 h-4 text-gold" />
                <span>Pre-Configured Scenarios</span>
              </h3>

              <div className="space-y-2">
                {digitalTwinScenarios.map((scen) => (
                  <button
                    key={scen.id}
                    onClick={() => setSelectedScenario(scen)}
                    className={`w-full p-3.5 rounded-xl text-start transition-all cursor-pointer border ${
                      selectedScenario.id === scen.id
                        ? 'bg-navy-950 border-gold shadow-lg'
                        : 'bg-navy-950/60 border-navy-800 hover:bg-navy-800 text-gray-300'
                    }`}
                  >
                    <div className="font-bold text-white text-xs">
                      {lang === 'ar' ? scen.titleAr : scen.titleEn}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">
                      {scen.parameterChanged}: <span className="text-gold font-mono">{scen.parameterValue}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Dynamic Slider Sandbox */}
              <div className="pt-3 border-t border-navy-800 space-y-2">
                <label className="text-xs text-gray-300 flex justify-between">
                  <span>Custom Demand Delta:</span>
                  <span className="text-gold font-mono font-bold">+{customDemandMultiplier}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customDemandMultiplier}
                  onChange={(e) => setCustomDemandMultiplier(Number(e.target.value))}
                  className="w-full accent-gold cursor-pointer"
                />
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isSimulating ? 'animate-spin' : 'animate-bounce'}`} />
                <span>{isSimulating ? 'Computing Digital Twin Model...' : t.runSimulation}</span>
              </button>
            </div>

            {/* Simulation Results Visualization (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl bg-navy-900/90 border border-gold/25 p-5 shadow-xl space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-gold/15">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 uppercase font-bold">
                    Simulation Forecast
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {lang === 'ar' ? selectedScenario.titleAr : selectedScenario.titleEn}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {lang === 'ar' ? selectedScenario.descriptionAr : selectedScenario.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Simulated Impact Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-navy-950 border border-gold/20 text-center">
                  <span className="text-xs text-gray-400 block mb-1">Simulated Fleet Utilization</span>
                  <span className="text-2xl font-bold font-mono text-white">{selectedScenario.simulatedFleetUtilization}%</span>
                  <span className="text-[10px] text-emerald-400 block mt-1">+12.4% capacity stress</span>
                </div>

                <div className="p-4 rounded-2xl bg-navy-950 border border-emerald-500/30 text-center">
                  <span className="text-xs text-emerald-300 block mb-1">Empty KM Projection</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400">{selectedScenario.simulatedEmptyKmPercent}%</span>
                  <span className="text-[10px] text-emerald-300 block mt-1">High backhaul efficiency</span>
                </div>

                <div className="p-4 rounded-2xl bg-navy-950 border border-gold/20 text-center">
                  <span className="text-xs text-gold block mb-1">Net Margin Shift</span>
                  <span className="text-xl font-bold font-mono text-gold">{selectedScenario.simulatedProfitMarginChange}</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Direct EBIT Impact</span>
                </div>
              </div>

              {/* AI Strategic Recommendation Action Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-navy-950 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Autonomous AI Strategic Prescription</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed">
                  {lang === 'ar' ? selectedScenario.recommendationAr : selectedScenario.recommendationEn}
                </p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => alert('Applying automated fleet reallocation protocol across corridors')}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:brightness-110 text-navy-950 text-xs font-bold cursor-pointer"
                  >
                    Execute Fleet Reallocation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Anomaly & Fraud Detection */}
      {activeTab === 'anomaly_detection' && (
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gold/15">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Real-Time Anomaly & Telemetry Fraud Detector</span>
            </h3>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
              {anomalyAlerts.length} Flagged Events
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anomalyAlerts.map((anom) => (
              <div key={anom.id} className="p-4 rounded-2xl bg-navy-950 border border-rose-500/40 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 uppercase font-bold">
                      {anom.type}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1.5">
                      {lang === 'ar' ? anom.titleAr : anom.titleEn}
                    </h4>
                    <p className="text-xs text-gray-400">
                      Asset: <span className="font-mono text-gold font-bold">{anom.assetPlate}</span> ({anom.driverName})
                    </p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-rose-900/60 text-rose-200 text-[10px] font-mono font-bold">
                    {anom.confidenceScore}% Confidence
                  </span>
                </div>

                <p className="text-xs text-gray-300 bg-navy-900/80 p-2.5 rounded-xl border border-navy-800">
                  {lang === 'ar' ? anom.explanationAr : anom.explanationEn}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-gray-500">{anom.location} • {anom.detectedAt}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Clearing false alarm for ${anom.assetPlate}`)}
                      className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-gray-300 text-[10px] font-bold"
                    >
                      Clear Alarm
                    </button>
                    <button
                      onClick={() => alert(`Escalating security audit for ${anom.assetPlate}`)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500 hover:brightness-110 text-white text-[10px] font-bold"
                    >
                      Escalate Audit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
