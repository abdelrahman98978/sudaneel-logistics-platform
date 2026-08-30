'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  FileText,
  Building2,
  TrendingUp,
  Award,
  Target,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export function ContractsCrmView() {
  const { contracts, crmOpportunities, showToast, lang } = useApp();

  const [activeTab, setActiveTab] = useState<'contracts' | 'crm_pipeline'>('contracts');

  const totalCommittedSpend = contracts.reduce((acc, c) => acc + c.committedMonthlySpend, 0);
  const totalPipelineValue = crmOpportunities.reduce((acc, o) => acc + o.estimatedAnnualValue, 0);

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="shopify-tag-mint">
            <FileText className="w-4 h-4" />
            <span>Corporate SLAs & Sales Pipeline • العقود المؤسسية وإدارة علاقات العملاء</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            العقود المؤسسية وإدارة علاقات العملاء (CRM)
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            إدارة عقود كبار العملاء (DAL, Kenana, NMSF)، مراقبة مؤشرات الالتزام بالـ SLA، ومتابعة فرص المبيعات اللوجستية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('contracts')}
            className={`px-5 py-2 rounded-full text-[13px] font-[500] transition-all duration-200 cursor-pointer ${
              activeTab === 'contracts'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
            }`}
          >
            العقود المؤسسية ({contracts.length})
          </button>
          <button
            onClick={() => setActiveTab('crm_pipeline')}
            className={`px-5 py-2 rounded-full text-[13px] font-[500] transition-all duration-200 cursor-pointer ${
              activeTab === 'crm_pipeline'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
            }`}
          >
            فرص المبيعات (CRM) ({crmOpportunities.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>العقود النشطة</span>
            <FileText className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{contracts.length} Enterprise</div>
          <div className="text-[11.5px] text-[#71717a]">DAL, Kenana, NMSF</div>
        </div>

        <div className="shopify-card-aloe p-6 space-y-2 shadow-[0_8px_20px_rgba(193,251,212,0.4)]">
          <div className="text-[12px] text-[#000000] font-[600] flex items-center justify-between">
            <span>الالتزام المالي الشهري</span>
            <TrendingUp className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{(totalCommittedSpend / 1000000).toFixed(1)}M SDG</div>
          <div className="text-[11.5px] text-[#000000]/80 font-[500]">إيرادات تعاقدية مضمونة</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>معدل الالتزام بالـ SLA</span>
            <Award className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">99.4%</div>
          <div className="text-[11.5px] text-[#71717a]">تحت مظلة الضمان السيادي</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600] flex items-center justify-between">
            <span>قيمة الفرص قيد التفاوض</span>
            <Target className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{(totalPipelineValue / 1000000).toFixed(1)}M SDG</div>
          <div className="text-[11.5px] text-[#71717a]">4 صفقات مؤسسية جديدة</div>
        </div>
      </div>

      {/* TAB 1: ENTERPRISE CONTRACTS */}
      {activeTab === 'contracts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contracts.map((c) => (
            <div key={c.id} className="shopify-card p-6 space-y-4 hover:border-[#a1a1aa] transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
                  <div>
                    <h3 className="font-[600] text-[15px] text-[#000000]">{c.customerNameAr || c.customerName}</h3>
                    <span className="font-mono text-[11px] text-[#71717a]">{c.contractNumber}</span>
                  </div>
                  <span className="shopify-tag-mint !text-[11px]">{c.status}</span>
                </div>

                <div className="space-y-2 text-[13px] text-[#000000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">مستوى الحجم والخدمة:</span>
                    <span className="font-[600] text-[12px] text-[#000000]">{c.volumeTier}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">الإنفاق الشهري الملتزم به:</span>
                    <span className="font-mono font-[700] text-[#000000]">{c.committedMonthlySpend.toLocaleString()} SDG</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">خصم الحجم (Tier Discount):</span>
                    <span className="font-mono font-[700] text-[#000000] bg-[#c1fbd4] px-2 py-0.5 rounded-full">-{c.discountRatePercent}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => showToast('العقد المؤسسي', `تم فتح ملف العقد ${c.contractNumber} وملحق الـ SLA`, 'info')}
                  className="w-full btn-shopify-outline !py-2 text-[12.5px]"
                >
                  <span>عرض بنود العقد والـ SLA</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: SALES PIPELINE */}
      {activeTab === 'crm_pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crmOpportunities.map((opp) => (
            <div key={opp.id} className="shopify-card p-6 space-y-4 hover:border-[#a1a1aa] transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
                  <div>
                    <h3 className="font-[600] text-[15px] text-[#000000]">{opp.clientName}</h3>
                    <span className="text-[11px] text-[#71717a] font-mono">{opp.opportunityCode}</span>
                  </div>
                  <span className="shopify-tag-pistachio !text-[11px]">{opp.stage}</span>
                </div>

                <div className="space-y-2 text-[13px] text-[#000000]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">القيمة السنوية المتوقعة:</span>
                    <span className="font-mono font-[700] text-[#000000]">{opp.estimatedAnnualValue.toLocaleString()} SDG</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">احتمالية الإغلاق:</span>
                    <span className="font-mono font-[700] text-[#000000]">{opp.probabilityPercent}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#71717a]">المسار المستهدف:</span>
                    <span className="font-[500]">{opp.primaryCorridor}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => showToast('فرصة CRM', `تم فتح ملف التفاوض مع ${opp.clientName}`, 'info')}
                  className="w-full btn-shopify-pill !py-2 text-[12.5px]"
                >
                  <span>متابعة الصفقة والجدول الزمني</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
