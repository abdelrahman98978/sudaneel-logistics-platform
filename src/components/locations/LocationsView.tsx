'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  MapPin,
  Building2,
  Truck,
  Ship,
  Warehouse,
  ShieldCheck,
  Phone,
  Mail,
  Navigation,
  Globe,
  CheckCircle2,
  ExternalLink,
  Layers,
  Search,
} from 'lucide-react';

interface CityHub {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  detail: string;
  capacityM2: string;
  activeTrucks: number;
  customsOfficer: string;
  status: 'operational' | 'busy' | 'restricted';
  x: number; // Percentage on map
  y: number;
  connections: string[];
}

const cityHubs: CityHub[] = [
  {
    id: 'krt',
    name: 'الخرطوم — المركز اللوجستي الرئيسي',
    nameEn: 'Khartoum Central Hub',
    role: 'المقر الرئيسي + مركز العمليات المتقدم',
    detail: 'مستودع جاف ومبرد بمساحة 10,000 م² + ساحة شاحنات تتسع لـ 120 مقطورة.',
    capacityM2: '10,000 م²',
    activeTrucks: 84,
    customsOfficer: 'العقيد/ محمد الفاتح',
    status: 'operational',
    x: 52,
    y: 52,
    connections: ['psu', 'kassala', 'medani', 'atbara', 'elobeid'],
  },
  {
    id: 'psu',
    name: 'بورتسودان — الميناء البحري ومحطة الحاويات',
    nameEn: 'Port Sudan Container Terminal',
    role: 'المنفذ البحري الرئيسي والتخليص الجمركي',
    detail: 'محطة الحاويات الجنوبية والشمالية + مستودعات الإيداع الجمركي (CFS).',
    capacityM2: '45,000 م²',
    activeTrucks: 142,
    customsOfficer: 'العميد/ عثمان إدريس',
    status: 'operational',
    x: 78,
    y: 26,
    connections: ['krt', 'atbara', 'kassala'],
  },
  {
    id: 'kassala',
    name: 'كسلا — مركز توزيع الشرق',
    nameEn: 'Kassala Eastern Hub',
    role: 'مركز التوزيع الإقليمي للقطاع الشرقي',
    detail: 'نقطة ربط مع الحدود الإريترية ومحور نقل الحبوب والمنتجات البستانية.',
    capacityM2: '6,500 م²',
    activeTrucks: 28,
    customsOfficer: 'المقدم/ علي عوض',
    status: 'operational',
    x: 76,
    y: 50,
    connections: ['psu', 'krt', 'gedaref'],
  },
  {
    id: 'gedaref',
    name: 'القضارف — مجمع الصوامع والغلال',
    nameEn: 'Gedaref Silo Complex',
    role: 'مركز لوجستيات المحاصيل الزراعية ومعبر القلابات',
    detail: 'صوامع غلال سعة 50,000 طن + مركز شحن الصادرات لإثيوبيا.',
    capacityM2: '18,000 م²',
    activeTrucks: 46,
    customsOfficer: 'الرائد/ طارق حسن',
    status: 'operational',
    x: 72,
    y: 62,
    connections: ['kassala', 'krt', 'medani'],
  },
  {
    id: 'medani',
    name: 'ود مدني — مجمع الجزيرة للإمداد',
    nameEn: 'Wad Medani Central Hub',
    role: 'مستودعات وسط السودان والتوزيع الدوائي',
    detail: 'مستودعات مبردة ومكيفة وفق معايير GDP لقطاع الأدوية والأغذية.',
    capacityM2: '8,000 م²',
    activeTrucks: 36,
    customsOfficer: 'النقيب/ هيثم نور',
    status: 'operational',
    x: 58,
    y: 60,
    connections: ['krt', 'gedaref', 'sennar', 'kosti'],
  },
  {
    id: 'atbara',
    name: 'عطبرة — ملتقى السكة حديد والنقل الثقيل',
    nameEn: 'Atbara Rail & Heavy Freight',
    role: 'نقطة تبديل سائقين وخدمات الصيانة المركزية',
    detail: 'ورشة صيانة الشاحنات الثقيلة على مدار 24 ساعة + محطة شحن قطارات.',
    capacityM2: '12,000 م²',
    activeTrucks: 52,
    customsOfficer: 'المقدم/ صالح بشير',
    status: 'operational',
    x: 60,
    y: 33,
    connections: ['psu', 'krt', 'dongola'],
  },
  {
    id: 'elobeid',
    name: 'الأبيض — مركز توزيع الغرب والأصماغ',
    nameEn: 'El Obeid Western Distribution',
    role: 'محطة الصمغ العربي وتجميع شحنات كردفان',
    detail: 'ساحات فرز وتغليف المنتجات الغابية والصمغ العربي وشحن الماشية.',
    capacityM2: '15,000 م²',
    activeTrucks: 40,
    customsOfficer: 'الرائد/ أحمد الجيلي',
    status: 'operational',
    x: 38,
    y: 60,
    connections: ['krt', 'kosti', 'nyala'],
  },
  {
    id: 'kosti',
    name: 'كوستي — الميناء النهري والمحور الجنوبي',
    nameEn: 'Kosti River Port Hub',
    role: 'النقل النهري عبر النيل الأبيض والإمداد الحدودي',
    detail: 'أرصفة تفريغ المواعين النهرية وسوق الوقود الإقليمي.',
    capacityM2: '9,500 م²',
    activeTrucks: 31,
    customsOfficer: 'الرائد/ ياسر كمال',
    status: 'operational',
    x: 50,
    y: 68,
    connections: ['medani', 'elobeid'],
  },
  {
    id: 'nyala',
    name: 'نيالا — بوابة إمداد دارفور',
    nameEn: 'Nyala Darfur Logistics Center',
    role: 'مركز الإغاثة والتجارة الإقليمية لدارفور وتشاد',
    detail: 'مستودعات تأمين المساعدات الإنسانية والسلع الأساسية.',
    capacityM2: '7,000 م²',
    activeTrucks: 22,
    customsOfficer: 'المقدم/ بدر الدين',
    status: 'restricted',
    x: 18,
    y: 70,
    connections: ['elobeid'],
  },
  {
    id: 'dongola',
    name: 'دنقلا — معبر الشمال وطريق مصر',
    nameEn: 'Dongola Northern Gateway',
    role: 'محور الربط مع معبري أرقين وأشكيت إلى جمهورية مصر',
    detail: 'ساحة التبادل التجاري للشاحنات المصرية والسودانية.',
    capacityM2: '11,000 م²',
    activeTrucks: 39,
    customsOfficer: 'العقيد/ مجدي النور',
    status: 'operational',
    x: 44,
    y: 22,
    connections: ['atbara'],
  },
];

