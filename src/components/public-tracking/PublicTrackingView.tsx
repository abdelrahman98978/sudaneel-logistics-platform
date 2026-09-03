'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import { Shipment } from '@/types';
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Package,
  MapPin,
  Truck,
  Sparkles,
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
    <div className="max-w-4xl mx-auto space-y-6 font-sans py-4 text-[#000000] shopify-theme" dir="rtl">
      {/* Search Header Banner */}
      <div className="p-8 sm:p-10 shopify-card bg-[#ffffff] text-center space-y-5">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-[12px] bg-white p-1 flex items-center justify-center border border-[#e4e4e7] shadow-sm">
            <Image
              src="/logo.png"
              alt="سودانيل لوجيستك"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="shopify-tag-mint mx-auto !w-fit">
            <Package className="w-4 h-4" />
            <span>Sovereign Public Telemetry • بوابة التتبع المفتوح</span>
          </div>
          <h1 className="text-[26px] font-[600] text-[#000000] tracking-tight">
            بوابة التتبع المباشر للشحنات والبضائع
          </h1>
          <p className="text-[14px] text-[#71717a] max-w-lg mx-auto">
            أدخل رقم بوليصة الشحن (Waybill) للاستعلام الفوري عن موقع الشاحنة وحالة الشحنة.
          </p>
        </div>

        {/* Pill Search Input */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-[#71717a]" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="مثال: SDN-88419 أو SDN-2024-1256..."
              className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-full ps-10 pe-4 py-3 text-[14px] font-mono outline-none text-[#000000] focus:border-[#000000] shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="btn-shopify-pill !py-3 !px-7 text-[13.5px]"
          >
            <span>استعلام</span>
          </button>
        </form>
      </div>

      {/* Searched Shipment Result */}
      {searchedShipment && (
        <div className="shopify-card p-8 sm:p-10 space-y-6 bg-[#ffffff]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e4e7]">
            <div>
              <span className="shopify-tag-mint !text-[11px]">بوليصة معتمدة وموثقة</span>
              <h2 className="text-[22px] font-mono font-[700] text-[#000000] mt-1">{searchedShipment.trackingNumber}</h2>
            </div>
            <span className="shopify-tag-mint font-mono font-[600] text-[13px]">{searchedShipment.status}</span>
          </div>

          {/* Route Corridor */}
          <div className="p-6 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13.5px]">
            <div className="space-y-1">
              <span className="text-[11px] text-[#000000]/70 font-[600] block">منشأ الشحنة</span>
              <div className="font-[700] text-[15px] text-[#000000]">{searchedShipment.origin.city}</div>
              <div className="text-[12px] text-[#000000]/80">{searchedShipment.origin.address}</div>
            </div>
            <div className="space-y-1 sm:text-end">
              <span className="text-[11px] text-[#000000]/70 font-[600] block">وجهة التسليم</span>
              <div className="font-[700] text-[15px] text-[#000000]">{searchedShipment.destination.city}</div>
              <div className="text-[12px] text-[#000000]/80">{searchedShipment.destination.address}</div>
            </div>
          </div>

          {/* Shipment Progress Milestones */}
          <div className="space-y-3 pt-2">
            <h3 className="font-[600] text-[15px] text-[#000000]">مراحل دورة حياة الشحنة</h3>
            <div className="space-y-2.5">
              {stepsList.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-[12px] flex items-center justify-between transition-colors ${
                    step.completed ? 'bg-[#fbfbf5] border border-[#e4e4e7]' : 'bg-transparent border border-dashed border-[#e4e4e7] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      step.completed ? 'bg-[#c1fbd4] text-[#000000]' : 'bg-[#e4e4e7] text-[#71717a]'
                    }`}>
                      {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[13.5px] ${step.completed ? 'font-[600] text-[#000000]' : 'text-[#71717a]'}`}>
                      {step.titleAr}
                    </span>
                  </div>
                  {step.completed && <span className="shopify-tag-mint !text-[10px]">مكتمل</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#e4e4e7] flex items-center justify-between">
            <span className="text-[12px] text-[#71717a]">تحت مظلة الضمان اللوجستي والتأمين الشامل</span>
            <button
              onClick={() => {
                setSelectedShipmentId(searchedShipment.id);
                setCurrentView('tracking_detail');
              }}
              className="btn-shopify-pill !py-2 !px-5 text-[12.5px]"
            >
              <span>فتح الجواز الرقمي التفصيلي</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
