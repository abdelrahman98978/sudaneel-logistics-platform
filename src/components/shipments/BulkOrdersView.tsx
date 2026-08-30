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
  CheckCircle2,
  AlertTriangle,
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
      'success'
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <FileSpreadsheet className="w-4 h-4" />
            <span>CSV Batch Ingestion • الاستيراد الجماعي للبوالص</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            استيراد الشحنات المجمعة (CSV/Excel Batch)
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            رفع ملفات المانيفست المجمعة لكبار الشاحنين، التحقق الخوارزمي من المسارات والأسعار، وإطلاق الشحنات فورياً.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadTemplate}
            className="btn-shopify-outline"
          >
            <Download className="w-4 h-4" />
            <span>تحميل قالب CSV القياسي</span>
          </button>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div
        onClick={handleSimulateUpload}
        className="p-8 rounded-[12px] border-2 border-dashed border-[#e4e4e7] hover:border-[#000000] bg-[#ffffff] text-center space-y-3 cursor-pointer transition-all duration-200"
      >
        <div className="w-12 h-12 rounded-full bg-[#fbfbf5] text-[#000000] flex items-center justify-center mx-auto border border-[#e4e4e7]">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-[600] text-[16px] text-[#000000]">
            اسحب وأفلت ملف CSV هنا أو انقر للاستيراد
          </h3>
          <p className="text-[13px] text-[#71717a] mt-1">
            يدعم ملفات CSV و XLSX حتى 5,000 بوليصة في الدفعة الواحدة
          </p>
        </div>
      </div>

      {/* Manifest Preview Table */}
      <div className="shopify-card overflow-hidden bg-[#ffffff]">
        <div className="p-6 border-b border-[#e4e4e7] flex items-center justify-between">
          <div>
            <h3 className="font-[600] text-[16px] text-[#000000]">معاينة الشحنات المجهزة للاستيراد</h3>
            <p className="text-[13px] text-[#71717a]">
              تم التحقق من سلامة {validCount} شحنات وجاهزيتها للتثبيت
            </p>
          </div>

          <button
            onClick={handleExecuteBatchCreation}
            disabled={isProcessing || validCount === 0}
            className="btn-shopify-pill !py-2.5 !px-6 text-[13.5px]"
          >
            <Zap className="w-4 h-4 text-[#c1fbd4]" />
            <span>تأكيد استيراد ({validCount}) شحنات فوراً</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-[13px]">
            <thead>
              <tr className="border-b border-[#e4e4e7] bg-[#fbfbf5] text-[#71717a] text-[12px]">
                <th className="p-4 text-start font-[600]">محطة المنشأ</th>
                <th className="p-4 text-start font-[600]">محطة الوصول</th>
                <th className="p-4 text-start font-[600]">وصف الحمولة</th>
                <th className="p-4 text-start font-[600]">الوزن (طن)</th>
                <th className="p-4 text-start font-[600]">نوع الشاحنة</th>
                <th className="p-4 text-start font-[600]">تاريخ التحميل</th>
                <th className="p-4 text-end font-[600]">حالة التحقق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e4e7]">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-[#fbfbf5]">
                  <td className="p-4 font-[600] text-[#000000]">{r.pickupCity}</td>
                  <td className="p-4 font-[600] text-[#000000]">{r.destCity}</td>
                  <td className="p-4 text-[#71717a]">{r.cargoDesc}</td>
                  <td className="p-4 font-mono font-[700] text-[#000000]">{r.weightTons}</td>
                  <td className="p-4 text-[#71717a]">{r.vehicleType}</td>
                  <td className="p-4 font-mono text-[12px] text-[#71717a]">{r.pickupDate}</td>
                  <td className="p-4 text-end">
                    <span className="shopify-tag-mint !text-[11px]">
                      {r.validationStatus === 'valid' ? 'سليمة ومطابقة' : 'خطأ'}
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
