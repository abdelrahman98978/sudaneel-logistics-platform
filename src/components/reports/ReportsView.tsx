'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  CheckCircle2,
  Download,
  BarChart3,
  TrendingUp,
  Truck,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

export function ReportsView() {
  const { shipments, invoices, vehicles, t, lang } = useApp();

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
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
              <FileDown className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'مركز التقارير وتصدير البيانات (Reports & Data Export Center)' : 'Executive Reports & Data Export Center'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            {lang === 'ar'
              ? 'إنشاء وتصدير التقارير التشغيلية والمالية وتدقيق انبعاثات الكربون بصيغ PDF وExcel وCSV.'
              : 'Generate and download certified operational, financial, and ESG audit reports with custom date windows.'}
          </p>
        </div>
      </div>

      {/* Grid: Report Config & Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Templates Selection (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-navy-900/90 border border-gold/20 p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-gold/15">
            <Filter className="w-4 h-4 text-gold" />
            <span>Select Report Template</span>
          </h3>

          <div className="space-y-2">
            {reportTemplates.map((tmpl) => {
              const Icon = tmpl.icon;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedReportType(tmpl.id)}
                  className={`w-full p-4 rounded-xl text-start transition-all cursor-pointer border ${
                    selectedReportType === tmpl.id
                      ? 'bg-navy-950 border-gold shadow-lg'
                      : 'bg-navy-950/60 border-navy-800 hover:bg-navy-800 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-gold" />
                    <span className="font-bold text-white text-xs">{lang === 'ar' ? tmpl.nameAr : tmpl.name}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{tmpl.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration & Preview Window (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-navy-900/90 border border-gold/25 p-5 shadow-xl space-y-5">
          <div className="flex items-start justify-between pb-3 border-b border-gold/15">
            <div>
              <h3 className="text-base font-bold text-white">Report Configuration & Live Sample</h3>
              <p className="text-xs text-gray-400">Configure parameters before exporting certified ledger</p>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="px-3.5 py-1.5 rounded-xl bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Time Horizon</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-navy-950 border border-gold/20 text-white p-2 rounded-xl outline-none"
              >
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month (August 2026)</option>
                <option value="last_quarter">Last Quarter (Q2 2026)</option>
                <option value="ytd">Year to Date (2026)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Freight Corridor</label>
              <select
                value={selectedCorridor}
                onChange={(e) => setSelectedCorridor(e.target.value)}
                className="w-full bg-navy-950 border border-gold/20 text-white p-2 rounded-xl outline-none"
              >
                <option value="all">All Corridors (Consolidated)</option>
                <option value="krt_psd">Khartoum ➔ Port Sudan</option>
                <option value="psd_krt">Port Sudan ➔ Khartoum</option>
                <option value="cross_border">Cross-Border (Egypt & Ethiopia)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Audit Stamp</label>
              <div className="p-2 rounded-xl bg-navy-950 border border-navy-800 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Sovereign Verified
              </div>
            </div>
          </div>

          {/* Sample Data Preview Table */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-gray-300 block">Preview Sample Data Records</span>
            <div className="overflow-x-auto rounded-xl border border-navy-800">
              <table className="w-full text-xs text-start bg-navy-950/60">
                <thead>
                  <tr className="border-b border-navy-800 text-gray-400 text-[11px] bg-navy-950">
                    <th className="p-2.5 text-start">Reference #</th>
                    <th className="p-2.5 text-start">Corridor / Asset</th>
                    <th className="p-2.5 text-start">Consignee</th>
                    <th className="p-2.5 text-start">Tonnage</th>
                    <th className="p-2.5 text-start">Revenue (SDG)</th>
                    <th className="p-2.5 text-end">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/60">
                  {shipments.slice(0, 4).map((s) => (
                    <tr key={s.id} className="hover:bg-navy-800/30">
                      <td className="p-2.5 font-mono text-gold font-bold">{s.trackingNumber}</td>
                      <td className="p-2.5 text-gray-300">{s.origin.city} ➔ {s.destination.city}</td>
                      <td className="p-2.5 text-white">{s.customerName}</td>
                      <td className="p-2.5 font-mono">{(s.totalWeightKg / 1000).toFixed(1)} T</td>
                      <td className="p-2.5 font-mono text-emerald-400 font-bold">{s.price.toLocaleString()}</td>
                      <td className="p-2.5 text-end">
                        <span className="px-2 py-0.5 rounded bg-navy-900 border border-gold/20 text-[10px] text-gold font-mono">
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
