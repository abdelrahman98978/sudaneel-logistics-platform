'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { BulkShipmentRow } from '@/types';
import {
  FileSpreadsheet,
  Upload,
  FileCheck,
  Download,
  Zap,
} from 'lucide-react';

export function BulkOrdersView() {
  const { bulkShipmentRows, importBulkShipments, setCurrentView, lang } = useApp();

  const [rows] = useState<BulkShipmentRow[]>(bulkShipmentRows);
  const [isProcessing, setIsProcessing] = useState(false);

  const validCount = rows.filter((r) => r.validationStatus === 'valid').length;
  const errorCount = rows.filter((r) => r.validationStatus !== 'valid').length;

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
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'استيراد الشحنات بالجملة (Bulk Orders & CSV Engine)' : 'Bulk Shipment Ingestion & Batch Engine'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] max-w-2xl mt-1">
            {lang === 'ar'
              ? 'ارفع ملفات CSV أو Excel لإنشاء مئات الشحنات دفعة واحدة مع الفحص الآلي للأوزان والعناوين والتسعير الفوري.'
              : 'Upload CSV or XLSX sheets for bulk cargo creation, duplicate detection, and batch AI pricing validation.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Downloading CSV Template: sudaneel_bulk_manifest_template.csv')}
            className="btn-tesla-secondary !min-h-[36px] !py-1 !px-3 text-[12px] flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#3E6AE1]" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onClick={handleSimulateUpload}
        className="p-8 rounded-[4px] bg-[#FFFFFF] border border-dashed border-[#D0D1D2] hover:border-[#171A20] transition-colors duration-330 text-center cursor-pointer space-y-3"
      >
        <div className="w-12 h-12 rounded-[4px] bg-[#F4F4F4] text-[#3E6AE1] flex items-center justify-center mx-auto">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-[14px] font-[500] text-[#171A20]">
            {lang === 'ar' ? 'اسحب وأفلت ملف الـ CSV / Excel هنا أو اضغط للاختيار' : 'Drag & drop your CSV / XLSX manifest file or click to browse'}
          </h3>
          <p className="text-[12px] text-[#5C5E62] mt-1">
            Supports .CSV, .XLSX up to 5,000 shipment rows per batch upload
          </p>
        </div>
      </div>

      {/* Batch Summary & Validation Table */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#EEEEEE]">
          <div className="flex items-center gap-3">
            <h3 className="font-[500] text-[15px] text-[#171A20] flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#3E6AE1]" />
              <span>Uploaded Batch Preview & Validation</span>
            </h3>
            <span className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] text-[11px] font-mono font-[500]">
              {validCount} Valid
            </span>
            {errorCount > 0 && (
              <span className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#393C41] border border-[#D0D1D2] text-[11px] font-mono font-[500]">
                {errorCount} Flagged
              </span>
            )}
          </div>

          <button
            onClick={handleExecuteBatchCreation}
            disabled={validCount === 0 || isProcessing}
            className="btn-tesla-primary !min-w-[180px] !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>Generate {validCount} Confirmed Shipments</span>
          </button>
        </div>

        {/* Validation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-start">
            <thead>
              <tr className="border-b border-[#EEEEEE] text-[#5C5E62] font-[500] text-[11px] uppercase bg-[#F4F4F4]">
                <th className="p-3 text-start">Row #</th>
                <th className="p-3 text-start">Corridor (Origin ➔ Dest)</th>
                <th className="p-3 text-start">Cargo Description</th>
                <th className="p-3 text-start">Payload (Tons)</th>
                <th className="p-3 text-start">Vehicle Class</th>
                <th className="p-3 text-start">Price Estimate</th>
                <th className="p-3 text-end">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE] text-[#171A20]">
              {rows.map((r) => (
                <tr key={r.rowId} className="hover:bg-[#F4F4F4] transition-colors duration-330">
                  <td className="p-3 font-mono text-[#8E8E8E]">#{r.rowId}</td>
                  <td className="p-3 font-[500]">
                    {r.pickupCity} ➔ {r.destCity}
                  </td>
                  <td className="p-3 text-[#5C5E62]">{r.cargoDesc}</td>
                  <td className="p-3 font-mono font-[500]">{r.weightTons} T</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] font-mono text-[11px]">
                      {r.vehicleType}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-[500] text-[#3E6AE1]">
                    {r.priceEstimate.toLocaleString()} SDG
                  </td>
                  <td className="p-3 text-end">
                    {r.validationStatus === 'valid' ? (
                      <span className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] text-[11px] font-[500]">
                        ✓ Valid & Ready
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#393C41] border border-[#D0D1D2] text-[11px] font-[500]" title={r.errorMessage}>
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
