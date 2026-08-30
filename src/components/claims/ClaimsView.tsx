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
} from 'lucide-react';

export function ClaimsView() {
  const { claims, submitClaim, updateClaimStatus, shipments, lang } = useApp();

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
    alert(
      lang === 'ar'
        ? `تم تسجيل المطالبة رقم ${newClaim.claimNumber} بنجاح! تم إرسال إشعار للمحقق التأميني.`
        : `Claim ${newClaim.claimNumber} submitted! Assigned to insurance adjuster.`
    );
  };

  const handleApprovePayout = (claimId: string, amount: number) => {
    updateClaimStatus(claimId, 'approved_payout', amount);
    alert(
      lang === 'ar'
        ? `تم اعتماد تعويض بقيمة ${amount.toLocaleString()} ج.س وقيده كرصيد تسوية فورية للمطالبة.`
        : `Approved compensation of ${amount.toLocaleString()} SDG credited directly to customer wallet.`
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'مركز إدارة المطالبات والتعويضات (Claims & Disputes)' : 'Claims Management & Dispute Resolution Hub'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] max-w-2xl mt-1">
            {lang === 'ar'
              ? 'معالجة نزاعات تلف أو تأخير البضائع، مراجعة الأدلة المصورة وبوالص الـ POD، وصرف التعويضات المالية التلقائية.'
              : 'End-to-end cargo insurance claims, photo evidence investigation, and automated compensation.'}
          </p>
        </div>

        <button
          onClick={() => setIsNewClaimModalOpen(true)}
          className="btn-tesla-primary !min-w-[160px] !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'ar' ? 'فتح مطالبة تعويض جديدة' : 'File New Claim'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Total Claims Filed</span>
            <FileCheck className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">{claims.length} Tickets</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Active Cargo Disputes</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Under Review</span>
            <Clock className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">
            {claims.filter((c) => c.status === 'open' || c.status === 'evidence_review').length} Tickets
          </div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Adjuster reviewing POD</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Approved Compensation</span>
            <DollarSign className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#3E6AE1]">
            {(claims.reduce((acc, c) => acc + (c.compensationOffered || 0), 0) / 1000).toFixed(0)}k SDG
          </div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Direct settlements</div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE]">
          <div className="text-[12px] text-[#5C5E62] flex items-center justify-between mb-1">
            <span>Resolution SLA</span>
            <ShieldCheck className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[22px] font-[500] font-mono text-[#171A20]">24.5 Hours</div>
          <div className="text-[11px] text-[#8E8E8E] mt-1">Target SLA: 48h</div>
        </div>
      </div>

      {/* Claims List and Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Claims List (5 cols) */}
        <div className="lg:col-span-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-5 space-y-4">
          <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
            <AlertTriangle className="w-4 h-4 text-[#3E6AE1]" />
            <span>Active Claims Tickets</span>
          </h3>

          <div className="space-y-2">
            {claims.map((clm) => (
              <button
                key={clm.id}
                onClick={() => setSelectedClaim(clm)}
                className={`w-full p-4 rounded-[4px] text-start transition-colors duration-330 cursor-pointer border ${
                  selectedClaim?.id === clm.id
                    ? 'bg-[#F4F4F4] border-[#171A20]'
                    : 'bg-[#FFFFFF] border-[#EEEEEE] hover:bg-[#F4F4F4]'
                }`}
              >
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="font-mono font-[500] text-[#3E6AE1]">{clm.claimNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-[2px] bg-white text-[#171A20] border border-[#D0D1D2] font-mono font-[500]">
                    {clm.status}
                  </span>
                </div>
                <div className="font-[500] text-[#171A20] text-[13px]">{clm.customerName}</div>
                <div className="text-[11px] text-[#5C5E62] mt-1 truncate">{clm.description}</div>
                <div className="flex items-center justify-between text-[11px] text-[#8E8E8E] mt-2 pt-1 border-t border-[#EEEEEE]">
                  <span>Shipment: {clm.trackingNumber}</span>
                  <span className="font-mono text-[#171A20] font-[500]">{clm.amountRequested.toLocaleString()} {clm.currency}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Claim Details & Resolution Actions (7 cols) */}
        {selectedClaim && (
          <div className="lg:col-span-7 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#EEEEEE]">
              <div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] uppercase font-[500]">
                  {selectedClaim.claimType}
                </span>
                <h3 className="text-[18px] font-[500] text-[#171A20] mt-1">{selectedClaim.claimNumber}</h3>
                <p className="text-[13px] text-[#5C5E62]">Filed on: {selectedClaim.createdAt}</p>
              </div>

              <div className="text-end">
                <span className="text-[11px] text-[#8E8E8E] block">Requested Value</span>
                <span className="text-[16px] font-[500] font-mono text-[#171A20]">
                  {selectedClaim.amountRequested.toLocaleString()} {selectedClaim.currency}
                </span>
              </div>
            </div>

            {/* Description & Proof */}
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2 text-[13px]">
              <div className="text-[#5C5E62] font-[500]">Incident Description & Evidence</div>
              <p className="text-[#171A20] leading-relaxed">{selectedClaim.description}</p>
              <div className="flex items-center gap-2 pt-2 text-[12px] text-[#3E6AE1]">
                <Camera className="w-4 h-4" />
                <span>{selectedClaim.evidencePhotosCount} Geo-Tagged Photos Attached to POD</span>
              </div>
            </div>

            {/* Compensation & Resolution Card */}
            {selectedClaim.compensationOffered ? (
              <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2">
                <div className="flex items-center justify-between text-[13px] text-[#171A20] font-[500]">
                  <span>Approved Settlement</span>
                  <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" />
                </div>
                <div className="text-[20px] font-[500] font-mono text-[#3E6AE1]">
                  {selectedClaim.compensationOffered.toLocaleString()} SDG
                </div>
                {selectedClaim.resolutionNotes && (
                  <p className="text-[12px] text-[#5C5E62]">{selectedClaim.resolutionNotes}</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-3">
                <div className="text-[13px] font-[500] text-[#171A20]">Adjuster Compensation Recommendation</div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    defaultValue={selectedClaim.amountRequested * 0.9}
                    id="compInput"
                    className="flex-1 bg-white border border-[#D0D1D2] text-[#171A20] p-2 rounded-[4px] text-[13px] font-mono outline-none"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('compInput') as HTMLInputElement;
                      handleApprovePayout(selectedClaim.id, Number(input?.value || selectedClaim.amountRequested));
                    }}
                    className="btn-tesla-primary !min-w-[160px] !min-h-[36px] !py-1 !px-3 text-[13px]"
                  >
                    Approve Payout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Claim Modal */}
      {isNewClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#171A20]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
              <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#3E6AE1]" />
                <span>File New Cargo Damage / SLA Claim</span>
              </h3>
              <button onClick={() => setIsNewClaimModalOpen(false)} className="text-[#8E8E8E] hover:text-[#171A20]">✕</button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3 text-[13px]">
              <div>
                <label className="text-[#5C5E62] block mb-1">Select Shipment</label>
                <select
                  value={selectedShipmentId}
                  onChange={(e) => setSelectedShipmentId(e.target.value)}
                  className="w-full bg-white border border-[#D0D1D2] text-[#171A20] p-2.5 rounded-[4px] outline-none"
                >
                  {shipments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.trackingNumber} - {s.customerName} ({s.cargoDescription})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#5C5E62] block mb-1">Claim Type</label>
                  <select
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value as ClaimType)}
                    className="w-full bg-white border border-[#D0D1D2] text-[#171A20] p-2.5 rounded-[4px] outline-none"
                  >
                    <option value="cargo_damage">Cargo Damage (تلف بضاعة)</option>
                    <option value="delay_compensation">SLA Delay (تعويض تأخير)</option>
                    <option value="missing_quantity">Missing Qty (نقص كمية)</option>
                    <option value="temp_violation">Temperature Alert (حرارة)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#5C5E62] block mb-1">Claim Amount (SDG)</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                    className="w-full bg-white border border-[#D0D1D2] text-[#171A20] p-2.5 rounded-[4px] outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[#5C5E62] block mb-1">Detailed Description of Damage</label>
                <textarea
                  rows={3}
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  placeholder="Describe evidence noted on POD delivery note..."
                  className="w-full bg-white border border-[#D0D1D2] text-[#171A20] p-2.5 rounded-[4px] outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewClaimModalOpen(false)}
                  className="btn-tesla-secondary !min-h-[34px] !py-1 !px-3 text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-tesla-primary !min-h-[34px] !py-1 !px-4 text-[13px]"
                >
                  Submit Official Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
