'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Compass,
  Truck,
  AlertTriangle,
  Radio,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Layers,
  Thermometer,
  ShieldCheck,
  Fuel,
  Maximize2,
  Filter,
  Navigation,
} from 'lucide-react';

export function ControlTowerView() {
  const {
    vehicles,
    shipments,
    incidents,
    backhauls,
    t,
    setSelectedShipmentId,
    setCurrentView,
    lang,
  } = useApp();

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(vehicles[0]?.id || null);
  const [mapLayer, setMapLayer] = useState<'all' | 'vehicles' | 'shipments' | 'risks'>('all');

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];
  const inTransitCount = vehicles.filter((v) => v.status === 'in_transit').length;
  const emptyBackhaulCount = backhauls.length;

  return (
    <div className="space-y-4">
      {/* Top Executive KPI Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{t.activeShipments}</span>
            <Truck className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">
            {shipments.length}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            100% Telemetry Active
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{t.inTransitLoads}</span>
            <Navigation className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-sky-400">
            {inTransitCount}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Avg 68 km/h on corridor</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-emerald-500/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
            <span>{t.emptyTrucksTracked}</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
            {emptyBackhaulCount}
          </div>
          <div className="text-[10px] text-emerald-300 mt-1">Ready for backhaul match</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{t.onTimeDeliveryRate}</span>
            <CheckCircle2 className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-gold">97.4%</div>
          <div className="text-[10px] text-gray-400 mt-1">+1.8% vs last month</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{t.avgCostPerKm}</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300">
            2,450 <span className="text-xs">SDG</span>
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">-14% via Backhaul</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-navy-900/80 border border-rose-500/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-rose-300 mb-1">
            <span>Active Incidents</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400">
            {incidents.length}
          </div>
          <div className="text-[10px] text-rose-300 mt-1">1 checkpoint, 1 rescue</div>
        </div>
      </div>

      {/* Main Operations Control Board (Interactive Map + Live Asset Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Vector Map Simulation Container (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-navy-950 border border-gold/25 shadow-2xl overflow-hidden flex flex-col relative min-h-[500px] lg:min-h-[580px]">
          {/* Map Controls Header Overlay */}
          <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto bg-navy-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gold/30 shadow-lg text-xs text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold">Sudan Regional Gateway</span>
              <span className="text-gray-400 font-mono">15.50°N, 32.55°E</span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto bg-navy-900/90 backdrop-blur-md p-1 rounded-xl border border-gold/30 shadow-lg">
              <button
                onClick={() => setMapLayer('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mapLayer === 'all' ? 'bg-gold text-navy-950 font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                All Layers
              </button>
              <button
                onClick={() => setMapLayer('vehicles')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mapLayer === 'vehicles' ? 'bg-gold text-navy-950 font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Fleet Only
              </button>
              <button
                onClick={() => setMapLayer('risks')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mapLayer === 'risks' ? 'bg-rose-500 text-white font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Checkpoints & Risks
              </button>
            </div>
          </div>

          {/* Interactive Tactical SVG Map */}
          <div className="flex-1 relative bg-gradient-to-b from-[#030914] via-[#060d1e] to-[#0a162e] overflow-hidden flex items-center justify-center">
            {/* Grid Mesh Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>

            <svg viewBox="0 0 900 600" className="w-full h-full object-contain select-none">
              {/* Regional Outline / Major Logistics Corridors */}
              <defs>
                <linearGradient id="corridorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Red Sea Coastline Graphic */}
              <path
                d="M 680 50 Q 740 180 820 320 T 880 550"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="6"
                strokeDasharray="4 4"
                opacity="0.4"
              />
              <text x="760" y="240" fill="#3b82f6" fontSize="13" opacity="0.5" fontFamily="monospace">
                RED SEA (بحر الأحمر)
              </text>

              {/* Primary Strategic Highway: Khartoum (280, 320) to Port Sudan (720, 140) */}
              <path
                d="M 280 320 L 390 220 L 540 170 L 720 140"
                fill="none"
                stroke="url(#corridorGlow)"
                strokeWidth="4"
                filter="url(#glow)"
              />

              {/* Secondary Highway: Khartoum (280, 320) to Wad Madani (350, 420) to Gedaref (480, 440) to Port Sudan */}
              <path
                d="M 280 320 L 350 420 L 480 440 L 720 140"
                fill="none"
                stroke="#d4af37"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.6"
              />

              {/* Highway to Atbara (390, 220) to Halfa/Egypt border */}
              <path
                d="M 390 220 L 410 80"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.5"
              />

              {/* Major Cities / Hub Nodes */}
              {/* Khartoum */}
              <g transform="translate(280, 320)">
                <circle r="14" fill="#060d1e" stroke="#d4af37" strokeWidth="2.5" />
                <circle r="6" fill="#d4af37" />
                <text x="18" y="5" fill="#ffffff" fontSize="13" fontWeight="bold">
                  Khartoum (الخرطوم)
                </text>
                <text x="18" y="20" fill="#94a3b8" fontSize="10">
                  Main Industrial & Logistics Hub
                </text>
              </g>

              {/* Port Sudan */}
              <g transform="translate(720, 140)">
                <circle r="16" fill="#060d1e" stroke="#0ea5e9" strokeWidth="3" />
                <circle r="7" fill="#0ea5e9" className="animate-ping" />
                <circle r="6" fill="#0ea5e9" />
                <text x="-150" y="5" fill="#ffffff" fontSize="13" fontWeight="bold">
                  Port Sudan (بورتسودان)
                </text>
                <text x="-140" y="20" fill="#38bdf8" fontSize="10">
                  Container Port & Free Zone
                </text>
              </g>

              {/* Atbara */}
              <g transform="translate(390, 220)">
                <circle r="8" fill="#060d1e" stroke="#d4af37" strokeWidth="2" />
                <circle r="3" fill="#d4af37" />
                <text x="12" y="4" fill="#e2e8f0" fontSize="11">
                  Atbara (عطبرة)
                </text>
              </g>

              {/* Hayya Junction */}
              <g transform="translate(540, 170)">
                <circle r="9" fill="#060d1e" stroke="#f59e0b" strokeWidth="2" />
                <circle r="4" fill="#f59e0b" />
                <text x="14" y="4" fill="#fcd34d" fontSize="11">
                  Hayya Pass (ممر هيا)
                </text>
              </g>

              {/* Wad Madani */}
              <g transform="translate(350, 420)">
                <circle r="8" fill="#060d1e" stroke="#d4af37" strokeWidth="2" />
                <circle r="3" fill="#d4af37" />
                <text x="12" y="4" fill="#e2e8f0" fontSize="11">
                  Wad Madani (ود مدني)
                </text>
              </g>

              {/* Gedaref */}
              <g transform="translate(480, 440)">
                <circle r="8" fill="#060d1e" stroke="#d4af37" strokeWidth="2" />
                <circle r="3" fill="#d4af37" />
                <text x="12" y="4" fill="#e2e8f0" fontSize="11">
                  Gedaref (القضارف - الصوامع)
                </text>
              </g>

              {/* Render Animated Vehicles along highway */}
              {vehicles.map((v, idx) => {
                // Map approximate geo coords to SVG space
                // Lat ~ 13 to 20 -> SVG Y: 500 to 100
                // Lng ~ 32 to 38 -> SVG X: 240 to 760
                const svgX = 240 + ((v.currentLng - 32.2) / (37.5 - 32.2)) * 520;
                const svgY = 480 - ((v.currentLat - 13.5) / (20.0 - 13.5)) * 380;
                const isSelected = v.id === selectedVehicle.id;

                return (
                  <g
                    key={v.id}
                    transform={`translate(${svgX}, ${svgY})`}
                    className="cursor-pointer transition-all duration-500"
                    onClick={() => setSelectedVehicleId(v.id)}
                  >
                    {/* Selection ring */}
                    {isSelected && (
                      <circle r="22" fill="none" stroke="#d4af37" strokeWidth="2" strokeDasharray="3 3" className="animate-spin" />
                    )}

                    {/* Ping status ring */}
                    {v.status === 'in_transit' && (
                      <circle r="14" fill="rgba(14, 165, 233, 0.25)" className="animate-ping" />
                    )}
                    {v.isReturningEmpty && (
                      <circle r="16" fill="rgba(16, 185, 129, 0.3)" className="animate-pulse" />
                    )}

                    {/* Vehicle body marker */}
                    <rect
                      x="-12"
                      y="-12"
                      width="24"
                      height="24"
                      rx="6"
                      fill={v.isReturningEmpty ? '#059669' : isSelected ? '#d4af37' : '#0f172a'}
                      stroke={isSelected ? '#ffffff' : v.isReturningEmpty ? '#10b981' : '#38bdf8'}
                      strokeWidth="2"
                    />

                    {/* Heading pointer */}
                    <polygon
                      points="0,-16 4,-12 -4,-12"
                      fill={isSelected ? '#d4af37' : '#38bdf8'}
                      transform={`rotate(${v.heading})`}
                    />

                    {/* Plate text */}
                    <text
                      x="16"
                      y="4"
                      fill={isSelected ? '#d4af37' : '#ffffff'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {v.plateNumber.split('-')[0]}-{v.plateNumber.split('-')[1]}
                    </text>
                  </g>
                );
              })}

              {/* Incidents / Checkpoint Alerts on Map */}
              {incidents.map((inc, iIdx) => {
                const incX = 240 + ((inc.lng - 32.2) / (37.5 - 32.2)) * 520;
                const incY = 480 - ((inc.lat - 13.5) / (20.0 - 13.5)) * 380;

                return (
                  <g key={iIdx} transform={`translate(${incX}, ${incY})`} className="cursor-pointer">
                    <circle r="18" fill="rgba(244, 63, 94, 0.3)" className="animate-ping" />
                    <circle r="10" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                      !
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Live Telemetry Strip */}
            <div className="absolute bottom-3 inset-x-3 z-20 bg-navy-900/90 backdrop-blur-md p-3 rounded-xl border border-gold/25 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-white">Live Tracking:</span>
                <span className="text-gold font-mono font-bold">{selectedVehicle.plateNumber}</span>
                <span className="text-gray-300">({selectedVehicle.makeModel})</span>
                <span className="text-emerald-400 font-mono font-semibold">{selectedVehicle.speedKmh} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const shp = shipments.find((s) => s.vehiclePlate === selectedVehicle.plateNumber);
                    if (shp) {
                      setSelectedShipmentId(shp.id);
                      setCurrentView('tracking_detail');
                    }
                  }}
                  className="px-3 py-1 bg-gold hover:bg-gold/90 text-navy-950 font-bold rounded-lg transition-transform hover:scale-105 cursor-pointer text-xs"
                >
                  {t.viewPassport}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Asset Inspector & Operations List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Active Selected Asset Telemetry Card */}
          <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gold/15">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gold/20 text-gold border border-gold/30">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white font-mono text-sm">{selectedVehicle.plateNumber}</div>
                  <div className="text-xs text-gray-400">{selectedVehicle.carrierName}</div>
                </div>
              </div>
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
                  selectedVehicle.isReturningEmpty
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
                    : selectedVehicle.status === 'in_transit'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-navy-800 text-gray-300 border-gray-700'
                }`}
              >
                {selectedVehicle.isReturningEmpty ? 'Empty Return (Backhaul)' : selectedVehicle.status}
              </span>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-navy-950/80 border border-navy-800">
                <div className="text-gray-400 text-[10px] flex items-center gap-1">
                  <Navigation className="w-3 h-3 text-sky-400" /> Velocity / السرعة
                </div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{selectedVehicle.speedKmh} km/h</div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-950/80 border border-navy-800">
                <div className="text-gray-400 text-[10px] flex items-center gap-1">
                  <Fuel className="w-3 h-3 text-amber-400" /> Fuel Level / الوقود
                </div>
                <div className="text-sm font-bold text-white font-mono mt-0.5">{selectedVehicle.fuelLevelPercent}%</div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-950/80 border border-navy-800">
                <div className="text-gray-400 text-[10px]">Driver / السائق</div>
                <div className="text-xs font-semibold text-gray-200 mt-0.5 truncate">{selectedVehicle.driverName || 'غير مسند'}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-navy-950/80 border border-navy-800">
                <div className="text-gray-400 text-[10px]">Capacity / الحمولة</div>
                <div className="text-xs font-semibold text-gold font-mono mt-0.5">{selectedVehicle.capacityTons} Tons</div>
              </div>
            </div>

            {/* Backhaul alert banner if returning empty */}
            {selectedVehicle.isReturningEmpty && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 to-navy-900 border border-emerald-500/40 text-xs space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Backhaul Asset Available!</span>
                </div>
                <div className="text-gray-300 text-[11px]">
                  Returning from <strong className="text-white">{selectedVehicle.emptyReturnOrigin}</strong> towards <strong className="text-white">{selectedVehicle.emptyReturnDestination}</strong>. Save up to 28% shipping cost!
                </div>
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="mt-1 w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Book Return Load Now
                </button>
              </div>
            )}
          </div>

          {/* Real-time Fleet Stream List */}
          <div className="p-3 rounded-2xl bg-navy-900/80 border border-gold/20 space-y-2 max-h-[290px] overflow-y-auto custom-scrollbar">
            <div className="text-xs font-bold text-gold uppercase px-1">Active Fleet Assets ({vehicles.length})</div>
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVehicleId(v.id)}
                className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs transition-all text-start cursor-pointer ${
                  v.id === selectedVehicle.id
                    ? 'bg-gold/20 border border-gold/40 text-white'
                    : 'bg-navy-950/60 border border-navy-800 hover:bg-navy-800/80 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className={`w-4 h-4 ${v.isReturningEmpty ? 'text-emerald-400' : 'text-sky-400'}`} />
                  <div>
                    <div className="font-bold font-mono text-white">{v.plateNumber}</div>
                    <div className="text-[10px] text-gray-400">{v.currentCity}</div>
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-mono text-gold font-semibold">{v.speedKmh} km/h</div>
                  <div className="text-[10px] text-gray-400">{v.type}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
