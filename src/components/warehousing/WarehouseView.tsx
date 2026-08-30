'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Warehouse, WarehouseReservation } from '@/types';
import {
  Warehouse as WarehouseIcon,
  Building2,
  PlusCircle,
  Thermometer,
  ShieldCheck,
  MapPin,
  Sparkles,
  X,
  CheckCircle2,
  Layers,
  ArrowUpRight,
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
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 shopify-card bg-[#ffffff]">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <WarehouseIcon className="w-4 h-4" />
            <span>Fulfillment Hubs & WMS • شبكة المستودعات الذكية</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            سوق المستودعات وإدارة المخزون (WMS)
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            شبكة متطورة من المستودعات الجافة والمبردة في الخرطوم، بورتسودان، سنار، ودنقلا مع حجز فوري للمساحات ونظام ذكي لإدارة المخزون.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-5 py-2.5 rounded-full text-[13.5px] font-[500] transition-all duration-200 cursor-pointer ${
              activeTab === 'marketplace'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
            }`}
          >
            سوق المساحات التخزينية
          </button>
          <button
            onClick={() => setActiveTab('wms_inventory')}
            className={`px-5 py-2.5 rounded-full text-[13.5px] font-[500] transition-all duration-200 cursor-pointer ${
              activeTab === 'wms_inventory'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
            }`}
          >
            مخزون البضائع (WMS)
          </button>
        </div>
      </div>

      {/* Official Warehouse Hub Showcase Banner (Shopify 20px Card) */}
      <div className="shopify-card overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 bg-[#ffffff]">
        <div className="md:col-span-5 relative min-h-[220px] bg-[#000000] p-6 flex items-center justify-center">
          <img
            src="/images/warehouse-hub.jpg"
            alt="Sudaneel Smart Warehouse Interior"
            className="w-full h-auto max-h-[200px] object-cover rounded-[12px]"
          />
          <div className="absolute top-4 start-4">
            <span className="shopify-tag-mint !text-[10px]">
              Class A+ High-Bay Warehouse
            </span>
          </div>
        </div>

        <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="shopify-tag-pistachio !text-[11px]">
              Multi-Temperature Storage • حلول التخزين الجاف والمبرد
            </div>
            <h3 className="text-[20px] font-[600] text-[#000000] tracking-tight">
              مراكز لوجستية استراتيجية مجهزة بأنظمة أرفف A01/B01 ومراقبة حرارية 24/7
            </h3>
            <p className="text-[14px] text-[#71717a] leading-relaxed">
              توفر مستودعاتنا في الموانئ والولايات أعلى معايير الأمان، مع ربط إلكتروني مباشر بنظام الفواتير والتسويات، وتأمين شامل لكافة البضائع المخزنة.
            </p>
          </div>

          {/* 3 Metric Pills */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#e4e4e7] text-center">
            <div className="p-2.5 rounded-[8px] bg-[#fbfbf5]">
              <div className="font-mono text-[16px] font-[700] text-[#000000]">{totalCapacity.toLocaleString()} م²</div>
              <div className="text-[11px] text-[#71717a]">السعة التخزينية الكلية</div>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#c1fbd4]">
              <div className="font-mono text-[16px] font-[700] text-[#000000]">{totalAvailable.toLocaleString()} م²</div>
              <div className="text-[11px] text-[#000000] font-[500]">المساحة المتاحة الآن</div>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#fbfbf5]">
              <div className="font-mono text-[16px] font-[700] text-[#000000]">{avgOccupancy}%</div>
              <div className="text-[11px] text-[#71717a]">معدل الإشغال العام</div>
            </div>
          </div>
        </div>
      </div>

      {/* Warehouse Marketplace Cards */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-[600] text-[#000000]">المستودعات المتاحة للحجز الفوري ({filteredWarehouses.length})</h2>
            <span className="shopify-tag-shade !text-[11px]">جاهزية التشغيل 100%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWarehouses.map((wh) => (
              <div key={wh.id} className="shopify-card p-6 space-y-4 hover:border-[#a1a1aa] transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center text-[#000000]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-[600] text-[15px] text-[#000000]">{wh.nameAr || wh.name}</div>
                        <div className="text-[11px] text-[#71717a] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#71717a]" />
                          <span>{wh.city}</span>
                        </div>
                      </div>
                    </div>
                    <span className="shopify-tag-mint !text-[11px]">
                      {wh.storageType}
                    </span>
                  </div>

                  <div className="space-y-2 text-[13px] text-[#000000]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717a]">المساحة الكلية:</span>
                      <span className="font-mono font-[600]">{wh.totalAreaM2.toLocaleString()} م²</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717a]">المساحة المتاحة:</span>
                      <span className="font-mono font-[700] text-[#000000]">{wh.availableAreaM2.toLocaleString()} م²</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#71717a]">التعرفة الشهرية:</span>
                      <span className="font-mono font-[700] text-[#000000]">{wh.ratePerM2Monthly} SDG / م²</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenReserve(wh)}
                    className="w-full btn-shopify-pill !py-2.5 text-[13px]"
                  >
                    <span>حجز مساحة تخزينية فورية</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WMS Inventory Table */}
      {activeTab === 'wms_inventory' && (
        <div className="shopify-card overflow-hidden bg-[#ffffff]">
          <div className="p-6 border-b border-[#e4e4e7] flex items-center justify-between">
            <h2 className="text-[18px] font-[600] text-[#000000]">سجل مخزون البضائع في المستودعات (WMS Inventory)</h2>
            <span className="shopify-tag-mint">{warehouseItems.length} صنف مسجل</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-[13.5px]">
              <thead>
                <tr className="border-b border-[#e4e4e7] bg-[#fbfbf5] text-[#71717a] text-[12px]">
                  <th className="p-4 text-start font-[600]">SKU / الباركود</th>
                  <th className="p-4 text-start font-[600]">اسم الصنف</th>
                  <th className="p-4 text-start font-[600]">العميل / المودع</th>
                  <th className="p-4 text-start font-[600]">الكمية والوحدة</th>
                  <th className="p-4 text-start font-[600]">الموقع التخزيني (Bin)</th>
                  <th className="p-4 text-end font-[600]">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7] font-[420]">
                {warehouseItems.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fbfbf5] transition-colors">
                    <td className="p-4 font-mono font-[600] text-[#000000]">{item.sku}</td>
                    <td className="p-4 font-[500] text-[#000000]">{item.name}</td>
                    <td className="p-4 text-[#71717a]">{item.clientName}</td>
                    <td className="p-4 font-mono font-[600] text-[#000000]">{item.quantity.toLocaleString()} {item.unit}</td>
                    <td className="p-4 font-mono text-[12px] text-[#71717a]">{item.locationBin}</td>
                    <td className="p-4 text-end">
                      <span className="shopify-tag-mint !text-[11px]">{item.status}</span>
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
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
              <div className="space-y-1">
                <div className="shopify-tag-mint !text-[10px]">حجز مساحة تخزينية</div>
                <h3 className="font-[600] text-[18px] text-[#000000]">{reserveWarehouseTarget.nameAr || reserveWarehouseTarget.name}</h3>
              </div>
              <button onClick={() => setIsReserveModalOpen(false)} className="p-1.5 rounded-full hover:bg-[#fbfbf5] text-[#71717a]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-4 text-[13px]">
              <div>
                <label className="text-[12px] font-[500] text-[#71717a] block mb-1">اسم العميل / الشركة</label>
                <input
                  type="text"
                  value={reserveClientName}
                  onChange={(e) => setReserveClientName(e.target.value)}
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2.5 outline-none focus:border-[#000000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-[500] text-[#71717a] block mb-1">المساحة المطلوبة (م²)</label>
                  <input
                    type="number"
                    value={reserveArea}
                    onChange={(e) => setReserveArea(Number(e.target.value))}
                    max={reserveWarehouseTarget.availableAreaM2}
                    min={50}
                    className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2.5 outline-none focus:border-[#000000]"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-[500] text-[#71717a] block mb-1">مدة العقد (أشهر)</label>
                  <input
                    type="number"
                    value={reserveMonths}
                    onChange={(e) => setReserveMonths(Number(e.target.value))}
                    min={1}
                    max={36}
                    className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2.5 outline-none focus:border-[#000000]"
                  />
                </div>
              </div>

              <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2] space-y-1">
                <div className="flex justify-between text-[#000000]">
                  <span>التكلفة الشهرية التقديرية:</span>
                  <span className="font-mono font-[700]">{(reserveArea * reserveWarehouseTarget.ratePerM2Monthly).toLocaleString()} SDG</span>
                </div>
                <div className="flex justify-between text-[#000000] text-[12px]">
                  <span>إجمالي قيمة العقد ({reserveMonths} أشهر):</span>
                  <span className="font-mono font-[700]">{(reserveArea * reserveWarehouseTarget.ratePerM2Monthly * reserveMonths).toLocaleString()} SDG</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setIsReserveModalOpen(false)} className="btn-shopify-outline flex-1">
                  إلغاء
                </button>
                <button type="submit" className="btn-shopify-pill flex-1">
                  تأكيد الحجز الفوري
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
