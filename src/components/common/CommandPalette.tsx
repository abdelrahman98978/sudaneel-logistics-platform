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
  ArrowRight,
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-navy-900 border border-gold/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input bar */}
        <div className="p-4 border-b border-gold/15 flex items-center gap-3 bg-navy-950/80">
          <Search className="w-5 h-5 text-gold" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm sm:text-base font-medium"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-navy-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-semibold uppercase text-gold/60 px-3 py-1">
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
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm text-gray-200 hover:bg-navy-800 hover:text-gold transition-colors text-start cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gold flex-shrink-0" />
                      <span>{action.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-navy-950 text-gray-400 border border-navy-800">
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
              <div className="text-[10px] font-semibold uppercase text-gold/60 px-3 py-1">
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
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm bg-navy-950/60 hover:bg-navy-800 text-gray-200 border border-gold/10 hover:border-gold/30 transition-all text-start cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{s.trackingNumber}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-gold border border-gold/20 font-mono">
                            {s.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {s.origin.city} ➔ {s.destination.city} ({s.customerNameAr || s.customerName})
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-xs font-semibold text-gold font-mono">
                        {s.price.toLocaleString()} {s.currency}
                      </div>
                      <div className="text-[10px] text-gray-400">{s.estimatedEta}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-gold/15 bg-navy-950 flex items-center justify-between text-[11px] text-gray-400">
          <span>Navigate with arrows, Enter to select</span>
          <span className="font-mono text-gold">ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
