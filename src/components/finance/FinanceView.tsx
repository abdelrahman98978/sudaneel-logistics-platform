'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Wallet,
  FileText,
  Building2,
  Users,
  Clock,
  Zap,
  Download,
  PlusCircle,
} from 'lucide-react';
import { mockWalletTransactions } from '@/lib/mock-data';
import { exportToCsv } from '@/lib/export-utils';
import { EbsPaymentModal } from './EbsPaymentModal';

export function FinanceView() {
  const { invoices, showToast, t, lang } = useApp();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices.filter((i) => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);

  const handleExecuteSettlements = () => {
    showToast(
      lang === 'ar' ? 'تم تشغيل دورة التسويات الآلية' : 'Settlements Executed',
      lang === 'ar'
        ? 'تمت مطابقة 18 إشعار تسليم POD وتحويل المستحقات فورياً لحسابات الناقلين المصرفية عبر بنكك وفوري'
        : 'Automated settlement cycle completed. Payouts transferred via EBS network.',
      'success'
    );
  };

  const handleExportTransactions = () => {
    exportToCsv('sudaneel-wallet-transactions', [
      { header: 'Transaction ID', accessor: (t) => t.id },
      { header: 'Type', accessor: (t) => t.type },
      { header: 'Amount (SDG)', accessor: (t) => t.amount },
      { header: 'Status', accessor: (t) => t.status },
      { header: 'Date', accessor: (t) => t.date },
      { header: 'Description (AR)', accessor: (t) => t.descriptionAr },
      { header: 'Description (EN)', accessor: (t) => t.descriptionEn },
    ], mockWalletTransactions);

    showToast(
      lang === 'ar' ? 'تم تصدير سجل المعاملات' : 'Transactions Exported',
      lang === 'ar' ? 'تم تنزيل ملف CSV موثق لكافة حركات المحفظة' : 'Downloaded wallet transactions CSV successfully',
      'success'
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top-up Modal */}
      <EbsPaymentModal
        isOpen={isTopUpOpen}
        amount={500000}
        description="شحن الرصيد التشغيلي للمحفظة المركزية"
        onClose={() => setIsTopUpOpen(false)}
      />

      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[17px] font-[500] text-[#171A20] flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#3E6AE1]" />
            <span>{t.financeWallets}</span>
          </h2>
          <p className="text-[13px] font-[400] text-[#5C5E62] mt-1">
            {lang === 'ar'
              ? 'نظام التسويات المالية الآلي والمحافظ المتعددة (عملاء، ناقلون، سائقون) مع فواتير فورية بعد إثبات التسليم POD.'
              : 'Automated settlement engine & multi-party wallets with instant post-POD release.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTopUpOpen(true)}
            className="btn-tesla-secondary !min-h-[36px] !py-1 !px-3 text-[13px] flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-[#3E6AE1]" />
            <span>{lang === 'ar' ? 'شحن المحفظة (EBS)' : 'Top-up Wallet'}</span>
          </button>
          <button
            onClick={handleExecuteSettlements}
            className="btn-tesla-primary !min-w-[170px] !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تنفيذ التسويات الآلية' : 'Execute Settlements'}</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] mb-1">Total Invoiced Volume</div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">
            {(totalRevenue / 1000000).toFixed(2)}M <span className="text-[12px] text-[#3E6AE1]">SDG</span>
          </div>
          <div className="text-[11px] text-[#3E6AE1] mt-1">+18.4% MoM</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] mb-1">Settled & Paid</div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">
            {(paidRevenue / 1000000).toFixed(2)}M <span className="text-[12px]">SDG</span>
          </div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">100% On-time Payouts</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] mb-1">Pending Receivables</div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">
            {(pendingRevenue / 1000000).toFixed(2)}M <span className="text-[12px]">SDG</span>
          </div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Due within 30 days</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] mb-1">Net Margin (10%)</div>
          <div className="text-[22px] font-[500] font-mono text-[#3E6AE1]">
            {((totalRevenue * 0.1) / 1000000).toFixed(2)}M <span className="text-[12px]">SDG</span>
          </div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Platform Fee</div>
        </div>
      </div>

      {/* Multi-Party Wallets Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shipper Corporate Wallet */}
        <div className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#3E6AE1]" />
              <span className="font-[500] text-[#171A20] text-[14px]">Shipper Wallet (B2B)</span>
            </div>
            <span className="text-[11px] text-[#3E6AE1] font-mono font-[500]">Active</span>
          </div>
          <div className="text-[24px] font-[500] font-mono text-[#171A20]">
            18,450,000 <span className="text-[12px] text-[#5C5E62]">SDG</span>
          </div>
          <div className="text-[12px] text-[#5C5E62]">Escrow Reserved: 6,900,000 SDG</div>
        </div>

        {/* Carrier Earnings Wallet */}
        <div className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#3E6AE1]" />
              <span className="font-[500] text-[#171A20] text-[14px]">Carrier Payout Wallet</span>
            </div>
            <span className="text-[11px] text-[#171A20] font-mono font-[500]">Verified</span>
          </div>
          <div className="text-[24px] font-[500] font-mono text-[#171A20]">
            48,500,000 <span className="text-[12px] text-[#5C5E62]">SDG</span>
          </div>
          <div className="text-[12px] text-[#5C5E62]">Ready for Bankak Transfer</div>
        </div>

        {/* Driver Immediate Wallet */}
        <div className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#3E6AE1]" />
              <span className="font-[500] text-[#171A20] text-[14px]">Driver Instant Wallets</span>
            </div>
            <span className="text-[11px] text-[#3E6AE1] font-mono font-[500]">Daily Pay</span>
          </div>
          <div className="text-[24px] font-[500] font-mono text-[#171A20]">
            1,245,000 <span className="text-[12px] text-[#5C5E62]">SDG</span>
          </div>
          <div className="text-[12px] text-[#5C5E62]">Per-trip bonus & diesel stipend</div>
        </div>
      </div>

      {/* Ledger Tables (Invoices & Wallet Transactions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Invoices List (7 cols) */}
        <div className="lg:col-span-7 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3E6AE1]" />
              <span>Digital Invoices & Billing</span>
            </h3>
            <span className="text-[12px] text-[#5C5E62]">{invoices.length} Invoices</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between text-[13px]"
              >
                <div>
                  <div className="font-mono font-[500] text-[#3E6AE1]">{inv.invoiceNumber}</div>
                  <div className="font-[500] text-[#171A20] mt-0.5">{inv.customerNameAr || inv.customerName}</div>
                  <div className="text-[11px] text-[#5C5E62] font-mono">Ref: {inv.trackingNumber}</div>
                </div>

                <div className="text-end space-y-1">
                  <div className="font-mono font-[500] text-[#171A20] text-[14px]">
                    {inv.total.toLocaleString()} SDG
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-[2px] font-[500] bg-white border border-[#D0D1D2]">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Ledger Transactions (5 cols) */}
        <div className="lg:col-span-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#3E6AE1]" />
              <span>Wallet Settlement Activity</span>
            </h3>

            <button
              onClick={handleExportTransactions}
              className="text-[12px] text-[#3E6AE1] hover:underline flex items-center gap-1 font-[500]"
            >
              <Download className="w-3 h-3" />
              <span>تصدير CSV</span>
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {mockWalletTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-[12px] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-[500] text-[#171A20]">
                    {lang === 'ar' ? tx.descriptionAr : tx.descriptionEn}
                  </span>
                  <span className="font-mono font-[500] text-[#3E6AE1]">
                    +{tx.amount.toLocaleString()} SDG
                  </span>
                </div>
                <div className="text-[11px] text-[#8E8E8E] font-mono">{tx.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
