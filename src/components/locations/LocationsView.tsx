'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  MapPin,
  Warehouse,
  Globe,
  Layers,
  Search,
  Building2,
  ArrowUpRight,
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
    name: 'القضارف — صومعة الحبوب والمحاصيل',
    nameEn: 'Gedaref Agricultural Silos',
    role: 'مركز شحن وتخزين السمسم والذرة والإنتاج الزراعي',
    detail: 'صوامع غلال استراتيجية + ساحات شحن الصادر.',
    capacityM2: '20,000 م²',
    activeTrucks: 65,
    customsOfficer: 'الرائد/ طارق حسن',
    status: 'operational',
    x: 72,
    y: 62,
    connections: ['kassala', 'sennar', 'krt'],
  },
  {
    id: 'sennar',
    name: 'سنار — ملتقى السكة حديد ومحور النيل الأزرق',
    nameEn: 'Sennar Junction',
    role: 'محطة شحن سكر كنانة ومحور الوسط والجنوب',
    detail: 'تقاطع السكك الحديدية وشبكة الطرق القومية.',
    capacityM2: '8,000 م²',
    activeTrucks: 44,
    customsOfficer: 'الرائد/ فيصل عبد المنعم',
    status: 'operational',
    x: 58,
    y: 60,
    connections: ['krt', 'gedaref', 'kosti', 'medani'],
  },
  {
    id: 'medani',
    name: 'ود مدني — قلب مشروع الجزيرة',
    nameEn: 'Wad Medani Hub',
    role: 'خدمات الإمداد الزراعي وتوزيع المواد الاستهلاكية',
    detail: 'مستودعات توزيع مركزية على ممر الخرطوم-سنار.',
    capacityM2: '7,500 م²',
    activeTrucks: 36,
    customsOfficer: 'النقيب/ هيثم خالد',
    status: 'operational',
    x: 54,
    y: 56,
    connections: ['krt', 'sennar', 'kosti'],
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
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#ffffff] border border-[#e4e4e7] p-8 shopify-card">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <Globe className="w-4 h-4" />
            <span>Sovereign Unified Network • الشبكة اللوجستية السيادية</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">مراكز ومحطات سودانيل في الولايات</h1>
          <p className="text-[14px] text-[#71717a] leading-relaxed">
            10 مراكز استراتيجية تغطي كافة ولايات السودان، موانئه البحرية، معابره الحدودية، وممرات النقل الثقيل.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('control_tower')}
            className="btn-shopify-pill"
          >
            <span>برج المراقبة الحي</span>
          </button>
          <button
            onClick={() => setCurrentView('warehousing')}
            className="btn-shopify-outline"
          >
            <span>إدارة المستودعات</span>
          </button>
        </div>
      </div>

      {/* Corporate Headquarters & Logistics Hub Showcase (Shopify 20px Card) */}
      <div className="shopify-card overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 bg-[#ffffff]">
        <div className="md:col-span-5 relative min-h-[220px] bg-[#000000]">
          <img
            src="/images/hq-facility.jpg"
            alt="Sudaneel Headquarters and Terminals"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-4 start-4">
            <span className="shopify-tag-mint !text-[10px]">
              Khartoum HQ & Port Sudan Gate
            </span>
          </div>
        </div>

        <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="shopify-tag-pistachio !text-[11px]">
              National Operations Network • شبكة المراكز والمحطات المعتمدة
            </div>
            <h3 className="text-[20px] font-[600] text-[#000000] tracking-tight">
              المقر الرئيسي ومحطات الاستقبال والمناولة في الولايات
            </h3>
            <p className="text-[14px] text-[#71717a] leading-relaxed">
              صالات خدمة عملاء مجهزة، مكاتب تخليص جمركي موحدة، وأرصفة تحميل وتفريغ سريعة للشاحنات (Docks) بمقاييس هندسية حديثة تضمن سرعة الاستجابة وربط كافة المدن السودانية.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#e4e4e7] text-center">
            <div className="p-2.5 rounded-[8px] bg-[#fbfbf5]">
              <span className="text-[#71717a] block text-[11px]">عدد المحطات</span>
              <span className="font-[700] font-mono text-[#000000]">10 Hubs Active</span>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#c1fbd4]">
              <span className="text-[#000000] block text-[11px] font-[500]">مكاتب الاستقبال</span>
              <span className="font-[700] text-[#000000]">24/7 Service</span>
            </div>
            <div className="p-2.5 rounded-[8px] bg-[#fbfbf5]">
              <span className="text-[#71717a] block text-[11px]">أرصفة الشحن</span>
              <span className="font-[700] font-mono text-[#000000]">180+ Bay Docks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Hubs List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Hubs List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute start-4 top-1/2 -translate-y-1/2 text-[#71717a]" />
            <input
              type="text"
              placeholder="البحث في المراكز والولايات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded-full ps-10 pe-4 py-2.5 text-[13px] outline-none focus:border-[#000000] shadow-sm"
            />
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto custom-scrollbar pe-1">
            {filteredHubs.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`p-4 rounded-[12px] border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#ffffff] border-[#000000] ring-2 ring-[#c1fbd4] shadow-sm'
                      : 'bg-[#ffffff] border-[#e4e4e7] hover:border-[#a1a1aa]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#000000]' : 'bg-[#71717a]'}`}></div>
                      <h3 className="font-[600] text-[14px] text-[#000000]">{hub.name}</h3>
                    </div>
                    <span className="shopify-tag-mint !text-[10px]">
                      {hub.activeTrucks} شاحنة
                    </span>
                  </div>

                  <p className="text-[12px] text-[#71717a] mt-1.5 line-clamp-1">{hub.role}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Map Canvas & Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Map Canvas */}
          <div className="shopify-card p-6 relative h-[420px] bg-[#fbfbf5] overflow-hidden border border-[#e4e4e7]">
            {/* SVG Corridor Lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="52" y1="52" x2="78" y2="26" stroke="#000000" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="52" y1="52" x2="76" y2="50" stroke="#000000" strokeWidth="0.8" strokeDasharray="2 1" />
              <line x1="52" y1="52" x2="54" y2="56" stroke="#000000" strokeWidth="0.8" />
              <line x1="54" y1="56" x2="58" y2="60" stroke="#000000" strokeWidth="0.8" />
              <line x1="52" y1="52" x2="60" y2="33" stroke="#000000" strokeWidth="0.8" />
              <line x1="52" y1="52" x2="38" y2="60" stroke="#000000" strokeWidth="0.8" strokeDasharray="2 1" />
            </svg>

            {/* City Nodes */}
            {cityHubs.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                  style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-transform duration-200 ${
                        isSelected
                          ? 'bg-[#000000] border-[#c1fbd4] scale-125 ring-4 ring-[#c1fbd4]/50'
                          : 'bg-[#000000] border-white group-hover:scale-110'
                      }`}
                    ></span>
                  </div>

                  <span
                    className={`absolute -bottom-6 right-1/2 translate-x-1/2 whitespace-nowrap text-[10px] font-[600] px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#000000] text-white'
                        : 'bg-white text-[#000000] border border-[#e4e4e7] shadow-sm'
                    }`}
                  >
                    {hub.name.split('—')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Node Summary Box */}
          <div className="p-5 rounded-[12px] bg-[#ffffff] border border-[#e4e4e7] flex items-center justify-between shopify-card">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#c1fbd4] text-[#000000] flex items-center justify-center font-bold">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-[600] text-[15px] text-[#000000]">{selectedHub.name}</h4>
                <p className="text-[12px] text-[#71717a]">{selectedHub.role}</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('control_tower')}
              className="btn-shopify-pill !py-2 !px-4 text-[12px]"
            >
              <span>تتبع الشحنات</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
