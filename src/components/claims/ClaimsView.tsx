'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Claim, ClaimType } from '@/types';
import {
  ShieldAlert,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  Clock,
  Camera,
  ShieldCheck,
  X,
  Sparkles,
} from 'lucide-react';

export function ClaimsView() {
  const { claims, submitClaim, updateClaimStatus, shipments, showToast, lang } = useApp();

  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(claims[0] || null);
  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState(false);

  // New claim form state
  const [selectedShipmentId, setSelectedShipmentId] = useState(shipments[0]?.id || '');
  const [claimType, setClaimType] = useState<ClaimType>('cargo_damage');
  const [claimAmount, setClaimAmount] = useState(350000);
  const [claimDesc, setClaimDesc] = useState('');

  const handleCreateClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const shp = shipments.find((s) => s.id === selectedShipmentId) || shipments[0];

    const newClaim: Claim = {
      id: `clm-${Date.now()}`,
      claimNumber: `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      shipmentId: shp.id,
      trackingNumber: shp.trackingNumber,
      customerName: shp.customerName,
      carrierName: shp.carrierName || 'Assigned Carrier',
      claimType,
      amountRequested: claimAmount,
      currency: 'SDG',
      description: claimDesc || 'Damage and discrepancy filed by consignee upon delivery arrival.',
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      evidencePhotosCount: 2,
    };

    submitClaim(newClaim);
    setIsNewClaimModalOpen(false);
    showToast(
      lang === 'ar' ? 'تم تسجيل المطالبة' : 'Claim Submitted',
      lang === 'ar'
        ? `تم تسجيل المطالبة رقم ${newClaim.claimNumber} بنجاح وإحالتها للمحقق التأميني.`
        : `Claim ${newClaim.claimNumber} submitted! Assigned to insurance adjuster.`,
      'success'
    );
  };

  const totalClaimAmount = claims.reduce((acc, c) => acc + c.amountRequested, 0);

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <ShieldCheck className="w-4 h-4" />
            <span>Insurance & Claims Escrow • مركز تسوية المطالبات والتأمين</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            مركز تسوية المطالبات والتأمين اللوجستي
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            معالجة نزاعات الشحنات، تقييم أضرار الحمولات، وصرف التعويضات المالية الفورية عبر الضمان السيادي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsNewClaimModalOpen(true)}
            className="btn-shopify-pill"
          >
            <PlusCircle className="w-4 h-4" />
            <span>تسجيل مطالبة جديدة</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600]">إجمالي المطالبات النشطة</div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{claims.length}</div>
          <div className="text-[12px] text-[#71717a]">مطالبات قيد التحقيق والتقييم</div>
        </div>

        <div className="shopify-card-aloe p-6 space-y-2 shadow-[0_8px_20px_rgba(193,251,212,0.4)]">
          <div className="text-[12px] text-[#000000] font-[600]">إجمالي مبالغ التعويضات المطالب بها</div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">{totalClaimAmount.toLocaleString()} SDG</div>
          <div className="text-[12px] text-[#000000]/80 font-[500]">تغطية تأمينية شاملة 100%</div>
        </div>

        <div className="shopify-card p-6 space-y-2 bg-[#ffffff]">
          <div className="text-[12px] text-[#71717a] font-[600]">متوسط زمن فض النزاع والتسوية</div>
          <div className="text-[28px] font-[700] font-mono text-[#000000]">24 ساعة</div>
          <div className="text-[12px] text-[#71717a]">صرف فوري عبر المحفظة</div>
        </div>
      </div>

      {/* Claims List & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Claims List (5 cols) */}
        <div className="lg:col-span-5 shopify-card p-6 space-y-4 bg-[#ffffff]">
          <h3 className="font-[600] text-[16px] text-[#000000] pb-3 border-b border-[#e4e4e7]">
            سجل المطالبات المفتوحة ({claims.length})
          </h3>

          <div className="space-y-3">
            {claims.map((clm) => {
              const isSelected = clm.id === selectedClaim?.id;
              return (
                <div
                  key={clm.id}
                  onClick={() => setSelectedClaim(clm)}
                  className={`p-4 rounded-[12px] text-start transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? 'bg-[#ffffff] border-[#000000] ring-2 ring-[#c1fbd4] shadow-sm'
                      : 'bg-[#fbfbf5] border-[#e4e4e7] hover:border-[#a1a1aa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-[700] text-[14px] text-[#000000]">{clm.claimNumber}</span>
                    <span className={clm.status === 'approved_payout' ? 'shopify-tag-mint !text-[10px]' : 'shopify-tag-shade !text-[10px]'}>
                      {clm.status}
                    </span>
                  </div>

                  <div className="font-[600] text-[13.5px] text-[#000000] mt-2">{clm.claimType}</div>
                  <div className="text-[12px] text-[#71717a] mt-1">الشحنة: {clm.trackingNumber} • {clm.customerName}</div>
                  <div className="font-mono font-[700] text-[#000000] text-[14px] mt-2">{clm.amountRequested.toLocaleString()} SDG</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Claim Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedClaim ? (
            <div className="shopify-card p-8 space-y-6 bg-[#ffffff]">
              <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
                <div>
                  <span className="shopify-tag-mint !text-[11px]">Claim Adjudication Dossier</span>
                  <h3 className="font-[600] text-[18px] text-[#000000] mt-1">{selectedClaim.claimNumber}</h3>
                </div>
                <span className="font-mono text-[12px] text-[#71717a]">{selectedClaim.createdAt}</span>
              </div>

              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-3 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#71717a]">رقم الشحنة:</span>
                  <span className="font-mono font-[700] text-[#000000]">{selectedClaim.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">العميل الشاحن:</span>
                  <span className="font-[600] text-[#000000]">{selectedClaim.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">الناقل المسؤول:</span>
                  <span className="font-[600] text-[#000000]">{selectedClaim.carrierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717a]">مبلغ التعويض المطلوب:</span>
                  <span className="font-mono font-[800] text-[16px] text-[#000000]">{selectedClaim.amountRequested.toLocaleString()} SDG</span>
                </div>
                <div className="pt-2 border-t border-[#e4e4e7]">
                  <span className="text-[#71717a] block mb-1 font-[500]">شرح الضرر والحادثة:</span>
                  <p className="text-[#000000] leading-relaxed">{selectedClaim.description}</p>
                </div>
              </div>

              <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2] flex items-center justify-between text-[13px]">
                <span className="font-[600] text-[#000000]">الحالة التأمينية:</span>
                <span className="font-[700] text-[#000000]">معتمدة تحت مظلة التأمين السيادي</span>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    updateClaimStatus(selectedClaim.id, 'approved_payout');
                    showToast('تم اعتماد صرف التعويض', `تمت الموافقة على تعويض المطالبة ${selectedClaim.claimNumber} وتحويل المبلغ للمحفظة فوراً`, 'success');
                  }}
                  className="flex-1 btn-shopify-pill !py-3 text-[13.5px]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#c1fbd4]" />
                  <span>اعتماد المطالبة وصرف التعويض الفوري</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="shopify-card p-8 text-center text-[#71717a]">
              اختر مطالبة من القائمة
            </div>
          )}
        </div>
      </div>

      {/* New Claim Modal */}
      {isNewClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] p-8 space-y-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
              <div className="space-y-1">
                <div className="shopify-tag-mint !text-[10px]">تسجيل مطالبة تأمينية</div>
                <h3 className="font-[600] text-[18px] text-[#000000]">فتح ملف تعويض شحنة متضررة</h3>
              </div>
              <button onClick={() => setIsNewClaimModalOpen(false)} className="p-1 rounded-full hover:bg-[#fbfbf5] text-[#71717a]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-4 text-[13px]">
              <div>
                <label className="text-[#71717a] block mb-1 font-[500]">الشحنة المعنية</label>
                <select
                  value={selectedShipmentId}
                  onChange={(e) => setSelectedShipmentId(e.target.value)}
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2.5 outline-none text-[#000000] focus:border-[#000000]"
                >
                  {shipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.trackingNumber} — {s.customerName} ({s.cargoType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#71717a] block mb-1 font-[500]">نوع الضرر</label>
                  <select
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value as any)}
                    className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2.5 outline-none text-[#000000] focus:border-[#000000]"
                  >
                    <option value="cargo_damage">تلف / كسر في البضاعة</option>
                    <option value="temp_breach">خلل في درجة حرارة التبريد</option>
                    <option value="shortage">نقص في عدد الطرود</option>
                    <option value="delay">تأخير حرج أضر بالصلاحية</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#71717a] block mb-1 font-[500]">مبلغ التعويض المقدر (SDG)</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                    className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2.5 outline-none font-mono text-[#000000] focus:border-[#000000]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[#71717a] block mb-1 font-[500]">تفاصيل الحادثة ووصف الأضرار</label>
                <textarea
                  rows={3}
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  placeholder="يرجى كتابة تفاصيل المعاينة الفنية وحالة الطرود عند الاستلام..."
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] p-3 outline-none text-[#000000] focus:border-[#000000]"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setIsNewClaimModalOpen(false)} className="btn-shopify-outline flex-1">
                  إلغاء
                </button>
                <button type="submit" className="btn-shopify-pill flex-1">
                  إرسال ملف المطالبة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
