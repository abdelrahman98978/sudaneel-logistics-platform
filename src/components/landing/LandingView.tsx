'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Search,
  Truck,
  Ship,
  Plane,
  Warehouse,
  FileCheck,
  ShieldCheck,
  Zap,
  Globe,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  LogIn,
  Send,
  Radio,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export function LandingView() {
  const { setCurrentView, setSelectedShipmentId, shipments, t, lang, setLang } = useApp();

  const [activeNav, setActiveNav] = useState<'home' | 'about' | 'services' | 'track' | 'contact'>('home');
  const [trackingInput, setTrackingInput] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('general');
  const [contactMessage, setContactMessage] = useState('');

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
      setSelectedShipmentId(shipments[0].id);
      setCurrentView('tracking_detail');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(lang === 'ar' ? 'تم استلام رسالتك بنجاح! سيتواصل معك فريق الدعم خلال أقل من ساعتين.' : 'Message received! Support will reach out within 2 hours.');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
  };

  return (
    <div className="space-y-12 pb-20 font-sans">
      {/* ===== HEADER NAVIGATION ===== */}
      <header className="sticky top-4 z-50 rounded-2xl bg-navy-900/95 border border-gold/30 p-3 sm:p-4 shadow-2xl flex items-center justify-between backdrop-blur-xl transition-all">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveNav('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/30 to-amber-500/20 border border-gold/50 flex items-center justify-center text-gold shadow-lg">
            <Radio className="w-5 h-5 text-gold animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-1.5">
              <span>{lang === 'ar' ? 'سودانيل لوجيستك' : 'Sudanil Logistic'}</span>
            </h1>
            <p className="text-[10px] text-gray-400">
              {lang === 'ar' ? 'حلول لوجستية عالمية' : 'Global Logistics Solutions'}
            </p>
          </div>
        </div>

        {/* Center Nav Links (Matching original tabs) */}
        <nav className="hidden md:flex items-center gap-1 bg-navy-950/90 p-1.5 rounded-xl border border-gold/20 text-xs font-bold">
          <button
            onClick={() => setActiveNav('home')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'home' ? 'bg-gold text-navy-950 shadow-md font-extrabold' : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
          <button
            onClick={() => setActiveNav('about')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'about' ? 'bg-gold text-navy-950 shadow-md font-extrabold' : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'من نحن' : 'About Us'}
          </button>
          <button
            onClick={() => setActiveNav('services')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'services' ? 'bg-gold text-navy-950 shadow-md font-extrabold' : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'خدماتنا' : 'Services'}
          </button>
          <button
            onClick={() => setActiveNav('track')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'track' ? 'bg-gold text-navy-950 shadow-md font-extrabold' : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'تتبع الشحنة' : 'Track Shipment'}
          </button>
          <button
            onClick={() => setActiveNav('contact')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'contact' ? 'bg-gold text-navy-950 shadow-md font-extrabold' : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-navy-800 border border-gold/20 text-xs font-bold text-gray-200 hover:bg-navy-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-gold" />
            <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
          </button>

          {/* Login / Launch Platform Button */}
          <button
            onClick={() => setCurrentView('control_tower')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-amber-500 hover:brightness-110 text-navy-950 font-extrabold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</span>
          </button>
        </div>
      </header>

      {/* ===== 1. HOME VIEW (الرئيسية) ===== */}
      {activeNav === 'home' && (
        <div className="space-y-16 animate-in fade-in">
          {/* HERO SECTION */}
          <section className="relative rounded-3xl bg-gradient-to-b from-navy-900 via-navy-950 to-[#030712] border border-gold/30 p-8 sm:p-16 shadow-2xl overflow-hidden text-center space-y-8">
            <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
              <span>{lang === 'ar' ? 'سودانيل لوجيستك.. الشركة الرائدة في اللوجستيات عالمياً' : 'Sudanil Logistic.. Global Logistics Leader'}</span>
            </div>

            {/* Main Title (نقل بثقة.. نوصل باحتراف) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
              <span>{lang === 'ar' ? 'نقل بثقة..' : 'Ship with Trust..'} </span>
              <span className="text-gradient-gold">{lang === 'ar' ? 'نوصل باحتراف' : 'Deliver with Excellence'}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {lang === 'ar'
                ? 'رائدون في مجال الخدمات اللوجستية المتكاملة، نضمن وصول شحناتكم بأمان ودقة عالية عبر شبكتنا العالمية المتميزة.'
                : 'Pioneers in integrated logistics, ensuring your shipments arrive safely and accurately through our premium network.'}
            </p>

            {/* Tracking Search Input Widget */}
            <div className="max-w-xl mx-auto pt-2">
              <form
                onSubmit={handleTrackSubmit}
                className="p-2 rounded-2xl bg-navy-900/90 backdrop-blur-xl border border-gold/40 shadow-2xl flex items-center gap-2"
              >
                <div className="ps-3 flex items-center gap-2 text-gold">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل رقم التتبع (مثال: SDN-88419)...' : 'Enter tracking number (e.g. SDN-88419)...'}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-xs sm:text-sm font-medium"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-extrabold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {lang === 'ar' ? 'تتبع الآن' : 'Track Now'}
                </button>
              </form>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6">
              <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 text-center shadow-lg">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gold">1,284</div>
                <div className="text-xs text-gray-300 mt-1 font-bold">{lang === 'ar' ? 'شحنة نشطة' : 'Active Shipments'}</div>
              </div>
              <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 text-center shadow-lg">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-400">150+</div>
                <div className="text-xs text-gray-300 mt-1 font-bold">{lang === 'ar' ? 'وجهة ومحطة' : 'Destinations'}</div>
              </div>
              <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 text-center shadow-lg">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">99.8%</div>
                <div className="text-xs text-gray-300 mt-1 font-bold">{lang === 'ar' ? 'معدل الموثوقية' : 'Reliability Rate'}</div>
              </div>
              <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 text-center shadow-lg">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">24/7</div>
                <div className="text-xs text-gray-300 mt-1 font-bold">{lang === 'ar' ? 'دعم متواصل' : 'Continuous Support'}</div>
              </div>
            </div>
          </section>

          {/* SERVICES SHOWCASE (خدماتنا اللوجستية) */}
          <section className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {lang === 'ar' ? 'خدماتنا اللوجستية المتميزة' : 'Our Logistics Services'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
                {lang === 'ar' ? 'نقدم مجموعة شاملة من حلول الشحن والنقل المصممة لتلبية احتياجات أعمالكم بكفاءة وموثوقية.' : 'Comprehensive supply chain and cargo transport tailored for enterprise efficiency.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Land Freight */}
              <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/20 hover:border-gold shadow-xl space-y-4 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'الشحن البري وحلول الأساطيل' : 'Land Freight & Fleet Solutions'}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'شبكة متطورة من الشاحنات الحديثة والمجهزة بأحدث أنظمة التتبع اللحظي لنقل البضائع عبر جميع الولايات والمنافذ.'
                    : 'Modern fleet equipped with real-time GPS sensors connecting all domestic corridors and dry ports.'}
                </p>
              </div>

              {/* Card 2: Ocean Freight */}
              <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/20 hover:border-gold shadow-xl space-y-4 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <Ship className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'الشحن البحري الدولي' : 'International Ocean Freight'}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'خدمات شحن بحري متكاملة عبر ميناء بورتسودان مع كبرى الخطوط الملاحية العالمية للحاويات والبضائع السائبة.'
                    : 'End-to-end container handling and ocean drayage via Port Sudan connected to top shipping lines.'}
                </p>
              </div>

              {/* Card 3: Air Freight */}
              <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/20 hover:border-gold shadow-xl space-y-4 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                  <Plane className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'الشحن الجوي السريع' : 'Express Air Freight'}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'حلول شحن جوي فوري وموثوق للبضائع العاجلة والمعدات الطبية الحساسة مع ضمان التسليم في الموعد المحدد.'
                    : 'Express priority air charter and scheduled flights for time-sensitive and high-value cargo.'}
                </p>
              </div>

              {/* Card 4: Warehousing */}
              <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/20 hover:border-gold shadow-xl space-y-4 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Warehouse className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'التخزين والتوزيع الذكي' : 'Smart Warehousing & Distribution'}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'مستودعات مركزية ومبردة في الخرطوم وبورتسودان مجهزة بأنظمة إدارة المخزون المتقدمة (WMS).'
                    : 'Climate-controlled warehouse facilities in Khartoum and Port Sudan with automated WMS.'}
                </p>
              </div>

              {/* Card 5: Customs Clearance */}
              <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/20 hover:border-gold shadow-xl space-y-4 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'التخليص الجمركي والاستشارات' : 'Customs Clearance & Advisory'}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'فريق متخصص لإنهاء كافة الإجراءات الجمركية والتصاريح المعقدة في الموانئ والمنافذ بأسرع وقت.'
                    : 'Dedicated broker teams handling rapid customs clearance, duty valuation, and cross-border compliance.'}
                </p>
              </div>

              {/* Card 6: Backhaul Deals */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-900 to-navy-950 border border-gold/40 shadow-xl space-y-4 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gold/30 flex items-center justify-center text-gold">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gold">
                  {lang === 'ar' ? 'محرك الرحلات العائدة (-28%)' : 'Backhaul Engine (-28% Savings)'}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'توفير فوري عبر مطابقة الشحنات مع الشاحنات العائدة فارغة من الموانئ للقضاء على الهدر المالي.'
                    : 'Smart algorithmic matching of return loads with empty trucks to slash shipping expenses.'}
                </p>
              </div>
            </div>
          </section>

          {/* WHY CHOOSE SUDANIL (لماذا سودانيل؟) */}
          <section className="rounded-3xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 p-8 sm:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
                  {lang === 'ar' ? 'لماذا تختارنا؟' : 'Why Sudanil?'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {lang === 'ar' ? 'نبتكر معايير جديدة للوجستيات في السودان' : 'Setting New Standards for Regional Freight'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'نجمع بين الخبرة الميدانية العميقة وأحدث التقنيات الرقمية لنمنحك رؤية كاملة وتحكماً مطلقاً في كل مرحلة من مراحل الشحن.'
                    : 'Combining extensive on-the-ground operational strength with modern real-time tracking architecture.'}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentView('control_tower')}
                    className="px-6 py-3 rounded-xl bg-gold hover:bg-gold/90 text-navy-950 font-extrabold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
                  >
                    {lang === 'ar' ? 'استكشف لوحة التحكم المباشرة' : 'Explore Live Operations Tower'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">{lang === 'ar' ? 'أمان وضمان 100%' : '100% Insured & Verified'}</h4>
                  <p className="text-[11px] text-gray-400">{lang === 'ar' ? 'فحص كامل لسجلات السائقين وبوالص تأمين شاملة.' : 'Full driver background checks and cargo coverage.'}</p>
                </div>
                <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-2">
                  <Zap className="w-6 h-6 text-gold" />
                  <h4 className="font-bold text-white text-sm">{lang === 'ar' ? 'تتبع لحظي GPS' : 'Real-time GPS Telemetry'}</h4>
                  <p className="text-[11px] text-gray-400">{lang === 'ar' ? 'متابعة حية للسرعة ومواقع الشاحنات على الخريطة.' : 'Continuous location and speed telemetry pings.'}</p>
                </div>
                <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-2">
                  <Building2 className="w-6 h-6 text-sky-400" />
                  <h4 className="font-bold text-white text-sm">{lang === 'ar' ? 'شبكة ممرات شاملة' : 'Corridor Coverage'}</h4>
                  <p className="text-[11px] text-gray-400">{lang === 'ar' ? 'تغطية لكافة الولايات والموانئ والمنافذ الحدودية.' : 'Connecting Khartoum, Port Sudan, Gedaref, and beyond.'}</p>
                </div>
                <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-2">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <h4 className="font-bold text-white text-sm">{lang === 'ar' ? 'التزام تام بالمواعيد' : 'On-Time Delivery'}</h4>
                  <p className="text-[11px] text-gray-400">{lang === 'ar' ? 'دقة وصول تتجاوز 97.4% بفضل التوجيه الذكي.' : 'Predictive ETA algorithm minimizing delays.'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* PARTNERS (شركاء النجاح) */}
          <section className="text-center space-y-6 pt-4">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              {lang === 'ar' ? 'شركاء النجاح والخطوط الملاحية' : 'Global Shipping Partners'}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-70">
              <span className="font-mono text-sm sm:text-base font-bold text-gray-300">MAERSK</span>
              <span className="font-mono text-sm sm:text-base font-bold text-gray-300">MSC MEDITERRANEAN</span>
              <span className="font-mono text-sm sm:text-base font-bold text-gray-300">DP WORLD</span>
              <span className="font-mono text-sm sm:text-base font-bold text-gray-300">DHL LOGISTICS</span>
              <span className="font-mono text-sm sm:text-base font-bold text-gray-300">ARAMEX</span>
            </div>
          </section>
        </div>
      )}

      {/* ===== 2. ABOUT US (من نحن) ===== */}
      {activeNav === 'about' && (
        <section className="rounded-3xl bg-navy-900/90 border border-gold/25 p-8 sm:p-12 shadow-2xl space-y-8 animate-in fade-in">
          <div className="space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
              {lang === 'ar' ? 'من نحن' : 'About Us'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {lang === 'ar' ? 'سودانيل لوجيستك — الريادة والتميز في عالم النقل' : 'Sudanil Logistic — Leaders in Freight & Supply Chains'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {lang === 'ar' ? 'نبني البنية التحتية اللوجستية الرقمية التي تدعم التجارة والصناعة في السودان والمنطقة.' : 'Building the digital logistics backbone of Sudan.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <div className="space-y-4 bg-navy-950/80 p-6 rounded-2xl border border-navy-800">
              <h3 className="font-bold text-gold text-base">
                {lang === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Vision & Mission'}
              </h3>
              <p>
                {lang === 'ar'
                  ? 'تأسست شركة سودانيل لوجيستك لتكون الشريك الاستراتيجي الأول للشركات والمصانع والمستوردين والمصدرين في السودان، من خلال تقديم خدمات شحن متطورة تجمع بين السرعة والأمان التام والشفافية في التسعير.'
                  : 'Sudanil Logistic was founded to be the strategic supply chain partner for enterprises and traders across Sudan, providing unmatched speed, security, and transparent pricing.'}
              </p>
              <p>
                {lang === 'ar'
                  ? 'نمتلك أسطولاً متنوعاً من الشاحنات العادية والمبردة ومقطورات الحاويات، مع شبكة محطات تغطي بورتسودان، الخرطوم، عطبرة، القضارف، وود مدني.'
                  : 'We manage a modern multi-modal fleet covering Port Sudan, Khartoum, Atbara, Gedaref, and Wad Madani.'}
              </p>
            </div>

            <div className="space-y-4 bg-navy-950/80 p-6 rounded-2xl border border-navy-800">
              <h3 className="font-bold text-sky-400 text-base">
                {lang === 'ar' ? 'فريق العمل والقيادة' : 'Leadership & Operational Excellence'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                  <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">م.ع</div>
                  <div>
                    <div className="font-bold text-white text-xs">محمد عثمان</div>
                    <div className="text-[11px] text-gray-400">{lang === 'ar' ? 'المدير التنفيذي' : 'Chief Executive Officer'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">س.إ</div>
                  <div>
                    <div className="font-bold text-white text-xs">سارة إبراهيم</div>
                    <div className="text-[11px] text-gray-400">{lang === 'ar' ? 'مدير العمليات وسلاسل الإمداد' : 'Chief Operating Officer'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">خ.ح</div>
                  <div>
                    <div className="font-bold text-white text-xs">خالد حسن</div>
                    <div className="text-[11px] text-gray-400">{lang === 'ar' ? 'مدير الشراكات والموانئ' : 'Head of Global Port Partnerships'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== 3. SERVICES (خدماتنا) ===== */}
      {activeNav === 'services' && (
        <section className="space-y-8 animate-in fade-in">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
              {lang === 'ar' ? 'حلول متكاملة' : 'Our Capabilities'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {lang === 'ar' ? 'خدمات الشحن والنقل اللوجستي' : 'Logistics & Cargo Transport Services'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/25 space-y-3 shadow-xl">
              <Truck className="w-8 h-8 text-gold" />
              <h3 className="text-lg font-bold text-white">{lang === 'ar' ? 'النقل الثقيل والرافعات' : 'Heavy Haulage & Flatbeds'}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'ar' ? 'نقل الآليات الثقيلة، مولدات الطاقة، ومعدات المشاريع الصناعية عبر كافة المحاور الوعرة.' : 'Specialized transport for heavy industrial equipment and power generation machinery.'}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/25 space-y-3 shadow-xl">
              <Ship className="w-8 h-8 text-sky-400" />
              <h3 className="text-lg font-bold text-white">{lang === 'ar' ? 'مناولة الحاويات بميناء بورتسودان' : 'Port Sudan Terminal Drayage'}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'ar' ? 'سحب فوري للحاويات (20ft & 40ft) من الأرصفة ونقلها إلى الموانئ الجافة والمستودعات.' : 'Container drayage and rapid clearance directly from Port Sudan berths.'}
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/25 space-y-3 shadow-xl">
              <Warehouse className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">{lang === 'ar' ? 'سلاسل التبريد والتخزين' : 'Cold Chain & Reefer Fleet'}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'ar' ? 'شاحنات ومستودعات مبردة ومجمدة مع مراقبة حرارية مستمرة لضمان سلامة الأغذية والأدوية.' : 'Temperature-controlled reefer fleet with continuous sensor monitoring.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ===== 4. TRACK SHIPMENT (تتبع الشحنة) ===== */}
      {activeNav === 'track' && (
        <section className="rounded-3xl bg-navy-900/90 border border-gold/30 p-8 sm:p-14 shadow-2xl space-y-6 animate-in fade-in max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 text-gold border border-gold/40 flex items-center justify-center mx-auto shadow-lg">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {lang === 'ar' ? 'تتبع شحنتك لحظة بلحظة' : 'Track Your Shipment Live'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
            {lang === 'ar'
              ? 'أدخل رقم التتبع للاطلاع على الجواز الرقمي للشحنة وموقع السائق والسرعة وموعد الوصول الدقيق.'
              : 'Enter your tracking code to view the live Digital Shipment Passport and timeline.'}
          </p>

          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="flex items-center gap-2 bg-navy-950 p-2.5 rounded-2xl border border-gold/30 shadow-inner">
              <Search className="w-5 h-5 text-gold ps-2" />
              <input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="SDN-88419 / SDN-99104 / SDN-77312"
                className="flex-1 bg-transparent text-white font-mono text-sm sm:text-base outline-none px-2"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gold hover:bg-gold/90 text-navy-950 font-extrabold text-xs sm:text-sm shadow-lg cursor-pointer"
              >
                {lang === 'ar' ? 'بحث فوري' : 'Search Now'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ===== 5. CONTACT US (تواصل معنا — Exact match to screenshot) ===== */}
      {activeNav === 'contact' && (
        <section className="space-y-8 animate-in fade-in">
          {/* Hero Banner: نحن هنا لخدمتك دائماً */}
          <div className="relative rounded-3xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 p-8 sm:p-14 shadow-2xl text-center space-y-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
              {lang === 'ar' ? 'دعم متكامل على مدار الساعة' : '24/7 Dedicated Logistics Support'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              {lang === 'ar' ? 'نحن هنا لخدمتك دائماً' : 'We Are Always Here For You'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {lang === 'ar'
                ? 'تواصل مع خبراء اللوجستيك لدينا للحصول على حلول مخصصة تدعم نمو أعمالك وتضمن وصول شحناتك بأمان واحترافية.'
                : 'Connect with our logistics engineers for tailored corporate solutions that power your business growth.'}
            </p>
          </div>

          {/* Contact Details & Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Direct Contact Card (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-gold/25 p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="font-black text-lg text-white flex items-center gap-2 pb-4 border-b border-gold/15">
                <Building2 className="w-5 h-5 text-gold" />
                <span>{lang === 'ar' ? 'بيانات التواصل المباشر' : 'Direct Contact Info'}</span>
              </h3>

              {/* Phone Numbers */}
              <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1.5">
                <div className="flex items-center gap-2 text-gold text-xs font-bold">
                  <Phone className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'أرقام الهاتف:' : 'Phone Numbers:'}</span>
                </div>
                <div className="font-mono text-sm text-white font-extrabold ps-6" dir="ltr">+249 123 456 789</div>
                <div className="font-mono text-sm text-white font-extrabold ps-6" dir="ltr">+249 912 345 678</div>
              </div>

              {/* Email */}
              <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1.5">
                <div className="flex items-center gap-2 text-gold text-xs font-bold">
                  <Mail className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span>
                </div>
                <div className="font-mono text-xs text-gray-200 ps-6">info@sudanil-logistic.com</div>
                <div className="font-mono text-xs text-gray-200 ps-6">sales@sudanil-logistic.com</div>
              </div>

              {/* Locations */}
              <div className="p-4 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1.5">
                <div className="flex items-center gap-2 text-gold text-xs font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'المقر والفروع:' : 'Locations:'}</span>
                </div>
                <div className="text-xs text-gray-300 ps-6">
                  {lang === 'ar' ? 'الخرطوم — المنطقة الصناعية بحري' : 'Khartoum — Bahri Industrial Area'}
                </div>
                <div className="text-xs text-gray-300 ps-6">
                  {lang === 'ar' ? 'بورتسودان — الميناء الجنوبي والمنطقة الحرة' : 'Port Sudan — South Port Free Zone'}
                </div>
              </div>
            </div>

            {/* Send Message Form (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl bg-navy-900/90 border border-gold/25 p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="font-black text-lg text-white flex items-center gap-2 pb-4 border-b border-gold/15">
                <Send className="w-5 h-5 text-gold" />
                <span>{lang === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}</span>
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-bold">{lang === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Your name'}
                      className="w-full p-3.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-bold">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="example@domain.com"
                      className="w-full p-3.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-bold">{lang === 'ar' ? 'الموضوع' : 'Subject'}</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full p-3.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold"
                    >
                      <option value="general">{lang === 'ar' ? 'استفسار عام' : 'General Inquiry'}</option>
                      <option value="quote">{lang === 'ar' ? 'طلب عرض أسعار شحن' : 'Freight Quote Request'}</option>
                      <option value="carrier">{lang === 'ar' ? 'تسجيل ناقل أو أسطول' : 'Register Carrier Fleet'}</option>
                      <option value="customs">{lang === 'ar' ? 'تخليص جمركي وموانئ' : 'Port & Customs Clearance'}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-bold">{lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+249 9X XXX XXX"
                      className="w-full p-3.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-300 font-bold">{lang === 'ar' ? 'نص الرسالة أو تفاصيل الشحنة' : 'Message Details'}</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب تفاصيل استفسارك هنا...' : 'Write your inquiry here...'}
                    className="w-full p-3.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold custom-scrollbar"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-amber-500 hover:brightness-110 text-navy-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="rounded-3xl bg-navy-900/90 border border-gold/20 p-8 sm:p-12 text-gray-300 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="font-black text-base text-white">{lang === 'ar' ? 'سودانيل لوجيستك' : 'Sudanil Logistic'}</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {lang === 'ar'
                ? 'رائدون في عالم اللوجستيات، نقدم الحلول التي تربط العالم ببعضه البعض بدقة وموثوقية عالية.'
                : 'Pioneers in logistics, connecting businesses with high precision and unmatched reliability.'}
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-4 uppercase tracking-widest">{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h5>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => setActiveNav('home')} className="hover:text-gold transition-colors">{lang === 'ar' ? 'الرئيسية' : 'Home'}</button></li>
              <li><button onClick={() => setActiveNav('about')} className="hover:text-gold transition-colors">{lang === 'ar' ? 'من نحن' : 'About Us'}</button></li>
              <li><button onClick={() => setActiveNav('services')} className="hover:text-gold transition-colors">{lang === 'ar' ? 'خدماتنا' : 'Services'}</button></li>
              <li><button onClick={() => setActiveNav('track')} className="hover:text-gold transition-colors">{lang === 'ar' ? 'تتبع الشحنة' : 'Track Shipment'}</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-4 uppercase tracking-widest">{lang === 'ar' ? 'اتصل بنا' : 'Contact'}</h5>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gold" /><span>الخرطوم، بورتسودان</span></li>
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gold" /><span dir="ltr">+249 123 456 789</span></li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gold" /><span>info@sudanil-logistic.com</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-xs mb-4 uppercase tracking-widest">{lang === 'ar' ? 'بوابة التشغيل' : 'Platform'}</h5>
            <button
              onClick={() => setCurrentView('control_tower')}
              className="w-full py-2.5 px-4 rounded-xl bg-navy-950 border border-gold/30 hover:border-gold text-gold font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <LogIn className="w-4 h-4" />
              <span>{lang === 'ar' ? 'دخول لوحة التحكم' : 'Launch OS'}</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-navy-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Sudanil Logistic. {lang === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>
      </footer>
    </div>
  );
}
