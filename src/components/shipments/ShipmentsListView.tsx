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
        return 'bg-[#F4F4F4] text-[#3E6AE1] border-[#3E6AE1]';
      case 'delivered':
      case 'completed':
      case 'pod_verified':
        return 'bg-[#F4F4F4] text-[#171A20] border-[#D0D1D2]';
      case 'delayed':
      case 'failed':
        return 'bg-[#F4F4F4] text-[#393C41] border-[#D0D1D2]';
      case 'awaiting_carrier':
      case 'quote_requested':
        return 'bg-[#F4F4F4] text-[#5C5E62] border-[#D0D1D2]';
      default:
        return 'bg-[#F4F4F4] text-[#5C5E62] border-[#EEEEEE]';
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
        <div>
          <h2 className="font-[500] text-[17px] text-[#171A20] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#3E6AE1]" />
            <span>{t.shipments} ({shipments.length})</span>
          </h2>
          <p className="text-[13px] font-[400] text-[#5C5E62]">
            {lang === 'ar'
              ? 'إدارة دورة حياة الشحنات الكاملة عبر محرك الـ State Machine وجواز السفر الرقمي.'
              : 'End-to-end shipment lifecycle management with state machine events and digital passport.'}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('create_shipment')}
          className="btn-tesla-primary !min-w-[140px] !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.createShipment}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2]">
          <Search className="w-4 h-4 text-[#8E8E8E]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-[#171A20] text-[14px] outline-none placeholder-[#8E8E8E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[13px] text-[#171A20] outline-none cursor-pointer"
          >
            <option value="all">All Statuses ({shipments.length})</option>
            <option value="in_transit">In Transit</option>
            <option value="loading">Loading</option>
            <option value="confirmed">Confirmed</option>
            <option value="awaiting_carrier">Awaiting Carrier</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table Data Grid */}
      <div className="rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-start text-[13px]">
            <thead className="bg-[#F4F4F4] text-[#5C5E62] font-[500] uppercase border-b border-[#EEEEEE] text-[11px]">
              <tr>
                <th className="p-3.5 text-start font-[500]">Tracking #</th>
                <th className="p-3.5 text-start font-[500]">Customer</th>
                <th className="p-3.5 text-start font-[500]">Route</th>
                <th className="p-3.5 text-start font-[500]">Cargo & Weight</th>
                <th className="p-3.5 text-start font-[500]">Assigned Fleet</th>
                <th className="p-3.5 text-start font-[500]">Status</th>
                <th className="p-3.5 text-start font-[500]">Price</th>
                <th className="p-3.5 text-end font-[500]">Passport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE] text-[#171A20] font-[400]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F4F4F4] transition-colors duration-330">
                  <td className="p-3.5 font-mono font-[500] text-[#3E6AE1]">
                    {s.trackingNumber}
                  </td>
                  <td className="p-3.5 font-[500] text-[#171A20]">
                    {s.customerNameAr || s.customerName}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-[400]">
                      <span>{s.origin.city}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#8E8E8E]" />
                      <span className="text-[#171A20]">{s.destination.city}</span>
                    </div>
                    <span className="text-[11px] text-[#8E8E8E] font-mono">{s.distanceKm} km</span>
                  </td>
                  <td className="p-3.5">
                    <div className="truncate max-w-[160px] text-[#393C41]">{s.cargoDescription}</div>
                    <div className="text-[11px] text-[#5C5E62] font-mono">{(s.totalWeightKg / 1000).toFixed(1)} T</div>
                  </td>
                  <td className="p-3.5">
                    {s.vehiclePlate ? (
                      <div>
                        <div className="font-mono font-[500] text-[#171A20] text-[12px]">{s.vehiclePlate}</div>
                        <div className="text-[11px] text-[#5C5E62]">{s.driverName}</div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#5C5E62] font-mono bg-[#F4F4F4] px-2 py-0.5 rounded-[2px] border border-[#D0D1D2]">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[11px] px-2 py-0.5 rounded-[2px] border font-mono font-[500] ${getStatusBadge(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-[500] text-[#171A20]">
                    {s.price.toLocaleString()} {s.currency}
                  </td>
                  <td className="p-3.5 text-end">
                    <button
                      onClick={() => {
                        setSelectedShipmentId(s.id);
                        setCurrentView('tracking_detail');
                      }}
                      className="px-3 py-1.5 rounded-[4px] bg-[#FFFFFF] hover:bg-[#F4F4F4] text-[#171A20] font-[500] text-[12px] border border-[#D0D1D2] transition-colors duration-330 cursor-pointer flex items-center gap-1 ms-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'الجواز' : 'Passport'}</span>
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
