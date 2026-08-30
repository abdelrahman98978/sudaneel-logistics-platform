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
    <header className="sticky top-0 z-30 h-14 border-b border-[#EEEEEE] bg-[#FFFFFF]/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between transition-all duration-330">
      {/* Search trigger (4px radius, minimalist border #D0D1D2) */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 w-full bg-[#FFFFFF] hover:bg-[#F4F4F4] border border-[#D0D1D2] text-[#393C41] px-3 py-1.5 rounded-[4px] text-[14px] transition-colors duration-330 cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#8E8E8E] flex-shrink-0" />
          <span className="text-[#8E8E8E] text-[13px] truncate">
            {t.searchPlaceholder}
          </span>
          <kbd className="hidden sm:inline-block ms-auto px-1.5 py-0.5 text-[11px] font-mono bg-[#F4F4F4] border border-[#EEEEEE] text-[#5C5E62] rounded-[2px]">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right control utilities */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Backhaul Badge */}
        {backhauls.length > 0 && (
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#F4F4F4] text-[#171A20] text-[12px] font-[500]">
            <span className="w-2 h-2 rounded-full bg-[#3E6AE1]"></span>
            <span>{backhauls.length} {t.emptyTrucksTracked}</span>
          </div>
        )}

        {/* AI Copilot Trigger (Tesla Accent Style) */}
        <button
          onClick={() => setIsAiCopilotOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#3E6AE1] hover:bg-[#345ac2] text-white text-[13px] font-[500] transition-colors duration-330 cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Role Selector */}
        <div className="relative">
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[13px] text-[#171A20] cursor-pointer hover:bg-[#F4F4F4] transition-colors duration-330">
            <Shield className="w-3.5 h-3.5 text-[#5C5E62] flex-shrink-0" />
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
              className="bg-transparent text-[13px] font-[400] text-[#171A20] outline-none cursor-pointer pr-1"
            >
              {rolesList.map((r) => (
                <option key={r.key} value={r.key} className="bg-white text-[#171A20]">
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Settings & RBAC Button */}
        <button
          onClick={() => setCurrentView('settings_rbac')}
          className="p-1.5 rounded-[4px] bg-[#FFFFFF] hover:bg-[#F4F4F4] border border-[#D0D1D2] text-[#5C5E62] hover:text-[#171A20] transition-colors duration-330 cursor-pointer"
          title="Platform Settings & RBAC"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] bg-[#FFFFFF] hover:bg-[#F4F4F4] border border-[#D0D1D2] text-[13px] font-[500] text-[#171A20] transition-colors duration-330 cursor-pointer"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-[#5C5E62]" />
          <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={handleNotificationClick}
            className="p-1.5 rounded-[4px] bg-[#FFFFFF] hover:bg-[#F4F4F4] border border-[#D0D1D2] text-[#5C5E62] hover:text-[#171A20] transition-colors duration-330 relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {incidents.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#3E6AE1] text-[9px] text-white flex items-center justify-center font-[500]">
                {incidents.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
