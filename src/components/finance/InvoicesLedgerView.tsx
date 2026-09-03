'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import { Invoice } from '@/types';
import {
  Download,
  Send,
  Printer,
  FileText,
  CreditCard,
  Search,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { exportToCsv, printDocument } from '@/lib/export-utils';
import { EbsPaymentModal } from './EbsPaymentModal';

export function InvoicesLedgerView() {
  const { invoices, setCurrentView, showToast, lang } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(invoices[0] || {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-0421',
    shipmentId: 'shp-001',
    trackingNumber: 'SDN-2024-1256',
    customerName: 'Nile Oilseeds Export Co.',
    customerNameAr: 'شركة النيل للحبوب الزيتية',
    amount: 1150000,
    tax: 57500,
    total: 1240000,
    currency: 'SDG',
    status: 'paid',
    issueDate: '2026-08-20',
    dueDate: '2026-08-25',
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesTab = activeTab === 'all' || inv.status === activeTab;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerNameAr?.includes(searchQuery) ||
      inv.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalCollected = invoices.filter((i) => i.status === 'paid').reduce((acc, i) => acc + i.total, 0);
  const totalPending = invoices.filter((i) => i.status === 'pending').reduce((acc, i) => acc + i.total, 0);

  const handleExportCsv = () => {
    exportToCsv('sudaneel-invoices-ledger', [
      { header: 'Invoice Number', accessor: (i) => i.invoiceNumber },
      { header: 'Tracking Reference', accessor: (i) => i.trackingNumber },
      { header: 'Customer (AR)', accessor: (i) => i.customerNameAr || i.customerName },
      { header: 'Customer (EN)', accessor: (i) => i.customerName },
      { header: 'Total Amount (SDG)', accessor: (i) => i.total.toLocaleString() },
      { header: 'Status', accessor: (i) => i.status },
      { header: 'Issue Date', accessor: (i) => i.issueDate },
      { header: 'Due Date', accessor: (i) => i.dueDate },
    ], filteredInvoices);

    showToast(
      lang === 'ar' ? 'تم تصدير سجل الفواتير' : 'Invoices Exported',
      lang === 'ar' ? 'تم تحميل ملف CSV لسجل الفواتير والتسويات بنجاح' : 'Invoices CSV downloaded',
      'success'
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <CreditCard className="w-4 h-4" />
            <span>Financial Settlement Ledger • سجل الفواتير والتسويات</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            سجل الفواتير والتسويات (Invoices & Settlements)
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            إصدار الفواتير الإلكترونية المعتمدة، السداد عبر بنكك وبوابة EBS، تسوية حسابات الناقلين والشاحنين تلقائياً.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="btn-shopify-outline"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير CSV</span>
          </button>

          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="btn-shopify-pill"
          >
            <Zap className="w-4 h-4 text-[#c1fbd4]" />
            <span>سداد فوري عبر EBS / بنكك</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards (Shopify Style: 12px rounded, featured card in Aloe-10) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="shopify-card-aloe p-6 space-y-2 shadow-[0_8px_20px_rgba(193,251,212,0.4)]">
          <span className="text-[12px] font-[600] text-[#000000]">إجمالي المحصل (Paid Settlements)</span>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{totalCollected.toLocaleString()} SDG</div>
          <div className="text-[12px] text-[#000000]/80 font-[500]">تسويات فورية مكتملة 100%</div>
        </div>

        <div className="shopify-card p-6 space-y-2">
          <span className="text-[12px] font-[600] text-[#71717a]">مستحقات قيد التحصيل (Pending)</span>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{totalPending.toLocaleString()} SDG</div>
          <div className="text-[12px] text-[#71717a]">بانتظار تفويض الدفع البنكي</div>
        </div>

        <div className="shopify-card p-6 space-y-2">
          <span className="text-[12px] font-[600] text-[#71717a]">عدد الفواتير الصادرة</span>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{invoices.length}</div>
          <div className="text-[12px] text-[#71717a]">فواتير رقمية موثقة ومعتمدة</div>
        </div>
      </div>

      {/* Invoice Split Grid: Table (7 cols) + Selected Printable Invoice (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Invoices Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Tabs */}
          <div className="shopify-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#ffffff]">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-[#71717a]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم الفاتورة أو العميل..."
                className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-full ps-10 pe-4 py-2 text-[13px] outline-none text-[#000000] focus:border-[#000000]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
              {['all', 'paid', 'pending', 'overdue'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] font-[500] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeTab === tab
                      ? 'bg-[#000000] text-white shadow-sm'
                      : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
                  }`}
                >
                  {tab === 'all' && 'الكل'}
                  {tab === 'paid' && 'مسددة'}
                  {tab === 'pending' && 'معلقة'}
                  {tab === 'overdue' && 'متأخرة'}
                </button>
              ))}
            </div>
          </div>

          <div className="shopify-card overflow-hidden bg-[#ffffff]">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-[13px]">
                <thead>
                  <tr className="border-b border-[#e4e4e7] bg-[#fbfbf5] text-[#71717a] text-[11.5px]">
                    <th className="p-3.5 text-start font-[600]">رقم الفاتورة</th>
                    <th className="p-3.5 text-start font-[600]">العميل</th>
                    <th className="p-3.5 text-start font-[600]">المبلغ</th>
                    <th className="p-3.5 text-start font-[600]">الحالة</th>
                    <th className="p-3.5 text-end font-[600]">الاستحقاق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7] font-[420]">
                  {filteredInvoices.map((inv) => (
                    <tr
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className={`hover:bg-[#fbfbf5] transition-colors cursor-pointer ${
                        selectedInvoice?.id === inv.id ? 'bg-[#fbfbf5] font-[500]' : ''
                      }`}
                    >
                      <td className="p-3.5 font-mono font-[600] text-[#000000]">{inv.invoiceNumber}</td>
                      <td className="p-3.5 text-[#000000] truncate max-w-[130px]">{inv.customerNameAr || inv.customerName}</td>
                      <td className="p-3.5 font-mono font-[700] text-[#000000]">{inv.total.toLocaleString()} SDG</td>
                      <td className="p-3.5">
                        <span className={inv.status === 'paid' ? 'shopify-tag-mint !text-[10.5px]' : 'shopify-tag-shade !text-[10.5px]'}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-end font-mono text-[11px] text-[#71717a]">{inv.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Printable Invoice Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div id="printable-invoice" className="shopify-card p-6 space-y-6 bg-[#ffffff]">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-white p-0.5 flex items-center justify-center border border-[#e4e4e7] shadow-sm">
                  <Image src="/logo.png" alt="Sudaneel Logistics" width={40} height={40} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-[600] text-[15px] text-[#000000]">فاتورة شحن ضريبية معتمدة</h3>
                  <p className="text-[11px] text-[#71717a] font-mono">{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>
              <button
                onClick={() => printDocument(`Invoice-${selectedInvoice.invoiceNumber}`)}
                className="p-2 rounded-full hover:bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000]"
                title="طباعة الفاتورة"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2 text-[12.5px]">
              <div className="flex justify-between">
                <span className="text-[#71717a]">العميل:</span>
                <span className="font-[600] text-[#000000]">{selectedInvoice.customerNameAr || selectedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">رقم الشحنة المرجعي:</span>
                <span className="font-mono font-[600] text-[#000000]">{selectedInvoice.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71717a]">تاريخ الإصدار:</span>
                <span className="font-mono text-[#000000]">{selectedInvoice.issueDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2] flex items-center justify-between">
              <span className="font-[600] text-[14px] text-[#000000]">المبلغ الإجمالي المستحق:</span>
              <span className="font-mono font-[800] text-[20px] text-[#000000]">{selectedInvoice.total.toLocaleString()} SDG</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full btn-shopify-pill !py-2.5 text-[13px]"
              >
                <CreditCard className="w-4 h-4 text-[#c1fbd4]" />
                <span>دفع الفاتورة فوراً عبر بنكك / EBS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EBS Payment Modal */}
      <EbsPaymentModal
        isOpen={isPaymentModalOpen}
        invoice={selectedInvoice}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => {
          setIsPaymentModalOpen(false);
          showToast('تم السداد بنجاح', `تم دفع مبلغ ${selectedInvoice.total.toLocaleString()} SDG للفاتورة ${selectedInvoice.invoiceNumber}`, 'success');
        }}
      />
    </div>
  );
}
