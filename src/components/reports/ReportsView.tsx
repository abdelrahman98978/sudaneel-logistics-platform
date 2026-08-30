'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export function ReportsView() {
  const { shipments, lang } = useApp();

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
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(
        lang === 'ar'
          ? `تم إنشاء وتصدير ملف ${format.toUpperCase()} بنجاح لتقرير: ${selectedReportType}`
          : `Exported ${format.toUpperCase()} file successfully for: ${selectedReportType}`
      );
    }, 1000);
  };

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'مركز التقارير وتصدير البيانات (Reports & Data Export Center)' : 'Executive Reports & Data Export Center'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] max-w-2xl mt-1">
            {lang === 'ar'
              ? 'إنشاء وتصدير التقارير التشغيلية والمالية وتدقيق انبعاثات الكربون بصيغ PDF وExcel وCSV.'
              : 'Generate and download certified operational, financial, and ESG audit reports with custom date windows.'}
          </p>
        </div>
      </div>

      {/* Grid: Report Config & Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Templates Selection (4 cols) */}
        <div className="lg:col-span-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
            <Filter className="w-4 h-4 text-[#3E6AE1]" />
            <span>Select Report Template</span>
          </h3>

          <div className="space-y-2">
            {reportTemplates.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedReportType(tmpl.id)}
                  className={`w-full p-4 rounded-[4px] text-start transition-colors duration-330 cursor-pointer border ${
                    selectedReportType === tmpl.id
                      ? 'bg-[#F4F4F4] border-[#171A20]'
                      : 'bg-[#FFFFFF] border-[#EEEEEE] hover:bg-[#F4F4F4]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#3E6AE1]" />
                    <span className="font-[500] text-[#171A20] text-[13px]">{lang === 'ar' ? tmpl.nameAr : tmpl.name}</span>
                  </div>
                  <p className="text-[11px] text-[#5C5E62] mt-1">{tmpl.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration & Preview Window (8 cols) */}
        <div className="lg:col-span-8 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-6 space-y-5">
          <div className="flex items-start justify-between pb-3 border-b border-[#EEEEEE]">
            <div>
              <h3 className="text-[16px] font-[500] text-[#171A20]">Report Configuration & Live Sample</h3>
              <p className="text-[13px] text-[#5C5E62]">Configure parameters before exporting certified ledger</p>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="btn-tesla-secondary !min-h-[34px] !py-1 !px-3 text-[12px] flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#3E6AE1]" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className="btn-tesla-secondary !min-h-[34px] !py-1 !px-3 text-[12px] flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#3E6AE1]" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="btn-tesla-primary !min-h-[34px] !py-1 !px-3 text-[12px] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[13px]">
            <div>
              <label className="text-[#5C5E62] block mb-1">Time Horizon</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-white border border-[#D0D1D2] text-[#171A20] p-2 rounded-[4px] outline-none"
              >
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month (August 2026)</option>
                <option value="last_quarter">Last Quarter (Q2 2026)</option>
                <option value="ytd">Year to Date (2026)</option>
              </select>
            </div>

            <div>
              <label className="text-[#5C5E62] block mb-1">Freight Corridor</label>
              <select
                value={selectedCorridor}
                onChange={(e) => setSelectedCorridor(e.target.value)}
                className="w-full bg-white border border-[#D0D1D2] text-[#171A20] p-2 rounded-[4px] outline-none"
              >
                <option value="all">All Corridors (Consolidated)</option>
                <option value="krt_psd">Khartoum ➔ Port Sudan</option>
                <option value="psd_krt">Port Sudan ➔ Khartoum</option>
                <option value="cross_border">Cross-Border (Egypt & Ethiopia)</option>
              </select>
            </div>

            <div>
              <label className="text-[#5C5E62] block mb-1">Audit Stamp</label>
              <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-[12px] text-[#171A20] font-mono flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#3E6AE1]" /> Sovereign Verified
              </div>
            </div>
          </div>

          {/* Sample Data Preview Table */}
          <div className="space-y-2">
            <span className="text-[13px] font-[500] text-[#171A20] block">Preview Sample Data Records</span>
            <div className="overflow-x-auto rounded-[4px] border border-[#EEEEEE]">
              <table className="w-full text-[13px] text-start">
                <thead>
                  <tr className="border-b border-[#EEEEEE] text-[#5C5E62] text-[11px] uppercase bg-[#F4F4F4]">
                    <th className="p-3 text-start">Reference #</th>
                    <th className="p-3 text-start">Corridor</th>
                    <th className="p-3 text-start">Consignee</th>
                    <th className="p-3 text-start">Tonnage</th>
                    <th className="p-3 text-start">Revenue (SDG)</th>
                    <th className="p-3 text-end">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEEEE]">
                  {shipments.slice(0, 4).map((s) => (
                    <tr key={s.id} className="hover:bg-[#F4F4F4] transition-colors duration-330">
                      <td className="p-3 font-mono text-[#3E6AE1] font-[500]">{s.trackingNumber}</td>
                      <td className="p-3 text-[#5C5E62]">{s.origin.city} ➔ {s.destination.city}</td>
                      <td className="p-3 text-[#171A20]">{s.customerName}</td>
                      <td className="p-3 font-mono">{(s.totalWeightKg / 1000).toFixed(1)} T</td>
                      <td className="p-3 font-mono text-[#171A20] font-[500]">{s.price.toLocaleString()}</td>
                      <td className="p-3 text-end">
                        <span className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] border border-[#D0D1D2] text-[11px] text-[#171A20] font-mono">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
