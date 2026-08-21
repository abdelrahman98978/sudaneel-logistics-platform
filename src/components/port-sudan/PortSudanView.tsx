'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { PortContainer, PortCustomsStatus } from '@/types';
import {
  Anchor,
  Container,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  Layers,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Zap,
} from 'lucide-react';

export function PortSudanView() {
  const { portContainers, updateContainerStatus, vehicles, t, lang } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContainer, setSelectedContainer] = useState<PortContainer | null>(portContainers[0] || null);

  const filteredContainers = portContainers.filter((c) => {
    if (statusFilter !== 'all' && c.customsStatus !== statusFilter) return false;
    if (
      searchQuery &&
      !c.containerNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.consignee.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalDemurrage = portContainers.reduce((acc, c) => acc + c.demurrageAccruedUSD, 0);
  const demurrageRiskCount = portContainers.filter((c) => c.freeDaysRemaining <= 1).length;

  const handleUpdateCustoms = (containerId: string, status: PortCustomsStatus) => {
    updateContainerStatus(containerId, status);
    alert(
      lang === 'ar'
        ? `تم تحديث الحالة الجمركية للحاوية إلى: ${status}`
        : `Customs clearance status updated to: ${status}`
    );
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
              <Anchor className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'عمليات ميناء بورتسودان والجمارك (Port Sudan Terminal)' : 'Port Sudan Terminal & Customs Clearance Hub'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            {lang === 'ar'
              ? 'مراقبة الحاويات الواردة والصادرة، عداد أيام السماح وغرامات الأرضيات (Demurrage)، وتخصيص شاحنات النقل الفوري.'
              : 'Real-time ISO container yard tracking, customs inspection stages, demurrage fee alarms, and direct truck dispatch.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-navy-800 border border-gold/20 text-xs font-mono text-gold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Red Sea Gateway Live
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Containers in Terminal</span>
            <Container className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl font-bold font-mono text-white">{portContainers.length} Units</div>
          <div className="text-[10px] text-gray-400 mt-1">40HC / 40RF / 20GP</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-rose-500/30 shadow-lg">
          <div className="text-xs text-rose-300 flex items-center justify-between mb-1">
            <span>Demurrage Risk Alarms</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold font-mono text-rose-400">{demurrageRiskCount} Containers</div>
          <div className="text-[10px] text-rose-300 mt-1">≤ 1 Free Day Remaining</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-amber-500/30 shadow-lg">
          <div className="text-xs text-amber-300 flex items-center justify-between mb-1">
            <span>Accrued Demurrage</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">${totalDemurrage} USD</div>
          <div className="text-[10px] text-gray-400 mt-1">Daily rate penalties</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-emerald-500/30 shadow-lg">
          <div className="text-xs text-emerald-300 flex items-center justify-between mb-1">
            <span>Customs Clearance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">96.8%</div>
          <div className="text-[10px] text-emerald-400 mt-1">Avg 18h turnaround</div>
        </div>
      </div>

      {/* Main Containers Ledger & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Container List (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-navy-900/90 border border-gold/20 p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-gold/15">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Container className="w-4 h-4 text-gold" />
              <span>{lang === 'ar' ? 'سجل الحاويات والجمارك' : 'Container Yard & Customs Ledger'}</span>
            </h3>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-950 border border-gold/20 text-xs">
                <Search className="w-3.5 h-3.5 text-gold" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Container or Consignee..."
                  className="bg-transparent text-white outline-none w-28 sm:w-36 text-[11px]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-navy-950 border border-gold/20 text-xs text-gray-200 px-2.5 py-1.5 rounded-xl outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="cleared">Cleared</option>
                <option value="under_inspection">Under Inspection</option>
                <option value="demurrage_warning">Demurrage Warning</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredContainers.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedContainer(c)}
                className={`w-full p-4 rounded-xl text-start transition-all cursor-pointer border ${
                  selectedContainer?.id === c.id
                    ? 'bg-navy-950 border-gold shadow-lg'
                    : 'bg-navy-950/60 border-navy-800 hover:bg-navy-800 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-white text-sm">{c.containerNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-gold border border-gold/20 font-mono font-bold">
                      {c.isoCode}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                      c.customsStatus === 'cleared'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : c.customsStatus === 'demurrage_warning'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {c.customsStatus}
                  </span>
                </div>

                <div className="text-xs text-gray-300 mt-1">{c.consignee} • {c.cargoDescription}</div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-400 mt-2 pt-2 border-t border-navy-800">
                  <div>
                    <span className="block text-[10px] text-gray-500">Shipping Line</span>
                    <span className="font-semibold text-white">{c.shippingLine}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">Free Days Left</span>
                    <span className={`font-mono font-bold ${c.freeDaysRemaining <= 1 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {c.freeDaysRemaining} Days
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">Gate State</span>
                    <span className="font-mono text-gold">{c.gateStatus}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Container Inspection & Direct Dispatch Detail (5 cols) */}
        {selectedContainer && (
          <div className="lg:col-span-5 rounded-2xl bg-navy-900/90 border border-gold/25 p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gold/15">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 uppercase font-bold">
                  {selectedContainer.shippingLine} • {selectedContainer.isoCode}
                </span>
                <h3 className="text-lg font-bold text-white font-mono mt-1">{selectedContainer.containerNumber}</h3>
                <p className="text-xs text-gray-400">{selectedContainer.vesselName}</p>
              </div>

              <div className="text-end">
                <span className="text-[10px] text-gray-400 block">Seal Number</span>
                <span className="text-xs font-mono text-gold font-bold">{selectedContainer.sealNumber}</span>
              </div>
            </div>

            {/* Demurrage Clock Widget */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              selectedContainer.freeDaysRemaining <= 0
                ? 'bg-rose-950/40 border-rose-500/50'
                : 'bg-navy-950 border-gold/20'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>Demurrage Countdown</span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-400">
                  ${selectedContainer.demurrageRatePerDayUSD} / Day
                </span>
              </div>

              <div className="text-2xl font-bold font-mono text-white">
                {selectedContainer.freeDaysRemaining} <span className="text-xs font-sans text-gray-400">Free Days Remaining</span>
              </div>

              {selectedContainer.demurrageAccruedUSD > 0 && (
                <div className="text-xs text-rose-300 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Total Penalties Accrued: ${selectedContainer.demurrageAccruedUSD} USD
                </div>
              )}
            </div>

            {/* Customs Clearance Actions */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-300 block">Customs Progress Actions</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateCustoms(selectedContainer.id, 'under_inspection')}
                  className="p-2.5 rounded-xl bg-navy-950 border border-gold/20 hover:border-gold text-xs text-gray-200 text-center cursor-pointer transition-colors"
                >
                  Mark Under Inspection
                </button>
                <button
                  onClick={() => handleUpdateCustoms(selectedContainer.id, 'cleared')}
                  className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs text-emerald-300 font-semibold text-center cursor-pointer transition-colors"
                >
                  Verify Customs Release
                </button>
              </div>
            </div>

            {/* Truck Assignment Status */}
            <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 space-y-2 text-xs">
              <div className="text-gray-400 font-semibold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-gold" />
                <span>Assigned Evacuation Truck</span>
              </div>
              <div className="flex justify-between items-center text-white">
                <span className="font-mono">{selectedContainer.assignedTruckPlate || 'No truck locked yet'}</span>
                <button
                  onClick={() => alert(`Assigning nearest empty flatbed to ${selectedContainer.containerNumber}`)}
                  className="px-3 py-1 rounded-lg bg-gold text-navy-950 font-bold text-[11px] hover:brightness-110 cursor-pointer"
                >
                  Assign Flatbed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
