'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { UserRole } from '@/types';
import {
  Search,
  Bot,
  Globe,
  Bell,
  Sparkles,
  Shield,
  Layers,
  Moon,
  Sun,
} from 'lucide-react';

export function Header() {
  const {
    role,
    setRole,
    lang,
    setLang,
    theme,
    setTheme,
    t,
    setIsAiCopilotOpen,
    setIsCommandPaletteOpen,
    incidents,
    backhauls,
  } = useApp();

  const rolesList: { key: UserRole; label: string }[] = [
    { key: 'super_admin', label: t.roleSuperAdmin },
    { key: 'dispatcher', label: t.roleDispatcher },
    { key: 'operations_manager', label: t.roleOperations },
    { key: 'carrier_admin', label: t.roleCarrier },
    { key: 'driver', label: t.roleDriver },
    { key: 'shipper_customer', label: t.roleCustomer },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gold/15 bg-navy-900/80 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between transition-all">
      {/* Search trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-3 w-full bg-navy-800/80 hover:bg-navy-800 border border-gold/20 hover:border-gold/40 text-gray-300 px-3.5 py-2 rounded-xl text-sm transition-all shadow-inner group"
        >
          <Search className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
          <span className="text-gray-400 text-xs sm:text-sm truncate">
            {t.searchPlaceholder}
          </span>
          <kbd className="hidden sm:inline-block ms-auto px-2 py-0.5 text-[10px] font-mono bg-navy-950/80 border border-gold/20 text-gold rounded-md">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right control utilities */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Backhaul Badge */}
        {backhauls.length > 0 && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{backhauls.length} {t.emptyTrucksTracked}</span>
          </div>
        )}

        {/* AI Copilot Trigger */}
        <button
          onClick={() => setIsAiCopilotOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold/20 to-amber-500/20 hover:from-gold/30 hover:to-amber-500/30 border border-gold/40 text-gold font-medium text-xs sm:text-sm shadow-lg shadow-gold/5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Bot className="w-4 h-4 text-gold animate-bounce" />
          <span className="hidden sm:inline font-semibold">AI Copilot</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </button>

        {/* Role Selector (Simulate RBAC views) */}
        <div className="relative group">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-navy-800/90 border border-gold/20 text-xs text-gray-200 cursor-pointer hover:border-gold/40 transition-colors">
            <Shield className="w-3.5 h-3.5 text-gold" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-xs text-gray-200 outline-none cursor-pointer pr-1"
            >
              {rolesList.map((r) => (
                <option key={r.key} value={r.key} className="bg-navy-900 text-gray-100">
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-gold/20 text-xs font-semibold text-gray-200 transition-colors"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-gold" />
          <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 rounded-xl bg-navy-800/80 hover:bg-navy-800 border border-gold/20 text-gray-300 hover:text-gold transition-colors relative">
            <Bell className="w-4 h-4" />
            {incidents.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center font-bold">
                {incidents.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
