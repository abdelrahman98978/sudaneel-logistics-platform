'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Claim, ClaimType, ClaimStatus } from '@/types';
import {
  ShieldAlert,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  Clock,
  Camera,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

export function ClaimsView() {
  const { claims, submitClaim, updateClaimStatus, shipments, t, lang } = useApp();

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
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'مركز إدارة المطالبات والتعويضات (Claims & Disputes)' : 'Claims Management & Dispute Resolution Hub'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            {lang === 'ar'
              ? 'معالجة نزاعات تلف أو تأخير البضائع، مراجعة الأدلة المصورة وبوالص الـ POD، وصرف التعويضات المالية التلقائية.'
              : 'End-to-end cargo insurance claims, photo evidence investigation, carrier defense, and automated compensation.'}
          </p>
        </div>

        <button
          onClick={() => setIsNewClaimModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'ar' ? 'فتح مطالبة تعويض جديدة' : 'File New Claim'}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 shadow-lg">
          <div className="text-xs text-gray-400 flex items-center justify-between mb-1">
            <span>Total Claims Filed</span>
            <FileCheck className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl font-bold font-mono text-white">{claims.length} Tickets</div>
          <div className="text-[10px] text-gray-400 mt-1">Active Cargo Disputes</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-amber-500/30 shadow-lg">
          <div className="text-xs text-amber-300 flex items-center justify-between mb-1">
            <span>Under Investigation</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {claims.filter((c) => c.status === 'open' || c.status === 'evidence_review').length} Tickets
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Adjuster reviewing POD</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-emerald-500/30 shadow-lg">
          <div className="text-xs text-emerald-300 flex items-center justify-between mb-1">
            <span>Approved Compensation</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">
            {(claims.reduce((acc, c) => acc + (c.compensationOffered || 0), 0) / 1000).toFixed(0)}k SDG
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Direct wallet settlements</div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/80 border border-sky-500/30 shadow-lg">
          <div className="text-xs text-sky-300 flex items-center justify-between mb-1">
            <span>Avg Resolution Time</span>
            <ShieldCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-sky-400">24.5 Hours</div>
          <div className="text-[10px] text-gray-400 mt-1">Standard SLA: 48 hours</div>
        </div>
      </div>

      {/* Claims List and Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Claims List (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-navy-900/90 border border-gold/20 p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-gold/15">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Active Claims Tickets</span>
          </h3>

          <div className="space-y-2">
            {claims.map((clm) => (
              <button
                key={clm.id}
                onClick={() => setSelectedClaim(clm)}
                className={`w-full p-3.5 rounded-xl text-start transition-all cursor-pointer border ${
                  selectedClaim?.id === clm.id
                    ? 'bg-navy-950 border-rose-500/60 shadow-lg'
                    : 'bg-navy-950/60 border-navy-800 hover:bg-navy-800 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-rose-400">{clm.claimNumber}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 text-gray-300 font-mono">
                    {clm.status}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{clm.customerName}</div>
                <div className="text-[11px] text-gray-400 mt-1 truncate">{clm.description}</div>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-1 border-t border-navy-800">
                  <span>Shipment: {clm.trackingNumber}</span>
                  <span className="font-mono text-gold font-bold">{clm.amountRequested.toLocaleString()} {clm.currency}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Claim Details & Resolution Actions (7 cols) */}
        {selectedClaim && (
          <div className="lg:col-span-7 rounded-2xl bg-navy-900/90 border border-gold/25 p-5 shadow-xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gold/15">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase font-bold">
                  {selectedClaim.claimType}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedClaim.claimNumber}</h3>
                <p className="text-xs text-gray-400">Filed on: {selectedClaim.createdAt}</p>
              </div>

              <div className="text-end">
                <span className="text-[10px] text-gray-400 block">Requested Value</span>
                <span className="text-base font-bold font-mono text-rose-400">
                  {selectedClaim.amountRequested.toLocaleString()} {selectedClaim.currency}
                </span>
              </div>
            </div>

            {/* Description & Proof */}
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2 text-xs">
              <div className="text-gray-400 font-semibold">Incident Description & Evidence</div>
              <p className="text-gray-200 leading-relaxed">{selectedClaim.description}</p>
              <div className="flex items-center gap-2 pt-2 text-[11px] text-gold">
                <Camera className="w-4 h-4" />
                <span>{selectedClaim.evidencePhotosCount} Geo-Tagged Photos Attached to POD</span>
              </div>
            </div>

            {/* Compensation & Resolution Card */}
            {selectedClaim.compensationOffered ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
                  <span>Approved Direct Settlement</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {selectedClaim.compensationOffered.toLocaleString()} SDG
                </div>
                {selectedClaim.resolutionNotes && (
                  <p className="text-xs text-gray-300">{selectedClaim.resolutionNotes}</p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-navy-950 border border-gold/30 space-y-3">
                <div className="text-xs font-semibold text-white">Adjuster Compensation Recommendation</div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    defaultValue={selectedClaim.amountRequested * 0.9}
                    id="compInput"
                    className="flex-1 bg-navy-900 border border-gold/20 text-white p-2 rounded-xl text-xs font-mono outline-none"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('compInput') as HTMLInputElement;
                      handleApprovePayout(selectedClaim.id, Number(input?.value || selectedClaim.amountRequested));
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg cursor-pointer"
                  >
                    Approve Compensation Payout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Claim Modal */}
      {isNewClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-navy-900 border border-gold/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gold/15">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>File New Cargo Damage / SLA Claim</span>
              </h3>
              <button onClick={() => setIsNewClaimModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Select Shipment</label>
                <select
                  value={selectedShipmentId}
                  onChange={(e) => setSelectedShipmentId(e.target.value)}
                  className="w-full bg-navy-950 border border-gold/20 text-white p-2.5 rounded-xl outline-none"
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
                  <label className="text-gray-300 block mb-1">Claim Type</label>
                  <select
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value as ClaimType)}
                    className="w-full bg-navy-950 border border-gold/20 text-white p-2.5 rounded-xl outline-none"
                  >
                    <option value="cargo_damage">Cargo Damage (تلف بضاعة)</option>
                    <option value="delay_compensation">SLA Delay (تعويض تأخير)</option>
                    <option value="missing_quantity">Missing Qty (نقص كمية)</option>
                    <option value="temp_violation">Temperature Alert (حرارة)</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">Claim Amount (SDG)</label>
                  <input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-gold/20 text-white p-2.5 rounded-xl outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Detailed Description of Damage</label>
                <textarea
                  rows={3}
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  placeholder="Describe evidence noted on POD delivery note..."
                  className="w-full bg-navy-950 border border-gold/20 text-white p-2.5 rounded-xl outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewClaimModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold hover:brightness-110 shadow-lg cursor-pointer"
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
