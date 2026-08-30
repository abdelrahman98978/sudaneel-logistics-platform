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
  Layers,
  FileText,
  DollarSign,
  AlertTriangle,
  History,
  ShieldAlert,
  User,
  Phone,
  ThermometerSnowflake,
  Fuel,
  Compass,
  FileCode,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { printDocument } from '@/lib/export-utils';
import { SignaturePad } from '@/components/common/SignaturePad';

type TabKey =
  | 'overview'
  | 'tracking'
  | 'route'
  | 'cargo'
  | 'documents'
  | 'fleet_driver'
  | 'finance'
  | 'timeline'
  | 'incidents'
  | 'audit';

export function ShipmentTrackingPassport() {
  const {
    shipments,
    selectedShipmentId,
    updateShipmentStatus,
    showToast,
    vehicles,
    drivers,
    incidents,
    t,
    lang,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
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

  const assignedVehicle = vehicles.find((v) => v.id === shipment.vehicleId) || vehicles[0];
  const assignedDriver = drivers.find((d) => d.id === shipment.driverId) || drivers[0];
  const relatedIncidents = incidents.filter((i) => i.shipmentId === shipment.id);

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

  const tabs: { key: TabKey; labelAr: string; labelEn: string; icon: React.ElementType }[] = [
    { key: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: Layers },
    { key: 'tracking', labelAr: 'التتبع الحي', labelEn: 'Live Tracking', icon: Navigation },
    { key: 'route', labelAr: 'المسار والمحطات', labelEn: 'Route & Stops', icon: MapPin },
    { key: 'cargo', labelAr: 'تفاصيل الحمولة', labelEn: 'Cargo Specs', icon: Sparkles },
    { key: 'documents', labelAr: 'المستندات والبوالص', labelEn: 'Documents', icon: FileText },
    { key: 'fleet_driver', labelAr: 'السائق والمركبة', labelEn: 'Fleet & Driver', icon: Truck },
    { key: 'finance', labelAr: 'المالية والتسوية', labelEn: 'Finance & Payout', icon: DollarSign },
    { key: 'timeline', labelAr: 'سجل الأحداث', labelEn: 'Timeline', icon: Clock },
    { key: 'incidents', labelAr: 'الحوادث والتنبيهات', labelEn: 'Incidents', icon: ShieldAlert },
    { key: 'audit', labelAr: 'سجل التدقيق (Audit)', labelEn: 'Audit Trail', icon: History },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Digital Passport Header Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="shopify-tag-mint">
              Digital Shipment Passport • Section 8.2
            </span>
            <span className="shopify-tag-pistachio">
              Telemetry Verified
            </span>
          </div>
          <h1 className="text-[26px] font-[600] font-mono text-[#000000] flex items-center gap-3">
            <span>{shipment.trackingNumber}</span>
            <span className="shopify-tag-mint !text-[12px] font-sans">
              {shipment.status.toUpperCase()}
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

      {/* 10-Tab Navigation Bar (Shopify Pill Tabs) */}
      <div className="shopify-card p-2 bg-[#ffffff] overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-[500] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#c1fbd4] text-[#000000] shadow-sm font-[600]'
                    : 'text-[#71717a] hover:text-[#000000] hover:bg-[#fbfbf5]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT VIEWER */}
      <div id="printable-passport" className="shopify-card p-8 sm:p-10 space-y-8 bg-[#ffffff]">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Passport Header */}
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

            {/* Route Corridor Specs */}
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

            {/* Key Metric Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px]">
              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <span className="text-[#71717a] text-[11px] block">نوع الحمولة</span>
                <span className="font-[600] text-[#000000]">{shipment.cargoType}</span>
                <span className="text-[11px] text-[#71717a] block mt-0.5">{shipment.cargoDescription}</span>
              </div>

              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <span className="text-[#71717a] text-[11px] block">الوزن الإجمالي</span>
                <span className="font-mono font-[700] text-[16px] text-[#000000]">
                  {shipment.totalWeightKg.toLocaleString()} كجم
                </span>
                <span className="text-[11px] text-[#71717a] block mt-0.5">{shipment.totalVolumeM3} م³</span>
              </div>

              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <span className="text-[#71717a] text-[11px] block">الناقل وشاحنة النقل</span>
                <span className="font-[600] text-[#000000]">{shipment.carrierName}</span>
                <span className="text-[11px] text-[#71717a] block mt-0.5">{shipment.requiredVehicleType}</span>
              </div>

              <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2]">
                <span className="text-[#000000]/80 text-[11px] block font-[500]">القيمة والتعرفة</span>
                <span className="font-mono font-[700] text-[16px] text-[#000000]">
                  {shipment.price.toLocaleString()} SDG
                </span>
                <span className="text-[11px] text-[#000000] block mt-0.5 font-[500]">مشمولة بالتأمين 100%</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE TRACKING */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="p-6 rounded-[16px] bg-[#0a0a0a] text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#14A44D] animate-ping" />
                  <span className="font-mono text-[14px]">GPS LIVE TELEMETRY STREAM</span>
                </div>
                <span className="shopify-tag-mint text-[11px]">4s Refresh Rate</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3 bg-white/5 rounded-[10px] border border-white/10">
                  <span className="text-[11px] text-[#a1a1aa] block">السرعة الحالية</span>
                  <span className="font-mono font-[700] text-[18px] text-white">68 كم/س</span>
                </div>
                <div className="p-3 bg-white/5 rounded-[10px] border border-white/10">
                  <span className="text-[11px] text-[#a1a1aa] block">الإحداثيات الحالية</span>
                  <span className="font-mono text-[13px] text-[#c1fbd4]">15.552° N, 32.531° E</span>
                </div>
                <div className="p-3 bg-white/5 rounded-[10px] border border-white/10">
                  <span className="text-[11px] text-[#a1a1aa] block">المسافة المتبقية</span>
                  <span className="font-mono font-[700] text-[18px] text-white">184 كم</span>
                </div>
                <div className="p-3 bg-white/5 rounded-[10px] border border-white/10">
                  <span className="text-[11px] text-[#a1a1aa] block">موثوقية الوصول ETA</span>
                  <span className="font-mono font-[700] text-[18px] text-[#14A44D]">97.8%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-[#0849A8]" />
                <div>
                  <div className="font-[600] text-[#000000]">الممر السيادي النشط</div>
                  <div className="text-[12px] text-[#71717a]">شريان بورتسودan - الخرطوم عبر ممر عطبرة الآمن</div>
                </div>
              </div>
              <span className="shopify-tag-mint text-[11px]">Geofence Compliant</span>
            </div>
          </div>
        )}

        {/* TAB 3: ROUTE & STOPS */}
        {activeTab === 'route' && (
          <div className="space-y-4">
            <h3 className="font-[600] text-[16px] text-[#000000]">محطات التفتيش والعبور المجدولة</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] flex items-center justify-between">
                <div>
                  <div className="font-[600] text-[14px] text-[#000000]">نقطة الانطلاق: مستودعات بورتسودان المركزية</div>
                  <div className="text-[12px] text-[#71717a]">تم التفتيش والتحميل والختم الإلكتروني</div>
                </div>
                <span className="shopify-tag-mint text-[11px]">اكتملت 08:30 ص</span>
              </div>
              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between">
                <div>
                  <div className="font-[600] text-[14px] text-[#000000]">نقطة العبور 1: محطة جبل أولياء اللوجستية</div>
                  <div className="text-[12px] text-[#71717a]">فحص سلامة الأختام والحرارة</div>
                </div>
                <span className="shopify-tag-shade text-[11px]">قيد الوصول 1:45 م</span>
              </div>
              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between">
                <div>
                  <div className="font-[600] text-[14px] text-[#000000]">نقطة الوصول: مستودعات الخرطوم بحري</div>
                  <div className="text-[12px] text-[#71717a]">تسليم المستندات وتوقيع الـ POD الإلكتروني</div>
                </div>
                <span className="shopify-tag-shade text-[11px]">مجدول 5:00 م</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CARGO SPECS */}
        {activeTab === 'cargo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <span className="text-[11px] text-[#71717a] block">تصنيف الحمولة</span>
                <span className="font-[600] text-[#000000] text-[15px]">{shipment.cargoDescription}</span>
                <span className="text-[11px] text-[#71717a] block mt-1">كود الصنف: PRD-SDN-8941</span>
              </div>
              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <span className="text-[11px] text-[#71717a] block">الاشتراطات الحرارية</span>
                <span className="font-[600] text-[#000000] text-[15px]">
                  {shipment.isTempControlled ? 'مبردة (2° إلى 8° مئوية)' : 'بضائع جافة اعتيادية'}
                </span>
                <span className="text-[11px] text-[#14A44D] block mt-1">حساسات Telemetry تعمل 100%</span>
              </div>
              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <span className="text-[11px] text-[#71717a] block">التأمين والمسؤولية</span>
                <span className="font-[600] text-[#000000] text-[15px]">تغطية سيادية شاملة 100%</span>
                <span className="text-[11px] text-[#71717a] block mt-1">بوليصة تأمين رقم: INS-2026-9912</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <h3 className="font-[600] text-[16px] text-[#000000]">المستندات والبوالص الرقمية الصادرة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#0849A8]" />
                  <div>
                    <div className="font-[600] text-[13.5px] text-[#000000]">بوليصة الشحن الرسمية (e-BOL)</div>
                    <div className="text-[11px] text-[#71717a] font-mono">BOL-{shipment.trackingNumber}.pdf</div>
                  </div>
                </div>
                <button
                  onClick={() => printDocument(`e-BOL-${shipment.trackingNumber}`)}
                  className="btn-shopify-outline !p-2 !rounded-full"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="w-5 h-5 text-[#14A44D]" />
                  <div>
                    <div className="font-[600] text-[13.5px] text-[#000000]">شهادة الإفراج الجمركي (Customs Clearance)</div>
                    <div className="text-[11px] text-[#71717a] font-mono">CUST-REL-2026.pdf</div>
                  </div>
                </div>
                <button
                  onClick={() => printDocument(`Customs-Release-${shipment.trackingNumber}`)}
                  className="btn-shopify-outline !p-2 !rounded-full"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FLEET & DRIVER */}
        {activeTab === 'fleet_driver' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-[600] text-[15px] text-[#000000] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#0849A8]" />
                    <span>بيانات الشاحنة والمركبة</span>
                  </div>
                  <span className="shopify-tag-mint text-[11px]">مفحوصة</span>
                </div>
                <div className="text-[13px] space-y-1.5">
                  <div>لوحة المركبة: <strong className="font-mono text-[#000000]">{assignedVehicle?.plateNumber || 'خ 12-9841'}</strong></div>
                  <div>الموديل والطراز: <strong className="text-[#000000]">{assignedVehicle?.makeModel || 'Volvo FH16 Heavy'}</strong></div>
                  <div>الحمولة القصوى: <strong className="font-mono text-[#000000]">{assignedVehicle?.capacityTons || 35} طن</strong></div>
                </div>
              </div>

              <div className="p-5 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-[600] text-[15px] text-[#000000] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#0849A8]" />
                    <span>السائق المعتمد</span>
                  </div>
                  <span className="shopify-tag-mint text-[11px]">تقييم 4.9 ★</span>
                </div>
                <div className="text-[13px] space-y-1.5">
                  <div>الاسم الكامل: <strong className="text-[#000000]">{assignedDriver?.nameAr || 'عثمان عبد الله يوسف'}</strong></div>
                  <div>رقم الاتصال المباشر: <strong className="font-mono text-[#000000]">{assignedDriver?.phone || '+249 912 345 678'}</strong></div>
                  <div>رخصة القيادة: <strong className="font-mono text-[#000000]">درجة أولى نقل ثقيل سيادي</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: FINANCE */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="p-5 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2] flex items-center justify-between">
              <div>
                <div className="text-[12px] text-[#000000]/80">إجمالي فاتورة الشحن المعتمدة</div>
                <div className="font-mono font-[700] text-[22px] text-[#000000]">
                  {shipment.price.toLocaleString()} SDG
                </div>
              </div>
              <span className="shopify-tag-mint text-[12px]">Escrow Secured</span>
            </div>

            <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2 text-[13px]">
              <div className="flex justify-between py-1 border-b border-[#e4e4e7]">
                <span>أجرة النقل الأساسية:</span>
                <span className="font-mono font-[600]">{(shipment.price * 0.85).toLocaleString()} SDG</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#e4e4e7]">
                <span>رسوم التأمين الشامل والمراقبة اللحظية:</span>
                <span className="font-mono font-[600]">{(shipment.price * 0.10).toLocaleString()} SDG</span>
              </div>
              <div className="flex justify-between py-1">
                <span>رسوم التخليص والخدمات اللوجستية:</span>
                <span className="font-mono font-[600]">{(shipment.price * 0.05).toLocaleString()} SDG</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <h3 className="font-[600] text-[16px] text-[#000000] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#000000]" />
              <span>سجل ومراحل حركة الشحنة الكامل (Telemetry Timeline)</span>
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
        )}

        {/* TAB 9: INCIDENTS */}
        {activeTab === 'incidents' && (
          <div className="space-y-4">
            {relatedIncidents.length > 0 ? (
              <div className="space-y-3">
                {relatedIncidents.map((inc) => (
                  <div key={inc.id} className="p-4 rounded-[12px] bg-[#fef3c7] border border-[#fde68a] text-[13px]">
                    <div className="flex items-center gap-2 font-[600] text-[#92400e]">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{inc.titleAr}</span>
                    </div>
                    <p className="text-[#92400e]/80 mt-1">{inc.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#14A44D] mx-auto" />
                <div className="font-[600] text-[15px] text-[#000000]">لا توجد حوادث أو بلاغات مسجلة</div>
                <div className="text-[12px] text-[#71717a]">الشحنة تسير بانتظام تام وفق معايير السلامة والأمان السيادي.</div>
              </div>
            )}
          </div>
        )}

        {/* TAB 10: AUDIT LOG */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="font-[600] text-[16px] text-[#000000] flex items-center gap-2">
              <History className="w-4 h-4 text-[#000000]" />
              <span>سجل التدقيق والحركات غير القابل للتعديل (Immutable Audit Log)</span>
            </h3>

            <div className="p-4 rounded-[12px] bg-[#0a0a0a] text-white font-mono text-[12px] space-y-2">
              <div className="text-[#14A44D]">[{shipment.pickupDate} 08:30:14] SYSTEM_INGEST: Shipment created and verified by Customer Portal (User: {shipment.customerId})</div>
              <div className="text-[#c1fbd4]">[{shipment.pickupDate} 09:15:22] DISPATCH_MATCH: Auto-assigned Carrier ({shipment.carrierName}) via Backhaul Engine</div>
              <div className="text-[#a1a1aa]">[{shipment.pickupDate} 10:00:05] TELEMETRY_INIT: GPS beacon online with tracking ID {shipment.trackingNumber}</div>
              <div className="text-[#c1fbd4]">[{shipment.pickupDate} 14:20:10] GEOFENCE_PASS: Passed Checkpoint 1 (Port Sudan Corridor) within SLA window</div>
            </div>
          </div>
        )}
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