export function LocationsView() {
  const { setCurrentView } = useApp();
  const [selectedHub, setSelectedHub] = useState<CityHub>(cityHubs[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHubs = cityHubs.filter(
    (h) =>
      h.name.includes(searchQuery) ||
      h.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.role.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pb-12 font-sans" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-gold/30 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-1">
            <Globe className="w-4 h-4" />
            <span>الشبكة اللوجستية السيادية الموحدة</span>
          </div>
          <h1 className="text-2xl font-black text-white">مراكز ومحطات سودانيل في الولايات</h1>
          <p className="text-xs text-gray-300 mt-1">
            10 مراكز استراتيجية تغطي كافة ولايات السودان، موانئه البحرية، معابره الحدودية، وممرات النقل الثقيل.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('control_tower')}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-xl text-xs font-bold border border-white/10 transition-colors cursor-pointer"
          >
            برج المراقبة الحي
          </button>
          <button
            onClick={() => setCurrentView('warehousing')}
            className="px-4 py-2 bg-gold hover:bg-gold-light text-navy-950 rounded-xl text-xs font-extrabold shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            إدارة المستودعات
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map (Right) + Hubs List (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hubs List & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن ولاية، مركز، أو دور لوجستي..."
              className="w-full bg-navy-900/80 border border-white/10 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-gray-400 outline-none focus:border-gold"
            />
          </div>

          {/* List of Hubs */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredHubs.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-navy-800 border-gold shadow-lg ring-1 ring-gold/50'
                      : 'bg-navy-900/60 border-white/5 hover:bg-navy-800/80 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-gold text-navy-950' : 'bg-navy-950 text-gold'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white leading-tight">{hub.name}</h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">{hub.role}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        hub.status === 'operational'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {hub.status === 'operational' ? 'تشغيلي نشط' : 'حذر ومقيد'}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs">
                      <p className="text-gray-300 leading-relaxed text-[11px]">{hub.detail}</p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="p-2 rounded-lg bg-navy-950/60 border border-white/5">
                          <span className="text-[10px] text-gray-400 block">السعة التخزينية</span>
                          <span className="font-bold text-white text-xs">{hub.capacityM2}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-navy-950/60 border border-white/5">
                          <span className="text-[10px] text-gray-400 block">الشاحنات المتمركزة</span>
                          <span className="font-bold text-emerald-400 text-xs font-mono">{hub.activeTrucks} مركبة</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Visual Map (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold" />
              <h2 className="font-extrabold text-sm text-white">الخريطة الطبوغرافية للممرات الحية</h2>
            </div>
            <span className="text-xs text-gray-400 font-mono">10 عقد جغرافية متصلة</span>
          </div>

          {/* SVG Map of Sudan */}
          <div className="relative w-full h-[520px] rounded-xl bg-[#03091B] border border-blue-900/40 overflow-hidden">
            {/* Grid background */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="locations-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M5 0H0V5" fill="none" stroke="#1E293B" strokeWidth="0.2" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#locations-grid)" />

              {/* Sudan Border Outline */}
              <path
                d="M 30,12 L 70,10 L 88,24 L 84,42 L 90,56 L 74,80 L 46,88 L 18,76 L 12,48 L 22,26 Z"
                fill="#0F172A"
                fillOpacity="0.8"
                stroke="#1E40AF"
                strokeWidth="0.8"
              />

              {/* Connecting Lines */}
              <line x1="52" y1="52" x2="78" y2="26" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="52" y1="52" x2="76" y2="50" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="52" y1="52" x2="58" y2="60" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="52" y1="52" x2="60" y2="33" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="52" y1="52" x2="38" y2="60" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="78" y1="26" x2="60" y2="33" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="60" y1="33" x2="44" y2="22" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="58" y1="60" x2="72" y2="62" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="72" y1="62" x2="76" y2="50" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="58" y1="60" x2="50" y2="68" stroke="#3B82F6" strokeWidth="0.6" strokeDasharray="2 1" />
              <line x1="38" y1="60" x2="18" y2="70" stroke="#EF4444" strokeWidth="0.6" strokeDasharray="2 1" />
            </svg>

            {/* City Nodes */}
            {cityHubs.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                >
                  <div className="relative flex items-center justify-center">
                    {/* Ripple on selected */}
                    {isSelected && (
                      <span className="absolute w-7 h-7 rounded-full bg-gold/30 animate-ping"></span>
                    )}

                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                        isSelected
                          ? 'bg-gold border-white scale-125 shadow-lg'
                          : hub.status === 'operational'
                          ? 'bg-blue-500 border-navy-950 group-hover:scale-110'
                          : 'bg-amber-500 border-navy-950'
                      }`}
                    ></span>
                  </div>

                  <span
                    className={`absolute -bottom-5 right-1/2 translate-x-1/2 whitespace-nowrap text-[10px] font-bold px-1.5 py-0.5 rounded shadow ${
                      isSelected
                        ? 'bg-gold text-navy-950 font-black'
                        : 'bg-navy-950/90 text-gray-200 border border-white/10'
                    }`}
                  >
                    {hub.name.split('—')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Node Summary Box */}
          <div className="p-4 rounded-xl bg-navy-950/80 border border-gold/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">{selectedHub.name}</h4>
                <p className="text-xs text-gray-400">{selectedHub.role}</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('control_tower')}
              className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-navy-950 font-black text-xs shadow-md transition-transform hover:scale-105"
            >
              تتبع الشحنات المارة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
