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
  Zap,
} from 'lucide-react';

export function CrossBorderView() {
  const { borderCrossings, showToast, lang } = useApp();
  const [selectedStation, setSelectedStation] = useState<BorderCrossing | null>(borderCrossings[0] || null);

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'الممرات الإقليمية والشحن عبر الحدود (Cross-Border Corridors)' : 'Cross-Border Regional Logistics & Corridors'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] max-w-2xl mt-1">
            {lang === 'ar'
              ? 'إدارة الشحن البري الدولي مع مصر (أرقين وأشكيت) وإثيوبيا (القلابات) وتشاد، ومراقبة قوافل الترانزيت ووثائق الكومسيا.'
              : 'End-to-end international freight corridors connecting Sudan with Egypt, Ethiopia, Chad, and regional trade hubs.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-[4px] bg-[#F4F4F4] border border-[#D0D1D2] text-[12px] font-mono text-[#171A20] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3E6AE1]"></span>
            COMESA & TIR Integrated
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Active Border Posts</span>
            <MapPin className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">3 Crossings</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Egypt, Ethiopia, Regional</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>In-Transit Convoys</span>
            <Truck className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">16 Convoys</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Under GPS Escort</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Avg Clearance Time</span>
            <Clock className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#3E6AE1]">5.4 Hours</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">-35% via digital pre-clearance</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Total Queue Load</span>
            <AlertTriangle className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">76 Trucks</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Across all border gates</div>
        </div>
      </div>

      {/* Crossings Grid & Station Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Border Posts List (7 cols) */}
        <div className="lg:col-span-7 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
            <Globe2 className="w-4 h-4 text-[#3E6AE1]" />
            <span>{lang === 'ar' ? 'المعابر والمحطات الجمركية الحدودية' : 'Active Land Border Stations'}</span>
          </h3>

          <div className="space-y-3">
            {borderCrossings.map((station) => (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className={`w-full p-4 rounded-[4px] text-start transition-colors duration-330 cursor-pointer border ${
                  selectedStation?.id === station.id
                    ? 'bg-[#F4F4F4] border-[#171A20]'
                    : 'bg-[#FFFFFF] border-[#EEEEEE] hover:bg-[#F4F4F4]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-[500] px-2 py-0.5 rounded-[2px] bg-[#FFFFFF] text-[#171A20] border border-[#D0D1D2] font-mono">
                      Corridor to {station.countryTo}
                    </span>
                    <h4 className="text-[15px] font-[500] text-[#171A20] mt-1">
                      {lang === 'ar' ? station.nameAr : station.name}
                    </h4>
                    <p className="text-[12px] text-[#5C5E62]">{station.portOrBorderPost}</p>
                  </div>

                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-[2px] font-[500] border ${
                      station.operatingStatus === 'normal'
                        ? 'bg-[#FFFFFF] text-[#171A20] border-[#D0D1D2]'
                        : station.operatingStatus === 'congested'
                        ? 'bg-[#FFFFFF] text-[#3E6AE1] border-[#3E6AE1]'
                        : 'bg-[#FFFFFF] text-[#393C41] border-[#D0D1D2]'
                    }`}
                  >
                    {station.operatingStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[12px] text-center mt-3 pt-3 border-t border-[#EEEEEE]">
                  <div className="p-2 rounded-[2px] bg-[#FFFFFF] border border-[#EEEEEE]">
                    <span className="text-[10px] text-[#8E8E8E] block">Avg Clearance</span>
                    <span className="font-[500] text-[#171A20] font-mono">{station.averageClearanceHours} hrs</span>
                  </div>
                  <div className="p-2 rounded-[2px] bg-[#FFFFFF] border border-[#EEEEEE]">
                    <span className="text-[10px] text-[#8E8E8E] block">Queue</span>
                    <span className="font-[500] text-[#171A20] font-mono">{station.currentQueueTrucks} Trucks</span>
                  </div>
                  <div className="p-2 rounded-[2px] bg-[#FFFFFF] border border-[#EEEEEE]">
                    <span className="text-[10px] text-[#8E8E8E] block">Active Convoys</span>
                    <span className="font-[500] text-[#3E6AE1] font-mono">{station.activeConvoysCount}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Station Inspector (5 cols) */}
        {selectedStation && (
          <div className="lg:col-span-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#EEEEEE]">
              <div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] uppercase font-[500]">
                  Customs Post
                </span>
                <h3 className="text-[18px] font-[500] text-[#171A20] mt-1">{selectedStation.name}</h3>
                <p className="text-[13px] text-[#5C5E62]">Destination Corridor: {selectedStation.countryTo}</p>
              </div>
            </div>

            {/* Designated Customs Clearing Agent */}
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2">
              <div className="text-[12px] text-[#5C5E62] font-[500] flex items-center justify-between">
                <span>Accredited Border Broker</span>
                <ShieldCheck className="w-4 h-4 text-[#3E6AE1]" />
              </div>
              <div className="font-[500] text-[#171A20] text-[14px]">{selectedStation.customsAgentName}</div>
              <div className="flex items-center gap-2 text-[12px] text-[#3E6AE1] font-mono">
                <Phone className="w-3.5 h-3.5" />
                <span>{selectedStation.customsAgentPhone}</span>
              </div>
            </div>

            {/* Required Customs & Cross-Border Documents */}
            <div className="space-y-2">
              <span className="text-[12px] font-[500] text-[#171A20] block">Mandatory Corridor Clearance Documents</span>
              <div className="space-y-1.5">
                {selectedStation.requiredDocuments.map((doc, idx) => (
                  <div key={idx} className="p-2.5 rounded-[2px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center gap-2 text-[12px] text-[#171A20]">
                    <FileCheck2 className="w-4 h-4 text-[#3E6AE1] flex-shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => showToast(
                lang === 'ar' ? 'إصدار بوليصة العبور الجمركي' : 'Customs Escort Bond Issued',
                lang === 'ar' ? `تم إصدار وثيقة التخليص المسبق والضمان الجمركي لمحطة ${selectedStation.nameAr || selectedStation.name}` : `Digital Transit Escort Bond issued for ${selectedStation.name}`,
                'success'
              )}
              className="btn-tesla-primary w-full !min-h-[38px] text-[13px] flex items-center justify-center gap-2"
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
