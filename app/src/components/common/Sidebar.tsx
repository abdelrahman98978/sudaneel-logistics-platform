'use client';

import React from 'react';
import { useApp, AppView } from '@/lib/store';
import {
  Compass,
  Repeat,
  Cpu,
  Package,
  PlusCircle,
  Truck,
  Building2,
  Smartphone,
  ShieldAlert,
  Wallet,
  BarChart3,
  Globe,
  Radio,
  Sparkles,
} from 'lucide-react';

export function Sidebar() {
  const { currentView, setCurrentView, t, backhauls, incidents, role } = useApp();

  const navigationItems: {
    view: AppView;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
    allowedRoles?: string[];
  }[] = [
    {
      view: 'control_tower',
      label: t.controlTower,
      icon: Compass,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      view: 'marketplace',
      label: t.marketplace,
      icon: Repeat,
      badge: backhauls.length > 0 ? `${backhauls.length} Backhaul` : undefined,
      badgeColor: 'bg-gold/20 text-gold border-gold/30',
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
      view: 'incidents',
      label: t.incidentCenter,
      icon: ShieldAlert,
      badge: incidents.length > 0 ? incidents.length : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    },
    {
      view: 'finance',
      label: t.financeWallets,
      icon: Wallet,
    },
    {
      view: 'analytics',
      label: t.analytics,
      icon: BarChart3,
    },
    {
      view: 'landing',
      label: t.publicPortal,
      icon: Globe,
    },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-navy-950/95 border-e border-gold/15 flex flex-col shrink-0 min-h-screen text-gray-200">
      {/* Brand logo container */}
      <div className="h-16 border-b border-gold/15 px-6 flex items-center gap-3 bg-gradient-to-r from-navy-900/60 to-transparent">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-800 to-navy-900 border border-gold/40 flex items-center justify-center shadow-lg shadow-gold/10">
          <Radio className="w-5 h-5 text-gold animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            <span>{t.brandName}</span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 font-mono">
              OS 3.0
            </span>
          </h1>
          <p className="text-[10px] text-gray-400 truncate max-w-[170px]">
            {t.brandTagline}
          </p>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-gold/60 uppercase">
          {t.platformOS}
        </div>

        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;

          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-gold/20 via-navy-800 to-navy-800 text-white font-semibold shadow-md border border-gold/40'
                  : 'text-gray-400 hover:text-gray-100 hover:bg-navy-900/80 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-gold' : 'text-gray-400 group-hover:text-gold'
                }`}
              />
              <span className="truncate flex-1 text-start">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-medium ${
                    item.badgeColor || 'bg-navy-800 text-gray-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Status card */}
      <div className="p-3.5 border-t border-gold/15 bg-navy-900/40">
        <div className="p-3 rounded-xl bg-navy-900/90 border border-gold/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <div className="text-xs font-semibold text-white">Sudan Corridor Live</div>
              <div className="text-[10px] text-gray-400">Khartoum ↔ Port Sudan</div>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-gold" />
        </div>
      </div>
    </aside>
  );
}
