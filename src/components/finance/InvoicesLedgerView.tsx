'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  DollarSign,
  Download,
  Send,
  Printer,
  FileText,
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface LedgerInvoice {
  id: string;
  client: string;
  shipmentId: string;
  date: string;
  subtotal: number;
  tax: number;
  fees: number;
  total: number;
  status: 'paid' | 'unpaid' | 'late';
  dueDate: string;
}

export function InvoicesLedgerView() {
  const { setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'unpaid' | 'late'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<LedgerInvoice>({
    id: 'INV-2026-0421',
    client: 'شركة النيل للحبوب الزيتية',
    shipmentId: 'SDN-2024-1256',
    date: '20 أغسطس 2026',
    subtotal: 1150,
    tax: 57.5,
    fees: 32.5,
    total: 1240,
    status: 'paid',
    dueDate: '25 أغسطس 2026',
  });

  const invoices: LedgerInvoice[] = [
    {
      id: 'INV-2026-0421',
      client: 'شركة النيل للحبوب الزيتية',
      shipmentId: 'SDN-2024-1256',
      date: '20 أغسطس 2026',
      subtotal: 1150,
      tax: 57.5,
      fees: 32.5,
      total: 1240,
      status: 'paid',
      dueDate: '25 أغسطس 2026',
    },
    {
      id: 'INV-2026-0420',
      client: 'مصنع سكر سنار',
      shipmentId: 'SDN-2024-1257',
      date: '18 أغسطس 2026',
      subtotal: 910,
      tax: 45.5,
      fees: 24.5,
      total: 980,
      status: 'unpaid',
      dueDate: '28 أغسطس 2026',
    },
    {
      id: 'INV-2026-0419',
      client: 'مجموعة دارفور للإعمار والتجارة',
      shipmentId: 'SDN-2024-1258',
      date: '12 أغسطس 2026',
      subtotal: 1450,
      tax: 72.5,
      fees: 37.5,
      total: 1560,
      status: 'late',
      dueDate: '19 أغسطس 2026',
    },
    {
      id: 'INV-2026-0418',
      client: 'شركة نور الهندسية للمعدات',
      shipmentId: 'SDN-2024-1259',
      date: '10 أغسطس 2026',
      subtotal: 670,
      tax: 33.5,
      fees: 16.5,
      total: 720,
      status: 'paid',
      dueDate: '15 أغسطس 2026',
    },
    {
      id: 'INV-2026-0417',
      client: 'مؤسسة البحر الأحمر للملاحة',
      shipmentId: 'SDN-2024-1260',
      date: '05 أغسطس 2026',
      subtotal: 3100,
      tax: 155,
      fees: 65,
      total: 3320,
      status: 'paid',
      dueDate: '10 أغسطس 2026',
    },
  ];

  const filteredInvoices = invoices.filter((inv) => {
    const matchesTab = activeTab === 'all' || inv.status === activeTab;
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.includes(searchQuery) ||
      inv.shipmentId.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-gold/30 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>نظام التسويات والفوترة اللوجستية</span>
          </div>
          <h1 className="text-2xl font-black text-white">الفواتير والمدفوعات والمستحقات</h1>
          <p className="text-xs text-gray-300 mt-1">
            إدارة ومتابعة فواتير الشحن، مستحقات الناقلين، الرسوم الجمركية، وتسويات محفظة EBS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('finance')}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-xl text-xs font-bold border border-white/10 transition-colors"
          >
            نظام المحفظة والضمان Escrow
          </button>
          <button
            onClick={() => setCurrentView('control_tower')}
            className="px-4 py-2 bg-gold hover:bg-gold-light text-navy-950 rounded-xl text-xs font-extrabold shadow-md transition-transform hover:scale-105"
          >
            برج المراقبة
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (Matching invoices.tsx) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-navy-900/80 border border-white/5 shadow-lg space-y-2">
          <span className="text-xs text-gray-400 font-bold block">إجمالي المبالغ المستلمة</span>
          <div className="text-2xl font-black font-mono text-emerald-400">$284,500</div>
          <span className="text-[11px] text-emerald-400/80 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            +14.2% مقارنة بالشهر السابق
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900/80 border border-white/5 shadow-lg space-y-2">
          <span className="text-xs text-gray-400 font-bold block">فواتير مستحقة الدفع</span>
          <div className="text-2xl font-black font-mono text-amber-400">$32,100</div>
          <span className="text-[11px] text-amber-400/80 font-semibold">3 فواتير تستحق خلال 48 ساعة</span>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900/80 border border-white/5 shadow-lg space-y-2">
          <span className="text-xs text-gray-400 font-bold block">مستحقات الناقلين</span>
          <div className="text-2xl font-black font-mono text-sky-400">$48,200</div>
          <span className="text-[11px] text-gray-400 font-semibold">18 أمر نقل تم التحقق من الـ POD</span>
        </div>

        <div className="p-5 rounded-2xl bg-navy-900/80 border border-white/5 shadow-lg space-y-2">
          <span className="text-xs text-gray-400 font-bold block">مستحقات السائقين</span>
          <div className="text-2xl font-black font-mono text-gold">$12,400</div>
          <span className="text-[11px] text-gray-400 font-semibold">حوافز ومكافآت التوصيل السريع</span>
        </div>
      </div>

      {/* Tabs Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-navy-900/60 p-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'كل الفواتير' },
            { id: 'paid', label: 'مدفوعة' },
            { id: 'unpaid', label: 'غير مدفوعة' },
            { id: 'late', label: 'متأخرة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gold text-navy-950 font-black shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الفاتورة أو العميل..."
            className="bg-navy-950 border border-white/10 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-gray-400 outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Table & Invoice Details Drawer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of Invoices (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-white">قائمة الفواتير</h3>
            <span className="text-xs text-gray-400 font-mono">{filteredInvoices.length} فواتير</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 text-start">رقم الفاتورة</th>
                  <th className="pb-3 text-start">العميل</th>
                  <th className="pb-3 text-start">التاريخ</th>
                  <th className="pb-3 text-start">المبلغ</th>
                  <th className="pb-3 text-start">الحالة</th>
                  <th className="pb-3 text-start">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredInvoices.map((inv) => {
                  const isSelected = selectedInvoice.id === inv.id;
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${
                        isSelected ? 'bg-navy-800' : ''
                      }`}
                    >
                      <td className="py-3 font-mono font-bold text-gold">{inv.id}</td>
                      <td className="py-3 text-white max-w-[140px] truncate">{inv.client}</td>
                      <td className="py-3 text-gray-400 font-mono">{inv.date}</td>
                      <td className="py-3 font-mono font-extrabold text-white">${inv.total.toLocaleString()}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : inv.status === 'unpaid'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'unpaid' ? 'غير مدفوعة' : 'متأخرة'}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoice(inv);
                          }}
                          className="px-2 py-1 rounded bg-navy-800 hover:bg-navy-700 text-gray-200 text-[10px] border border-white/10"
                        >
                          معاينة
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Invoice Details Card (5 cols) */}
        <div className="lg:col-span-5 bg-navy-900 border border-gold/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold" />
              <div>
                <h3 className="font-extrabold text-sm text-white">تفاصيل الفاتورة</h3>
                <span className="font-mono text-xs text-gold font-bold">{selectedInvoice.id}</span>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-black ${
                selectedInvoice.status === 'paid'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : selectedInvoice.status === 'unpaid'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {selectedInvoice.status === 'paid' ? 'مدفوعة بالكامل' : selectedInvoice.status === 'unpaid' ? 'غير مدفوعة' : 'متأخرة السداد'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-navy-950/80 border border-white/5">
              <span className="text-[10px] text-gray-400 block">العميل الشاحن</span>
              <span className="font-bold text-white leading-tight block mt-0.5">{selectedInvoice.client}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-950/80 border border-white/5">
              <span className="text-[10px] text-gray-400 block">رقم بوليصة الشحنة</span>
              <span className="font-bold font-mono text-sky-400 leading-tight block mt-0.5">{selectedInvoice.shipmentId}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>المجموع الفرعي (تكلفة النقل)</span>
              <span className="font-mono font-bold text-white">${selectedInvoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>ضريبة القيمة المضافة (5%)</span>
              <span className="font-mono font-bold text-white">${selectedInvoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>رسوم المنصة والتأمين السيادي</span>
              <span className="font-mono font-bold text-white">${selectedInvoice.fees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-2 border-t border-white/10 text-gold">
              <span>الإجمالي الكلي المطلوب</span>
              <span className="font-mono text-base">${selectedInvoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
            <button
              onClick={() => alert(`جاري تحميل الفاتورة ${selectedInvoice.id} بصيغة PDF...`)}
              className="py-2 px-2 bg-navy-800 hover:bg-navy-700 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="py-2 px-2 bg-navy-800 hover:bg-navy-700 text-white rounded-xl text-xs font-bold border border-white/10 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
            <button
              onClick={() => alert(`تم إرسال إشعار السداد إلى ${selectedInvoice.client} عبر البريد والرسائل النصية.`)}
              className="py-2 px-2 bg-gold hover:bg-gold-light text-navy-950 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 shadow cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
