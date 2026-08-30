'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  FileText,
  Building2,
  TrendingUp,
  Award,
  Target,
} from 'lucide-react';

export function ContractsCrmView() {
  const { contracts, crmOpportunities, lang } = useApp();

  const [activeTab, setActiveTab] = useState<'contracts' | 'crm_pipeline'>('contracts');

  const totalCommittedSpend = contracts.reduce((acc, c) => acc + c.committedMonthlySpend, 0);
  const totalPipelineValue = crmOpportunities.reduce((acc, o) => acc + o.estimatedAnnualValue, 0);

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'العقود المؤسسية وإدارة علاقات العملاء (Enterprise Contracts & CRM)' : 'Enterprise Contracts & CRM Sales Pipeline'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] max-w-2xl mt-1">
            {lang === 'ar'
              ? 'إدارة عقود كبار العملاء (DAL, Kenana, NMSF)، مراقبة مؤشرات الالتزام بالـ SLA، ومتابعة فرص المبيعات اللوجستية.'
              : 'Corporate SLA rate agreements, volume commitment tiers, automated renewals, and sales opportunities.'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-3.5 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'contracts' ? 'bg-[#171A20] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4]'
            }`}
          >
            {lang === 'ar' ? 'العقود المؤسسية' : 'Enterprise Contracts'} ({contracts.length})
          </button>
          <button
            onClick={() => setActiveTab('crm_pipeline')}
            className={`px-3.5 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'crm_pipeline' ? 'bg-[#3E6AE1] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4]'
            }`}
          >
            {lang === 'ar' ? 'فرص المبيعات (CRM)' : 'Sales Pipeline'} ({crmOpportunities.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Monthly Spend</span>
            <Building2 className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">
            {(totalCommittedSpend / 1000000).toFixed(1)}M <span className="text-[12px] text-[#3E6AE1]">SDG</span>
          </div>
          <div className="text-[11px] text-[#3E6AE1] mt-1">100% Contract Secured</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>SLA Compliance</span>
            <Award className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">98.7%</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Target Threshold: 98.0%</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Pipeline Value</span>
            <TrendingUp className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">
            {(totalPipelineValue / 1000000).toFixed(1)}M <span className="text-[12px]">SDG</span>
          </div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Weighted Win 78%</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Avg Volume Discount</span>
            <Target className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#3E6AE1]">10.25%</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Tier 1 & 2 Incentive Rate</div>
        </div>
      </div>

      {/* Tab 1: Enterprise Contracts */}
      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((cntrct) => (
            <div key={cntrct.id} className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] uppercase font-[500]">
                    {cntrct.contractNumber}
                  </span>
                  <h3 className="text-[16px] font-[500] text-[#171A20] mt-1">
                    {lang === 'ar' ? cntrct.customerNameAr : cntrct.customerName}
                  </h3>
                  <p className="text-[13px] text-[#5C5E62]">{cntrct.volumeTier}</p>
                </div>

                <span className="px-2.5 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] text-[11px] font-[500]">
                  {cntrct.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-[12px] text-center">
                <div className="p-3 rounded-[2px] bg-[#F4F4F4] border border-[#EEEEEE]">
                  <span className="text-[10px] text-[#8E8E8E] block">Monthly Spend</span>
                  <span className="font-[500] text-[#171A20] font-mono">{(cntrct.committedMonthlySpend / 1000000).toFixed(1)}M SDG</span>
                </div>
                <div className="p-3 rounded-[2px] bg-[#F4F4F4] border border-[#EEEEEE]">
                  <span className="text-[10px] text-[#8E8E8E] block">SLA Target</span>
                  <span className="font-[500] text-[#171A20] font-mono">{cntrct.slaOnTimeTarget}%</span>
                </div>
                <div className="p-3 rounded-[2px] bg-[#F4F4F4] border border-[#EEEEEE]">
                  <span className="text-[10px] text-[#3E6AE1] block">Actual SLA</span>
                  <span className="font-[500] text-[#3E6AE1] font-mono">{cntrct.currentSlaAchievement}%</span>
                </div>
              </div>

              {/* Designated Corridors */}
              <div className="space-y-1.5 text-[12px]">
                <span className="text-[#8E8E8E] text-[11px] block">Designated Corridors:</span>
                <div className="flex flex-wrap gap-1.5">
                  {cntrct.designatedCorridors.map((corr, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] border border-[#EEEEEE] text-[#5C5E62] text-[11px]">
                      {corr}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#5C5E62] pt-2 border-t border-[#EEEEEE]">
                <span>Validity: {cntrct.startDate} ➔ {cntrct.endDate}</span>
                <span className="font-[500] text-[#171A20]">Discount: {cntrct.discountRatePercent}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Sales Pipeline (CRM) */}
      {activeTab === 'crm_pipeline' && (
        <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[15px] text-[#171A20] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3E6AE1]" />
              <span>Logistics Sales Opportunities & Leads</span>
            </h3>

            <button
              onClick={() => alert('Opening New Lead Form')}
              className="btn-tesla-primary !min-h-[34px] !py-1 !px-3 text-[12px]"
            >
              + Add Lead
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-start">
              <thead>
                <tr className="border-b border-[#EEEEEE] text-[#5C5E62] font-[500] text-[11px] uppercase bg-[#F4F4F4]">
                  <th className="p-3 text-start">Opportunity & Client</th>
                  <th className="p-3 text-start">Stage</th>
                  <th className="p-3 text-start">Volume (Tons)</th>
                  <th className="p-3 text-start">Estimated Value</th>
                  <th className="p-3 text-start">Primary Corridor</th>
                  <th className="p-3 text-start">Sales Rep</th>
                  <th className="p-3 text-end">Win Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE]">
                {crmOpportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-[#F4F4F4] transition-colors duration-330">
                    <td className="p-3 font-[500] text-[#171A20]">
                      <div>{opp.clientName}</div>
                      <div className="text-[11px] font-mono text-[#3E6AE1]">{opp.opportunityCode}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] text-[11px] font-[500] uppercase font-mono">
                        {opp.stage}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-[500] text-[#171A20]">{opp.expectedVolumeTons.toLocaleString()} T</td>
                    <td className="p-3 font-mono text-[#3E6AE1] font-[500]">
                      {(opp.estimatedAnnualValue / 1000000).toFixed(1)}M SDG
                    </td>
                    <td className="p-3 text-[#5C5E62]">{opp.primaryCorridor}</td>
                    <td className="p-3 text-[#8E8E8E]">{opp.assignedSalesRep}</td>
                    <td className="p-3 text-end font-mono font-[500] text-[#171A20]">
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
