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
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'مركز الذكاء الاصطناعي والتوأم الرقمي (Sudaneel AI & Digital Twin)' : 'AI Center & Digital Twin Simulation Lab'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] max-w-2xl mt-1">
            {lang === 'ar'
              ? 'محاكاة سيناريوهات الأسطول التشغيلية (ماذا لو زاد الطلب 30%؟)، كشف التلاعب بالوقود وGPS، وتفسير قرارات التوزيع الذكي.'
              : 'Execute fleet stress-tests, anomaly fraud detection, and explainable dispatch matching algorithms.'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('digital_twin')}
            className={`px-3.5 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'digital_twin' ? 'bg-[#171A20] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4]'
            }`}
          >
            {lang === 'ar' ? 'التوأم الرقمي (Digital Twin)' : 'Digital Twin'}
          </button>
          <button
            onClick={() => setActiveTab('anomaly_detection')}
            className={`px-3.5 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'anomaly_detection' ? 'bg-[#3E6AE1] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4]'
            }`}
          >
            {lang === 'ar' ? 'كشف الاحتيال والشذوذ' : 'Anomaly Radar'} ({anomalyAlerts.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Digital Twin Sandbox Simulator */}
      {activeTab === 'digital_twin' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Scenarios Palette (4 cols) */}
            <div className="lg:col-span-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
              <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
                <Sliders className="w-4 h-4 text-[#3E6AE1]" />
                <span>Pre-Configured Scenarios</span>
              </h3>

              <div className="space-y-2">
                {digitalTwinScenarios.map((scen) => (
                  <button
                    key={scen.id}
                    onClick={() => setSelectedScenario(scen)}
                    className={`w-full p-4 rounded-[4px] text-start transition-colors duration-330 cursor-pointer border ${
                      selectedScenario.id === scen.id
                        ? 'bg-[#F4F4F4] border-[#171A20]'
                        : 'bg-[#FFFFFF] border-[#EEEEEE] hover:bg-[#F4F4F4]'
                    }`}
                  >
                    <div className="font-[500] text-[#171A20] text-[13px]">
                      {lang === 'ar' ? scen.titleAr : scen.titleEn}
                    </div>
                    <div className="text-[11px] text-[#5C5E62] mt-1">
                      {scen.parameterChanged}: <span className="text-[#3E6AE1] font-mono font-[500]">{scen.parameterValue}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Dynamic Slider Sandbox */}
              <div className="pt-3 border-t border-[#EEEEEE] space-y-2">
                <label className="text-[12px] text-[#5C5E62] flex justify-between">
                  <span>Custom Demand Delta:</span>
                  <span className="text-[#3E6AE1] font-mono font-[500]">+{customDemandMultiplier}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={customDemandMultiplier}
                  onChange={(e) => setCustomDemandMultiplier(Number(e.target.value))}
                  className="w-full accent-[#3E6AE1] cursor-pointer"
                />
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="btn-tesla-primary w-full !min-h-[38px] text-[13px] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSimulating ? 'Computing Digital Twin Model...' : t.runSimulation}</span>
              </button>
            </div>

            {/* Simulation Results Visualization (8 cols) */}
            <div className="lg:col-span-8 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-6 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-[#EEEEEE]">
                <div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] uppercase font-[500]">
                    Simulation Forecast
                  </span>
                  <h3 className="text-[18px] font-[500] text-[#171A20] mt-1">
                    {lang === 'ar' ? selectedScenario.titleAr : selectedScenario.titleEn}
                  </h3>
                  <p className="text-[13px] text-[#5C5E62]">
                    {lang === 'ar' ? selectedScenario.descriptionAr : selectedScenario.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Simulated Impact Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-center">
                  <span className="text-[11px] text-[#8E8E8E] block mb-1">Simulated Utilization</span>
                  <span className="text-[24px] font-[500] font-mono text-[#171A20]">{selectedScenario.simulatedFleetUtilization}%</span>
                  <span className="text-[11px] text-[#3E6AE1] block mt-1">+12.4% capacity stress</span>
                </div>

                <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-center">
                  <span className="text-[11px] text-[#8E8E8E] block mb-1">Empty KM Projection</span>
                  <span className="text-[24px] font-[500] font-mono text-[#3E6AE1]">{selectedScenario.simulatedEmptyKmPercent}%</span>
                  <span className="text-[11px] text-[#5C5E62] block mt-1">High backhaul match</span>
                </div>

                <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-center">
                  <span className="text-[11px] text-[#8E8E8E] block mb-1">Net Margin Shift</span>
                  <span className="text-[24px] font-[500] font-mono text-[#171A20]">{selectedScenario.simulatedProfitMarginChange}</span>
                  <span className="text-[11px] text-[#8E8E8E] block mt-1">Direct EBIT Impact</span>
                </div>
              </div>

              {/* Strategic Recommendation Action Box */}
              <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2">
                <div className="flex items-center gap-2 text-[12px] font-[500] text-[#171A20]">
                  <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" />
                  <span>Autonomous AI Strategic Prescription</span>
                </div>
                <p className="text-[13px] text-[#5C5E62] leading-relaxed">
                  {lang === 'ar' ? selectedScenario.recommendationAr : selectedScenario.recommendationEn}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => alert('Applying automated fleet reallocation protocol across corridors')}
                    className="btn-tesla-primary !min-h-[34px] !py-1 !px-4 text-[12px]"
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
        <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[15px] text-[#171A20] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#3E6AE1]" />
              <span>Real-Time Anomaly & Telemetry Fraud Detector</span>
            </h3>
            <span className="px-3 py-1 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] text-[12px] font-mono font-[500]">
              {anomalyAlerts.length} Flagged Events
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {anomalyAlerts.map((anom) => (
              <div key={anom.id} className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-white text-[#171A20] border border-[#D0D1D2] uppercase font-[500]">
                      {anom.type}
                    </span>
                    <h4 className="text-[14px] font-[500] text-[#171A20] mt-1.5">
                      {lang === 'ar' ? anom.titleAr : anom.titleEn}
                    </h4>
                    <p className="text-[12px] text-[#5C5E62]">
                      Asset: <span className="font-mono text-[#3E6AE1] font-[500]">{anom.assetPlate}</span> ({anom.driverName})
                    </p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-[2px] bg-white text-[#171A20] border border-[#D0D1D2] text-[11px] font-mono font-[500]">
                    {anom.confidenceScore}% Conf.
                  </span>
                </div>

                <p className="text-[12px] text-[#5C5E62] bg-white p-2.5 rounded-[2px] border border-[#EEEEEE]">
                  {lang === 'ar' ? anom.explanationAr : anom.explanationEn}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-[#8E8E8E]">{anom.location} • {anom.detectedAt}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Clearing false alarm for ${anom.assetPlate}`)}
                      className="btn-tesla-secondary !min-h-[30px] !py-0.5 !px-3 text-[11px]"
                    >
                      Clear Alarm
                    </button>
                    <button
                      onClick={() => alert(`Escalating security audit for ${anom.assetPlate}`)}
                      className="btn-tesla-primary !min-h-[30px] !py-0.5 !px-3 text-[11px]"
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
