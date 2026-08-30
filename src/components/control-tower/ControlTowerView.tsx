'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

export function ControlTowerView() {
  const { shipments, lang, setCurrentView } = useApp();

  const [dateFilter] = useState('20 مايو - 27 مايو 2024');
  const [, setSelectedCityNode] = useState<string | null>(null);

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
      statusBg: 'bg-[#F4F4F4] text-[#171A20] border-[#D0D1D2]',
      eta: '10:30 - مايو 10',
      vehicle: 'شاحنة فلات 40 قدم',
    },
    {
      code: 'SDN-2024-1257',
      route: 'كسلا ➔ الخرطوم',
      status: 'في الطريق',
      statusType: 'in_transit',
      statusBg: 'bg-[#F4F4F4] text-[#171A20] border-[#D0D1D2]',
      eta: '04:15 - مايو 27',
      vehicle: 'شاحنة مبردة',
    },
    {
      code: 'SDN-2024-1258',
      route: 'الأبيض ➔ كوستي',
      status: 'تأخير',
      statusType: 'delayed',
      statusBg: 'bg-[#F4F4F4] text-[#393C41] border-[#D0D1D2]',
      eta: '13:41 - مايو 27',
      vehicle: 'شاحنة ثقيلة',
    },
    {
      code: 'SDN-2024-1259',
      route: 'بورتسودان ➔ دنقلا',
      status: 'في المستودع',
      statusType: 'warehoused',
      statusBg: 'bg-[#F4F4F4] text-[#171A20] border-[#D0D1D2]',
      eta: '-',
      vehicle: 'مستودع تخزين',
    },
    {
      code: 'SDN-2024-1260',
      route: 'سنار ➔ القضارف',
      status: 'تم التسليم',
      statusType: 'delivered',
      statusBg: 'bg-[#F4F4F4] text-[#171A20] border-[#D0D1D2]',
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
    { name: 'مستودع الخرطوم', capacity: '10,000 م²', usage: '85%', status: 'جيد' },
    { name: 'مستودع بورتسودان', capacity: '8,000 م²', usage: '72%', status: 'جيد' },
    { name: 'مستودع كوستي', capacity: '5,000 م²', usage: '90%', status: 'مرتفع' },
    { name: 'مستودع الأبيض', capacity: '3,000 م²', usage: '65%', status: 'جيد' },
  ];

  // Accounts receivable debts
  const accountsReceivable = [
    { client: 'شركة كينتريدنج', amount: '$125,000', status: 'مستحقة' },
    { client: 'مؤسسة الشرق للتوريد', amount: '$98,500', status: 'مستحقة' },
    { client: 'شركة استلام العالمية', amount: '$75,250', status: 'مستحقة' },
    { client: 'مؤسسة السودان المتحدة', amount: '$58,030', status: 'مستحقة' },
    { client: 'أخرى', amount: '$100,000', status: 'مستحقة' },
  ];

  return (
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Filter & Date Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-[4px] border border-[#EEEEEE]">
        <div>
          <h2 className="text-[17px] font-[500] text-[#171A20] flex items-center gap-2">
            <span>لوحة التحكم الرئيسية</span>
            <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] font-mono">
              Live Telemetry
            </span>
          </h2>
          <p className="text-[14px] font-[400] text-[#5C5E62]">
            منصة سودانيل اللوجستية — رصد وإدارة حركة الشحنات والأسطول في الوقت الفعلي
          </p>
        </div>
      </div>

      {/* Multimodal Logistics Hero Banner */}
      <div className="relative rounded-[4px] overflow-hidden border border-[#EEEEEE] bg-[#171A20] min-h-[220px] sm:min-h-[260px] flex items-end p-6 group">
        <img
          src="/images/hero-multimodal.jpg"
          alt="Sudaneel Multimodal Logistics Fleet"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-[1.02] transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171A20] via-[#171A20]/40 to-transparent"></div>

        <div className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-white/20 backdrop-blur-md text-white text-[11px] font-[500] uppercase font-mono">
              <span className="w-2 h-2 rounded-full bg-[#3E6AE1] animate-pulse"></span>
              <span>Sovereign Multimodal Network</span>
            </div>
            <h1 className="text-[22px] sm:text-[28px] font-[500] text-white tracking-tight">
              نقل بثقة .. نوصل باحتراف
            </h1>
            <p className="text-[13px] text-[#D0D1D2] font-[400] leading-relaxed">
              منظومة لوجستية متكاملة تربط الموانئ البحرية، النقل البري، الشحن الجوي، والمستودعات الذكية عبر ممرات السودان الاستراتيجية.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-[4px] border border-white/20 text-white text-[12px] font-mono">
            <div className="text-center px-3 border-e border-white/20">
              <div className="text-[16px] font-[500] text-[#3E6AE1]">99.4%</div>
              <div className="text-[10px] text-[#D0D1D2]">OTD Rate</div>
            </div>
            <div className="text-center px-3 border-e border-white/20">
              <div className="text-[16px] font-[500]">48</div>
              <div className="text-[10px] text-[#D0D1D2]">Live Convoys</div>
            </div>
            <div className="text-center px-3">
              <div className="text-[16px] font-[500] text-white">2.4M T</div>
              <div className="text-[10px] text-[#D0D1D2]">YTD Freight</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards (Pure Tesla Minimalist Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: إجمالي الشحنات */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-2">
          <div className="flex items-center justify-between text-[13px] text-[#5C5E62]">
            <span>إجمالي الشحنات</span>
            <Package className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[24px] font-[500] font-mono text-[#171A20]">2,450</div>
          <div className="text-[11px] text-[#5C5E62] font-[400] flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#3E6AE1]" />
            <span>+12.5% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 2: الشحنات في الطريق */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-2">
          <div className="flex items-center justify-between text-[13px] text-[#5C5E62]">
            <span>الشحنات في الطريق</span>
            <Truck className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[24px] font-[500] font-mono text-[#171A20]">1,248</div>
          <div className="text-[11px] text-[#5C5E62] font-[400] flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#3E6AE1]" />
            <span>+8.2% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 3: الشحنات المكتملة */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-2">
          <div className="flex items-center justify-between text-[13px] text-[#5C5E62]">
            <span>الشحنات المكتملة</span>
            <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[24px] font-[500] font-mono text-[#171A20]">1,052</div>
          <div className="text-[11px] text-[#5C5E62] font-[400] flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#3E6AE1]" />
            <span>+15.7% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 4: إجمالي الإيرادات */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-2">
          <div className="flex items-center justify-between text-[13px] text-[#5C5E62]">
            <span>إجمالي الإيرادات</span>
            <Wallet className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[24px] font-[500] font-mono text-[#171A20]">$2,456,890</div>
          <div className="text-[11px] text-[#5C5E62] font-[400] flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#3E6AE1]" />
            <span>+18.3% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 5: العملاء النشطين */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-2">
          <div className="flex items-center justify-between text-[13px] text-[#5C5E62]">
            <span>العملاء النشطين</span>
            <Users className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[24px] font-[500] font-mono text-[#171A20]">856</div>
          <div className="text-[11px] text-[#5C5E62] font-[400] flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#3E6AE1]" />
            <span>+4% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 6: نسبة الالتزام بالتسليم */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-2">
          <div className="flex items-center justify-between text-[13px] text-[#5C5E62]">
            <span>نسبة الالتزام (OTD)</span>
            <Target className="w-4 h-4 text-[#3E6AE1]" />
          </div>
          <div className="text-[24px] font-[500] font-mono text-[#171A20]">98.2%</div>
          <div className="text-[11px] text-[#5C5E62] font-[400] flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-[#3E6AE1]" />
            <span>+2.4% عن الأسبوع الماضي</span>
          </div>
        </div>
      </div>

      {/* Row 1 Grid: Map + Stream Table + Type Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sudan Live Telemetry Map (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col justify-between overflow-hidden min-h-[380px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[14px] text-[#171A20] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#3E6AE1]" />
              <span>خريطة تتبع الشحنات المباشرة</span>
            </h3>
            <span className="text-[12px] font-[400] text-[#5C5E62]">18 ولاية</span>
          </div>

          {/* Map Canvas with Sudan Cartography */}
          <div className="relative flex-1 my-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] overflow-hidden min-h-[260px]">
            {/* Background SVG Grid & Sudan Outline */}
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#D0D1D2" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <line x1="78%" y1="24%" x2="52%" y2="48%" stroke="#3E6AE1" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="38%" y1="26%" x2="52%" y2="48%" stroke="#3E6AE1" strokeWidth="1.5" />
              <line x1="84%" y1="46%" x2="52%" y2="48%" stroke="#3E6AE1" strokeWidth="1.5" />
              <line x1="74%" y1="58%" x2="60%" y2="62%" stroke="#3E6AE1" strokeWidth="1.5" />
              <line x1="60%" y1="62%" x2="46%" y2="64%" stroke="#393C41" strokeWidth="2" />
              <line x1="46%" y1="64%" x2="32%" y2="68%" stroke="#393C41" strokeWidth="1.5" />
            </svg>

            {/* Live Moving Truck Icon on Khartoum-PortSudan Corridor */}
            <div className="absolute top-[34%] left-[64%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-[#FFFFFF] border border-[#3E6AE1] text-[#171A20] text-[11px] font-[500]">
              <Truck className="w-3.5 h-3.5 text-[#3E6AE1]" />
              <span>SDN-1256 (68 km/h)</span>
            </div>

            {/* City Nodes */}
            {mapNodes.map((node, idx) => (
              <div
                key={idx}
                style={{ top: node.top, left: node.left }}
                onClick={() => setSelectedCityNode(node.nameAr)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 text-center cursor-pointer group"
              >
                <div className="w-3 h-3 rounded-full mx-auto bg-[#3E6AE1] border border-white" />
                <span className="text-[11px] font-[500] text-[#171A20] bg-white px-1.5 py-0.5 rounded-[2px] border border-[#D0D1D2] block mt-1">
                  {node.nameAr}
                </span>
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-1 z-20">
              <button className="w-7 h-7 rounded-[2px] bg-white border border-[#D0D1D2] text-[#171A20] flex items-center justify-center hover:bg-[#F4F4F4]">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-[2px] bg-white border border-[#D0D1D2] text-[#171A20] flex items-center justify-center hover:bg-[#F4F4F4]">
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Shipments Stream Table (4 cols) */}
        <div className="lg:col-span-4 p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[14px] text-[#171A20]">الشحنات النشطة</h3>
            <span className="text-[12px] font-[400] text-[#5C5E62]">تحديث فوري</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-[13px]">
              <thead>
                <tr className="border-b border-[#EEEEEE] text-[#8E8E8E] text-[11px]">
                  <th className="pb-2 text-start font-[500]">رقم الشحنة</th>
                  <th className="pb-2 text-start font-[500]">المسار</th>
                  <th className="pb-2 text-start font-[500]">الحالة</th>
                  <th className="pb-2 text-end font-[500]">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE] font-[400]">
                {streamShipments.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F4F4] transition-colors duration-330">
                    <td className="py-2.5 font-mono text-[#3E6AE1] font-[500]">{s.code}</td>
                    <td className="py-2.5 text-[#171A20] truncate max-w-[110px]">{s.route}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-[2px] text-[11px] font-[500] border ${s.statusBg}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-end font-mono text-[11px] text-[#5C5E62]">{s.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications & Distribution (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Notifications Feed */}
          <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
              <h3 className="font-[500] text-[13px] text-[#171A20]">التنبيهات والإشعارات</h3>
              <span className="text-[11px] text-[#5C5E62]">3 جديدة</span>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="p-2.5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#3E6AE1] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-[500] text-[#171A20]">تأخير في التسليم</div>
                  <div className="text-[#5C5E62] text-[11px]">الشحنة SDN-2024-1258 تأخرت 15 دقيقة</div>
                </div>
              </div>

              <div className="p-2.5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-start gap-2">
                <Wrench className="w-4 h-4 text-[#5C5E62] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-[500] text-[#171A20]">صيانة مطلوبة</div>
                  <div className="text-[#5C5E62] text-[11px]">المركبة TR-4562 تحتاج إلى فحص دوري</div>
                </div>
              </div>

              <div className="p-2.5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3E6AE1] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-[500] text-[#171A20]">تم التسليم بنجاح</div>
                  <div className="text-[#5C5E62] text-[11px]">تم تسليم الشحنة SDN-1255 بميناء بورتسودان</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Driver Performance + Fleet + Warehouses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Driver Performance Table */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[13px] text-[#171A20]">أداء السائقين</h3>
            <span className="text-[11px] text-[#5C5E62]">أعلى تقييم</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-[12px]">
              <thead>
                <tr className="border-b border-[#EEEEEE] text-[#8E8E8E] text-[10px]">
                  <th className="pb-1.5 text-start font-[500]">السائق</th>
                  <th className="pb-1.5 text-center font-[500]">الرحلات</th>
                  <th className="pb-1.5 text-center font-[500]">الالتزام</th>
                  <th className="pb-1.5 text-end font-[500]">التقييم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEEEEE] font-[400]">
                {driversList.map((d, idx) => (
                  <tr key={idx} className="hover:bg-[#F4F4F4]">
                    <td className="py-2 font-[500] text-[#171A20]">{d.name}</td>
                    <td className="py-2 text-center font-mono">{d.trips}</td>
                    <td className="py-2 text-center font-mono text-[#3E6AE1]">{d.compliance}</td>
                    <td className="py-2 text-end font-mono flex items-center justify-end gap-0.5">
                      <Star className="w-3 h-3 fill-[#171A20] text-[#171A20]" />
                      <span>{d.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet & Fuel Stats Card */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[13px] text-[#171A20]">إدارة الأسطول</h3>
            <span className="text-[11px] text-[#3E6AE1] font-mono">83.7% Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-[12px]">
            <div className="p-2.5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[10px] text-[#5C5E62] block">إجمالي المركبات</span>
              <span className="text-[18px] font-[500] font-mono text-[#171A20]">356</span>
            </div>
            <div className="p-2.5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[10px] text-[#5C5E62] block">المركبات النشطة</span>
              <span className="text-[18px] font-[500] font-mono text-[#3E6AE1]">298</span>
            </div>
            <div className="p-2.5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[10px] text-[#5C5E62] block">استهلاك الوقود</span>
              <span className="text-[15px] font-[500] font-mono text-[#171A20]">32.5 لتر/100كم</span>
            </div>
            <div className="p-2.5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
              <span className="text-[10px] text-[#5C5E62] block">متوسط عمر الأسطول</span>
              <span className="text-[15px] font-[500] font-mono text-[#171A20]">4.2 سنوات</span>
            </div>
          </div>
        </div>

        {/* Warehouses Utilization */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <h3 className="font-[500] text-[13px] text-[#171A20]">المستودعات</h3>
            <span className="text-[11px] text-[#5C5E62]">4 مراكز</span>
          </div>

          <div className="space-y-2 text-[12px]">
            {warehousesList.map((w, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                <div>
                  <div className="font-[500] text-[#171A20]">{w.name}</div>
                  <div className="text-[10px] text-[#5C5E62]">{w.capacity} • {w.usage} إشغال</div>
                </div>
                <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-[500] bg-white border border-[#D0D1D2]">
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts Receivable Card */}
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <div>
              <h3 className="font-[500] text-[13px] text-[#171A20]">المدفوعات المستحقة</h3>
              <div className="text-[16px] font-[500] font-mono text-[#171A20] mt-0.5">$456,780</div>
            </div>
          </div>

          <div className="space-y-1.5 text-[12px]">
            {accountsReceivable.map((deb, idx) => (
              <div key={idx} className="flex items-center justify-between py-1 border-b border-[#EEEEEE] last:border-0">
                <span className="text-[#393C41] truncate max-w-[130px]">{deb.client}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[#171A20] font-[500]">{deb.amount}</span>
                  <span className="text-[10px] text-[#5C5E62]">{deb.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Mobile App Suite Showcase Card */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#F4F4F4] text-[#3E6AE1] text-[11px] font-mono font-[500]">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Sudanil Mobile App Suite (iOS & Android)</span>
          </div>
          <h3 className="text-[18px] font-[500] text-[#171A20]">
            تطبيق الجوال الذكي — تتبع لحظي، طلب شحنات، ومحفظة إلكترونية
          </h3>
          <p className="text-[13px] text-[#5C5E62] leading-relaxed">
            تمتع بتجربة متكاملة عبر هاتفك الذكي لإدارة الشحنات، متابعة مراحل النقل على الخريطة التفاعلية، سداد الفواتير عبر بنكك، وتصدير التقارير.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentView('mobile_app')}
              className="btn-tesla-primary !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>استعراض محاكي تطبيق الجوال (8 شاشات)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          onClick={() => setCurrentView('mobile_app')}
          className="w-full md:w-[320px] h-[160px] rounded-[4px] overflow-hidden bg-[#F4F4F4] border border-[#EEEEEE] cursor-pointer group flex items-center justify-center p-2"
        >
          <img
            src="/images/mobile-app-showcase.png"
            alt="Mobile App Preview"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-330"
          />
        </div>
      </div>
    </div>
  );
}
