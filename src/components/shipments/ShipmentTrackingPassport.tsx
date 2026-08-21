'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Shipment, ShipmentStatus } from '@/types';
import {
  FileCheck2,
  MapPin,
  Truck,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Clock,
  Navigation,
  Download,
  Share2,
  Phone,
  User,
  ArrowRight,
  AlertTriangle,
  Lock,
  Sparkles,
  Camera,
} from 'lucide-react';

export function ShipmentTrackingPassport() {
  const {
    shipments,
    selectedShipmentId,
    setCurrentView,
    updateShipmentStatus,
    t,
    lang,
  } = useApp();

  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [podInputOtp, setPodInputOtp] = useState('');
  const [podReceiverName, setPodReceiverName] = useState('');

  const shipment =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  if (!shipment) {
    return (
      <div className="p-8 text-center text-gray-400">
        No shipment selected.
      </div>
    );
  }

  const handleVerifyPod = () => {
    if (!podReceiverName) {
      alert(lang === 'ar' ? 'الرجاء إدخال اسم المستلم' : 'Please enter receiver name');
      return;
    }
    updateShipmentStatus(shipment.id, 'pod_verified');
    setIsPodModalOpen(false);
    alert(
      lang === 'ar'
        ? `تم توثيق إثبات التسليم الرقمي بنجاح للشحنة ${shipment.trackingNumber}! تم إطلاق التسوية المالية تلقائياً.`
        : `Digital Proof of Delivery verified for ${shipment.trackingNumber}! Automated settlement triggered.`
    );
  };

  const stepsList: { status: ShipmentStatus; labelAr: string; labelEn: string }[] = [
    { status: 'confirmed', labelAr: 'تم تأكيد الشحنة', labelEn: 'Order Confirmed' },
    { status: 'carrier_assigned', labelAr: 'تعيين الشاحنة والسائق', labelEn: 'Carrier Assigned' },
    { status: 'loading', labelAr: 'جاري التحميل ومطابقة البوالص', labelEn: 'Loading & Manifest' },
    { status: 'in_transit', labelAr: 'في الطريق (تتبع GPS حي)', labelEn: 'In Transit' },
    { status: 'at_destination', labelAr: 'وصول الوجهة والتفريغ', labelEn: 'At Destination' },
    { status: 'delivered', labelAr: 'تم التسليم والتحقق الرقمي', labelEn: 'Delivered & Verified' },
  ];

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Digital Passport Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/35 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 uppercase font-bold">
              Digital Shipment Passport
            </span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Sovereign Blockchain & Telemetry Verified
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-white flex items-center gap-3">
            <span>{shipment.trackingNumber}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-navy-800 text-gold border border-gold/30 font-sans">
              {shipment.status}
            </span>
          </h2>
          <p className="text-xs text-gray-300">
            {shipment.customerNameAr || shipment.customerName} • {shipment.cargoDescription}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {shipment.status !== 'completed' && shipment.status !== 'pod_verified' && (
            <button
              onClick={() => setIsPodModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.verifyOtp}</span>
            </button>
          )}

          <button
            onClick={() => alert(lang === 'ar' ? 'جاري تصدير شهادة الجواز الرقمي PDF...' : 'Exporting Digital Passport Certificate PDF...')}
            className="p-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-200 border border-gold/20 text-xs transition-colors cursor-pointer"
            title="Download Certificate"
          >
            <Download className="w-4 h-4 text-gold" />
          </button>
        </div>
      </div>

      {/* Main Passport Grid: Route & Predictive ETA + QR Pass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Route Card (2 cols) */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-navy-900/90 border border-gold/25 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gold/15">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-gold" />
              <span>Logistics Corridor Route</span>
            </h3>
            <span className="font-mono text-xs font-bold text-gold">{shipment.distanceKm} KM</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Origin */}
            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
              <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold" /> Origin / نقطة التحميل
              </div>
              <div className="font-bold text-white text-sm">{shipment.origin.city}</div>
              <div className="text-gray-300 text-[11px]">{shipment.origin.address}</div>
              <div className="text-gray-400 text-[10px] pt-1">{shipment.pickupDate}</div>
            </div>

            {/* Destination */}
            <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
              <div className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-sky-400" /> Destination / موقع التسليم
              </div>
              <div className="font-bold text-white text-sm">{shipment.destination.city}</div>
              <div className="text-gray-300 text-[11px]">{shipment.destination.address}</div>
              <div className="text-gray-400 text-[10px] pt-1">{shipment.deliveryDate}</div>
            </div>
          </div>

          {/* Predictive ETA Widget */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-gold/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold">Predictive AI ETA</div>
                <div className="text-base font-bold font-mono text-white">{shipment.estimatedEta}</div>
              </div>
            </div>

            <div className="text-end">
              <div className="text-xs font-bold font-mono text-emerald-400">
                Confidence: {shipment.etaConfidence}%
              </div>
              <div className="text-[10px] text-gray-400">Based on historical velocity</div>
            </div>
          </div>
        </div>

        {/* Digital QR Passport Card (1 col) */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-navy-900/90 to-navy-950 border border-gold/25 shadow-xl flex flex-col items-center justify-between text-center space-y-3">
          <div className="space-y-1">
            <div className="font-bold text-white text-sm">Digital Passport QR</div>
            <div className="text-[11px] text-gray-400">Instant scan for mobile gate clearance</div>
          </div>

          {/* Simulated QR Box */}
          <div className="w-36 h-36 rounded-2xl bg-white p-3 shadow-2xl flex items-center justify-center border-4 border-gold/40">
            <QrCode className="w-28 h-28 text-navy-950" />
          </div>

          <div className="text-xs font-mono font-bold text-gold">
            OTP Token: <span className="text-white tracking-widest">{shipment.podOtp || '749102'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Milestone Timeline */}
      <div className="p-5 rounded-2xl bg-navy-900/90 border border-gold/25 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold" />
          <span>Real-time Milestone Timeline & Audit Events</span>
        </h3>

        <div className="relative ps-6 border-s-2 border-gold/30 space-y-6">
          {shipment.events.map((ev, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -start-[31px] top-0.5 w-4 h-4 rounded-full bg-gold border-2 border-navy-950 shadow-md"></div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {lang === 'ar' ? ev.titleAr : ev.titleEn}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{ev.timestamp}</span>
                </div>
                <p className="text-xs text-gray-300">
                  {lang === 'ar' ? ev.descriptionAr : ev.descriptionEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POD Verification Modal */}
      {isPodModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-900 border border-gold/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gold/20">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{lang === 'ar' ? 'توثيق إثبات التسليم الرقمي (Digital POD)' : 'Digital POD Verification'}</span>
              </h3>
              <button onClick={() => setIsPodModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">{lang === 'ar' ? 'اسم المستلم المعتمد:' : 'Receiver Name:'}</label>
                <input
                  value={podReceiverName}
                  onChange={(e) => setPodReceiverName(e.target.value)}
                  placeholder="e.g. Ustaz Sami Hamad"
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/30 text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">{lang === 'ar' ? 'رمز التسليم السري (OTP):' : 'Delivery OTP Code:'}</label>
                <input
                  value={podInputOtp}
                  onChange={(e) => setPodInputOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/30 text-white font-mono text-center tracking-widest text-base outline-none"
                />
              </div>

              {/* Upload evidence simulation */}
              <div className="p-3 rounded-xl border border-dashed border-gold/30 bg-navy-950/60 text-center space-y-1">
                <Camera className="w-6 h-6 text-gold mx-auto" />
                <div className="text-gray-300 font-semibold text-[11px]">Attach Cargo Photo & Sign POD</div>
                <div className="text-[10px] text-gray-400">Captured with GPS Coordinates (19.61°N, 37.21°E)</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsPodModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-navy-800 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPod}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-navy-950 text-xs font-bold shadow-lg cursor-pointer"
              >
                Confirm POD & Settle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
