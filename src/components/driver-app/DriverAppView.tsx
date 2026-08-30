'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Navigation,
  ShieldAlert,
  CheckCircle2,
  Camera,
  Wifi,
  WifiOff,
  PenTool,
  X,
  Sparkles,
  MapPin,
  Truck,
} from 'lucide-react';
import { SignaturePad } from '@/components/common/SignaturePad';

export function DriverAppView() {
  const { drivers, shipments, updateShipmentStatus, showToast, lang } = useApp();
  const driver = drivers[0];
  const activeShipment = shipments.find((s) => s.status === 'in_transit' || s.status === 'carrier_assigned') || shipments[0];

  const [isSafetyModeActive, setIsSafetyModeActive] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [capturedSignature, setCapturedSignature] = useState<string | null>(null);

  const toggleOffline = () => {
    setIsOffline((prev) => !prev);
    if (!isOffline) {
      setOfflineQueueCount(4);
      showToast(
        lang === 'ar' ? 'وضع عدم الاتصال نشط' : 'Offline Mode Active',
        lang === 'ar' ? 'يتم تخزين حركات GPS والتواقيع محلياً وستتم مزامنتها تلقائياً عند عودة الشبكة.' : 'Telemetry is queued locally and will auto-sync on reconnect.',
        'warning'
      );
    } else {
      setTimeout(() => {
        setOfflineQueueCount(0);
        showToast(
          lang === 'ar' ? 'تمت مزامنة البيانات' : 'Data Synced',
          lang === 'ar' ? 'تم رفع كافة الإحداثيات والحركات المخزنة محلياً لبرج المراقبة بنجاح.' : 'Offline queue synced with Control Tower.',
          'success'
        );
      }, 1000);
    }
  };

  const handleSaveSignature = (dataUrl: string) => {
    setCapturedSignature(dataUrl);
    updateShipmentStatus(activeShipment.id, 'delivered');
    setIsPodModalOpen(false);
    showToast(
      lang === 'ar' ? 'تم إثبات التسليم الرقمي (POD)' : 'POD Confirmed',
      lang === 'ar'
        ? `تم اعتماد توقيع المستلم للشحنة ${activeShipment.trackingNumber} بنجاح وتحويل الحالة إلى (مكتملة/تم التسليم)`
        : `Consignee signature confirmed for ${activeShipment.trackingNumber}. Status set to Delivered.`,
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-[#000000] shopify-theme" dir="rtl">
      {/* Top Driver Header Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="shopify-tag-mint">
              Driver Active Run Sheet
            </span>
            <button
              onClick={toggleOffline}
              className={`px-3 py-1 rounded-full text-[11px] font-[600] flex items-center gap-1.5 transition-colors ${
                isOffline ? 'bg-[#000000] text-white' : 'bg-[#c1fbd4] text-[#000000]'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOffline ? `وضع عدم الاتصال (${offlineQueueCount} معلقة)` : 'متصل بالبرج (Live)'}</span>
            </button>
          </div>

          <h1 className="text-[24px] font-[600] text-[#000000]">{driver.name}</h1>
          <p className="text-[13.5px] text-[#71717a]">
            المركبة: <strong className="text-[#000000] font-[600] font-mono">{driver.currentVehiclePlate || 'KRT-2024-TRK'}</strong> • الشحنات المكتملة: {driver.totalTrips} رحلة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsSafetyModeActive((prev) => !prev);
              showToast(
                isSafetyModeActive ? 'تم إيقاف وضع الأمان' : 'وضع الأمان والسرعة نشط',
                isSafetyModeActive ? 'تم الرجوع للوضع القياسي' : 'واجهة مبسطة بأزرار لمس كبيرة لتجنب التشتت أثناء القيادة',
                'info'
              );
            }}
            className={isSafetyModeActive ? 'btn-shopify-pill' : 'btn-shopify-outline'}
          >
            <Navigation className="w-4 h-4" />
            <span>{isSafetyModeActive ? 'وضع القيادة الآمنة (نشط)' : 'تفعيل وضع القيادة'}</span>
          </button>
        </div>
      </div>

      {/* Active Freight Card */}
      <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
        <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
          <div>
            <div className="text-[12px] text-[#71717a] font-[500]">الشحنة المكلف بها حالياً</div>
            <h2 className="text-[22px] font-mono font-[700] text-[#000000] mt-0.5">{activeShipment.trackingNumber}</h2>
          </div>
          <span className="shopify-tag-mint">{activeShipment.status}</span>
        </div>

        {/* Route Details */}
        <div className="p-6 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13.5px]">
          <div className="space-y-1">
            <span className="text-[11px] text-[#000000]/70 font-[600] block">نقطة الاستلام والتحميل (Origin)</span>
            <div className="font-[700] text-[15px] text-[#000000]">{activeShipment.origin.city}</div>
            <div className="text-[12px] text-[#000000]/80">{activeShipment.origin.address}</div>
          </div>
          <div className="space-y-1 sm:text-end">
            <span className="text-[11px] text-[#000000]/70 font-[600] block">نقطة التسليم والوجهة (Destination)</span>
            <div className="font-[700] text-[15px] text-[#000000]">{activeShipment.destination.city}</div>
            <div className="text-[12px] text-[#000000]/80">{activeShipment.destination.address}</div>
          </div>
        </div>

        {/* Driver Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <button
            onClick={() => showToast('نقطة تفتيش', 'تم توثيق عبور نقطة التفتيش بنجاح مع إرسال الطابع الزمني لغرفة العمليات', 'info')}
            className="btn-shopify-outline !py-3 text-[13px] flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>توثيق نقطة تفتيش</span>
          </button>

          <button
            onClick={() => setIsPodModalOpen(true)}
            className="btn-shopify-pill !py-3 text-[13px] flex items-center justify-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            <span>توقيع إثبات التسليم (POD)</span>
          </button>

          <button
            onClick={() => showToast('نداء طوارئ SOS', 'تم إرسال إشارة الاستغاثة والموقع الجغرافي الدقيق لغرفة الطوارئ والإنقاذ', 'error')}
            className="btn-shopify-outline !py-3 text-[13px] flex items-center justify-center gap-2 !border-[#000000] !text-[#000000]"
          >
            <ShieldAlert className="w-4 h-4 text-[#000000]" />
            <span>طوارئ الطريق (SOS)</span>
          </button>
        </div>
      </div>

      {/* Signature Modal */}
      {isPodModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] p-6 space-y-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
              <h3 className="font-[600] text-[16px] text-[#000000]">توقيع إثبات التسليم الحي (POD)</h3>
              <button onClick={() => setIsPodModalOpen(false)} className="p-1 rounded-full hover:bg-[#fbfbf5] text-[#71717a]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="border border-[#e4e4e7] rounded-[12px] overflow-hidden bg-white">
              <SignaturePad onSave={handleSaveSignature} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
