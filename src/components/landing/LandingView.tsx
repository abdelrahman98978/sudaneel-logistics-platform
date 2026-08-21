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
  Headphones,
  BarChart3,
  Check,
} from 'lucide-react';

export function LandingView() {
  const { setCurrentView, setSelectedShipmentId, shipments, lang, setLang } = useApp();

  const [trackingInput, setTrackingInput] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCountry, setSelectedCountry] = useState('SD');
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  // 6 Services matching Screenshot 3 & 2 (Right-to-Left order in Arabic)
  const coreServices = [
    {
      id: 'road',
      title: 'النقل البري',
      desc: 'حلول نقل بري موثوقة',
      icon: Truck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'sea',
      title: 'الشحن البحري',
      desc: 'ربط السودان بالأسواق العالمية',
      icon: Ship,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'air',
      title: 'الشحن الجوي',
      desc: 'سرعة وكفاءة أعلى',
      icon: Plane,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'warehousing',
      title: 'المستودعات',
      desc: 'إدارة مخزون ذكية',
      icon: Warehouse,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'city_distribution',
      title: 'التوزيع داخل المدن',
      desc: 'توصيل سريع وآمن',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 'customs',
      title: 'التخليص الجمركي',
      desc: 'إجراءات سلسة ومتوافقة',
      icon: FileCheck,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="space-y-6 pb-16 font-sans text-gray-900 selection:bg-blue-600 selection:text-white" dir="rtl">
      {/* 1. Top Navbar Capsule (Pixel-Perfect Match to Screenshot 3) */}
      <header className="rounded-full bg-white border border-gray-200 px-4 sm:px-6 py-2.5 shadow-sm flex items-center justify-between transition-all">
        {/* Brand Logo on Right (Arabic RTL) */}
        <div onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 cursor-pointer">
          {/* S-Shield Brand Mark */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-900 to-blue-900 border border-gold/60 flex items-center justify-center text-gold shadow-md">
            <span className="font-black text-sm tracking-tighter text-gold">S</span>
          </div>
          <div>
            <h1 className="font-black text-sm text-[#0A1B39] tracking-tight leading-tight">
              منصة سودانيل اللوجستية
            </h1>
            <p className="text-[9px] text-gray-500 font-medium">حلول لوجستية ذكية — لسلسلة إمداد أقوى</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-gray-700">
          <button
            onClick={() => setActiveTab('home')}
            className={`pb-1 transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'text-blue-700 border-b-2 border-blue-600 font-black'
                : 'hover:text-blue-600 text-gray-700'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-1 transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'services'
                ? 'text-blue-700 border-b-2 border-blue-600 font-black'
                : 'hover:text-blue-600 text-gray-700'
            }`}
          >
            <span>الخدمات</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>
          <button
            onClick={() => setCurrentView('carrier_portal')}
            className="pb-1 hover:text-blue-600 text-gray-700 cursor-pointer"
          >
            الشركات
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`pb-1 transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'text-blue-700 border-b-2 border-blue-600 font-black'
                : 'hover:text-blue-600 text-gray-700'
            }`}
          >
            المعلومات
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`pb-1 transition-all cursor-pointer ${
              activeTab === 'support'
                ? 'text-blue-700 border-b-2 border-blue-600 font-black'
                : 'hover:text-blue-600 text-gray-700'
            }`}
          >
            الدعم والمساعدة
          </button>
        </nav>

        {/* Left Controls (Country Selector, Notifications, Dark Mode, Auth) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Register Button (Electric Blue Pill) */}
          <button
            onClick={() => setCurrentView('create_shipment')}
            className="px-4 py-1.5 rounded-full bg-[#1E60FF] hover:bg-blue-700 text-white font-black text-xs shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            إنشاء حساب
          </button>

          {/* Login Button (White Pill with Blue Border) */}
          <button
            onClick={() => setCurrentView('control_tower')}
            className="px-3.5 py-1.5 rounded-full bg-white border border-[#1E60FF] text-[#1E60FF] hover:bg-blue-50 text-xs font-black transition-colors cursor-pointer"
          >
            تسجيل دخول
          </button>

          {/* Notifications Bell with Badge 3 */}
          <div className="relative">
            <button className="p-1.5 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[8px] text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </div>

          {/* Dark Mode Switcher */}
          <div
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-9 h-5 rounded-full bg-gray-200 flex items-center p-0.5 cursor-pointer transition-colors"
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${isDarkMode ? 'translate-x-4 bg-blue-600' : 'translate-x-0'}`}></div>
          </div>

          {/* Country Selector */}
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700 cursor-pointer">
            <span>🇸🇩</span>
            <span className="hidden sm:inline text-gray-800">السودان</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      </header>

      {/* 2. Hero Section (Pixel-Perfect Match to Screenshot 3 with Real Truck & Port) */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[480px] sm:min-h-[520px] border border-blue-900/30 flex flex-col justify-between">
        {/* Background Image Container with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        >
          {/* Subtle Deep Navy Gradient on Left for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#030e2a]/60 to-[#030a1c]/95"></div>
        </div>

        {/* Content Container (Top-Center aligned) */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-6 text-center max-w-4xl mx-auto">
          {/* Main Hero Headline */}
          <div className="space-y-2 pt-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              منصة سودانيل اللوجستية
            </h1>
            <p className="text-sm sm:text-lg font-extrabold text-sky-200 drop-shadow">
              شريكك الذكي في سلسلة الإمداد والنقل والخدمات اللوجستية
            </p>
            <p className="text-xs sm:text-sm text-gray-300 font-medium">
              نربط السودان بالعالم بكفاءة .. أمان .. واستدامة
            </p>
          </div>

          {/* 3 Pill Badges beneath Title */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1">
            <div className="flex items-center gap-2 text-xs font-bold text-white bg-navy-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              <div className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
              <span>موثوقية وأمان</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-white bg-navy-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              <div className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <span>سرعة في التنفيذ</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-white bg-navy-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              <div className="w-5 h-5 rounded-full border border-white/60 flex items-center justify-center">
                <Package className="w-3 h-3 text-white" />
              </div>
              <span>حلول لوجستية متكاملة</span>
            </div>
          </div>
        </div>

        {/* Floating Search & Track Capsule Bar (Matching Screenshot 3) */}
        <div className="relative z-20 max-w-3xl w-full mx-auto px-4 pb-12 sm:pb-16">
          <form
            onSubmit={handleTrackSubmit}
            className="p-1.5 rounded-full bg-white shadow-2xl flex items-center gap-2 border border-gray-200"
          >
            {/* Action 1: Blue Track Capsule Button on Right (RTL) */}
            <button
              type="button"
              onClick={() => setCurrentView('public_track')}
              className="px-4 py-2.5 rounded-full bg-[#0E1E3F] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow hover:bg-navy-900 cursor-pointer flex-shrink-0"
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>تتبع شحنتك</span>
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="أدخل رقم الشحنة أو رقم التتبع..."
              className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-xs sm:text-sm font-semibold px-2 text-start"
            />

            {/* Action 2: Electric Blue Search Button on Left (RTL) */}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#1E60FF] hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>بحث</span>
            </button>
          </form>
        </div>
      </section>

      {/* 3. Six Floating Service Cards (Overlapping Hero bottom - Matching Screenshot 3) */}
      <section className="relative z-30 max-w-6xl mx-auto px-2 -mt-10 sm:-mt-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                className="p-4 rounded-2xl bg-white text-navy-950 shadow-lg hover:shadow-xl space-y-2 text-center transition-all hover:-translate-y-1.5 cursor-pointer group border border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-xs sm:text-sm text-[#0A1B39]">{srv.title}</h3>
                <p className="text-[10px] text-gray-500 font-medium leading-snug line-clamp-1">{srv.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Live Impact Counters Ribbon (Light Sky-Blue Capsule - Matching Screenshot 3) */}
      <section className="max-w-6xl mx-auto px-2">
        <div className="p-4 sm:p-5 rounded-2xl sm:rounded-full bg-[#EBF3FE] border border-blue-100 shadow-sm flex flex-wrap items-center justify-around gap-4 text-center">
          {/* Counter 1: +1200 شحنة شهرية */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center">
              <Ship className="w-4 h-4" />
            </div>
            <div className="text-start">
              <div className="text-lg sm:text-xl font-black font-mono text-[#0A1B39] leading-none">+1200</div>
              <div className="text-[11px] font-bold text-gray-600 mt-0.5">شحنة شهرية</div>
            </div>
          </div>

          {/* Counter 2: +450 مركبة لوجستية */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div className="text-start">
              <div className="text-lg sm:text-xl font-black font-mono text-[#0A1B39] leading-none">+450</div>
              <div className="text-[11px] font-bold text-gray-600 mt-0.5">مركبة لوجستية</div>
            </div>
          </div>

          {/* Counter 3: +85 مستودع وشريك */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center">
              <Warehouse className="w-4 h-4" />
            </div>
            <div className="text-start">
              <div className="text-lg sm:text-xl font-black font-mono text-[#0A1B39] leading-none">+85</div>
              <div className="text-[11px] font-bold text-gray-600 mt-0.5">مستودع وشريك</div>
            </div>
          </div>

          {/* Counter 4: 12 مركز لوجستي */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-start">
              <div className="text-lg sm:text-xl font-black font-mono text-[#0A1B39] leading-none">12</div>
              <div className="text-[11px] font-bold text-gray-600 mt-0.5">مركز لوجستي</div>
            </div>
          </div>

          {/* Counter 5: +320 عميل وثيق الثقة */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100/80 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-start">
              <div className="text-lg sm:text-xl font-black font-mono text-[#0A1B39] leading-none">+320</div>
              <div className="text-[11px] font-bold text-gray-600 mt-0.5">عميل وثيق الثقة</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Three-Column Integrated Section (Matching Screenshot 3) */}
      <section className="max-w-6xl mx-auto px-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Card 1: شبكة لوجستية متكاملة في السودان (Left 4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#040C24] text-white shadow-xl border border-blue-900/40 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <h3 className="font-black text-base text-white">شبكة لوجستية متكاملة في السودان</h3>
              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">✓</div>
                  <span>تغطية شاملة لجميع الولايات</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">✓</div>
                  <span>ربط الموانئ والمطارات والمراكز اللوجستية</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">✓</div>
                  <span>حلول نقل وتوزيع ذكية</span>
                </div>
              </div>
            </div>

            {/* Glowing Sudan Network Map Illustration */}
            <div className="relative h-28 rounded-xl bg-[#071333] border border-blue-500/20 overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full opacity-70" viewBox="0 0 200 100">
                <circle cx="40" cy="30" r="3" fill="#1e60ff" />
                <circle cx="100" cy="25" r="4" fill="#60a5fa" />
                <circle cx="160" cy="20" r="4" fill="#10b981" />
                <circle cx="80" cy="65" r="4" fill="#3b82f6" />
                <circle cx="140" cy="60" r="3" fill="#f59e0b" />
                <line x1="160" y1="20" x2="100" y2="25" stroke="#60a5fa" strokeWidth="1.5" />
                <line x1="100" y1="25" x2="80" y2="65" stroke="#3b82f6" strokeWidth="1.5" />
                <line x1="80" y1="65" x2="140" y2="60" stroke="#f59e0b" strokeWidth="1" />
                <line x1="40" y1="30" x2="100" y2="25" stroke="#1e60ff" strokeWidth="1" />
              </svg>
              <span className="absolute text-[11px] font-bold text-sky-300">18 ولاية • 150+ محطة</span>
            </div>

            <button
              onClick={() => setCurrentView('control_tower')}
              className="w-full py-2.5 rounded-xl bg-[#1E60FF] hover:bg-blue-700 text-white font-extrabold text-xs shadow-md cursor-pointer transition-transform hover:scale-105"
            >
              اكتشف الشبكة
            </button>
          </div>

          {/* Card 2: خدماتنا Quick Grid (Center 4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white text-navy-950 shadow-xl border border-gray-100 flex flex-col justify-between space-y-3">
            <h3 className="font-black text-base text-[#0A1B39]">خدماتنا</h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors space-y-1">
                <Truck className="w-5 h-5 text-blue-600 mx-auto" />
                <div className="font-bold text-[10px] text-[#0A1B39]">النقل البري</div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors space-y-1">
                <Ship className="w-5 h-5 text-blue-600 mx-auto" />
                <div className="font-bold text-[10px] text-[#0A1B39]">الشحن البحري</div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors space-y-1">
                <Plane className="w-5 h-5 text-blue-600 mx-auto" />
                <div className="font-bold text-[10px] text-[#0A1B39]">الشحن الجوي</div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors space-y-1">
                <Warehouse className="w-5 h-5 text-blue-600 mx-auto" />
                <div className="font-bold text-[10px] text-[#0A1B39]">المستودعات</div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors space-y-1">
                <Package className="w-5 h-5 text-blue-600 mx-auto" />
                <div className="font-bold text-[10px] text-[#0A1B39]">التوزيع</div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors space-y-1">
                <FileCheck className="w-5 h-5 text-blue-600 mx-auto" />
                <div className="font-bold text-[10px] text-[#0A1B39]">التخليص الجمركي</div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('services')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 pt-1"
            >
              <span>عرض جميع الخدمات</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>

          {/* Card 3: آخر المستجدات (Right 4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white text-navy-950 shadow-xl border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-[#0A1B39]">آخر المستجدات</h3>
              <button className="text-xs text-blue-600 hover:text-blue-800 font-bold">عرض الكل</button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 hover:border-blue-300 transition-colors">
                <div
                  className="w-14 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: "url('/news-truck.jpg')" }}
                ></div>
                <div>
                  <span className="text-[9px] text-gray-500 font-mono block">12 أغسطس 2024</span>
                  <h4 className="font-bold text-xs text-[#0A1B39] leading-snug">إطلاق منصة تتبع الشحنات الجديدة</h4>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-3 hover:border-blue-300 transition-colors">
                <div
                  className="w-14 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: "url('/news-port.jpg')" }}
                ></div>
                <div>
                  <span className="text-[9px] text-gray-500 font-mono block">8 أغسطس 2024</span>
                  <h4 className="font-bold text-xs text-[#0A1B39] leading-snug">توسيع شبكة النقل إلى ولايات جديدة</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Sovereign Blue Banner (Matching Screenshot 3) */}
      <section className="max-w-6xl mx-auto px-2">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#06143A] text-white border border-blue-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Right Text */}
          <div className="space-y-1 text-center md:text-start">
            <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              سودانيل .. نحو لوجستيات أكثر ذكاءً
            </h2>
            <p className="text-xs text-sky-300 font-medium">
              من الداخل إلى الخارج .. نصل بك بأمان وسرعة
            </p>
          </div>

          {/* Left Feature Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-gray-200">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <span>كفاءة أعلى وتكاليف أقل</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-200">
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>دعم فني 24/7</span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>شراكات استراتيجية</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
