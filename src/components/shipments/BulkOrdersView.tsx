'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { BulkShipmentRow } from '@/types';
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  PlusCircle,
  Download,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function BulkOrdersView() {
  const { bulkShipmentRows, importBulkShipments, setCurrentView, t, lang } = useApp();

  const [rows, setRows] = useState<BulkShipmentRow[]>(bulkShipmentRows);
  const [isProcessing, setIsProcessing] = useState(false);

  const validCount = rows.filter((r) => r.validationStatus === 'valid').length;
  const errorCount = rows.filter((r) => r.validationStatus !== 'valid').length;
  const totalTonnage = rows.reduce((acc, r) => acc + r.weightTons, 0);
  const totalBatchPrice = rows.reduce((acc, r) => acc + r.priceEstimate, 0);

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(
        lang === 'ar'
          ? 'تم تحليل ملف الـ CSV والتحقق من 4 سجلات شحن بنجاح.'
          : 'CSV file analyzed and 4 shipment manifests validated.'
      );
    }, 800);
  };

  const handleExecuteBatchCreation = () => {
    importBulkShipments(rows);
    alert(
      lang === 'ar'
        ? `تم إنشاء ${validCount} شحنة مؤكدة بنجاح وإدراجها في منظومة التوزيع الذكي!`
        : `Successfully created ${validCount} confirmed shipments and queued into AI dispatch!`
    );
    setCurrentView('shipments');
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'استيراد الشحنات بالجملة (Bulk Orders & CSV Engine)' : 'Bulk Shipment Ingestion & Batch Engine'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mt-1">
            {lang === 'ar'
              ? 'ارفع ملفات CSV أو Excel لإنشاء مئات الشحنات دفعة واحدة مع الفحص الآلي للأوزان والعناوين والتسعير الفوري.'
              : 'Upload CSV or XLSX sheets for bulk cargo creation, duplicate detection, and batch AI pricing validation.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Downloading CSV Template: sudaneel_bulk_manifest_template.csv')}
            className="px-3.5 py-2 rounded-xl bg-navy-800 border border-gold/20 hover:border-gold text-xs font-bold text-gray-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-gold" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onClick={handleSimulateUpload}
        className="p-8 rounded-2xl bg-navy-900/60 border-2 border-dashed border-gold/30 hover:border-gold transition-all text-center cursor-pointer space-y-3 group"
      >
        <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold border border-gold/30 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
          <Upload className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            {lang === 'ar' ? 'اسحب وأفلت ملف الـ CSV / Excel هنا أو اضغط للاختيار' : 'Drag & drop your CSV / XLSX manifest file or click to browse'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Supports .CSV, .XLSX up to 5,000 shipment rows per batch upload
          </p>
        </div>
      </div>

      {/* Batch Summary & Validation Table */}
      <div className="p-5 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gold/15">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-gold" />
              <span>Uploaded Batch Preview & Validation</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
              {validCount} Valid
            </span>
            {errorCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-mono font-bold">
                {errorCount} Flagged
              </span>
            )}
          </div>

          <button
            onClick={handleExecuteBatchCreation}
            disabled={validCount === 0 || isProcessing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Generate {validCount} Confirmed Shipments</span>
          </button>
        </div>

        {/* Validation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-navy-800 text-gray-400 font-semibold text-[11px]">
                <th className="pb-3 text-start">Row #</th>
                <th className="pb-3 text-start">Corridor (Origin ➔ Dest)</th>
                <th className="pb-3 text-start">Cargo Description</th>
                <th className="pb-3 text-start">Payload (Tons)</th>
                <th className="pb-3 text-start">Vehicle Class</th>
                <th className="pb-3 text-start">Price Estimate</th>
                <th className="pb-3 text-end">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {rows.map((r) => (
                <tr key={r.rowId} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 font-mono text-gray-400">#{r.rowId}</td>
                  <td className="py-3 font-semibold text-white">
                    {r.pickupCity} ➔ {r.destCity}
                  </td>
                  <td className="py-3 text-gray-300">{r.cargoDesc}</td>
                  <td className="py-3 font-mono font-bold text-white">{r.weightTons} T</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-navy-950 text-gold border border-gold/20 font-mono text-[10px]">
                      {r.vehicleType}
                    </span>
                  </td>
                  <td className="py-3 font-mono font-bold text-emerald-400">
                    {r.priceEstimate.toLocaleString()} SDG
                  </td>
                  <td className="py-3 text-end">
                    {r.validationStatus === 'valid' ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                        ✓ Valid & Ready
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold" title={r.errorMessage}>
                        ⚠ {r.errorMessage || 'Validation Error'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
