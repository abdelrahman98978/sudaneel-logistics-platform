'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Truck,
  Ship,
  Plane,
  Warehouse,
  FileCheck,
  Search,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Globe,
  Bell,
  Moon,
  Sun,
  LogIn,
  UserPlus,
  ArrowRight,
  Package,
  Building2,
  Phone,
  Mail,
  HelpCircle,
  Sparkles,
  ChevronDown,
  Navigation,
  DollarSign,
  Radio,
  Users,
} from 'lucide-react';

export function LandingView() {
  const { setCurrentView, setSelectedShipmentId, shipments, lang, setLang } = useApp();

  const [trackingInput, setTrackingInput] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCountry, setSelectedCountry] = useState('SD');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    const match = shipments.find(
      (s) => s.trackingNumber.toLowerCase() === trackingInput.trim().toLowerCase()
    );
    if (match) {
      setSelectedShipmentId(match.id);
      setCurrentView('tracking_detail');
    } else {
      setCurrentView('public_track');
    }
  };

  // 6 Services matching Screenshot 3
  const coreServices = [
    {
      id: 'road',
      title: 'النقل البري',
      desc: 'حلول نقل بري موثوقة عبر كافة الولايات والمنافذ الحدودية',
      icon: Truck,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
    },
    {
      id: 'sea',
      title: 'الشحن البحري',
      desc: 'ربط السودان بالأسواق العالمية عبر ميناء بورتسودان',
      icon: Ship,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
    },
    {
      id: 'air',
      title: 'الشحن الجوي',
      desc: 'سرعة وكفاءة أعلى للشحنات الحساسة والطبية العاجلة',
      icon: Plane,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      id: 'warehousing',
      title: 'المستودعات',
      desc: 'إدارة مخزون ذكية وتخزين جاف ومبرد ومستودعات جمركية',
      icon: Warehouse,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 'city_distribution',
      title: 'التوزيع داخل المدن',
      desc: 'توصيل سريع وآمن للميل الأخير وإدارة شبكات التوزيع',
      icon: Package,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      id: 'customs',
      title: 'التخليص الجمركي',
      desc: 'إجراءات سلسة ومتوافقة وتخليص رقمي فوري في المنافذ',
      icon: FileCheck,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="space-y-12 pb-20 font-sans text-gray-100 selection:bg-gold selection:text-navy-950">
      {/* Top Navbar (Matching Screenshot 3) */}
      <header className="sticky top-3 z-50 rounded-2xl bg-navy-900/95 border border-sky-500/30 p-3 sm:p-4 shadow-2xl flex items-center justify-between backdrop-blur-xl transition-all">
        {/* Brand Logo on Right (in Arabic RTL) */}
        <div onClick={() => setActiveTab('home')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/30 to-amber-500/20 border border-gold/50 flex items-center justify-center text-gold shadow-lg shadow-gold/10">
            <Radio className="w-5 h-5 text-gold animate-pulse" />
          </div>
          <div>
            <h1 className="font-black text-base text-white tracking-tight flex items-center gap-1.5">
              <span>منصة سودانيل اللوجستية</span>
            </h1>
            <p className="text-[10px] text-gray-400">حلول لوجستية ذكية - لسلسلة إمداد أقوى</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-navy-950/90 p-1.5 rounded-xl border border-sky-500/20 text-xs font-bold">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'home' ? 'bg-sky-600 text-white shadow-md font-extrabold' : 'text-gray-300 hover:text-white'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'services' ? 'bg-sky-600 text-white shadow-md font-extrabold' : 'text-gray-300 hover:text-white'
            }`}
          >
            <span>الخدمات</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => setCurrentView('carrier_portal')}
            className="px-4 py-2 rounded-lg transition-all cursor-pointer text-gray-300 hover:text-white"
          >
            الشركات
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'pricing' ? 'bg-sky-600 text-white shadow-md font-extrabold' : 'text-gray-300 hover:text-white'
            }`}
          >
            الأسعار
          </button>
          <button
            onClick={() => setCurrentView('public_track')}
            className="px-4 py-2 rounded-lg transition-all cursor-pointer text-gray-300 hover:text-white"
          >
            تتبع الشحنة
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'support' ? 'bg-sky-600 text-white shadow-md font-extrabold' : 'text-gray-300 hover:text-white'
            }`}
          >
            الدعم والمساعدة
          </button>
        </nav>

        {/* Right Controls (Country Selector, Notifications, Auth) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Country Selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-navy-950 border border-sky-500/20 text-xs font-semibold text-gray-200">
            <span>🇸🇩</span>
            <span>السودان</span>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-navy-800 border border-sky-500/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="تبديل المظهر"
          >
            {isDarkMode ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Notifications with Badge 3 */}
          <div className="relative">
            <button className="p-2 rounded-xl bg-navy-800 border border-sky-500/20 text-gray-300 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={() => setCurrentView('control_tower')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-sky-500/30 text-xs font-bold text-gray-200 transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-sky-400" />
            <span>تسجيل دخول</span>
          </button>

          {/* Register Button (Electric Blue Pill) */}
          <button
            onClick={() => setCurrentView('create_shipment')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>إنشاء حساب</span>
          </button>
        </div>
      </header>

      {/* Hero Section (Matching Screenshot 3) */}
      <section className="relative rounded-3xl bg-gradient-to-b from-navy-900 via-navy-950 to-[#030712] border border-sky-500/30 p-6 sm:p-12 lg:p-16 shadow-2xl overflow-hidden text-center space-y-8">
        {/* Background Radial Dots */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e60ff_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"></div>

        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300 text-xs font-bold shadow-lg">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
          <span>منصة سودانيل اللوجستية .. شريكك الذكي في سلسلة الإمداد والنقل</span>
        </div>

        {/* Main Hero Headline */}
        <div className="space-y-3 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            <span>منصة سودانيل اللوجستية</span>
          </h1>
          <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            شريكك الذكي في سلسلة الإمداد والنقل والخدمات اللوجستية — نربط السودان بالعالم بكفاءة .. أمان .. واستدامة.
          </p>
        </div>

        {/* 4 Benefit Pill Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 pt-1">
          <span className="px-3 py-1.5 rounded-full bg-navy-900/90 border border-sky-500/20 text-xs font-bold text-gray-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>حلول لوجستية متكاملة</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-navy-900/90 border border-sky-500/20 text-xs font-bold text-gray-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>سرعة في التنفيذ</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-navy-900/90 border border-sky-500/20 text-xs font-bold text-gray-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gold" />
            <span>موثوقية وأمان</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-navy-900/90 border border-sky-500/20 text-xs font-bold text-gray-200 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span>كفاءة أعلى وتكاليف أقل</span>
          </span>
        </div>

        {/* Floating Dual Track & Search Capsule Bar (Matching Screenshot 3) */}
        <div className="max-w-3xl mx-auto pt-4">
          <form
            onSubmit={handleTrackSubmit}
            className="p-2 rounded-2xl bg-white text-navy-950 shadow-2xl flex items-center gap-2 border-2 border-sky-400/50"
          >
            <button
              type="button"
              onClick={() => setCurrentView('public_track')}
              className="px-4 py-2.5 rounded-xl bg-navy-900 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow hover:bg-navy-800 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>تتبع شحنتك</span>
            </button>

            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="أدخل رقم الشحنة أو رقم التتبع (مثال: SDN-88419)..."
              className="flex-1 bg-transparent text-navy-950 placeholder-gray-500 outline-none text-xs sm:text-sm font-semibold px-3 text-start"
            />

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>بحث</span>
            </button>
          </form>
        </div>

        {/* 6 Floating Service Quick Cards (White Cards with Blue Icons - Matching Screenshot 3) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6 max-w-6xl mx-auto">
          {coreServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={() => {
                  if (srv.id === 'road') setCurrentView('marketplace');
                  else if (srv.id === 'warehousing') setCurrentView('warehousing');
                  else if (srv.id === 'customs') setCurrentView('port_sudan');
                  else setCurrentView('create_shipment');
                }}
                className="p-4 rounded-2xl bg-white text-navy-950 shadow-xl hover:shadow-2xl space-y-2 text-center transition-all hover:-translate-y-1.5 cursor-pointer group border border-gray-100"
              >
                <div className={`w-10 h-10 rounded-xl ${srv.bg} ${srv.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-navy-950">{srv.title}</h3>
                <p className="text-[10px] text-gray-500 leading-snug line-clamp-2">{srv.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Live Metric Impact Counters Bar (White Card with 5 Metrics - Matching Screenshot 3) */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white text-navy-950 shadow-xl max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-4 text-center divide-x divide-x-reverse divide-gray-100 border border-gray-100">
          <div className="p-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
              <Ship className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-navy-950">+1200</div>
            <div className="text-xs font-bold text-gray-600 mt-0.5">شحنة شهرية</div>
          </div>

          <div className="p-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
              <Truck className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-navy-950">+450</div>
            <div className="text-xs font-bold text-gray-600 mt-0.5">مركبة لوجستية</div>
          </div>

          <div className="p-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
              <Warehouse className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-navy-950">+85</div>
            <div className="text-xs font-bold text-gray-600 mt-0.5">مستودع وشريك</div>
          </div>

          <div className="p-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-navy-950">12</div>
            <div className="text-xs font-bold text-gray-600 mt-0.5">مركز لوجستي</div>
          </div>

          <div className="p-2 col-span-2 sm:col-span-1">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono text-navy-950">+320</div>
            <div className="text-xs font-bold text-gray-600 mt-0.5">عميل وثيق الثقة</div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Integrated Sudan Network Map + Services Grid + Latest News (Matching Screenshot 3) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Card: شبكة لوجستية متكاملة في السودان (4.5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-navy-900/90 border border-sky-500/25 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
              تغطية سيادية
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">شبكة لوجستية متكاملة في السودان</h3>
            <p className="text-xs text-gray-300">
              نربط الموانئ البحرية والمعابر الحدودية بجميع الولايات والمراكز الصناعية.
            </p>
          </div>

          {/* Interactive Sudan Glow Network Illustration */}
          <div className="relative h-44 rounded-2xl bg-[#040b20] border border-sky-500/20 overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full opacity-60" viewBox="0 0 200 120">
              {/* Grid dots */}
              <circle cx="50" cy="40" r="3" fill="#1e60ff" className="animate-pulse" />
              <circle cx="110" cy="30" r="4" fill="#60a5fa" />
              <circle cx="160" cy="20" r="4" fill="#10b981" />
              <circle cx="90" cy="70" r="4" fill="#3b82f6" />
              <circle cx="140" cy="65" r="3" fill="#f59e0b" />
              <circle cx="60" cy="90" r="3" fill="#ef4444" />
              {/* Connection Lines */}
              <line x1="160" y1="20" x2="110" y2="30" stroke="#60a5fa" strokeWidth="1.5" />
              <line x1="110" y1="30" x2="90" y2="70" stroke="#3b82f6" strokeWidth="1.5" />
              <line x1="90" y1="70" x2="140" y2="65" stroke="#f59e0b" strokeWidth="1" />
              <line x1="90" y1="70" x2="60" y2="90" stroke="#ef4444" strokeWidth="1" />
              <line x1="50" y1="40" x2="110" y2="30" stroke="#1e60ff" strokeWidth="1" />
            </svg>
            <div className="absolute text-center">
              <span className="text-xs font-bold text-sky-300 font-mono">18 ولاية • 150+ محطة</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-gray-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>تغطية شاملة لجميع الولايات والمنافذ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>ربط الموانئ والمطارات والمراكز اللوجستية</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>حلول نقل وتوزيع ذكية وتفريغ فوري</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('control_tower')}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
          >
            اكتشف شبكة الممرات والأسطول
          </button>
        </div>

        {/* Center: خدماتنا Quick Overview (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-navy-900/90 border border-sky-500/25 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <h3 className="font-bold text-base text-white">خدماتنا اللوجستية</h3>
            <button onClick={() => setActiveTab('services')} className="text-xs text-sky-400 hover:text-white">
              عرض جميع الخدمات &gt;
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-center space-y-1 hover:border-sky-500/40 transition-colors">
              <Truck className="w-5 h-5 text-blue-500 mx-auto" />
              <div className="font-bold text-xs text-white">النقل البري</div>
              <div className="text-[10px] text-gray-400">أسطول متكامل</div>
            </div>

            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-center space-y-1 hover:border-sky-500/40 transition-colors">
              <Ship className="w-5 h-5 text-sky-400 mx-auto" />
              <div className="font-bold text-xs text-white">الشحن البحري</div>
              <div className="text-[10px] text-gray-400">بورتسودان الدولي</div>
            </div>

            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-center space-y-1 hover:border-sky-500/40 transition-colors">
              <Plane className="w-5 h-5 text-amber-400 mx-auto" />
              <div className="font-bold text-xs text-white">الشحن الجوي</div>
              <div className="text-[10px] text-gray-400">تسليم فوري</div>
            </div>

            <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 text-center space-y-1 hover:border-sky-500/40 transition-colors">
              <Warehouse className="w-5 h-5 text-emerald-400 mx-auto" />
              <div className="font-bold text-xs text-white">المستودعات</div>
              <div className="text-[10px] text-gray-400">تخزين ذكي WMS</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950 to-navy-950 border border-blue-500/30 text-xs flex items-center justify-between">
            <span className="text-gray-300">وفّر 28% عبر الشاحنات العائدة:</span>
            <button
              onClick={() => setCurrentView('marketplace')}
              className="px-3 py-1 rounded-lg bg-emerald-500 text-navy-950 font-bold text-xs"
            >
              بورصة الشحن
            </button>
          </div>
        </div>

        {/* Right: آخر المستجدات (3.5 cols - Matching Screenshot 3) */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-navy-900/90 border border-sky-500/25 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-sky-500/10">
            <h3 className="font-bold text-base text-white">آخر المستجدات</h3>
            <button className="text-xs text-sky-400 hover:text-white">عرض الكل &gt;</button>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800 space-y-1.5 hover:border-sky-500/40 transition-colors">
              <span className="text-[10px] text-sky-400 font-mono">12 أغسطس 2024</span>
              <h4 className="font-bold text-xs text-white leading-snug">إطلاق منصة تتبع الشحنات الذكية الجديدة</h4>
              <p className="text-[10px] text-gray-400">نظام فوري لتتبع حاويات ميناء بورتسودان عبر الأقمار الصناعية.</p>
            </div>

            <div className="p-3 rounded-2xl bg-navy-950 border border-navy-800 space-y-1.5 hover:border-sky-500/40 transition-colors">
              <span className="text-[10px] text-emerald-400 font-mono">8 أغسطس 2024</span>
              <h4 className="font-bold text-xs text-white leading-snug">توسيع شبكة النقل إلى ولايات القضارف وكسلا</h4>
              <p className="text-[10px] text-gray-400">إضافة 80 شاحنة مبردة وثقيلة لخدمة المحاصيل الزراعية والصادرات.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Matrix Sub-View (Matching Screenshot 2) */}
      {activeTab === 'pricing' && (
        <section className="p-8 rounded-3xl bg-navy-900/95 border border-sky-500/30 shadow-2xl space-y-8 animate-in fade-in">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white">باقات الأسعار والاشتراكات</h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
              اختر الخطة المناسبة لحجم أعمالك اللوجستية واستفد من الربط الرقمي المباشر.
            </p>

            {/* Monthly / Yearly Switcher */}
            <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-navy-950 border border-sky-500/30">
              <button
                onClick={() => setPricingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pricingCycle === 'monthly' ? 'bg-sky-600 text-white shadow' : 'text-gray-400'
                }`}
              >
                شهري
              </button>
              <button
                onClick={() => setPricingCycle('yearly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pricingCycle === 'yearly' ? 'bg-sky-600 text-white shadow' : 'text-gray-400'
                }`}
              >
                سنوي (خصم 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Basic Tier */}
            <div className="p-6 rounded-2xl bg-navy-950 border border-navy-800 shadow-xl space-y-4">
              <h4 className="text-base font-bold text-white">أساسي</h4>
              <div className="text-3xl font-black font-mono text-white">$49 <span className="text-xs text-gray-400">/ شهرياً</span></div>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> تتبع الشحنات</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> إشعارات عبر البريد الإلكتروني</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> تقارير أساسية</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> دعم فني عبر البريد</li>
              </ul>
              <button
                onClick={() => setCurrentView('create_shipment')}
                className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-200 font-bold text-xs"
              >
                ابدأ الآن
              </button>
            </div>

            {/* Pro Tier (Featured) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-950 via-navy-900 to-navy-950 border-2 border-sky-400 shadow-2xl space-y-4 relative">
              <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-bold">
                الأكثر شعبية
              </span>
              <h4 className="text-base font-bold text-white">احترافي</h4>
              <div className="text-3xl font-black font-mono text-white">$99 <span className="text-xs text-gray-400">/ شهرياً</span></div>
              <ul className="space-y-2 text-xs text-gray-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> تتبع الشحنات في الوقت الفعلي</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> تقارير وتحليلات متقدمة</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> تكامل API مباشر</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> دعم فني مخصص 24/7</li>
              </ul>
              <button
                onClick={() => setCurrentView('create_shipment')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-xs shadow-lg hover:brightness-110"
              >
                ابدأ الآن
              </button>
            </div>

            {/* Advanced Tier */}
            <div className="p-6 rounded-2xl bg-navy-950 border border-navy-800 shadow-xl space-y-4">
              <h4 className="text-base font-bold text-white">متقدم</h4>
              <div className="text-3xl font-black font-mono text-white">$199 <span className="text-xs text-gray-400">/ شهرياً</span></div>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> إدارة كاملة للأسطول والمستودعات</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> توأم رقمي ومحاكاة الذكاء الاصطناعي</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> فواتير إلكترونية ومحفظة ضامنة</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> مدير حساب مخصص</li>
              </ul>
              <button
                onClick={() => setCurrentView('create_shipment')}
                className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-200 font-bold text-xs"
              >
                ابدأ الآن
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Rich Structured Footer (Matching Screenshot 2 & 3) */}
      <footer className="rounded-3xl bg-navy-900/90 border border-sky-500/20 p-8 sm:p-12 text-gray-300 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h4 className="font-black text-base text-white">سودانيل لوجستك</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              نحن نقدم حلول لوجستية متكاملة لربط السودان بالعالم بموثوقية منذ 2018.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-3 uppercase tracking-widest">خدماتنا</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => setCurrentView('marketplace')} className="hover:text-sky-400">النقل البري</button></li>
              <li><button onClick={() => setCurrentView('port_sudan')} className="hover:text-sky-400">الشحن البحري</button></li>
              <li><button onClick={() => setCurrentView('warehousing')} className="hover:text-sky-400">المستودعات</button></li>
              <li><button onClick={() => setCurrentView('port_sudan')} className="hover:text-sky-400">التخليص الجمركي</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-3 uppercase tracking-widest">روابط سريعة</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><button onClick={() => setCurrentView('public_track')} className="hover:text-sky-400">تتبع الشحنات</button></li>
              <li><button onClick={() => setCurrentView('create_shipment')} className="hover:text-sky-400">طلب شحنة جديدة</button></li>
              <li><button onClick={() => setActiveTab('pricing')} className="hover:text-sky-400">الأسعار</button></li>
              <li><button onClick={() => setCurrentView('carrier_portal')} className="hover:text-sky-400">بوابة الناقلين</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-3 uppercase tracking-widest">اتصل بنا</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>الخرطوم، بورتسودان</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span dir="ltr">+249 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                <span>info@sudaneel-logistic.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-navy-800 text-center text-xs text-gray-500">
          © 2026 Sudaneel Logistics Intelligence Platform. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}
