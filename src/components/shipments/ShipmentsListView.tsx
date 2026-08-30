'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { ShipmentStatus } from '@/types';
import {
  Package,
  Search,
  PlusCircle,
  ArrowRight,
  Eye,
  SlidersHorizontal,
  FileSpreadsheet,
} from 'lucide-react';

export function ShipmentsListView() {
  const {
    shipments,
    setCurrentView,
    setSelectedShipmentId,
    t,
    lang,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = shipments.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (
      searchQuery &&
      !s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.destination.city.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'in_transit':
        return 'shopify-tag-mint';
      case 'delivered':
      case 'completed':
      case 'pod_verified':
        return 'shopify-tag-mint';
      case 'delayed':
      case 'failed':
        return 'shopify-tag-shade';
      case 'awaiting_carrier':
      case 'quote_requested':
        return 'shopify-tag-pistachio';
      default:
        return 'shopify-tag-shade';
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8 shopify-card bg-[#ffffff]">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <Package className="w-4 h-4" />
            <span>Digital Ledger • سجل البوالص الإلكترونية</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            {t.shipments} ({shipments.length})
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            {lang === 'ar'
              ? 'إدارة دورة حياة الشحنات الكاملة عبر محرك الـ State Machine وجواز السفر الرقمي للبضائع.'
              : 'End-to-end shipment lifecycle management with state machine events and digital passport.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('create_shipment')}
            className="btn-shopify-pill"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.createShipment}</span>
          </button>

          <button
            onClick={() => setCurrentView('bulk_orders')}
            className="btn-shopify-outline"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>استيراد جماعي CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar (Shopify Pill Controls) */}
      <div className="shopify-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#ffffff]">
        {/* Pill Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-[#71717a]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الشحنة، العميل، أو المدينة..."
            className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-full ps-10 pe-4 py-2 text-[13.5px] outline-none text-[#000000] placeholder-[#71717a] focus:border-[#000000]"
          />
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          {['all', 'in_transit', 'delivered', 'awaiting_carrier', 'delayed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-[500] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
              }`}
            >
              {st === 'all' && (lang === 'ar' ? 'جميع الشحنات' : 'All')}
              {st === 'in_transit' && (lang === 'ar' ? 'على الطريق' : 'In Transit')}
              {st === 'delivered' && (lang === 'ar' ? 'مكتملة' : 'Delivered')}
              {st === 'awaiting_carrier' && (lang === 'ar' ? 'بانتظار ناقل' : 'Awaiting Carrier')}
              {st === 'delayed' && (lang === 'ar' ? 'متأخرة' : 'Delayed')}
            </button>
          ))}
        </div>
      </div>

      {/* Shipments Data Table (Shopify 12px Card with Level 3 Halo) */}
      <div className="shopify-card overflow-hidden bg-[#ffffff]">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-[13.5px]">
            <thead>
              <tr className="border-b border-[#e4e4e7] bg-[#fbfbf5] text-[#71717a] text-[12px]">
                <th className="p-4 text-start font-[600]">رقم البوليصة</th>
                <th className="p-4 text-start font-[600]">العميل والشاحن</th>
                <th className="p-4 text-start font-[600]">المسار اللوجستي</th>
                <th className="p-4 text-start font-[600]">نوع الحمولة</th>
                <th className="p-4 text-start font-[600]">الحالة</th>
                <th className="p-4 text-start font-[600]">القيمة</th>
                <th className="p-4 text-end font-[600]">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7] font-[420]">
              {filtered.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => {
                    setSelectedShipmentId(s.id);
                    setCurrentView('tracking_detail');
                  }}
                  className="hover:bg-[#fbfbf5] transition-colors duration-200 cursor-pointer"
                >
                  <td className="p-4 font-mono font-[600] text-[#000000]">
                    {s.trackingNumber}
                  </td>
                  <td className="p-4">
                    <div className="font-[500] text-[#000000]">{s.customerName}</div>
                    <div className="text-[11px] text-[#71717a]">{s.customerNameAr}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-[#000000] font-[500] flex items-center gap-1.5">
                      <span>{s.origin.city}</span>
                      <span className="text-[#71717a]">➔</span>
                      <span>{s.destination.city}</span>
                    </div>
                    <div className="text-[11px] text-[#71717a] font-mono">{s.distanceKm} كم</div>
                  </td>
                  <td className="p-4 text-[#000000]">
                    <div>{s.cargoType}</div>
                    <div className="text-[11px] text-[#71717a] font-mono">{s.totalWeightKg.toLocaleString()} كجم</div>
                  </td>
                  <td className="p-4">
                    <span className={getStatusBadge(s.status)}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-[600] text-[#000000]">
                    {s.price.toLocaleString()} SDG
                  </td>
                  <td className="p-4 text-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedShipmentId(s.id);
                        setCurrentView('tracking_detail');
                      }}
                      className="p-2 rounded-full hover:bg-[#c1fbd4] hover:text-[#000000] text-[#71717a] transition-colors"
                      title="عرض الجواز الرقمي"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
