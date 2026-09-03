'use client';

import React, { useState, useEffect } from 'react';
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
  Clock,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Check,
  FileText,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Coffee,
  PhoneCall,
} from 'lucide-react';
import { SignaturePad } from '@/components/common/SignaturePad';
import {
  getOfflineQueue,
  queueOfflineEvent,
  syncOfflineQueueToServer,
  QueuedTelemetryEvent,
} from '@/lib/driver-offline-sync';
import confetti from 'canvas-confetti';

type DriverTab = 'active_mission' | 'available_trips' | 'trip_history' | 'earnings_wallet';
type ShiftStatus = 'online' | 'on_duty' | 'break' | 'offline';
type MissionStep = 'pickup_en_route' | 'arrived_pickup' | 'cargo_sealed' | 'transit_corridor' | 'arrived_dest' | 'delivered';

export function DriverAppView() {
  const { drivers, shipments, updateShipmentStatus, showToast, lang, t } = useApp();
  const driver = drivers[0];

  // Active Shipment
  const activeShipment = shipments.find((s) => s.status === 'in_transit' || s.status === 'carrier_assigned') || shipments[0];

  // Navigation & Shift states
  const [activeTab, setActiveTab] = useState<DriverTab>('active_mission');
  const [shiftStatus, setShiftStatus] = useState<ShiftStatus>('on_duty');
  const [isSafetyModeActive, setIsSafetyModeActive] = useState(false);
  const [missionStep, setMissionStep] = useState<MissionStep>('transit_corridor');

  // Cargo & Seal states
  const [sealNumber, setSealNumber] = useState('SDN-SEAL-88492');
  const [isSealVerified, setIsSealVerified] = useState(true);
  const [uploadedPhotosCount, setUploadedPhotosCount] = useState(2);

  // Checkpoints log
  const [checkpointsLog, setCheckpointsLog] = useState<Array<{ name: string; time: string; coords: string }>>([
    { name: 'بوابة المصفاة - الجيلي', time: '08:30 ص', coords: '16.02° N, 32.55° E' },
    { name: 'محطة ميزان شندي', time: '11:15 ص', coords: '16.69° N, 33.43° E' },
  ]);

  // Offline Sync
  const [isOffline, setIsOffline] = useState(false);
  const [queuedEvents, setQueuedEvents] = useState<QueuedTelemetryEvent[]>(() => getOfflineQueue());
  const [isSyncing, setIsSyncing] = useState(false);

  // Consignee POD Modal
  const [isPodModalOpen, setIsPodModalOpen] = useState(false);
  const [consigneeName, setConsigneeName] = useState('سامي حامد عثمان');
  const [consigneePhone, setConsigneePhone] = useState('+249 912 345 678');
  const [consigneeOtp, setConsigneeOtp] = useState('4829');
  const [capturedSignature, setCapturedSignature] = useState<string | null>(null);

  // Wallet and Earnings
  const [walletBalance, setWalletBalance] = useState(1450000);
  const [todayTripsCount, setTodayTripsCount] = useState(2);

  useEffect(() => {
    const handleStorage = () => {
      setQueuedEvents(getOfflineQueue());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleOfflineMode = async () => {
    if (!isOffline) {
      setIsOffline(true);
      const ev = queueOfflineEvent({
        type: 'gps_ping',
        timestamp: new Date().toLocaleTimeString(),
        payload: { lat: 17.58, lng: 34.12, speedKm: 78, fuelLevel: '82%' },
      });
      setQueuedEvents(getOfflineQueue());
      showToast(
        lang === 'ar' ? 'وضع عدم الاتصال نشط (Offline)' : 'Offline Mode Active',
        lang === 'ar'
          ? 'تم تفعيل التخزين المحلي للإحداثيات والأختام لضمان عدم توقف الرحلة في الطرق الصحراوية.'
          : 'Local SQLite/IndexDB caching activated for desert corridors.',
        'warning'
      );
    } else {
      setIsSyncing(true);
      const res = await syncOfflineQueueToServer();
      setIsOffline(false);
      setIsSyncing(false);
      setQueuedEvents([]);
      showToast(
        lang === 'ar' ? 'تمت مزامنة البيانات بالكامل' : 'All Events Synced',
        lang === 'ar'
          ? `تم رفع ${res.count} حدثاً وسجلاً محلياً إلى مركز العمليات وبرج المراقبة بنجاح!`
          : `Successfully pushed ${res.count} offline events to Control Tower!`,
        'success'
      );
    }
  };

  const handleLogCheckpoint = () => {
    const newCheckpoint = {
      name: `نقطة تفتيش عطبرة - الكيلو ${Math.floor(250 + Math.random() * 50)}`,
      time: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SD' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      coords: `17.${Math.floor(60 + Math.random() * 20)}° N, 34.${Math.floor(10 + Math.random() * 30)}° E`,
    };
    setCheckpointsLog((prev) => [newCheckpoint, ...prev]);

    if (isOffline) {
      queueOfflineEvent({
        type: 'checkpoint',
        timestamp: new Date().toISOString(),
        payload: newCheckpoint,
      });
      setQueuedEvents(getOfflineQueue());
    }

    showToast(
      lang === 'ar' ? 'تم توثيق نقطة التفتيش' : 'Checkpoint Recorded',
      lang === 'ar'
        ? `تم تسجيل عبور ${newCheckpoint.name} بنجاح وإرسال الإحداثيات لغرفة العمليات.`
        : `Verified transit through ${newCheckpoint.name}.`,
      'info'
    );
  };

  const handleSaveSignature = (dataUrl: string) => {
    setCapturedSignature(dataUrl);
    updateShipmentStatus(activeShipment.id, 'delivered');
    setMissionStep('delivered');
    setIsPodModalOpen(false);

    // Credit driver earnings to wallet
    const missionPayout = 350000;
    setWalletBalance((prev) => prev + missionPayout);
    setTodayTripsCount((prev) => prev + 1);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#032C70', '#0849A8', '#D7A11E', '#14A44D'],
      });
    } catch (e) {
      console.log('Confetti trigger', e);
    }

    showToast(
      lang === 'ar' ? '🎉 تم إثبات التسليم وإيداع الأجرة' : '🎉 Delivery Verified & Payout Released',
      lang === 'ar'
        ? `تم اعتماد توقيع المستلم ${consigneeName} للشحنة ${activeShipment.trackingNumber}. أودعنا ${missionPayout.toLocaleString()} SDG في محفظتك!`
        : `POD confirmed for ${activeShipment.trackingNumber}. Deposited ${missionPayout.toLocaleString()} SDG into driver wallet!`,
      'success'
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-[#000000] shopify-theme pb-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Driver Command Header */}
      <div className="p-6 sm:p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm border border-[#e4e4e7]">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="shopify-tag-mint text-[11px] font-mono">
              Driver Operations OS • 2026 Fleet Edition
            </span>
            
            {/* Offline Button */}
            <button
              onClick={toggleOfflineMode}
              disabled={isSyncing}
              className={`px-3 py-1 rounded-full text-[11px] font-[600] flex items-center gap-1.5 transition-all cursor-pointer ${
                isOffline
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-[#c1fbd4] text-[#000000] hover:bg-[#a8f5c3]'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5 text-[#fbbf24]" /> : <Wifi className="w-3.5 h-3.5 text-[#059669]" />}
              <span>
                {isSyncing
                  ? (lang === 'ar' ? 'جارٍ المزامنة...' : 'Syncing...')
                  : isOffline
                  ? (lang === 'ar' ? `وضع الصحراء دون اتصال (${queuedEvents.length} معلقة)` : `Desert Offline (${queuedEvents.length} queued)`)
                  : (lang === 'ar' ? 'متصل بالبرج (Live 4G/Satellite)' : 'Connected Live')}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-[24px] font-[700] text-[#000000]">{driver.name}</h1>
            <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-[#f4f4f5] text-[#52525b] font-mono font-[600]">
              ID: {driver.id.toUpperCase()}
            </span>
          </div>

          <p className="text-[13.5px] text-[#71717a]">
            {lang === 'ar' ? 'المركبة المسندة: ' : 'Assigned Truck: '}
            <strong className="text-[#000000] font-[700] font-mono">{driver.currentVehiclePlate || 'KRT-2024-TRK'}</strong>
            {' • '}
            {lang === 'ar' ? 'تقييم الأمان: ' : 'Safety Score: '}
            <span className="text-[#15803d] font-[700] font-mono">98.4% (Elite Pilot)</span>
          </p>
        </div>

        {/* Right Side: Shift Status Selector & Safety Mode */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Shift State Chips */}
          <div className="inline-flex rounded-[8px] bg-[#f4f4f5] p-1 border border-[#e4e4e7]">
            {(['on_duty', 'break', 'offline'] as ShiftStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => {
                  setShiftStatus(st);
                  showToast(
                    lang === 'ar' ? 'تم تحديث وردية السائق' : 'Shift Status Updated',
                    st === 'on_duty'
                      ? (lang === 'ar' ? 'أنت الآن في وردية نشطة ومستعد لمهام الشحن.' : 'Active on duty.')
                      : st === 'break'
                      ? (lang === 'ar' ? 'تم توثيق استراحة السائق في سجل الساعات.' : 'Break logged.')
                      : (lang === 'ar' ? 'تم تسجيل الخروج من الوردية.' : 'Logged off duty.'),
                    'info'
                  );
                }}
                className={`px-3 py-1 rounded-[6px] text-[12px] font-[600] transition-all cursor-pointer ${
                  shiftStatus === st
                    ? 'bg-[#ffffff] text-[#000000] shadow-xs'
                    : 'text-[#71717a] hover:text-[#000000]'
                }`}
              >
                {st === 'on_duty'
                  ? (lang === 'ar' ? 'في مهمة' : 'On Duty')
                  : st === 'break'
                  ? (lang === 'ar' ? 'استراحة' : 'Rest Break')
                  : (lang === 'ar' ? 'خارج الخدمة' : 'Off Duty')}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setIsSafetyModeActive((prev) => !prev);
              showToast(
                isSafetyModeActive ? 'تم إلغاء وضع القيادة' : 'وضع القيادة الآمنة نشط',
                isSafetyModeActive ? 'تم الرجوع للواجهة الكاملة' : 'واجهة مبسطة بأزرار لمس كبيرة لمنع التشتت أثناء القيادة على الطرق السريعة',
                'info'
              );
            }}
            className={`px-4 py-2 rounded-[8px] text-[13px] font-[600] flex items-center gap-2 transition-all cursor-pointer ${
              isSafetyModeActive
                ? 'bg-[#000000] text-white'
                : 'bg-white border border-[#e4e4e7] text-[#000000] hover:bg-[#f4f4f5]'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>{isSafetyModeActive ? (lang === 'ar' ? 'الوضع الآمن (نشط)' : 'Safety Mode (Active)') : (lang === 'ar' ? 'وضع القيادة' : 'Safety Mode')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills Tab Bar */}
      <div className="flex items-center gap-2 border-b border-[#e4e4e7] pb-3 overflow-x-auto">
        {[
          { id: 'active_mission', labelAr: 'الرحلة النشطة (Run Sheet)', labelEn: 'Active Run Sheet', icon: Truck },
          { id: 'available_trips', labelAr: 'عروض الشحن المتاحة', labelEn: 'Available Loads', icon: MapPin },
          { id: 'earnings_wallet', labelAr: 'الأرباح والمحفظة', labelEn: 'Earnings & Wallet', icon: DollarSign },
          { id: 'trip_history', labelAr: 'سجل الرحلات', labelEn: 'Trip History', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DriverTab)}
              className={`px-4 py-2.5 rounded-[8px] text-[13.5px] font-[600] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#000000] text-white shadow-xs'
                  : 'text-[#71717a] hover:text-[#000000] hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ACTIVE MISSION RUN SHEET */}
      {activeTab === 'active_mission' && (
        <div className="space-y-6">
          {/* Active Freight Card */}
          <div className="shopify-card p-6 sm:p-8 space-y-6 bg-[#ffffff] border border-[#e4e4e7]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e4e7]">
              <div>
                <div className="text-[12px] text-[#71717a] font-[600] uppercase tracking-wider">
                  {lang === 'ar' ? 'الشحنة المكلف بنقلها الآن' : 'Current Active Assignment'}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-[24px] font-mono font-[800] text-[#000000]">{activeShipment.trackingNumber}</h2>
                  <span className="px-2.5 py-1 rounded-[6px] bg-[#dcfce7] text-[#166534] font-mono text-[12px] font-[700]">
                    {activeShipment.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[13px] text-[#71717a]">
                  {lang === 'ar' ? 'أجرة الرحلة المستحقة: ' : 'Guaranteed Payout: '}
                  <strong className="text-[#000000] font-[800] font-mono text-[16px]">350,000 SDG</strong>
                </span>
              </div>
            </div>

            {/* Step-by-Step Waypoint Progress Bar */}
            <div className="p-4 rounded-[10px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-3">
              <div className="text-[12px] font-[700] text-[#52525b] uppercase tracking-wider">
                {lang === 'ar' ? 'مراحل رحلة الشاحنة الميدانية' : 'Mission Waypoint Progression'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[12px]">
                {[
                  { step: 'arrived_pickup', label: 'وصول للتحميل' },
                  { step: 'cargo_sealed', label: 'فحص الأختام' },
                  { step: 'transit_corridor', label: 'في الطريق' },
                  { step: 'arrived_dest', label: 'وصول للوجهة' },
                  { step: 'delivered', label: 'تسليم وتوقيع POD' },
                ].map((s, idx) => {
                  const isCurrent = missionStep === s.step;
                  const isPast = ['arrived_pickup', 'cargo_sealed', 'transit_corridor', 'arrived_dest', 'delivered'].indexOf(missionStep) >= idx;
                  return (
                    <button
                      key={s.step}
                      onClick={() => setMissionStep(s.step as MissionStep)}
                      className={`p-2.5 rounded-[8px] font-[600] transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#000000] text-white shadow-xs'
                          : isPast
                          ? 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]'
                          : 'bg-white text-[#a1a1aa] border border-[#e4e4e7]'
                      }`}
                    >
                      <div className="text-[10px] opacity-70">المرحلة {idx + 1}</div>
                      <div className="truncate mt-0.5">{s.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Route Details Card */}
            <div className="p-6 rounded-[12px] bg-[#f0fdf4] border border-[#bbf7d0] grid grid-cols-1 sm:grid-cols-2 gap-6 text-[13.5px]">
              <div className="space-y-1.5">
                <span className="text-[11px] text-[#166534] font-[700] uppercase tracking-wider block">
                  {lang === 'ar' ? 'نقطة التحميل والاستلام (Origin)' : 'Origin & Shipper'}
                </span>
                <div className="font-[800] text-[17px] text-[#000000]">{activeShipment.origin.city}</div>
                <div className="text-[12.5px] text-[#374151]">{activeShipment.origin.address}</div>
                <div className="text-[12px] text-[#166534] font-[600] flex items-center gap-1.5 pt-1">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{activeShipment.origin.contactName || 'مستودع الصادرات الشمالي (+249 912 110 011)'}</span>
                </div>
              </div>

              <div className="space-y-1.5 sm:text-end">
                <span className="text-[11px] text-[#166534] font-[700] uppercase tracking-wider block">
                  {lang === 'ar' ? 'نقطة التفريغ والتسليم (Destination)' : 'Destination & Consignee'}
                </span>
                <div className="font-[800] text-[17px] text-[#000000]">{activeShipment.destination.city}</div>
                <div className="text-[12.5px] text-[#374151]">{activeShipment.destination.address}</div>
                <div className="text-[12px] text-[#166534] font-[600] flex items-center gap-1.5 pt-1 sm:justify-end">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{consigneeName} ({consigneePhone})</span>
                </div>
              </div>
            </div>

            {/* Cargo & Security Seal Verification Box */}
            <div className="p-5 rounded-[12px] bg-white border border-[#e4e4e7] grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] text-[#71717a] font-[600] block">{lang === 'ar' ? 'نوع الحمولة والوزن' : 'Cargo & Weight'}</span>
                <div className="font-[700] text-[14px] text-[#000000] mt-0.5">{activeShipment.cargoDescription || 'صمغ عربي ومحاصيل زراعية'}</div>
                <div className="text-[12px] text-[#71717a] font-mono">{activeShipment.totalWeightKg.toLocaleString()} كجم • 38 م³</div>
              </div>

              <div>
                <span className="text-[11px] text-[#71717a] font-[600] block">{lang === 'ar' ? 'رقم الختم الأمني والجمركي' : 'Customs Security Seal'}</span>
                <div className="font-[700] text-[14px] font-mono text-[#000000] mt-0.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#059669]" />
                  <span>{sealNumber}</span>
                </div>
                <div className="text-[12px] text-[#059669] font-[600]">ختم مؤمن وسليم 100%</div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setUploadedPhotosCount((prev) => prev + 1);
                    showToast(
                      lang === 'ar' ? 'تم التقاط صورة الحمولة' : 'Cargo Photo Captured',
                      lang === 'ar' ? 'تم حفظ صورة الختم والحمولة في السجل الرقمي للشحنة.' : 'Photo attached to shipment audit trail.',
                      'success'
                    );
                  }}
                  className="px-3 py-2 rounded-[8px] border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[12px] font-[600] flex items-center gap-1.5 cursor-pointer text-[#000000]"
                >
                  <Camera className="w-4 h-4 text-[#52525b]" />
                  <span>{lang === 'ar' ? `تصوير الحمولة (${uploadedPhotosCount})` : `Photos (${uploadedPhotosCount})`}</span>
                </button>
              </div>
            </div>

            {/* Checkpoints & GPS Telemetry Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-[700] text-[#000000] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0849A8]" />
                  <span>{lang === 'ar' ? 'سجل نقاط التفتيش والعبور الجغرافي' : 'Checkpoint Transit Audit'}</span>
                </h3>
                <button
                  onClick={handleLogCheckpoint}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-[#e4e4e7] hover:bg-[#f4f4f5] text-[12px] font-[600] text-[#000000] flex items-center gap-1.5 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#059669]" />
                  <span>{lang === 'ar' ? '+ توثيق نقطة تفتيش فورية' : '+ Record Checkpoint'}</span>
                </button>
              </div>

              <div className="divide-y divide-[#f4f4f5] border border-[#e4e4e7] rounded-[10px] overflow-hidden bg-white">
                {checkpointsLog.map((cp, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-[13px] hover:bg-[#fafafa]">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#059669]"></div>
                      <span className="font-[600] text-[#000000]">{cp.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#71717a] font-mono text-[12px]">
                      <span>{cp.coords}</span>
                      <span className="font-[600] text-[#000000]">{cp.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar: Driver Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e4e4e7]">
              <button
                onClick={handleLogCheckpoint}
                className="px-4 py-3 rounded-[10px] border border-[#e4e4e7] bg-white hover:bg-[#f4f4f5] text-[13.5px] font-[600] text-[#000000] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MapPin className="w-4 h-4 text-[#059669]" />
                <span>{lang === 'ar' ? 'توثيق نقطة عبور' : 'Log Waypoint'}</span>
              </button>

              <button
                onClick={() => setIsPodModalOpen(true)}
                className="px-4 py-3 rounded-[10px] bg-[#000000] hover:bg-[#27272a] text-[13.5px] font-[700] text-white flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <PenTool className="w-4 h-4 text-[#c1fbd4]" />
                <span>{lang === 'ar' ? 'توقيع إثبات التسليم (POD)' : 'Consignee Sign POD'}</span>
              </button>

              <button
                onClick={() =>
                  showToast(
                    lang === 'ar' ? 'نداء استغاثة طارئ (SOS)' : 'Emergency SOS Signal Sent',
                    lang === 'ar'
                      ? 'تم إرسال إحداثيات موقع الشاحنة لغرفة الطوارئ والتدخل السريع على الطريق القومي.'
                      : 'SOS coordinates broadcast to Sudaneel Rapid Rescue Patrol.',
                    'error'
                  )
                }
                className="px-4 py-3 rounded-[10px] border border-[#ef4444] bg-[#fef2f2] hover:bg-[#fee2e2] text-[13.5px] font-[700] text-[#b91c1c] flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-[#dc2626]" />
                <span>{lang === 'ar' ? 'طوارئ واستغاثة (SOS)' : 'Highway Emergency SOS'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AVAILABLE LOADS & MISSIONS */}
      {activeTab === 'available_trips' && (
        <div className="space-y-4">
          <div className="p-6 shopify-card bg-white border border-[#e4e4e7] flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-[700] text-[#000000]">
                {lang === 'ar' ? 'حمولات شحن فورية بانتظار سائق' : 'Available Freight Loads'}
              </h2>
              <p className="text-[13px] text-[#71717a]">
                {lang === 'ar' ? 'حمولات مؤمنة بأسعار معتمدة ومطابقة لشاحنتك.' : 'Pre-approved commercial loads matching your vehicle spec.'}
              </p>
            </div>
            <span className="shopify-tag-mint">3 مهام جديدة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'load-krt-psn-01',
                origin: 'الخرطوم بحري',
                destination: 'ميناء بورتسودان (SCT)',
                cargo: 'حاوية 40 قدم - صادرات صمغ عربي',
                weight: '28,000 كجم',
                distance: '830 كم',
                payout: '420,000 SDG',
                type: 'شاحنة ثقيلة تريلا',
              },
              {
                id: 'load-psn-ksl-02',
                origin: 'بورتسودان',
                destination: 'كسلا - المستودع الإقليمي',
                cargo: 'أدوية ومستلزمات طبية مبردة',
                weight: '14,000 كجم',
                distance: '495 كم',
                payout: '310,000 SDG',
                type: 'ثلاجة تبريد نشط',
              },
              {
                id: 'load-atb-qdr-03',
                origin: 'عطبرة - مجمع الأسمنت',
                destination: 'القضارف - سوق المحاصيل',
                cargo: 'مواد بناء وتعبئة صناعية',
                weight: '32,000 كجم',
                distance: '410 كم',
                payout: '280,000 SDG',
                type: 'سطحة ثقيلة',
              },
            ].map((offer) => (
              <div key={offer.id} className="p-6 shopify-card bg-white border border-[#e4e4e7] space-y-4 hover:border-[#000000] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#f4f4f5] text-[#52525b] font-[600]">
                    {offer.id}
                  </span>
                  <span className="text-[16px] font-mono font-[800] text-[#059669]">{offer.payout}</span>
                </div>

                <div className="space-y-1">
                  <div className="text-[15px] font-[700] text-[#000000] flex items-center gap-2">
                    <span>{offer.origin}</span>
                    <span className="text-[#71717a]">←</span>
                    <span>{offer.destination}</span>
                  </div>
                  <div className="text-[12.5px] text-[#52525b]">{offer.cargo}</div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#f4f4f5] text-[12px] text-[#71717a]">
                  <span>{offer.weight} • {offer.distance}</span>
                  <button
                    onClick={() => {
                      setActiveTab('active_mission');
                      setMissionStep('arrived_pickup');
                      showToast(
                        lang === 'ar' ? 'تم قبول المهمة بنجاح' : 'Mission Accepted',
                        lang === 'ar' ? `تم إسناد الرحلة ${offer.id} إليك. توجه لنقطة التحميل في ${offer.origin}.` : `Assigned load ${offer.id}. Proceed to pickup.`,
                        'success'
                      );
                    }}
                    className="px-3.5 py-1.5 rounded-[6px] bg-[#000000] text-white font-[600] text-[12px] hover:bg-[#27272a] cursor-pointer"
                  >
                    {lang === 'ar' ? 'قبول وبدء الرحلة' : 'Accept & Start'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EARNINGS & WALLET */}
      {activeTab === 'earnings_wallet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 shopify-card bg-white border border-[#e4e4e7] space-y-2">
              <span className="text-[12px] text-[#71717a] font-[600] block">{lang === 'ar' ? 'الرصيد المتاح للسحب' : 'Available Balance'}</span>
              <div className="text-[28px] font-mono font-[800] text-[#000000]">{walletBalance.toLocaleString()} SDG</div>
              <div className="text-[12px] text-[#059669] font-[600] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'جاهز للتحويل الفوري إلى بنكك / فوري' : 'Instant Payout Ready'}</span>
              </div>
            </div>

            <div className="p-6 shopify-card bg-white border border-[#e4e4e7] space-y-2">
              <span className="text-[12px] text-[#71717a] font-[600] block">{lang === 'ar' ? 'أرباح اليوم' : "Today's Earnings"}</span>
              <div className="text-[28px] font-mono font-[800] text-[#059669]">700,000 SDG</div>
              <div className="text-[12px] text-[#71717a]">{todayTripsCount} رحلات مكتملة</div>
            </div>

            <div className="p-6 shopify-card bg-white border border-[#e4e4e7] space-y-2">
              <span className="text-[12px] text-[#71717a] font-[600] block">{lang === 'ar' ? 'مكافأة القيادة الآمنة' : 'Safety Bonus'}</span>
              <div className="text-[28px] font-mono font-[800] text-[#d97706]">+85,000 SDG</div>
              <div className="text-[12px] text-[#71717a]">{lang === 'ar' ? 'صفر مخالفات سرعة هذا الشهر' : 'Zero speed violations'}</div>
            </div>
          </div>

          <div className="p-6 shopify-card bg-white border border-[#e4e4e7] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-[700] text-[#000000]">{lang === 'ar' ? 'سجل التسويات والتحويلات الأخيرة' : 'Recent Payout History'}</h3>
              <button
                onClick={() =>
                  showToast(
                    lang === 'ar' ? 'تم طلب التحويل الفوري' : 'Payout Requested',
                    lang === 'ar' ? 'تم إرسال طلب سحب الرصيد إلى حساب تطبيق بنكك رقم **4892' : 'Bankak transfer initiated.',
                    'success'
                  )
                }
                className="btn-shopify-pill !py-2 text-[12.5px]"
              >
                {lang === 'ar' ? 'طلب سحب الرصيد لبنكك' : 'Withdraw to Bankak'}
              </button>
            </div>

            <div className="divide-y divide-[#f4f4f5] text-[13px]">
              {[
                { ref: 'PAY-489201', desc: 'أجرة رحلة الخرطوم - بورتسودان (SHP-8842)', amount: '+350,000 SDG', date: 'اليوم، 12:40 م', status: 'مكتمل' },
                { ref: 'PAY-489110', desc: 'أجرة رحلة عطبرة - شندي (SHP-8820)', amount: '+220,000 SDG', date: 'أمس، 06:15 م', status: 'مكتمل' },
                { ref: 'WTH-102941', desc: 'تحويل بنكي صادر إلى تطبيق بنكك (BOK)', amount: '-500,000 SDG', date: '30 أغسطس 2026', status: 'منفذ' },
              ].map((tx, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-[600] text-[#000000]">{tx.desc}</div>
                    <div className="text-[11.5px] text-[#71717a] font-mono">{tx.ref} • {tx.date}</div>
                  </div>
                  <div className="text-end">
                    <div className={`font-mono font-[700] ${tx.amount.startsWith('+') ? 'text-[#059669]' : 'text-[#000000]'}`}>
                      {tx.amount}
                    </div>
                    <span className="text-[11px] text-[#71717a]">{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRIP HISTORY */}
      {activeTab === 'trip_history' && (
        <div className="shopify-card p-6 bg-white border border-[#e4e4e7] space-y-4">
          <h2 className="text-[18px] font-[700] text-[#000000]">{lang === 'ar' ? 'سجل المهام والرحلات المنجزة' : 'Driver Completed Runs'}</h2>
          <div className="divide-y divide-[#f4f4f5]">
            {[
              { id: 'TRP-10492', route: 'الخرطوم ← بورتسودان', cargo: 'صمغ عربي ومحاصيل', date: '28 أغسطس 2026', duration: '14 ساعة', rating: '5.0 ★' },
              { id: 'TRP-10481', route: 'بورتسودان ← كسلا', cargo: 'حاوية أدوية مجمركة', date: '24 أغسطس 2026', duration: '8 ساعات', rating: '4.9 ★' },
              { id: 'TRP-10475', route: 'كوستي ← الخرطوم', cargo: 'سكر ومواد تموينية', date: '19 أغسطس 2026', duration: '6 ساعات', rating: '5.0 ★' },
            ].map((hist, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between text-[13px]">
                <div className="space-y-0.5">
                  <div className="font-[700] text-[#000000]">{hist.route}</div>
                  <div className="text-[12px] text-[#71717a]">{hist.cargo} • {hist.date}</div>
                </div>
                <div className="text-end font-mono">
                  <div className="text-[12px] text-[#059669] font-[700]">{hist.rating}</div>
                  <div className="text-[11px] text-[#71717a]">{hist.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Consignee POD Signature Modal */}
      {isPodModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] p-6 space-y-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
              <div>
                <h3 className="font-[700] text-[18px] text-[#000000]">
                  {lang === 'ar' ? 'توقيع إثبات التسليم الحي (Digital POD)' : 'Consignee Digital POD'}
                </h3>
                <p className="text-[12px] text-[#71717a]">
                  {lang === 'ar' ? `الشحنة رقم: ${activeShipment.trackingNumber}` : `Shipment: ${activeShipment.trackingNumber}`}
                </p>
              </div>
              <button
                onClick={() => setIsPodModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#f4f4f5] text-[#71717a] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Consignee Info Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <label className="text-[11px] font-[600] text-[#71717a] block mb-1">
                  {lang === 'ar' ? 'اسم المستلم المعتمد' : 'Consignee Name'}
                </label>
                <input
                  type="text"
                  value={consigneeName}
                  onChange={(e) => setConsigneeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#e4e4e7] text-[#000000] text-[13px] outline-none focus:border-[#000000]"
                />
              </div>

              <div>
                <label className="text-[11px] font-[600] text-[#71717a] block mb-1">
                  {lang === 'ar' ? 'رقم الهاتف / التحقق' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={consigneePhone}
                  onChange={(e) => setConsigneePhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#e4e4e7] text-[#000000] text-[13px] outline-none focus:border-[#000000]"
                />
              </div>
            </div>

            {/* Signature Area */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-[600] text-[#71717a] block">
                {lang === 'ar' ? 'توقيع المستلم باليد أو القلم الإلكتروني' : 'Recipient Live Signature'}
              </label>
              <div className="border border-[#e4e4e7] rounded-[12px] overflow-hidden bg-white">
                <SignaturePad onSave={handleSaveSignature} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
