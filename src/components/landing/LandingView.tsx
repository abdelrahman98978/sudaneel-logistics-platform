'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Compass,
  Search,
  Truck,
  Repeat,
  ShieldCheck,
  Zap,
  Globe,
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  LogIn,
  Send,
  Radio,
  FileCheck2,
  Award,
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
  const [isMessageSent, setIsMessageSent] = useState(false);

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
    setIsMessageSent(true);
    setTimeout(() => {
      setIsMessageSent(false);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
      alert(lang === 'ar' ? 'تم استلام رسالتك بنجاح! سيتواصل معك فريق الدعم خلال أقل من ساعتين.' : 'Message received! Support will reach out within 2 hours.');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Public Top Navigation Bar (matching the original visual identity) */}
      <header className="rounded-2xl bg-navy-900/95 border border-gold/30 p-3 sm:p-4 shadow-2xl flex items-center justify-between backdrop-blur-xl">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveNav('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/30 to-amber-500/20 border border-gold/50 flex items-center justify-center text-gold shadow-lg">
            <Radio className="w-5 h-5 text-gold animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
              <span>{lang === 'ar' ? 'سودانيل لوجستيكس' : 'Sudaneel Logistics'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/20 text-gold border border-gold/30 font-mono">
                Platform
              </span>
            </h1>
            <p className="text-[10px] text-gray-400">
              {lang === 'ar' ? 'منظومة الشحن وسلاسل الإمداد الذكية' : 'Intelligent Supply Chain OS'}
            </p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-navy-950/80 p-1 rounded-xl border border-gold/20 text-xs font-semibold">
          <button
            onClick={() => setActiveNav('home')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'home' ? 'bg-gold text-navy-950 font-bold shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </button>
          <button
            onClick={() => setActiveNav('about')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'about' ? 'bg-gold text-navy-950 font-bold shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'من نحن' : 'About Us'}
          </button>
          <button
            onClick={() => setActiveNav('services')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'services' ? 'bg-gold text-navy-950 font-bold shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'خدماتنا' : 'Our Services'}
          </button>
          <button
            onClick={() => setActiveNav('track')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'track' ? 'bg-gold text-navy-950 font-bold shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'تتبع الشحنة' : 'Track Shipment'}
          </button>
          <button
            onClick={() => setActiveNav('contact')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeNav === 'contact' ? 'bg-gold text-navy-950 font-bold shadow-md' : 'text-gray-300 hover:text-white'
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-navy-800 border border-gold/20 text-xs font-semibold text-gray-200 hover:bg-navy-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-gold" />
            <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
          </button>

          {/* Login / Launch Platform Button */}
          <button
            onClick={() => setCurrentView('control_tower')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{lang === 'ar' ? 'دخول المنصة الذكية' : 'Login / Launch OS'}</span>
          </button>
        </div>
      </header>

      {/* 2. SECTION: HOME (الرئيسية) */}
      {activeNav === 'home' && (
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="relative rounded-3xl bg-gradient-to-b from-navy-900 via-navy-950 to-[#030712] border border-gold/30 p-6 sm:p-14 shadow-2xl overflow-hidden text-center space-y-6">
            <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-semibold shadow-lg">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'نظام تشغيل سلاسل الإمداد والشحن الذكي بالسودان' : 'Sudan & Regional Logistics Operating System'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
              Move Smarter. <span className="text-gradient-gold">Deliver Further.</span>
            </h1>

            <p className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {lang === 'ar'
                ? 'شبكة تشغيلية ذكية وموحدة تربط الشاحنين والناقلين والسائقين والمستودعات عبر كافة الولايات والموانئ.'
                : 'One unified logistics network connecting shipments, carriers, fleets, and warehouses across Sudan and East Africa.'}
            </p>

            {/* Live Tracking Quick Widget */}
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
                  placeholder={lang === 'ar' ? 'أدخل رقم الشحنة (مثال: SDN-88419)...' : 'Enter tracking number (e.g. SDN-88419)...'}
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-xs sm:text-sm font-medium"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 font-bold text-xs sm:text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {lang === 'ar' ? 'تتبع الشحنة' : 'Track Cargo'}
                </button>
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setCurrentView('create_shipment')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-navy-950 font-bold text-sm shadow-xl hover:scale-105 transition-transform cursor-pointer"
              >
                {lang === 'ar' ? 'شحن فوري (طلب شاحنة)' : 'Ship Now (Instant Load)'}
              </button>
              <button
                onClick={() => setCurrentView('control_tower')}
                className="px-6 py-3 rounded-xl bg-navy-800/90 hover:bg-navy-800 text-white font-bold text-sm border border-gold/30 shadow-lg hover:border-gold cursor-pointer"
              >
                {lang === 'ar' ? 'مركز العمليات المباشر' : 'Live Control Tower'}
              </button>
            </div>
          </section>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-gold">300+</div>
              <div className="text-xs text-gray-300 mt-1">{lang === 'ar' ? 'شاحنة معتمدة ومفحوصة' : 'Certified Fleet Assets'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">97.4%</div>
              <div className="text-xs text-gray-300 mt-1">{lang === 'ar' ? 'نسبة الالتزام بالمواعيد' : 'On-Time Delivery (OTD)'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-sky-400">-28%</div>
              <div className="text-xs text-gray-300 mt-1">{lang === 'ar' ? 'وفر عبر الرحلات العائدة' : 'Backhaul Cost Savings'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold/20 text-center shadow-lg">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">24/7</div>
              <div className="text-xs text-gray-300 mt-1">{lang === 'ar' ? 'مركز طوارئ وإنقاذ لحظي' : 'Emergency & SOS Tower'}</div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SECTION: ABOUT US (من نحن) */}
      {activeNav === 'about' && (
        <section className="rounded-3xl bg-navy-900/90 border border-gold/25 p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gold/20 text-gold border border-gold/40">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {lang === 'ar' ? 'من نحن — شركة سودانيل للخدمات اللوجستية الذكية' : 'About Sudaneel Logistics Intelligence'}
              </h2>
              <p className="text-xs text-gray-400">
                {lang === 'ar' ? 'الريادة في رقمنة النقل وسلاسل الإمداد في السودان وإفريقيا' : 'Pioneering smart supply chain operating systems in Sudan'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <div className="space-y-3 bg-navy-950/80 p-5 rounded-2xl border border-navy-800">
              <h3 className="font-bold text-gold text-base">
                {lang === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Vision & Mission'}
              </h3>
              <p>
                {lang === 'ar'
                  ? 'تأسست سودانيل لتكون العمود الفقري الرقمي لحركة التجارة والصناعة في السودان، عبر تحويل النقل التقليدي إلى منظومة تشغيل رقمية ذكية تضمن الشفافية التامة، أمان الشحنات، وخفض التكاليف التشغيلية.'
                  : 'Sudaneel was established to serve as the sovereign digital logistics backbone of Sudan, transforming traditional trucking into an intelligent operating platform that guarantees visibility, cargo security, and cost efficiency.'}
              </p>
              <p>
                {lang === 'ar'
                  ? 'نغطي كافة الممرات الإستراتيجية: ممر التحدي (الخرطوم - بورتسودان)، ممر الجزيرة وسنار، ممر القضارف الزراعي، ومحطات الموانئ الجافة والمنافذ الحدودية.'
                  : 'We operate across all national corridors: Al-Tahaddi Highway (Khartoum - Port Sudan), Gezira & Sennar, Gedaref agricultural belt, dry ports, and border crossings.'}
              </p>
            </div>

            <div className="space-y-3 bg-navy-950/80 p-5 rounded-2xl border border-navy-800">
              <h3 className="font-bold text-sky-400 text-base">
                {lang === 'ar' ? 'قيمنا ومعاييرنا' : 'Core Values & Standards'}
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'ar' ? 'فحص ومصادقة 100% للناقلين وسجلات السائقين.' : '100% verified carriers, trucks, and background-checked drivers.'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'ar' ? 'بوالص شحن وتأمين شامل على البضائع.' : 'Comprehensive cargo insurance and digital manifest contracts.'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'ar' ? 'محرك ذكاء اصطناعي يقضي على الرحلات الفارغة (Zero Deadhead).' : 'AI matching eliminating empty returns and cutting emissions.'}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 4. SECTION: SERVICES (خدماتنا) */}
      {activeNav === 'services' && (
        <section className="space-y-6 animate-in fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {lang === 'ar' ? 'خدماتنا اللوجستية المتكاملة' : 'Comprehensive Logistics Services'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
              {lang === 'ar' ? 'حلول نقل وتخزين وتخليص مصممة خصيصاً لكبرى الشركات والمصانع والمصدرين.' : 'Engineered freight and supply chain solutions for enterprises and exporters.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/25 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center text-gold">
                <Repeat className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? 'بورصة الشحن والرحلات العائدة' : 'Freight Exchange & Backhaul'}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'ar'
                  ? 'مطابقة ذكية للشحنات مع الشاحنات العائدة فارغة من الموانئ لتوفير حتى 28% من تكلفة الشحن المعتادة.'
                  : 'Match loads with empty return trucks along major corridors to unlock 28% freight discounts.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/25 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? 'النقل المبرد وسلاسل الإمداد الطبية' : 'Reefer Cold-Chain Logistics'}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'ar'
                  ? 'شاحنات مبردة مجهزة بحساسات قياس درجات الحرارة لحظياً (-20°C إلى +8°C) للأدوية واللحوم والمنتجات الغذائية.'
                  : 'Live temperature-monitored reefers for pharmaceuticals, fresh meats, and perishable food.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/25 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'ar' ? 'خدمات ميناء بورتسودان والنقل العابر' : 'Port Sudan Terminal & Cross-Border'}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'ar'
                  ? 'مناولة الحاويات، التخليص الجمركي الفوري، والنقل متعدد الوسائط إلى مصر وتشاد وإثيوبيا والسعودية.'
                  : 'Wharf handling, container terminal drayage, and cross-border transit to Egypt, Chad, and Saudi Arabia.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 5. SECTION: TRACK SHIPMENT (تتبع الشحنة) */}
      {activeNav === 'track' && (
        <section className="rounded-3xl bg-navy-900/90 border border-gold/25 p-6 sm:p-10 shadow-2xl space-y-6 animate-in fade-in max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-gold/20 text-gold border border-gold/40 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {lang === 'ar' ? 'التتبع المباشر والجواز الرقمي للشحنة' : 'Real-time Cargo Tracking & Passport'}
          </h2>
          <p className="text-xs text-gray-300 max-w-md mx-auto">
            {lang === 'ar'
              ? 'أدخل رقم الشحنة للاطلاع على خط السير المباشر، سرعة الشاحنة، وموعد الوصول المتوقع (ETA).'
              : 'Enter your tracking number to access live GPS telemetry, milestone timeline, and predictive arrival ETA.'}
          </p>

          <form onSubmit={handleTrackSubmit} className="space-y-3">
            <div className="flex items-center gap-2 bg-navy-950 p-2 rounded-2xl border border-gold/30">
              <Search className="w-5 h-5 text-gold ps-2" />
              <input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="SDN-88419 / SDN-99104 / SDN-77312"
                className="flex-1 bg-transparent text-white font-mono text-sm outline-none px-2"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gold hover:bg-gold/90 text-navy-950 font-bold text-xs shadow-lg cursor-pointer"
              >
                {lang === 'ar' ? 'بحث وتتبع' : 'Track Now'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* 6. SECTION: CONTACT US (تواصل معنا — Exact match to user screenshot) */}
      {activeNav === 'contact' && (
        <section className="space-y-6 animate-in fade-in">
          {/* Contact Hero Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 p-8 sm:p-12 shadow-2xl text-center space-y-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30">
              {lang === 'ar' ? 'دعم متكامل على مدار الساعة' : '24/7 Dedicated Logistics Support'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {lang === 'ar' ? 'نحن هنا لخدمتك دائماً' : 'We Are Always Here For You'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
              {lang === 'ar'
                ? 'تواصل مع خبراء اللوجستيك لدينا للحصول على حلول مخصصة تدعم نمو أعمالك وتضمن وصول شحناتك بأمان واحترافية.'
                : 'Connect with our logistics engineers for tailored corporate solutions that power your business growth.'}
            </p>
          </div>

          {/* Contact Details & Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Direct Contact Card (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-gold/25 p-6 shadow-xl space-y-6">
              <h3 className="font-bold text-base text-white flex items-center gap-2 pb-3 border-b border-gold/15">
                <Building2 className="w-5 h-5 text-gold" />
                <span>{lang === 'ar' ? 'بيانات التواصل المباشر' : 'Direct Contact Info'}</span>
              </h3>

              {/* Phone Numbers */}
              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
                <div className="flex items-center gap-2 text-gold text-xs font-semibold">
                  <Phone className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'أرقام الهاتف المباشرة:' : 'Phone Numbers:'}</span>
                </div>
                <div className="font-mono text-sm text-white font-bold ps-6">+249 123 456 789</div>
                <div className="font-mono text-sm text-white font-bold ps-6">+249 912 345 678</div>
              </div>

              {/* Email */}
              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
                <div className="flex items-center gap-2 text-gold text-xs font-semibold">
                  <Mail className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                </div>
                <div className="font-mono text-xs text-gray-200 ps-6">info@sudaneel.com</div>
                <div className="font-mono text-xs text-gray-200 ps-6">sales@sudaneel.com</div>
              </div>

              {/* Head Offices */}
              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1">
                <div className="flex items-center gap-2 text-gold text-xs font-semibold">
                  <MapPin className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'المقرات والفروع:' : 'Headquarters & Branches:'}</span>
                </div>
                <div className="text-xs text-gray-300 ps-6">
                  {lang === 'ar' ? 'المقر الرئيسي: الخرطوم، المنطقة الصناعية' : 'HQ: Khartoum Industrial District'}
                </div>
                <div className="text-xs text-gray-300 ps-6">
                  {lang === 'ar' ? 'فرع الميناء: بورتسودان، المنطقة الحرة' : 'Port Branch: Port Sudan Free Zone'}
                </div>
              </div>
            </div>

            {/* Send Message Form (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl bg-navy-900/90 border border-gold/25 p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2 pb-3 border-b border-gold/15">
                <Send className="w-5 h-5 text-gold" />
                <span>{lang === 'ar' ? 'أرسل لنا رسالة أو استفسار' : 'Send Us a Message'}</span>
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}</label>
                    <input
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={lang === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      className="w-full p-3 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'البريد الإلكتروني:' : 'Email Address:'}</label>
                    <input
                      required
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="example@domain.com"
                      className="w-full p-3 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'الموضوع:' : 'Subject:'}</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full p-3 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold"
                    >
                      <option value="general">{lang === 'ar' ? 'استفسار عام' : 'General Inquiry'}</option>
                      <option value="corporate">{lang === 'ar' ? 'عقود شحن للشركات (B2B)' : 'Corporate Contract'}</option>
                      <option value="carrier">{lang === 'ar' ? 'انضمام ناقل أو سائق' : 'Join as Carrier / Driver'}</option>
                      <option value="support">{lang === 'ar' ? 'متابعة شحنة قائمة' : 'Shipment Support'}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'}</label>
                    <input
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+249 9X XXX XXX"
                      className="w-full p-3 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'الرسالة / تفاصيل الشحنة المطلوبة:' : 'Message / Shipment Specs:'}</label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب تفاصيل استفسارك أو مسار الشحن المطلوب...' : 'Describe your freight requirements...'}
                    className="w-full p-3 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none focus:border-gold custom-scrollbar"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-amber-500 hover:brightness-110 text-navy-950 font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إرسال الرسالة الآن' : 'Submit Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
