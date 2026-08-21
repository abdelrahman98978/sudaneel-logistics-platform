'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { BorderCrossing } from '@/types';
import {
  Globe2,
  MapPin,
  Clock,
  Truck,
  FileCheck2,
  ShieldCheck,
  Phone,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Zap,
} from 'lucide-react';

export function CrossBorderView() {
  const { borderCrossings, t, lang } = useApp();

  const [selectedStation, setSelectedStation] = useState<BorderCrossing | null>(borderCrossings[0] || null);

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
              <Globe2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'الممرات الإقليمية والشحن عبر الحدود (Cross-Border Corridors)' : 'Cross-Border Regional Logistics & Corridors'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            {lang === 'ar'
              ? 'إدارة الشحن البري الدولي مع مصر (أرقين وأشكيت) وإثيوبيا (القلابات) وتشاد، ومراقبة قوافل الترانزيت ووثائق الكومسيا.'
              : 'End-to-end international freight corridors connecting Sudan with Egypt, Ethiopia, Chad, and regional trade hubs.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-navy-800 border border-gold/20 text-xs font-mono text-gold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            COMESA & TIR Integrated
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Active Border Posts</span>
            <MapPin className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl font-bold font-mono text-white">3 Crossings</div>
          <div className="text-[10px] text-gray-400 mt-1">Egypt, Ethiopia, Regional</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-sky-500/30 shadow-lg">
          <div className="text-xs text-sky-300 flex items-center justify-between mb-1">
            <span>Active In-Transit Convoys</span>
            <Truck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-sky-400">16 Convoys</div>
          <div className="text-[10px] text-gray-400 mt-1">Under GPS Escort</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-emerald-500/30 shadow-lg">
          <div className="text-xs text-emerald-300 flex items-center justify-between mb-1">
            <span>Avg Clearance Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">5.4 Hours</div>
          <div className="text-[10px] text-emerald-400 mt-1">-35% via digital pre-clearance</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-amber-500/30 shadow-lg">
          <div className="text-xs text-amber-300 flex items-center justify-between mb-1">
            <span>Total Queue Load</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">76 Trucks</div>
          <div className="text-[10px] text-gray-400 mt-1">Across all border gates</div>
        </div>
      </div>

      {/* Crossings Grid & Station Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Border Posts List (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-navy-900/90 border border-gold/20 p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-gold" />
            <span>{lang === 'ar' ? 'المعابر والمحطات الجمركية الحدودية' : 'Active Land Border Stations'}</span>
          </h3>

          <div className="space-y-3">
            {borderCrossings.map((station) => (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className={`w-full p-4 rounded-2xl text-start transition-all cursor-pointer border ${
                  selectedStation?.id === station.id
                    ? 'bg-navy-950 border-gold shadow-lg'
                    : 'bg-navy-950/60 border-navy-800 hover:bg-navy-800 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-mono">
                      Corridor to {station.countryTo}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">
                      {lang === 'ar' ? station.nameAr : station.name}
                    </h4>
                    <p className="text-xs text-gray-400">{station.portOrBorderPost}</p>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                      station.operatingStatus === 'normal'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : station.operatingStatus === 'congested'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    {station.operatingStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-center mt-3 pt-3 border-t border-navy-800">
                  <div className="p-2 rounded-xl bg-navy-900">
                    <span className="text-[10px] text-gray-400 block">Avg Clearance</span>
                    <span className="font-bold text-gold font-mono">{station.averageClearanceHours} hrs</span>
                  </div>
                  <div className="p-2 rounded-xl bg-navy-900">
                    <span className="text-[10px] text-gray-400 block">Queue Queue</span>
                    <span className="font-bold text-white font-mono">{station.currentQueueTrucks} Trucks</span>
                  </div>
                  <div className="p-2 rounded-xl bg-navy-900">
                    <span className="text-[10px] text-gray-400 block">Active Convoys</span>
                    <span className="font-bold text-sky-400 font-mono">{station.activeConvoysCount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Station Inspector & Document Protocols (5 cols) */}
        {selectedStation && (
          <div className="lg:col-span-5 rounded-2xl bg-navy-900/90 border border-gold/25 p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gold/15">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                  Sovereign Customs Post
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedStation.name}</h3>
                <p className="text-xs text-gray-400">Destination Corridor: {selectedStation.countryTo}</p>
              </div>
            </div>

            {/* Designated Customs Clearing Agent */}
            <div className="p-4 rounded-xl bg-navy-950 border border-gold/20 space-y-2">
              <div className="text-xs text-gray-400 font-semibold flex items-center justify-between">
                <span>Accredited Border Broker</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-bold text-white text-sm">{selectedStation.customsAgentName}</div>
              <div className="flex items-center gap-2 text-xs text-gold font-mono">
                <Phone className="w-3.5 h-3.5" />
                <span>{selectedStation.customsAgentPhone}</span>
              </div>
            </div>

            {/* Required Customs & Cross-Border Documents */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-300 block">Mandatory Corridor Clearance Documents</span>
              <div className="space-y-1.5">
                {selectedStation.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-navy-950/80 border border-navy-800 flex items-center gap-2 text-xs text-gray-200">
                    <FileCheck2 className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert(`Initiating Pre-Clearance Customs Escort for ${selectedStation.name}`)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Issue Digital Transit Escort Bond</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
