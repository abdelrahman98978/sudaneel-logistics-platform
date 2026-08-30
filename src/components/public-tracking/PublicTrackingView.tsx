'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Shipment } from '@/types';
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export function PublicTrackingView() {
  const { shipments, setSelectedShipmentId, setCurrentView, showToast, lang } = useApp();

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
      showToast(
        lang === 'ar' ? 'تم العثور على الشحنة' : 'Shipment Located',
        lang === 'ar' ? `شحنة ${match.trackingNumber} من ${match.origin.city} إلى ${match.destination.city}` : `Shipment ${match.trackingNumber} found`,
        'success'
      );
    } else {
      showToast(
        lang === 'ar' ? 'لم يتم العثور على الشحنة' : 'Shipment Not Found',
        lang === 'ar' ? 'يرجى التأكد من رقم التتبع المدخل أو تجربة رقم تجريبي مثل SDN-2024-1256' : 'Please verify the tracking number and try again',
        'warning'
      );
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
    <div className="max-w-4xl mx-auto space-y-6 font-sans py-4 text-[#171A20]">
      {/* Search Header Banner */}
      <div className="p-8 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] text-center space-y-4">
        <div className="flex justify-center mb-1">
          <div className="w-16 h-16 rounded-[4px] bg-white p-1 flex items-center justify-center border border-[#EEEEEE]">
            <img
              src="/images/brand-logo.jpg"
              alt="سودانيل لوجيستك"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#F4F4F4] text-[#171A20] border border-[#EEEEEE] text-[12px] font-[500]">
          <ShieldCheck className="w-4 h-4 text-[#3E6AE1]" />
          <span>Sudaneel Sovereign Public Tracking Gateway</span>
        </div>

        <h2 className="text-[24px] sm:text-[32px] font-[500] text-[#171A20]">
          {lang === 'ar' ? 'تتبع شحنتك المباشر في أي وقت' : 'Track Your Shipment Live Worldwide'}
        </h2>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2 bg-[#FFFFFF] p-1.5 rounded-[4px] border border-[#D0D1D2]">
          <div className="flex items-center gap-2 px-3 flex-1">
            <Search className="w-4 h-4 text-[#8E8E8E]" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g. SDN-88419 or SDN-2024-1256"
              className="w-full bg-transparent text-[#171A20] font-mono outline-none text-[14px] placeholder-[#8E8E8E]"
            />
          </div>
          <button
            type="submit"
            className="btn-tesla-primary !min-w-[120px] !min-h-[38px] !py-1 !px-4 text-[13px]"
          >
            {lang === 'ar' ? 'تتبع الشحنة' : 'Track Now'}
          </button>
        </form>
      </div>

      {/* Tracking Result Card */}
      {searchedShipment && (
        <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-6 animate-in fade-in">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#EEEEEE]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[20px] font-[500] text-[#171A20]">
                  {searchedShipment.trackingNumber}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] font-mono font-[500]">
                  {searchedShipment.status}
                </span>
              </div>
              <p className="text-[13px] text-[#5C5E62] mt-1">
                {searchedShipment.origin.city} ➔ {searchedShipment.destination.city} ({searchedShipment.cargoDescription})
              </p>
            </div>

            <div className="text-start sm:text-end">
              <span className="text-[11px] text-[#8E8E8E] block">Estimated Delivery (ETA)</span>
              <span className="text-[14px] font-[500] font-mono text-[#171A20]">{searchedShipment.estimatedEta}</span>
              <span className="text-[11px] text-[#3E6AE1] block">{searchedShipment.etaConfidence}% Predictive Confidence</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-3">
            <span className="text-[13px] font-[500] text-[#171A20] block">Milestone Progression</span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {stepsList.map((st, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-[4px] border text-center space-y-1 ${
                    st.completed
                      ? 'bg-[#F4F4F4] border-[#3E6AE1] text-[#171A20]'
                      : 'bg-[#FFFFFF] border-[#EEEEEE] text-[#8E8E8E]'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 mx-auto ${st.completed ? 'text-[#3E6AE1]' : 'text-[#D0D1D2]'}`} />
                  <div className="font-[500] text-[12px]">{lang === 'ar' ? st.titleAr : st.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sanitized Live Telemetry Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[11px] text-[#8E8E8E] block">Origin Location</span>
              <span className="font-[500] text-[#171A20]">{searchedShipment.origin.city}</span>
              <span className="text-[11px] text-[#5C5E62] block">{searchedShipment.origin.address}</span>
            </div>

            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[11px] text-[#8E8E8E] block">Destination Terminal</span>
              <span className="font-[500] text-[#171A20]">{searchedShipment.destination.city}</span>
              <span className="text-[11px] text-[#5C5E62] block">{searchedShipment.destination.address}</span>
            </div>

            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[11px] text-[#8E8E8E] block">POD Certificate</span>
              <span className="font-mono text-[#3E6AE1] font-[500]">SHA-256 Verified</span>
              <span className="text-[11px] text-[#5C5E62] block">Telemetry Validated</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setSelectedShipmentId(searchedShipment.id);
                setCurrentView('tracking_detail');
              }}
              className="btn-tesla-secondary !min-w-[180px] !min-h-[38px] !py-1 !px-4 text-[13px] flex items-center gap-1.5"
            >
              <span>{lang === 'ar' ? 'عرض الجواز الرقمي الكامل' : 'Open Full Digital Passport'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Services Matrix Visual Trust Card */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
          <div>
            <h3 className="font-[500] text-[15px] text-[#171A20]">خدمات سودانيل اللوجستية المعتمدة</h3>
            <p className="text-[12px] text-[#5C5E62]">منظومة نقل وتخزين وتخليص جمركي شاملة لخدمة قطاعات التجارة والصناعة</p>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#3E6AE1]">
            9 Certified Services
          </span>
        </div>

        <div className="flex justify-center p-2">
          <img
            src="/images/services-badges-2.jpg"
            alt="خدمات سودانيل لوجيستك"
            className="w-full max-w-lg h-auto rounded-[4px]"
          />
        </div>
      </div>
    </div>
  );
}
