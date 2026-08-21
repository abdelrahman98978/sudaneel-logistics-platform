'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Smartphone,
  Navigation,
  ShieldAlert,
  CheckCircle2,
  Camera,
  QrCode,
  DollarSign,
  Wifi,
  WifiOff,
  Phone,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export function DriverAppView() {
  const { drivers, shipments, updateShipmentStatus, t, lang } = useApp();
  const driver = drivers[0];
  const activeShipment = shipments.find((s) => s.status === 'in_transit') || shipments[0];

  const [isSafetyModeActive, setIsSafetyModeActive] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);

  const toggleOffline = () => {
    setIsOffline((prev) => !prev);
    if (!isOffline) {
      setOfflineQueueCount(4); // 4 queued GPS pings
    } else {
      setTimeout(() => setOfflineQueueCount(0), 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Mobile Device Frame Container */}
      <div className="rounded-3xl bg-navy-950 border-4 border-gold/40 shadow-2xl overflow-hidden flex flex-col min-h-[720px] text-gray-200">
        {/* Device Top Status Bar */}
        <div className="bg-navy-900 px-4 py-2 flex items-center justify-between text-xs border-b border-gold/15">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-300">
            <span>09:42</span>
            <span>• 5G</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Offline Toggle Simulator */}
            <button
              onClick={toggleOffline}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                isOffline
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}
            >
              {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              <span>{isOffline ? `Offline (${offlineQueueCount})` : 'Online'}</span>
            </button>

            {/* Safety Mode Toggle */}
            <button
              onClick={() => setIsSafetyModeActive(!isSafetyModeActive)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                isSafetyModeActive
                  ? 'bg-amber-400 text-navy-950 border-amber-400'
                  : 'bg-navy-800 text-gold border-gold/30'
              }`}
            >
              {isSafetyModeActive ? 'Safety HUD ON' : 'Safety Mode'}
            </button>
          </div>
        </div>

        {/* Safety Mode Screen Overlay (High Contrast, Large Elements) */}
        {isSafetyModeActive ? (
          <div className="flex-1 p-5 bg-black flex flex-col justify-between text-center select-none animate-in fade-in">
            {/* Large Speed & Navigation */}
            <div className="space-y-2 pt-4">
              <div className="text-gray-400 text-xs font-mono tracking-widest uppercase">
                Khartoum ➔ Port Sudan Corridor
              </div>
              <div className="text-7xl font-bold font-mono text-white tracking-tighter">
                68 <span className="text-xl text-gold font-sans">km/h</span>
              </div>
              <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Speed limit compliant (80 km/h)
              </div>
            </div>

            {/* Next Turn Direction HUD */}
            <div className="p-5 rounded-2xl bg-navy-900/90 border-2 border-gold space-y-2">
              <Navigation className="w-12 h-12 text-gold mx-auto animate-pulse" />
              <div className="text-lg font-bold text-white">In 14 km: Hayya Summit Checkpoint</div>
              <div className="text-xs text-gray-300">Maintain current lane, pre-clearance barcode active</div>
            </div>

            {/* Large Predictive ETA */}
            <div className="p-4 rounded-xl bg-navy-950 border border-gold/30">
              <div className="text-xs text-gray-400 uppercase font-mono">Predictive Arrival ETA</div>
              <div className="text-3xl font-bold font-mono text-gold">16:45 Today</div>
            </div>

            {/* Giant Emergency Button */}
            <button
              onClick={() => alert(lang === 'ar' ? 'تم إرسال نداء الطوارئ وتحديد موقعك لحظياً لمركز العمليات' : 'Emergency SOS broadcasted with live telemetry to Operations Center')}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-lg shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
            >
              <ShieldAlert className="w-6 h-6" />
              <span>EMERGENCY SOS (طوارئ)</span>
            </button>
          </div>
        ) : (
          /* Standard Driver Job Workflow View */
          <div className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {/* Driver Profile Header */}
            <div className="p-3.5 rounded-2xl bg-navy-900/90 border border-gold/25 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">{driver.nameAr || driver.name}</div>
                <div className="text-[11px] text-gold font-mono">{driver.currentVehiclePlate}</div>
              </div>
              <div className="text-end">
                <div className="text-xs font-bold font-mono text-emerald-400">
                  {driver.walletBalance.toLocaleString()} SDG
                </div>
                <div className="text-[10px] text-gray-400">Wallet Balance</div>
              </div>
            </div>

            {/* Current Active Trip Card */}
            <div className="p-4 rounded-2xl bg-navy-900 border border-gold/35 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gold/15">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 uppercase font-mono">
                  Active Mission
                </span>
                <span className="font-mono text-xs font-bold text-white">{activeShipment.trackingNumber}</span>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">
                  {activeShipment.origin.city} ➔ {activeShipment.destination.city}
                </h4>
                <p className="text-xs text-gray-300 mt-0.5">{activeShipment.cargoDescription}</p>
              </div>

              {/* Trip Checklist Progression */}
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. Manifest & Loading Confirmed</span>
                </div>
                <div className="flex items-center gap-2 text-gold font-semibold">
                  <span className="w-4 h-4 rounded-full bg-gold/20 border border-gold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>2. En Route: Hayya Pass Checkpoint</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="w-4 h-4 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>3. Delivery OTP & Digital POD Verification</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setIsSafetyModeActive(true)}
                  className="py-2.5 rounded-xl bg-gold hover:bg-gold/90 text-navy-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>HUD Safety Mode</span>
                </button>
                <button
                  onClick={() => alert(lang === 'ar' ? 'تم فتح الكاميرا لتوثيق التحميل' : 'Camera opened for cargo snapshot')}
                  className="py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-gold/20 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-gold" />
                  <span>Cargo Photo</span>
                </button>
              </div>
            </div>

            {/* Offline Sync Status Indicator */}
            {isOffline && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-xs space-y-1">
                <div className="font-bold text-rose-400 flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline Storage Mode Active</span>
                </div>
                <div className="text-gray-300 text-[11px]">
                  All GPS telemetry, timestamps and status events are stored locally. Will auto-sync when network reconnects.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
