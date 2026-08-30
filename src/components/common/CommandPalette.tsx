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
  Smartphone,
} from 'lucide-react';

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setCurrentView,
    shipments,
    setSelectedShipmentId,
    t,
    lang,
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
    { title: 'تطبيق الجوال الذكي (Mobile App)', icon: Smartphone, view: 'mobile_app', category: 'Mobile Suite' },
    { title: t.bulkOrders, icon: FileSpreadsheet, view: 'bulk_orders', category: 'Actions' },
    { title: t.controlTower, icon: Compass, view: 'control_tower', category: 'Operations' },
    { title: t.marketplace, icon: Repeat, view: 'marketplace', category: 'Operations' },
    { title: t.smartDispatch, icon: Cpu, view: 'smart_dispatch', category: 'Operations' },
    { title: t.warehousing, icon: Warehouse, view: 'warehousing', category: 'Infrastructure' },
    { title: t.portSudan, icon: Anchor, view: 'port_sudan', category: 'Infrastructure' },
    { title: 'التخليص الجمركي (Customs Workspace)', icon: FileCheck2, view: 'customs_workspace', category: 'Infrastructure' },
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
    <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in duration-200 shopify-theme">
      <div className="w-full max-w-2xl bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col">
        {/* Input bar */}
        <div className="p-4 border-b border-[#e4e4e7] flex items-center gap-3 bg-[#ffffff]">
          <Search className="w-5 h-5 text-[#000000]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-[#000000] placeholder-[#71717a] outline-none text-[15px] font-[420]"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1.5 text-[#71717a] hover:text-[#000000] rounded-full hover:bg-[#fbfbf5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Quick Actions */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-[600] text-[#71717a] uppercase tracking-wider">
              {lang === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {filteredActions.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentView(act.view);
                      setIsCommandPaletteOpen(false);
                    }}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-full hover:bg-[#c1fbd4] hover:text-[#000000] text-[#000000] text-[13px] text-start transition-all duration-200 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-[#71717a] flex-shrink-0" />
                    <span className="truncate flex-1 font-[500]">{act.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] text-[#71717a]">
                      {act.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Shipments */}
          {filteredShipments.length > 0 && (
            <div className="space-y-1 border-t border-[#e4e4e7] pt-3">
              <div className="px-3 pb-1 text-[11px] font-[600] text-[#71717a] uppercase tracking-wider">
                {t.shipments}
              </div>
              <div className="space-y-1">
                {filteredShipments.slice(0, 4).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedShipmentId(s.id);
                      setCurrentView('tracking_detail');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-[12px] hover:bg-[#fbfbf5] border border-transparent hover:border-[#e4e4e7] transition-all duration-200 text-start cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-[#000000]" />
                      <div>
                        <div className="font-mono text-[13px] font-[600] text-[#000000]">
                          {s.trackingNumber}
                        </div>
                        <div className="text-[11px] text-[#71717a]">
                          {s.customerName} • {s.origin.city} ➔ {s.destination.city}
                        </div>
                      </div>
                    </div>
                    <span className="shopify-tag-mint !text-[10px]">
                      {s.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-[#fbfbf5] border-t border-[#e4e4e7] flex items-center justify-between text-[11px] text-[#71717a]">
          <div className="flex items-center gap-3">
            <span>↑↓ للتنقل</span>
            <span>↵ للاختيار</span>
            <span>ESC للإغلاق</span>
          </div>
          <span className="shopify-tag-shade !text-[10px]">
            SUDANIL OS
          </span>
        </div>
      </div>
    </div>
  );
}
