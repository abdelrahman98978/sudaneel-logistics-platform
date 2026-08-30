'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Download,
  Send,
  Printer,
  FileText,
  CreditCard,
  Search,
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
    <div className="space-y-6 font-sans text-[#171A20]" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#EEEEEE] p-6 rounded-[4px]">
        <div>
          <div className="flex items-center gap-2 text-[#3E6AE1] text-[12px] font-[500] uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>نظام التسويات والفوترة اللوجستية</span>
          </div>
          <h1 className="text-[20px] font-[500] text-[#171A20]">الفواتير والمدفوعات والمستحقات</h1>
          <p className="text-[13px] text-[#5C5E62] mt-1">
            إدارة ومتابعة فواتير الشحن، مستحقات الناقلين، الرسوم الجمركية، وتسويات محفظة EBS.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('finance')}
            className="btn-tesla-secondary !min-h-[36px] !py-1 !px-3 text-[13px]"
          >
            نظام المحفظة والضمان Escrow
          </button>
          <button
            onClick={() => setCurrentView('control_tower')}
            className="btn-tesla-primary !min-h-[36px] !py-1 !px-3 text-[13px]"
          >
            برج المراقبة
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-1">
          <span className="text-[12px] text-[#5C5E62] block">إجمالي المبالغ المستلمة</span>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">$284,500</div>
          <span className="text-[11px] text-[#3E6AE1] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +14.2% هذا الشهر
          </span>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-1">
          <span className="text-[12px] text-[#5C5E62] block">فواتير مستحقة الدفع</span>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">$32,100</div>
          <span className="text-[11px] text-[#5C5E62]">3 فواتير خلال 48 ساعة</span>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-1">
          <span className="text-[12px] text-[#5C5E62] block">مستحقات الناقلين</span>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">$48,200</div>
          <span className="text-[11px] text-[#8E8E8E]">18 أمر نقل تم التحقق من POD</span>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-1">
          <span className="text-[12px] text-[#5C5E62] block">مستحقات السائقين</span>
          <div className="text-[22px] font-[500] font-mono text-[#3E6AE1]">$12,400</div>
          <span className="text-[11px] text-[#8E8E8E]">حوافز التوصيل السريع</span>
        </div>
      </div>

      {/* Tabs Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-3 rounded-[4px] border border-[#EEEEEE]">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'كل الفواتير' },
            { id: 'paid', label: 'مدفوعة' },
            { id: 'unpaid', label: 'غير مدفوعة' },
            { id: 'late', label: 'متأخرة' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#171A20] text-white font-[500]'
                  : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-[#8E8E8E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الفاتورة أو العميل..."
            className="bg-[#FFFFFF] border border-[#D0D1D2] rounded-[4px] pr-9 pl-4 py-1.5 text-[13px] text-[#171A20] placeholder-[#8E8E8E] outline-none"
          />
        </div>
      </div>

      {/* Table & Invoice Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of Invoices (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[14px] text-[#171A20]">قائمة الفواتير</h3>
            <span className="text-[12px] text-[#5C5E62] font-mono">{filteredInvoices.length} فواتير</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-start">
              <thead>
                <tr className="border-b border-[#EEEEEE] text-[#5C5E62] bg-[#F4F4F4] text-[11px] uppercase">
                  <th className="p-3 text-start">رقم الفاتورة</th>
                  <th className="p-3 text-start">العميل</th>
                  <th className="p-3 text-start">التاريخ</th>
                  <th className="p-3 text-start">المبلغ</th>
                  <th className="p-3 text-start">الحالة</th>
                  <th className="p-3 text-start">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE]">
                {filteredInvoices.map((inv) => {
                  const isSelected = selectedInvoice.id === inv.id;
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={`hover:bg-[#F4F4F4] transition-colors duration-330 cursor-pointer ${
                        isSelected ? 'bg-[#F4F4F4]' : ''
                      }`}
                    >
                      <td className="p-3 font-mono font-[500] text-[#3E6AE1]">{inv.id}</td>
                      <td className="p-3 text-[#171A20] max-w-[140px] truncate">{inv.client}</td>
                      <td className="p-3 text-[#5C5E62] font-mono">{inv.date}</td>
                      <td className="p-3 font-mono font-[500] text-[#171A20]">${inv.total.toLocaleString()}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-[2px] text-[11px] font-[500] border ${
                            inv.status === 'paid'
                              ? 'bg-white text-[#171A20] border-[#D0D1D2]'
                              : inv.status === 'unpaid'
                              ? 'bg-white text-[#3E6AE1] border-[#3E6AE1]'
                              : 'bg-white text-[#393C41] border-[#D0D1D2]'
                          }`}
                        >
                          {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'unpaid' ? 'غير مدفوعة' : 'متأخرة'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoice(inv);
                          }}
                          className="px-2.5 py-1 rounded-[2px] bg-[#FFFFFF] hover:bg-[#F4F4F4] text-[#171A20] text-[11px] border border-[#D0D1D2]"
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
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3E6AE1]" />
              <div>
                <h3 className="font-[500] text-[15px] text-[#171A20]">تفاصيل الفاتورة</h3>
                <span className="font-mono text-[12px] text-[#3E6AE1] font-[500]">{selectedInvoice.id}</span>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-[2px] text-[11px] font-[500] border ${
                selectedInvoice.status === 'paid'
                  ? 'bg-[#F4F4F4] text-[#171A20] border-[#D0D1D2]'
                  : selectedInvoice.status === 'unpaid'
                  ? 'bg-[#F4F4F4] text-[#3E6AE1] border-[#3E6AE1]'
                  : 'bg-[#F4F4F4] text-[#393C41] border-[#D0D1D2]'
              }`}
            >
              {selectedInvoice.status === 'paid' ? 'مدفوعة بالكامل' : selectedInvoice.status === 'unpaid' ? 'غير مدفوعة' : 'متأخرة السداد'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[11px] text-[#8E8E8E] block">العميل الشاحن</span>
              <span className="font-[500] text-[#171A20] block mt-0.5">{selectedInvoice.client}</span>
            </div>
            <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[11px] text-[#8E8E8E] block">رقم بوليصة الشحنة</span>
              <span className="font-[500] font-mono text-[#3E6AE1] block mt-0.5">{selectedInvoice.shipmentId}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 pt-2 border-t border-[#EEEEEE] text-[13px]">
            <div className="flex justify-between text-[#5C5E62]">
              <span>المجموع الفرعي (تكلفة النقل)</span>
              <span className="font-mono font-[500] text-[#171A20]">${selectedInvoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#5C5E62]">
              <span>ضريبة القيمة المضافة (5%)</span>
              <span className="font-mono font-[500] text-[#171A20]">${selectedInvoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#5C5E62]">
              <span>رسوم المنصة والتأمين</span>
              <span className="font-mono font-[500] text-[#171A20]">${selectedInvoice.fees.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[15px] font-[500] pt-2 border-t border-[#EEEEEE] text-[#171A20]">
              <span>الإجمالي الكلي المطلوب</span>
              <span className="font-mono text-[18px] text-[#171A20]">${selectedInvoice.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EEEEEE]">
            <button
              onClick={() => alert(`جاري تحميل الفاتورة ${selectedInvoice.id} بصيغة PDF...`)}
              className="btn-tesla-secondary !min-h-[34px] !py-1 !px-2 text-[12px] flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-[#3E6AE1]" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => window.print()}
              className="btn-tesla-secondary !min-h-[34px] !py-1 !px-2 text-[12px] flex items-center justify-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
            <button
              onClick={() => alert(`تم إرسال إشعار السداد إلى ${selectedInvoice.client} عبر البريد والرسائل النصية.`)}
              className="btn-tesla-primary !min-h-[34px] !py-1 !px-2 text-[12px] flex items-center justify-center gap-1"
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
