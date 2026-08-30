'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Shipment, VehicleType } from '@/types';
import {
  Smartphone,
  ShieldCheck,
  Truck,
  Warehouse,
  MapPin,
  Search,
  Bell,
  ArrowRight,
  ChevronRight,
  CreditCard,
  PieChart,
  User,
  Settings,
  Receipt,
  FileText,
  Share2,
  CheckCircle2,
  Calendar,
  Layers,
  Phone,
  Lock,
  Globe,
  Sliders,
  LogOut,
  Sparkles,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Zap,
  Activity,
  ThermometerSnowflake,
  Fuel,
  Compass,
  QrCode,
  Check,
  AlertTriangle,
  Fingerprint,
  Wifi,
  WifiOff,
  BatteryCharging,
  Send,
  Eye,
  DollarSign,
  Leaf,
  Navigation,
  Clock,
  ChevronLeft,
} from 'lucide-react';

type MobileScreenTab =
  | 'login'
  | 'home'
  | 'tracking'
  | 'create_shipment'
  | 'services'
  | 'wallet'
  | 'reports'
  | 'profile';

type DeviceModel = 'iphone' | 'samsung' | 'pwa_fullscreen';

export function MobileAppShowcaseView() {
  const { lang, shipments, showToast, setCurrentView, addShipment, topUpWallet } = useApp();

  const [activeScreen, setActiveScreen] = useState<MobileScreenTab>('home');
  const [deviceModel, setDeviceModel] = useState<DeviceModel>('iphone');
  const [phoneTrackingCode, setPhoneTrackingCode] = useState('SUD123456');
  const [isDynamicIslandExpanded, setIsDynamicIslandExpanded] = useState(false);
  const [islandAlert, setIslandAlert] = useState<{ title: string; subtitle: string; icon: string }>({
    title: 'شحنة الخرطوم - بورتسودان في الطريق',
    subtitle: 'على بعد 14 كم من نقطة التسليم • وصول متوقع 4:30 م',
    icon: 'truck',
  });

  // Auth Screen State
  const [otpDigits, setOtpDigits] = useState(['5', '9', '2', '', '', '']);
  const [authRole, setAuthRole] = useState<'shipper' | 'driver' | 'ops'>('shipper');
  const [isBiometricAuthenticating, setIsBiometricAuthenticating] = useState(false);

  // Home Quick Route State
  const [homeOrigin, setHomeOrigin] = useState('الخرطوم (Khartoum)');
  const [homeDest, setHomeDest] = useState('بورتسودان (Port Sudan)');

  // Booking Wizard State inside Phone
  const [bookStep, setBookStep] = useState<1 | 2 | 3 | 4>(1);
  const [bookOrigin, setBookOrigin] = useState('الخرطوم - المنطقة الصناعية بحري');
  const [bookDest, setBookDest] = useState('ميناء بورتسودان الشمالي');
  const [bookCargoType, setBookCargoType] = useState('صادرات زراعية (سمسم وصمغ عربي)');
  const [bookWeightTons, setBookWeightTons] = useState(25);
  const [bookVehicleType, setBookVehicleType] = useState<VehicleType>('truck_heavy');
  const [bookIsReefer, setBookIsReefer] = useState(false);
  const [bookHasInsurance, setBookHasInsurance] = useState(true);

  // Wallet State inside Phone
  const [walletCurrency, setWalletCurrency] = useState<'SDG' | 'USD' | 'SAR'>('SDG');
  const [showQrModal, setShowQrModal] = useState(false);
  const [topupAmount, setTopupAmount] = useState('250000');

  // Profile Offline Mode Simulator
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Interactive Live Map Beacon Tracker
  const [beaconProgress, setBeaconProgress] = useState(68);

  useEffect(() => {
    const timer = setInterval(() => {
      setBeaconProgress((prev) => (prev >= 95 ? 15 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const calculateBookingPrice = () => {
    let base = 850000;
    if (bookVehicleType === 'reefer') base += 350000;
    if (bookVehicleType === 'container_40ft') base += 250000;
    if (bookIsReefer) base += 200000;
    if (bookHasInsurance) base += 45000;
    return base + bookWeightTons * 12000;
  };

  const handleCreateShipmentInPhone = () => {
    const newShipment: Shipment = {
      id: `shp-mob-${Date.now().toString().slice(-4)}`,
      trackingNumber: `SDN-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: 'شركة النيل للواردات والصادرات',
      customerNameAr: 'شركة النيل للواردات والصادرات',
      customerId: 'CUST-MOB-01',
      status: 'in_transit',
      cargoType: bookIsReefer ? 'perishable' : 'bulk',
      cargoDescription: bookCargoType,
      totalWeightKg: bookWeightTons * 1000,
      totalVolumeM3: bookWeightTons * 2.2,
      origin: {
        city: bookOrigin.includes('الخرطوم') ? 'الخرطوم' : 'المنطقة الحرة',
        country: 'Sudan',
        address: bookOrigin,
        lat: 15.5007,
        lng: 32.5599,
      },
      destination: {
        city: bookDest.includes('بورتسودان') ? 'بورتسودان' : 'عطبرة',
        country: 'Sudan',
        address: bookDest,
        lat: 19.6158,
        lng: 37.2164,
      },
      pickupDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      requiredVehicleType: bookVehicleType,
      carrierId: 'car-01',
      carrierName: 'أسطول سودانيل السريع',
      driverId: 'drv-01',
      driverName: 'عثمان عبد الله الطيب',
      driverPhone: '+249 91 234 5678',
      vehiclePlate: 'KRT-9082-TRK',
      price: calculateBookingPrice(),
      currency: 'SDG',
      distanceKm: 812,
      estimatedEta: 'اليوم • 5:30 مساءً',
      etaConfidence: 98,
      priority: 'express',
      isFragile: false,
      isTempControlled: bookIsReefer,
      targetTemp: bookIsReefer ? -18 : undefined,
      hasInsurance: bookHasInsurance,
      events: [
        {
          id: `ev-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          status: 'in_transit',
          titleAr: 'تم استلام الشحنة وتأكيد الحمولة',
          titleEn: 'Shipment Loaded & En Route',
          descriptionAr: 'انطلقت الشاحنة عبر ممر التحدي السريع نحو بورتسودان',
          descriptionEn: 'Truck departed via Northern Highway towards Port Sudan',
        },
      ],
    };

    addShipment(newShipment);
    setPhoneTrackingCode(newShipment.trackingNumber);
    showToast(
      lang === 'ar' ? 'تم تأكيد حجز الشحنة' : 'Shipment Booked',
      lang === 'ar' ? `رقم البوليصة: ${newShipment.trackingNumber}` : `Tracking: ${newShipment.trackingNumber}`,
      'success'
    );
    setIslandAlert({
      title: `تم إصدار البوليصة ${newShipment.trackingNumber}`,
      subtitle: 'تم تعيين الشاحنة KRT-9082-TRK فورياً',
      icon: 'sparkles',
    });
    setBookStep(1);
    setActiveScreen('tracking');
  };

  const handleBiometricLogin = () => {
    setIsBiometricAuthenticating(true);
    setTimeout(() => {
      setIsBiometricAuthenticating(false);
      setActiveScreen('home');
      showToast(
        lang === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Authenticated',
        lang === 'ar' ? 'مرحباً بك مجدداً في تطبيق سودانيل' : 'Welcome back to Sudaneel App',
        'success'
      );
    }, 900);
  };

  const handleSimulateOfflineSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setOfflineQueue([]);
      setIsOfflineMode(false);
      showToast(
        lang === 'ar' ? 'تمت مزامنة كافة العمليات' : 'Offline Queue Synced',
        lang === 'ar' ? 'تم رفع 3 سجلات معلقة لقاعدة البيانات المركزية بنجاح' : '3 offline actions synced with Control Tower',
        'success'
      );
    }, 1200);
  };

  // 8 Screen Tabs definition
  const screenTabs: { key: MobileScreenTab; titleAr: string; titleEn: string; icon: React.ElementType }[] = [
    { key: 'home', titleAr: 'الرئيسية', titleEn: 'Home Dashboard', icon: Smartphone },
    { key: 'tracking', titleAr: 'تتبع الشحنة والخريطة', titleEn: 'Live Tracking Map', icon: MapPin },
    { key: 'create_shipment', titleAr: 'إنشاء شحنة', titleEn: 'Book Shipment', icon: Truck },
    { key: 'services', titleAr: 'دليل الخدمات', titleEn: 'Services Matrix', icon: Layers },
    { key: 'wallet', titleAr: 'المحفظة والمدفوعات', titleEn: 'Wallet & Invoices', icon: CreditCard },
    { key: 'reports', titleAr: 'التقارير والإحصائيات', titleEn: 'Reports & Analytics', icon: PieChart },
    { key: 'profile', titleAr: 'الملف الشخصي', titleEn: 'User Profile', icon: User },
    { key: 'login', titleAr: 'تسجيل الدخول', titleEn: 'Login & Auth', icon: Lock },
  ];

  return (
    <div className="space-y-8 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="shopify-tag-mint">
            <Smartphone className="w-4 h-4" />
            <span>Official Mobile Experience • تطبيق سودانيل للهواتف الذكية</span>
          </div>
          <h1 className="text-[26px] font-[600] text-[#000000] tracking-tight">
            منصة لوجستية ذكية متكاملة (Sudaneel iOS & Android)
          </h1>
          <p className="text-[14px] text-[#71717a] leading-relaxed">
            حلول شحن متكاملة. أسطول حديث. تتبع ذكي. مستودعات ذكية. موثوقية وأمان من الخرطوم إلى بورتسودان وكافة الوجهات الإقليمية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Device Model Switcher */}
          <div className="flex items-center bg-[#fbfbf5] p-1 rounded-full border border-[#e4e4e7]">
            <button
              onClick={() => setDeviceModel('iphone')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-[600] transition-all ${
                deviceModel === 'iphone' ? 'bg-[#000000] text-white shadow-sm' : 'text-[#71717a] hover:text-[#000000]'
              }`}
            >
              iPhone 16 Pro
            </button>
            <button
              onClick={() => setDeviceModel('samsung')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-[600] transition-all ${
                deviceModel === 'samsung' ? 'bg-[#000000] text-white shadow-sm' : 'text-[#71717a] hover:text-[#000000]'
              }`}
            >
              Galaxy S25 Ultra
            </button>
            <button
              onClick={() => setDeviceModel('pwa_fullscreen')}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-[600] transition-all ${
                deviceModel === 'pwa_fullscreen' ? 'bg-[#000000] text-white shadow-sm' : 'text-[#71717a] hover:text-[#000000]'
              }`}
            >
              PWA Fullscreen
            </button>
          </div>

          <button
            onClick={() => setCurrentView('control_tower')}
            className="btn-shopify-outline"
          >
            <span>لوحة التحكم الرئيسية</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 shopify-card flex items-center gap-3.5 hover:border-[#a1a1aa] transition-colors">
          <div className="w-11 h-11 rounded-full bg-[#c1fbd4] flex items-center justify-center flex-shrink-0 text-[#000000]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[14px] font-[600] text-[#000000]">تتبع لحظي دقيق</div>
            <div className="text-[11px] text-[#71717a]">GPS Telemetry 4s</div>
          </div>
        </div>

        <div className="p-5 shopify-card flex items-center gap-3.5 hover:border-[#a1a1aa] transition-colors">
          <div className="w-11 h-11 rounded-full bg-[#d4f9e0] flex items-center justify-center flex-shrink-0 text-[#000000]">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[14px] font-[600] text-[#000000]">مستودعات ذكية</div>
            <div className="text-[11px] text-[#71717a]">120K m² Storage</div>
          </div>
        </div>

        <div className="p-5 shopify-card flex items-center gap-3.5 hover:border-[#a1a1aa] transition-colors">
          <div className="w-11 h-11 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center flex-shrink-0 text-[#000000]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[14px] font-[600] text-[#000000]">أسطول حديث ومتنوع</div>
            <div className="text-[11px] text-[#71717a]">Heavy Trailer & Vans</div>
          </div>
        </div>

        <div className="p-5 shopify-card flex items-center gap-3.5 hover:border-[#a1a1aa] transition-colors">
          <div className="w-11 h-11 rounded-full bg-[#c1fbd4] flex items-center justify-center flex-shrink-0 text-[#000000]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[14px] font-[600] text-[#000000]">موثوقية وأمان</div>
            <div className="text-[11px] text-[#71717a]">100% Insured Loads</div>
          </div>
        </div>
      </div>

      {/* Screen Selector Tabs Bar */}
      <div className="shopify-card p-4">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {screenTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScreen === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveScreen(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-[600] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#000000] text-[#c1fbd4] shadow-sm'
                    : 'bg-[#fbfbf5] text-[#71717a] border border-[#e4e4e7] hover:border-[#a1a1aa] hover:text-[#000000]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#c1fbd4]' : 'text-[#71717a]'}`} />
                <span>{lang === 'ar' ? tab.titleAr : tab.titleEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Phone Showcase Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Screen Information & Feature Dossier (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="shopify-card p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
              <div>
                <span className="shopify-tag-mint !text-[11px]">Screen Module Specs</span>
                <h3 className="text-[18px] font-[600] text-[#000000] mt-1">
                  {screenTabs.find((t) => t.key === activeScreen)?.titleAr}
                </h3>
              </div>
              <span className="text-[12px] font-mono text-[#71717a] uppercase">{activeScreen}.view</span>
            </div>

            {/* Screen Descriptions */}
            <div className="space-y-4 text-[13.5px] leading-relaxed text-[#71717a]">
              {activeScreen === 'home' && (
                <>
                  <p>
                    لوحة التحكم الذكية للسائقين والتجار. تتيح حجزاً فورياً بنقرة واحدة، وتتبع الشحنات الجارية مع شريط تقدم مباشر، واستعراض عروض العودة بخصم 25%.
                  </p>
                  <div className="p-4 rounded-[12px] bg-[#c1fbd4] text-[#000000] space-y-1 font-[500]">
                    <div className="font-[700] text-[14px]">ميزة خوارزمية الربط الذكي:</div>
                    <p className="text-[12.5px]">تطابق الشحنات المعلقة مع أقرب الشاحنات العائدة فارغة لتخفيض التكلفة بنسبة 28%.</p>
                  </div>
                </>
              )}

              {activeScreen === 'tracking' && (
                <>
                  <p>
                    تتبع حي وفوري للشاحنة مع خريطة مسار مدمجة، وحساسات التيليماتري الحية (درجة حرارة البراد، السرعة، ومستوى الوقود)، وتحديثات محطات التفتيش.
                  </p>
                  <div className="p-4 rounded-[12px] bg-[#d4f9e0] text-[#000000] space-y-1 font-[500]">
                    <div className="font-[700] text-[14px]">الأختام الجمركية الرقمية (E-Seals):</div>
                    <p className="text-[12.5px]">تنبيه تلقائي وفوري في حال فتح الأبواب أو انحراف مسار الشاحنة عن الطريق القومي.</p>
                  </div>
                </>
              )}

              {activeScreen === 'create_shipment' && (
                <>
                  <p>
                    معالج حجز الشحنات المباشر المكون من 4 خطوات سريعة مع تسعير فوري بالجنيه السوداني وتعيين فوري للمركبة والسائق في متجر المنصة.
                  </p>
                </>
              )}

              {activeScreen === 'services' && (
                <>
                  <p>
                    دليل شامل لكافة الخدمات اللوجستية المتخصصة: الأسطول الجاف والمبرد، المستودعات الذكية، التخليص بميناء بورتسودان، وسلسلة الإمداد الدوائي.
                  </p>
                </>
              )}

              {activeScreen === 'wallet' && (
                <>
                  <p>
                    محفظة رقمية متعددة العملات (SDG, USD, SAR) مدمجة مع شبكة المقاصة القومية EBS وتطبيق بنكك، مع فواتير ضريبية فورية وإيصالات رقمية.
                  </p>
                </>
              )}

              {activeScreen === 'reports' && (
                <>
                  <p>
                    تحليلات لوجستية مفصلة وشهادات الكربون الأخضر (ESG) التي توثق الكيلومترات الفارغة التي تم تفاديها وأطنان انبعاثات الكربون التي تم خفضها.
                  </p>
                </>
              )}

              {activeScreen === 'profile' && (
                <>
                  <p>
                    إدارة الملف المؤسسي الموثق، وتفعيل ميزات الأمان الحيوية، ومحاكاة وضع العمل بدون إنترنت (Offline Mode) مع المزامنة التلقائية.
                  </p>
                </>
              )}

              {activeScreen === 'login' && (
                <>
                  <p>
                    تسجيل دخول سريع بالبصمة الحيوية والـ FaceID مع إدخال رمز التحقق OTP والتبديل المرن بين أدوار المستخدمين المختلفة.
                  </p>
                </>
              )}
            </div>

            {/* Quick Interactive Triggers */}
            <div className="pt-4 border-t border-[#e4e4e7] space-y-2">
              <div className="text-[12px] font-[600] text-[#000000]">إجراءات تفاعلية سريعة بالمحاكي:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsDynamicIslandExpanded((prev) => !prev);
                  }}
                  className="btn-shopify-outline !py-2 text-[12px] flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
                  <span>توسيع الجزيرة التفاعلية</span>
                </button>

                <button
                  onClick={() => {
                    setIsOfflineMode((prev) => !prev);
                    showToast(
                      !isOfflineMode ? 'تم تفعيل وضع عدم الاتصال' : 'تم تفعيل وضع الاتصال المباشر',
                      !isOfflineMode ? 'يتم حفظ كافة الإجراءات في قائمة الانتظار' : 'متصل بالبرج المركزي 5G',
                      !isOfflineMode ? 'warning' : 'success'
                    );
                  }}
                  className="btn-shopify-outline !py-2 text-[12px] flex items-center justify-center gap-1.5"
                >
                  {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-600" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{isOfflineMode ? 'وضع غير متصل' : 'وضع متصل'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Phone Device Container (7 cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            className={`transition-all duration-300 ${
              deviceModel === 'pwa_fullscreen'
                ? 'w-full max-w-lg'
                : 'w-[390px] sm:w-[410px]'
            }`}
          >
            {/* Phone Hardware Outer Frame */}
            <div
              className={`relative bg-[#000000] p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] ${
                deviceModel === 'iphone'
                  ? 'rounded-[50px] border-[5px] border-[#27272a]'
                  : deviceModel === 'samsung'
                  ? 'rounded-[32px] border-[4px] border-[#3f3f46]'
                  : 'rounded-[24px] border border-[#e4e4e7] !p-0 bg-[#ffffff]'
              }`}
            >
              {/* Phone Inner Screen Glass */}
              <div
                className={`relative bg-[#ffffff] text-[#000000] overflow-hidden flex flex-col h-[740px] ${
                  deviceModel === 'iphone'
                    ? 'rounded-[40px]'
                    : deviceModel === 'samsung'
                    ? 'rounded-[24px]'
                    : 'rounded-[24px]'
                }`}
                style={{ fontFeatureSettings: '"ss03"' }}
              >
                {/* 1. Phone Top Hardware Bar & Dynamic Island */}
                {deviceModel !== 'pwa_fullscreen' && (
                  <div className="relative pt-3 px-6 pb-2 bg-[#ffffff] z-30 flex items-center justify-between border-b border-[#f4f4f5]">
                    {/* Time */}
                    <span className="font-mono text-[13px] font-[700] text-[#000000]">
                      04:20
                    </span>

                    {/* Dynamic Island (iPhone) or Punchhole (Samsung) */}
                    {deviceModel === 'iphone' ? (
                      <div
                        onClick={() => setIsDynamicIslandExpanded((prev) => !prev)}
                        className={`bg-[#000000] text-white transition-all duration-300 cursor-pointer flex items-center justify-between px-3 py-1 ${
                          isDynamicIslandExpanded
                            ? 'w-64 rounded-[20px] py-2.5 shadow-lg'
                            : 'w-28 rounded-full h-6 hover:scale-105'
                        }`}
                      >
                        {!isDynamicIslandExpanded ? (
                          <>
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-mono font-[600] text-white">SDN Live</span>
                            <Truck className="w-3 h-3 text-[#c1fbd4]" />
                          </>
                        ) : (
                          <div className="w-full text-start space-y-1 animate-in fade-in duration-200">
                            <div className="flex items-center justify-between text-[11px] font-[700] text-[#c1fbd4]">
                              <span>{islandAlert.title}</span>
                              <Sparkles className="w-3 h-3" />
                            </div>
                            <div className="text-[10px] text-[#a1a1aa] line-clamp-1">{islandAlert.subtitle}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-[#000000] mx-auto" />
                    )}

                    {/* Battery & Signal */}
                    <div className="flex items-center gap-1.5 text-[#000000]">
                      {isOfflineMode ? (
                        <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <Wifi className="w-3.5 h-3.5 text-[#000000]" />
                      )}
                      <BatteryCharging className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                )}

                {/* 2. Scrollable App Content Canvas */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-[#fbfbf5]">
                  {/* =================================================== */}
                  {/* SCREEN 1: LOGIN & AUTH */}
                  {/* =================================================== */}
                  {activeScreen === 'login' && (
                    <div className="space-y-6 py-6 text-center animate-in fade-in duration-200">
                      <div className="w-16 h-16 rounded-full bg-[#c1fbd4] mx-auto flex items-center justify-center shadow-md">
                        <Truck className="w-8 h-8 text-[#000000]" />
                      </div>

                      <div className="space-y-1">
                        <h2 className="text-[20px] font-[700] text-[#000000]">تسجيل الدخول الذكي</h2>
                        <p className="text-[12.5px] text-[#71717a]">منصة سودانيل للخدمات اللوجستية والنقل</p>
                      </div>

                      {/* Role Selector Pill Tabs */}
                      <div className="flex items-center justify-center p-1 bg-[#ffffff] rounded-full border border-[#e4e4e7]">
                        <button
                          onClick={() => setAuthRole('shipper')}
                          className={`px-3 py-1.5 rounded-full text-[11.5px] font-[600] transition-all ${
                            authRole === 'shipper' ? 'bg-[#000000] text-[#c1fbd4]' : 'text-[#71717a]'
                          }`}
                        >
                          تاجر / مورد
                        </button>
                        <button
                          onClick={() => setAuthRole('driver')}
                          className={`px-3 py-1.5 rounded-full text-[11.5px] font-[600] transition-all ${
                            authRole === 'driver' ? 'bg-[#000000] text-[#c1fbd4]' : 'text-[#71717a]'
                          }`}
                        >
                          سائق شاحنة
                        </button>
                        <button
                          onClick={() => setAuthRole('ops')}
                          className={`px-3 py-1.5 rounded-full text-[11.5px] font-[600] transition-all ${
                            authRole === 'ops' ? 'bg-[#000000] text-[#c1fbd4]' : 'text-[#71717a]'
                          }`}
                        >
                          مراقب عمليات
                        </button>
                      </div>

                      {/* Phone Input */}
                      <div className="space-y-2 text-start">
                        <label className="text-[12px] font-[500] text-[#71717a] block">رقم الهاتف المسجل</label>
                        <div className="relative">
                          <input
                            type="text"
                            defaultValue="+249 91 234 5678"
                            className="w-full bg-[#ffffff] border border-[#e4e4e7] rounded-[8px] p-2.5 text-[13px] font-mono outline-none focus:border-[#000000]"
                          />
                          <Phone className="w-4 h-4 text-[#71717a] absolute left-3 top-3" />
                        </div>
                      </div>

                      {/* OTP code */}
                      <div className="space-y-2 text-start">
                        <label className="text-[12px] font-[500] text-[#71717a] block">رمز التحقق السريع (OTP)</label>
                        <div className="flex justify-between gap-1.5" dir="ltr">
                          {otpDigits.map((d, i) => (
                            <input
                              key={i}
                              type="text"
                              value={d}
                              onChange={(e) => {
                                const copy = [...otpDigits];
                                copy[i] = e.target.value.slice(-1);
                                setOtpDigits(copy);
                              }}
                              className="w-11 h-12 text-center bg-[#ffffff] border border-[#e4e4e7] rounded-[8px] font-mono font-[700] text-[16px] text-[#000000] outline-none focus:border-[#000000] focus:ring-2 focus:ring-[#c1fbd4]"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-2">
                        <button
                          onClick={() => setActiveScreen('home')}
                          className="w-full btn-shopify-pill !py-3 text-[13.5px]"
                        >
                          تسجيل الدخول والمتابعة
                        </button>

                        <button
                          onClick={handleBiometricLogin}
                          disabled={isBiometricAuthenticating}
                          className="w-full btn-shopify-outline !py-2.5 text-[12.5px] flex items-center justify-center gap-2"
                        >
                          <Fingerprint className="w-4 h-4 text-[#000000]" />
                          <span>{isBiometricAuthenticating ? 'جارٍ فحص البصمة...' : 'تسجيل بالبصمة / FaceID'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* SCREEN 2: HOME DASHBOARD */}
                  {/* =================================================== */}
                  {activeScreen === 'home' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* Top Greeting & Search */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11.5px] text-[#71717a]">مرحباً بك،</span>
                          <h3 className="font-[700] text-[16px] text-[#000000]">شركة النيل للواردات</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveScreen('reports')}
                            className="p-2 rounded-full bg-white border border-[#e4e4e7] text-[#000000]"
                          >
                            <Bell className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Route Lookup Card */}
                      <div className="p-4 bg-white rounded-[12px] border border-[#e4e4e7] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-[600] text-[#000000]">حجز مسار سريع</span>
                          <span className="shopify-tag-mint !text-[10px]">تسعير فوري</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[12px]">
                          <div className="space-y-1">
                            <label className="text-[#71717a] text-[11px]">من (المنشأ):</label>
                            <select
                              value={homeOrigin}
                              onChange={(e) => setHomeOrigin(e.target.value)}
                              className="w-full bg-[#fbfbf5] border border-[#e4e4e7] p-2 rounded-[8px] font-[500] text-[11.5px] outline-none"
                            >
                              <option>الخرطوم (Khartoum)</option>
                              <option>عطبرة (Atbara)</option>
                              <option>القضارف (Gedaref)</option>
                              <option>كسلا (Kassala)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[#71717a] text-[11px]">إلى (المقصد):</label>
                            <select
                              value={homeDest}
                              onChange={(e) => setHomeDest(e.target.value)}
                              className="w-full bg-[#fbfbf5] border border-[#e4e4e7] p-2 rounded-[8px] font-[500] text-[11.5px] outline-none"
                            >
                              <option>بورتسودان (Port Sudan)</option>
                              <option>كوستي (Kosti)</option>
                              <option>نيالا (Nyala)</option>
                              <option>الدمازين (Damazin)</option>
                            </select>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setBookOrigin(homeOrigin);
                            setBookDest(homeDest);
                            setActiveScreen('create_shipment');
                          }}
                          className="w-full btn-shopify-pill !py-2 text-[12.5px] flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#c1fbd4]" />
                          <span>احجز الشاحنة الآن</span>
                        </button>
                      </div>

                      {/* Live Active Shipment Hero Card */}
                      <div className="p-4 bg-[#c1fbd4] rounded-[12px] border border-[#a8f5c2] shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[#000000]" />
                            <span className="font-mono font-[700] text-[13px] text-[#000000]">SDN-889120</span>
                          </div>
                          <span className="shopify-tag-mint !bg-white/80 !text-[10px]">في الطريق (En Route)</span>
                        </div>

                        <div className="text-[12.5px] text-[#000000] font-[600]">
                          الخرطوم ➔ ميناء بورتسودان الشمالي
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-[#000000]/70">
                            <span>التقدم: {beaconProgress}%</span>
                            <span>باقي 124 كم</span>
                          </div>
                          <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#000000] rounded-full transition-all duration-500"
                              style={{ width: `${beaconProgress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11.5px] text-[#000000]/80">السائق: عثمان عبد الله (KRT-9082)</span>
                          <button
                            onClick={() => {
                              setPhoneTrackingCode('SDN-889120');
                              setActiveScreen('tracking');
                            }}
                            className="text-[11.5px] font-[700] underline text-[#000000] flex items-center gap-1"
                          >
                            <span>تتبع حي</span>
                            <ArrowLeftIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* 4 Quick Actions Grid */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <button
                          onClick={() => setActiveScreen('create_shipment')}
                          className="p-3 bg-white rounded-[12px] border border-[#e4e4e7] hover:border-[#000000] transition-colors space-y-1"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#fbfbf5] mx-auto flex items-center justify-center text-[#000000]">
                            <Truck className="w-4 h-4" />
                          </div>
                          <span className="text-[10.5px] font-[600] text-[#000000] block">شحن بري</span>
                        </button>

                        <button
                          onClick={() => setActiveScreen('services')}
                          className="p-3 bg-white rounded-[12px] border border-[#e4e4e7] hover:border-[#000000] transition-colors space-y-1"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#fbfbf5] mx-auto flex items-center justify-center text-[#000000]">
                            <Warehouse className="w-4 h-4" />
                          </div>
                          <span className="text-[10.5px] font-[600] text-[#000000] block">مستودعات</span>
                        </button>

                        <button
                          onClick={() => setActiveScreen('wallet')}
                          className="p-3 bg-white rounded-[12px] border border-[#e4e4e7] hover:border-[#000000] transition-colors space-y-1"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#fbfbf5] mx-auto flex items-center justify-center text-[#000000]">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <span className="text-[10.5px] font-[600] text-[#000000] block">المحفظة</span>
                        </button>

                        <button
                          onClick={() => setActiveScreen('services')}
                          className="p-3 bg-white rounded-[12px] border border-[#e4e4e7] hover:border-[#000000] transition-colors space-y-1"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#fbfbf5] mx-auto flex items-center justify-center text-[#000000]">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <span className="text-[10.5px] font-[600] text-[#000000] block">الجمارك</span>
                        </button>
                      </div>

                      {/* Backhaul Deals Banner */}
                      <div className="p-4 rounded-[12px] bg-[#d4f9e0] border border-[#bdf2cf] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="shopify-tag-mint !bg-[#000000] !text-[#c1fbd4] !text-[10px]">
                            عروض العودة الفارغة (-25%)
                          </span>
                          <span className="text-[11px] font-mono text-[#000000]">متاح اليوم</span>
                        </div>
                        <div className="font-[600] text-[13px] text-[#000000]">
                          بورتسودان ➔ الخرطوم (سطحة 30 طن)
                        </div>
                        <p className="text-[11.5px] text-[#000000]/70">
                          احجز شاحنة راجعة ووفر 25% من تكلفة النقل المعتادة.
                        </p>
                        <button
                          onClick={() => {
                            setBookOrigin('بورتسودان');
                            setBookDest('الخرطوم');
                            setActiveScreen('create_shipment');
                          }}
                          className="w-full btn-shopify-pill !py-1.5 text-[11.5px]"
                        >
                          حجز فوري بالخصم
                        </button>
                      </div>
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* SCREEN 3: LIVE TRACKING MAP & DIGITAL PASSPORT */}
                  {/* =================================================== */}
                  {activeScreen === 'tracking' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* Search Bar for tracking */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={phoneTrackingCode}
                          onChange={(e) => setPhoneTrackingCode(e.target.value)}
                          placeholder="أدخل رقم البوليصة..."
                          className="flex-1 bg-white border border-[#e4e4e7] rounded-full px-3.5 py-1.5 text-[12.5px] font-mono outline-none focus:border-[#000000]"
                        />
                        <button
                          onClick={() => showToast('بحث الشحنة', `تم تحديث بيانات الشحنة ${phoneTrackingCode}`, 'info')}
                          className="btn-shopify-pill !py-1.5 !px-4 text-[12px]"
                        >
                          تحديث
                        </button>
                      </div>

                      {/* Interactive Vector Route Map */}
                      <div className="relative h-48 bg-[#0a0a0a] rounded-[12px] overflow-hidden border border-[#1e2c31] shadow-inner p-3 flex flex-col justify-between">
                        <div className="flex justify-between items-center z-10">
                          <span className="text-[10px] font-mono text-[#c1fbd4] bg-white/10 px-2 py-0.5 rounded-full">
                            LIVE GPS CORRIDOR
                          </span>
                          <span className="text-[10px] font-mono text-[#71717a]">4s Telemetry Lock</span>
                        </div>

                        {/* Visual Route Curve */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 180">
                          {/* Route Path */}
                          <path
                            d="M 40 140 Q 120 100 180 80 T 280 40"
                            fill="none"
                            stroke="#1e2c31"
                            strokeWidth="4"
                          />
                          <path
                            d="M 40 140 Q 120 100 180 80 T 280 40"
                            fill="none"
                            stroke="#c1fbd4"
                            strokeWidth="3"
                            strokeDasharray="6 4"
                          />

                          {/* Origin Checkpoint */}
                          <circle cx="40" cy="140" r="5" fill="#c1fbd4" />
                          <text x="40" y="160" fill="#a1a1aa" fontSize="10" textAnchor="middle">الخرطوم</text>

                          {/* Intermediate Checkpoint */}
                          <circle cx="160" cy="88" r="4" fill="#a1a1aa" />
                          <text x="160" y="106" fill="#71717a" fontSize="9" textAnchor="middle">عطبرة</text>

                          {/* Destination */}
                          <circle cx="280" cy="40" r="6" fill="#c1fbd4" />
                          <text x="280" y="25" fill="#c1fbd4" fontSize="10" fontWeight="bold" textAnchor="middle">بورتسودان</text>

                          {/* Animated Moving Truck Beacon */}
                          <circle
                            cx={40 + (240 * beaconProgress) / 100}
                            cy={140 - (100 * beaconProgress) / 100}
                            r="8"
                            fill="#c1fbd4"
                            className="animate-ping opacity-40"
                          />
                          <circle
                            cx={40 + (240 * beaconProgress) / 100}
                            cy={140 - (100 * beaconProgress) / 100}
                            r="5"
                            fill="#000000"
                            stroke="#c1fbd4"
                            strokeWidth="2"
                          />
                        </svg>

                        <div className="z-10 flex justify-between items-center text-[10.5px] text-[#a1a1aa] bg-[#000000]/80 p-1.5 rounded-[8px]">
                          <span>الشاحنة: KRT-9082-TRK</span>
                          <span className="text-[#c1fbd4] font-mono">السرعة: 76 كم/ساعة</span>
                        </div>
                      </div>

                      {/* Telemetry Sensor Badges (3 items) */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2.5 bg-white rounded-[12px] border border-[#e4e4e7]">
                          <div className="text-[10px] text-[#71717a]">حرارة المبرد</div>
                          <div className="font-mono font-[700] text-[13px] text-[#000000] flex items-center justify-center gap-1">
                            <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />
                            <span>-18.4°C</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-white rounded-[12px] border border-[#e4e4e7]">
                          <div className="text-[10px] text-[#71717a]">مستوى الوقود</div>
                          <div className="font-mono font-[700] text-[13px] text-[#000000] flex items-center justify-center gap-1">
                            <Fuel className="w-3 h-3 text-emerald-600" />
                            <span>84%</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-white rounded-[12px] border border-[#e4e4e7]">
                          <div className="text-[10px] text-[#71717a]">مستشعر الصدمات</div>
                          <div className="font-mono font-[700] text-[13px] text-[#000000] flex items-center justify-center gap-1">
                            <Activity className="w-3 h-3 text-[#000000]" />
                            <span>0.02G (سليم)</span>
                          </div>
                        </div>
                      </div>

                      {/* Milestone Timeline */}
                      <div className="p-4 bg-white rounded-[12px] border border-[#e4e4e7] space-y-3">
                        <span className="text-[12px] font-[600] text-[#000000] block">المحطات اللوجستية</span>

                        <div className="space-y-3 text-[12px]">
                          <div className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-[#c1fbd4] flex items-center justify-center text-[#000000] flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                            <div>
                              <div className="font-[600] text-[#000000]">تم التحميل وتأكيد البوليصة</div>
                              <div className="text-[10.5px] text-[#71717a]">الخرطوم - مستودعات سوبا • 09:30 ص</div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-[#c1fbd4] flex items-center justify-center text-[#000000] flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                            <div>
                              <div className="font-[600] text-[#000000]">اجتياز نقطة تفتيش شندي</div>
                              <div className="text-[10.5px] text-[#71717a]">فحص الأختام الذكية سليم • 01:15 م</div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-[#000000] text-[#c1fbd4] flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse">
                              <Truck className="w-3 h-3" />
                            </div>
                            <div>
                              <div className="font-[600] text-[#000000]">في الطريق إلى بورتسودان (عبر هيا)</div>
                              <div className="text-[10.5px] text-emerald-700 font-[500]">وصول متوقع 05:30 م</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => showToast('الاتصال بالسائق', 'جاري الاتصال بالسائق: +249 91 234 5678', 'info')}
                          className="btn-shopify-outline !py-2 text-[12px] flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#000000]" />
                          <span>اتصال بالسائق</span>
                        </button>

                        <button
                          onClick={() => showToast('مشاركة الرابط', 'تم نسخ رابط التتبع المباشر للحافظة', 'success')}
                          className="btn-shopify-pill !py-2 text-[12px] flex items-center justify-center gap-1.5"
                        >
                          <Share2 className="w-3.5 h-3.5 text-[#c1fbd4]" />
                          <span>مشاركة التتبع</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* SCREEN 4: CREATE SHIPMENT WIZARD */}
                  {/* =================================================== */}
                  {activeScreen === 'create_shipment' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* Stepper Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-[#e4e4e7]">
                        <span className="text-[12px] font-[600] text-[#000000]">
                          خطوة {bookStep} من 3
                        </span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3].map((s) => (
                            <div
                              key={s}
                              className={`w-6 h-1.5 rounded-full ${
                                s <= bookStep ? 'bg-[#000000]' : 'bg-[#e4e4e7]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Step 1: Locations */}
                      {bookStep === 1 && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[11.5px] font-[500] text-[#71717a]">عنوان وموقع الاستلام</label>
                            <input
                              type="text"
                              value={bookOrigin}
                              onChange={(e) => setBookOrigin(e.target.value)}
                              className="w-full bg-white border border-[#e4e4e7] rounded-[8px] p-2.5 text-[12.5px] outline-none focus:border-[#000000]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11.5px] font-[500] text-[#71717a]">عنوان وموقع التسليم النهائي</label>
                            <input
                              type="text"
                              value={bookDest}
                              onChange={(e) => setBookDest(e.target.value)}
                              className="w-full bg-white border border-[#e4e4e7] rounded-[8px] p-2.5 text-[12.5px] outline-none focus:border-[#000000]"
                            />
                          </div>

                          <button
                            onClick={() => setBookStep(2)}
                            className="w-full btn-shopify-pill !py-2.5 text-[13px] mt-2"
                          >
                            التالي: مواصفات الحمولة
                          </button>
                        </div>
                      )}

                      {/* Step 2: Cargo Details */}
                      {bookStep === 2 && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[11.5px] font-[500] text-[#71717a]">نوع ووصف البضاعة</label>
                            <input
                              type="text"
                              value={bookCargoType}
                              onChange={(e) => setBookCargoType(e.target.value)}
                              className="w-full bg-white border border-[#e4e4e7] rounded-[8px] p-2.5 text-[12.5px] outline-none focus:border-[#000000]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11.5px] font-[500] text-[#71717a]">الوزن الإجمالي (بالأطنان): {bookWeightTons} طن</label>
                            <input
                              type="range"
                              min={1}
                              max={60}
                              value={bookWeightTons}
                              onChange={(e) => setBookWeightTons(Number(e.target.value))}
                              className="w-full accent-black cursor-pointer"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white rounded-[12px] border border-[#e4e4e7]">
                            <span className="text-[12px] font-[500] text-[#000000]">نقل مبرد وتبريد متحكم به</span>
                            <input
                              type="checkbox"
                              checked={bookIsReefer}
                              onChange={(e) => setBookIsReefer(e.target.checked)}
                              className="w-4 h-4 accent-black rounded cursor-pointer"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 bg-white rounded-[12px] border border-[#e4e4e7]">
                            <span className="text-[12px] font-[500] text-[#000000]">تأمين شامل على البضاعة</span>
                            <input
                              type="checkbox"
                              checked={bookHasInsurance}
                              onChange={(e) => setBookHasInsurance(e.target.checked)}
                              className="w-4 h-4 accent-black rounded cursor-pointer"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button onClick={() => setBookStep(1)} className="btn-shopify-outline flex-1">
                              رجوع
                            </button>
                            <button onClick={() => setBookStep(3)} className="btn-shopify-pill flex-1">
                              التالي: نوع المركبة
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Step 3: Vehicle & Confirmation */}
                      {bookStep === 3 && (
                        <div className="space-y-3">
                          <label className="text-[11.5px] font-[500] text-[#71717a]">اختر نوع الشاحنة المناسبة</label>

                          <div className="space-y-2">
                            {[
                              { id: 'truck_heavy', name: 'شاحنة ثقيلة / سطحة (Flatbed)', cap: '30 طن' },
                              { id: 'reefer', name: 'براد مبرد ومجمد (Reefer)', cap: '25 طن' },
                              { id: 'container_40ft', name: 'تريلا نقل حاويات 40 قدم', cap: '32 طن' },
                            ].map((v) => (
                              <div
                                key={v.id}
                                onClick={() => setBookVehicleType(v.id as any)}
                                className={`p-3 rounded-[12px] border cursor-pointer flex items-center justify-between ${
                                  bookVehicleType === v.id
                                    ? 'bg-[#ffffff] border-[#000000] ring-2 ring-[#c1fbd4]'
                                    : 'bg-[#ffffff] border-[#e4e4e7]'
                                }`}
                              >
                                <div>
                                  <div className="font-[600] text-[12.5px] text-[#000000]">{v.name}</div>
                                  <div className="text-[10.5px] text-[#71717a]">حمولة حتى {v.cap}</div>
                                </div>
                                <Truck className="w-4 h-4 text-[#000000]" />
                              </div>
                            ))}
                          </div>

                          {/* Calculated Price Box */}
                          <div className="p-3.5 bg-[#c1fbd4] rounded-[12px] border border-[#a8f5c2] flex items-center justify-between">
                            <div>
                              <span className="text-[11px] text-[#000000]/70 font-[500] block">التكلفة التقديرية</span>
                              <span className="font-mono font-[800] text-[18px] text-[#000000]">
                                {calculateBookingPrice().toLocaleString()} SDG
                              </span>
                            </div>
                            <span className="shopify-tag-mint !bg-white/80 !text-[10px]">شامل الضريبة</span>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button onClick={() => setBookStep(2)} className="btn-shopify-outline flex-1">
                              رجوع
                            </button>
                            <button onClick={handleCreateShipmentInPhone} className="btn-shopify-pill flex-1">
                              تأكيد وحجز فوري
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* SCREEN 5: SERVICES MATRIX */}
                  {/* =================================================== */}
                  {activeScreen === 'services' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-1">
                        <h3 className="font-[700] text-[15px] text-[#000000]">دليل الخدمات اللوجستية</h3>
                        <span className="shopify-tag-mint !text-[10px]">5 خدمات متخصصة</span>
                      </div>

                      {[
                        {
                          icon: Truck,
                          title: 'النقل البري وشاحنات الأسطول',
                          desc: 'نقل ثقيل وسطحات وبرادات تغطي كافة الولايات السودانية.',
                          tag: '24/7 Live GPS',
                        },
                        {
                          icon: Warehouse,
                          title: 'المستودعات والتخزين الذكي (WMS)',
                          desc: 'مساحات تخزين جافة ومبردة ومستودعات إيداع جمركي.',
                          tag: '120,000 m²',
                        },
                        {
                          icon: ShieldCheck,
                          title: 'التخليص الجمركي بميناء بورتسودان',
                          desc: 'تتبع الحاويات، تفادي غرامات الأرضيات، وفحص الأشعة.',
                          tag: 'Port Sudan Customs',
                        },
                        {
                          icon: Globe,
                          title: 'قوافل الشحن العابر للحدود',
                          desc: 'معابر مصر (أرقين/أشكيت)، إثيوبيا (القلابات)، وتشاد.',
                          tag: 'TIR Protocol',
                        },
                      ].map((srv, idx) => {
                        const Icon = srv.icon;
                        return (
                          <div
                            key={idx}
                            className="p-4 bg-white rounded-[12px] border border-[#e4e4e7] hover:border-[#a1a1aa] transition-colors space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center text-[#000000]">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="font-[600] text-[13px] text-[#000000]">{srv.title}</span>
                              </div>
                              <span className="shopify-tag-pistachio !text-[10px]">{srv.tag}</span>
                            </div>
                            <p className="text-[11.5px] text-[#71717a]">{srv.desc}</p>
                            <button
                              onClick={() => {
                                showToast(srv.title, 'تم فتح طلب عرض السعر المباشر للخدمة', 'info');
                                setActiveScreen('create_shipment');
                              }}
                              className="w-full btn-shopify-outline !py-1.5 text-[11.5px]"
                            >
                              طلب تسعير الخدمة
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* SCREEN 6: WALLET & EBS BANKAK */}
                  {/* =================================================== */}
                  {activeScreen === 'wallet' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* Balance Hero Card */}
                      <div className="p-5 rounded-[12px] bg-[#000000] text-white shadow-md space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11.5px] text-[#a1a1aa]">رصيد المحفظة الرقمية</span>
                          <span className="shopify-tag-mint !bg-[#c1fbd4] !text-[#000000] !text-[10px]">
                            EBS Verified
                          </span>
                        </div>

                        <div>
                          <div className="font-mono font-[800] text-[24px] text-[#c1fbd4]">
                            {walletCurrency === 'SDG' ? '4,850,000 SDG' : walletCurrency === 'USD' ? '$2,425 USD' : '9,100 SAR'}
                          </div>
                          <div className="text-[11px] text-[#a1a1aa] mt-0.5">جاهز للتسوية والسداد الفوري</div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              topUpWallet(250000, 'bankak', 'FT-MOB-9901');
                              showToast('شحن المحفظة', 'تم شحن 250,000 SDG عبر بنكك بنجاح', 'success');
                            }}
                            className="flex-1 btn-shopify-pill !py-2 text-[12px] !bg-[#c1fbd4] !text-[#000000]"
                          >
                            + شحن الرصيد
                          </button>
                          <button
                            onClick={() => setShowQrModal(true)}
                            className="btn-shopify-outline !py-2 !px-3 text-[12px] !bg-white/10 !text-white !border-white/20"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Transactions List */}
                      <div className="p-4 bg-white rounded-[12px] border border-[#e4e4e7] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-[600] text-[#000000]">آخر المعاملات والقيود</span>
                          <span className="text-[11px] text-[#71717a]">اليوم</span>
                        </div>

                        <div className="space-y-2.5 text-[12px]">
                          <div className="flex items-center justify-between pb-2 border-b border-[#f4f4f5]">
                            <div>
                              <div className="font-[600] text-[#000000]">سداد بوليصة SDN-889120</div>
                              <div className="text-[10px] text-[#71717a]">تحويل فوري عبر بنكك</div>
                            </div>
                            <span className="font-mono font-[700] text-emerald-600">-850,000 SDG</span>
                          </div>

                          <div className="flex items-center justify-between pb-2 border-b border-[#f4f4f5]">
                            <div>
                              <div className="font-[600] text-[#000000]">شحن محفظة EBS</div>
                              <div className="text-[10px] text-[#71717a]">إشعار بنك الخرطوم FT8812</div>
                            </div>
                            <span className="font-mono font-[700] text-emerald-600">+1,500,000 SDG</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* SCREEN 7: REPORTS & ESG */}
                  {/* =================================================== */}
                  {activeScreen === 'reports' && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-[700] text-[15px] text-[#000000]">تقارير الأداء والاستدامة</h3>
                        <span className="shopify-tag-mint !text-[10px]">Monthly KPI</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3.5 bg-white rounded-[12px] border border-[#e4e4e7] text-center">
                          <span className="text-[11px] text-[#71717a]">إجمالي الأطنان</span>
                          <div className="font-mono font-[800] text-[18px] text-[#000000] mt-1">1,420 طن</div>
                        </div>

                        <div className="p-3.5 bg-white rounded-[12px] border border-[#e4e4e7] text-center">
                          <span className="text-[11px] text-[#71717a]">نسبة الالتزام بالوقت</span>
                          <div className="font-mono font-[800] text-[18px] text-emerald-600 mt-1">99.4%</div>
                        </div>
                      </div>

                      {/* ESG Green Card */}
                      <div className="p-4 bg-[#c1fbd4] rounded-[12px] border border-[#a8f5c2] space-y-2">
                        <div className="flex items-center gap-2 font-[700] text-[13px] text-[#000000]">
                          <Leaf className="w-4 h-4 text-[#000000]" />
                          <span>شهادة خفض الانبعاثات الكربونية (ESG)</span>
                        </div>
                        <p className="text-[11.5px] text-[#000000]/80">
                          بفضل مطابقة العودة الفارغة، تم تفادي 8,400 كم فارغ وتوفير 14.2 طن من انبعاثات CO₂ هذا الشهر.
                        </p>
                      </div>

                      <button
                        onClick={() => showToast('تصدير التقرير', 'تم تصدير تقرير الشاحن الشهري كملف PDF معتمد', 'success')}
                        className="w-full btn-shopify-pill !py-2.5 text-[12.5px]"
                      >
                        تحميل تقرير العمليات المعتمد (PDF)
                      </button>
                    </div>
                  )}

                  {/* =================================================== */}
                  {/* SCREEN 8: PROFILE & OFFLINE SETTINGS */}
                  {/* =================================================== */}
                  {activeScreen === 'profile' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      {/* User Profile Card */}
                      <div className="p-4 bg-white rounded-[12px] border border-[#e4e4e7] flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#000000] text-[#c1fbd4] flex items-center justify-center font-[700] text-[16px]">
                          NL
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-[700] text-[14px] text-[#000000]">شركة النيل للواردات</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-[11px] text-[#71717a]">Level 4 Corporate Shipper</span>
                        </div>
                      </div>

                      {/* Offline Mode Simulator Card */}
                      <div className="p-4 bg-white rounded-[12px] border border-[#e4e4e7] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isOfflineMode ? <WifiOff className="w-4 h-4 text-amber-600" /> : <Wifi className="w-4 h-4 text-emerald-600" />}
                            <span className="font-[600] text-[13px] text-[#000000]">وضع العمل بدون إنترنت</span>
                          </div>
                          <span className={isOfflineMode ? 'shopify-tag-shade !text-[10px]' : 'shopify-tag-mint !text-[10px]'}>
                            {isOfflineMode ? 'مفعل (Queue Active)' : 'متصل 5G'}
                          </span>
                        </div>

                        <p className="text-[11.5px] text-[#71717a]">
                          يتيح حفظ الشحنات والتوقيعات في ذاكرة الهاتف عند انقطاع الشبكة بالطرق القومية.
                        </p>

                        <button
                          onClick={handleSimulateOfflineSync}
                          disabled={isSyncing}
                          className="w-full btn-shopify-outline !py-2 text-[12px] flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'جارٍ المزامنة مع البرج...' : 'مزامنة السجلات المعلقة الآن'}</span>
                        </button>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          setActiveScreen('login');
                          showToast('تسجيل الخروج', 'تم تسجيل الخروج من التطبيق', 'info');
                        }}
                        className="w-full btn-shopify-outline !py-2 text-[12px] text-red-600 !border-red-200"
                      >
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Bottom Mobile App Navigation Bar (5 Icons) */}
                {activeScreen !== 'login' && (
                  <div className="bg-[#ffffff] border-t border-[#e4e4e7] px-3 py-2 flex items-center justify-around z-20">
                    {[
                      { key: 'home', label: 'الرئيسية', icon: Smartphone },
                      { key: 'tracking', label: 'التتبع', icon: MapPin },
                      { key: 'create_shipment', label: 'حجز', icon: Plus, isPrimary: true },
                      { key: 'wallet', label: 'المحفظة', icon: CreditCard },
                      { key: 'profile', label: 'حسابي', icon: User },
                    ].map((btn) => {
                      const Icon = btn.icon;
                      const isTabActive = activeScreen === btn.key;

                      if (btn.isPrimary) {
                        return (
                          <button
                            key={btn.key}
                            onClick={() => setActiveScreen(btn.key as any)}
                            className="w-10 h-10 rounded-full bg-[#000000] text-[#c1fbd4] flex items-center justify-center shadow-md hover:scale-105 transition-all -mt-3"
                          >
                            <Icon className="w-5 h-5" />
                          </button>
                        );
                      }

                      return (
                        <button
                          key={btn.key}
                          onClick={() => setActiveScreen(btn.key as any)}
                          className={`flex flex-col items-center gap-0.5 text-[10px] font-[600] transition-colors ${
                            isTabActive ? 'text-[#000000]' : 'text-[#a1a1aa] hover:text-[#000000]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{btn.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
