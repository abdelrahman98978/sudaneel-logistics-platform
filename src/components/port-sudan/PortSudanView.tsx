'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import { PortContainer, PortCustomsStatus } from '@/types';
import {
  Anchor,
  Container,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Search,
  DollarSign,
  ShieldCheck,
  ArrowUpRight,
  FileText,
  FileCheck2,
  X,
  Zap,
} from 'lucide-react';

export function PortSudanView() {
  const { portContainers, updateContainerStatus, showToast, lang, setCurrentView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContainer, setSelectedContainer] = useState<PortContainer | null>(portContainers[0] || null);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  const filteredContainers = portContainers.filter((c) => {
    if (statusFilter !== 'all' && c.customsStatus !== statusFilter) return false;
    if (
      searchQuery &&
      !c.containerNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.consignee.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalDemurrage = portContainers.reduce((acc, c) => acc + c.demurrageAccruedUSD, 0);
  const demurrageRiskCount = portContainers.filter((c) => c.freeDaysRemaining <= 1).length;

  const handleUpdateCustoms = (containerId: string, status: PortCustomsStatus) => {
    updateContainerStatus(containerId, status);
    showToast(
      lang === 'ar' ? 'تم اعتماد الإجراء الجمركي' : 'Customs Status Updated',
      lang === 'ar'
        ? `تم تحديث حالة الحاوية الجمركية إلى: ${status} وإصدار إذن التسليم DO`
        : `Customs clearance status updated to: ${status}`,
      'success'
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="shopify-tag-mint">
            <Anchor className="w-4 h-4" />
            <span>Port Sudan Terminal & Customs • محطة ميناء بورتسودان والتخليص الجمركي</span>
          </div>
          <h1 className="text-[26px] font-[600] text-[#000000] tracking-tight">
            عمليات ميناء بورتسودان والجمارك
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            مراقبة الحاويات الواردة والصادرة، عداد أيام السماح وتفادي غرامات الأرضيات (Demurrage)، وتخصيص شاحنات النقل الفوري نحو الولايات.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('smart_dispatch')}
            className="btn-shopify-pill"
          >
            <Truck className="w-4 h-4" />
            <span>تخصيص شاحنات فورية</span>
          </button>
        </div>
      </div>

      {/* Port Sudan Container Terminal Visual Showcase (Shopify 20px Card) */}
      <div className="shopify-card overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 bg-[#ffffff]">
        <div className="md:col-span-5 relative min-h-[220px] bg-[#000000]">
          <Image
            src="/images/port-sudan-terminal-v2.png"
            alt="Port Sudan Maritime Container Terminal"
            width={520}
            height={260}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 start-4">
            <span className="shopify-tag-mint !text-[10px]">
              South Container Terminal (SCT)
            </span>
          </div>
        </div>

        <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="shopify-tag-pistachio !text-[11px]">
              Red Sea Logistics Gateway • بوابة البحر الأحمر اللوجستية
            </div>
            <h3 className="text-[20px] font-[600] text-[#000000] tracking-tight">
              أرصفة الحاويات الجنوبية والمنطقة الحرة ومحطة الفحص الجمركي بالأشعة السينية
            </h3>
            <p className="text-[14px] text-[#71717a] leading-relaxed">
              ربط إلكتروني مباشر مع هيئة الموانئ البحرية والجمارك السودانية لتسريع الإفراج الجمركي وتقليل غرامات التأخير وتأمين حمولات الصادر والوارد.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#e4e4e7] text-center">
            <div className="p-2.5 rounded-[8px] bg-[#fbfbf5]">
              <div className="font-mono text-[16px] font-[700] text-[#000000]">{portContainers.length}</div>
              <div className="text-[11px] text-[#71717a]">حاويات تحت المتابعة</div>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#c1fbd4]">
              <div className="font-mono text-[16px] font-[700] text-[#000000]">${totalDemurrage.toLocaleString()}</div>
              <div className="text-[11px] text-[#000000] font-[500]">غرامات أرضيات متراكمة</div>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#fbfbf5]">
              <div className="font-mono text-[16px] font-[700] text-[#000000]">{demurrageRiskCount}</div>
              <div className="text-[11px] text-[#71717a]">حاويات معرضة للغرامة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="shopify-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#ffffff]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الحاوية أو المستورد..."
            className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-full ps-10 pe-4 py-2 text-[13.5px] outline-none text-[#000000] placeholder-[#71717a] focus:border-[#000000]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          {['all', 'manifest_received', 'under_inspection', 'duty_assessed', 'cleared', 'released'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-[600] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#000000] text-[#c1fbd4] shadow-sm'
                  : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
              }`}
            >
              {st === 'all' && (lang === 'ar' ? 'الكل' : 'All')}
              {st === 'manifest_received' && 'استلام المنافست'}
              {st === 'under_inspection' && 'فحص أشعة سريعة'}
              {st === 'duty_assessed' && 'تقييم الرسوم'}
              {st === 'cleared' && 'مخلصة جاهزة'}
              {st === 'released' && 'إفراج وخروج'}
            </button>
          ))}
        </div>
      </div>

      {/* Containers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContainers.map((c) => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedContainer(c);
              setIsDossierModalOpen(true);
            }}
            className={`shopify-card p-6 space-y-4 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              selectedContainer?.id === c.id ? 'border-[#000000] ring-2 ring-[#c1fbd4]' : 'hover:border-[#a1a1aa]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center text-[#000000]">
                    <Container className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-mono font-[700] text-[15px] text-[#000000]">{c.containerNumber}</div>
                    <div className="text-[11px] text-[#71717a] font-mono">{c.isoCode} • {c.shippingLine}</div>
                  </div>
                </div>
                <span className={c.customsStatus === 'cleared' ? 'shopify-tag-mint' : c.customsStatus === 'under_inspection' ? 'shopify-tag-shade' : 'shopify-tag-pistachio'}>
                  {c.customsStatus}
                </span>
              </div>

              <div className="space-y-2 text-[13px] text-[#000000]">
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a]">المستورد / الشاحن:</span>
                  <span className="font-[600]">{c.consignee}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a]">حالة البوابة والساحة:</span>
                  <span className="font-mono font-[600]">{c.gateStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#71717a]">أيام السماح المتبقية:</span>
                  <span className={`font-mono font-[700] ${c.freeDaysRemaining <= 1 ? 'text-[#000000] bg-[#c1fbd4] px-2 py-0.5 rounded-full' : ''}`}>
                    {c.freeDaysRemaining} أيام (غرامة: ${c.demurrageAccruedUSD})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              {c.customsStatus !== 'cleared' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateCustoms(c.id, 'cleared');
                  }}
                  className="flex-1 btn-shopify-pill !py-2 text-[12px] flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#c1fbd4]" />
                  <span>اعتماد التخليص الفوري</span>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentView('smart_dispatch');
                }}
                className="btn-shopify-outline !py-2 !px-3 text-[12px]"
              >
                <span>شاحنة نقل</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Container Customs Dossier Modal */}
      {isDossierModalOpen && selectedContainer && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
              <div>
                <span className="shopify-tag-mint !text-[11px]">Port Customs Dossier</span>
                <h3 className="font-[600] text-[18px] text-[#000000] font-mono mt-1">{selectedContainer.containerNumber}</h3>
              </div>
              <button onClick={() => setIsDossierModalOpen(false)} className="p-1 rounded-full hover:bg-[#fbfbf5] text-[#71717a]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#71717a]">الخط الملاحي:</span>
                <span className="font-[600] text-[#000000]">{selectedContainer.shippingLine} ({selectedContainer.vesselName})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">رقم القفل الجمركي (Seal#):</span>
                <span className="font-mono font-[700] text-[#000000]">{selectedContainer.sealNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">المستورد المعتمد:</span>
                <span className="font-[600] text-[#000000]">{selectedContainer.consignee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">غرامة الأرضيات اليومية:</span>
                <span className="font-mono font-[700] text-[#000000]">${selectedContainer.demurrageRatePerDayUSD} / يوم</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#e4e4e7]">
              <button
                onClick={() => {
                  handleUpdateCustoms(selectedContainer.id, 'cleared');
                  setIsDossierModalOpen(false);
                }}
                className="flex-1 btn-shopify-pill !py-3 text-[13px] flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-[#c1fbd4]" />
                <span>إصدار إذن التسليم DO الفوري</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
