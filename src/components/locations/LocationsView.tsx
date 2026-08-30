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
  Truck,
  ShieldCheck,
  Zap,
  Activity,
  Compass,
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
  corridor: 'red_sea' | 'agricultural' | 'southern' | 'northern';
  status: 'operational' | 'busy' | 'restricted';
  x: number; // Percentage on map
  y: number;
  connections: string[];
}

const corridorsList = [
  { id: 'all', nameAr: 'كافة الممرات والمراكز', trucksCount: 561 },
  { id: 'red_sea', nameAr: 'ممر البحر الأحمر والصادرات (الخرطوم - بورتسودان)', trucksCount: 226, avgHours: '11.5 ساعة', status: 'انسيابي وسريع' },
  { id: 'agricultural', nameAr: 'ممر المحاصيل والشرق (القضارف - كسلا)', trucksCount: 93, avgHours: '8.0 ساعات', status: 'نشط (موسم الصمغ)' },
  { id: 'southern', nameAr: 'ممر النيل الأبيض والجنوب (كوستي - الرنك)', trucksCount: 75, avgHours: '6.5 ساعات', status: 'نقل نهري وبري' },
  { id: 'northern', nameAr: 'ممر الشمال والتبادل مع مصر (دنقلا - أرقين)', trucksCount: 39, avgHours: '14.0 ساعة', status: 'معبر دولي 24/7' },
];

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
    corridor: 'red_sea',
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
    corridor: 'red_sea',
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
    corridor: 'agricultural',
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
    corridor: 'agricultural',
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
    corridor: 'southern',
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
    corridor: 'southern',
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
    corridor: 'red_sea',
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
    corridor: 'southern',
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
    corridor: 'southern',
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
    corridor: 'northern',
    status: 'operational',
    x: 44,
    y: 22,
    connections: ['atbara'],
  },
];

export function LocationsView() {
  const { setCurrentView, showToast } = useApp();
  const [selectedHub, setSelectedHub] = useState<CityHub>(cityHubs[0]);
  const [selectedCorridor, setSelectedCorridor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHubs = cityHubs.filter((h) => {
    const matchesSearch =
      h.name.includes(searchQuery) ||
      h.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.role.includes(searchQuery);
    const matchesCorridor = selectedCorridor === 'all' || h.corridor === selectedCorridor;
    return matchesSearch && matchesCorridor;
  });

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#ffffff] border border-[#e4e4e7] p-8 shopify-card">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <Globe className="w-4 h-4" />
            <span>Sovereign Unified Network • الشبكة اللوجستية السيادية</span>
          </div>
          <h1 className="text-[26px] font-[600] text-[#000000] tracking-tight">
            مراكز ومحطات سودانيل في الولايات
          </h1>
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

      {/* Corridors Selector Ribbon */}
      <div className="shopify-card p-4 bg-[#ffffff]">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {corridorsList.map((c) => {
            const isSelected = selectedCorridor === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCorridor(c.id)}
                className={`px-4 py-2 rounded-full text-[12.5px] font-[600] whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#000000] text-[#c1fbd4] shadow-sm'
                    : 'bg-[#fbfbf5] text-[#71717a] border border-[#e4e4e7] hover:border-[#a1a1aa] hover:text-[#000000]'
                }`}
              >
                <span>{c.nameAr}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#71717a]'}`}>
                  {c.trucksCount}
                </span>
              </button>
            );
          })}
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
              {/* Red Sea Corridor */}
              <line x1="52" y1="52" x2="60" y2="33" stroke={selectedCorridor === 'red_sea' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth={selectedCorridor === 'red_sea' ? '1.5' : '0.8'} />
              <line x1="60" y1="33" x2="78" y2="26" stroke={selectedCorridor === 'red_sea' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth={selectedCorridor === 'red_sea' ? '1.5' : '0.8'} strokeDasharray="3 2" />

              {/* Agricultural Corridor */}
              <line x1="52" y1="52" x2="72" y2="62" stroke={selectedCorridor === 'agricultural' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth={selectedCorridor === 'agricultural' ? '1.5' : '0.8'} />
              <line x1="72" y1="62" x2="76" y2="50" stroke={selectedCorridor === 'agricultural' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth={selectedCorridor === 'agricultural' ? '1.5' : '0.8'} />
              <line x1="76" y1="50" x2="78" y2="26" stroke={selectedCorridor === 'agricultural' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth={selectedCorridor === 'agricultural' ? '1.5' : '0.8'} strokeDasharray="2 1" />

              {/* Southern / Nile Corridor */}
              <line x1="52" y1="52" x2="54" y2="56" stroke={selectedCorridor === 'southern' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth="0.8" />
              <line x1="54" y1="56" x2="58" y2="60" stroke={selectedCorridor === 'southern' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth="0.8" />
              <line x1="58" y1="60" x2="50" y2="68" stroke={selectedCorridor === 'southern' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth="0.8" />
              <line x1="52" y1="52" x2="38" y2="60" stroke={selectedCorridor === 'southern' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth="0.8" strokeDasharray="2 1" />

              {/* Northern Corridor */}
              <line x1="60" y1="33" x2="44" y2="22" stroke={selectedCorridor === 'northern' || selectedCorridor === 'all' ? '#000000' : '#e4e4e7'} strokeWidth={selectedCorridor === 'northern' ? '1.5' : '0.8'} />
            </svg>

            {/* City Nodes */}
            {cityHubs.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              const isCorridorActive = selectedCorridor === 'all' || hub.corridor === selectedCorridor;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10 transition-opacity ${
                    isCorridorActive ? 'opacity-100' : 'opacity-30'
                  }`}
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
          <div className="p-6 rounded-[12px] bg-[#ffffff] border border-[#e4e4e7] space-y-4 shopify-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-[#c1fbd4] text-[#000000] flex items-center justify-center font-bold">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-[600] text-[15px] text-[#000000]">{selectedHub.name}</h4>
                  <p className="text-[12px] text-[#71717a]">{selectedHub.role}</p>
                </div>
              </div>

              <span className="shopify-tag-mint">{selectedHub.capacityM2}</span>
            </div>

            <p className="text-[12.5px] text-[#71717a] leading-relaxed">{selectedHub.detail}</p>

            <div className="flex items-center justify-between pt-3 border-t border-[#e4e4e7]">
              <span className="text-[12px] text-[#71717a]">ضابط الجمارك والتخليص: <strong className="text-[#000000]">{selectedHub.customsOfficer}</strong></span>
              <button
                onClick={() => {
                  showToast('توجيه القافلة', `تم تحديد مسار القافلة المتجهة إلى ${selectedHub.name.split('—')[0]}`, 'success');
                  setCurrentView('control_tower');
                }}
                className="btn-shopify-pill !py-2 !px-4 text-[12px] flex items-center gap-1.5"
              >
                <span>توجيه الشحنات للمركز</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#c1fbd4]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
