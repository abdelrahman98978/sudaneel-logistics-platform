'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Warehouse, WarehouseReservation } from '@/types';
import {
  Warehouse as WarehouseIcon,
  Building2,
  PlusCircle,
  Thermometer,
} from 'lucide-react';

export function WarehouseView() {
  const { warehouses, warehouseItems, warehouseReservations, reserveWarehouseSpace, showToast, lang } = useApp();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'wms_inventory' | 'reservations'>('marketplace');
  const [searchCity, setSearchCity] = useState('all');
  const [filterType, setFilterType] = useState<string>('all');

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
    showToast(
      lang === 'ar' ? 'تم تأكيد حجز المستودع' : 'Warehouse Space Reserved',
      lang === 'ar'
        ? `تم تأكيد حجز مساحة ${reserveArea} م² في ${reserveWarehouseTarget.nameAr || reserveWarehouseTarget.name} بنجاح!`
        : `Successfully reserved ${reserveArea} m² at ${reserveWarehouseTarget.name}!`,
      'success'
    );
  };

  const totalCapacity = warehouses.reduce((acc, wh) => acc + wh.totalAreaM2, 0);
  const totalAvailable = warehouses.reduce((acc, wh) => acc + wh.availableAreaM2, 0);
  const avgOccupancy = Number((((totalCapacity - totalAvailable) / totalCapacity) * 100).toFixed(1));

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <WarehouseIcon className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'سوق المستودعات وإدارة سلاسل الإمداد (WMS Engine)' : 'Warehouse Marketplace & WMS Operations'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] max-w-2xl mt-1">
            {lang === 'ar'
              ? 'احجز مساحات التخزين الجاف والمبرد والجمركي (Bonded) في بورتسودان والخرطوم، مع تتبع آلي للمخزون والأرصدة والباركود.'
              : 'Reserve bonded, cold-chain, and dry storage in Port Sudan & Khartoum with live inventory telemetry.'}
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 bg-[#F4F4F4] border border-[#EEEEEE] p-3 rounded-[4px] text-[12px]">
          <div>
            <span className="text-[#8E8E8E] block">Total Footprint</span>
            <span className="font-[500] font-mono text-[#171A20]">{totalCapacity.toLocaleString()} m²</span>
          </div>
          <div className="h-6 w-px bg-[#D0D1D2]"></div>
          <div>
            <span className="text-[#8E8E8E] block">Occupancy Rate</span>
            <span className="font-[500] font-mono text-[#3E6AE1]">{avgOccupancy}%</span>
          </div>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-[#EEEEEE]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'marketplace' ? 'bg-[#171A20] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4] font-[400]'
            }`}
          >
            {lang === 'ar' ? 'دليل ومساحات المستودعات' : 'Warehouses Guide'} ({warehouses.length})
          </button>
          <button
            onClick={() => setActiveTab('wms_inventory')}
            className={`px-4 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'wms_inventory' ? 'bg-[#171A20] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4] font-[400]'
            }`}
          >
            {lang === 'ar' ? 'أرصدة المخزون الحي' : 'Live WMS Inventory'} ({warehouseItems.length})
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'reservations' ? 'bg-[#3E6AE1] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4] font-[400]'
            }`}
          >
            {lang === 'ar' ? 'الحجوزات والعقود' : 'Reservations & Leases'} ({warehouseReservations.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="bg-[#FFFFFF] border border-[#D0D1D2] text-[13px] text-[#171A20] px-3 py-1.5 rounded-[4px] outline-none"
          >
            <option value="all">{lang === 'ar' ? 'جميع المدن والمحطات' : 'All Hub Cities'}</option>
            <option value="Port Sudan">Port Sudan</option>
            <option value="Khartoum">Khartoum</option>
            <option value="Wad Madani">Wad Madani</option>
            <option value="Atbara">Atbara</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#FFFFFF] border border-[#D0D1D2] text-[13px] text-[#171A20] px-3 py-1.5 rounded-[4px] outline-none"
          >
            <option value="all">{lang === 'ar' ? 'جميع أنواع التخزين' : 'All Storage Types'}</option>
            <option value="bonded">Bonded (جمركي معفى)</option>
            <option value="reefer">Reefer (مبرّد)</option>
            <option value="dry">Dry (جاف)</option>
            <option value="silo">Silo (صوامع)</option>
          </select>
        </div>
      </div>

      {/* Tab 1: Marketplace Cards Grid */}
      {activeTab === 'marketplace' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWarehouses.map((wh) => (
            <div
              key={wh.id}
              className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[15px] font-[500] text-[#171A20]">{wh.nameAr || wh.name}</h3>
                    <p className="text-[13px] text-[#5C5E62] flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{wh.city} — {wh.address}</span>
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] font-mono uppercase">
                    {wh.storageType}
                  </span>
                </div>

                {/* Capacity breakdown */}
                <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2 text-[12px]">
                  <div className="flex justify-between text-[#171A20]">
                    <span>المساحة الإجمالية:</span>
                    <span className="font-mono font-[500]">{wh.totalAreaM2.toLocaleString()} م²</span>
                  </div>
                  <div className="flex justify-between text-[#3E6AE1]">
                    <span>المساحة الشاغرة للحجز:</span>
                    <span className="font-mono font-[500]">{wh.availableAreaM2.toLocaleString()} م²</span>
                  </div>
                  {wh.temperatureCelsius && (
                    <div className="flex items-center gap-1 text-[#5C5E62] pt-1 border-t border-[#EEEEEE]">
                      <Thermometer className="w-3.5 h-3.5 text-[#3E6AE1]" />
                      <span>تحكم حراري: {wh.temperatureCelsius}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#EEEEEE] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#8E8E8E] block">سعر المتر المربع</span>
                  <span className="text-[15px] font-[500] font-mono text-[#171A20]">
                    {wh.ratePerM2Monthly.toLocaleString()} SDG <span className="text-[11px] text-[#5C5E62]">/ شهر</span>
                  </span>
                </div>

                <button
                  onClick={() => handleOpenReserve(wh)}
                  className="btn-tesla-primary !min-w-[110px] !min-h-[34px] !py-1 !px-3 text-[13px] flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>حجز مساحة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Live Inventory */}
      {activeTab === 'wms_inventory' && (
        <div className="rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-start text-[13px]">
              <thead className="bg-[#F4F4F4] text-[#5C5E62] font-[500] uppercase border-b border-[#EEEEEE] text-[11px]">
                <tr>
                  <th className="p-3.5 text-start">SKU / Item</th>
                  <th className="p-3.5 text-start">Client</th>
                  <th className="p-3.5 text-start">Quantity</th>
                  <th className="p-3.5 text-start">Batch #</th>
                  <th className="p-3.5 text-start">Location Bin</th>
                  <th className="p-3.5 text-end">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE] font-[400] text-[#171A20]">
                {warehouseItems.map((it) => (
                  <tr key={it.id} className="hover:bg-[#F4F4F4] transition-colors duration-330">
                    <td className="p-3.5 font-mono font-[500] text-[#3E6AE1]">{it.sku} - {it.nameAr || it.name}</td>
                    <td className="p-3.5">{it.clientName}</td>
                    <td className="p-3.5 font-mono font-[500]">{it.quantity.toLocaleString()} {it.unit}</td>
                    <td className="p-3.5 font-mono text-[#5C5E62]">{it.batchNumber}</td>
                    <td className="p-3.5 font-mono font-[500]">{it.locationBin}</td>
                    <td className="p-3.5 text-end">
                      <span className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] text-[11px] font-mono uppercase">
                        {it.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Reservations */}
      {activeTab === 'reservations' && (
        <div className="rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-start text-[13px]">
              <thead className="bg-[#F4F4F4] text-[#5C5E62] font-[500] uppercase border-b border-[#EEEEEE] text-[11px]">
                <tr>
                  <th className="p-3.5 text-start">Lease ID</th>
                  <th className="p-3.5 text-start">Warehouse Hub</th>
                  <th className="p-3.5 text-start">Client</th>
                  <th className="p-3.5 text-start">Reserved Area</th>
                  <th className="p-3.5 text-start">Contract Period</th>
                  <th className="p-3.5 text-start">Monthly Rent</th>
                  <th className="p-3.5 text-end">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE] font-[400] text-[#171A20]">
                {warehouseReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-[#F4F4F4] transition-colors duration-330">
                    <td className="p-3.5 font-mono font-[500] text-[#3E6AE1]">{res.id}</td>
                    <td className="p-3.5 font-[500]">{res.warehouseName}</td>
                    <td className="p-3.5">{res.clientName}</td>
                    <td className="p-3.5 font-mono font-[500]">{res.reservedAreaM2.toLocaleString()} m²</td>
                    <td className="p-3.5 font-mono text-[12px]">{res.startDate} ➔ {res.endDate}</td>
                    <td className="p-3.5 font-mono font-[500]">{res.monthlyCost.toLocaleString()} SDG</td>
                    <td className="p-3.5 text-end">
                      <span className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#3E6AE1] border border-[#3E6AE1] text-[11px] font-mono font-[500]">
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      {isReserveModalOpen && reserveWarehouseTarget && (
        <div className="fixed inset-0 z-50 bg-[#171A20]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
              <h3 className="text-[15px] font-[500] text-[#171A20]">
                حجز مساحة تخزين في {reserveWarehouseTarget.nameAr || reserveWarehouseTarget.name}
              </h3>
              <button onClick={() => setIsReserveModalOpen(false)} className="text-[#8E8E8E] hover:text-[#171A20]">✕</button>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-3 text-[13px]">
              <div>
                <label className="text-[#5C5E62] block mb-1">اسم العميل / المؤسسة</label>
                <input
                  type="text"
                  value={reserveClientName}
                  onChange={(e) => setReserveClientName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] p-2.5 rounded-[4px] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#5C5E62] block mb-1">المساحة المطلوبة (م²)</label>
                  <input
                    type="number"
                    value={reserveArea}
                    onChange={(e) => setReserveArea(Number(e.target.value))}
                    max={reserveWarehouseTarget.availableAreaM2}
                    className="w-full bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] font-mono p-2.5 rounded-[4px] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#5C5E62] block mb-1">مدة العقد (أشهر)</label>
                  <input
                    type="number"
                    value={reserveMonths}
                    onChange={(e) => setReserveMonths(Number(e.target.value))}
                    min={1}
                    max={24}
                    className="w-full bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] font-mono p-2.5 rounded-[4px] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-1">
                <div className="flex justify-between text-[#5C5E62]">
                  <span>التكلفة الشهرية:</span>
                  <span className="font-mono text-[#171A20] font-[500]">{(reserveArea * reserveWarehouseTarget.ratePerM2Monthly).toLocaleString()} SDG</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReserveModalOpen(false)}
                  className="btn-tesla-secondary !min-w-[80px] !min-h-[34px] !py-1 !px-3"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-tesla-primary !min-w-[140px] !min-h-[34px] !py-1 !px-3"
                >
                  تأكيد الحجز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
