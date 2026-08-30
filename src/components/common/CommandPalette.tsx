'use client';

import React, { useState } from 'react';
import { useApp, AppView } from '@/lib/store';
import {
  Search,
  PlusCircle,
  Repeat,
  Compass,
  Package,
  ShieldAlert,
  Cpu,
  Truck,
  Warehouse,
  Anchor,
  Globe2,
  FileCheck2,
  Wallet,
  FileText,
  BarChart3,
  Sparkles,
  FileDown,
  X,
  FileSpreadsheet,
} from 'lucide-react';

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setCurrentView,
    shipments,
    setSelectedShipmentId,
    t,
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const quickActions: {
    title: string;
    icon: React.ElementType;
    view: AppView;
    category: string;
  }[] = [
    { title: t.createShipment, icon: PlusCircle, view: 'create_shipment', category: 'Actions' },
    { title: t.bulkOrders, icon: FileSpreadsheet, view: 'bulk_orders', category: 'Actions' },
    { title: t.controlTower, icon: Compass, view: 'control_tower', category: 'Operations' },
    { title: t.marketplace, icon: Repeat, view: 'marketplace', category: 'Operations' },
    { title: t.smartDispatch, icon: Cpu, view: 'smart_dispatch', category: 'Operations' },
    { title: t.warehousing, icon: Warehouse, view: 'warehousing', category: 'Infrastructure' },
    { title: t.portSudan, icon: Anchor, view: 'port_sudan', category: 'Infrastructure' },
    { title: t.crossBorder, icon: Globe2, view: 'cross_border', category: 'Infrastructure' },
    { title: t.fleetManagement, icon: Truck, view: 'fleet', category: 'Infrastructure' },
    { title: t.incidentCenter, icon: ShieldAlert, view: 'incidents', category: 'Risk & Finance' },
    { title: t.claimsCenter, icon: FileCheck2, view: 'claims', category: 'Risk & Finance' },
    { title: t.financeWallets, icon: Wallet, view: 'finance', category: 'Risk & Finance' },
    { title: t.contractsCrm, icon: FileText, view: 'contracts_crm', category: 'Intelligence' },
    { title: t.analytics, icon: BarChart3, view: 'analytics', category: 'Intelligence' },
    { title: t.aiCenter, icon: Sparkles, view: 'ai_center', category: 'Intelligence' },
    { title: t.reportsCenter, icon: FileDown, view: 'reports', category: 'Intelligence' },
    { title: t.publicTrack, icon: Search, view: 'public_track', category: 'Public' },
  ];

  const filteredActions = quickActions.filter(
    (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredShipments = shipments.filter(
    (s) =>
      s.trackingNumber.toLowerCase().includes(query.toLowerCase()) ||
      s.customerName.toLowerCase().includes(query.toLowerCase()) ||
      s.customerNameAr.includes(query) ||
      s.destination.city.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#171A20]/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] overflow-hidden flex flex-col">
        {/* Input bar */}
        <div className="p-4 border-b border-[#EEEEEE] flex items-center gap-3 bg-[#FFFFFF]">
          <Search className="w-5 h-5 text-[#3E6AE1]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-[#171A20] placeholder-[#8E8E8E] outline-none text-[14px] font-[400]"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-[#8E8E8E] hover:text-[#171A20] rounded-[4px] hover:bg-[#F4F4F4]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* Quick Actions */}
          <div>
            <div className="text-[11px] font-[500] uppercase text-[#8E8E8E] px-3 py-1">
              Modules & Quick Navigation ({filteredActions.length})
            </div>
            <div className="space-y-1">
              {filteredActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentView(action.view);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] text-[14px] text-[#393C41] hover:bg-[#F4F4F4] hover:text-[#171A20] transition-colors duration-330 text-start cursor-pointer font-[400]"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#3E6AE1] flex-shrink-0" />
                      <span>{action.title}</span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#5C5E62]">
                      {action.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shipments Match */}
          {filteredShipments.length > 0 && (
            <div>
              <div className="text-[11px] font-[500] uppercase text-[#8E8E8E] px-3 py-1">
                Shipments ({filteredShipments.length})
              </div>
              <div className="space-y-1">
                {filteredShipments.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedShipmentId(s.id);
                      setCurrentView('tracking_detail');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] text-[14px] bg-[#F4F4F4] hover:bg-[#EEEEEE] text-[#171A20] border border-[#EEEEEE] transition-colors duration-330 text-start cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-[#3E6AE1]" />
                      <div>
                        <div className="font-[500] text-[#171A20] flex items-center gap-2">
                          <span>{s.trackingNumber}</span>
                          <span className="text-[11px] px-1.5 py-0.5 rounded-[2px] bg-white text-[#171A20] border border-[#D0D1D2] font-mono">
                            {s.status}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#5C5E62]">
                          {s.origin.city} ➔ {s.destination.city} ({s.customerNameAr || s.customerName})
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-[13px] font-[500] text-[#171A20] font-mono">
                        {s.price.toLocaleString()} {s.currency}
                      </div>
                      <div className="text-[11px] text-[#8E8E8E]">{s.estimatedEta}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-[#EEEEEE] bg-[#F4F4F4] flex items-center justify-between text-[12px] text-[#5C5E62]">
          <span>Navigate with arrows, Enter to select</span>
          <span className="font-mono text-[#3E6AE1]">ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
