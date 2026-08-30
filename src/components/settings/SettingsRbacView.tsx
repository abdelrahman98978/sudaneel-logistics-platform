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
} from 'lucide-react';
import { exportToCsv } from '@/lib/export-utils';

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

  const [activeTab, setActiveTab] = useState<'rbac' | 'preferences' | 'audit_log'>('rbac');
  const [permissions, setPermissions] = useState<RolePermission[]>(defaultPermissions);

  // Preference Settings
  const [gpsIntervalSec, setGpsIntervalSec] = useState(4);
  const [autoDispatchThreshold, setAutoDispatchThreshold] = useState(85);
  const [enableSoundFx, setEnableSoundFx] = useState(true);
  const [apiKey, setApiKey] = useState('sdn_live_sec_994827104928471204');

  const allRoles: { id: UserRole; nameAr: string; nameEn: string; desc: string }[] = [
    { id: 'super_admin', nameAr: 'المشرف العام (Super Admin)', nameEn: 'Super Administrator', desc: 'كامل الصلاحيات السيادية والمالية والتشغيلية' },
    { id: 'shipper_customer', nameAr: 'الشاحن والشركات (Shipper)', nameEn: 'Enterprise Shipper', desc: 'إنشاء الشحنات، حجز المستودعات، وتتبع الحمولات' },
    { id: 'carrier_admin', nameAr: 'الناقل وأصحاب الأساطيل (Carrier)', nameEn: 'Fleet Carrier', desc: 'إدارة الشاحنات، مطابقة العودة الفارغة، وسحب الأرباح' },
    { id: 'driver', nameAr: 'السائق (Driver App)', nameEn: 'Fleet Driver', desc: 'تحديث مسار الرحلة، إثبات التسليم POD، وشاشة الأمان' },
    { id: 'warehouse_manager', nameAr: 'مدير المستودعات (Warehouse)', nameEn: 'Warehouse Terminal Manager', desc: 'إدارة مساحات التخزين والمخزون والتفريغ' },
    { id: 'customs_agent', nameAr: 'ضابط الجمارك (Customs Agent)', nameEn: 'Sovereign Customs Authority', desc: 'التدقيق الإجرائي والإفراج الجمركي الموثق' },
    { id: 'operations_manager', nameAr: 'مدير العمليات (Ops Manager)', nameEn: 'Logistics Operations Director', desc: 'مراقبة برج التحكم والممرات ومعدلات OTD' },
  ];

  const togglePermission = (permKey: string, roleId: UserRole) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.key === permKey) {
          const exists = p.allowedRoles.includes(roleId);
          const updated = exists
            ? p.allowedRoles.filter((r) => r !== roleId)
            : [...p.allowedRoles, roleId];
          return { ...p, allowedRoles: updated };
        }
        return p;
      })
    );
    showToast(
      lang === 'ar' ? 'تم تحديث مصفوفة الصلاحيات' : 'Permission Matrix Updated',
      lang === 'ar' ? `تم تعديل إذن [${permKey}] للدور [${roleId}]` : `Updated [${permKey}] for [${roleId}]`,
      'success'
    );
  };

  const handleExportAudit = () => {
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
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'إدارة الصلاحيات وإعدادات المنظومة (RBAC & System Controls)' : 'Platform Settings & Access Control Matrix (RBAC)'}
            </h2>
          </div>
          <p className="text-[13px] font-[400] text-[#5C5E62] max-w-2xl mt-1">
            {lang === 'ar'
              ? 'تخصيص أدوار المستخدمين السبعة، مصفوفة الصلاحيات، فترات بث الـ GPS، والتحكم بمفاتيح الربط البرمجي.'
              : 'Configure 7 user roles, granular permission matrices, telemetry intervals, and security audit keys.'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-3.5 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'rbac' ? 'bg-[#171A20] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4]'
            }`}
          >
            {lang === 'ar' ? 'مصفوفة الصلاحيات (RBAC)' : 'Roles & Permissions'}
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3.5 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'preferences' ? 'bg-[#3E6AE1] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4]'
            }`}
          >
            {lang === 'ar' ? 'إعدادات التشغيل' : 'System Engine'}
          </button>
        </div>
      </div>

      {/* Tab 1: RBAC Matrix */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          {/* Quick Role Simulator */}
          <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
              <div>
                <h3 className="font-[500] text-[15px] text-[#171A20]">
                  {lang === 'ar' ? 'محاكي تبديل الدور الحالي للمنصة' : 'Active Workspace Role Simulator'}
                </h3>
                <p className="text-[12px] text-[#5C5E62]">
                  {lang === 'ar' ? 'اختر الدور لاختبار تجربة المستخدم وصلاحيات الشاشات فورياً' : 'Switch your active role to simulate permissions live'}
                </p>
              </div>

              <span className="text-[12px] font-mono px-2.5 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#3E6AE1] border border-[#3E6AE1] font-[500]">
                Current Role: {role.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    className={`p-3.5 rounded-[4px] text-start border transition-colors duration-330 cursor-pointer ${
                      isActive
                        ? 'bg-[#F4F4F4] border-[#171A20]'
                        : 'bg-white border-[#EEEEEE] hover:bg-[#F4F4F4]'
                    }`}
                  >
                    <div className="font-[500] text-[13px] text-[#171A20]">{lang === 'ar' ? r.nameAr : r.nameEn}</div>
                    <div className="text-[11px] text-[#5C5E62] mt-1 line-clamp-2">{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Granular Permission Matrix Table */}
          <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
              <div>
                <h3 className="font-[500] text-[15px] text-[#171A20]">
                  {lang === 'ar' ? 'جدول الصلاحيات الدقيقة لكل دور' : 'Granular Permissions Governance Matrix'}
                </h3>
                <p className="text-[12px] text-[#5C5E62]">
                  {lang === 'ar' ? 'انقر على المربعات لمنح أو حظر الصلاحيات لكل دور' : 'Click checkboxes to grant or revoke specific privileges'}
                </p>
              </div>

              <button
                onClick={handleExportAudit}
                className="btn-tesla-secondary !min-h-[34px] !py-1 !px-3 text-[12px] flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#3E6AE1]" />
                <span>{lang === 'ar' ? 'تصدير تدقيق الصلاحيات (CSV)' : 'Export RBAC Audit'}</span>
              </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-start text-[13px]">
                <thead>
                  <tr className="bg-[#F4F4F4] text-[#5C5E62] font-[500] text-[11px] uppercase border-b border-[#EEEEEE]">
                    <th className="p-3 text-start">الوظيفة / الصلاحية</th>
                    {allRoles.map((r) => (
                      <th key={r.id} className="p-3 text-center">
                        {r.id.replace('_', ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEEEE]">
                  {permissions.map((perm) => (
                    <tr key={perm.key} className="hover:bg-[#F4F4F4] transition-colors duration-330">
                      <td className="p-3">
                        <div className="font-[500] text-[#171A20]">{lang === 'ar' ? perm.labelAr : perm.labelEn}</div>
                        <div className="text-[11px] text-[#5C5E62]">{perm.description}</div>
                      </td>
                      {allRoles.map((r) => {
                        const isGranted = perm.allowedRoles.includes(r.id);
                        return (
                          <td key={r.id} className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={isGranted}
                              onChange={() => togglePermission(perm.key, r.id)}
                              className="w-4 h-4 accent-[#3E6AE1] cursor-pointer rounded-[2px]"
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

      {/* Tab 2: Preferences & Engine Control */}
      {activeTab === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Telemetry & Algorithm Tuning */}
          <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
            <h3 className="font-[500] text-[15px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
              <Sliders className="w-4 h-4 text-[#3E6AE1]" />
              <span>{lang === 'ar' ? 'معايير محرك التوزيع والتتبع الحي' : 'Engine & Telemetry Parameters'}</span>
            </h3>

            <div className="space-y-4 text-[13px]">
              <div>
                <label className="text-[#5C5E62] flex justify-between mb-1">
                  <span>فترة تحديث إحداثيات GPS الحية:</span>
                  <span className="font-mono font-[500] text-[#3E6AE1]">{gpsIntervalSec} ثوانٍ</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={gpsIntervalSec}
                  onChange={(e) => setGpsIntervalSec(Number(e.target.value))}
                  className="w-full accent-[#3E6AE1] cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[#5C5E62] flex justify-between mb-1">
                  <span>الحد الأدنى لدرجة التوزيع الآلي الذكي:</span>
                  <span className="font-mono font-[500] text-[#3E6AE1]">{autoDispatchThreshold}% Match Score</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="98"
                  value={autoDispatchThreshold}
                  onChange={(e) => setAutoDispatchThreshold(Number(e.target.value))}
                  className="w-full accent-[#3E6AE1] cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-[#EEEEEE] flex items-center justify-between">
                <div>
                  <div className="font-[500] text-[#171A20]">المؤثرات الصوتية والتنبيهات الحية</div>
                  <div className="text-[11px] text-[#5C5E62]">تنبيه عند اقتراب شاحنة أو فتح بلاغ طارئ</div>
                </div>
                <input
                  type="checkbox"
                  checked={enableSoundFx}
                  onChange={(e) => setEnableSoundFx(e.target.checked)}
                  className="w-4 h-4 accent-[#3E6AE1] cursor-pointer rounded-[2px]"
                />
              </div>
            </div>
          </div>

          {/* API Security & Factory Reset */}
          <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-[500] text-[15px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
                <Key className="w-4 h-4 text-[#3E6AE1]" />
                <span>{lang === 'ar' ? 'مفاتيح الربط والبيانات التجريبية' : 'Security Keys & Factory Reset'}</span>
              </h3>

              <div className="space-y-3 mt-3 text-[13px]">
                <div>
                  <label className="text-[#5C5E62] block mb-1">مفتاح الربط البرمجي (Sovereign API Webhook Secret)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={apiKey}
                      readOnly
                      className="w-full bg-[#F4F4F4] border border-[#D0D1D2] text-[#171A20] font-mono p-2 rounded-[4px] text-[12px]"
                    />
                    <button
                      onClick={() => {
                        setApiKey(`sdn_live_sec_${Math.random().toString(36).slice(2, 12)}`);
                        showToast('تم تجديد المفتاح البرمجي', 'تم إصدار مفتاح API سري جديد للمنظومة بنجاح', 'success');
                      }}
                      className="btn-tesla-secondary !min-h-[36px] !py-1 !px-3 text-[12px] whitespace-nowrap"
                    >
                      تجديد
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Factory Reset Action */}
            <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2">
              <div className="flex items-center gap-2 text-[#171A20] font-[500] text-[13px]">
                <RotateCcw className="w-4 h-4 text-[#3E6AE1]" />
                <span>استعادة البيانات الافتراضية (Factory Reset)</span>
              </div>
              <p className="text-[12px] text-[#5C5E62]">
                إعادة ضبط جميع الشحنات والفواتير وحجوزات المستودعات والمطالبات إلى بيانات المصنع الأولية وتفريغ التخزين المحلي.
              </p>
              <button
                onClick={() => {
                  if (confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك في استعادة بيانات المصنع الافتراضية؟' : 'Are you sure you want to reset all data to default mock state?')) {
                    resetToFactoryDefaults();
                  }
                }}
                className="btn-tesla-secondary w-full !min-h-[34px] text-[12px]"
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
