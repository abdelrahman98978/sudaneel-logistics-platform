'use client';

import React, { useState } from 'react';
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
      { header: 'Net Amount (SDG)', accessor: (i) => i.amount },
      { header: 'Tax (SDG)', accessor: (i) => i.tax },
      { header: 'Total (SDG)', accessor: (i) => i.total },
      { header: 'Status', accessor: (i) => i.status },
      { header: 'Issue Date', accessor: (i) => i.issueDate },
      { header: 'Due Date', accessor: (i) => i.dueDate },
    ], invoices);

    showToast(
      lang === 'ar' ? 'تم تصدير دفتر الفواتير' : 'Invoices Exported',
      lang === 'ar' ? 'تم تنزيل ملف CSV موثق لجميع الفواتير بنجاح' : 'Downloaded CSV ledger with UTF-8 support',
      'success'
    );
  };

  const handleSendReminder = () => {
    showToast(
      lang === 'ar' ? 'تم إرسال إشعار السداد' : 'Payment Reminder Sent',
      lang === 'ar'
        ? `تم إرسال رابط سداد الفاتورة ${selectedInvoice.invoiceNumber} إلى ${selectedInvoice.customerNameAr || selectedInvoice.customerName} عبر SMS والبريد`
        : `Sent invoice ${selectedInvoice.invoiceNumber} reminder to ${selectedInvoice.customerName}`,
      'success'
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#171A20]" dir="rtl">
      {/* EBS Payment Modal */}
      <EbsPaymentModal
        isOpen={isPaymentModalOpen}
        invoice={selectedInvoice}
        onClose={() => setIsPaymentModalOpen(false)}
      />

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

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="btn-tesla-secondary !min-h-[36px] !py-1 !px-3 text-[13px] flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#3E6AE1]" />
            <span>تصدير CSV</span>
          </button>
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
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">{(totalCollected / 1000000).toFixed(2)}M <span className="text-[12px] text-[#3E6AE1]">SDG</span></div>
          <span className="text-[11px] text-[#3E6AE1] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +14.2% هذا الشهر
          </span>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-1">
          <span className="text-[12px] text-[#5C5E62] block">فواتير مستحقة الدفع</span>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">{(totalPending / 1000000).toFixed(2)}M <span className="text-[12px]">SDG</span></div>
          <span className="text-[11px] text-[#5C5E62]">{invoices.filter((i) => i.status === 'pending').length} فواتير قيد التحصيل</span>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-1">
          <span className="text-[12px] text-[#5C5E62] block">مستحقات الناقلين المعتمدة</span>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">48.2M <span className="text-[12px]">SDG</span></div>
          <span className="text-[11px] text-[#8E8E8E]">18 أمر نقل تم التحقق من POD</span>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-1">
          <span className="text-[12px] text-[#5C5E62] block">عمولات المنصة المحصلة (10%)</span>
          <div className="text-[22px] font-[500] font-mono text-[#3E6AE1]">12.4M <span className="text-[12px]">SDG</span></div>
          <span className="text-[11px] text-[#8E8E8E]">تسوية آلية فورية</span>
        </div>
      </div>

      {/* Tabs Filter + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFFFF] p-3 rounded-[4px] border border-[#EEEEEE]">
        <div className="flex items-center gap-1">
          {[
            { id: 'all', label: 'كل الفواتير' },
            { id: 'paid', label: 'مدفوعة' },
            { id: 'pending', label: 'قيد التحصيل' },
            { id: 'overdue', label: 'متأخرة' },
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
                  <th className="p-3 text-start">المبلغ (SDG)</th>
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
                      <td className="p-3 font-mono font-[500] text-[#3E6AE1]">{inv.invoiceNumber}</td>
                      <td className="p-3 text-[#171A20] max-w-[140px] truncate">{inv.customerNameAr || inv.customerName}</td>
                      <td className="p-3 text-[#5C5E62] font-mono">{inv.issueDate}</td>
                      <td className="p-3 font-mono font-[500] text-[#171A20]">{inv.total.toLocaleString()}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-[2px] text-[11px] font-[500] border ${
                            inv.status === 'paid'
                              ? 'bg-white text-[#171A20] border-[#D0D1D2]'
                              : inv.status === 'pending'
                              ? 'bg-white text-[#3E6AE1] border-[#3E6AE1]'
                              : 'bg-white text-[#393C41] border-[#D0D1D2]'
                          }`}
                        >
                          {inv.status === 'paid' ? 'مدفوعة' : inv.status === 'pending' ? 'قيد التحصيل' : 'متأخرة'}
                        </span>
                      </td>
                      <td className="p-3">
                        {inv.status === 'pending' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(inv);
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-[2px] bg-[#171A20] hover:bg-[#393C41] text-white text-[11px] font-[500] flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3 text-[#3E6AE1]" />
                            <span>سداد EBS</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInvoice(inv);
                            }}
                            className="px-2.5 py-1 rounded-[2px] bg-[#FFFFFF] hover:bg-[#F4F4F4] text-[#171A20] text-[11px] border border-[#D0D1D2]"
                          >
                            معاينة
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Invoice Details Card (5 cols) */}
        <div id="printable-invoice-card" className="lg:col-span-5 bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#3E6AE1]" />
              <div>
                <h3 className="font-[500] text-[15px] text-[#171A20]">تفاصيل الفاتورة الضريبية</h3>
                <span className="font-mono text-[12px] text-[#3E6AE1] font-[500]">{selectedInvoice.invoiceNumber}</span>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-[2px] text-[11px] font-[500] border ${
                selectedInvoice.status === 'paid'
                  ? 'bg-[#F4F4F4] text-[#171A20] border-[#D0D1D2]'
                  : selectedInvoice.status === 'pending'
                  ? 'bg-[#F4F4F4] text-[#3E6AE1] border-[#3E6AE1]'
                  : 'bg-[#F4F4F4] text-[#393C41] border-[#D0D1D2]'
              }`}
            >
              {selectedInvoice.status === 'paid' ? 'مدفوعة بالكامل' : selectedInvoice.status === 'pending' ? 'قيد التحصيل' : 'متأخرة السداد'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[11px] text-[#8E8E8E] block">العميل الشاحن</span>
              <span className="font-[500] text-[#171A20] block mt-0.5">{selectedInvoice.customerNameAr || selectedInvoice.customerName}</span>
            </div>
            <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[11px] text-[#8E8E8E] block">رقم بوليصة الشحنة</span>
              <span className="font-[500] font-mono text-[#3E6AE1] block mt-0.5">{selectedInvoice.trackingNumber}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2 pt-2 border-t border-[#EEEEEE] text-[13px]">
            <div className="flex justify-between text-[#5C5E62]">
              <span>المجموع الفرعي (تكلفة النقل)</span>
              <span className="font-mono font-[500] text-[#171A20]">{selectedInvoice.amount.toLocaleString()} SDG</span>
            </div>
            <div className="flex justify-between text-[#5C5E62]">
              <span>ضريبة القيمة المضافة السيادية (5%)</span>
              <span className="font-mono font-[500] text-[#171A20]">{selectedInvoice.tax.toLocaleString()} SDG</span>
            </div>
            <div className="flex justify-between text-[15px] font-[500] pt-2 border-t border-[#EEEEEE] text-[#171A20]">
              <span>الإجمالي الكلي المطلوب</span>
              <span className="font-mono text-[18px] text-[#3E6AE1]">{selectedInvoice.total.toLocaleString()} SDG</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#EEEEEE]">
            {selectedInvoice.status === 'pending' ? (
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="col-span-3 btn-tesla-primary !min-h-[36px] !py-1 text-[13px] flex items-center justify-center gap-1.5 mb-1"
              >
                <CreditCard className="w-4 h-4" />
                <span>سداد الفاتورة عبر بوابة EBS الآن</span>
              </button>
            ) : null}

            <button
              onClick={handleExportCsv}
              className="btn-tesla-secondary !min-h-[34px] !py-1 !px-2 text-[12px] flex items-center justify-center gap-1"
            >
              <Download className="w-3.5 h-3.5 text-[#3E6AE1]" />
              <span>تصدير</span>
            </button>
            <button
              onClick={() => printDocument(`Sudaneel-Invoice-${selectedInvoice.invoiceNumber}`)}
              className="btn-tesla-secondary !min-h-[34px] !py-1 !px-2 text-[12px] flex items-center justify-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>
            <button
              onClick={handleSendReminder}
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
