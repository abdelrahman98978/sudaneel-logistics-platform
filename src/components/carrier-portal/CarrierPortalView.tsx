'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import {
  Building2,
  Truck,
  CheckCircle2,
  DollarSign,
  Users,
  Award,
} from 'lucide-react';

export function CarrierPortalView() {
  const { carriers, vehicles, drivers } = useApp();
  const currentCarrier = carriers[0];

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Carrier Top Profile Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[4px] bg-[#3E6AE1] flex items-center justify-center text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-[500] text-[#171A20]">{currentCarrier.name}</h2>
              <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] font-[500] font-mono">
                {currentCarrier.ratingCategory} Certified
              </span>
            </div>
            <p className="text-[13px] text-[#5C5E62] mt-0.5">
              {currentCarrier.city}, Sudan • {currentCarrier.phone} • {currentCarrier.email}
            </p>
          </div>
        </div>

        {/* Trust Score */}
        <div className="flex items-center gap-3 bg-[#F4F4F4] p-3 rounded-[4px] border border-[#EEEEEE]">
          <Award className="w-6 h-6 text-[#3E6AE1]" />
          <div>
            <div className="text-[11px] text-[#8E8E8E] uppercase font-[500]">Sudaneel Trust Score</div>
            <div className="text-[18px] font-[500] font-mono text-[#171A20]">{currentCarrier.trustScore} / 100</div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Fleet Size</span>
            <Truck className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">{currentCarrier.fleetCount} Trucks</div>
          <div className="text-[11px] text-[#3E6AE1] mt-1">{currentCarrier.activeTrips} On Trips</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>On-Time Delivery</span>
            <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">{currentCarrier.onTimeDeliveryRate}%</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">1,840 Total Trips</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Monthly Payouts</span>
            <DollarSign className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">48.5M <span className="text-[12px]">SDG</span></div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Settled within 24h</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Active Drivers</span>
            <Users className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">30 Drivers</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">100% License Verified</div>
        </div>
      </div>

      {/* Carrier Drivers & Fleet List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Drivers */}
        <div className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
          <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
            <Users className="w-4 h-4 text-[#3E6AE1]" />
            <span>Assigned Drivers & Scores</span>
          </h3>
          <div className="space-y-2">
            {drivers.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between text-[13px]"
              >
                <div>
                  <div className="font-[500] text-[#171A20]">{d.nameAr || d.name}</div>
                  <div className="text-[11px] text-[#5C5E62]">{d.phone} • {d.totalTrips} Trips</div>
                </div>
                <div className="text-end">
                  <span className="font-mono font-[500] text-[#171A20] bg-white px-2 py-0.5 rounded-[2px] border border-[#D0D1D2] text-[11px]">
                    Trust: {d.trustScore}
                  </span>
                  <div className="text-[11px] text-[#3E6AE1] mt-1 font-mono">{d.onTimeRate}% OTD</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Trucks */}
        <div className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
          <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
            <Truck className="w-4 h-4 text-[#3E6AE1]" />
            <span>Fleet Availability</span>
          </h3>
          <div className="space-y-2">
            {vehicles.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between text-[13px]"
              >
                <div>
                  <div className="font-mono font-[500] text-[#171A20]">{v.plateNumber}</div>
                  <div className="text-[11px] text-[#5C5E62]">{v.makeModel} ({v.capacityTons}T)</div>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-[2px] font-[500] font-mono bg-white border border-[#D0D1D2]">
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
