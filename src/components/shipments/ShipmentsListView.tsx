'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Shipment, ShipmentStatus } from '@/types';
import {
  Package,
  Search,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Truck,
  ArrowRight,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export function ShipmentsListView() {
  const {
    shipments,
    setCurrentView,
    setSelectedShipmentId,
    t,
    lang,
    updateShipmentStatus,
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
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'delivered':
      case 'completed':
      case 'pod_verified':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'delayed':
      case 'failed':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'awaiting_carrier':
      case 'quote_requested':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-navy-800 text-gray-300 border-navy-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-navy-900/90 border border-gold/25 shadow-xl">
        <div>
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-gold" />
            <span>{t.shipments} ({shipments.length})</span>
          </h2>
          <p className="text-xs text-gray-400">
            {lang === 'ar'
              ? 'إدارة دورة حياة الشحنات الكاملة عبر محرك الـ State Machine وجواز السفر الرقمي.'
              : 'End-to-end shipment lifecycle management with state machine events and digital passport.'}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('create_shipment')}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.createShipment}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-navy-900/80 border border-gold/20">
          <Search className="w-4 h-4 text-gold" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-navy-900 border border-gold/20 text-xs text-gray-200 outline-none cursor-pointer"
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
      <div className="rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-start text-xs">
            <thead className="bg-navy-950/80 text-gold/80 font-bold uppercase tracking-wider border-b border-gold/15 text-[11px]">
              <tr>
                <th className="p-3.5 text-start">Tracking #</th>
                <th className="p-3.5 text-start">Customer</th>
                <th className="p-3.5 text-start">Route</th>
                <th className="p-3.5 text-start">Cargo & Weight</th>
                <th className="p-3.5 text-start">Assigned Fleet</th>
                <th className="p-3.5 text-start">Status</th>
                <th className="p-3.5 text-start">Price</th>
                <th className="p-3.5 text-end">Passport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 text-gray-200">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-navy-800/60 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-gold">
                    {s.trackingNumber}
                  </td>
                  <td className="p-3.5 font-semibold text-white">
                    {s.customerNameAr || s.customerName}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span>{s.origin.city}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-white">{s.destination.city}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">{s.distanceKm} km</span>
                  </td>
                  <td className="p-3.5">
                    <div className="truncate max-w-[160px] font-medium text-gray-300">{s.cargoDescription}</div>
                    <div className="text-[10px] text-gold font-mono">{(s.totalWeightKg / 1000).toFixed(1)} T</div>
                  </td>
                  <td className="p-3.5">
                    {s.vehiclePlate ? (
                      <div>
                        <div className="font-mono font-bold text-white text-xs">{s.vehiclePlate}</div>
                        <div className="text-[10px] text-gray-400">{s.driverName}</div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-mono font-semibold ${getStatusBadge(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">
                    {s.price.toLocaleString()} {s.currency}
                  </td>
                  <td className="p-3.5 text-end">
                    <button
                      onClick={() => {
                        setSelectedShipmentId(s.id);
                        setCurrentView('tracking_detail');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold text-gold hover:text-navy-950 font-bold text-xs border border-gold/40 transition-all cursor-pointer flex items-center gap-1 ms-auto"
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
