'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  X,
  Truck,
  Anchor,
  Warehouse,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  DollarSign,
  CheckCircle2,
  Check,
  Zap,
} from 'lucide-react';

export type PublicServiceType =
  | 'road_freight'
  | 'sea_freight'
  | 'warehousing'
  | 'customs'
  | 'enterprise'
  | 'network'
  | 'about'
  | 'contact';

interface PublicServiceModalProps {
  serviceType: PublicServiceType | null;
  onClose: () => void;
}

export function PublicServiceModal({ serviceType, onClose }: PublicServiceModalProps) {
  const { lang, setCurrentView } = useApp();
  const [cargoWeightInput, setCargoWeightInput] = useState(25);
  const [serviceTier, setServiceTier] = useState<'standard' | 'express'>('standard');

  if (!serviceType) return null;

  const getServiceData = () => {
    switch (serviceType) {
      case 'road_freight':
        return {
          badge: 'Heavy & Express Road Logistics',
          titleAr: 'خدمات النقل البري والشاحنات الثقيلة',
          titleEn: 'National Heavy & Express Road Freight',
          image: '/images/fleet-desert-road-v2.png',
          descAr:
            'شبكة نقل بري سيادية تغطي كافة ولايات وممرات السودان بأسطول شاحنات حديث Euro 5/6، يشمل شاحنات الحاويات، السطحات، ناقلات الوقود، وثلاجات التبريد النشط، مع تتبع GPS عبر الأقمار الاصطناعي كل 4 ثوانٍ.',
          descEn:
            'Sovereign road transport covering all Sudanese national corridors with Euro 5/6 certified fleets, active reefer trailers, and 4-second satellite telemetry.',
          specs: [
            { labelAr: 'زمن النقل (الخرطوم - بورتسودان)', labelEn: 'Transit Time', val: '24–36 ساعة' },
            { labelAr: 'القدرة الاستيعابية للرحلة', labelEn: 'Payload Capacity', val: 'حتى 60 طن متري' },
            { labelAr: 'التتبع اللحظي', labelEn: 'Telemetry', val: 'GPS + قفل إلكتروني للأختام' },
            { labelAr: 'التأمين الشامل', labelEn: 'Cargo Insurance', val: 'تغطية 100% ضد المخاطر' },
          ],
          basePriceSd: '2,400 SDG / كم',
        };
      case 'sea_freight':
        return {
          badge: 'Maritime Gateway • Port Sudan',
          titleAr: 'النقل البحري ومحطة حاويات بورتسودان (SCT)',
          titleEn: 'Maritime Freight & Port Sudan Terminal',
          image: '/images/port-sudan-terminal-v2.png',
          descAr:
            'إدارة سلاسل الإمداد البحرية وحجز الحاويات (FCL & LCL) عبر ميناء بورتسودان، مع خطوط شحن مباشرة لدول الخليج، آسيا، وأوروبا، وتفريغ فوري لمنع غرامات التأخير (Demurrage Avoidance).',
          descEn:
            'End-to-end maritime container logistics through Port Sudan Container Terminal with direct shipping lines and proactive demurrage mitigation.',
          specs: [
            { labelAr: 'أنواع الحاويات', labelEn: 'Container Specs', val: "20' & 40' Dry / High Cube / Reefer" },
            { labelAr: 'التخليص والربط', labelEn: 'Clearance Lead', val: 'سحب فوري خلال 12 ساعة' },
            { labelAr: 'ربط مباشر بالبحر الأحمر', labelEn: 'Port Hub', val: 'رصيف الحاويات الجنوبي والشمالي' },
            { labelAr: 'منع غرامات الأرضيات', labelEn: 'Demurrage', val: 'نظام حماية وتفريغ ذكي' },
          ],
          basePriceSd: 'حسب نوع الحاوية والخط الملاحي',
        };
      case 'warehousing':
        return {
          badge: 'Smart WMS & Active Cold Storage',
          titleAr: 'المستودعات الذكية وسلاسل التبريد المتطورة',
          titleEn: 'Smart Warehousing & Cold Chain Network',
          image: '/images/warehouse-cold-chain-v2.png',
          descAr:
            'طاقة تخزينية استراتيجية تتجاوز 120,000 طن متري موزعة في بورتسودan، الخرطوم، عطبرة، وكوستي، مجهزة بنظام WMS ذكي وغرف تبريد عملاقة مع مراقبة درجات الحرارة لحظياً للمنتجات الصيدلانية والغذائية.',
          descEn:
            'Over 120,000 MT of temperature-controlled and bonded dry warehousing equipped with real-time temperature telemetry for pharmaceuticals and perishables.',
          specs: [
            { labelAr: 'نطاق درجات الحرارة', labelEn: 'Temp Range', val: '-25°C إلى +18°C' },
            { labelAr: 'إدارة المخزون', labelEn: 'Inventory Method', val: 'نظام FIFO / FEFO مدعوم بالباركود' },
            { labelAr: 'الأمان والمراقبة', labelEn: 'Security', val: 'كاميرات حرارية وحراسة 24/7' },
            { labelAr: 'أرصفة الشحن والتفريغ', labelEn: 'Loading Docks', val: 'أرصفة هيدروليكية مبردة' },
          ],
          basePriceSd: '45,000 SDG / طن / يوم',
        };
      case 'customs':
        return {
          badge: 'Direct Customs Clearance OS',
          titleAr: 'التخليص الجمركي والمعابر الحدودية الدولية',
          titleEn: 'Digital Customs & Cross-Border Corridors',
          image: '/images/cross-border-v2.png',
          descAr:
            'ربط رقمي مباشر مع جمارك بورتسودان والمعابر البرية (القضارف - القلابات مع إثيوبيا، ووادي حلفا - أرقين مع مصر)، مع تصنيف آلي للرموز الجمركية (HS Code) وإصدار شهادات الإفراج الرقمية.',
          descEn:
            'Automated customs documentation, HS code classification engine, and cross-border logistics clearing terminals with Egypt and Ethiopia.',
          specs: [
            { labelAr: 'المعابر المغطاة', labelEn: 'Border Stations', val: 'بورتسودان، أرقين، أشكيت، القلابات' },
            { labelAr: 'سرعة الإفراج', labelEn: 'Clearance Speed', val: 'خلال 4 إلى 8 ساعات عمل' },
            { labelAr: 'الشهادات المعتمدة', labelEn: 'Certificates', val: 'شهادة منشأ، فحص مواصفات، e-BOL' },
            { labelAr: 'إيداع المستندات', labelEn: 'Digital Portal', val: 'أرشفة سحابية مشفرة 100%' },
          ],
          basePriceSd: '250,000 SDG للشهادة الواحدة',
        };
      case 'enterprise':
        return {
          badge: 'Enterprise Supply Chain Infrastructure',
          titleAr: 'حلول كبار الشركات والمصانع والمنظمات',
          titleEn: 'Enterprise Logistics & 4PL Solutions',
          image: '/images/hq-facility-v2.png',
          descAr:
            'برامج لوجستية مخصصة للشركات الصناعية ومنظمات الإغاثة الدولية تشمل أسطولاً مخصصاً، ومدير حساب لوجستي متخصص، وتقارير أداء دورية (SLA)، وتسويات مالية شهرية ميسرة بفواتير إلكترونية معتمدة.',
          descEn:
            'Dedicated 4PL contract logistics, custom dedicated fleets, dedicated operations account managers, and corporate credit ledger accounts for NGOs and FMCG leaders.',
          specs: [
            { labelAr: 'نوع التعاقد', labelEn: 'Contract Structure', val: 'عقود سنوية مع مؤشرات SLA ملزمة' },
            { labelAr: 'شروط الدفع', labelEn: 'Credit Terms', val: 'دفع آجل 30 إلى 60 يوماً' },
            { labelAr: 'تكامل الأنظمة', labelEn: 'API Integration', val: 'ربط مباشر مع SAP و Oracle' },
            { labelAr: 'مدير حساب مخصص', labelEn: 'Key Account Exec', val: 'فريق عمليات مخصص 24/7' },
          ],
          basePriceSd: 'حسب متطلبات العقد والمؤشرات',
        };
      default:
        return {
          badge: 'National Sovereign Logistics',
          titleAr: 'شبكة سودانيل اللوجستية المتكاملة',
          titleEn: 'Sudaneel National Network',
          image: '/images/hero-multimodal-v2.png',
          descAr:
            'منظومة النقل واللوجستيات الرقمية الوطنية الموحدة في السودان، تربط الموانئ بالمطارات ومراكز الإنتاج الزراعي والصناعي.',
          descEn:
            'Sudan’s national unified logistics operating system connecting maritime gateways, manufacturing centers, and regional borders.',
          specs: [
            { labelAr: 'الولايات المغطاة', labelEn: 'Coverage', val: '18 ولاية سودانية بالكامل' },
            { labelAr: 'أسطول النقل', labelEn: 'Fleet Size', val: '+500 شاحنة وناقلة' },
            { labelAr: 'المستودعات', labelEn: 'Warehouses', val: '10 محطات استراتيجية' },
            { labelAr: 'التوافق المعياري', labelEn: 'Compliance', val: 'ISO 9001 & GDP Pharma' },
          ],
          basePriceSd: 'حسب المسار والخدمة',
        };
    }
  };

  const data = getServiceData();

  const handleBookService = () => {
    onClose();
    setCurrentView('create_shipment');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="relative w-full max-w-2xl bg-white border border-[#e4e4e7] rounded-[16px] overflow-hidden shadow-2xl my-8">
        {/* Header Visual with Image Cover */}
        <div
          className="relative h-[220px] sm:h-[260px] bg-cover bg-center"
          style={{ backgroundImage: `url('${data.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md cursor-pointer transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge & Title */}
          <div className="absolute bottom-5 start-6 end-6 text-white space-y-1.5">
            <span className="text-[11px] font-mono font-[600] px-2.5 py-1 rounded bg-white/20 backdrop-blur-md inline-block">
              {data.badge}
            </span>
            <h2 className="text-[22px] sm:text-[26px] font-[700] leading-tight">
              {lang === 'ar' ? data.titleAr : data.titleEn}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Detailed Narrative */}
          <p className="text-[14.5px] text-[#374151] leading-relaxed">
            {lang === 'ar' ? data.descAr : data.descEn}
          </p>

          {/* Key Specifications Grid */}
          <div className="space-y-2">
            <h3 className="text-[12px] font-[700] text-[#71717a] uppercase tracking-wider">
              {lang === 'ar' ? 'المواصفات والمعايير التشغيلية المعتمدة' : 'Operational Specifications & SLAs'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.specs.map((spec, i) => (
                <div key={i} className="p-3.5 rounded-[10px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-1">
                  <div className="text-[11.5px] text-[#71717a]">
                    {lang === 'ar' ? spec.labelAr : spec.labelEn}
                  </div>
                  <div className="text-[14px] font-[700] text-[#000000]">{spec.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Quote Interactive Estimator */}
          <div className="p-5 rounded-[12px] bg-[#f0fdf4] border border-[#bbf7d0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-[700] text-[#166534] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#059669]" />
                <span>{lang === 'ar' ? 'حاسبة التكلفة التقديرية الفورية' : 'Instant Budget Estimator'}</span>
              </span>
              <span className="text-[12px] font-mono text-[#166534] font-[600]">{data.basePriceSd}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[13px] text-[#374151]">
                <span>{lang === 'ar' ? 'الوزن التقريبي للحمولة:' : 'Estimated Weight:'}</span>
                <span className="font-[700] font-mono text-[#000000]">{cargoWeightInput} {lang === 'ar' ? 'طن متري' : 'MT'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={cargoWeightInput}
                onChange={(e) => setCargoWeightInput(Number(e.target.value))}
                className="w-full accent-[#059669] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-5 bg-[#fafafa] border-t border-[#e4e4e7] flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-[8px] border border-[#e4e4e7] text-[13.5px] font-[600] text-[#71717a] hover:bg-white hover:text-[#000000] cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>

          <button
            onClick={handleBookService}
            className="px-6 py-2.5 rounded-[8px] bg-[#000000] hover:bg-[#27272a] text-white text-[13.5px] font-[700] flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>{lang === 'ar' ? 'طلب هذه الخدمة الآن' : 'Book This Service'}</span>
            <ArrowRight className="w-4 h-4 text-[#c1fbd4]" />
          </button>
        </div>
      </div>
    </div>
  );
}
