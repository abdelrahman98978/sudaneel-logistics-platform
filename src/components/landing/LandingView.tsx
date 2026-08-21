'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Compass,
  Search,
  Truck,
  Repeat,
  ShieldCheck,
  Zap,
  Globe,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

export function LandingView() {
  const { setCurrentView, setSelectedShipmentId, shipments, t, lang, setLang } = useApp();
  const [trackingInput, setTrackingInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    const match = shipments.find(
      (s) => s.trackingNumber.toLowerCase() === trackingInput.trim().toLowerCase()
    );
    if (match) {
      setSelectedShipmentId(match.id);
      setCurrentView('tracking_detail');
    } else {
      setSelectedShipmentId(shipments[0].id);
      setCurrentView('tracking_detail');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Network Visualization & Live Tracking Bar */}
      <section className="relative rounded-3xl bg-gradient-to-b from-navy-900 via-navy-950 to-[#030712] border border-gold/30 p-6 sm:p-12 shadow-2xl overflow-hidden text-center space-y-6">
        {/* Glow & Mesh Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>

        {/* Brand Tag Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-semibold shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sudan & Regional Logistics Operating System</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Move Smarter. <span className="text-gradient-gold">Deliver Further.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          One intelligent logistics network connecting shipments, carriers, fleets, and warehouses across Sudan and East Africa.
        </p>

        {/* Live Tracking Quick Widget (Hero Embedded) */}
        <div className="max-w-xl mx-auto pt-2">
          <form
            onSubmit={handleTrackSubmit}
            className="p-2 rounded-2xl bg-navy-900/90 backdrop-blur-xl border border-gold/40 shadow-2xl flex items-center gap-2"
          >
            <div className="ps-3 flex items-center gap-2 text-gold">
              <Search className="w-5 h-5" />
            </div>
            <input
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder={lang === 'ar' ? 'أدخل رقم الشحنة (مثال: SDN-88419)...' : 'Enter tracking number (e.g. SDN-88419)...'}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-xs sm:text-sm font-medium"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              {lang === 'ar' ? 'تتبع الشحنة' : 'Track Cargo'}
            </button>
          </form>
        </div>

        {/* CTA Launch Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setCurrentView('create_shipment')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-navy-950 font-bold text-sm shadow-xl hover:scale-105 transition-transform cursor-pointer"
          >
            {lang === 'ar' ? 'شحن فوري (Ship Now)' : 'Ship Now (Create Load)'}
          </button>
          <button
            onClick={() => setCurrentView('control_tower')}
            className="px-6 py-3 rounded-xl bg-navy-800/90 hover:bg-navy-800 text-white font-bold text-sm border border-gold/30 shadow-lg hover:border-gold cursor-pointer"
          >
            {lang === 'ar' ? 'عرض مركز العمليات (Control Tower)' : 'Live Control Tower'}
          </button>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            {lang === 'ar' ? 'منظومة الخدمات اللوجستية المتكاملة' : 'Intelligent Logistics Ecosystem'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Engineered for high reliability, sovereign corridors, and maximum fleet efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Service 1: Digital Freight Exchange */}
          <div className="p-6 rounded-2xl bg-navy-900/80 border border-gold/25 shadow-xl space-y-3 hover:border-gold/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
              <Repeat className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Freight Exchange & Backhaul Matching</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Match cargo with empty returning trucks across Khartoum, Port Sudan, and regional states to slash costs by 28%.
            </p>
          </div>

          {/* Service 2: Cold Chain */}
          <div className="p-6 rounded-2xl bg-navy-900/80 border border-gold/25 shadow-xl space-y-3 hover:border-gold/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Certified Cold-Chain Transport</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Active -20°C to +8°C telemetry for pharmaceuticals, fresh meats, and critical vaccines with real-time alerts.
            </p>
          </div>

          {/* Service 3: Port Sudan Customs & Port Terminal */}
          <div className="p-6 rounded-2xl bg-navy-900/80 border border-gold/25 shadow-xl space-y-3 hover:border-gold/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Port Sudan Terminal & Cross-Border</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Automated container clearance, wharf handling, and multimodal transit to Egypt, Saudi Arabia, and Chad.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audiences: For Businesses, For Carriers, For Drivers */}
      <section className="p-8 rounded-3xl bg-navy-950 border border-gold/20 shadow-2xl space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
          Built for Every Stakeholder in the Supply Chain
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-3">
            <div className="font-bold text-gold text-base">For Shippers & Enterprises</div>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant competitive spot & contract pricing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% visibility with Digital Shipment Passport</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Corporate credit wallets & verified PODs</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-3">
            <div className="font-bold text-sky-400 text-base">For Fleet Owners & Carriers</div>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero deadhead miles with Backhaul Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Guaranteed 24-hour post-POD settlements</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Fuel management & preventive maintenance</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-3">
            <div className="font-bold text-emerald-400 text-base">For Professional Drivers</div>
            <ul className="text-xs text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Driver Safety Mode (high-contrast HUD)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Offline mode with automatic sync queue</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant mobile wallet payouts & emergency SOS</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
