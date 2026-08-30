'use client';

import React from 'react';
import { useApp, AppView } from '@/lib/store';
import {
  Compass,
  Repeat,
  Cpu,
  Package,
  PlusCircle,
  FileSpreadsheet,
  FileCheck2,
  Globe2,
  Truck,
  Warehouse,
  Anchor,
  Building2,
  Smartphone,
  ShieldAlert,
  FileText,
  Wallet,
  BarChart3,
  Sparkles,
  FileDown,
  Globe,
  Radio,
  Search,
  MapPin,
  CreditCard,
  LifeBuoy,
} from 'lucide-react';

export function Sidebar() {
  const { currentView, setCurrentView, t, backhauls, incidents, claims, portContainers } = useApp();

  const navigationSections: {
    title: string;
    items: {
      view: AppView;
      label: string;
      icon: React.ElementType;
      badge?: string | number;
    }[];
  }[] = [
    {
      title: 'Operations OS',
      items: [
        {
          view: 'control_tower',
          label: t.controlTower,
          icon: Compass,
          badge: 'Live',
        },
        {
          view: 'marketplace',
          label: t.marketplace,
          icon: Repeat,
          badge: backhauls.length > 0 ? `${backhauls.length}` : undefined,
        },
        {
          view: 'smart_dispatch',
          label: t.smartDispatch,
          icon: Cpu,
        },
        {
          view: 'shipments',
          label: t.shipments,
          icon: Package,
        },
        {
          view: 'create_shipment',
          label: t.createShipment,
          icon: PlusCircle,
        },
        {
          view: 'bulk_orders',
          label: t.bulkOrders,
          icon: FileSpreadsheet,
        },
        {
          view: 'public_track',
          label: t.publicTrack,
          icon: Search,
        },
      ],
    },
    {
      title: 'Logistics Infrastructure',
      items: [
        {
          view: 'locations',
          label: t.locationsHubs,
          icon: MapPin,
          badge: '10',
        },
        {
          view: 'warehousing',
          label: t.warehousing,
          icon: Warehouse,
        },
        {
          view: 'port_sudan',
          label: t.portSudan,
          icon: Anchor,
          badge: portContainers.length > 0 ? `${portContainers.length}` : undefined,
        },
        {
          view: 'cross_border',
          label: t.crossBorder,
          icon: Globe2,
        },
        {
          view: 'fleet',
          label: t.fleetManagement,
          icon: Truck,
        },
        {
          view: 'carrier_portal',
          label: t.carriersNetwork,
          icon: Building2,
        },
        {
          view: 'driver_app',
          label: t.driverApp,
          icon: Smartphone,
        },
        {
          view: 'mobile_app',
          label: t.mobileApp,
          icon: Smartphone,
          badge: 'App Suite',
        },
      ],
    },
    {
      title: 'Finance, AI & Intelligence',
      items: [
        {
          view: 'invoices_ledger',
          label: t.invoicesLedger,
          icon: CreditCard,
        },
        {
          view: 'incidents',
          label: t.incidentCenter,
          icon: ShieldAlert,
          badge: incidents.length > 0 ? incidents.length : undefined,
        },
        {
          view: 'claims',
          label: t.claimsCenter,
          icon: FileCheck2,
          badge: claims.length > 0 ? claims.length : undefined,
        },
        {
          view: 'finance',
          label: t.financeWallets,
          icon: Wallet,
        },
        {
          view: 'contracts_crm',
          label: t.contractsCrm,
          icon: FileText,
        },
        {
          view: 'support_center',
          label: t.supportCenter,
          icon: LifeBuoy,
        },
        {
          view: 'analytics',
          label: t.analytics,
          icon: BarChart3,
        },
        {
          view: 'ai_center',
          label: t.aiCenter,
          icon: Sparkles,
        },
        {
          view: 'reports',
          label: t.reportsCenter,
          icon: FileDown,
        },
        {
          view: 'settings_rbac',
          label: 'الإعدادات والصلاحيات (Settings)',
          icon: ShieldAlert,
        },
        {
          view: 'landing',
          label: t.publicPortal,
          icon: Globe,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-[#171A20] border-e border-[#2A2E35] flex flex-col shrink-0 min-h-screen text-[#FFFFFF]">
      {/* Brand logo container */}
      <div
        onClick={() => setCurrentView('landing')}
        className="h-16 border-b border-[#2A2E35] px-4 flex items-center justify-between cursor-pointer hover:bg-[#20242C] transition-colors duration-330"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-[4px] bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src="/images/brand-logo.jpg"
              alt="سودانيل لوجيستك"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="leading-tight">
            <h1 className="font-[500] text-[13px] tracking-wide text-white">
              {t.brandName}
            </h1>
            <p className="text-[10px] text-[#8E8E8E] truncate">
              {t.brandTagline}
            </p>
          </div>
        </div>
        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-[2px] bg-white/10 text-[#3E6AE1] font-mono">
          OS 3.0
        </span>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {navigationSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-[500] tracking-wider text-[#8E8E8E] uppercase">
              {sec.title}
            </div>

            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;

              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] text-[14px] transition-colors duration-330 cursor-pointer ${
                    isActive
                      ? 'bg-[#3E6AE1] text-white font-[500]'
                      : 'text-[#D0D1D2] hover:text-white hover:bg-[#20242C] font-[400]'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate flex-1 text-start">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-[4px] font-mono ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-[#D0D1D2]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Status card */}
      <div className="p-3 border-t border-[#2A2E35] bg-[#171A20]">
        <div className="p-2.5 rounded-[4px] bg-[#20242C] border border-[#2A2E35] flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#3E6AE1]"></div>
            <div>
              <div className="font-[500] text-white">Sovereign Corridors</div>
              <div className="text-[10px] text-[#8E8E8E]">Khartoum ↔ Port Sudan</div>
            </div>
          </div>
          <span className="text-[10px] text-[#3E6AE1] font-[500]">ACTIVE</span>
        </div>
      </div>
    </aside>
  );
}
