'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  CheckCircle2,
  Clock,
  Building2,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { mockWalletTransactions } from '@/lib/mock-data';

export function FinanceView() {
  const { invoices, shipments, t, lang } = useApp();

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidRevenue = invoices.filter((i) => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices.filter((i) => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-gold" />
            <span>{t.financeWallets}</span>
          </h2>
          <p className="text-xs text-gray-300">
            {lang === 'ar'
              ? 'نظام التسويات المالية الآلي والمحافظ المتعددة (عملاء، ناقلون، سائقون) مع فواتير فورية بعد إثبات التسليم POD.'
              : 'Automated settlement engine & multi-party wallets (Shipper, Carrier, Driver) with instant post-POD release.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(lang === 'ar' ? 'تم تشغيل دورة التسوية الآلية لجميع شحنات الـ POD المؤكدة' : 'Automated settlement cycle executed for all verified PODs')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تنفيذ التسويات الآلية' : 'Execute Auto-Settlements'}</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 mb-1">Total Invoiced Volume</div>
          <div className="text-xl font-bold font-mono text-white">
            {(totalRevenue / 1000000).toFixed(2)}M <span className="text-xs text-gold">SDG</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">+18.4% month-over-month</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-emerald-500/30 shadow-lg">
          <div className="text-xs text-emerald-300 mb-1">Settled & Paid</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {(paidRevenue / 1000000).toFixed(2)}M <span className="text-xs">SDG</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">100% On-time Payouts</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-amber-500/30 shadow-lg">
          <div className="text-xs text-amber-300 mb-1">Pending Receivables</div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {(pendingRevenue / 1000000).toFixed(2)}M <span className="text-xs">SDG</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Due within 30 days</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 mb-1">Sudaneel Net Margin (10%)</div>
          <div className="text-xl font-bold font-mono text-gold">
            {((totalRevenue * 0.1) / 1000000).toFixed(2)}M <span className="text-xs">SDG</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Platform Exchange Fee</div>
        </div>
      </div>

      {/* Multi-Party Wallets Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Shipper Corporate Wallet */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gold" />
              <span className="font-bold text-white text-sm">Shipper Wallet (B2B)</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">Active</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            18,450,000 <span className="text-xs text-gold">SDG</span>
          </div>
          <div className="text-xs text-gray-400">Escrow Reserved: 6,900,000 SDG</div>
        </div>

        {/* Carrier Earnings Wallet */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-sky-400" />
              <span className="font-bold text-white text-sm">Carrier Payout Wallet</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">Verified</span>
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400">
            48,500,000 <span className="text-xs">SDG</span>
          </div>
          <div className="text-xs text-gray-400">Ready for Bankak Transfer</div>
        </div>

        {/* Driver Immediate Wallet */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-navy-800">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white text-sm">Driver Instant Wallets</span>
            </div>
            <span className="text-xs text-gold font-mono font-bold">Daily Pay</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            1,245,000 <span className="text-xs">SDG</span>
          </div>
          <div className="text-xs text-gray-400">Per-trip bonus & diesel stipend</div>
        </div>
      </div>

      {/* Ledger Tables (Invoices & Wallet Transactions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Invoices List (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-navy-900/90 border border-gold/20 p-4 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-gold" />
            <span>Digital Invoices & Billing</span>
          </h3>

          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-3 rounded-xl bg-navy-950/70 border border-navy-800 flex items-center justify-between text-xs hover:border-gold/30 transition-colors"
              >
                <div>
                  <div className="font-mono font-bold text-gold">{inv.invoiceNumber}</div>
                  <div className="font-semibold text-white mt-0.5">{inv.customerNameAr || inv.customerName}</div>
                  <div className="text-[10px] text-gray-400 font-mono">Ref: {inv.trackingNumber}</div>
                </div>

                <div className="text-end space-y-1">
                  <div className="font-mono font-bold text-white text-sm">
                    {inv.total.toLocaleString()} SDG
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                      inv.status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Ledger Transactions (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-navy-900/90 border border-gold/20 p-4 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <span>Wallet Settlement Activity</span>
          </h3>

          <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
            {mockWalletTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-2.5 rounded-xl bg-navy-950/70 border border-navy-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">
                    {lang === 'ar' ? tx.descriptionAr : tx.descriptionEn}
                  </span>
                  <span
                    className={`font-mono font-bold ${
                      tx.type === 'fee' ? 'text-gold' : 'text-emerald-400'
                    }`}
                  >
                    +{tx.amount.toLocaleString()} SDG
                  </span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono">{tx.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
