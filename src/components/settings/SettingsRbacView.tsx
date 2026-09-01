'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { UserRole } from '@/types';
import {
  ShieldCheck,
  Users,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Key,
  Radio,
  Lock,
  Globe,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { exportToCsv } from '@/lib/export-utils';
import { availableLanguages } from '@/lib/i18n';

interface RolePermission {
  key: string;
  labelAr: string;
  labelEn: string;
  description: string;
  allowedRoles: UserRole[];
}

const defaultPermissions: RolePermission[] = [
  {
    key: 'create_shipments',
    labelAr: 'إنشاء وحجز الشحنات',
    labelEn: 'Create & Book Freight',
    description: 'صلاحية فتح طلبات شحن فردية ودفعات مجمعة',
    allowedRoles: ['super_admin', 'shipper_customer', 'operations_manager'],
  },
  {
    key: 'dispatch_management',
    labelAr: 'إدارة التوزيع الذكي والإسناد',
    labelEn: 'Smart Dispatch & Asset Allocation',
    description: 'تخصيص الشاحنات والسائقين واعتماد المطابقات الخوارزمية',
    allowedRoles: ['super_admin', 'carrier_admin', 'dispatcher'],
  },
  {
    key: 'port_customs_clearance',
    labelAr: 'التخليص الجمركي وإفراج الحاويات',
    labelEn: 'Port & Customs Container Release',
    description: 'إصدار إذن التسليم الجمركي وتعديل حالات غرامات التأخير',
    allowedRoles: ['super_admin', 'customs_agent', 'operations_manager'],
  },
  {
    key: 'financial_settlement',
    labelAr: 'سداد الفواتير والتسويات المالية',
    labelEn: 'Invoice Settlement & Payouts',
    description: 'سداد المطالبات عبر EBS وشحن وتفريغ المحافظ',
    allowedRoles: ['super_admin', 'finance_manager', 'shipper_customer', 'carrier_admin'],
  },
  {
    key: 'claims_adjudication',
    labelAr: 'تسوية نزاعات الشحنات والتعويضات',
    labelEn: 'Claims Adjudication & Insurance',
    description: 'مراجعة أضرار الحمولات وصرف مبالغ التأمين السيادي',
    allowedRoles: ['super_admin', 'risk_auditor'],
  },
  {
    key: 'telemetry_tracking',
    labelAr: 'مراقبة التتبع الحي والتوأم الرقمي',
    labelEn: 'Live Telemetry & Digital Twin',
    description: 'الوصول لإحداثيات GPS المباشرة ومحاكاة السيناريوهات',
    allowedRoles: ['super_admin', 'shipper_customer', 'carrier_admin', 'driver', 'fleet_manager', 'customs_agent', 'operations_manager'],
  },
];

export function SettingsRbacView() {
  const { role, setRole, lang, setLang, resetToFactoryDefaults, showToast } = useApp();
  const [permissions, setPermissions] = useState<RolePermission[]>(defaultPermissions);
  const [activeTab, setActiveTab] = useState<'rbac' | 'preferences'>('rbac');

  // Preferences state
  const [gpsIntervalSec, setGpsIntervalSec] = useState(4);
  const [autoDispatchThreshold, setAutoDispatchThreshold] = useState(85);
  const [enableSoundFx, setEnableSoundFx] = useState(true);
  const [apiKey, setApiKey] = useState('sdn_live_sec_89f3a129e7b23c91');

  const allRoles: { id: UserRole; nameAr: string; nameEn: string; desc: string }[] = [
    { id: 'super_admin', nameAr: 'مدير المنصة التنفيذي', nameEn: 'Super Platform Admin', desc: 'تحكم وصلاحيات شاملة 100%' },
    { id: 'operations_manager', nameAr: 'مدير العمليات اللوجستية', nameEn: 'Operations Manager', desc: 'إشراف على النقل والمستودعات' },
    { id: 'dispatcher', nameAr: 'منسق الشحنات والتوجيه الذكي', nameEn: 'Freight Dispatcher', desc: 'تخصيص الشاحنات والمطابقات' },
    { id: 'fleet_manager', nameAr: 'مدير أسطول المركبات', nameEn: 'Fleet Manager', desc: 'الصيانة والتيليماتري والسائقين' },
    { id: 'warehouse_manager', nameAr: 'مدير المستودعات والتخزين WMS', nameEn: 'Warehouse Director', desc: 'إدارة المخزون وحجوزات الساحات' },
    { id: 'customs_officer', nameAr: 'ضابط الجمارك والموانئ', nameEn: 'Customs Officer', desc: 'اعتماد الإفراج الجمركي وفحص الحاويات' },
    { id: 'customs_agent', nameAr: 'مخلص جمركي معتمد', nameEn: 'Customs Broker', desc: 'تسجيل الإقرارات وحساب الرسوم' },
    { id: 'finance_manager', nameAr: 'المدير المالي والتسويات', nameEn: 'Finance Manager', desc: 'الفواتير والمدفوعات والمحافظ' },
    { id: 'support_agent', nameAr: 'أخصائي الدعم وخدمة العملاء', nameEn: 'Customer Support Agent', desc: 'إدارة التذاكر وحل الاستفسارات' },
    { id: 'driver', nameAr: 'سائق شاحنة معتمد', nameEn: 'Certified Truck Driver', desc: 'تطبيق السائق وتأكيد الوصول POD' },
    { id: 'carrier_admin', nameAr: 'بوابة الناقل المعتمد', nameEn: 'Carrier Partner Admin', desc: 'قبول الشحنات وإسناد المركبات' },
    { id: 'corporate_customer', nameAr: 'عميل شركات ومؤسسات (Enterprise)', nameEn: 'Corporate Enterprise Customer', desc: 'حساب مؤسسي متعدد الفروع وعقود خاصة' },
    { id: 'individual_customer', nameAr: 'عميل فردي (Individual Shipper)', nameEn: 'Individual Customer', desc: 'شحن شخصي فوري ودفع إلكتروني' },
    { id: 'risk_auditor', nameAr: 'مسؤول المخاطر والامتثال', nameEn: 'Risk & Compliance Auditor', desc: 'تسوية النزاعات والتأمين الشامل' },
  ];

  const handleTogglePermission = (permKey: string, targetRole: UserRole) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.key !== permKey) return p;
        const exists = p.allowedRoles.includes(targetRole);
        const newRoles = exists
          ? p.allowedRoles.filter((r) => r !== targetRole)
          : [...p.allowedRoles, targetRole];
        return { ...p, allowedRoles: newRoles };
      })
    );
    showToast(
      lang === 'ar' ? 'تم تحديث مصفوفة الصلاحيات' : 'Permission Updated',
      lang === 'ar' ? `تم تحديث صلاحية (${permKey}) للدور: ${targetRole}` : `Updated ${permKey} for ${targetRole}`,
      'info'
    );
  };

  const handleExportRbacCsv = () => {
    const auditData = permissions.map((p) => ({
      permission: p.labelEn,
      permissionAr: p.labelAr,
      roles: p.allowedRoles.join(', '),
      status: 'Enforced',
      timestamp: new Date().toISOString(),
    }));

    exportToCsv('sudaneel-rbac-audit-ledger', [
      { header: 'Permission Name (AR)', accessor: (d) => d.permissionAr },
      { header: 'Permission Name (EN)', accessor: (d) => d.permission },
      { header: 'Authorized Roles', accessor: (d) => d.roles },
      { header: 'Compliance Status', accessor: (d) => d.status },
      { header: 'Audit Timestamp', accessor: (d) => d.timestamp },
    ], auditData);

    showToast(
      lang === 'ar' ? 'تم تصدير سجل التدقيق' : 'Audit Log Exported',
      lang === 'ar' ? 'تم تنزيل ملف CSV موثق يحتوي مصفوفة الصلاحيات بالكامل' : 'Downloaded RBAC audit CSV successfully',
      'success'
    );
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="shopify-tag-mint">
            <ShieldCheck className="w-4 h-4" />
            <span>Enterprise Governance • إدارة الصلاحيات وإعدادات المنظومة</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            مصفوفة الصلاحيات وإعدادات النظام (RBAC & System Controls)
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            تخصيص أدوار المستخدمين السبعة، مصفوفة الصلاحيات، فترات بث الـ GPS، والتحكم بمفاتيح الربط البرمجي.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-5 py-2 rounded-full text-[13px] font-[500] transition-all duration-200 cursor-pointer ${
              activeTab === 'rbac' ? 'bg-[#000000] text-white shadow-sm' : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
            }`}
          >
            مصفوفة الصلاحيات (RBAC)
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-5 py-2 rounded-full text-[13px] font-[500] transition-all duration-200 cursor-pointer ${
              activeTab === 'preferences' ? 'bg-[#000000] text-white shadow-sm' : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
            }`}
          >
            إعدادات التشغيل والمفاتيح
          </button>
        </div>
      </div>

      {/* Tab 1: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          {/* Quick Role Simulator */}
          <div className="p-8 shopify-card bg-[#ffffff] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
              <div>
                <h3 className="font-[600] text-[16px] text-[#000000]">
                  محاكي تبديل الدور الحالي للمنصة
                </h3>
                <p className="text-[13px] text-[#71717a]">
                  اختر الدور لاختبار تجربة المستخدم وصلاحيات الشاشات فورياً
                </p>
              </div>

              <span className="shopify-tag-mint font-mono font-[600]">
                Active: {role.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {allRoles.map((r) => {
                const isActive = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRole(r.id);
                      showToast(
                        lang === 'ar' ? 'تم تغيير الدور التشغيلي' : 'Active Role Switched',
                        lang === 'ar' ? `أنت الآن تعمل بصلاحيات: ${r.nameAr}` : `Now acting as: ${r.nameEn}`,
                        'info'
                      );
                    }}
                    className={`p-4 rounded-[12px] text-start transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'shopify-card-aloe shadow-[0_8px_16px_rgba(193,251,212,0.4)]'
                        : 'shopify-card hover:border-[#a1a1aa]'
                    }`}
                  >
                    <div className="font-[600] text-[14px] text-[#000000]">{lang === 'ar' ? r.nameAr : r.nameEn}</div>
                    <div className="text-[11.5px] text-[#71717a] mt-1 line-clamp-2">{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular RBAC Permissions Table */}
          <div className="shopify-card overflow-hidden bg-[#ffffff]">
            <div className="p-6 border-b border-[#e4e4e7] flex items-center justify-between">
              <div>
                <h3 className="font-[600] text-[16px] text-[#000000]">
                  مصفوفة التحكم بالوصول (Access Control Matrix)
                </h3>
                <p className="text-[13px] text-[#71717a]">
                  انقر على المربعات لتفعيل أو تعطيل الصلاحية لكل دور بشكل فوري
                </p>
              </div>

              <button
                onClick={handleExportRbacCsv}
                className="btn-shopify-outline !py-1.5 !px-3.5 text-[12px]"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>تصدير تقرير التدقيق CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-[13px]">
                <thead>
                  <tr className="border-b border-[#e4e4e7] bg-[#fbfbf5] text-[#71717a] text-[12px]">
                    <th className="p-4 text-start font-[600]">الصلاحية والعملية</th>
                    {allRoles.slice(0, 6).map((r) => (
                      <th key={r.id} className="p-4 text-center font-[600]">
                        {lang === 'ar' ? r.nameAr.split(' ')[0] : r.nameEn.split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e4e4e7]">
                  {permissions.map((perm) => (
                    <tr key={perm.key} className="hover:bg-[#fbfbf5] transition-colors">
                      <td className="p-4">
                        <div className="font-[600] text-[#000000]">{lang === 'ar' ? perm.labelAr : perm.labelEn}</div>
                        <div className="text-[11.5px] text-[#71717a]">{perm.description}</div>
                      </td>
                      {allRoles.slice(0, 6).map((r) => {
                        const isChecked = perm.allowedRoles.includes(r.id);
                        return (
                          <td key={r.id} className="p-4 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePermission(perm.key, r.id)}
                              className="w-4 h-4 accent-[#000000] cursor-pointer rounded"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: System Preferences & Keys */}
      {activeTab === 'preferences' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Telemetry & Dispatch Tuning */}
          <div className="p-8 shopify-card bg-[#ffffff] space-y-5">
            <h3 className="font-[600] text-[16px] text-[#000000] pb-3 border-b border-[#e4e4e7]">
              إعدادات المحرك والتيليماتري
            </h3>

            <div className="space-y-4 text-[13.5px]">
              <div>
                <label className="text-[#71717a] flex justify-between mb-1.5 font-[500]">
                  <span>فترة تحديث إحداثيات GPS الحية:</span>
                  <span className="font-mono font-[700] text-[#000000] bg-[#c1fbd4] px-2 py-0.5 rounded-full">{gpsIntervalSec} ثوانٍ</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={gpsIntervalSec}
                  onChange={(e) => setGpsIntervalSec(Number(e.target.value))}
                  className="w-full accent-[#000000] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[#71717a] flex justify-between mb-1.5 font-[500]">
                  <span>الحد الأدنى لدرجة التوزيع الآلي الذكي:</span>
                  <span className="font-mono font-[700] text-[#000000] bg-[#c1fbd4] px-2 py-0.5 rounded-full">{autoDispatchThreshold}% Match</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={autoDispatchThreshold}
                  onChange={(e) => setAutoDispatchThreshold(Number(e.target.value))}
                  className="w-full accent-[#000000] cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-[#e4e4e7] flex items-center justify-between">
                <div>
                  <div className="font-[600] text-[#000000]">المؤثرات الصوتية والتنبيهات الحية</div>
                  <div className="text-[12px] text-[#71717a]">تنبيه عند اقتراب شاحنة أو فتح بلاغ طارئ</div>
                </div>
                <input
                  type="checkbox"
                  checked={enableSoundFx}
                  onChange={(e) => setEnableSoundFx(e.target.checked)}
                  className="w-5 h-5 accent-[#000000] cursor-pointer rounded"
                />
              </div>

              <div className="pt-3 border-t border-[#e4e4e7] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-[600] text-[#000000]">لغة واجهة المنصة (14 لغة معتمدة)</div>
                  <Globe className="w-4 h-4 text-[#71717a]" />
                </div>
                <select
                  value={lang}
                  onChange={(e) => {
                    const newLang = e.target.value as any;
                    setLang(newLang);
                    const opt = availableLanguages.find((l) => l.code === newLang);
                    showToast('تم تغيير لغة المنصة', `اللغة النشطة الآن: ${opt?.flag} ${opt?.nativeName}`, 'success');
                  }}
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] p-2.5 rounded-[8px] text-[13px] font-[500] cursor-pointer outline-none"
                >
                  {availableLanguages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.nativeName} — {l.name} ({l.code.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* API Security & Factory Reset */}
          <div className="p-8 shopify-card bg-[#ffffff] space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-[600] text-[16px] text-[#000000] pb-3 border-b border-[#e4e4e7]">
                مفاتيح الربط والبيانات
              </h3>

              <div className="space-y-3 text-[13px]">
                <div>
                  <label className="text-[#71717a] block mb-1 font-[500]">مفتاح الربط البرمجي (Webhook Secret)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      readOnly
                      className="w-full bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] font-mono p-2.5 rounded-[8px] text-[13px]"
                    />
                    <button
                      onClick={() => {
                        setApiKey(`sdn_live_sec_${Math.random().toString(36).slice(2, 12)}`);
                        showToast('تم تجديد المفتاح البرمجي', 'تم إصدار مفتاح API سري جديد للمنظومة بنجاح', 'success');
                      }}
                      className="btn-shopify-outline !py-2 !px-4 text-[12px] whitespace-nowrap"
                    >
                      تجديد
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Factory Reset Action */}
            <div className="p-5 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-3">
              <div className="flex items-center gap-2 text-[#000000] font-[600] text-[14px]">
                <RotateCcw className="w-4 h-4" />
                <span>استعادة البيانات الافتراضية (Factory Reset)</span>
              </div>
              <p className="text-[12px] text-[#71717a]">
                إعادة ضبط جميع الشحنات والفواتير وحجوزات المستودعات والمطالبات إلى بيانات المصنع الأولية وتفريغ التخزين المحلي.
              </p>
              <button
                onClick={() => {
                  if (confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك في استعادة بيانات المصنع الافتراضية؟' : 'Are you sure you want to reset all data to default mock state?')) {
                    resetToFactoryDefaults();
                  }
                }}
                className="btn-shopify-pill w-full !py-2 text-[12.5px]"
              >
                تأكيد إعادة الضبط لقيم المصنع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
