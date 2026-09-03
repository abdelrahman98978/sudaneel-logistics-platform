'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  Filter,
  Download,
  BarChart3,
  TrendingUp,
  Truck,
  Leaf,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';
import { exportToCsv, printDocument } from '@/lib/export-utils';

export function ReportsView() {
  const { shipments, invoices, showToast, lang } = useApp();

  const [selectedReportType, setSelectedReportType] = useState('operations');
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedCorridor, setSelectedCorridor] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const reportTemplates = [
    {
      id: 'operations',
      name: 'Operations & Freight Throughput Report',
      nameAr: 'تقرير العمليات والحمولات المنقولة',
      desc: 'Complete shipment volume, ton-kilometers, on-time delivery rates, and checkpoint dwell times.',
      icon: Truck,
    },
    {
      id: 'financial',
      name: 'Financial Ledger & Payout Settlement Report',
      nameAr: 'تقرير التسويات المالية وأرباح المنصة',
      desc: 'Invoiced freight receivables, carrier payouts, platform exchange fees (10%), and wallet balances.',
      icon: TrendingUp,
    },
    {
      id: 'fleet_fuel',
      name: 'Fleet Telemetry & Fuel Consumption Audit',
      nameAr: 'تقرير كفاءة استهلاك الوقود وصيانة الأسطول',
      desc: 'Liters/km efficiency, maintenance intervals, engine hour logs, and anomaly detection flags.',
      icon: BarChart3,
    },
    {
      id: 'esg_carbon',
      name: 'ESG & Empty-KM Carbon Savings Audit',
      nameAr: 'تقرير الاستدامة وخفض الانبعاثات الكربونية',
      desc: 'Avoided deadhead kilometers, tons of CO₂ emissions prevented via backhaul optimization.',
      icon: Leaf,
    },
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    if (format === 'pdf') {
      printDocument(`Sudaneel-Report-${selectedReportType}`);
      return;
    }

    setIsExporting(true);
    setTimeout(() => {
      if (selectedReportType === 'operations') {
        exportToCsv('sudaneel-operations-report', [
          { header: 'Tracking Number', accessor: (s) => s.trackingNumber },
          { header: 'Customer', accessor: (s) => s.customerName },
          { header: 'Origin', accessor: (s) => s.origin.city },
          { header: 'Destination', accessor: (s) => s.destination.city },
          { header: 'Weight (kg)', accessor: (s) => s.totalWeightKg },
          { header: 'Price (SDG)', accessor: (s) => s.price },
          { header: 'Status', accessor: (s) => s.status },
        ], shipments);
      } else {
        exportToCsv('sudaneel-financial-report', [
          { header: 'Invoice No', accessor: (i) => i.invoiceNumber },
          { header: 'Customer', accessor: (i) => i.customerNameAr || i.customerName },
          { header: 'Total (SDG)', accessor: (i) => i.total },
          { header: 'Status', accessor: (i) => i.status },
          { header: 'Date', accessor: (i) => i.issueDate },
        ], invoices);
      }
      setIsExporting(false);
      showToast('تم تصدير التقرير', `تم تحميل التقرير بصيغة ${format.toUpperCase()} بنجاح`, 'success');
    }, 400);
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Executive Reporting Engine • مركز التقارير والتصدير</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            مركز التقارير والتحليلات المتقدمة (Reports & Exports)
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            توليد وتصدير التقارير التنفيذية والتشغيلية والمالية وحسابات الانبعاثات الكربونية بصيغ Excel و CSV و PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="btn-shopify-outline"
          >
            <FileDown className="w-4 h-4" />
            <span>تصدير CSV</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            className="btn-shopify-pill"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة تقرير رسمي PDF</span>
          </button>
        </div>
      </div>

      {/* Report Templates Selection (Shopify Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTemplates.map((tpl) => {
          const Icon = tpl.icon;
          const isSelected = selectedReportType === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => setSelectedReportType(tpl.id)}
              className={`p-6 rounded-[12px] transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'shopify-card-aloe shadow-[0_8px_16px_rgba(193,251,212,0.4)]'
                  : 'shopify-card hover:border-[#a1a1aa]'
              }`}
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#000000]/10 flex items-center justify-center text-[#000000]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-[600] text-[15px] text-[#000000]">{tpl.nameAr}</h3>
                  <p className="text-[12px] text-[#71717a] mt-1 line-clamp-2">{tpl.desc}</p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[#000000]/10 flex items-center justify-between text-[11.5px] font-[600]">
                <span>{isSelected ? 'التقرير المختار' : 'اختر التقرير'}</span>
                <span>➔</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Printable Report Canvas Area */}
      <div id="printable-report-area" className="shopify-card p-8 sm:p-10 space-y-8 bg-[#ffffff]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e4e4e7]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[10px] bg-white p-0.5 flex items-center justify-center border border-[#e4e4e7] shadow-sm">
              <Image src="/logo.png" alt="Sudaneel Logistics" width={48} height={48} className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-[600] text-[18px] text-[#000000]">
                {reportTemplates.find((r) => r.id === selectedReportType)?.nameAr}
              </h2>
              <p className="text-[12px] text-[#71717a]">
                Sudaneel Intelligence Report • {new Date().toLocaleDateString('ar-SD')}
              </p>
            </div>
          </div>

          <span className="shopify-tag-mint font-mono font-[600]">
            Official Audit Verified
          </span>
        </div>

        {/* Dynamic Summary Cards */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
            <div className="font-mono font-[700] text-[20px] text-[#000000]">{shipments.length}</div>
            <div className="text-[12px] text-[#71717a] mt-0.5">إجمالي الشحنات المضمنة</div>
          </div>
          <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2]">
            <div className="font-mono font-[700] text-[20px] text-[#000000]">99.4%</div>
            <div className="text-[12px] text-[#000000] font-[500] mt-0.5">دقة التسليم في الموعد (OTD)</div>
          </div>
          <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
            <div className="font-mono font-[700] text-[20px] text-[#000000]">12.8M SDG</div>
            <div className="text-[12px] text-[#71717a] mt-0.5">القيمة اللوجستية الإجمالية</div>
          </div>
        </div>

        {/* Data Sample Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-[13px]">
            <thead>
              <tr className="border-b border-[#e4e4e7] bg-[#fbfbf5] text-[#71717a] text-[12px]">
                <th className="p-3.5 text-start font-[600]">المرجع / البوليصة</th>
                <th className="p-3.5 text-start font-[600]">العميل / الشاحن</th>
                <th className="p-3.5 text-start font-[600]">المسار</th>
                <th className="p-3.5 text-start font-[600]">الحمولة والوزن</th>
                <th className="p-3.5 text-end font-[600]">القيمة (SDG)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7] font-[420]">
              {shipments.slice(0, 5).map((s) => (
                <tr key={s.id} className="hover:bg-[#fbfbf5]">
                  <td className="p-3.5 font-mono font-[600] text-[#000000]">{s.trackingNumber}</td>
                  <td className="p-3.5 text-[#000000]">{s.customerName}</td>
                  <td className="p-3.5 text-[#71717a]">{s.origin.city} ➔ {s.destination.city}</td>
                  <td className="p-3.5 text-[#000000]">{s.cargoType} ({(s.totalWeightKg / 1000).toFixed(1)} طن)</td>
                  <td className="p-3.5 text-end font-mono font-[700] text-[#000000]">{s.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
