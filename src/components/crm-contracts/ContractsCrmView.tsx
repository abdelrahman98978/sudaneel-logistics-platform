'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { EnterpriseContract, CrmOpportunity } from '@/types';
import {
  FileText,
  Building2,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertTriangle,
  PlusCircle,
  Users,
  Target,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function ContractsCrmView() {
  const { contracts, crmOpportunities, t, lang } = useApp();

  const [activeTab, setActiveTab] = useState<'contracts' | 'crm_pipeline'>('contracts');

  const totalCommittedSpend = contracts.reduce((acc, c) => acc + c.committedMonthlySpend, 0);
  const totalPipelineValue = crmOpportunities.reduce((acc, o) => acc + o.estimatedAnnualValue, 0);

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'العقود المؤسسية وإدارة علاقات العملاء (Enterprise Contracts & CRM)' : 'Enterprise Contracts & CRM Sales Pipeline'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            {lang === 'ar'
              ? 'إدارة عقود كبار العملاء (DAL, Kenana, NMSF)، مراقبة مؤشرات الالتزام بالـ SLA، ومتابعة فرص المبيعات اللوجستية.'
              : 'Corporate SLA rate agreements, volume commitment tiers, automated renewals, and logistics sales opportunities.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'contracts' ? 'bg-gold text-navy-950 shadow-md' : 'bg-navy-800 text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'العقود المؤسسية' : 'Enterprise Contracts'} ({contracts.length})
          </button>
          <button
            onClick={() => setActiveTab('crm_pipeline')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'crm_pipeline' ? 'bg-gold text-navy-950 shadow-md' : 'bg-navy-800 text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'فرص المبيعات (CRM)' : 'Sales Pipeline'} ({crmOpportunities.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Committed Monthly Spend</span>
            <Building2 className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {(totalCommittedSpend / 1000000).toFixed(1)}M <span className="text-xs text-gold">SDG</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">100% Contract Secured</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-emerald-500/30 shadow-lg">
          <div className="text-xs text-emerald-300 flex items-center justify-between mb-1">
            <span>SLA Delivery Compliance</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">98.7%</div>
          <div className="text-[10px] text-emerald-300 mt-1">Target Threshold: 98.0%</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-sky-500/30 shadow-lg">
          <div className="text-xs text-sky-300 flex items-center justify-between mb-1">
            <span>Active Pipeline Value</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-sky-400">
            {(totalPipelineValue / 1000000).toFixed(1)}M <span className="text-xs">SDG</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Weighted Probability 78%</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Avg Volume Discount</span>
            <Target className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl font-bold font-mono text-gold">10.25%</div>
          <div className="text-[10px] text-gray-400 mt-1">Tier 1 & 2 Incentive Rate</div>
        </div>
      </div>

      {/* Tab 1: Enterprise Contracts */}
      {activeTab === 'contracts' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.map((cntrct) => (
              <div key={cntrct.id} className="p-5 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 uppercase font-bold">
                      {cntrct.contractNumber}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {lang === 'ar' ? cntrct.customerNameAr : cntrct.customerName}
                    </h3>
                    <p className="text-xs text-gray-400">{cntrct.volumeTier}</p>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold">
                    {cntrct.status}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <span className="text-[10px] text-gray-400 block">Monthly Spend</span>
                    <span className="font-bold text-gold font-mono">{(cntrct.committedMonthlySpend / 1000000).toFixed(1)}M SDG</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <span className="text-[10px] text-gray-400 block">SLA Target</span>
                    <span className="font-bold text-white font-mono">{cntrct.slaOnTimeTarget}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
                    <span className="text-[10px] text-emerald-400 block">Actual SLA</span>
                    <span className="font-bold text-emerald-300 font-mono">{cntrct.currentSlaAchievement}%</span>
                  </div>
                </div>

                {/* Designated Corridors */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-gray-400 text-[11px] block">Designated Freight Corridors:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cntrct.designatedCorridors.map((corr, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-navy-950 border border-gold/15 text-gray-300 text-[11px]">
                        {corr}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-navy-800">
                  <span>Validity: {cntrct.startDate} ➔ {cntrct.endDate}</span>
                  <span className="font-semibold text-gold">Discount: {cntrct.discountRatePercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Sales Pipeline (CRM) */}
      {activeTab === 'crm_pipeline' && (
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gold/15">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              <span>Logistics Sales Opportunities & Leads</span>
            </h3>

            <button
              onClick={() => alert('Opening New Lead Form')}
              className="px-3.5 py-1.5 rounded-xl bg-gold text-navy-950 font-bold text-xs hover:brightness-110 shadow-lg cursor-pointer"
            >
              + Add Lead
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-navy-800 text-gray-400 font-semibold text-[11px]">
                  <th className="pb-3 text-start">Opportunity & Client</th>
                  <th className="pb-3 text-start">Stage</th>
                  <th className="pb-3 text-start">Annual Volume (Tons)</th>
                  <th className="pb-3 text-start">Estimated Value</th>
                  <th className="pb-3 text-start">Primary Corridor</th>
                  <th className="pb-3 text-start">Sales Rep</th>
                  <th className="pb-3 text-end">Win Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {crmOpportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="py-3 font-semibold text-white">
                      <div>{opp.clientName}</div>
                      <div className="text-[10px] font-mono text-gold">{opp.opportunityCode}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-semibold uppercase font-mono">
                        {opp.stage}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-white">{opp.expectedVolumeTons.toLocaleString()} T</td>
                    <td className="py-3 font-mono text-gold font-bold">
                      {(opp.estimatedAnnualValue / 1000000).toFixed(1)}M SDG
                    </td>
                    <td className="py-3 text-gray-300">{opp.primaryCorridor}</td>
                    <td className="py-3 text-gray-400">{opp.assignedSalesRep}</td>
                    <td className="py-3 text-end font-mono font-bold text-emerald-400">
                      {opp.probabilityPercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
