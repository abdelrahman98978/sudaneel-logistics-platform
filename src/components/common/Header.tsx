'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { UserRole } from '@/types';
import {
  Search,
  Bot,
  Globe,
  Bell,
  Shield,
  Settings,
  Smartphone,
} from 'lucide-react';

export function Header() {
  const {
    role,
    setRole,
    lang,
    setLang,
    t,
    setCurrentView,
    setIsAiCopilotOpen,
    setIsCommandPaletteOpen,
    showToast,
    incidents,
    backhauls,
    claims,
  } = useApp();

  const rolesList: { key: UserRole; label: string }[] = [
    { key: 'super_admin', label: t.roleSuperAdmin },
    { key: 'operations_manager', label: t.roleOperations },
    { key: 'dispatcher', label: t.roleDispatcher },
    { key: 'fleet_manager', label: t.roleFleetManager },
    { key: 'finance_manager', label: t.roleFinance },
    { key: 'carrier_admin', label: t.roleCarrier },
    { key: 'driver', label: t.roleDriver },
    { key: 'shipper_customer', label: t.roleCustomer },
    { key: 'warehouse_manager', label: t.roleWarehouseManager },
    { key: 'customs_agent', label: t.roleCustomsAgent },
    { key: 'risk_auditor', label: t.roleRiskAuditor },
  ];

  const handleNotificationClick = () => {
    showToast(
      lang === 'ar' ? 'مركز العمليات والتنبيهات الحية' : 'Live Operations Radar',
      lang === 'ar'
        ? `يوجد ${incidents.length} بلاغات طارئة نشطة و ${claims.length} مطالبات قيد المراجعة.`
        : `${incidents.length} emergency incidents and ${claims.length} pending claims active.`,
      'info'
    );
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[#e4e4e7] bg-[#ffffff]/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between transition-all duration-200 shopify-theme">
      {/* Search trigger (Shopify Pill Search Input) */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setCurrentView('landing')}
          className="flex lg:hidden items-center gap-2 p-1 rounded-full hover:bg-[#fbfbf5] transition-colors flex-shrink-0"
          title="الرئيسية"
        >
          <img src="/images/brand-logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-contain border border-[#e4e4e7]" />
        </button>
        
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 w-full bg-[#ffffff] hover:bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] px-4 py-2 rounded-full text-[14px] transition-colors duration-200 cursor-pointer shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
        >
          <Search className="w-4 h-4 text-[#71717a] flex-shrink-0" />
          <span className="text-[#71717a] text-[13px] truncate font-[420]">
            {t.searchPlaceholder}
          </span>
          <kbd className="hidden sm:inline-block ms-auto px-2 py-0.5 text-[11px] font-mono bg-[#fbfbf5] border border-[#e4e4e7] text-[#71717a] rounded-full">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right control utilities (Shopify Pill Buttons & Badges) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Backhaul Badge (Aloe-10 Mint Pill) */}
        {backhauls.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 shopify-tag-mint">
            <span className="w-2 h-2 rounded-full bg-[#000000] animate-pulse"></span>
            <span>{backhauls.length} {t.emptyTrucksTracked}</span>
          </div>
        )}

        {/* Mobile App Showroom Quick Pill */}
        <button
          onClick={() => setCurrentView('mobile_app')}
          className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fbfbf5] hover:bg-white border border-[#e4e4e7] text-[#000000] text-[13px] font-[500] transition-colors duration-200 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'تطبيق الجوال' : 'Mobile App'}</span>
        </button>

        {/* Control Tower Quick Jump Button */}
        <button
          onClick={() => setCurrentView('control_tower')}
          className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#000000] hover:bg-[#3f3f46] text-white text-[13px] font-[500] transition-colors duration-200 cursor-pointer"
        >
          <span>{lang === 'ar' ? 'لوحة التحكم' : 'Control Tower'}</span>
        </button>

        {/* AI Copilot Trigger (Shopify Aloe Pill) */}
        <button
          onClick={() => setIsAiCopilotOpen(true)}
          className="btn-shopify-aloe !py-1.5 !px-3.5 !text-[13px]"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Role Selector (Shopify Pill Dropdown) */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#e4e4e7] text-[13px] text-[#000000] cursor-pointer hover:bg-[#fbfbf5] transition-colors duration-200 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-[#71717a] flex-shrink-0" />
            <select
              value={role}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setRole(newRole);
                showToast(
                  lang === 'ar' ? 'تم تبديل الدور' : 'Role Switched',
                  lang === 'ar' ? `أنت الآن تعمل بصلاحيات: ${newRole}` : `Switched active role to: ${newRole}`,
                  'info'
                );
              }}
              className="bg-transparent border-0 text-[12px] font-[500] text-[#000000] cursor-pointer outline-none pe-2"
            >
              {rolesList.map((r) => (
                <option key={r.key} value={r.key} className="text-[#000000] bg-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Language switcher (Shopify Pill) */}
        <button
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fbfbf5] border border-[#e4e4e7] text-[12px] font-[500] text-[#000000] transition-colors duration-200 cursor-pointer shadow-sm"
          title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
        >
          <Globe className="w-3.5 h-3.5 text-[#71717a]" />
          <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
        </button>

        {/* Emergency radar notifications */}
        <button
          onClick={handleNotificationClick}
          className="relative p-2 rounded-full bg-[#ffffff] hover:bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] transition-colors duration-200 cursor-pointer shadow-sm"
          title={lang === 'ar' ? 'التنبيهات' : 'Notifications'}
        >
          <Bell className="w-4 h-4" />
          {(incidents.length > 0 || claims.length > 0) && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#000000] text-white text-[9px] font-bold flex items-center justify-center">
              {incidents.length + claims.length}
            </span>
          )}
        </button>

        {/* Quick Settings Icon */}
        <button
          onClick={() => setCurrentView('settings_rbac')}
          className="p-2 rounded-full bg-[#ffffff] hover:bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] transition-colors duration-200 cursor-pointer shadow-sm"
          title={t.settings}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
