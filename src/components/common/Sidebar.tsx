'use client';

import React from 'react';
import Image from 'next/image';
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
      isMint?: boolean;
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
          isMint: true,
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
          badge: '10 Hubs',
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
          view: 'customs_workspace',
          label: t.customsWorkspace,
          icon: FileCheck2,
          badge: 'HS Codes',
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
          badge: '8 Screens',
          isMint: true,
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
    <aside className="w-64 lg:w-72 bg-[#000000] border-e border-[#1e2c31] flex flex-col shrink-0 min-h-screen text-[#ffffff] shopify-theme">
      {/* Brand logo container (Shopify Cinematic Header) */}
      <div
        onClick={() => setCurrentView('landing')}
        className="h-16 border-b border-[#1e2c31] px-4 flex items-center justify-between cursor-pointer hover:bg-[#0a0a0a] transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-white p-1 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/20 shadow-sm">
            <Image
              src="/logo.png"
              alt="سودانيل لوجيستك"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="leading-tight">
            <h1 className="font-[600] text-[14px] tracking-tight text-white">
              {t.brandName}
            </h1>
            <p className="text-[10px] text-[#a1a1aa] truncate font-[400]">
              {t.brandTagline}
            </p>
          </div>
        </div>
        <span className="shopify-tag-mint !px-2 !py-0.5 !text-[10px]">
          OS 3.0
        </span>
      </div>

      {/* Navigation list (Shopify Pill Shape items) */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6 custom-scrollbar">
        {navigationSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <div className="px-3 pb-1 text-[11px] font-[600] tracking-wider text-[#71717a] uppercase">
              {sec.title}
            </div>

            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;

              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-[13.5px] transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#c1fbd4] text-[#000000] font-[600] shadow-sm'
                      : 'text-[#d4d4d8] hover:text-white hover:bg-white/10 font-[420]'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#000000]' : 'text-[#a1a1aa]'}`} />
                  <span className="truncate flex-1 text-start">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10.5px] px-2 py-0.5 rounded-full font-mono font-[600] ${
                        isActive
                          ? 'bg-[#000000] text-[#ffffff]'
                          : item.isMint
                          ? 'bg-[#c1fbd4] text-[#000000]'
                          : 'bg-white/15 text-[#ffffff]'
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

      {/* Footer Status card (Shopify 12px rounded card) */}
      <div className="p-3 border-t border-[#1e2c31] bg-[#000000]">
        <div className="p-3 rounded-[12px] bg-[#0a0a0a] border border-[#1e2c31] flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#c1fbd4] animate-pulse"></div>
            <div>
              <div className="font-[600] text-white">Sovereign Corridors</div>
              <div className="text-[10px] text-[#a1a1aa]">Khartoum ↔ Port Sudan</div>
            </div>
          </div>
          <span className="shopify-tag-mint !px-2 !py-0.5 !text-[10px]">
            ACTIVE
          </span>
        </div>
      </div>
    </aside>
  );
}
