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
  ChevronDown,
  Calendar,
  AlertTriangle,
  Wrench,
  Info,
  Clock,
  Plus,
  Minus,
  Maximize2,
  Compass,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Building2,
  DollarSign,
  Star,
  Activity,
  Fuel,
} from 'lucide-react';

export function ControlTowerView() {
  const { shipments, vehicles, lang, setSelectedShipmentId, setCurrentView } = useApp();

  const [dateFilter, setDateFilter] = useState('20 مايو 27 مايو 2024');
  const [selectedCityNode, setSelectedCityNode] = useState<string | null>(null);

  // Cities on Sudan Corridor Map with coordinates (Percentage on map canvas)
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

  // Active shipments stream from Screenshot 1
  const streamShipments = [
    {
      code: 'SDN-2024-1256',
      route: 'الخرطوم ➔ بورتسودان',
      status: 'في الطريق',
      statusType: 'in_transit',
      statusBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      eta: '10:30 - مايو 10',
      vehicle: 'شاحنة فلات 40 قدم',
    },
    {
      code: 'SDN-2024-1257',
      route: 'كسلا ➔ الخرطوم',
      status: 'في الطريق',
      statusType: 'in_transit',
      statusBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      eta: '04:15 - مايو 27',
      vehicle: 'شاحنة مبردة',
    },
    {
      code: 'SDN-2024-1258',
      route: 'الأبيض ➔ كوستي',
      status: 'تأخير',
      statusType: 'delayed',
      statusBg: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      eta: '13:41 - مايو 27',
      vehicle: 'شاحنة ثقيلة',
    },
    {
      code: 'SDN-2024-1259',
      route: 'بورتسودان ➔ دنقلا',
      status: 'في المستودع',
      statusType: 'warehoused',
      statusBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      eta: '-',
      vehicle: 'مستودع تخزين',
    },
    {
      code: 'SDN-2024-1260',
      route: 'سنار ➔ القضارف',
      status: 'تم التسليم',
      statusType: 'delivered',
      statusBg: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
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
    { name: 'مستودع الخرطوم', capacity: '10,000 م²', usage: '85%', status: 'جيد', statusBg: 'bg-emerald-500/20 text-emerald-400' },
    { name: 'مستودع بورتسودان', capacity: '8,000 م²', usage: '72%', status: 'جيد', statusBg: 'bg-emerald-500/20 text-emerald-400' },
    { name: 'مستودع كوستي', capacity: '5,000 م²', usage: '90%', status: 'مرتفع', statusBg: 'bg-amber-500/20 text-amber-400' },
    { name: 'مستودع الأبيض', capacity: '3,000 م²', usage: '65%', status: 'جيد', statusBg: 'bg-emerald-500/20 text-emerald-400' },
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
    <div className="space-y-4 font-sans text-gray-100">
      {/* Top Filter & Date Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-navy-900/60 p-3 rounded-2xl border border-sky-500/15 backdrop-blur-md">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>لوحة التحكم الرئيسية</span>
            <span className="text-xs px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono">Live Operations</span>
          </h2>
          <p className="text-xs text-gray-400">مرحبا بك في منصة سودانيل لوجستك — متابعة حركة الأسطول والشحنات في الوقت الفعلي</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-950 border border-sky-500/20 text-xs font-semibold text-gray-200">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>{dateFilter}</span>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md cursor-pointer">
            اليوم
          </span>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards (Matching Screenshot 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: إجمالي الشحنات */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl relative overflow-hidden group hover:border-sky-400/50 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>إجمالي الشحنات</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">2,450</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+12.5% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 2: الشحنات في الطريق */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-emerald-500/30 shadow-xl relative overflow-hidden group hover:border-emerald-400/50 transition-all">
          <div className="flex items-center justify-between text-xs text-emerald-300 mb-1">
            <span>الشحنات في الطريق</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">1,248</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+8.2% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 3: الشحنات المكتملة */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl relative overflow-hidden group hover:border-sky-400/50 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>الشحنات المكتملة</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">1,052</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+15.7% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 4: إجمالي الإيرادات */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/30 shadow-xl relative overflow-hidden group hover:border-gold/60 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>إجمالي الإيرادات</span>
            <div className="p-2 rounded-xl bg-gold/20 text-gold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">$2,456,890</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18.3% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 5: العملاء النشطين */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-purple-500/25 shadow-xl relative overflow-hidden group hover:border-purple-400/50 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>العملاء النشطين</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">856</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+4% عن الأسبوع الماضي</span>
          </div>
        </div>

        {/* Card 6: نسبة الالتزام بالتسليم */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-sky-500/25 shadow-xl relative overflow-hidden group hover:border-sky-400/50 transition-all">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>نسبة الالتزام بالتسليم</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-white">98.2%</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+2.4% عن الأسبوع الماضي</span>
          </div>
        </div>
      </div>

      {/* Row 1 Grid: Map + Stream Table + Type Donut + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Sudan Live Telemetry Map (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl relative min-h-[380px] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>خريطة تتبع الشحنات المباشرة</span>
            </h3>
            <button className="text-[11px] text-sky-400 hover:text-white transition-colors cursor-pointer">
              عرض الكل &gt;
            </button>
          </div>

          {/* Map Canvas with Sudan Cartography */}
          <div className="relative flex-1 my-3 rounded-xl bg-[#06102b] border border-sky-500/20 overflow-hidden min-h-[280px]">
            {/* Background SVG Grid & Sudan Outline */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e60ff" strokeWidth="0.5" strokeOpacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Corridor Connecting Lines */}
              <line x1="78%" y1="24%" x2="52%" y2="48%" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
              <line x1="38%" y1="26%" x2="52%" y2="48%" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="84%" y1="46%" x2="52%" y2="48%" stroke="#10b981" strokeWidth="1.5" />
              <line x1="74%" y1="58%" x2="60%" y2="62%" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="60%" y1="62%" x2="46%" y2="64%" stroke="#ef4444" strokeWidth="2" />
              <line x1="46%" y1="64%" x2="32%" y2="68%" stroke="#f59e0b" strokeWidth="1.5" />
            </svg>

            {/* Live Moving Truck Icon on Khartoum-PortSudan Corridor */}
            <div className="absolute top-[34%] left-[64%] -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-emerald-950 border border-emerald-400 text-emerald-300 text-[10px] font-bold shadow-xl animate-bounce">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
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
                <div
                  className={`w-3.5 h-3.5 rounded-full mx-auto border-2 transition-transform group-hover:scale-150 ${
                    node.status === 'in_transit'
                      ? 'bg-emerald-400 border-emerald-200 animate-ping'
                      : node.status === 'delayed'
                      ? 'bg-rose-500 border-rose-200 animate-pulse'
                      : node.status === 'warehoused'
                      ? 'bg-amber-400 border-amber-200'
                      : 'bg-sky-400 border-sky-200'
                  }`}
                />
                <span className="text-[10px] font-bold text-white bg-navy-950/90 px-1.5 py-0.5 rounded shadow border border-sky-500/20 block mt-1">
                  {node.nameAr}
                </span>
              </div>
            ))}

            {/* Map Controls */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-1 z-20">
              <button className="w-7 h-7 rounded-lg bg-navy-950 border border-sky-500/30 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-navy-950 border border-sky-500/30 text-white flex items-center justify-center hover:bg-sky-600 transition-colors">
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Map Legend (Top-Right) */}
            <div className="absolute top-3 right-3 p-2 rounded-xl bg-navy-950/90 border border-sky-500/20 text-[10px] space-y-1 z-20">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>في الطريق</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span>تأخير</span>
              </div>
              <div className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>تم التسليم</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>في المستودع</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Shipments Stream Table (3.5 cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <h3 className="font-bold text-xs sm:text-sm text-white">الشحنات النشطة</h3>
            <button className="text-[11px] text-sky-400 hover:text-white transition-colors cursor-pointer">
              عرض الكل &gt;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-navy-800 text-gray-400 text-[10px]">
                  <th className="pb-2 text-start">رقم الشحنة</th>
                  <th className="pb-2 text-start">المسار</th>
                  <th className="pb-2 text-start">الحالة</th>
                  <th className="pb-2 text-end">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-medium">
                {streamShipments.map((s, idx) => (
                  <tr key={idx} className="hover:bg-navy-800/40 transition-colors">
                    <td className="py-2.5 font-mono text-sky-300 font-bold">{s.code}</td>
                    <td className="py-2.5 text-gray-200 text-[11px] truncate max-w-[110px]">{s.route}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${s.statusBg}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-end font-mono text-[10px] text-gray-400">{s.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Donut Distribution & Notifications Feed (3.5 cols) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Donut Chart: By Type */}
          <div className="p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-sky-500/10">
              <h3 className="font-bold text-xs text-white">توزيع الشحنات حسب النوع</h3>
              <button className="text-[10px] text-sky-400">عرض الكل &gt;</button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                {/* SVG Donut */}
                <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="#1e60ff" strokeWidth="4" strokeDasharray="68 32" strokeDashoffset="0" />
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-68" />
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="#eab308" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-86" />
                  <circle cx="18" cy="18" r="14" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray="4 96" strokeDashoffset="-96" />
                </svg>
                <div className="absolute text-center">
                  <div className="text-xs font-bold font-mono text-white">2,450</div>
                  <div className="text-[8px] text-gray-400">إجمالي</div>
                </div>
              </div>

              <div className="text-[10px] space-y-1 flex-1">
                <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span>النقل البري</span><span className="font-mono font-bold">68%</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400"></span>النقل البحري</span><span className="font-mono font-bold">18%</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span>النقل الجوي</span><span className="font-mono font-bold">10%</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>التخليص الجمركي</span><span className="font-mono font-bold">4%</span></div>
              </div>
            </div>
          </div>

          {/* Notifications Feed */}
          <div className="p-3.5 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-sky-500/10">
              <h3 className="font-bold text-xs text-white">التنبيهات والإشعارات</h3>
              <button className="text-[10px] text-sky-400">عرض الكل &gt;</button>
            </div>

            <div className="space-y-1.5 text-[10px]">
              <div className="p-2 rounded-xl bg-navy-950 border border-rose-500/30 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-white">تأخير في التسليم</div>
                  <div className="text-gray-400 text-[9px]">الشحنة SDN-2024-1258 تأخرت 15 دقيقة</div>
                </div>
                <span className="text-gray-500 font-mono">15 د</span>
              </div>

              <div className="p-2 rounded-xl bg-navy-950 border border-amber-500/30 flex items-start gap-2">
                <Wrench className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-white">صيانة مطلوبة</div>
                  <div className="text-gray-400 text-[9px]">المركبة TR-4562 تحتاج إلى صيانة دورية</div>
                </div>
                <span className="text-gray-500 font-mono">45 د</span>
              </div>

              <div className="p-2 rounded-xl bg-navy-950 border border-sky-500/30 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-white">تم التسليم بنجاح</div>
                  <div className="text-gray-400 text-[9px]">تم تسليم الشحنة SDN-1255 بميناء بورتسودان</div>
                </div>
                <span className="text-gray-500 font-mono">2 س</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 Grid: Revenue vs Expenses Multi-Line + Status Donut + Corridor Horizontal Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Revenue Multi-Line Chart (4.5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-white">الإيرادات والتدفق المالي</h3>
              <div className="text-lg font-black font-mono text-white mt-0.5">$2,456,890</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400">هذا الشهر</span>
              <button className="text-[10px] text-sky-400">عرض الكل &gt;</button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="h-40 w-full relative pt-2">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e60ff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1e60ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#1e293b" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#1e293b" strokeWidth="0.5" />

              {/* Area 1: Revenue */}
              <path d="M0,70 Q50,40 100,55 T200,30 T300,15 L300,100 L0,100 Z" fill="url(#revenueGrad)" />
              {/* Line 1: Revenue */}
              <path d="M0,70 Q50,40 100,55 T200,30 T300,15" fill="none" stroke="#2563eb" strokeWidth="2.5" />
              {/* Line 2: Expenses */}
              <path d="M0,85 Q50,70 100,75 T200,60 T300,45" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
            <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1">
              <span>1 مايو</span>
              <span>6 مايو</span>
              <span>11 مايو</span>
              <span>16 مايو</span>
              <span>21 مايو</span>
              <span>26 مايو</span>
            </div>
          </div>
        </div>

        {/* Status Donut Chart (3.5 cols) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <h3 className="font-bold text-xs sm:text-sm text-white">الشحنات حسب الحالة</h3>
            <button className="text-[10px] text-sky-400">عرض الكل &gt;</button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="51 49" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#3b82f6" strokeWidth="4" strokeDasharray="43 57" strokeDashoffset="-51" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="4 96" strokeDashoffset="-94" />
                <circle cx="18" cy="18" r="14" fill="transparent" stroke="#ef4444" strokeWidth="4" strokeDasharray="2 98" strokeDashoffset="-98" />
              </svg>
              <div className="absolute text-center">
                <div className="text-sm font-black font-mono text-white">2,450</div>
                <div className="text-[9px] text-gray-400">إجمالي</div>
              </div>
            </div>

            <div className="text-[10px] space-y-1.5 flex-1">
              <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>في الطريق</span><span className="font-mono font-bold">1,248 (50.9%)</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span>تم التسليم</span><span className="font-mono font-bold">1,052 (42.9%)</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>في المستودع</span><span className="font-mono font-bold">98 (4.0%)</span></div>
              <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span>تأخير</span><span className="font-mono font-bold">52 (2.1%)</span></div>
            </div>
          </div>
        </div>

        {/* Corridor Horizontal Bar Chart (4 cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <h3 className="font-bold text-xs sm:text-sm text-white">الشحنات حسب المسار</h3>
            <span className="text-[10px] text-gray-400 font-mono">هذا الشهر</span>
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-semibold text-gray-200">
                <span>الخرطوم ➔ بورتسودان</span>
                <span className="font-mono font-bold text-sky-400">456 شحنة</span>
              </div>
              <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 font-semibold text-gray-200">
                <span>الخرطوم ➔ كوستي</span>
                <span className="font-mono font-bold text-sky-400">312 شحنة</span>
              </div>
              <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 font-semibold text-gray-200">
                <span>كسلا ➔ الخرطوم</span>
                <span className="font-mono font-bold text-sky-400">289 شحنة</span>
              </div>
              <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1 font-semibold text-gray-200">
                <span>بورتسودان ➔ دنقلا</span>
                <span className="font-mono font-bold text-sky-400">245 شحنة</span>
              </div>
              <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '54%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 Grid: Driver Performance + Fleet/Fuel + Warehouses + Accounts Receivable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Driver Performance Table */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <h3 className="font-bold text-xs text-white">أداء السائقين</h3>
            <button className="text-[10px] text-sky-400">عرض الكل &gt;</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-navy-800 text-gray-400 text-[10px]">
                  <th className="pb-1.5 text-start">السائق</th>
                  <th className="pb-1.5 text-center">الرحلات</th>
                  <th className="pb-1.5 text-center">الالتزام</th>
                  <th className="pb-1.5 text-end">التقييم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 font-medium">
                {driversList.map((d, idx) => (
                  <tr key={idx} className="hover:bg-navy-800/40">
                    <td className="py-2 font-semibold text-white text-[11px]">{d.name}</td>
                    <td className="py-2 text-center font-mono">{d.trips}</td>
                    <td className="py-2 text-center font-mono text-emerald-400">{d.compliance}</td>
                    <td className="py-2 text-end font-mono text-gold flex items-center justify-end gap-0.5">
                      <Star className="w-3 h-3 fill-gold text-gold" />
                      <span>{d.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fleet & Fuel Stats Card */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <h3 className="font-bold text-xs text-white">إدارة الأسطول والوقود</h3>
            <span className="text-[10px] text-emerald-400 font-mono">83.7% Active</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
              <span className="text-[10px] text-gray-400 block">إجمالي المركبات</span>
              <span className="text-lg font-black font-mono text-white">356</span>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
              <span className="text-[10px] text-emerald-300 block">المركبات النشطة</span>
              <span className="text-lg font-black font-mono text-emerald-400">298</span>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
              <span className="text-[10px] text-gray-400 block">استهلاك الوقود</span>
              <span className="text-base font-bold font-mono text-gold">32.5 <span className="text-[9px]">لتر/100كم</span></span>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800">
              <span className="text-[10px] text-gray-400 block">متوسط عمر الأسطول</span>
              <span className="text-base font-bold font-mono text-white">4.2 <span className="text-[9px]">سنوات</span></span>
            </div>
          </div>
        </div>

        {/* Warehouses Utilization */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-sky-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <h3 className="font-bold text-xs text-white">المستودعات</h3>
            <button className="text-[10px] text-sky-400">عرض الكل &gt;</button>
          </div>

          <div className="space-y-2 text-xs">
            {warehousesList.map((w, idx) => (
              <div key={idx} className="flex items-center justify-between p-1.5 rounded-xl bg-navy-950/80 border border-navy-800/80">
                <div>
                  <div className="font-bold text-white text-[11px]">{w.name}</div>
                  <div className="text-[9px] text-gray-400">{w.capacity} • {w.usage} إشغال</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${w.statusBg}`}>
                  {w.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts Receivable Card */}
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/25 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gold/15">
            <div>
              <h3 className="font-bold text-xs text-white">المدفوعات المستحقة</h3>
              <div className="text-base font-black font-mono text-gold mt-0.5">$456,780</div>
            </div>
            <button className="text-[10px] text-gold hover:text-white">عرض الكل &gt;</button>
          </div>

          <div className="space-y-1.5 text-xs">
            {accountsReceivable.map((deb, idx) => (
              <div key={idx} className="flex items-center justify-between text-[11px] py-1 border-b border-navy-800/40 last:border-0">
                <span className="text-gray-300 font-medium truncate max-w-[130px]">{deb.client}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-bold">{deb.amount}</span>
                  <span className="text-[9px] text-amber-400">{deb.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
