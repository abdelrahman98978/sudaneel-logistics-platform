'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  MapPin,
  QrCode,
  CheckCircle2,
  Clock,
  Navigation,
  Download,
  Camera,
} from 'lucide-react';

export function ShipmentTrackingPassport() {
  const {
    shipments,
    selectedShipmentId,
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
      <div className="p-8 text-center text-[#5C5E62]">
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-[#171A20]">
      {/* Top Digital Passport Header Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] uppercase font-[500]">
              Digital Shipment Passport
            </span>
            <span className="text-[12px] text-[#3E6AE1] font-mono flex items-center gap-1 font-[500]">
              Telemetry Verified
            </span>
          </div>
          <h2 className="text-[20px] sm:text-[24px] font-[500] font-mono text-[#171A20] flex items-center gap-3">
            <span>{shipment.trackingNumber}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] font-sans font-[500]">
              {shipment.status}
            </span>
          </h2>
          <p className="text-[13px] text-[#5C5E62]">
            {shipment.customerNameAr || shipment.customerName} • {shipment.cargoDescription}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {shipment.status !== 'completed' && shipment.status !== 'pod_verified' && (
            <button
              onClick={() => setIsPodModalOpen(true)}
              className="btn-tesla-primary !min-w-[140px] !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.verifyOtp}</span>
            </button>
          )}

          <button
            onClick={() => alert(lang === 'ar' ? 'جاري تصدير شهادة الجواز الرقمي PDF...' : 'Exporting Digital Passport Certificate PDF...')}
            className="p-2 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] hover:bg-[#F4F4F4] transition-colors duration-330 cursor-pointer"
            title="Download Certificate"
          >
            <Download className="w-4 h-4 text-[#3E6AE1]" />
          </button>
        </div>
      </div>

      {/* Main Passport Grid: Route & Predictive ETA + QR Pass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Route Card (2 cols) */}
        <div className="md:col-span-2 p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#3E6AE1]" />
              <span>Logistics Corridor Route</span>
            </h3>
            <span className="font-mono text-[13px] font-[500] text-[#171A20]">{shipment.distanceKm} KM</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            {/* Origin */}
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-1">
              <div className="text-[11px] text-[#8E8E8E] uppercase font-[500] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#3E6AE1]" /> Origin / نقطة التحميل
              </div>
              <div className="font-[500] text-[#171A20] text-[14px]">{shipment.origin.city}</div>
              <div className="text-[#5C5E62] text-[12px]">{shipment.origin.address}</div>
              <div className="text-[#8E8E8E] text-[11px] pt-1">{shipment.pickupDate}</div>
            </div>

            {/* Destination */}
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-1">
              <div className="text-[11px] text-[#8E8E8E] uppercase font-[500] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#3E6AE1]" /> Destination / موقع التسليم
              </div>
              <div className="font-[500] text-[#171A20] text-[14px]">{shipment.destination.city}</div>
              <div className="text-[#5C5E62] text-[12px]">{shipment.destination.address}</div>
              <div className="text-[#8E8E8E] text-[11px] pt-1">{shipment.deliveryDate}</div>
            </div>
          </div>

          {/* Predictive ETA Widget */}
          <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex items-center justify-center text-[#3E6AE1]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-[#8E8E8E] uppercase font-[500]">Predictive AI ETA</div>
                <div className="text-[16px] font-[500] font-mono text-[#171A20]">{shipment.estimatedEta}</div>
              </div>
            </div>

            <div className="text-end">
              <div className="text-[13px] font-[500] font-mono text-[#3E6AE1]">
                Confidence: {shipment.etaConfidence}%
              </div>
              <div className="text-[11px] text-[#8E8E8E]">Based on historical velocity</div>
            </div>
          </div>
        </div>

        {/* Digital QR Passport Card (1 col) */}
        <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col items-center justify-between text-center space-y-3">
          <div className="space-y-1">
            <div className="font-[500] text-[#171A20] text-[14px]">Digital Passport QR</div>
            <div className="text-[12px] text-[#5C5E62]">Instant scan for mobile gate clearance</div>
          </div>

          {/* Simulated QR Box */}
          <div className="w-36 h-36 rounded-[4px] bg-[#FFFFFF] p-3 flex items-center justify-center border border-[#D0D1D2]">
            <QrCode className="w-28 h-28 text-[#171A20]" />
          </div>

          <div className="text-[12px] font-mono font-[500] text-[#5C5E62]">
            OTP Token: <span className="text-[#171A20] font-[500] tracking-widest">{shipment.podOtp || '749102'}</span>
          </div>
        </div>
      </div>

      {/* Interactive Milestone Timeline */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
        <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#3E6AE1]" />
          <span>Real-time Milestone Timeline & Audit Events</span>
        </h3>

        <div className="relative ps-6 border-s-2 border-[#EEEEEE] space-y-6">
          {shipment.events.map((ev, idx) => (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -start-[31px] top-0.5 w-4 h-4 rounded-full bg-[#FFFFFF] border-2 border-[#3E6AE1]"></div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-3">
                  <span className="font-[500] text-[#171A20] text-[13px]">
                    {lang === 'ar' ? ev.titleAr : ev.titleEn}
                  </span>
                  <span className="text-[11px] text-[#8E8E8E] font-mono">{ev.timestamp}</span>
                </div>
                <p className="text-[12px] text-[#5C5E62]">
                  {lang === 'ar' ? ev.descriptionAr : ev.descriptionEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POD Verification Modal */}
      {isPodModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#171A20]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
              <h3 className="font-[500] text-[15px] text-[#171A20] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#3E6AE1]" />
                <span>{lang === 'ar' ? 'توثيق إثبات التسليم الرقمي (Digital POD)' : 'Digital POD Verification'}</span>
              </h3>
              <button onClick={() => setIsPodModalOpen(false)} className="text-[#8E8E8E] hover:text-[#171A20]">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-[13px]">
              <div className="space-y-1">
                <label className="text-[#5C5E62] block">{lang === 'ar' ? 'اسم المستلم المعتمد:' : 'Receiver Name:'}</label>
                <input
                  value={podReceiverName}
                  onChange={(e) => setPodReceiverName(e.target.value)}
                  placeholder="e.g. Ustaz Sami Hamad"
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#5C5E62] block">{lang === 'ar' ? 'رمز التسليم السري (OTP):' : 'Delivery OTP Code:'}</label>
                <input
                  value={podInputOtp}
                  onChange={(e) => setPodInputOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] font-mono text-center tracking-widest text-[16px] outline-none"
                />
              </div>

              <div className="p-4 rounded-[4px] border border-dashed border-[#D0D1D2] bg-[#F4F4F4] text-center space-y-1">
                <Camera className="w-6 h-6 text-[#3E6AE1] mx-auto" />
                <div className="text-[#171A20] font-[500] text-[12px]">Attach Cargo Photo & Sign POD</div>
                <div className="text-[11px] text-[#5C5E62]">Captured with GPS Coordinates (19.61°N, 37.21°E)</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setIsPodModalOpen(false)}
                className="btn-tesla-secondary flex-1 !min-h-[36px] text-[13px]"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPod}
                className="btn-tesla-primary flex-1 !min-h-[36px] text-[13px]"
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
