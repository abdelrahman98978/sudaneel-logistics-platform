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
  Search,
  DollarSign,
} from 'lucide-react';

export function PortSudanView() {
  const { portContainers, updateContainerStatus, lang } = useApp();

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
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'عمليات ميناء بورتسودان والجمارك (Port Sudan Terminal)' : 'Port Sudan Terminal & Customs Clearance Hub'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] max-w-2xl mt-1">
            {lang === 'ar'
              ? 'مراقبة الحاويات الواردة والصادرة، عداد أيام السماح وغرامات الأرضيات (Demurrage)، وتخصيص شاحنات النقل الفوري.'
              : 'Real-time ISO container yard tracking, customs inspection stages, demurrage fee alarms, and direct truck dispatch.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-[4px] bg-[#F4F4F4] border border-[#D0D1D2] text-[12px] font-mono text-[#171A20] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3E6AE1]"></span>
            Red Sea Gateway Live
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Containers in Terminal</span>
            <Container className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">{portContainers.length} Units</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">40HC / 40RF / 20GP</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Demurrage Risk</span>
            <AlertTriangle className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">{demurrageRiskCount} Units</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">≤ 1 Free Day Left</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Accrued Demurrage</span>
            <DollarSign className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">${totalDemurrage} USD</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Storage penalties</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Clearance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">96.8%</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Avg 18h turnaround</div>
        </div>
      </div>

      {/* Main Containers Ledger & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Container List (7 cols) */}
        <div className="lg:col-span-7 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2">
              <Container className="w-4 h-4 text-[#3E6AE1]" />
              <span>{lang === 'ar' ? 'سجل الحاويات والجمارك' : 'Container Yard & Customs Ledger'}</span>
            </h3>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[12px]">
                <Search className="w-3.5 h-3.5 text-[#8E8E8E]" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Container or Consignee..."
                  className="bg-transparent text-[#171A20] outline-none w-28 sm:w-36 text-[12px]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#FFFFFF] border border-[#D0D1D2] text-[12px] text-[#171A20] px-2.5 py-1.5 rounded-[4px] outline-none"
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
                className={`w-full p-4 rounded-[4px] text-start transition-colors duration-330 cursor-pointer border ${
                  selectedContainer?.id === c.id
                    ? 'bg-[#F4F4F4] border-[#171A20]'
                    : 'bg-[#FFFFFF] border-[#EEEEEE] hover:bg-[#F4F4F4]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-[500] font-mono text-[#171A20] text-[14px]">{c.containerNumber}</span>
                    <span className="text-[11px] px-1.5 py-0.2 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] font-mono font-[500]">
                      {c.isoCode}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-[2px] font-[500] border ${
                      c.customsStatus === 'cleared'
                        ? 'bg-[#F4F4F4] text-[#171A20] border-[#D0D1D2]'
                        : c.customsStatus === 'demurrage_warning'
                        ? 'bg-[#F4F4F4] text-[#3E6AE1] border-[#3E6AE1]'
                        : 'bg-[#F4F4F4] text-[#5C5E62] border-[#D0D1D2]'
                    }`}
                  >
                    {c.customsStatus}
                  </span>
                </div>

                <div className="text-[13px] text-[#5C5E62] mt-1">{c.consignee} • {c.cargoDescription}</div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-[#5C5E62] mt-2 pt-2 border-t border-[#EEEEEE]">
                  <div>
                    <span className="block text-[10px] text-[#8E8E8E]">Shipping Line</span>
                    <span className="font-[500] text-[#171A20]">{c.shippingLine}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#8E8E8E]">Free Days Left</span>
                    <span className={`font-mono font-[500] ${c.freeDaysRemaining <= 1 ? 'text-[#3E6AE1]' : 'text-[#171A20]'}`}>
                      {c.freeDaysRemaining} Days
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#8E8E8E]">Gate State</span>
                    <span className="font-mono text-[#171A20]">{c.gateStatus}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Container Inspection & Direct Dispatch Detail (5 cols) */}
        {selectedContainer && (
          <div className="lg:col-span-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#EEEEEE]">
              <div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] uppercase font-[500]">
                  {selectedContainer.shippingLine} • {selectedContainer.isoCode}
                </span>
                <h3 className="text-[18px] font-[500] text-[#171A20] font-mono mt-1">{selectedContainer.containerNumber}</h3>
                <p className="text-[13px] text-[#5C5E62]">{selectedContainer.vesselName}</p>
              </div>

              <div className="text-end">
                <span className="text-[10px] text-[#8E8E8E] block">Seal Number</span>
                <span className="text-[12px] font-mono font-[500] text-[#171A20]">{selectedContainer.sealNumber}</span>
              </div>
            </div>

            {/* Demurrage Clock Widget */}
            <div className="p-4 rounded-[4px] border border-[#EEEEEE] bg-[#F4F4F4] space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-[500] text-[#171A20] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#3E6AE1]" />
                  <span>Demurrage Countdown</span>
                </span>
                <span className="text-[12px] font-mono font-[500] text-[#171A20]">
                  ${selectedContainer.demurrageRatePerDayUSD} / Day
                </span>
              </div>

              <div className="text-[24px] font-[500] font-mono text-[#171A20]">
                {selectedContainer.freeDaysRemaining} <span className="text-[13px] font-sans text-[#5C5E62]">Free Days Remaining</span>
              </div>

              {selectedContainer.demurrageAccruedUSD > 0 && (
                <div className="text-[12px] text-[#3E6AE1] font-[500] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Total Penalties: ${selectedContainer.demurrageAccruedUSD} USD
                </div>
              )}
            </div>

            {/* Customs Clearance Actions */}
            <div className="space-y-2">
              <span className="text-[12px] font-[500] text-[#171A20] block">Customs Progress Actions</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateCustoms(selectedContainer.id, 'under_inspection')}
                  className="p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] hover:bg-[#F4F4F4] text-[12px] text-[#171A20] text-center cursor-pointer transition-colors duration-330 font-[500]"
                >
                  Mark Under Inspection
                </button>
                <button
                  onClick={() => handleUpdateCustoms(selectedContainer.id, 'cleared')}
                  className="btn-tesla-primary !min-h-[36px] !py-1 !px-3 text-[12px] !min-w-0"
                >
                  Verify Customs Release
                </button>
              </div>
            </div>

            {/* Truck Assignment Status */}
            <div className="p-3.5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2 text-[12px]">
              <div className="text-[#5C5E62] font-[500] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#3E6AE1]" />
                <span>Assigned Evacuation Truck</span>
              </div>
              <div className="flex justify-between items-center text-[#171A20]">
                <span className="font-mono">{selectedContainer.assignedTruckPlate || 'No truck locked yet'}</span>
                <button
                  onClick={() => alert(`Assigning nearest empty flatbed to ${selectedContainer.containerNumber}`)}
                  className="btn-tesla-primary !min-w-[100px] !min-h-[30px] !py-0.5 !px-3 text-[12px]"
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
