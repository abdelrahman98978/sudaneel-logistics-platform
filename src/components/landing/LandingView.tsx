'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
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
      id: 'fleet',
      titleAr: 'أسطول النقل الثقيل واللوجستيات',
      titleEn: 'Sovereign Logistics Fleet',
      subtitleAr: '0% تأخير مع الربط الرقمي اللحظي لكافة الممرات الوطنية',
      subtitleEn: '0% Delay with Real-time Digital Telemetry across National Corridors',
      bgImage: '/hero-bg.jpg',
      primaryBtnAr: 'اطلب شحنة الآن',
      primaryBtnEn: 'Order Freight Now',
      primaryAction: () => setCurrentView('create_shipment'),
      secondaryBtnAr: 'استكشف الأسطول',
      secondaryBtnEn: 'View Fleet Inventory',
      secondaryAction: () => setCurrentView('fleet'),
    },
    {
      id: 'port',
      titleAr: 'بوابة بورتسودان وسلاسل الإمداد العالمية',
      titleEn: 'Port Sudan Global Hub & Maritime Gateway',
      subtitleAr: 'مناولة متكاملة للحاويات وتخليص جمركي إلكتروني فوري',
      subtitleEn: 'Integrated Container Terminal Logistics & Digital Customs Clearance',
      bgImage: '/news-port.jpg',
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
      bgImage: '/hero-bg.jpg',
      primaryBtnAr: 'حجز مساحة تخزين',
      primaryBtnEn: 'Reserve Storage',
      primaryAction: () => setCurrentView('warehousing'),
      secondaryBtnAr: 'شبكة المراكز اللوجستية',
      secondaryBtnEn: 'Explore Hubs',
      secondaryAction: () => setCurrentView('locations'),
    },
    {
      id: 'backhaul',
      titleAr: 'بورصة الشاحنات والرحلات العائدة',
      titleEn: 'Dynamic Backhaul Freight Exchange',
      subtitleAr: 'وفورات نقل تصل إلى 30% والقضاء التام على مسافات الشاحنات الفارغة',
      subtitleEn: 'Up to 30% Freight Savings with Zero Deadhead Empty Miles',
      bgImage: '/news-truck.jpg',
      primaryBtnAr: 'استعراض الصفقات الفورية',
      primaryBtnEn: 'Browse Backhaul Deals',
      primaryAction: () => setCurrentView('marketplace'),
      secondaryBtnAr: 'تسجيل شاحنة فارغة',
      secondaryBtnEn: 'Register Empty Truck',
      secondaryAction: () => setCurrentView('carrier_portal'),
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
        { name: 'Mercedes Actros 3340', type: 'شاحنة نقل ثقيل 40 طن', img: '/news-truck.jpg', view: 'fleet' },
        { name: 'Volvo FH16 Multi-Axle', type: 'مقطورة مسطحة للحاويات', img: '/news-truck.jpg', view: 'fleet' },
        { name: 'Carrier Transicold Reefer', type: 'شاحنة مبردة لحفظ الأدوية والأغذية', img: '/news-truck.jpg', view: 'fleet' },
      ],
      sidebarLinks: [
        { label: 'مواصفات ومعايير الأسطول', view: 'fleet' },
        { label: 'بوابة تسجيل الناقلين', view: 'carrier_portal' },
        { label: 'تطبيق السائقين الرقمي', view: 'driver_app' },
        { label: 'معايير السلامة والفحص الفني', view: 'incidents' },
      ],
    },
    ports: {
      columns: [
        { name: 'محطة الحاويات الجنوبية', type: 'بورتسودان — طاقة 500K TEU', img: '/news-port.jpg', view: 'port_sudan' },
        { name: 'محطة الصب الجاف الساحلية', type: 'تفريغ وتعبئة الحبوب والأسمنت', img: '/news-port.jpg', view: 'port_sudan' },
        { name: 'مستودعات الإيداع الجمركي (Bonded)', type: 'تخزين معفى قبل التخليص', img: '/news-port.jpg', view: 'port_sudan' },
      ],
      sidebarLinks: [
        { label: 'حاسبة الرسوم والتخليص الجمركي', view: 'port_sudan' },
        { label: 'إجراءات عبور الشاحنات الحدودية', view: 'cross_border' },
        { label: 'سجلات بوالص الشحن الإلكترونية', view: 'shipments' },
      ],
    },
    warehouses: {
      columns: [
        { name: 'مركز سوبا اللوجستي المركزي', type: 'الخرطوم — 45,000 متر مربع', img: '/hero-bg.jpg', view: 'warehousing' },
        { name: 'مستودع عطبرة للتوزيع الشمالي', type: 'نهر النيل — محطة تفريغ وتوزيع', img: '/hero-bg.jpg', view: 'warehousing' },
        { name: 'مركز القضارف للصادرات الزراعية', type: 'مستودع محاصيل ومبردات', img: '/hero-bg.jpg', view: 'warehousing' },
      ],
      sidebarLinks: [
        { label: 'إدارة المخزون والمساحات الفورية', view: 'warehousing' },
        { label: 'سلاسل التبريد والتخزين الدوائي', view: 'warehousing' },
        { label: 'دليل المستودعات والمحطات', view: 'locations' },
      ],
    },
    marketplace: {
      columns: [
        { name: 'رحلات بورتسودان ➔ الخرطوم', type: 'شاحنات عائدة بخصم 28%', img: '/news-truck.jpg', view: 'marketplace' },
        { name: 'رحلات عطبرة ➔ الدمازين', type: 'شاحنات صب ومواد بناء', img: '/news-truck.jpg', view: 'marketplace' },
        { name: 'رحلات كوستي ➔ كسلا', type: 'نقل محاصيل وسلع استهلاكية', img: '/news-truck.jpg', view: 'marketplace' },
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
        <div className="max-w-[1383px] mx-auto px-6 h-[56px] flex items-center justify-between">
          {/* Brand Wordmark (Spaced uppercase precision) */}
          <div
            onClick={() => setActiveHeroIndex(0)}
            className="cursor-pointer flex items-center gap-2"
          >
            <span
              className={`text-[15px] font-[500] tracking-[0.25em] uppercase ${
                isScrolled ? 'text-[#171A20]' : 'text-white'
              }`}
            >
              {lang === 'ar' ? 'سـودانـيـل' : 'S U D A N E E L'}
            </span>
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
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={`text-[14px] font-[500] px-3 py-1 rounded-[4px] transition-colors duration-330 cursor-pointer flex items-center gap-1.5 ${
                isScrolled
                  ? 'text-[#171A20] hover:bg-[#F4F4F4]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'EN' : 'العربية'}</span>
            </button>

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
                <div className="absolute inset-0 bg-black/35"></div>
              </div>

              {/* Top Spacing for Navigation */}
              <div className="pt-24"></div>

              {/* Center Hero Information (Tesla Typography: 40px/500 Title + 22px/400 Promo Subtitle) */}
              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-3">
                <h1 className="text-[32px] sm:text-[40px] font-[500] text-white leading-[48px] tracking-normal">
                  {lang === 'ar' ? slide.titleAr : slide.titleEn}
                </h1>
                <p className="text-[18px] sm:text-[22px] font-[400] text-[#3E6AE1] bg-black/30 backdrop-blur-sm inline-block px-4 py-1 rounded-[4px]">
                  {lang === 'ar' ? slide.subtitleAr : slide.subtitleEn}
                </p>
              </div>

              {/* Bottom Actions Container (Side-by-side Primary & Secondary CTAs) */}
              <div className="relative z-10 max-w-xl mx-auto px-6 pb-20 sm:pb-24 w-full space-y-6 text-center">
                {/* Side-by-side Button Pair */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Primary CTA (Electric Blue #3E6AE1, 4px radius, 40px height, 200px width) */}
                  <button
                    onClick={slide.primaryAction}
                    className="btn-tesla-primary w-full sm:w-auto"
                  >
                    {lang === 'ar' ? slide.primaryBtnAr : slide.primaryBtnEn}
                  </button>

                  {/* Secondary CTA (Pure White #FFFFFF, Graphite text, 4px radius, 40px height, 200px width) */}
                  <button
                    onClick={slide.secondaryAction}
                    className="btn-tesla-secondary w-full sm:w-auto"
                  >
                    {lang === 'ar' ? slide.secondaryBtnAr : slide.secondaryBtnEn}
                  </button>
                </div>

                {/* Minimalist Shipment Search & Track Bar */}
                <form
                  onSubmit={handleTrackSubmit}
                  className="max-w-md mx-auto flex items-center bg-[#FFFFFF] rounded-[4px] border border-[#D0D1D2] p-1 text-[14px]"
                >
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder={lang === 'ar' ? 'أدخل رقم الشحنة أو بوليصة الشحن...' : 'Enter tracking # or B/L...'}
                    className="flex-1 bg-transparent px-3 py-1.5 text-[#171A20] placeholder-[#8E8E8E] outline-none text-[14px] font-[400]"
                  />
                  <button
                    type="submit"
                    className="bg-[#3E6AE1] text-white px-5 py-1.5 rounded-[4px] font-[500] text-[14px] hover:bg-[#345ac2] transition-colors duration-330 cursor-pointer"
                  >
                    {lang === 'ar' ? 'تتبع' : 'Track'}
                  </button>
                </form>
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

        {/* 2-Up Horizontal Landscape Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: النقل البري للممرات الحيوية */}
          <div
            onClick={() => setCurrentView('marketplace')}
            className="relative h-[340px] sm:h-[400px] rounded-[12px] overflow-hidden cursor-pointer group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: "url('/news-truck.jpg')" }}
            >
              <div className="absolute inset-0 bg-black/25"></div>
            </div>
            {/* Top-Right Label (16px / 500 / White) */}
            <div className="absolute top-6 start-6 z-10">
              <span className="text-[16px] font-[500] text-white">
                {lang === 'ar' ? 'ممرات النقل البري الوطنية' : 'National Highway Corridors'}
              </span>
            </div>
            {/* Bottom Action */}
            <div className="absolute bottom-6 start-6 z-10">
              <button className="text-[14px] font-[500] text-white underline underline-offset-4 flex items-center gap-1">
                <span>{lang === 'ar' ? 'استكشف الممرات والأسطول' : 'Explore Corridors'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: الموانئ والتجارة الدولية */}
          <div
            onClick={() => setCurrentView('port_sudan')}
            className="relative h-[340px] sm:h-[400px] rounded-[12px] overflow-hidden cursor-pointer group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: "url('/news-port.jpg')" }}
            >
              <div className="absolute inset-0 bg-black/25"></div>
            </div>
            {/* Top-Right Label (16px / 500 / White) */}
            <div className="absolute top-6 start-6 z-10">
              <span className="text-[16px] font-[500] text-white">
                {lang === 'ar' ? 'التجارة الدولية وموانئ البحر الأحمر' : 'Maritime Ports & Red Sea Gateway'}
              </span>
            </div>
            {/* Bottom Action */}
            <div className="absolute bottom-6 start-6 z-10">
              <button className="text-[14px] font-[500] text-white underline underline-offset-4 flex items-center gap-1">
                <span>{lang === 'ar' ? 'إجراءات التخليص والمناولة' : 'Customs & Handling'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Fleet & Operational Specifications (3-Column Clean Tesla Grid) */}
      <section className="bg-[#F4F4F4] py-20 px-6">
        <div className="max-w-[1383px] mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-[32px] sm:text-[40px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'مواصفات ومعايير الأداء اللوجستي' : 'Logistics Standards & Capabilities'}
            </h2>
            <p className="text-[17px] font-[400] text-[#5C5E62]">
              {lang === 'ar' ? 'أداء موثوق ومقاييس تشغيلية مبنية على أعلى معايير الجودة العالمية' : 'Engineered for extreme reliability, speed, and sovereign control'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Spec 1 */}
            <div className="bg-white p-8 rounded-[4px] space-y-4 text-center">
              <div className="text-[40px] font-[500] text-[#171A20] font-mono leading-none">
                +1,200
              </div>
              <div className="text-[17px] font-[500] text-[#171A20]">
                {lang === 'ar' ? 'شحنة شهرية منجزة' : 'Monthly Dispatched Shipments'}
              </div>
              <p className="text-[14px] font-[400] text-[#393C41] leading-relaxed">
                {lang === 'ar'
                  ? 'إدارة متكاملة للشحنات عبر نظام تتبع إلكتروني لحظي يربط 18 ولاية.'
                  : 'End-to-end digital load coordination connecting 18 states with 97.4% on-time delivery.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('shipments')}
                  className="text-[14px] font-[400] text-[#5C5E62] hover:text-[#171A20] hover:underline"
                >
                  {lang === 'ar' ? 'عرض تفاصيل الشحنات' : 'Learn More'}
                </button>
              </div>
            </div>

            {/* Spec 2 */}
            <div className="bg-white p-8 rounded-[4px] space-y-4 text-center">
              <div className="text-[40px] font-[500] text-[#171A20] font-mono leading-none">
                30%
              </div>
              <div className="text-[17px] font-[500] text-[#171A20]">
                {lang === 'ar' ? 'وفورات في تكاليف الشحن' : 'Average Freight Cost Reduction'}
              </div>
              <p className="text-[14px] font-[400] text-[#393C41] leading-relaxed">
                {lang === 'ar'
                  ? 'استغلال الطاقة الاستيعابية للشاحنات العائدة بأسعار تنافسية عبر بورصة الشحن.'
                  : 'Optimized backhaul freight routing matching empty trucks with export loads in seconds.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('marketplace')}
                  className="text-[14px] font-[400] text-[#5C5E62] hover:text-[#171A20] hover:underline"
                >
                  {lang === 'ar' ? 'استعراض بورصة الشحن' : 'Explore Backhauls'}
                </button>
              </div>
            </div>

            {/* Spec 3 */}
            <div className="bg-white p-8 rounded-[4px] space-y-4 text-center">
              <div className="text-[40px] font-[500] text-[#171A20] font-mono leading-none">
                120K MT
              </div>
              <div className="text-[17px] font-[500] text-[#171A20]">
                {lang === 'ar' ? 'طاقة تخزينية استراتيجية' : 'Cold & Dry Warehousing Capacity'}
              </div>
              <p className="text-[14px] font-[400] text-[#393C41] leading-relaxed">
                {lang === 'ar'
                  ? 'مستودعات مجهزة بالكامل وموزعة في الموانئ والمراكز الاقتصادية الرئيسية.'
                  : 'Strategically located temperature-monitored hubs along all major trade corridors.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setCurrentView('warehousing')}
                  className="text-[14px] font-[400] text-[#5C5E62] hover:text-[#171A20] hover:underline"
                >
                  {lang === 'ar' ? 'حجز مساحة تخزين' : 'Reserve Capacity'}
                </button>
              </div>
            </div>
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
