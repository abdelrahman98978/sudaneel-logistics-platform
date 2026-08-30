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
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
} from 'lucide-react';
import { mockWalletTransactions } from '@/lib/mock-data';
import { exportToCsv } from '@/lib/export-utils';
import { EbsPaymentModal } from './EbsPaymentModal';

interface EscrowDeal {
  id: string;
  shipmentRef: string;
  shipperName: string;
  carrierName: string;
  amount: number;
  status: 'locked' | 'pod_verified' | 'released';
  lockedAt: string;
}

export function FinanceView() {
  const { invoices, showToast, t, lang } = useApp();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const [escrowDeals, setEscrowDeals] = useState<EscrowDeal[]>([
    {
      id: 'esc-01',
      shipmentRef: 'SDN-889120',
      shipperName: 'شركة النيل للواردات',
      carrierName: 'أسطول سودانيل السريع',
      amount: 850000,
      status: 'locked',
      lockedAt: 'اليوم • 09:30 ص',
    },
    {
      id: 'esc-02',
      shipmentRef: 'SDN-774102',
      shipperName: 'مطاحن سيقا للغلال',
      carrierName: 'شركة النقل الثقيل المتحد',
      amount: 1450000,
      status: 'pod_verified',
      lockedAt: 'اليوم • 07:15 ص',
    },
    {
      id: 'esc-03',
      shipmentRef: 'SDN-330198',
      shipperName: 'مجموعة كنانة للسكر',
      carrierName: 'الأسطول الإفريقي للنقل',
      amount: 2100000,
      status: 'released',
      lockedAt: 'أمس • 04:00 م',
    },
  ]);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices.filter((i) => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);

  const handleReleaseEscrow = (dealId: string) => {
    setEscrowDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, status: 'released' } : d))
    );
    showToast(
      lang === 'ar' ? 'تم الإفراج عن مبلغ الضمان' : 'Escrow Released',
      lang === 'ar' ? 'تم تحويل المستحقات فورياً لحساب الناقل عبر مقاصة EBS بنجاح' : 'Funds settled to carrier via EBS',
      'success'
    );
  };

  const handleExecuteSettlements = () => {
    setEscrowDeals((prev) =>
      prev.map((d) => (d.status === 'pod_verified' ? { ...d, status: 'released' } : d))
    );
    showToast(
      lang === 'ar' ? 'تم تشغيل دورة التسويات الآلية' : 'Settlements Executed',
      lang === 'ar'
        ? 'تمت مطابقة كافة إشعارات التسليم POD وتحويل المستحقات فورياً لحسابات الناقلين المصرفية عبر بنكك وفوري'
        : 'Automated settlement cycle completed. Payouts transferred via EBS network.',
      'success'
    );
  };

  const handleExportTransactions = () => {
    exportToCsv(
      'sudaneel-wallet-transactions',
      [
        { header: 'Transaction ID', accessor: (t) => t.id },
        { header: 'Type', accessor: (t) => t.type },
        { header: 'Amount (SDG)', accessor: (t) => t.amount },
        { header: 'Status', accessor: (t) => t.status },
        { header: 'Date', accessor: (t) => t.date },
        { header: 'Description (AR)', accessor: (t) => t.descriptionAr },
        { header: 'Description (EN)', accessor: (t) => t.descriptionEn },
      ],
      mockWalletTransactions
    );

    showToast(
      lang === 'ar' ? 'تم تصدير سجل المعاملات' : 'Transactions Exported',
      lang === 'ar' ? 'تم تنزيل ملف CSV موثق لكافة حركات المحفظة' : 'Downloaded wallet transactions CSV successfully',
      'success'
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top-up Modal */}
      <EbsPaymentModal
        isOpen={isTopUpOpen}
        amount={500000}
        description="شحن الرصيد التشغيلي للمحفظة المركزية"
        onClose={() => setIsTopUpOpen(false)}
      />

      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <Wallet className="w-4 h-4" />
            <span>Digital Escrow & Multi-Party Wallets • منظومة المحافظ والتسويات</span>
          </div>
          <h1 className="text-[26px] font-[600] text-[#000000] tracking-tight">
            {t.financeWallets}
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            {lang === 'ar'
              ? 'نظام التسويات المالية الآلي والمحافظ المتعددة (عملاء، ناقلون، سائقون) مع حساب الضمان المشترك (Smart Escrow) وفواتير فورية بعد إثبات التسليم POD.'
              : 'Automated settlement engine & multi-party wallets with instant post-POD release.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsTopUpOpen(true)}
            className="btn-shopify-outline"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'شحن المحفظة (EBS)' : 'Top-up Wallet'}</span>
          </button>
          <button
            onClick={handleExecuteSettlements}
            className="btn-shopify-pill"
          >
            <Zap className="w-4 h-4 text-[#c1fbd4]" />
            <span>{lang === 'ar' ? 'تنفيذ التسويات الآلية' : 'Execute Settlements'}</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600]">حجم الفواتير الكلي</div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">
            {(totalRevenue / 1000000).toFixed(2)}M <span className="text-[12px] text-[#71717a]">SDG</span>
          </div>
          <div className="text-[11.5px] text-[#000000] font-[500]">+18.4% نمو شهري</div>
        </div>

        <div className="shopify-card-aloe p-6 space-y-2 shadow-[0_8px_20px_rgba(193,251,212,0.4)]">
          <div className="text-[12px] text-[#000000] font-[600]">تم تسويته وسداده بالكامل</div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">
            {(paidRevenue / 1000000).toFixed(2)}M <span className="text-[12px]">SDG</span>
          </div>
          <div className="text-[11.5px] text-[#000000]/80 font-[500]">دفع فوري 100% في الموعد</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600]">مستحقات قيد التحصيل</div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">
            {(pendingRevenue / 1000000).toFixed(2)}M <span className="text-[12px] text-[#71717a]">SDG</span>
          </div>
          <div className="text-[11.5px] text-[#71717a]">استحقاق خلال 30 يوماً</div>
        </div>

        <div className="shopify-card-pistachio p-6 space-y-2">
          <div className="text-[12px] text-[#000000] font-[600]">عمولة المنصة الصافية (10%)</div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">
            {((totalRevenue * 0.1) / 1000000).toFixed(2)}M <span className="text-[12px]">SDG</span>
          </div>
          <div className="text-[11.5px] text-[#000000]/80 font-[500]">رسوم التبادل والضمان</div>
        </div>
      </div>

      {/* Smart Escrow Accounts Hub */}
      <div className="shopify-card p-6 bg-[#ffffff] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#000000]" />
            <h3 className="font-[600] text-[16px] text-[#000000]">
              حسابات الضمان المالي المشترك (Smart Escrow Protocol)
            </h3>
          </div>
          <span className="shopify-tag-mint !text-[11px]">POD Smart Trigger</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {escrowDeals.map((deal) => (
            <div
              key={deal.id}
              className="p-5 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-[700] text-[13px] text-[#000000]">{deal.shipmentRef}</span>
                  <span
                    className={
                      deal.status === 'released'
                        ? 'shopify-tag-mint !text-[10px]'
                        : deal.status === 'pod_verified'
                        ? 'shopify-tag-pistachio !text-[10px]'
                        : 'shopify-tag-shade !text-[10px]'
                    }
                  >
                    {deal.status === 'released'
                      ? 'محرر ومحول للناقل'
                      : deal.status === 'pod_verified'
                      ? 'تم التحقق من POD'
                      : 'محجوز بالضمان'}
                  </span>
                </div>

                <div className="text-[12.5px] space-y-1">
                  <div className="text-[#000000] font-[600]">{deal.shipperName}</div>
                  <div className="text-[#71717a] text-[11.5px]">الناقل: {deal.carrierName}</div>
                </div>

                <div className="font-mono font-[800] text-[18px] text-[#000000]">
                  {deal.amount.toLocaleString()} SDG
                </div>
              </div>

              <div className="pt-2 border-t border-[#e4e4e7]">
                {deal.status !== 'released' ? (
                  <button
                    onClick={() => handleReleaseEscrow(deal.id)}
                    className="w-full btn-shopify-pill !py-2 text-[12px] flex items-center justify-center gap-1.5"
                  >
                    <Unlock className="w-3.5 h-3.5 text-[#c1fbd4]" />
                    <span>تحرير المبلغ للناقل فوراً</span>
                  </button>
                ) : (
                  <div className="text-center text-[11.5px] text-emerald-700 font-[600] flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تم التحويل البنكي بنجاح</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Party Wallets Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipper Corporate Wallet */}
        <div className="shopify-card p-6 space-y-4 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center text-[#000000]">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-[600] text-[#000000] text-[15px]">محفظة الشاحنين (B2B)</span>
            </div>
            <span className="shopify-tag-mint !text-[11px]">Active</span>
          </div>
          <div className="text-[26px] font-[700] font-mono text-[#000000]">
            18,450,000 <span className="text-[12px] text-[#71717a]">SDG</span>
          </div>
          <div className="text-[12px] text-[#71717a]">رصيد الضمان المحجوز: 6,900,000 SDG</div>
        </div>

        {/* Carrier Earnings Wallet */}
        <div className="shopify-card p-6 space-y-4 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center text-[#000000]">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="font-[600] text-[#000000] text-[15px]">محفظة مستحقات الناقلين</span>
            </div>
            <span className="shopify-tag-mint !text-[11px]">Verified</span>
          </div>
          <div className="text-[26px] font-[700] font-mono text-[#000000]">
            48,500,000 <span className="text-[12px] text-[#71717a]">SDG</span>
          </div>
          <div className="text-[12px] text-[#71717a]">جاهزة للتحويل الفوري إلى بنكك</div>
        </div>

        {/* Driver Immediate Wallet */}
        <div className="shopify-card p-6 space-y-4 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center text-[#000000]">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-[600] text-[#000000] text-[15px]">محافظ السائقين الفورية</span>
            </div>
            <span className="shopify-tag-pistachio !text-[11px]">Daily Pay</span>
          </div>
          <div className="text-[26px] font-[700] font-mono text-[#000000]">
            1,245,000 <span className="text-[12px] text-[#71717a]">SDG</span>
          </div>
          <div className="text-[12px] text-[#71717a]">حوافز الرحلات ومخصصات الوقود</div>
        </div>
      </div>

      {/* Ledger Tables (Invoices & Wallet Transactions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Invoices List (7 cols) */}
        <div className="lg:col-span-7 shopify-card p-6 space-y-4 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[16px] text-[#000000] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#000000]" />
              <span>الفواتير الرقمية وسجل المطالبات</span>
            </h3>
            <span className="shopify-tag-mint">{invoices.length} فواتير</span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pe-1">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between text-[13px] hover:border-[#a1a1aa] transition-colors"
              >
                <div>
                  <div className="font-mono font-[700] text-[#000000]">{inv.invoiceNumber}</div>
                  <div className="font-[600] text-[#000000] mt-0.5">{inv.customerNameAr || inv.customerName}</div>
                  <div className="text-[11.5px] text-[#71717a] font-mono">Ref: {inv.trackingNumber}</div>
                </div>

                <div className="text-end space-y-1">
                  <div className="font-mono font-[700] text-[#000000] text-[14px]">
                    {inv.total.toLocaleString()} SDG
                  </div>
                  <span className={inv.status === 'paid' ? 'shopify-tag-mint !text-[10px]' : 'shopify-tag-shade !text-[10px]'}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Ledger Transactions (5 cols) */}
        <div className="lg:col-span-5 shopify-card p-6 space-y-4 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[16px] text-[#000000] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#000000]" />
              <span>نشاط تسويات المحافظ الحية</span>
            </h3>

            <button
              onClick={handleExportTransactions}
              className="text-[12px] text-[#000000] hover:underline flex items-center gap-1 font-[600]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pe-1">
            {mockWalletTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] text-[12.5px] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-[600] text-[#000000]">
                    {lang === 'ar' ? tx.descriptionAr : tx.descriptionEn}
                  </span>
                  <span className="font-mono font-[700] text-[#000000]">
                    +{tx.amount.toLocaleString()} SDG
                  </span>
                </div>
                <div className="text-[11px] text-[#71717a] font-mono">{tx.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
