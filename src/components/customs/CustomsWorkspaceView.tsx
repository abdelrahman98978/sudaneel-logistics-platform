'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { CustomsDeclaration } from '@/types';
import {
  FileCheck2,
  Search,
  PlusCircle,
  Filter,
  ShieldCheck,
  Building2,
  AlertTriangle,
  Clock,
  Printer,
  CheckCircle2,
  Scale,
  FileText,
  Anchor,
  Globe2,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { printDocument } from '@/lib/export-utils';

export function CustomsWorkspaceView() {
  const { customsDeclarations, submitCustomsDeclaration, updateCustomsDeclarationStatus, showToast, t, lang } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDeclaration, setSelectedDeclaration] = useState<CustomsDeclaration>(customsDeclarations[0] || {} as CustomsDeclaration);
  const [isNewDeclarationModalOpen, setIsNewDeclarationModalOpen] = useState(false);

  // Form State for new declaration
  const [formImporter, setFormImporter] = useState('');
  const [formBol, setFormBol] = useState('');
  const [formHsCode, setFormHsCode] = useState('3004.90.00');
  const [formCargoDesc, setFormCargoDesc] = useState('');
  const [formInvoiceVal, setFormInvoiceVal] = useState<number>(50000);
  const [formOrigin, setFormOrigin] = useState('Germany');
  const [formPort, setFormPort] = useState('Port Sudan Terminal 1');

  const filteredDeclarations = customsDeclarations.filter((d) => {
    if (statusFilter !== 'all' && d.releaseStatus !== statusFilter) return false;
    if (
      searchQuery &&
      !d.declarationNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.importerExporter.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !d.hsCode.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const calculateDuty = (val: number, hs: string) => {
    if (hs.startsWith('3004')) return Math.round(val * 0.05); // 5% Pharma
    if (hs.startsWith('8438')) return Math.round(val * 0.10); // 10% Capital Equipment
    if (hs.startsWith('2710')) return Math.round(val * 0.20); // 20% Petroleum products
    return Math.round(val * 0.05);
  };

  const handleCreateDeclaration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImporter.trim() || !formBol.trim() || !formCargoDesc.trim()) {
      showToast(
        lang === 'ar' ? 'حقول مطلوبة ناقصة' : 'Missing Required Fields',
        lang === 'ar' ? 'يرجى استيفاء كافة بيانات الإقرار الجمركي' : 'Please fill all declaration fields',
        'warning'
      );
      return;
    }

    const calculatedDuty = calculateDuty(formInvoiceVal, formHsCode);

    const newDec: CustomsDeclaration = {
      id: `cust-dec-${Date.now()}`,
      declarationNumber: `DEC-2026-PS-${Math.floor(1000 + Math.random() * 9000)}`,
      importerExporter: formImporter,
      bolNumber: formBol,
      hsCode: formHsCode,
      cargoDescription: formCargoDesc,
      commercialInvoiceValue: Number(formInvoiceVal),
      originCountry: formOrigin,
      entryPort: formPort,
      calculatedDutyTax: calculatedDuty,
      permitsRequired: ['Standardization Clearance (SSMO)', 'Port Authority Ingate Permit'],
      permitsStatus: 'under_review',
      inspectionStatus: 'physical_inspection_pending',
      releaseStatus: 'submitted',
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      officerNotes: 'Submitted via Sudaneel Automated Customs Integration Gateway.',
    };

    submitCustomsDeclaration(newDec);
    setSelectedDeclaration(newDec);
    setIsNewDeclarationModalOpen(false);

    // Reset Form
    setFormImporter('');
    setFormBol('');
    setFormCargoDesc('');
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="shopify-tag-mint">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Sovereign Customs Gateway • بوابة التخليص الجمركي الموحدة</span>
            </span>
            <span className="shopify-tag-pistachio">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ASYCUDA & SSMO Linked</span>
            </span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            {lang === 'ar' ? 'مساحة عمل التخليص والجمارك الذكية' : 'Smart Customs & Tariff Clearance'}
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            {lang === 'ar'
              ? 'إدارة الإقرارات الجمركية وحساب الرسوم التلقائية لرموز HS Codes والربط المباشر مع هيئة الموانئ البحرية والمعابر الحدودية.'
              : 'End-to-end customs declarations, automated tariff calculation by HS Codes, and integration with Sea Ports & Border Crossings.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsNewDeclarationModalOpen(true)}
            className="btn-shopify-pill"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تسجيل إقرار جمركي جديد' : 'New Customs Declaration'}</span>
          </button>

          <button
            onClick={() => printDocument('Customs-Declarations-Summary')}
            className="btn-shopify-outline"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === 'ar' ? 'طباعة تقرير الجمارك' : 'Export Customs Report'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="shopify-card p-5 bg-[#ffffff]">
          <div className="text-[12px] font-[500] text-[#71717a]">{lang === 'ar' ? 'إجمالي الإقرارات النشطة' : 'Active Declarations'}</div>
          <div className="text-[24px] font-[600] text-[#000000] mt-1">{customsDeclarations.length}</div>
          <div className="text-[11.5px] text-[#14A44D] font-[500] mt-1">100% معالجة إلكترونية فئات الأخضر والأصفر</div>
        </div>

        <div className="shopify-card p-5 bg-[#ffffff]">
          <div className="text-[12px] font-[500] text-[#71717a]">{lang === 'ar' ? 'المسار الأخضر (إفراج فوري)' : 'Green Channel Releases'}</div>
          <div className="text-[24px] font-[600] text-[#14A44D] mt-1">
            {customsDeclarations.filter((d) => d.inspectionStatus === 'green_channel').length}
          </div>
          <div className="text-[11.5px] text-[#71717a] mt-1">إفراج سريع خلال أقل من ساعتين</div>
        </div>

        <div className="shopify-card p-5 bg-[#ffffff]">
          <div className="text-[12px] font-[500] text-[#71717a]">{lang === 'ar' ? 'إجمالي الرسوم المحصلة' : 'Total Tariffs & Duties'}</div>
          <div className="text-[24px] font-[600] text-[#000000] font-mono mt-1">
            ${customsDeclarations.reduce((sum, d) => sum + d.calculatedDutyTax, 0).toLocaleString()}
          </div>
          <div className="text-[11.5px] text-[#71717a] mt-1">تسوية تلقائية لحسابات هيئة الجمارك</div>
        </div>

        <div className="shopify-card p-5 bg-[#ffffff]">
          <div className="text-[12px] font-[500] text-[#71717a]">{lang === 'ar' ? 'معاملات قيد الفحص الميداني' : 'Pending Inspections'}</div>
          <div className="text-[24px] font-[600] text-[#F59E0B] mt-1">
            {customsDeclarations.filter((d) => d.inspectionStatus === 'physical_inspection_pending').length}
          </div>
          <div className="text-[11.5px] text-[#71717a] mt-1">مجدولة بأرصفة ميناء بورتسودان</div>
        </div>
      </div>

      {/* Main Grid: Declarations List + Active Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / List Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="shopify-card p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#ffffff]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'ar' ? 'بحث برقم الإقرار، المستورد، أو رمز HS Code...' : 'Search by declaration, importer, HS code...'}
                className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-full py-2 ps-9 pe-4 text-[13px] outline-none focus:border-[#000000]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#fbfbf5] border border-[#e4e4e7] rounded-full px-3 py-2 text-[12.5px] outline-none text-[#000000]"
              >
                <option value="all">{lang === 'ar' ? 'كافة الحالات' : 'All Statuses'}</option>
                <option value="submitted">{lang === 'ar' ? 'مقدم (قيد المراجعة)' : 'Submitted'}</option>
                <option value="duty_paid">{lang === 'ar' ? 'تم سداد الرسوم' : 'Duty Paid'}</option>
                <option value="released">{lang === 'ar' ? 'مفرج عنه نهائياً' : 'Released'}</option>
                <option value="rejected">{lang === 'ar' ? 'موقوف / مرفوض' : 'Rejected'}</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredDeclarations.map((dec) => {
              const isSelected = selectedDeclaration?.id === dec.id;
              return (
                <div
                  key={dec.id}
                  onClick={() => setSelectedDeclaration(dec)}
                  className={`p-5 shopify-card cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-[#000000] shadow-md bg-[#ffffff]'
                      : 'hover:border-[#a1a1aa] bg-[#ffffff]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-[700] text-[15px] text-[#000000]">
                          {dec.declarationNumber}
                        </span>
                        <span
                          className={`text-[10.5px] font-[600] px-2 py-0.5 rounded-full ${
                            dec.releaseStatus === 'released'
                              ? 'bg-[#c1fbd4] text-[#000000]'
                              : dec.releaseStatus === 'duty_paid'
                              ? 'bg-[#d4f9e0] text-[#000000]'
                              : dec.releaseStatus === 'submitted'
                              ? 'bg-[#fef3c7] text-[#92400e]'
                              : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}
                        >
                          {dec.releaseStatus.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[13.5px] font-[500] text-[#000000]">{dec.importerExporter}</div>
                      <div className="text-[12px] text-[#71717a] flex items-center gap-3">
                        <span>HS: <strong className="font-mono text-[#000000]">{dec.hsCode}</strong></span>
                        <span>•</span>
                        <span>بوليصة: <strong className="font-mono text-[#000000]">{dec.bolNumber}</strong></span>
                        <span>•</span>
                        <span>{dec.entryPort}</span>
                      </div>
                    </div>

                    <div className="text-end">
                      <div className="text-[11px] text-[#71717a]">{lang === 'ar' ? 'الرسوم الجمركية' : 'Duties'}</div>
                      <div className="font-mono font-[700] text-[15px] text-[#000000]">
                        ${dec.calculatedDutyTax.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-[#71717a] font-mono mt-1">{dec.submittedAt}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right / Detail Inspector */}
        <div className="lg:col-span-5">
          {selectedDeclaration && selectedDeclaration.declarationNumber ? (
            <div className="shopify-card p-6 bg-[#ffffff] space-y-6 sticky top-6">
              <div className="flex items-start justify-between border-b border-[#e4e4e7] pb-4">
                <div>
                  <span className="shopify-tag-mint text-[11px]">
                    Customs Passport & Assessment
                  </span>
                  <h3 className="font-mono font-[700] text-[18px] text-[#000000] mt-1">
                    {selectedDeclaration.declarationNumber}
                  </h3>
                </div>

                <span
                  className={`text-[11px] font-[600] px-2.5 py-1 rounded-full ${
                    selectedDeclaration.releaseStatus === 'released'
                      ? 'bg-[#c1fbd4] text-[#000000]'
                      : 'bg-[#fef3c7] text-[#92400e]'
                  }`}
                >
                  {selectedDeclaration.releaseStatus.toUpperCase()}
                </span>
              </div>

              <div className="space-y-4 text-[13px]">
                <div className="p-3.5 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-1">
                  <span className="text-[11px] text-[#71717a] block">{lang === 'ar' ? 'المستورد / المصدر المعتمد' : 'Importer / Exporter'}</span>
                  <span className="font-[600] text-[#000000] text-[14px]">{selectedDeclaration.importerExporter}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                    <span className="text-[11px] text-[#71717a] block">رمز التعريفة (HS Code)</span>
                    <span className="font-mono font-[700] text-[14px] text-[#000000]">{selectedDeclaration.hsCode}</span>
                  </div>
                  <div className="p-3 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                    <span className="text-[11px] text-[#71717a] block">بلد المنشأ</span>
                    <span className="font-[600] text-[#000000]">{selectedDeclaration.originCountry}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7]">
                    <span className="text-[11px] text-[#71717a] block">قيمة الفاتورة التجارية</span>
                    <span className="font-mono font-[700] text-[15px] text-[#000000]">
                      ${selectedDeclaration.commercialInvoiceValue?.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2]">
                    <span className="text-[11px] text-[#000000]/80 block font-[500]">الرسوم والضرائب المحتسبة</span>
                    <span className="font-mono font-[700] text-[15px] text-[#000000]">
                      ${selectedDeclaration.calculatedDutyTax?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-[#71717a] block">{lang === 'ar' ? 'وصف البضاعة والمشمول' : 'Cargo Description'}</span>
                  <p className="text-[13px] text-[#000000] leading-relaxed bg-[#fbfbf5] p-3 rounded-[10px] border border-[#e4e4e7]">
                    {selectedDeclaration.cargoDescription}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#71717a] block">{lang === 'ar' ? 'التصاريح والموافقات المطلوبة' : 'Required Regulatory Permits'}</span>
                  <div className="space-y-1">
                    {selectedDeclaration.permitsRequired?.map((permit, pIdx) => (
                      <div key={pIdx} className="flex items-center justify-between p-2 rounded-[8px] bg-[#fbfbf5] border border-[#e4e4e7] text-[12px]">
                        <span className="text-[#000000]">{permit}</span>
                        <span className="text-[#14A44D] font-[600] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>معتمد</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDeclaration.officerNotes && (
                  <div className="p-3 rounded-[10px] bg-[#fef3c7] border border-[#fde68a] text-[12px] text-[#92400e]">
                    <strong>ملاحظات ضابط الجمارك:</strong> {selectedDeclaration.officerNotes}
                  </div>
                )}
              </div>

              {/* Actions for declaration */}
              <div className="space-y-2 pt-2 border-t border-[#e4e4e7]">
                {selectedDeclaration.releaseStatus !== 'released' ? (
                  <button
                    onClick={() => updateCustomsDeclarationStatus(selectedDeclaration.id, 'released', 'inspection_completed')}
                    className="btn-shopify-pill w-full justify-center !bg-[#14A44D] hover:!bg-[#0f823c]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'اعتماد الإفراج الجمركي الفوري' : 'Authorize Customs Release'}</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-full bg-[#c1fbd4] text-[#000000] text-center font-[600] text-[13px] flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>تم الإفراج الرسمي وحفظ السجل</span>
                  </div>
                )}

                <button
                  onClick={() => printDocument(`Customs-Declaration-${selectedDeclaration.declarationNumber}`)}
                  className="btn-shopify-outline w-full justify-center"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة شهادة الإفراج المعتمدة</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal for New Declaration */}
      {isNewDeclarationModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#000000]" />
                <h3 className="font-[600] text-[18px] text-[#000000]">
                  {lang === 'ar' ? 'تسجيل إقرار جمركي رسمي جديد' : 'New Customs Consignment Declaration'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewDeclarationModalOpen(false)}
                className="p-1 rounded-full text-[#71717a] hover:bg-[#fbfbf5]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeclaration} className="space-y-4 text-[13px]">
              <div>
                <label className="block text-[12px] font-[500] text-[#71717a] mb-1">
                  اسم الشركة المستوردة / المصدرة
                </label>
                <input
                  type="text"
                  value={formImporter}
                  onChange={(e) => setFormImporter(e.target.value)}
                  placeholder="مثال: شركة النيل للتصنيع الزراعي المحدودة"
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2 outline-none focus:border-[#000000]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-[500] text-[#71717a] mb-1">
                    رقم بوليصة الشحن (BOL)
                  </label>
                  <input
                    type="text"
                    value={formBol}
                    onChange={(e) => setFormBol(e.target.value)}
                    placeholder="MSK-9901823"
                    className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2 font-mono outline-none focus:border-[#000000]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-[500] text-[#71717a] mb-1">
                    رمز التعريفة الجمركية (HS Code)
                  </label>
                  <select
                    value={formHsCode}
                    onChange={(e) => setFormHsCode(e.target.value)}
                    className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2 font-mono outline-none focus:border-[#000000]"
                  >
                    <option value="3004.90.00">3004.90.00 (أدوية ومستلزمات طبية - 5%)</option>
                    <option value="8438.80.10">8438.80.10 (معدات مصانع وآلات زراعية - 10%)</option>
                    <option value="1006.30.00">1006.30.00 (حبوب ومواد غذائية أساسية - 5%)</option>
                    <option value="2710.19.21">2710.19.21 (مشتقات بترولية وزيوت صناعية - 20%)</option>
                    <option value="8704.22.00">8704.22.00 (شاحنات نقل ثقيل وقطع غيار - 10%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[12px] font-[500] text-[#71717a] mb-1">
                    قيمة الفاتورة ($)
                  </label>
                  <input
                    type="number"
                    value={formInvoiceVal}
                    onChange={(e) => setFormInvoiceVal(Number(e.target.value))}
                    className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2 font-mono outline-none focus:border-[#000000]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-[500] text-[#71717a] mb-1">
                    بلد المنشأ
                  </label>
                  <input
                    type="text"
                    value={formOrigin}
                    onChange={(e) => setFormOrigin(e.target.value)}
                    placeholder="Germany"
                    className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2 outline-none focus:border-[#000000]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-[500] text-[#71717a] mb-1">
                    منفذ الدخول
                  </label>
                  <select
                    value={formPort}
                    onChange={(e) => setFormPort(e.target.value)}
                    className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2 outline-none focus:border-[#000000]"
                  >
                    <option value="Port Sudan Terminal 1">ميناء بورتسودان (الرصيف 1)</option>
                    <option value="Port Sudan Terminal 2">ميناء بورتسودان (الرصيف 2)</option>
                    <option value="Ashkeet Border">معبر أشكيت (السودان - مصر)</option>
                    <option value="Gallabat Border">معبر القلابات (السودان - إثيوبيا)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-[500] text-[#71717a] mb-1">
                  بيان الحمولة وتفاصيل الأصناف
                </label>
                <textarea
                  value={formCargoDesc}
                  onChange={(e) => setFormCargoDesc(e.target.value)}
                  rows={3}
                  placeholder="أدخل توصيف الشحنة والأصناف المصرح عنها بالتفصيل..."
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] p-3 outline-none focus:border-[#000000]"
                  required
                />
              </div>

              <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2] flex items-center justify-between">
                <div>
                  <div className="font-[600] text-[13px] text-[#000000]">تقدير الرسوم الجمركية التلقائي</div>
                  <div className="text-[11px] text-[#000000]/70">حسب جدول التعريفة المعتمد</div>
                </div>
                <div className="font-mono font-[700] text-[18px] text-[#000000]">
                  ${calculateDuty(formInvoiceVal, formHsCode).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e4e4e7]">
                <button
                  type="button"
                  onClick={() => setIsNewDeclarationModalOpen(false)}
                  className="btn-shopify-outline"
                >
                  إلغاء
                </button>

                <button type="submit" className="btn-shopify-pill">
                  <FileCheck2 className="w-4 h-4" />
                  <span>تأكيد وتسجيل الإقرار الجمركي</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
