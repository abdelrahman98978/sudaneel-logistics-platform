'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/store';
import {
  Package,
  Truck,
  CheckCircle2,
  Wallet,
  Users,
  Target,
  Calendar,
  AlertTriangle,
  Wrench,
  Compass,
  ArrowUpRight,
  Plus,
  Minus,
  Star,
  Smartphone,
  Layers,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export function ControlTowerView() {
  const { shipments, lang, setCurrentView, showToast } = useApp();

  const [dateFilter, setDateFilter] = useState('20 مايو - 27 مايو 2024');
  const [selectedCityNode, setSelectedCityNode] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<'all' | 'transit' | 'hubs' | 'alerts'>('all');

  // Cities on Sudan Corridor Map with coordinates
  const mapNodes = [
    { nameAr: 'بورتسودان', nameEn: 'Port Sudan', top: '24%', left: '78%', status: 'in_transit', count: 456 },
    { nameAr: 'دنقلا', nameEn: 'Dongola', top: '26%', left: '38%', status: 'delivered', count: 245 },
    { nameAr: 'الخرطوم', nameEn: 'Khartoum', top: '48%', left: '52%', status: 'hub', count: 1248 },
    { nameAr: 'كسلا', nameEn: 'Kassala', top: '46%', left: '84%', status: 'in_transit', count: 289 },
    { nameAr: 'القضارف', nameEn: 'Gedaref', top: '58%', left: '74%', status: 'in_transit', count: 180 },
    { nameAr: 'سنار', nameEn: 'Sennar', top: '62%', left: '60%', status: 'delivered', count: 120 },
    { nameAr: 'كوستي', nameEn: 'Kosti', top: '64%', left: '46%', status: 'delayed', count: 312 },
    { nameAr: 'الأبيض', nameEn: 'El Obeid', top: '68%', left: '32%', status: 'warehoused', count: 198 },
  ];

  // Active shipments stream
  const streamShipments = [
    {
      code: 'SDN-2024-1256',
      route: 'الخرطوم ➔ بورتسودان',
      status: 'في الطريق',
      statusType: 'in_transit',
      statusTag: 'shopify-tag-mint',
      eta: '10:30 - مايو 10',
      vehicle: 'شاحنة فلات 40 قدم',
    },
    {
      code: 'SDN-2024-1257',
      route: 'كسلا ➔ الخرطوم',
      status: 'في الطريق',
      statusType: 'in_transit',
      statusTag: 'shopify-tag-mint',
      eta: '04:15 - مايو 27',
      vehicle: 'شاحنة مبردة',
    },
    {
      code: 'SDN-2024-1258',
      route: 'الأبيض ➔ كوستي',
      status: 'تأخير',
      statusType: 'delayed',
      statusTag: 'shopify-tag-shade',
      eta: '13:41 - مايو 27',
      vehicle: 'شاحنة ثقيلة',
    },
    {
      code: 'SDN-2024-1259',
      route: 'بورتسودان ➔ دنقلا',
      status: 'في المستودع',
      statusType: 'warehoused',
      statusTag: 'shopify-tag-pistachio',
      eta: '-',
      vehicle: 'مستودع تخزين',
    },
    {
      code: 'SDN-2024-1260',
      route: 'سنار ➔ القضارف',
      status: 'تم التسليم',
      statusType: 'delivered',
      statusTag: 'shopify-tag-mint',
      eta: '02:20 - مايو 9',
      vehicle: 'شاحنة نقل جاف',
    },
  ];

  // Drivers performance
  const driversList = [
    { name: 'محمد أحمد علي', trips: 45, compliance: '98.5%', rating: 4.8 },
    { name: 'أحمد حسن موسى', trips: 42, compliance: '96.2%', rating: 4.6 },
    { name: 'عثمان إبراهيم', trips: 38, compliance: '94.7%', rating: 4.5 },
    { name: 'عبدالله محمد', trips: 35, compliance: '93.1%', rating: 4.4 },
  ];

  // Warehouses utilization
  const warehousesList = [
    { name: 'مستودع الخرطوم اللوجستي', capacity: '10,000 م²', usage: '85%', status: 'نشط جداً' },
    { name: 'مستودع بورتسودان الجمركي', capacity: '15,000 م²', usage: '92%', status: 'سعة كاملة' },
    { name: 'مستودع كسلا الإقليمي', capacity: '6,000 م²', usage: '64%', status: 'متاح' },
    { name: 'مستودع الأبيض للحبوب', capacity: '8,000 م²', usage: '48%', status: 'متاح' },
  ];

  // Accounts receivable / ledger
  const accountsReceivable = [
    { client: 'شركة النيل للواردات', amount: '$124,500', status: 'مستحق 30 يوم' },
    { client: 'مجموعة البحر الأحمر التجارية', amount: '$98,200', status: 'جاري التحصيل' },
    { client: 'المؤسسة الوطنية للتوزيع', amount: '$76,400', status: 'مجدول بنكك' },
  ];

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Filter & Actions Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Pill Date Filter */}
          <div className="inline-flex items-center gap-2 bg-[#ffffff] border border-[#e4e4e7] rounded-full px-4 py-2 text-[13px] text-[#000000] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <Calendar className="w-4 h-4 text-[#71717a]" />
            <span className="font-[500]">{dateFilter}</span>
          </div>

          {/* Pill Filter Tabs */}
          <div className="inline-flex items-center bg-[#ffffff] border border-[#e4e4e7] rounded-full p-1 shadow-[0_2px_4px_rgba(0,0,0,0.02)] text-[12px]">
            <button
              onClick={() => setActiveMetricTab('all')}
              className={`px-3.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                activeMetricTab === 'all'
                  ? 'bg-[#000000] text-[#ffffff] font-[500]'
                  : 'text-[#71717a] hover:text-[#000000]'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setActiveMetricTab('transit')}
              className={`px-3.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                activeMetricTab === 'transit'
                  ? 'bg-[#000000] text-[#ffffff] font-[500]'
                  : 'text-[#71717a] hover:text-[#000000]'
              }`}
            >
              في الطريق
            </button>
            <button
              onClick={() => setActiveMetricTab('hubs')}
              className={`px-3.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                activeMetricTab === 'hubs'
                  ? 'bg-[#000000] text-[#ffffff] font-[500]'
                  : 'text-[#71717a] hover:text-[#000000]'
              }`}
            >
              المحطات والموانئ
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('create_shipment')}
            className="btn-shopify-pill"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء شحنة جديدة</span>
          </button>

          <button
            onClick={() => setCurrentView('mobile_app')}
            className="btn-shopify-aloe"
          >
            <Smartphone className="w-4 h-4" />
            <span>تطبيق الجوال الذكي</span>
          </button>
        </div>
      </div>

      {/* Cinematic Multimodal Panoramic Hero Banner (DESIGN-shopify.md: canvas-night-elevated + thin Neue Haas cut + stroked/aloe pills) */}
      <div className="relative rounded-[20px] overflow-hidden bg-[#000000] border border-[#1e2c31] min-h-[260px] flex items-end p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-multimodal-v2.png"
            alt="Sudaneel Sovereign Multimodal Network"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover object-center opacity-45 scale-100 hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-[12px] font-[400] tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#c1fbd4] animate-pulse"></span>
              <span>Sovereign Multimodal Network • شبكة النقل السيادية</span>
            </div>
            
            <h1 className="text-[28px] sm:text-[38px] font-[330] text-white tracking-tight leading-tight">
              نقل بثقة .. نوصل باحتراف
            </h1>
            
            <p className="text-[14px] text-[#d4d4d8] font-[420] leading-relaxed max-w-xl">
              منظومة لوجستية ذكية تربط الموانئ البحرية، النقل البري، الشحن الجوي، والمستودعات الذكية عبر كافة ممرات السودان الإقليمية.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setCurrentView('smart_dispatch')}
                className="px-6 py-2.5 rounded-full bg-transparent border-2 border-white text-white text-[14px] font-[500] hover:bg-white hover:text-black transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>مركز التوجيه الذكي (Dispatch)</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('port_sudan')}
                className="btn-shopify-aloe"
              >
                <span>محطة ميناء بورتسودان</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-[16px] border border-white/15 text-white text-[13px]">
            <div className="text-center px-4 border-e border-white/20">
              <div className="text-[20px] font-[600] text-[#c1fbd4] font-mono">99.4%</div>
              <div className="text-[11px] text-[#d4d4d8]">معدل التسليم OTD</div>
            </div>
            <div className="text-center px-4 border-e border-white/20">
              <div className="text-[20px] font-[600] text-white font-mono">48</div>
              <div className="text-[11px] text-[#d4d4d8]">قافلة نشطة</div>
            </div>
            <div className="text-center px-4">
              <div className="text-[20px] font-[600] text-[#c1fbd4] font-mono">2.4M T</div>
              <div className="text-[11px] text-[#d4d4d8]">طن مشحون</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards (Shopify Style: 12px rounded, Level 3 shadow halo, featured card in Aloe-10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: إجمالي الشحنات */}
        <div className="shopify-card p-5 space-y-2 hover:border-[#a1a1aa] transition-colors">
          <div className="flex items-center justify-between text-[13px] text-[#71717a]">
            <span>إجمالي الشحنات</span>
            <Package className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[26px] font-[600] font-mono text-[#000000]">2,450</div>
          <div className="text-[11px] text-[#71717a] font-[400] flex items-center gap-1">
            <span className="shopify-tag-mint !px-2 !py-0.5 !text-[10px]">+12.5%</span>
            <span>مقارنة بالشهر الماضي</span>
          </div>
        </div>

        {/* Card 2: FEATURED TIER: الشحنات النشطة في الطريق (Aloe-10 Fill - Shopify Signature) */}
        <div className="shopify-card-aloe p-5 space-y-2 shadow-[0_4px_12px_rgba(193,251,212,0.4)]">
          <div className="flex items-center justify-between text-[13px] text-[#000000] font-[500]">
            <span>على الطريق الآن</span>
            <Truck className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[26px] font-[700] font-mono text-[#000000]">128</div>
          <div className="text-[11px] text-[#000000]/80 font-[500] flex items-center gap-1">
            <span className="bg-[#000000] text-white px-2 py-0.5 rounded-full text-[10px]">مباشر</span>
            <span>بث تيليماتري 4 ثواني</span>
          </div>
        </div>

        {/* Card 3: الشاحنات المتاحة */}
        <div className="shopify-card p-5 space-y-2 hover:border-[#a1a1aa] transition-colors">
          <div className="flex items-center justify-between text-[13px] text-[#71717a]">
            <span>شاحنات متاحة</span>
            <Truck className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[26px] font-[600] font-mono text-[#000000]">45</div>
          <div className="text-[11px] text-[#71717a] font-[400] flex items-center gap-1">
            <span className="shopify-tag-pistachio !px-2 !py-0.5 !text-[10px]">جاهزة</span>
            <span>في محطات الولايات</span>
          </div>
        </div>

        {/* Card 4: الإيرادات المحققة */}
        <div className="shopify-card p-5 space-y-2 hover:border-[#a1a1aa] transition-colors">
          <div className="flex items-center justify-between text-[13px] text-[#71717a]">
            <span>الإيرادات</span>
            <Wallet className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[26px] font-[600] font-mono text-[#000000]">$842.5K</div>
          <div className="text-[11px] text-[#71717a] font-[400] flex items-center gap-1">
            <span className="shopify-tag-mint !px-2 !py-0.5 !text-[10px]">+18.2%</span>
            <span>تسويات EBS معتمدة</span>
          </div>
        </div>

        {/* Card 5: السائقين المتاحين */}
        <div className="shopify-card p-5 space-y-2 hover:border-[#a1a1aa] transition-colors">
          <div className="flex items-center justify-between text-[13px] text-[#71717a]">
            <span>السائقين المعتمدين</span>
            <Users className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[26px] font-[600] font-mono text-[#000000]">38</div>
          <div className="text-[11px] text-[#71717a] font-[400] flex items-center gap-1">
            <span className="shopify-tag-shade !px-2 !py-0.5 !text-[10px]">98%</span>
            <span>معدل الامتثال والسلامة</span>
          </div>
        </div>

        {/* Card 6: نسبة الالتزام */}
        <div className="shopify-card p-5 space-y-2 hover:border-[#a1a1aa] transition-colors">
          <div className="flex items-center justify-between text-[13px] text-[#71717a]">
            <span>نسبة الالتزام OTD</span>
            <Target className="w-4 h-4 text-[#000000]" />
          </div>
          <div className="text-[26px] font-[600] font-mono text-[#000000]">99.4%</div>
          <div className="text-[11px] text-[#71717a] font-[400] flex items-center gap-1">
            <span className="shopify-tag-mint !px-2 !py-0.5 !text-[10px]">ممتاز</span>
            <span>وفق معايير SLA</span>
          </div>
        </div>
      </div>

      {/* Main Operations Grid: Corridor Map (5 cols) + Live Stream (4 cols) + Feeds (3 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Corridor Map Card (5 cols) */}
        <div className="lg:col-span-5 shopify-card p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <div>
              <h3 className="font-[600] text-[15px] text-[#000000]">خريطة الممرات والعمليات الحية</h3>
              <p className="text-[12px] text-[#71717a]">تغطية شبكة الموانئ والمحطات السودانية</p>
            </div>
            <span className="shopify-tag-mint">
              <span className="w-2 h-2 rounded-full bg-[#000000] animate-ping"></span>
              <span>8 محطات متصلة</span>
            </span>
          </div>

          {/* Interactive Minimalist Map Canvas */}
          <div className="relative h-80 bg-[#fbfbf5] rounded-[12px] border border-[#e4e4e7] overflow-hidden">
            {/* Background SVG Grid & Route Lines */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="shopify-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e4e4e7" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#shopify-grid)" />

              {/* Corridor Lines */}
              <line x1="52%" y1="48%" x2="78%" y2="24%" stroke="#000000" strokeWidth="2.5" strokeDasharray="5 3" />
              <line x1="52%" y1="48%" x2="38%" y2="26%" stroke="#a1a1aa" strokeWidth="1.5" />
              <line x1="52%" y1="48%" x2="84%" y2="46%" stroke="#000000" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="52%" y1="48%" x2="60%" y2="62%" stroke="#000000" strokeWidth="2" />
              <line x1="60%" y1="62%" x2="46%" y2="64%" stroke="#a1a1aa" strokeWidth="1.5" />
              <line x1="46%" y1="64%" x2="32%" y2="68%" stroke="#000000" strokeWidth="2" strokeDasharray="3 3" />
            </svg>

            {/* City Nodes */}
            {mapNodes.map((node, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedCityNode(node.nameAr);
                  showToast(node.nameAr, `تم فحص العمليات النشطة في محطة ${node.nameAr} (${node.count} شحنة)`, 'info');
                }}
                style={{ top: node.top, left: node.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              >
                <div className="relative flex items-center justify-center">
                  <div className={`w-3.5 h-3.5 rounded-full ${
                    node.nameAr === 'الخرطوم'
                      ? 'bg-[#000000] ring-4 ring-[#c1fbd4]'
                      : node.nameAr === 'بورتسودان'
                      ? 'bg-[#000000] ring-4 ring-[#d4f9e0]'
                      : 'bg-[#71717a] group-hover:bg-[#000000]'
                  } transition-transform duration-200 group-hover:scale-125`} />
                  
                  {/* Floating Pill Label */}
                  <div className="absolute top-5 bg-[#ffffff] border border-[#e4e4e7] rounded-full px-2.5 py-0.5 shadow-[0_2px_6px_rgba(0,0,0,0.08)] whitespace-nowrap text-[11px] font-[500] text-[#000000] flex items-center gap-1">
                    <span>{node.nameAr}</span>
                    <span className="text-[#71717a] font-mono text-[10px]">({node.count})</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Map Zoom Controls */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 z-20">
              <button className="w-8 h-8 rounded-full bg-white border border-[#e4e4e7] text-[#000000] flex items-center justify-center hover:bg-[#fbfbf5] shadow-sm">
                <Plus className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white border border-[#e4e4e7] text-[#000000] flex items-center justify-center hover:bg-[#fbfbf5] shadow-sm">
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Shipments Stream Table (4 cols) */}
        <div className="lg:col-span-4 shopify-card p-6 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <div>
              <h3 className="font-[600] text-[15px] text-[#000000]">الشحنات النشطة الآن</h3>
              <p className="text-[12px] text-[#71717a]">تحديث فوري للحركات الجارية</p>
            </div>
            <button
              onClick={() => setCurrentView('shipments')}
              className="text-[12px] text-[#000000] font-[500] hover:underline flex items-center gap-1"
            >
              <span>عرض السجل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-[13px]">
              <thead>
                <tr className="border-b border-[#e4e4e7] text-[#71717a] text-[11px]">
                  <th className="pb-2.5 text-start font-[500]">رقم البوليصة</th>
                  <th className="pb-2.5 text-start font-[500]">المسار</th>
                  <th className="pb-2.5 text-start font-[500]">الحالة</th>
                  <th className="pb-2.5 text-end font-[500]">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e4e4e7] font-[420]">
                {streamShipments.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#fbfbf5] transition-colors duration-200 cursor-pointer" onClick={() => setCurrentView('tracking_detail')}>
                    <td className="py-3 font-mono text-[#000000] font-[600]">{s.code}</td>
                    <td className="py-3 text-[#000000] truncate max-w-[120px]">{s.route}</td>
                    <td className="py-3">
                      <span className={s.statusTag}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 text-end font-mono text-[11px] text-[#71717a]">{s.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications & Fleet Overview (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Notifications Feed */}
          <div className="shopify-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#e4e4e7]">
              <h3 className="font-[600] text-[14px] text-[#000000]">التنبيهات التشغيلية</h3>
              <span className="shopify-tag-shade !text-[10px]">3 جديدة</span>
            </div>

            <div className="space-y-2.5 text-[12px]">
              <div className="p-3 rounded-[8px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#000000] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-[500] text-[#000000]">تأخير بسيط على طريق كوستي</div>
                  <div className="text-[11px] text-[#71717a]">بسبب أعمال صيانة دورية</div>
                </div>
              </div>

              <div className="p-3 rounded-[8px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-start gap-2.5">
                <Wrench className="w-4 h-4 text-[#000000] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-[500] text-[#000000]">صيانة وقائية للشاحنة #104</div>
                  <div className="text-[11px] text-[#71717a]">تم الفحص الفني بنجاح</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Dispatch Action Card (Shopify Pistachio Band Style) */}
          <div className="shopify-card-pistachio p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-[600] text-[#000000]">Smart Dispatch</span>
              <Sparkles className="w-4 h-4 text-[#000000]" />
            </div>
            <h4 className="font-[600] text-[14px] text-[#000000]">
              مطابقة العودة الفارغة (Backhaul)
            </h4>
            <p className="text-[12px] text-[#000000]/80 leading-relaxed">
              تم اكتشاف 14 شاحنة عائدة من بورتسودan يمكن إعادة تحميلها بحاويات تصدير وتوفير 38% من تكلفة الوقود.
            </p>
            <button
              onClick={() => setCurrentView('marketplace')}
              className="w-full bg-[#000000] text-white py-2 rounded-full text-[12px] font-[500] hover:bg-[#3f3f46] transition-colors"
            >
              تفعيل المطابقة الذكية
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Operations Matrix: Fleet Performance, Warehouses, and Accounts Receivable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fleet Performance & Drivers */}
        <div className="shopify-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[14px] text-[#000000]">أفضل السائقين أداءً</h3>
            <span className="text-[12px] text-[#71717a]">هذا الشهر</span>
          </div>

          <div className="space-y-3">
            {driversList.map((driver, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-[8px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#000000] text-white flex items-center justify-center text-[12px] font-[600]">
                    {driver.name.slice(0, 1)}
                  </div>
                  <div>
                    <div className="font-[500] text-[13px] text-[#000000]">{driver.name}</div>
                    <div className="text-[11px] text-[#71717a]">{driver.trips} رحلة مكتملة</div>
                  </div>
                </div>
                <div className="text-end">
                  <div className="font-mono text-[13px] font-[600] text-[#000000]">{driver.compliance}</div>
                  <div className="text-[11px] text-[#71717a] flex items-center gap-1 justify-end">
                    <Star className="w-3 h-3 text-[#000000] fill-[#000000]" />
                    <span>{driver.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouses Utilization */}
        <div className="shopify-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <h3 className="font-[600] text-[14px] text-[#000000]">إشغال المستودعات</h3>
            <span className="shopify-tag-shade !text-[10px]">4 مراكز</span>
          </div>

          <div className="space-y-3 text-[12px]">
            {warehousesList.map((w, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-[8px] bg-[#fbfbf5] border border-[#e4e4e7]">
                <div>
                  <div className="font-[500] text-[13px] text-[#000000]">{w.name}</div>
                  <div className="text-[11px] text-[#71717a]">{w.capacity} • {w.usage} إشغال</div>
                </div>
                <span className="shopify-tag-mint !text-[11px]">
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts Receivable Card */}
        <div className="shopify-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <div>
              <h3 className="font-[600] text-[14px] text-[#000000]">المستحقات والتسويات المالية</h3>
              <div className="text-[20px] font-[600] font-mono text-[#000000] mt-1">$299,100</div>
            </div>
            <button
              onClick={() => setCurrentView('invoices_ledger')}
              className="btn-shopify-outline !py-1.5 !px-3.5 !text-[12px]"
            >
              دفتر الأستاذ
            </button>
          </div>

          <div className="space-y-2 text-[12px]">
            {accountsReceivable.map((deb, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-[#e4e4e7] last:border-0">
                <span className="text-[#000000] font-[500] truncate max-w-[140px]">{deb.client}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[#000000] font-[600]">{deb.amount}</span>
                  <span className="text-[10px] text-[#71717a]">{deb.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Mobile App Suite Showcase Card (Shopify Design System) */}
      <div className="shopify-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-[#ffffff] border border-[#e4e4e7]">
        <div className="space-y-3 max-w-xl">
          <div className="shopify-tag-mint">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Sudanil Mobile App Suite • iOS & Android</span>
          </div>
          <h3 className="text-[22px] font-[500] text-[#000000] tracking-tight">
            تطبيق الجوال الذكي — إدارة الشحنات، التتبع اللحظي، والدفع الفوري
          </h3>
          <p className="text-[14px] text-[#52525b] leading-relaxed">
            تمتع بتجربة متكاملة عبر هاتفك الذكي لإدارة الشحنات، متابعة مراحل النقل على الخريطة التفاعلية، سداد الفواتير عبر بنكك، وتصدير التقارير.
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setCurrentView('mobile_app')}
              className="btn-shopify-pill"
            >
              <Smartphone className="w-4 h-4" />
              <span>فتح محاكي تطبيق الجوال (8 شاشات)</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => showToast('تحميل التطبيق', 'جاري تجهيز حزمة PWA للتثبيت المباشر', 'success')}
              className="btn-shopify-outline"
            >
              <span>تحميل تطبيق الويب PWA</span>
            </button>
          </div>
        </div>

        <div
          onClick={() => setCurrentView('mobile_app')}
          className="w-full md:w-[360px] h-[190px] rounded-[16px] overflow-hidden bg-[#fbfbf5] border border-[#e4e4e7] cursor-pointer group flex items-center justify-center p-3 shadow-sm hover:shadow-md transition-shadow"
        >
          <Image
            src="/images/mobile-app-showcase.png"
            alt="Mobile App Preview"
            width={336}
            height={180}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
}
