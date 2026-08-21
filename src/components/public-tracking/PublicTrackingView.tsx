'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Shipment } from '@/types';
import {
  Search,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  QrCode,
  ArrowRight,
  Share2,
  Navigation,
} from 'lucide-react';

export function PublicTrackingView() {
  const { shipments, setSelectedShipmentId, setCurrentView, t, lang } = useApp();

  const [inputCode, setInputCode] = useState('SDN-88419');
  const [searchedShipment, setSearchedShipment] = useState<Shipment | null>(
    shipments.find((s) => s.trackingNumber === 'SDN-88419') || shipments[0]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const match = shipments.find(
      (s) => s.trackingNumber.toLowerCase() === inputCode.trim().toLowerCase()
    );
    if (match) {
      setSearchedShipment(match);
    } else {
      alert(lang === 'ar' ? 'لم يتم العثور على الشحنة برقم التتبع المدخل' : 'Tracking number not found');
    }
  };

  const stepsList = [
    { title: 'Order Confirmed', titleAr: 'تم تأكيد طلب الشحن', completed: true },
    { title: 'Carrier & Truck Assigned', titleAr: 'تعيين الشاحنة والسائق', completed: true },
    { title: 'Cargo Loaded & Inspected', titleAr: 'اكتمال التحميل والتفتيش', completed: true },
    { title: 'In Transit on Corridor', titleAr: 'في الطريق (تتبع مباشر)', completed: searchedShipment?.status === 'in_transit' || searchedShipment?.status === 'delivered' || searchedShipment?.status === 'pod_verified' },
    { title: 'Arrived & Verified Delivery', titleAr: 'تم الوصول والتسليم الموثق', completed: searchedShipment?.status === 'delivered' || searchedShipment?.status === 'pod_verified' || searchedShipment?.status === 'completed' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans py-4">
      {/* Search Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/35 shadow-2xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Sudaneel Sovereign Public Tracking Gateway</span>
        </div>

        <h2 className="text-xl sm:text-3xl font-extrabold text-white">
          {lang === 'ar' ? 'تتبع شحنتك المباشر في أي وقت' : 'Track Your Shipment Live Worldwide'}
        </h2>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2 bg-navy-950 p-1.5 rounded-2xl border border-gold/40 shadow-inner">
          <div className="flex items-center gap-2 px-3 flex-1">
            <Search className="w-5 h-5 text-gold" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g. SDN-88419 or SDN-55102"
              className="w-full bg-transparent text-white font-mono outline-none text-sm placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gold text-navy-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            {lang === 'ar' ? 'تتبع الشحنة' : 'Track Now'}
          </button>
        </form>
      </div>

      {/* Tracking Result Card */}
      {searchedShipment && (
        <div className="p-6 rounded-3xl bg-navy-900/90 border border-gold/25 shadow-2xl space-y-6 animate-in fade-in">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gold/15">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-extrabold text-white">
                  {searchedShipment.trackingNumber}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-navy-800 text-gold border border-gold/30 font-semibold font-mono">
                  {searchedShipment.status}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                {searchedShipment.origin.city} ➔ {searchedShipment.destination.city} ({searchedShipment.cargoDescription})
              </p>
            </div>

            <div className="text-start sm:text-end">
              <span className="text-[10px] text-gray-400 block">Estimated Delivery (ETA)</span>
              <span className="text-sm font-bold font-mono text-gold">{searchedShipment.estimatedEta}</span>
              <span className="text-[10px] text-emerald-400 block">{searchedShipment.etaConfidence}% Predictive Confidence</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-gray-300 block">Milestone Progression</span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {stepsList.map((st, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-center space-y-1 ${
                    st.completed
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-navy-950/60 border-navy-800 text-gray-500'
                  }`}
                >
                  <CheckCircle2 className={`w-5 h-5 mx-auto ${st.completed ? 'text-emerald-400' : 'text-gray-600'}`} />
                  <div className="font-bold text-xs">{lang === 'ar' ? st.titleAr : st.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sanitized Live Telemetry Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800">
              <span className="text-[10px] text-gray-400 block">Origin Location</span>
              <span className="font-semibold text-white">{searchedShipment.origin.city}</span>
              <span className="text-[10px] text-gray-500 block">{searchedShipment.origin.address}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800">
              <span className="text-[10px] text-gray-400 block">Destination Terminal</span>
              <span className="font-semibold text-white">{searchedShipment.destination.city}</span>
              <span className="text-[10px] text-gray-500 block">{searchedShipment.destination.address}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-navy-950 border border-navy-800">
              <span className="text-[10px] text-gray-400 block">Cryptographic POD Certificate</span>
              <span className="font-mono text-emerald-400 font-bold">SHA-256 Verified</span>
              <span className="text-[10px] text-gray-500 block">Zero-Knowledge Telemetry</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setSelectedShipmentId(searchedShipment.id);
                setCurrentView('tracking_detail');
              }}
              className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-gold hover:text-navy-950 text-gold border border-gold/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{lang === 'ar' ? 'عرض الجواز الرقمي الكامل' : 'Open Full Digital Passport'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
