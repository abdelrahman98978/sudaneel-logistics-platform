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

  const handleSosBroadcast = () => {
    showToast(
      lang === 'ar' ? 'تم بث نداء الاستغاثة SOS' : 'Emergency SOS Broadcasted',
      lang === 'ar'
        ? `تم إرسال إحداثيات موقعك (${driver.currentLocation || 'طريق بورتسودان'}) لغرفة الطوارئ وإسناد فريق إنقاذ لوجستي`
        : 'Emergency alert dispatched to rescue team with live GPS location.',
      'error'
    );
  };

  return (
    <div className="max-w-md mx-auto space-y-4 font-sans text-[#171A20]">
      {/* POD Signature Modal */}
      {isPodModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#171A20]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#3E6AE1]" />
                <h3 className="font-[500] text-[14px] text-[#171A20]">إثبات التسليم الرقمي (Digital POD)</h3>
              </div>
              <button onClick={() => setIsPodModalOpen(false)} className="text-[#8E8E8E] hover:text-[#171A20]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-[12px] text-[#5C5E62]">
              الشحنة: <span className="font-mono font-[500] text-[#171A20]">{activeShipment.trackingNumber}</span>
              <br />
              المستلم: <span className="font-[500] text-[#171A20]">{activeShipment.customerNameAr || activeShipment.customerName}</span>
            </div>

            <SignaturePad onSave={handleSaveSignature} />
          </div>
        </div>
      )}

      {/* Device Frame Container */}
      <div className="rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] overflow-hidden flex flex-col min-h-[700px]">
        {/* Device Top Status Bar */}
        <div className="bg-[#F4F4F4] px-4 py-2 flex items-center justify-between text-[12px] border-b border-[#EEEEEE]">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#5C5E62]">
            <span>09:42</span>
            <span>• 5G</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Offline Toggle */}
            <button
              onClick={toggleOffline}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[10px] font-mono border ${
                isOffline
                  ? 'bg-[#FFFFFF] text-[#393C41] border-[#D0D1D2]'
                  : 'bg-[#FFFFFF] text-[#3E6AE1] border-[#3E6AE1]'
              }`}
            >
              {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              <span>{isOffline ? `Offline (${offlineQueueCount})` : 'Online'}</span>
            </button>

            {/* Safety Mode Toggle */}
            <button
              onClick={() => setIsSafetyModeActive(!isSafetyModeActive)}
              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-[500] border transition-colors cursor-pointer ${
                isSafetyModeActive
                  ? 'bg-[#171A20] text-white border-[#171A20]'
                  : 'bg-[#FFFFFF] text-[#171A20] border-[#D0D1D2]'
              }`}
            >
              {isSafetyModeActive ? 'Safety HUD ON' : 'Safety Mode'}
            </button>
          </div>
        </div>

        {/* Safety Mode Screen Overlay (High Contrast, Large Elements) */}
        {isSafetyModeActive ? (
          <div className="flex-1 p-6 bg-[#171A20] text-white flex flex-col justify-between text-center select-none animate-in fade-in">
            {/* Large Speed & Navigation */}
            <div className="space-y-2 pt-4">
              <div className="text-[#8E8E8E] text-[11px] font-mono tracking-widest uppercase">
                Khartoum ➔ Port Sudan Corridor
              </div>
              <div className="text-[72px] font-[500] font-mono text-white tracking-tight leading-none">
                68 <span className="text-[20px] text-[#3E6AE1] font-sans">km/h</span>
              </div>
              <div className="text-[12px] text-[#D0D1D2] flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" /> Speed limit compliant (80 km/h)
              </div>
            </div>

            {/* Next Turn Direction HUD */}
            <div className="p-5 rounded-[4px] bg-[#20242C] border border-[#2A2E35] space-y-2">
              <Navigation className="w-10 h-10 text-[#3E6AE1] mx-auto" />
              <div className="text-[16px] font-[500] text-white">In 14 km: Hayya Checkpoint</div>
              <div className="text-[12px] text-[#8E8E8E]">Maintain current lane, digital seal active</div>
            </div>

            {/* Large Predictive ETA */}
            <div className="p-4 rounded-[4px] bg-[#20242C] border border-[#2A2E35]">
              <div className="text-[11px] text-[#8E8E8E] uppercase font-mono">Predictive Arrival ETA</div>
              <div className="text-[24px] font-[500] font-mono text-[#3E6AE1]">16:45 Today</div>
            </div>

            {/* Emergency Button */}
            <button
              onClick={handleSosBroadcast}
              className="btn-tesla-primary w-full !bg-[#171A20] !border-[#3E6AE1] !text-white !min-h-[44px] text-[14px]"
            >
              <ShieldAlert className="w-5 h-5 mr-2" />
              <span>EMERGENCY SOS (طوارئ)</span>
            </button>
          </div>
        ) : (
          /* Standard Driver Job Workflow View */
          <div className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar bg-[#FFFFFF]">
            {/* Driver Profile Header */}
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between">
              <div>
                <div className="font-[500] text-[14px] text-[#171A20]">{driver.nameAr || driver.name}</div>
                <div className="text-[11px] text-[#3E6AE1] font-mono font-[500]">{driver.currentVehiclePlate}</div>
              </div>
              <div className="text-end">
                <div className="text-[14px] font-[500] font-mono text-[#171A20]">
                  {driver.walletBalance.toLocaleString()} SDG
                </div>
                <div className="text-[10px] text-[#8E8E8E]">Wallet Balance</div>
              </div>
            </div>

            {/* Current Active Trip Card */}
            <div className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
                <span className="text-[11px] font-[500] px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] font-mono">
                  Active Mission
                </span>
                <span className="font-mono text-[13px] font-[500] text-[#3E6AE1]">{activeShipment.trackingNumber}</span>
              </div>

              <div>
                <h4 className="font-[500] text-[#171A20] text-[15px]">
                  {activeShipment.origin.city} ➔ {activeShipment.destination.city}
                </h4>
                <p className="text-[13px] text-[#5C5E62] mt-0.5">{activeShipment.cargoDescription}</p>
              </div>

              {/* Trip Checklist Progression */}
              <div className="space-y-2 pt-2 text-[12px]">
                <div className="flex items-center gap-2 text-[#171A20] font-[500]">
                  <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" />
                  <span>1. Manifest & Loading Confirmed</span>
                </div>
                <div className="flex items-center gap-2 text-[#171A20] font-[500]">
                  <span className="w-4 h-4 rounded-full bg-[#F4F4F4] border border-[#3E6AE1] text-[#3E6AE1] flex items-center justify-center text-[10px] font-mono">
                    2
                  </span>
                  <span>2. En Route: Hayya Pass Checkpoint</span>
                </div>
                <div className={`flex items-center gap-2 ${activeShipment.status === 'delivered' ? 'text-[#171A20] font-[500]' : 'text-[#8E8E8E]'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${activeShipment.status === 'delivered' ? 'bg-[#3E6AE1] text-white' : 'bg-[#F4F4F4] border border-[#EEEEEE]'}`}>
                    3
                  </span>
                  <span>3. Delivery OTP & Digital POD Verification</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setIsSafetyModeActive(true)}
                  className="btn-tesla-secondary !min-w-0 !min-h-[36px] text-[12px] flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-4 h-4 text-[#3E6AE1]" />
                  <span>HUD Mode</span>
                </button>
                <button
                  onClick={() => setIsPodModalOpen(true)}
                  className="btn-tesla-primary !min-w-0 !min-h-[36px] text-[12px] flex items-center justify-center gap-1.5"
                >
                  <PenTool className="w-4 h-4" />
                  <span>إثبات التسليم POD</span>
                </button>
              </div>
            </div>

            {/* Offline Sync Status Indicator */}
            {isOffline && (
              <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#D0D1D2] text-[12px] space-y-1">
                <div className="font-[500] text-[#171A20] flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4 text-[#3E6AE1]" />
                  <span>Offline Storage Mode Active</span>
                </div>
                <div className="text-[#5C5E62] text-[11px]">
                  All GPS telemetry, timestamps and status events are stored locally. Will auto-sync when network reconnects.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
