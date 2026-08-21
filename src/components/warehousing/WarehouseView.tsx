'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Warehouse, WarehouseItem, WarehouseReservation, StorageType } from '@/types';
import {
  Warehouse as WarehouseIcon,
  Search,
  Filter,
  Layers,
  Thermometer,
  ShieldCheck,
  Building2,
  Package,
  Calendar,
  DollarSign,
  CheckCircle2,
  PlusCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  QrCode,
  Truck,
  Maximize2,
} from 'lucide-react';

export function WarehouseView() {
  const { warehouses, warehouseItems, warehouseReservations, reserveWarehouseSpace, t, lang } = useApp();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'wms_inventory' | 'reservations'>('marketplace');
  const [searchCity, setSearchCity] = useState('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(warehouses[0] || null);

  // Reservation Modal state
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [reserveWarehouseTarget, setReserveWarehouseTarget] = useState<Warehouse | null>(null);
  const [reserveClientName, setReserveClientName] = useState('DAL Food Industries');
  const [reserveArea, setReserveArea] = useState(500);
  const [reserveMonths, setReserveMonths] = useState(3);

  const filteredWarehouses = warehouses.filter((wh) => {
    if (searchCity !== 'all' && !wh.city.toLowerCase().includes(searchCity.toLowerCase())) return false;
    if (filterType !== 'all' && wh.storageType !== filterType) return false;
    return true;
  });

  const handleOpenReserve = (wh: Warehouse) => {
    setReserveWarehouseTarget(wh);
    setIsReserveModalOpen(true);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveWarehouseTarget) return;

    const monthlyCost = reserveArea * reserveWarehouseTarget.ratePerM2Monthly;
    const newReservation: WarehouseReservation = {
      id: `res-${Date.now()}`,
      warehouseId: reserveWarehouseTarget.id,
      warehouseName: reserveWarehouseTarget.name,
      clientName: reserveClientName,
      reservedAreaM2: reserveArea,
      storageType: reserveWarehouseTarget.storageType,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + reserveMonths * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      monthlyCost,
      status: 'confirmed',
    };

    reserveWarehouseSpace(newReservation);
    setIsReserveModalOpen(false);
    alert(
      lang === 'ar'
        ? `تم تأكيد حجز مساحة ${reserveArea} م² في ${reserveWarehouseTarget.nameAr || reserveWarehouseTarget.name} بنجاح!`
        : `Successfully reserved ${reserveArea} m² at ${reserveWarehouseTarget.name}!`
    );
  };

  const totalCapacity = warehouses.reduce((acc, wh) => acc + wh.totalAreaM2, 0);
  const totalAvailable = warehouses.reduce((acc, wh) => acc + wh.availableAreaM2, 0);
  const avgOccupancy = Number((((totalCapacity - totalAvailable) / totalCapacity) * 100).toFixed(1));

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
              <WarehouseIcon className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'سوق المستودعات وإدارة سلاسل الإمداد (WMS Engine)' : 'Warehouse Marketplace & WMS Operations'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            {lang === 'ar'
              ? 'احجز مساحات التخزين الجاف والمبرد والجمركي (Bonded) في بورتسودان والخرطوم، مع تتبع آلي للمخزون والأرصدة والباركود.'
              : 'Search and reserve bonded, reefer, and dry storage across Sudan logistics corridors with full WMS batch tracking.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'marketplace' ? 'bg-gold text-navy-950 shadow-md' : 'bg-navy-800 text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'سوق المستودعات' : 'Marketplace'}
          </button>
          <button
            onClick={() => setActiveTab('wms_inventory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'wms_inventory' ? 'bg-gold text-navy-950 shadow-md' : 'bg-navy-800 text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'إدارة المخزون (WMS)' : 'WMS Inventory'} ({warehouseItems.length})
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'reservations' ? 'bg-gold text-navy-950 shadow-md' : 'bg-navy-800 text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'العقود والحجوزات' : 'Reservations'} ({warehouseReservations.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Total Storage Capacity</span>
            <Building2 className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {(totalCapacity / 1000).toFixed(1)}k <span className="text-xs text-gold">m²</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Across 3 Strategic Hubs</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-emerald-500/30 shadow-lg">
          <div className="text-xs text-emerald-300 flex items-center justify-between mb-1">
            <span>Available Area</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {(totalAvailable / 1000).toFixed(1)}k <span className="text-xs">m²</span>
          </div>
          <div className="text-[10px] text-emerald-300 mt-1">Ready for instant lease</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-amber-500/30 shadow-lg">
          <div className="text-xs text-amber-300 flex items-center justify-between mb-1">
            <span>Average Occupancy</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">{avgOccupancy}%</div>
          <div className="text-[10px] text-gray-400 mt-1">Optimal utilization rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-sky-500/30 shadow-lg">
          <div className="text-xs text-sky-300 flex items-center justify-between mb-1">
            <span>Active SKUs & Batches</span>
            <Package className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-sky-400">9,748 Units</div>
          <div className="text-[10px] text-gray-400 mt-1">100% Barcode Indexed</div>
        </div>
      </div>

      {/* Tab 1: Warehouse Marketplace (Search & Reserve) */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-navy-900/80 rounded-2xl border border-gold/20">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-gold" />
              <input
                type="text"
                placeholder={lang === 'ar' ? 'ابحث باسم المستودع، المدينة، أو نوع التخزين...' : 'Search by warehouse name, city, or specs...'}
                className="bg-transparent text-white text-xs sm:text-sm outline-none placeholder-gray-400 flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="bg-navy-950 border border-gold/20 text-xs text-gray-200 px-3 py-1.5 rounded-xl outline-none"
              >
                <option value="all">{lang === 'ar' ? 'كل المدن' : 'All Cities'}</option>
                <option value="Port Sudan">Port Sudan</option>
                <option value="Khartoum North">Khartoum North</option>
                <option value="Wad Madani">Wad Madani</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-navy-950 border border-gold/20 text-xs text-gray-200 px-3 py-1.5 rounded-xl outline-none"
              >
                <option value="all">{lang === 'ar' ? 'جميع أنواع التخزين' : 'All Storage Types'}</option>
                <option value="bonded">Bonded (جمركي)</option>
                <option value="dry">Dry Ambient (جاف)</option>
                <option value="reefer">Reefer (مبرد)</option>
              </select>
            </div>
          </div>

          {/* Warehouse Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredWarehouses.map((wh) => (
              <div
                key={wh.id}
                className="p-5 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4 hover:border-gold/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 uppercase font-mono">
                        {wh.storageType}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{lang === 'ar' ? wh.nameAr : wh.name}</h3>
                      <p className="text-xs text-gray-400">{wh.city} • {wh.address}</p>
                    </div>
                    {wh.isBondedCustoms && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                        Bonded
                      </span>
                    )}
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                      <span className="text-[10px] text-gray-400 block">Total Area</span>
                      <span className="font-bold text-white font-mono">{wh.totalAreaM2.toLocaleString()} m²</span>
                    </div>
                    <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                      <span className="text-[10px] text-emerald-400 block">Available Now</span>
                      <span className="font-bold text-emerald-300 font-mono">{wh.availableAreaM2.toLocaleString()} m²</span>
                    </div>
                    <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                      <span className="text-[10px] text-gray-400 block">Loading Docks</span>
                      <span className="font-bold text-amber-300 font-mono">{wh.loadingDocksCount} Docks</span>
                    </div>
                    <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                      <span className="text-[10px] text-gray-400 block">Security</span>
                      <span className="font-semibold text-gray-200 truncate">{wh.securityLevel}</span>
                    </div>
                  </div>

                  {wh.temperatureCelsius && (
                    <div className="text-xs text-sky-300 bg-sky-950/40 p-2 rounded-xl border border-sky-500/30 flex items-center gap-1.5">
                      <Thermometer className="w-4 h-4 text-sky-400" />
                      <span>{wh.temperatureCelsius}</span>
                    </div>
                  )}

                  {/* Occupancy bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-400">Occupancy</span>
                      <span className="font-mono text-gold font-bold">{wh.occupancyPercent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-navy-950 overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${wh.occupancyPercent}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Monthly Rate</span>
                    <span className="text-sm font-bold text-gold font-mono">
                      {wh.ratePerM2Monthly.toLocaleString()} SDG <span className="text-[10px] text-gray-400">/ m²</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenReserve(wh)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{t.reserveSpace}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: WMS Inventory Management */}
      {activeTab === 'wms_inventory' && (
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gold/15">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-gold" />
                <span>{lang === 'ar' ? 'سجل المخزون والطرود (WMS Active Items)' : 'Live Inventory & Bin Location Ledger'}</span>
              </h3>
              <p className="text-xs text-gray-400">
                {lang === 'ar' ? 'تتبع الدفعات وتواريخ الصلاحية ومواقع الأرفف (Bin Locations) والتخصيص.' : 'Real-time SKU stock levels, lot batches, expiry, and bin location tracking.'}
              </p>
            </div>

            <button
              onClick={() => alert(lang === 'ar' ? 'فتح شاشة استلام مخزون جديد (Inbound Manifest)' : 'Open Inbound Receiving Manifest')}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'استلام بضاعة جديدة (Inbound)' : 'Receive Inbound Cargo'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-navy-800 text-gray-400 font-semibold text-[11px]">
                  <th className="pb-3 text-start">SKU & Item Name</th>
                  <th className="pb-3 text-start">Client / Consignee</th>
                  <th className="pb-3 text-start">Quantity</th>
                  <th className="pb-3 text-start">Batch #</th>
                  <th className="pb-3 text-start">Location Bin</th>
                  <th className="pb-3 text-start">Status</th>
                  <th className="pb-3 text-end">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {warehouseItems.map((item) => (
                  <tr key={item.id} className="hover:bg-navy-800/40 transition-colors">
                    <td className="py-3 font-semibold text-white">
                      <div>{lang === 'ar' ? item.nameAr : item.name}</div>
                      <div className="text-[10px] font-mono text-gold">{item.sku}</div>
                    </td>
                    <td className="py-3 text-gray-300">{item.clientName}</td>
                    <td className="py-3 font-mono font-bold text-white">
                      {item.quantity.toLocaleString()} {item.unit}
                    </td>
                    <td className="py-3 font-mono text-gray-400">{item.batchNumber}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-navy-950 border border-gold/20 text-gold font-mono text-[10px]">
                        {item.locationBin}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] border ${
                          item.status === 'in_stock'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 text-end">
                      <button
                        onClick={() => alert(`Generating Picking Order for ${item.sku}`)}
                        className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-gold hover:text-navy-950 text-gray-300 text-[11px] font-bold border border-gold/20 transition-colors"
                      >
                        Pick & Dispatch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Confirmed Reservations */}
      {activeTab === 'reservations' && (
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" />
            <span>{lang === 'ar' ? 'عقود وحجوزات المساحات النشطة' : 'Active Storage Space Contracts'}</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouseReservations.map((res) => (
              <div key={res.id} className="p-4 rounded-2xl bg-navy-950/80 border border-gold/20 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{res.clientName}</h4>
                    <p className="text-xs text-gray-400">{res.warehouseName}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold">
                    {res.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-navy-900">
                    <span className="text-[10px] text-gray-400 block">Reserved Area</span>
                    <span className="font-bold text-gold font-mono">{res.reservedAreaM2} m²</span>
                  </div>
                  <div className="p-2 rounded-xl bg-navy-900">
                    <span className="text-[10px] text-gray-400 block">Monthly Spend</span>
                    <span className="font-bold text-white font-mono">{res.monthlyCost.toLocaleString()} SDG</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                  <span>Contract Window:</span>
                  <span className="font-mono text-gray-200">{res.startDate} ➔ {res.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {isReserveModalOpen && reserveWarehouseTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-navy-900 border border-gold/30 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gold/15">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-gold" />
                  <span>{t.reserveSpace}</span>
                </h3>
                <p className="text-xs text-gray-400">{reserveWarehouseTarget.name}</p>
              </div>
              <button onClick={() => setIsReserveModalOpen(false)} className="text-gray-400 hover:text-white font-bold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Client / Company Name</label>
                <input
                  type="text"
                  value={reserveClientName}
                  onChange={(e) => setReserveClientName(e.target.value)}
                  className="w-full bg-navy-950 border border-gold/20 text-white p-2.5 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Required Area (m²)</label>
                  <input
                    type="number"
                    min="50"
                    max={reserveWarehouseTarget.availableAreaM2}
                    value={reserveArea}
                    onChange={(e) => setReserveArea(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-gold/20 text-white p-2.5 rounded-xl outline-none font-mono"
                    required
                  />
                  <span className="text-[10px] text-gray-400">Max available: {reserveWarehouseTarget.availableAreaM2} m²</span>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={reserveMonths}
                    onChange={(e) => setReserveMonths(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-gold/20 text-white p-2.5 rounded-xl outline-none font-mono"
                    required
                  />
                </div>
              </div>

              {/* Price calculation breakdown */}
              <div className="p-3.5 rounded-xl bg-navy-950 border border-gold/30 space-y-1.5">
                <div className="flex justify-between text-gray-300">
                  <span>Monthly Rate per m²:</span>
                  <span className="font-mono text-gold">{reserveWarehouseTarget.ratePerM2Monthly.toLocaleString()} SDG</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Monthly Lease Cost:</span>
                  <span className="font-mono text-white">{(reserveArea * reserveWarehouseTarget.ratePerM2Monthly).toLocaleString()} SDG</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gold pt-2 border-t border-navy-800">
                  <span>Total Contract Cost ({reserveMonths} Mo):</span>
                  <span className="font-mono">{(reserveArea * reserveWarehouseTarget.ratePerM2Monthly * reserveMonths).toLocaleString()} SDG</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold text-navy-950 font-bold hover:brightness-110 shadow-lg cursor-pointer"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
