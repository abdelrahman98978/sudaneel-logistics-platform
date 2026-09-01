'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { availableLanguages } from '@/lib/i18n';
import { TiltCard } from '@/components/3d/TiltCard';
import { Logistics3DCanvas } from '@/components/3d/Logistics3DCanvas';
import { SpotlightBentoCard } from '@/components/3d/SpotlightBento';
import { HeroSpatialBackground, HeroFloatingBadges } from '@/components/3d/HeroSpatialHUD';
import {
  Search,
  Globe,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send,
  Calendar,
  Truck,
  Ship,
  Warehouse,
  Repeat,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  Package,
  Sparkles,
} from 'lucide-react';

export function LandingView() {
  const { setCurrentView, setSelectedShipmentId, shipments, lang, setLang } = useApp();

  // State management
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Hero showcase items (Tesla 100vh full-viewport gallery)
  const heroSlides = [
    {
      id: 'multimodal',
      titleAr: 'نقل بثقة .. نوصل باحتراف',
      titleEn: 'Deliver With Confidence & Precision',
      subtitleAr: 'حلول لوجستية متكاملة تلبي احتياجاتك عبر كافة ممرات السودان وموانئه',
      subtitleEn: 'Comprehensive Multimodal Freight & Sovereign Telemetry across Sudan',
      bgImage: '/images/hero-multimodal.jpg',
      primaryBtnAr: 'اطلب شحنة الآن',
      primaryBtnEn: 'Order Freight Now',
      primaryAction: () => setCurrentView('create_shipment'),
      secondaryBtnAr: 'استكشف المنصة',
      secondaryBtnEn: 'Operations OS',
      secondaryAction: () => setCurrentView('control_tower'),
    },
    {
      id: 'port',
      titleAr: 'بوابة بورتسودان وسلاسل الإمداد العالمية',
      titleEn: 'Port Sudan Global Hub & Maritime Gateway',
      subtitleAr: 'مناولة متكاملة للحاويات وتخليص جمركي إلكتروني فوري مع منع غرامات الأرضيات',
      subtitleEn: 'Integrated Container Terminal Logistics & Digital Customs Clearance',
      bgImage: '/images/port-sudan-terminal.jpg',
      primaryBtnAr: 'حجز حاوية فوري',
      primaryBtnEn: 'Book Container',
      primaryAction: () => setCurrentView('port_sudan'),
      secondaryBtnAr: 'جدول الرحلات البحرية',
      secondaryBtnEn: 'Port Schedules',
      secondaryAction: () => setCurrentView('port_sudan'),
    },
    {
      id: 'warehouse',
      titleAr: 'المستودعات الذكية وسلاسل التبريد',
      titleEn: 'Smart Warehousing & Cold Chain Network',
      subtitleAr: 'طاقة تخزينية 120,000 طن متري مع رصد حراري دقيق للسلع الحيوية',
      subtitleEn: '120,000 MT Storage Capacity with Active Temperature Telemetry',
      bgImage: '/images/warehouse-hub.jpg',
      primaryBtnAr: 'حجز مساحة تخزين',
      primaryBtnEn: 'Reserve Storage',
      primaryAction: () => setCurrentView('warehousing'),
      secondaryBtnAr: 'شبكة المراكز اللوجستية',
      secondaryBtnEn: 'Explore Hubs',
      secondaryAction: () => setCurrentView('locations'),
    },
    {
      id: 'fleet',
      titleAr: 'أسطول النقل الثقيل واللوجستيات',
      titleEn: 'Sovereign Logistics Fleet',
      subtitleAr: 'شاحنات ثقيلة مبردة وجافة وفانات توصيل سريع موحدة الهوية',
      subtitleEn: 'Euro 5/6 Heavy & Express Fleet with 4-second GPS Refresh',
      bgImage: '/images/fleet-vehicles.jpg',
      primaryBtnAr: 'استكشف الأسطول',
      primaryBtnEn: 'View Fleet Inventory',
      primaryAction: () => setCurrentView('fleet'),
      secondaryBtnAr: 'بورصة الشاحنات',
      secondaryBtnEn: 'Backhaul Exchange',
      secondaryAction: () => setCurrentView('marketplace'),
    },
  ];

  // Auto-advance hero carousel every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Scroll listener for nav styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setCurrentView('control_tower');
  };

  // Mega dropdown data (3-column vehicle cards + text sidebar)
  const megaMenuContent: Record<string, {
    columns: { name: string; type: string; img: string; view: string }[];
    sidebarLinks: { label: string; view: string }[];
  }> = {
    fleet: {
      columns: [
        { name: 'Volvo Heavy Freight 40ft', type: 'شاحنة نقل ثقيل وتريلات', img: '/images/fleet-vehicles.jpg', view: 'fleet' },
        { name: 'Mercedes Sprinter Van', type: 'فان توصيل سريع وتوزيع محلي', img: '/images/fleet-vehicles.jpg', view: 'fleet' },
        { name: 'Heavy Highway Runner', type: 'قوافل الشحن عبر الممرات الصحراوية', img: '/images/fleet-highway.jpg', view: 'fleet' },
      ],
      sidebarLinks: [
        { label: 'مواصفات ومعايير الأسطول', view: 'fleet' },
        { label: 'بوابة تسجيل الناقلين', view: 'carrier_portal' },
        { label: 'تطبيق السائقين الرقمي', view: 'driver_app' },
        { label: 'تطبيق العميل الرقمي للجوال', view: 'mobile_app' },
        { label: 'معايير السلامة والفحص الفني', view: 'incidents' },
      ],
    },
    ports: {
      columns: [
        { name: 'محطة الحاويات الجنوبية (SCT)', type: 'بورتسودان — طاقة 650K TEU', img: '/images/port-sudan-terminal.jpg', view: 'port_sudan' },
        { name: 'محطة الصب الجاف الساحلية', type: 'تفريغ وتعبئة الحبوب والأسمنت', img: '/images/port-sudan-terminal.jpg', view: 'port_sudan' },
        { name: 'مستودعات الإيداع الجمركي (Bonded)', type: 'تخزين معفى قبل التخليص', img: '/images/port-sudan-terminal.jpg', view: 'port_sudan' },
      ],
      sidebarLinks: [
        { label: 'مساحة عمل التخليص الجمركي (Customs Workspace)', view: 'customs_workspace' },
        { label: 'حاسبة الرسوم والتخليص الجمركي', view: 'port_sudan' },
        { label: 'إجراءات عبور الشاحنات الحدودية', view: 'cross_border' },
        { label: 'سجلات بوالص الشحن الإلكترونية', view: 'shipments' },
      ],
    },
    warehouses: {
      columns: [
        { name: 'المستودع الذكي المركزي A01/B01', type: 'الخرطوم وبورتسودان — 120,000 م²', img: '/images/warehouse-hub.jpg', view: 'warehousing' },
        { name: 'المقر الرئيسي وساحات الاستقبال', type: 'مركز العمليات المتقدم ومكاتب العملاء', img: '/images/hq-facility.jpg', view: 'locations' },
        { name: 'مستودعات التبريد الدوائي والغذائي', type: 'حفظ مبرد ومجمد مع حساسات IoT', img: '/images/warehouse-hub.jpg', view: 'warehousing' },
      ],
      sidebarLinks: [
        { label: 'إدارة المخزون والمساحات الفورية', view: 'warehousing' },
        { label: 'سلاسل التبريد والتخزين الدوائي', view: 'warehousing' },
        { label: 'دليل المستودعات والمحطات', view: 'locations' },
      ],
    },
    marketplace: {
      columns: [
        { name: 'رحلات بورتسودان ➔ الخرطوم', type: 'شاحنات عائدة بخصم 28%', img: '/images/fleet-highway.jpg', view: 'marketplace' },
        { name: 'رحلات عطبرة ➔ الدمازين', type: 'شاحنات صب ومواد بناء', img: '/images/fleet-vehicles.jpg', view: 'marketplace' },
        { name: 'رحلات كوستي ➔ كسلا', type: 'نقل محاصيل وسلع استهلاكية', img: '/images/hero-multimodal.jpg', view: 'marketplace' },
      ],
      sidebarLinks: [
        { label: 'جميع الصفقات والعروض المفتوحة', view: 'marketplace' },
        { label: 'نظام التوزيع والتوجيه الذكي', view: 'smart_dispatch' },
        { label: 'عقود الشحن وإدارة العملاء CRM', view: 'contracts_crm' },
      ],
    },
  };

  return (
    <div className="relative bg-[#FFFFFF] text-[#171A20] font-sans selection:bg-[#3E6AE1] selection:text-[#FFFFFF]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* 1. Tesla Frosted Glass Floating Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-330 ${
          isScrolled
            ? 'bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EEEEEE]'
            : 'bg-transparent text-white border-b border-white/10'
        }`}
      >
        <div className="max-w-[1383px] mx-auto px-6 h-[64px] flex items-center justify-between">
          {/* Brand Wordmark & Logo */}
          <div
            onClick={() => setActiveHeroIndex(0)}
            className="cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-[4px] bg-white p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src="/images/brand-logo.jpg"
                alt="سودانيل لوجيستك"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="leading-tight">
              <span
                className={`text-[15px] font-[500] tracking-wide block ${
                  isScrolled ? 'text-[#171A20]' : 'text-white'
                }`}
              >
                {lang === 'ar' ? 'سودانيل لوجيستك' : 'SUDANIL LOGISTIC'}
              </span>
              <span
                className={`text-[10px] block ${
                  isScrolled ? 'text-[#5C5E62]' : 'text-white/80'
                }`}
              >
                {lang === 'ar' ? 'نقل بثقة .. نوصل باحتراف' : 'Deliver with Confidence'}
              </span>
            </div>
          </div>

          {/* Center Navigation Links (14px / 500 / Carbon Dark) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onMouseEnter={() => setActiveMegaMenu('fleet')}
              onClick={() => setCurrentView('fleet')}
              className={`text-[14px] font-[500] px-4 py-1.5 rounded-[4px] transition-colors duration-330 cursor-pointer ${
                isScrolled
                  ? 'text-[#171A20] hover:bg-[#F4F4F4]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {lang === 'ar' ? 'الأسطول والخدمات' : 'Fleet & Services'}
            </button>

            <button
              onMouseEnter={() => setActiveMegaMenu('ports')}
              onClick={() => setCurrentView('port_sudan')}
              className={`text-[14px] font-[500] px-4 py-1.5 rounded-[4px] transition-colors duration-330 cursor-pointer ${
                isScrolled
                  ? 'text-[#171A20] hover:bg-[#F4F4F4]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {lang === 'ar' ? 'الموانئ والتخليص' : 'Ports & Customs'}
            </button>

            <button
              onMouseEnter={() => setActiveMegaMenu('warehouses')}
              onClick={() => setCurrentView('warehousing')}
              className={`text-[14px] font-[500] px-4 py-1.5 rounded-[4px] transition-colors duration-330 cursor-pointer ${
                isScrolled
                  ? 'text-[#171A20] hover:bg-[#F4F4F4]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {lang === 'ar' ? 'المستودعات والمراكز' : 'Warehousing & Hubs'}
            </button>

            <button
              onMouseEnter={() => setActiveMegaMenu('marketplace')}
              onClick={() => setCurrentView('marketplace')}
              className={`text-[14px] font-[500] px-4 py-1.5 rounded-[4px] transition-colors duration-330 cursor-pointer ${
                isScrolled
                  ? 'text-[#171A20] hover:bg-[#F4F4F4]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {lang === 'ar' ? 'السوق اللوجستي' : 'Freight Exchange'}
            </button>

            <button
              onClick={() => setCurrentView('public_track')}
              className={`text-[14px] font-[500] px-4 py-1.5 rounded-[4px] transition-colors duration-330 cursor-pointer ${
                isScrolled
                  ? 'text-[#171A20] hover:bg-[#F4F4F4]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {lang === 'ar' ? 'تتبع الشحنات' : 'Tracking'}
            </button>
          </nav>

          {/* Right Action Utilities (Language, Login / OS Switcher) */}
          <div className="flex items-center gap-3">
            {/* 14-Language Switcher */}
            <div
              className={`text-[13px] font-[500] px-2.5 py-1 rounded-[4px] transition-colors duration-330 flex items-center gap-1.5 border ${
                isScrolled
                  ? 'text-[#171A20] border-[#D0D1D2] bg-white'
                  : 'text-white border-white/20 bg-black/20'
              }`}
            >
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className={`bg-transparent border-0 text-[12px] font-[500] cursor-pointer outline-none ${
                  isScrolled ? 'text-[#171A20]' : 'text-white'
                }`}
              >
                {availableLanguages.map((l) => (
                  <option key={l.code} value={l.code} className="text-[#000000] bg-white">
                    {l.flag} {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Internal OS Login Button (Tesla Secondary style) */}
            <button
              onClick={() => setCurrentView('control_tower')}
              className={`text-[14px] font-[500] px-4 py-1.5 rounded-[4px] transition-colors duration-330 cursor-pointer border ${
                isScrolled
                  ? 'border-[#D0D1D2] text-[#171A20] bg-white hover:bg-[#F4F4F4]'
                  : 'border-white/30 text-white bg-black/20 hover:bg-white/20'
              }`}
            >
              {lang === 'ar' ? 'نظام العمليات OS' : 'Operations OS'}
            </button>
          </div>
        </div>

        {/* Mega Dropdown Panel (Tesla Style - Pure White, No Shadow, 3 Columns + Sidebar) */}
        {activeMegaMenu && (
          <div
            onMouseLeave={() => setActiveMegaMenu(null)}
            className="w-full bg-[#FFFFFF] border-b border-[#EEEEEE] py-10 px-6 text-[#171A20] animate-in fade-in duration-200"
          >
            <div className="max-w-[1383px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* 3-Column Vehicle Grid (70% width) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {megaMenuContent[activeMegaMenu]?.columns.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentView(item.view as any);
                      setActiveMegaMenu(null);
                    }}
                    className="group cursor-pointer text-center space-y-3 p-2"
                  >
                    <div className="h-28 rounded-[4px] bg-[#F4F4F4] overflow-hidden flex items-center justify-center">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-330"
                        style={{ backgroundImage: `url('${item.img}')` }}
                      ></div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[17px] font-[500] text-[#171A20] leading-snug">
                        {item.name}
                      </div>
                      <div className="text-[13px] font-[400] text-[#5C5E62]">
                        {item.type}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-[14px] font-[400] text-[#5C5E62] pt-1">
                      <span className="hover:text-[#171A20] hover:underline transition-colors duration-330">
                        {lang === 'ar' ? 'تفاصيل' : 'Learn'}
                      </span>
                      <span className="hover:text-[#171A20] hover:underline transition-colors duration-330">
                        {lang === 'ar' ? 'طلب فوري' : 'Order'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Sub-links Sidebar (30% width) */}
              <div className="lg:col-span-4 border-s border-[#EEEEEE] ps-8 space-y-4">
                <div className="text-[13px] font-[500] text-[#8E8E8E] uppercase tracking-wider">
                  {lang === 'ar' ? 'روابط سريعة' : 'Quick Navigation'}
                </div>
                <div className="space-y-2.5">
                  {megaMenuContent[activeMegaMenu]?.sidebarLinks.map((link, lIdx) => (
                    <button
                      key={lIdx}
                      onClick={() => {
                        setCurrentView(link.view as any);
                        setActiveMegaMenu(null);
                      }}
                      className="block w-full text-start text-[14px] font-[400] text-[#393C41] hover:text-[#3E6AE1] transition-colors duration-330 cursor-pointer"
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. Full-Viewport (100vh) Hero Sections Showroom */}
      <div className="snap-container">
        {heroSlides.map((slide, sIdx) => {
          const isActive = activeHeroIndex === sIdx;

          return (
            <section
              key={slide.id}
              className="snap-section relative w-full h-screen overflow-hidden flex flex-col justify-between"
            >
              {/* Full-bleed Edge-to-Edge Cinematic Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{ backgroundImage: `url('${slide.bgImage}')` }}
              >
                {/* Subtle contrast mask for typography clarity */}
                <div className="absolute inset-0 bg-black/45"></div>
                {/* 3D Radial Glow Gradient */}
                <div className="absolute inset-0 bg-radial from-transparent via-[#032C70]/30 to-[#010D26]/80"></div>
              </div>

              {/* 3D Interactive Spatial Particle Canvas */}
              <HeroSpatialBackground />

              {/* Floating 3D Spatial Telemetry HUD Badges */}
              <HeroFloatingBadges />

              {/* Top Spacing for Navigation */}
              <div className="pt-24"></div>

              {/* Center Hero Information (3D Spatial Typography) */}
              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#032C70]/70 border border-[#D7A11E]/40 text-[#D7A11E] text-[12px] font-mono shadow-[0_4px_20px_rgba(215,161,30,0.2)] backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SUDANEEL SPATIAL TELEMETRY • RED SEA GATEWAY</span>
                </div>
                <h1 className="text-[34px] sm:text-[50px] font-[600] text-white leading-[48px] sm:leading-[58px] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                  {lang === 'ar' ? slide.titleAr : slide.titleEn}
                </h1>
                <p className="text-[16px] sm:text-[19px] font-[400] text-[#93C5FD] bg-[#032C70]/60 backdrop-blur-md inline-block px-5 py-1.5 rounded-full border border-white/10 shadow-lg">
                  {lang === 'ar' ? slide.subtitleAr : slide.subtitleEn}
                </p>
              </div>

              {/* Bottom Actions Container (3D Spatial Controls) */}
              <div className="relative z-10 max-w-xl mx-auto px-6 pb-20 sm:pb-24 w-full space-y-6 text-center">
                {/* Side-by-side Button Pair */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Primary CTA */}
                  <button
                    onClick={slide.primaryAction}
                    className="btn-tesla-primary w-full sm:w-auto shadow-[0_0_25px_rgba(62,106,225,0.5)]"
                  >
                    {lang === 'ar' ? slide.primaryBtnAr : slide.primaryBtnEn}
                  </button>

                  {/* Secondary CTA */}
                  <button
                    onClick={slide.secondaryAction}
                    className="btn-tesla-secondary w-full sm:w-auto hover:bg-white/90"
                  >
                    {lang === 'ar' ? slide.secondaryBtnAr : slide.secondaryBtnEn}
                  </button>
                </div>

                {/* 3D Glass Floating Search & Track Console */}
                <div className="max-w-lg mx-auto space-y-2.5">
                  <form
                    onSubmit={handleTrackSubmit}
                    className="flex items-center bg-[#032C70]/75 backdrop-blur-xl rounded-full border border-[#2563EB]/40 p-1.5 text-[14px] shadow-[0_12px_36px_rgba(0,0,0,0.5)] focus-within:border-[#D7A11E] transition-all duration-300"
                  >
                    <div className="ps-3 pe-2 text-[#93C5FD]">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder={lang === 'ar' ? 'تتبع لحظي: رقم الشحنة أو بوليصة الشحن B/L...' : 'Instant Tracking: Enter ID or B/L...'}
                      className="flex-1 bg-transparent px-2 py-2 text-white placeholder-white/50 outline-none text-[14px] font-[400]"
                    />
                    <button
                      type="submit"
                      className="btn-shopify-pill !bg-[#2563EB] hover:!bg-[#1d4ed8] text-white px-6 py-2 rounded-full font-[500] text-[13.5px] transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.5)] cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{lang === 'ar' ? 'تتبع فوري' : 'Track'}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* 1-Click Quick Tracking Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-white/70">
                    <span className="text-[#D7A11E]">تجربة سريعة:</span>
                    {['SDN-88219', 'B/L-44910', 'SDN-90412'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setTrackingInput(tag);
                          setSelectedShipmentId(tag);
                          setCurrentView('shipments');
                        }}
                        className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors cursor-pointer"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Carousel Dot Indicators (50% circles at bottom center) */}
              <div className="absolute bottom-12 left-0 right-0 z-20 flex items-center justify-center gap-2">
                {heroSlides.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setActiveHeroIndex(dotIdx)}
                    className={`w-2 h-2 rounded-full transition-all duration-330 cursor-pointer ${
                      activeHeroIndex === dotIdx ? 'bg-white w-6' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>

              {/* Carousel Arrow Navigation on Edges */}
              <button
                onClick={() =>
                  setActiveHeroIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))
                }
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-[4px] bg-white/30 hover:bg-white/60 backdrop-blur-md flex items-center justify-center text-white transition-colors duration-330 cursor-pointer hidden sm:flex"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  setActiveHeroIndex((prev) => (prev + 1) % heroSlides.length)
                }
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-[4px] bg-white/30 hover:bg-white/60 backdrop-blur-md flex items-center justify-center text-white transition-colors duration-330 cursor-pointer hidden sm:flex"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </section>
          );
        })}
      </div>

      {/* 2.5. 3D Interactive Cyber-Maritime Showcase (WebGL & 360 Canvas Simulator) */}
      <section className="bg-[#010D26] py-20 px-6 relative overflow-hidden border-y border-[#2563EB]/20">
        <div className="absolute top-1/4 -start-40 w-96 h-96 bg-[#0B5ED7]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -end-40 w-96 h-96 bg-[#D7A11E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1383px] mx-auto space-y-8 relative z-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0849A8]/40 border border-[#2563EB]/40 text-[#D7A11E] text-[12px] font-mono font-[600]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SUDANEEL 3D DIGITAL TWIN & REAL-TIME SIMULATOR</span>
            </div>
            <h2 className="text-[32px] sm:text-[44px] font-[500] text-white tracking-tight leading-tight">
              {lang === 'ar'
                ? 'تجربة تفاعلية ثلاثية الأبعاد للأسطول والموانئ'
                : '3D Interactive Experience: Fleet, Ports & Corridors'}
            </h2>
            <p className="text-[15px] sm:text-[17px] font-[400] text-[#93C5FD]/80 leading-relaxed">
              {lang === 'ar'
                ? 'استكشف شاحنات الأسطول الثقيل ومحطة حاويات ميناء بورتسودان وشبكة الممرات السيادية عبر مجسم تفاعلي 360° مدعوم بمصفوفة إحداثيات حية.'
                : 'Explore heavy haulage fleet trucks, Port Sudan container terminal, and national corridors in full 360° interactive 3D.'}
            </p>
          </div>

          {/* Interactive 3D Canvas Visualizer */}
          <Logistics3DCanvas />
        </div>
      </section>

      {/* 3. Category Cards Showcase (Tesla 2:1 Landscape Cards with 12px Border Radius) */}
      <section className="bg-[#FFFFFF] py-20 px-6 max-w-[1383px] mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-[32px] sm:text-[40px] font-[500] text-[#171A20]">
            {lang === 'ar' ? 'حلول سلاسل الإمداد المتكاملة' : 'Integrated Supply Chain Solutions'}
          </h2>
          <p className="text-[17px] font-[400] text-[#5C5E62]">
            {lang === 'ar'
              ? 'بنية تحتية رقمية متطورة تربط النقل البري والبحري بالمستودعات الذكية'
              : 'Advanced digital infrastructure bridging multimodal freight and smart hubs'}
          </p>
        </div>

        {/* 4-Up Horizontal Landscape Cards Grid with 3D Tilt & Lighting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: النقل البري للممرات الحيوية */}
          <TiltCard maxRotation={7} scaleOnHover={1.02} glowColor="rgba(8, 73, 168, 0.25)">
            <div
              onClick={() => setCurrentView('fleet')}
              className="relative h-[300px] sm:h-[340px] rounded-[14px] overflow-hidden cursor-pointer group border border-[#EEEEEE] shadow-sm"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: "url('/images/fleet-highway.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
              {/* Top Label */}
              <div className="absolute top-5 start-5 z-10">
                <span className="text-[12px] font-mono font-[500] text-white px-2.5 py-1 rounded-[4px] bg-white/20 backdrop-blur-md">
                  Euro 5/6 Heavy Fleet
                </span>
              </div>
              {/* Bottom Info */}
              <div className="absolute bottom-5 start-5 end-5 z-10 flex items-end justify-between">
                <div>
                  <h3 className="text-[18px] font-[500] text-white">
                    {lang === 'ar' ? 'ممرات النقل البري والشاحنات الثقيلة' : 'National Highway Freight Corridors'}
                  </h3>
                  <p className="text-[12px] text-[#D0D1D2] mt-0.5">
                    {lang === 'ar' ? 'ربط لحظي لكافة الولايات وقوافل الشحن المؤمنة' : 'Real-time convoy routing across all sovereign corridors'}
                  </p>
                </div>
                <button className="text-[13px] font-[500] text-white underline underline-offset-4 flex items-center gap-1 flex-shrink-0">
                  <span>{lang === 'ar' ? 'استكشف الأسطول' : 'Explore'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </TiltCard>

          {/* Card 2: الموانئ والتجارة الدولية */}
          <TiltCard maxRotation={7} scaleOnHover={1.02} glowColor="rgba(215, 161, 30, 0.25)">
            <div
              onClick={() => setCurrentView('port_sudan')}
              className="relative h-[300px] sm:h-[340px] rounded-[14px] overflow-hidden cursor-pointer group border border-[#EEEEEE] shadow-sm"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: "url('/images/port-sudan-terminal.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
              {/* Top Label */}
              <div className="absolute top-5 start-5 z-10">
                <span className="text-[12px] font-mono font-[500] text-white px-2.5 py-1 rounded-[4px] bg-white/20 backdrop-blur-md">
                  Port Sudan Hub (SCT)
                </span>
              </div>
              {/* Bottom Info */}
              <div className="absolute bottom-5 start-5 end-5 z-10 flex items-end justify-between">
                <div>
                  <h3 className="text-[18px] font-[500] text-white">
                    {lang === 'ar' ? 'التجارة الدولية وموانئ البحر الأحمر' : 'Maritime Ports & Red Sea Gateway'}
                  </h3>
                  <p className="text-[12px] text-[#D0D1D2] mt-0.5">
                    {lang === 'ar' ? 'تخليص جمركي فوري وتفريغ مباشر للحاويات' : 'Direct container evacuation & automated customs clearance'}
                  </p>
                </div>
                <button className="text-[13px] font-[500] text-white underline underline-offset-4 flex items-center gap-1 flex-shrink-0">
                  <span>{lang === 'ar' ? 'محطة الحاويات' : 'Ports Hub'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </TiltCard>

          {/* Card 3: المستودعات الذكية */}
          <TiltCard maxRotation={7} scaleOnHover={1.02} glowColor="rgba(20, 164, 77, 0.25)">
            <div
              onClick={() => setCurrentView('warehousing')}
              className="relative h-[300px] sm:h-[340px] rounded-[14px] overflow-hidden cursor-pointer group border border-[#EEEEEE] shadow-sm"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: "url('/images/warehouse-hub.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
              {/* Top Label */}
              <div className="absolute top-5 start-5 z-10">
                <span className="text-[12px] font-mono font-[500] text-white px-2.5 py-1 rounded-[4px] bg-white/20 backdrop-blur-md">
                  Smart WMS & Cold Chain
                </span>
              </div>
              {/* Bottom Info */}
              <div className="absolute bottom-5 start-5 end-5 z-10 flex items-end justify-between">
                <div>
                  <h3 className="text-[18px] font-[500] text-white">
                    {lang === 'ar' ? 'المستودعات الذكية وسلاسل التبريد' : 'Smart Warehouses & Cold Chain'}
                  </h3>
                  <p className="text-[12px] text-[#D0D1D2] mt-0.5">
                    {lang === 'ar' ? '120,000 م² مساحات تخزين جاف ومبرد ومجمرك' : 'Bonded & temperature-monitored strategic facilities'}
                  </p>
                </div>
                <button className="text-[13px] font-[500] text-white underline underline-offset-4 flex items-center gap-1 flex-shrink-0">
                  <span>{lang === 'ar' ? 'حجز مساحة' : 'Reserve'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </TiltCard>

          {/* Card 4: المقر والمحطات */}
          <TiltCard maxRotation={7} scaleOnHover={1.02} glowColor="rgba(37, 99, 235, 0.25)">
            <div
              onClick={() => setCurrentView('locations')}
              className="relative h-[300px] sm:h-[340px] rounded-[14px] overflow-hidden cursor-pointer group border border-[#EEEEEE] shadow-sm"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: "url('/images/hq-facility.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
              {/* Top Label */}
              <div className="absolute top-5 start-5 z-10">
                <span className="text-[12px] font-mono font-[500] text-white px-2.5 py-1 rounded-[4px] bg-white/20 backdrop-blur-md">
                  10 Strategic Hubs
                </span>
              </div>
              {/* Bottom Info */}
              <div className="absolute bottom-5 start-5 end-5 z-10 flex items-end justify-between">
                <div>
                  <h3 className="text-[18px] font-[500] text-white">
                    {lang === 'ar' ? 'المقر الرئيسي وشبكة المحطات في الولايات' : 'Corporate HQ & Regional Stations'}
                  </h3>
                  <p className="text-[12px] text-[#D0D1D2] mt-0.5">
                    {lang === 'ar' ? 'صالات استقبال مجهزة وأرصفة مناولة سريعة' : '24/7 client reception centers & rapid truck loading docks'}
                  </p>
                </div>
                <button className="text-[13px] font-[500] text-white underline underline-offset-4 flex items-center gap-1 flex-shrink-0">
                  <span>{lang === 'ar' ? 'دليل المحطات' : 'View Hubs'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Services Matrix Trust Showcase */}
        <div className="pt-8 border-t border-[#EEEEEE] space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[#3E6AE1] text-[12px] font-mono uppercase font-[500]">
              Official Certified Operations
            </span>
            <h3 className="text-[24px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'منظومة الخدمات اللوجستية المتكاملة' : 'Full Spectrum Logistics Services'}
            </h3>
            <p className="text-[13px] text-[#5C5E62]">
              {lang === 'ar' ? 'نقل بري • شحن بحري • شحن جوي • تخزين ذكي • مناولة • تتبع • توصيل سريع • تخليص جمركي • دعم 24/7' : 'Multimodal Freight, Bonded Storage, Customs Clearance & Telemetry'}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="p-4 bg-[#F4F4F4] rounded-[8px] border border-[#EEEEEE] max-w-2xl w-full flex justify-center">
              <img
                src="/images/services-badges-2.jpg"
                alt="خدمات سودانيل لوجيستك المعتمدة"
                className="w-full h-auto max-h-[360px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. 3D Spotlight Bento Grid (Operational Intelligence & KPIs) */}
      <section className="bg-[#021333] py-24 px-6 relative overflow-hidden border-t border-[#2563EB]/20 text-white">
        <div className="absolute top-10 end-10 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 start-10 w-96 h-96 bg-[#D7A11E]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1383px] mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0849A8]/40 border border-[#2563EB]/40 text-[#D7A11E] text-[12px] font-mono font-[600]">
              <Zap className="w-3.5 h-3.5" />
              <span>SOVEREIGN OPERATIONAL BENCHMARKS & 3D TELEMETRY</span>
            </div>
            <h2 className="text-[32px] sm:text-[44px] font-[500] text-white tracking-tight leading-tight">
              {lang === 'ar' ? 'مواصفات ومقاييس الأداء اللوجستي الذكي' : 'Smart Logistics Telemetry & Standards'}
            </h2>
            <p className="text-[15px] sm:text-[17px] font-[400] text-[#93C5FD]/80">
              {lang === 'ar'
                ? 'مؤشرات أداء سيادية مبنية على الذكاء الاصطناعي، تضمن أقصى درجات الشفافية والسرعة وتوفير التكاليف'
                : 'Sovereign performance metrics driven by real-time telemetry, ensuring highest speed, trust, and cost reduction'}
            </p>
          </div>

          {/* 3D Bento Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Main Metric (Spans 2 columns on desktop) */}
            <SpotlightBentoCard
              className="md:col-span-2 flex flex-col justify-between min-h-[280px]"
              spotlightColor="rgba(37, 99, 235, 0.35)"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono text-[#D7A11E] px-2.5 py-1 rounded-full bg-[#D7A11E]/10 border border-[#D7A11E]/30">
                    Live Telemetry Core
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-[#14A44D] font-mono">
                    <span className="w-2 h-2 rounded-full bg-[#14A44D] animate-ping" />
                    98.4% SLA Compliance
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="text-[48px] sm:text-[64px] font-[700] text-white font-mono tracking-tight leading-none">
                    +1,420 <span className="text-[24px] font-[400] text-[#93C5FD]">شاحنة ومركبة</span>
                  </div>
                  <h3 className="text-[20px] font-[500] text-white">
                    {lang === 'ar' ? 'أسطول النقل الثقيل المعتمد والمراقب بالأقمار الاصطناعية' : 'Sovereign Satellite-Tracked Heavy Fleet'}
                  </h3>
                  <p className="text-[14px] text-[#93C5FD]/80 max-w-xl leading-relaxed">
                    {lang === 'ar'
                      ? 'ربط مباشر لكافة الشاحنات عبر حساسات إنترنت الأشياء (IoT)، وتتبع لحظي لمعدلات استهلاك الوقود وأوزان الحمولات ومستويات الأمان.'
                      : 'Real-time telemetry integrating IoT axle load sensors, speed governor telemetry, and live cargo condition monitoring.'}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setCurrentView('control_tower')}
                  className="btn-shopify-pill !bg-[#2563EB] hover:!bg-[#1d4ed8] text-white text-[13px]"
                >
                  <span>{lang === 'ar' ? 'فتح برج المراقبة الحي' : 'Open Live Tower'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <span className="text-[12px] text-white/50 font-mono">GPS PING: 4s</span>
              </div>
            </SpotlightBentoCard>

            {/* Bento Card 2: Cost Reduction */}
            <SpotlightBentoCard
              className="flex flex-col justify-between min-h-[280px]"
              spotlightColor="rgba(215, 161, 30, 0.35)"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono text-[#2563EB] px-2.5 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/30">
                    Backhaul Engine
                  </span>
                  <Repeat className="w-5 h-5 text-[#D7A11E]" />
                </div>

                <div className="space-y-2">
                  <div className="text-[44px] font-[700] text-[#D7A11E] font-mono tracking-tight leading-none">
                    -28.5%
                  </div>
                  <h3 className="text-[18px] font-[500] text-white">
                    {lang === 'ar' ? 'وفر في تكلفة الشحن للرحلات العائدة' : 'Backhaul Freight Cost Reduction'}
                  </h3>
                  <p className="text-[13.5px] text-[#93C5FD]/80 leading-relaxed">
                    {lang === 'ar'
                      ? 'خوارزميات ذكية تُطابق الحمولات المصدرة فوراً مع الشاحنات الفارغة العائدة من الموانئ.'
                      : 'Algorithmic matching pairing empty returning reefers and flatbeds with inland export loads.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="text-[13px] font-[500] text-[#D7A11E] hover:underline flex items-center gap-1"
                >
                  <span>{lang === 'ar' ? 'استعراض بورصة الشحن' : 'Explore Exchange'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </SpotlightBentoCard>

            {/* Bento Card 3: Storage Capacity */}
            <SpotlightBentoCard
              className="flex flex-col justify-between min-h-[280px]"
              spotlightColor="rgba(20, 164, 77, 0.35)"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono text-[#14A44D] px-2.5 py-1 rounded-full bg-[#14A44D]/10 border border-[#14A44D]/30">
                    Bonded WMS
                  </span>
                  <Warehouse className="w-5 h-5 text-[#14A44D]" />
                </div>

                <div className="space-y-2">
                  <div className="text-[44px] font-[700] text-white font-mono tracking-tight leading-none">
                    120K MT
                  </div>
                  <h3 className="text-[18px] font-[500] text-white">
                    {lang === 'ar' ? 'طاقة تخزينية استراتيجية مبردة وجافة' : 'Cold & Dry Strategic Warehousing'}
                  </h3>
                  <p className="text-[13.5px] text-[#93C5FD]/80 leading-relaxed">
                    {lang === 'ar'
                      ? 'مستودعات مرخصة جمركياً ومجهزة بأنظمة مراقبة درجات الحرارة والرطوبة لضمان سلامة البضائع.'
                      : 'Fully bonded facilities with IoT climate monitoring for pharmaceuticals and agricultural produce.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setCurrentView('warehousing')}
                  className="text-[13px] font-[500] text-[#14A44D] hover:underline flex items-center gap-1"
                >
                  <span>{lang === 'ar' ? 'حجز مساحات تخزين' : 'Reserve Bays'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </SpotlightBentoCard>

            {/* Bento Card 4: Port Sudan Rapid Clearance (Spans 2 columns on desktop) */}
            <SpotlightBentoCard
              className="md:col-span-2 flex flex-col justify-between min-h-[280px]"
              spotlightColor="rgba(6, 182, 212, 0.35)"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono text-[#06B6D4] px-2.5 py-1 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30">
                    Red Sea Maritime Gateway
                  </span>
                  <span className="text-[12px] font-mono text-[#D7A11E]">HS CODES & TARIFF ENGINE</span>
                </div>

                <div className="space-y-2">
                  <div className="text-[40px] sm:text-[48px] font-[700] text-white font-mono tracking-tight leading-none">
                    24/7 <span className="text-[20px] font-[400] text-[#06B6D4]">تخليص وإفراج فوري</span>
                  </div>
                  <h3 className="text-[20px] font-[500] text-white">
                    {lang === 'ar' ? 'محطة حاويات ميناء بورتسودان ومساحة العمل الجمركية' : 'Port Sudan Maritime Terminal & Customs Clearance Hub'}
                  </h3>
                  <p className="text-[14px] text-[#93C5FD]/80 max-w-xl leading-relaxed">
                    {lang === 'ar'
                      ? 'إجراءات مؤتمتة لإصدار بوالص الشحن الإلكترونية (e-BOL) وشهادات الإفراج الجمركي مع رموز QR للتحقق السريع عبر المعابر.'
                      : 'Automated electronic bill of lading (e-BOL) issuance, instant duty calculation, and QR-authenticated inland transport dispatch.'}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setCurrentView('customs_workspace')}
                  className="btn-shopify-pill !bg-[#06B6D4] hover:!bg-[#0891b2] text-[#000000] font-[600] text-[13px]"
                >
                  <span>{lang === 'ar' ? 'مساحة العمل الجمركية' : 'Customs Workspace'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <span className="text-[12px] text-white/50 font-mono">PORT SUDAN SCT</span>
              </div>
            </SpotlightBentoCard>
          </div>
        </div>
      </section>

      {/* 5. Minimalist Footer */}
      <footer className="bg-[#FFFFFF] border-t border-[#EEEEEE] py-12 px-6 pb-24 text-center text-[#5C5E62] text-[14px] space-y-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-[14px] font-[400]">
          <span className="text-[#171A20] font-[500]">Sudaneel Logistics © {new Date().getFullYear()}</span>
          <button onClick={() => setCurrentView('support_center')} className="hover:text-[#171A20] hover:underline">
            {lang === 'ar' ? 'الدعم الفني' : 'Support'}
          </button>
          <button onClick={() => setCurrentView('reports')} className="hover:text-[#171A20] hover:underline">
            {lang === 'ar' ? 'التقارير المؤسسية' : 'Reports'}
          </button>
          <button onClick={() => setCurrentView('contracts_crm')} className="hover:text-[#171A20] hover:underline">
            {lang === 'ar' ? 'العقود والشروط' : 'Terms & Contracts'}
          </button>
        </div>
        <p className="text-[12px] text-[#8E8E8E]">
          {lang === 'ar' ? 'المنصة اللوجستية الوطنية الموحدة — السودان' : 'Unified National Logistics Platform — Sudan'}
        </p>
      </footer>

      {/* 6. Persistent Bottom Chat Bar (Tesla "Ask a Question" Bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#EEEEEE] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-none">
        {/* Left Side: Chat input with Send button */}
        <form onSubmit={handleChatSubmit} className="flex-1 max-w-xl flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#5C5E62] flex-shrink-0" />
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={
              lang === 'ar'
                ? 'اسأل سؤالاً... (مثال: ما هي الشاحنات الفارغة المتاحة في بورتسودان؟)'
                : 'Ask a question... (e.g. What backhauls are available in Port Sudan?)'
            }
            className="flex-1 bg-transparent text-[#171A20] placeholder-[#8E8E8E] text-[14px] font-[400] outline-none"
          />
          <button
            type="submit"
            className="text-[#3E6AE1] hover:text-[#345ac2] p-1.5 transition-colors duration-330 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Right Side: Secondary Consultation Action */}
        <div className="hidden sm:flex items-center gap-2 ps-4 border-s border-[#EEEEEE]">
          <button
            onClick={() => setCurrentView('control_tower')}
            className="text-[14px] font-[500] text-[#171A20] hover:text-[#3E6AE1] transition-colors duration-330 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#3E6AE1]" />
            <span>{lang === 'ar' ? 'احجز استشارة لوجستية' : 'Schedule Consultation'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
