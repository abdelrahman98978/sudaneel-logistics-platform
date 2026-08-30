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
import { exportToCsv } from '@/lib/export-utils';

export function BulkOrdersView() {
  const { bulkShipmentRows, importBulkShipments, setCurrentView, showToast, lang } = useApp();

  const [rows] = useState<BulkShipmentRow[]>(bulkShipmentRows);
  const [isProcessing, setIsProcessing] = useState(false);

  const validCount = rows.filter((r) => r.validationStatus === 'valid').length;
  const errorCount = rows.filter((r) => r.validationStatus !== 'valid').length;

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      showToast(
        lang === 'ar' ? 'تم فحص ملف الدفعات' : 'Batch File Validated',
        lang === 'ar' ? 'تم فحص ملف CSV والتحقق من سلامة الأوزان والمسارات بنجاح' : 'CSV file analyzed and 4 shipment manifests validated.',
        'success'
      );
    }, 600);
  };

  const handleExecuteBatchCreation = () => {
    importBulkShipments(rows);
    showToast(
      lang === 'ar' ? 'تم إنشاء الشحنات المجمعة' : 'Batch Shipments Ingested',
      lang === 'ar'
        ? `تم إنشاء ${validCount} شحنة مؤكدة بنجاح وإدراجها في منظومة التوزيع الذكي!`
        : `Successfully created ${validCount} confirmed shipments and queued into AI dispatch!`,
      'success'
    );
    setCurrentView('shipments');
  };

  const handleDownloadTemplate = () => {
    exportToCsv('sudaneel-bulk-manifest-template', [
      { header: 'Pickup City', accessor: (r) => r.pickupCity },
      { header: 'Destination City', accessor: (r) => r.destCity },
      { header: 'Cargo Description', accessor: (r) => r.cargoDesc },
      { header: 'Weight (Tons)', accessor: (r) => r.weightTons },
      { header: 'Required Vehicle Type', accessor: (r) => r.vehicleType },
      { header: 'Pickup Date', accessor: (r) => r.pickupDate },
    ], rows);

    showToast(
      lang === 'ar' ? 'تم تحميل القالب' : 'Template Downloaded',
      lang === 'ar' ? 'تم تنزيل قالب CSV القياسي لاستيراد الشحنات المجمعة' : 'CSV bulk manifest template downloaded successfully',
      'info'
    );
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
            onClick={handleDownloadTemplate}
            className="btn-tesla-secondary !min-h-[36px] !py-1 !px-3 text-[12px] flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#3E6AE1]" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="p-8 rounded-[4px] bg-[#FFFFFF] border border-dashed border-[#D0D1D2] flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-[4px] bg-[#F4F4F4] text-[#3E6AE1] flex items-center justify-center">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-[500] text-[15px] text-[#171A20]">
            {lang === 'ar' ? 'اسحب وأسقط ملف الـ CSV هنا' : 'Drag and drop your freight batch file'}
          </h3>
          <p className="text-[12px] text-[#5C5E62] mt-0.5">
            يدعم ملفات .CSV و .XLSX حتى 5,000 بوليصة شحن في الدفعة الواحدة
          </p>
        </div>

        <button
          onClick={handleSimulateUpload}
          disabled={isProcessing}
          className="btn-tesla-primary !min-w-[160px] !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2"
        >
          <FileCheck className="w-4 h-4" />
          <span>{isProcessing ? 'Validating CSV...' : 'Select File & Validate'}</span>
        </button>
      </div>

      {/* Batch Ingestion Summary & Table */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
          <div className="flex items-center gap-2">
            <span className="font-[500] text-[15px] text-[#171A20]">
              {lang === 'ar' ? 'سجلات الشحنات المفحوصة في الدفعة' : 'Validated Manifest Batch Preview'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#3E6AE1] font-mono font-[500]">
              {validCount} Ready / {errorCount} Errors
            </span>
          </div>

          <button
            onClick={handleExecuteBatchCreation}
            disabled={validCount === 0}
            className="btn-tesla-primary !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تأكيد وحجز كافة الشحنات' : 'Confirm & Ingest Batch'}</span>
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-start text-[13px]">
            <thead>
              <tr className="bg-[#F4F4F4] text-[#5C5E62] font-[500] text-[11px] uppercase border-b border-[#EEEEEE]">
                <th className="p-3 text-start">Row</th>
                <th className="p-3 text-start">Origin ➔ Destination</th>
                <th className="p-3 text-start">Cargo Description</th>
                <th className="p-3 text-start">Weight (Tons)</th>
                <th className="p-3 text-start">Vehicle Type</th>
                <th className="p-3 text-start">Pickup Date</th>
                <th className="p-3 text-start">Est. Price</th>
                <th className="p-3 text-end">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE] font-[400]">
              {rows.map((row) => (
                <tr key={row.rowId} className="hover:bg-[#F4F4F4] transition-colors duration-330">
                  <td className="p-3 font-mono font-[500] text-[#8E8E8E]">#{row.rowId}</td>
                  <td className="p-3 font-[500] text-[#171A20]">
                    {row.pickupCity} ➔ {row.destCity}
                  </td>
                  <td className="p-3 text-[#5C5E62]">{row.cargoDesc}</td>
                  <td className="p-3 font-mono font-[500] text-[#171A20]">{row.weightTons} T</td>
                  <td className="p-3 font-mono text-[12px]">{row.vehicleType}</td>
                  <td className="p-3 text-[#5C5E62] font-mono text-[12px]">{row.pickupDate}</td>
                  <td className="p-3 font-mono font-[500] text-[#3E6AE1]">
                    {row.priceEstimate.toLocaleString()} SDG
                  </td>
                  <td className="p-3 text-end">
                    <span
                      className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-[500] border ${
                        row.validationStatus === 'valid'
                          ? 'bg-white text-[#171A20] border-[#D0D1D2]'
                          : 'bg-white text-[#171A20] border-[#171A20]'
                      }`}
                    >
                      {row.validationStatus.toUpperCase()}
                    </span>
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
