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
  Printer,
  PenTool,
  X,
  FileCheck2,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { printDocument } from '@/lib/export-utils';
import { SignaturePad } from '@/components/common/SignaturePad';

export function ShipmentTrackingPassport() {
  const {
    shipments,
    selectedShipmentId,
    updateShipmentStatus,
    showToast,
    t,
    lang,
  } = useApp();

  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [podReceiverName, setPodReceiverName] = useState('');

  const shipment =
    shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

  if (!shipment) {
    return (
      <div className="p-8 text-center text-[#71717a]">
        No shipment selected.
      </div>
    );
  }

  const handleSaveSignature = (dataUrl: string) => {
    if (!podReceiverName.trim()) {
      showToast(
        lang === 'ar' ? 'اسم المستلم مطلوب' : 'Receiver Name Required',
        lang === 'ar' ? 'يرجى إدخال اسم المستلم المعتمد قبل حفظ التوقيع' : 'Please enter the receiver name',
        'warning'
      );
      return;
    }
    updateShipmentStatus(shipment.id, 'pod_verified');
    setIsPodModalOpen(false);
    showToast(
      lang === 'ar' ? 'تم توثيق إثبات التسليم الرقمي' : 'Digital POD Confirmed',
      lang === 'ar'
        ? `تم اعتماد توقيع (${podReceiverName}) للشحنة ${shipment.trackingNumber} وإطلاق التسوية المالية تلقائياً`
        : `POD verified for ${shipment.trackingNumber}. Automated escrow settlement triggered.`,
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Digital Passport Header Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="shopify-tag-mint">
              Digital Shipment Passport
            </span>
            <span className="shopify-tag-pistachio">
              Telemetry Verified
            </span>
          </div>
          <h1 className="text-[26px] font-[600] font-mono text-[#000000] flex items-center gap-3">
            <span>{shipment.trackingNumber}</span>
            <span className="shopify-tag-mint !text-[12px] font-sans">
              {shipment.status}
            </span>
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420]">
            العميل: <strong className="text-[#000000] font-[600]">{shipment.customerName}</strong> • الناقل: <strong className="text-[#000000] font-[600]">{shipment.carrierName}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => printDocument(`Shipment-Passport-${shipment.trackingNumber}`)}
            className="btn-shopify-outline"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الجواز الرسمي</span>
          </button>

          <button
            onClick={() => setIsPodModalOpen(true)}
            className="btn-shopify-pill"
          >
            <PenTool className="w-4 h-4" />
            <span>توقيع إثبات التسليم (Digital POD)</span>
          </button>
        </div>
      </div>

      {/* Printable Passport Paper Container (Shopify 12px Card with Level 3 Stacked Halo) */}
      <div id="printable-passport" className="shopify-card p-8 sm:p-10 space-y-8 bg-[#ffffff]">
        {/* Passport Header with Barcode & Logo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-[#e4e4e7]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[12px] bg-white p-1 flex items-center justify-center border border-[#e4e4e7] shadow-sm">
              <img src="/images/brand-logo.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-[600] text-[18px] text-[#000000]">{t.brandName}</h2>
              <p className="text-[12px] text-[#71717a]">Consignment Digital Passport & Telemetry Chain</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#fbfbf5] p-3 rounded-[12px] border border-[#e4e4e7]">
            <div className="text-end">
              <div className="text-[11px] text-[#71717a]">رقم البوليصة الموحد</div>
              <div className="font-mono text-[16px] font-[700] text-[#000000]">{shipment.trackingNumber}</div>
            </div>
            <div className="w-12 h-12 bg-white p-1 rounded-[8px] border border-[#e4e4e7] flex items-center justify-center">
              <QrCode className="w-10 h-10 text-[#000000]" />
            </div>
          </div>
        </div>

        {/* Route Corridor Specs (Shopify Pistachio Band Style) */}
        <div className="p-6 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px] text-[#000000]">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-[600]">
              <MapPin className="w-4 h-4 text-[#000000]" />
              <span>محطة المنشأ (Origin Hub)</span>
            </div>
            <div className="font-[600] text-[15px]">{shipment.origin.city}</div>
            <div className="text-[12px] text-[#000000]/80">{shipment.origin.address}</div>
            <div className="text-[11px] text-[#000000]/70 font-mono">تاريخ الشحن: {shipment.pickupDate}</div>
          </div>

          <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-[#000000]/15 py-3 md:py-0 px-4">
            <Truck className="w-6 h-6 text-[#000000] mb-1" />
            <span className="font-mono font-[700] text-[14px]">{shipment.distanceKm} كم</span>
            <span className="text-[11px] text-[#000000]/80">زمن العبور التقديري: {shipment.estimatedEta}</span>
          </div>

          <div className="space-y-1 md:text-end">
            <div className="flex items-center gap-1.5 font-[600] md:justify-end">
              <MapPin className="w-4 h-4 text-[#000000]" />
              <span>محطة الوصول (Destination)</span>
            </div>
            <div className="font-[600] text-[15px]">{shipment.destination.city}</div>
            <div className="text-[12px] text-[#000000]/80">{shipment.destination.address}</div>
            <div className="text-[11px] text-[#000000]/70 font-mono">تاريخ التسليم: {shipment.deliveryDate}</div>
          </div>
        </div>

        {/* Cargo & Carrier Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
          <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
            <span className="text-[#71717a] text-[11px] block">نوع الحمولة</span>
            <span className="font-[600] text-[#000000]">{shipment.cargoType}</span>
            <span className="text-[11px] text-[#71717a] block mt-0.5">{shipment.cargoDescription}</span>
          </div>

          <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
            <span className="text-[#71717a] text-[11px] block">الوزن الإجمالي</span>
            <span className="font-mono font-[700] text-[16px] text-[#000000]">{shipment.totalWeightKg.toLocaleString()} كجم</span>
            <span className="text-[11px] text-[#71717a] block mt-0.5">{shipment.totalVolumeM3} م³</span>
          </div>

          <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
            <span className="text-[#71717a] text-[11px] block">الناقل وشاحنة النقل</span>
            <span className="font-[600] text-[#000000]">{shipment.carrierName}</span>
            <span className="text-[11px] text-[#71717a] block mt-0.5">{shipment.requiredVehicleType}</span>
          </div>

          <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2]">
            <span className="text-[#000000]/80 text-[11px] block font-[500]">القيمة والتعرفة</span>
            <span className="font-mono font-[700] text-[16px] text-[#000000]">{shipment.price.toLocaleString()} SDG</span>
            <span className="text-[11px] text-[#000000] block mt-0.5 font-[500]">مشمولة بالتأمين 100%</span>
          </div>
        </div>

        {/* Real-time Tracking Events Timeline */}
        <div className="space-y-4 pt-2">
          <h3 className="font-[600] text-[16px] text-[#000000] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#000000]" />
            <span>سجل ومراحل حركة الشحنة (Audit Trail)</span>
          </h3>

          <div className="space-y-3">
            {shipment.events.map((ev, idx) => (
              <div key={ev.id || idx} className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#c1fbd4] text-[#000000] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-[600] text-[14px] text-[#000000]">{ev.titleAr}</div>
                    <div className="text-[12.5px] text-[#71717a] mt-0.5">{ev.descriptionAr}</div>
                  </div>
                </div>
                <div className="text-end font-mono text-[12px] text-[#71717a] flex-shrink-0">
                  {ev.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Proof of Delivery (POD) Modal with Signature Pad */}
      {isPodModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#000000]" />
                <h3 className="font-[600] text-[16px] text-[#000000]">توثيق إثبات التسليم (Digital POD)</h3>
              </div>
              <button onClick={() => setIsPodModalOpen(false)} className="p-1.5 rounded-full hover:bg-[#fbfbf5] text-[#71717a]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[12px] font-[500] text-[#71717a] block mb-1">اسم المستلم المعتمد</label>
                <input
                  type="text"
                  value={podReceiverName}
                  onChange={(e) => setPodReceiverName(e.target.value)}
                  placeholder="أدخل الاسم الثلاثي للمستلم بالمستودع..."
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2 text-[13px] outline-none focus:border-[#000000]"
                />
              </div>

              <div>
                <label className="text-[12px] font-[500] text-[#71717a] block mb-1">التوقيع الإلكتروني الحي</label>
                <div className="border border-[#e4e4e7] rounded-[12px] overflow-hidden bg-[#ffffff]">
                  <SignaturePad onSave={handleSaveSignature} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
