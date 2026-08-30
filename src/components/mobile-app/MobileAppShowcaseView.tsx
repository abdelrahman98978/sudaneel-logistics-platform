'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
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

export function MobileAppShowcaseView() {
  const { lang, shipments, showToast, setCurrentView } = useApp();
  const [activeScreen, setActiveScreen] = useState<MobileScreenTab>('home');
  const [phoneTrackingCode, setPhoneTrackingCode] = useState('SUD123456');

  // 8 Screen Definitions matching the Codex design & Shopify rules
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
      {/* Top Banner (Shopify Design System: 12px rounded, pill CTA, aloe badge) */}
      <div className="p-8 shopify-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="shopify-tag-mint">
            <Smartphone className="w-4 h-4" />
            <span>Official Mobile Experience • تطبيق سودانيل للهواتف الذكية</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            منصة لوجستية ذكية متكاملة (Sudaneel iOS & Android)
          </h1>
          <p className="text-[14px] text-[#52525b] leading-relaxed">
            حلول شحن متكاملة. أسطول حديث. تتبع ذكي. مستودعات ذكية. موثوقية وأمان من الخرطوم إلى بورتسودان وكافة الوجهات الإقليمية.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => showToast(
              lang === 'ar' ? 'تحميل تطبيق سودانيل' : 'Download Sudaneel App',
              lang === 'ar' ? 'جاري تجهيز حزمة التطبيق PWA / APK للتثبيت المباشر' : 'PWA / APK package download initiated',
              'success'
            )}
            className="btn-shopify-pill"
          >
            <Smartphone className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تثبيت تطبيق الويب PWA' : 'Install PWA App'}</span>
          </button>

          <button
            onClick={() => setCurrentView('control_tower')}
            className="btn-shopify-outline"
          >
            <span>لوحة التحكم الرئيسية</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars Badges (Shopify 12px rounded cards + pill tags) */}
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

      {/* Master 8-Screens Overview Banner (Shopify Style: 20px rounded frame) */}
      <div className="shopify-card p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-4">
          <div>
            <h2 className="text-[18px] font-[600] text-[#000000]">
              شاشات وتجربة مستخدم تطبيق سودانيل لوجيستك (Mobile UI Suite)
            </h2>
            <p className="text-[13px] text-[#71717a]">
              تصميم كامل لـ 8 شاشات رئيسية تغطي دورة حياة الشحنة، التتبع اللحظي، المدفوعات والتقارير
            </p>
          </div>
          <span className="shopify-tag-mint">
            8 Native Screens
          </span>
        </div>

        <div className="rounded-[16px] overflow-hidden bg-[#fbfbf5] p-4 flex items-center justify-center border border-[#e4e4e7]">
          <img
            src="/images/mobile-app-showcase.png"
            alt="Sudaneel Mobile App 8 Screens Showcase"
            className="w-full h-auto max-h-[500px] object-contain rounded-[12px]"
          />
        </div>
      </div>

      {/* Interactive Mobile Device Simulator */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[19px] font-[600] text-[#000000]">
              المحاكي التفاعلي المباشر (Interactive Device Simulator)
            </h2>
            <p className="text-[13px] text-[#71717a]">
              اختر أي شاشة من الشاشات الـ 8 لتجربتها مباشرة وبشكل تفاعلي داخل الجهاز
            </p>
          </div>
        </div>

        {/* Screen Picker Tabs (Shopify Pill Tabs) */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {screenTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScreen === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveScreen(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#000000] text-white font-[500] shadow-sm'
                    : 'bg-white text-[#71717a] hover:text-[#000000] hover:bg-[#fbfbf5] border border-[#e4e4e7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? tab.titleAr : tab.titleEn}</span>
              </button>
            );
          })}
        </div>

        {/* Simulator Phone Chassis (Pure Matte Black Night Canvas) */}
        <div className="flex justify-center py-8 bg-[#fbfbf5] rounded-[20px] border border-[#e4e4e7]">
          <div className="w-[365px] h-[730px] bg-[#000000] p-3 rounded-[46px] shadow-2xl border-[4px] border-[#1e2c31] relative flex flex-col overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1e2c31]"></div>
              <div className="w-2 h-2 rounded-full bg-[#c1fbd4]/80"></div>
            </div>

            {/* Inner Phone Screen Content */}
            <div className="w-full h-full bg-[#ffffff] rounded-[38px] overflow-hidden flex flex-col justify-between pt-8 font-sans text-[#000000] select-none text-[13px]">
              
              {/* ============================================================ */}
              {/* SCREEN 1: LOGIN (Shopify Pill CTA) */}
              {/* ============================================================ */}
              {activeScreen === 'login' && (
                <div className="p-5 flex-1 flex flex-col justify-between text-center">
                  <div className="pt-6 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-white p-1 rounded-[12px] border border-[#e4e4e7] flex items-center justify-center shadow-sm">
                      <img src="/images/brand-logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-[600] text-[17px] text-[#000000]">سودانيل لوجيستك</h3>
                      <p className="text-[11px] text-[#71717a]">SUDANIL LOGISTIC — نقل بثقة .. نوصل باحتراف</p>
                    </div>

                    <div className="space-y-3 pt-3 text-start">
                      <div>
                        <label className="text-[11px] text-[#71717a] block mb-1">البريد الإلكتروني أو رقم الجوال</label>
                        <input
                          type="text"
                          defaultValue="mohammed@sudaneel.sd"
                          className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2 text-[12px] outline-none focus:border-[#000000]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#71717a] block mb-1">كلمة المرور</label>
                        <input
                          type="password"
                          defaultValue="••••••••••••"
                          className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2 text-[12px] outline-none focus:border-[#000000]"
                        />
                      </div>
                      <div className="text-end">
                        <span className="text-[11px] text-[#000000] hover:underline cursor-pointer">نسيت كلمة المرور؟</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => setActiveScreen('home')}
                        className="w-full bg-[#000000] text-white py-2.5 rounded-full font-[500] text-[13px] hover:bg-[#3f3f46] transition-colors"
                      >
                        تسجيل الدخول
                      </button>
                      <button
                        onClick={() => showToast('إنشاء حساب', 'تم فتح نموذج تسجيل العميل الجديد', 'info')}
                        className="w-full bg-white border border-[#000000] text-[#000000] py-2 rounded-full font-[500] text-[12px] hover:bg-[#fbfbf5]"
                      >
                        إنشاء حساب جديد
                      </button>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#71717a] flex items-center justify-between pt-4 border-t border-[#e4e4e7]">
                    <span>v 1.0.0</span>
                    <span className="shopify-tag-shade !text-[10px]">العربية / EN</span>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SCREEN 2: HOME DASHBOARD */}
              {/* ============================================================ */}
              {activeScreen === 'home' && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-3.5">
                  {/* User greeting */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-[600] text-[15px] text-[#000000]">مرحباً محمد 👋</div>
                      <div className="text-[11px] text-[#71717a]">إدارة شحناتك بكل سهولة</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center text-[#000000]">
                      <Bell className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 3 Metric Pills (Shopify Style: Featured card in Aloe-10) */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-[10px] bg-[#ffffff] border border-[#e4e4e7]">
                      <div className="text-[16px] font-[600] text-[#000000] font-mono">12</div>
                      <div className="text-[10px] text-[#71717a]">شحنة نشطة</div>
                    </div>
                    <div className="p-2.5 rounded-[10px] bg-[#c1fbd4] border border-[#a8f5c2]">
                      <div className="text-[16px] font-[700] text-[#000000] font-mono">5</div>
                      <div className="text-[10px] text-[#000000] font-[500]">قيد التوصيل</div>
                    </div>
                    <div className="p-2.5 rounded-[10px] bg-[#ffffff] border border-[#e4e4e7]">
                      <div className="text-[16px] font-[600] text-[#000000] font-mono">3</div>
                      <div className="text-[10px] text-[#71717a]">شاحنة جاهزة</div>
                    </div>
                  </div>

                  {/* Quick Service Action Buttons (4 Pill Icons) */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-[500] text-[#71717a]">خدمات سريعة</div>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <button onClick={() => setActiveScreen('tracking')} className="p-2.5 rounded-[10px] bg-[#fbfbf5] border border-[#e4e4e7] hover:bg-white flex flex-col items-center gap-1 transition-colors">
                        <MapPin className="w-4 h-4 text-[#000000]" />
                        <span className="text-[10px] font-[500]">تتبع</span>
                      </button>
                      <button onClick={() => setActiveScreen('services')} className="p-2.5 rounded-[10px] bg-[#fbfbf5] border border-[#e4e4e7] hover:bg-white flex flex-col items-center gap-1 transition-colors">
                        <Warehouse className="w-4 h-4 text-[#000000]" />
                        <span className="text-[10px] font-[500]">مستودعات</span>
                      </button>
                      <button onClick={() => setActiveScreen('create_shipment')} className="p-2.5 rounded-[10px] bg-[#fbfbf5] border border-[#e4e4e7] hover:bg-white flex flex-col items-center gap-1 transition-colors">
                        <Truck className="w-4 h-4 text-[#000000]" />
                        <span className="text-[10px] font-[500]">شحن جديد</span>
                      </button>
                      <button onClick={() => setActiveScreen('wallet')} className="p-2.5 rounded-[10px] bg-[#fbfbf5] border border-[#e4e4e7] hover:bg-white flex flex-col items-center gap-1 transition-colors">
                        <CreditCard className="w-4 h-4 text-[#000000]" />
                        <span className="text-[10px] font-[500]">المحفظة</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Shipment Card (Shopify Night Card) */}
                  <div className="p-3.5 rounded-[12px] bg-[#000000] text-white space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#d4d4d8] font-mono">#SUD123456</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#c1fbd4] text-[#000000] text-[10px] font-[600]">في الطريق</span>
                    </div>
                    <div className="flex items-center justify-between font-[500] text-[13px]">
                      <span>الخرطوم</span>
                      <span className="text-[#c1fbd4]">➔</span>
                      <span>بورتسودان</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#c1fbd4] h-full w-[65%]"></div>
                    </div>
                  </div>

                  {/* Recent Shipments */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-[500] text-[#71717a]">الشحنات الأخيرة</div>
                    <div className="p-2.5 rounded-[10px] bg-white border border-[#e4e4e7] flex items-center justify-between">
                      <div>
                        <div className="font-mono text-[11px] text-[#000000] font-[600]">#LDC54321</div>
                        <div className="text-[10px] text-[#71717a]">بورتسودان ➔ دنقلا</div>
                      </div>
                      <span className="shopify-tag-mint !text-[10px]">
                        مكتمل
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SCREEN 3: TRACKING & ROUTE MAP */}
              {/* ============================================================ */}
              {activeScreen === 'tracking' && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-2">
                    <div className="font-[600] text-[14px]">تتبع الشحنة</div>
                    <span className="font-mono text-[11px] font-[600] bg-[#000000] text-white px-2 py-0.5 rounded-full">#{phoneTrackingCode}</span>
                  </div>

                  {/* Route Visual Container */}
                  <div className="relative h-44 bg-[#fbfbf5] rounded-[12px] border border-[#e4e4e7] overflow-hidden flex items-center justify-center p-2">
                    <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                      <line x1="25%" y1="75%" x2="75%" y2="25%" stroke="#000000" strokeWidth="2.5" strokeDasharray="4 2" />
                    </svg>

                    <div className="absolute bottom-3 start-4 text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#e4e4e7] font-[500]">
                      الخرطوم
                    </div>
                    <div className="absolute top-3 end-4 text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#e4e4e7] font-[500]">
                      بورتسودان
                    </div>

                    {/* Truck moving icon */}
                    <div className="relative z-10 bg-[#000000] p-2 rounded-full text-white shadow-md">
                      <Truck className="w-5 h-5 text-[#c1fbd4]" />
                    </div>
                  </div>

                  {/* Timeline Stages */}
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded-[8px] bg-white border border-[#e4e4e7]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#000000]" />
                        <span>مغادرة الشحنة (الخرطوم)</span>
                      </div>
                      <span className="font-mono text-[#71717a]">08:00</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-[8px] bg-[#c1fbd4] border border-[#a8f5c2]">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#000000] animate-ping"></div>
                        <span className="font-[600] text-[#000000]">على الطريق السريع (عطبرة)</span>
                      </div>
                      <span className="font-mono text-[#000000] font-[600]">الآن</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-[8px] bg-white border border-[#e4e4e7] opacity-60">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full border border-[#71717a]"></div>
                        <span>الوصول المتوقع (بورتسودان)</span>
                      </div>
                      <span className="font-mono text-[#71717a]">18:30</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast('جواز التتبع الرقمي', 'تم فتح السجل الكامل للبوليصة الإلكترونية', 'info');
                    }}
                    className="w-full bg-[#000000] text-white py-2.5 rounded-full text-[12px] font-[500] hover:bg-[#3f3f46] transition-colors"
                  >
                    عرض التفاصيل الكاملة
                  </button>
                </div>
              )}

              {/* ============================================================ */}
              {/* SCREEN 4: CREATE SHIPMENT WIZARD */}
              {/* ============================================================ */}
              {activeScreen === 'create_shipment' && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-3">
                  <div>
                    <div className="font-[600] text-[14px] mb-2">إنشاء شحنة جديدة</div>
                    
                    {/* 3 Step Indicator */}
                    <div className="flex items-center justify-between text-[11px] mb-3 pb-2 border-b border-[#e4e4e7]">
                      <span className="shopify-tag-mint !text-[10px]">1. البيانات</span>
                      <span className="text-[#71717a]">2. التفاصيل</span>
                      <span className="text-[#71717a]">3. المراجعة</span>
                    </div>

                    <div className="space-y-2.5 text-[11px] text-start">
                      <div>
                        <label className="text-[#71717a] block mb-0.5">مدينة المنشأ</label>
                        <select className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] p-1.5 outline-none">
                          <option>الخرطوم (Khartoum Central Hub)</option>
                          <option>بورتسودان (Port Sudan)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[#71717a] block mb-0.5">المدينة المرسل إليها</label>
                        <select className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] p-1.5 outline-none">
                          <option>بورتسودان (Port Sudan SCT)</option>
                          <option>كسلا (Kassala)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[#71717a] block mb-0.5">نوع وتصنيف البضائع</label>
                        <input type="text" defaultValue="إلكترونيات ومعدات صناعية" className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] p-1.5 outline-none" />
                      </div>

                      <div>
                        <label className="text-[#71717a] block mb-0.5">تاريخ الشحن المطلوب</label>
                        <input type="date" defaultValue="2026-08-30" className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] p-1.5 outline-none" />
                      </div>

                      <div>
                        <label className="text-[#71717a] block mb-0.5">مقاسات الشحنة / الشاحنة</label>
                        <select className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] p-1.5 outline-none">
                          <option>حاوية عادية 20 قدم (20 طن)</option>
                          <option>شاحنة مبردة Reefer (35 طن)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast('تم حجز الشحنة', 'تم توليد رقم البوليصة وتعيين أقرب شاحنة', 'success');
                      setActiveScreen('tracking');
                    }}
                    className="w-full bg-[#000000] text-white py-2.5 rounded-full text-[12px] font-[500] hover:bg-[#3f3f46] transition-colors"
                  >
                    التالي وتأكيد الطلب
                  </button>
                </div>
              )}

              {/* ============================================================ */}
              {/* SCREEN 5: SERVICES DIRECTORY */}
              {/* ============================================================ */}
              {activeScreen === 'services' && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-3">
                  <div>
                    <div className="font-[600] text-[14px]">خدماتنا</div>
                    <div className="text-[11px] text-[#71717a] mb-3">حلول لوجستية متكاملة تلبي احتياجاتك</div>

                    <div className="space-y-2">
                      <div onClick={() => setActiveScreen('create_shipment')} className="p-3 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#c1fbd4] flex items-center justify-center text-[#000000]">
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-[600] text-[12px]">النقل البري</div>
                            <div className="text-[10px] text-[#71717a]">شحن محلي وإقليمي</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#71717a]" />
                      </div>

                      <div onClick={() => showToast('النقل البحري', 'خدمات الشحن عبر ميناء بورتسودان', 'info')} className="p-3 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#d4f9e0] flex items-center justify-center text-[#000000]">
                            <Layers className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-[600] text-[12px]">النقل البحري</div>
                            <div className="text-[10px] text-[#71717a]">شحن دولي وحاويات</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#71717a]" />
                      </div>

                      <div onClick={() => showToast('التخزين والمستودعات', 'حجز مساحات التخزين الجاف والمبرد', 'info')} className="p-3 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#c1fbd4] flex items-center justify-center text-[#000000]">
                            <Warehouse className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-[600] text-[12px]">التخزين</div>
                            <div className="text-[10px] text-[#71717a]">مستودعات ذكية آمنة</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#71717a]" />
                      </div>

                      <div onClick={() => showToast('التخليص الجمركي', 'إجراءات التخليص الفوري ومكافحة التأخير', 'info')} className="p-3 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#d4f9e0] flex items-center justify-center text-[#000000]">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-[600] text-[12px]">التخليص الجمركي</div>
                            <div className="text-[10px] text-[#71717a]">إجراءات سريعة ومضمونة</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#71717a]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#fbfbf5] border border-[#e4e4e7] rounded-full text-center text-[10px] text-[#71717a]">
                    خدمة عملاء على مدار الساعة 24/7
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SCREEN 6: WALLET & INVOICES */}
              {/* ============================================================ */}
              {activeScreen === 'wallet' && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-3">
                  <div>
                    {/* Wallet Balance Card (Shopify Night Elevated Card) */}
                    <div className="p-4 rounded-[14px] bg-[#000000] text-white text-center space-y-1">
                      <span className="text-[11px] text-[#d4d4d8]">الرصيد الحالي</span>
                      <div className="text-[24px] font-[700] font-mono text-[#c1fbd4]">48,750</div>
                      <span className="text-[11px] text-[#d4d4d8]">جنيه سوداني (SDG)</span>
                    </div>

                    {/* 4 Action Buttons (Shopify Pill Buttons) */}
                    <div className="grid grid-cols-4 gap-1.5 text-center my-3">
                      <button onClick={() => showToast('إيصال', 'تم تحميل إيصال التحصيل المالي', 'info')} className="p-2 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex flex-col items-center gap-1">
                        <Receipt className="w-3.5 h-3.5 text-[#000000]" />
                        <span className="text-[9px]">إيصال</span>
                      </button>
                      <button onClick={() => showToast('فاتورة', 'تم فتح فاتورة الشحن الرسمية', 'info')} className="p-2 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex flex-col items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#000000]" />
                        <span className="text-[9px]">فاتورة</span>
                      </button>
                      <button onClick={() => showToast('مشاركة', 'تم نسخ رابط التحويل', 'info')} className="p-2 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex flex-col items-center gap-1">
                        <Share2 className="w-3.5 h-3.5 text-[#000000]" />
                        <span className="text-[9px]">مشاركة</span>
                      </button>
                      <button onClick={() => showToast('دفع EBS', 'تم تشغيل بوابة الدفع بنكك / فوري', 'success')} className="p-2 rounded-full bg-[#c1fbd4] text-[#000000] font-[600] flex flex-col items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span className="text-[9px]">دفع بنكك</span>
                      </button>
                    </div>

                    {/* Transaction History */}
                    <div className="space-y-1.5 text-[11px]">
                      <div className="font-[500] text-[#71717a]">سجل التحديثات المالية</div>
                      <div className="p-2 rounded-[8px] bg-white border border-[#e4e4e7] flex items-center justify-between">
                        <div>
                          <div className="font-[500]">تم التوصيل (#SUD123)</div>
                          <div className="text-[9px] text-[#71717a]">2024-05-23 10:30</div>
                        </div>
                        <span className="font-mono text-[#000000] font-[600]">+12,530 SDG</span>
                      </div>
                      <div className="p-2 rounded-[8px] bg-white border border-[#e4e4e7] flex items-center justify-between">
                        <div>
                          <div className="font-[500]">في الطريق (#SUD124)</div>
                          <div className="text-[9px] text-[#71717a]">2024-05-22 14:20</div>
                        </div>
                        <span className="font-mono text-[#000000] font-[600]">+7,250 SDG</span>
                      </div>
                      <div className="p-2 rounded-[8px] bg-white border border-[#e4e4e7] flex items-center justify-between">
                        <div>
                          <div className="font-[500]">تم الحجز (#SUD125)</div>
                          <div className="text-[9px] text-[#71717a]">2024-05-21 09:15</div>
                        </div>
                        <span className="font-mono text-[#000000] font-[600]">-10,000 SDG</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('كشف حساب', 'تم تصدير كشف الحساب المالي الكامل', 'info')}
                    className="w-full bg-[#fbfbf5] text-[#000000] py-2 rounded-full text-[11px] font-[500] border border-[#e4e4e7] hover:bg-white transition-colors"
                  >
                    عرض كل التحديثات
                  </button>
                </div>
              )}

              {/* ============================================================ */}
              {/* SCREEN 7: REPORTS & ANALYTICS */}
              {/* ============================================================ */}
              {activeScreen === 'reports' && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-3">
                  <div>
                    <div className="flex items-center justify-between border-b border-[#e4e4e7] pb-2">
                      <div className="font-[600] text-[14px]">التقارير والإحصائيات</div>
                      <span className="shopify-tag-shade !text-[10px]">هذا الشهر</span>
                    </div>

                    {/* 4 Stat Boxes (Shopify Style) */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-center">
                      <div className="p-2.5 rounded-[10px] bg-white border border-[#e4e4e7]">
                        <div className="text-[16px] font-[600] font-mono">128</div>
                        <div className="text-[10px] text-[#71717a]">إجمالي الشحنات</div>
                        <span className="shopify-tag-mint !px-1.5 !py-0 !text-[9px] mt-1 inline-block">+12%</span>
                      </div>
                      <div className="p-2.5 rounded-[10px] bg-white border border-[#e4e4e7]">
                        <div className="text-[16px] font-[600] font-mono">24</div>
                        <div className="text-[10px] text-[#71717a]">الشحنات المعلقة</div>
                        <span className="shopify-tag-shade !px-1.5 !py-0 !text-[9px] mt-1 inline-block">+8%</span>
                      </div>
                      <div className="p-2.5 rounded-[10px] bg-[#c1fbd4] border border-[#a8f5c2]">
                        <div className="text-[16px] font-[700] font-mono text-[#000000]">98%</div>
                        <div className="text-[10px] text-[#000000] font-[500]">معدل التسليم</div>
                      </div>
                      <div className="p-2.5 rounded-[10px] bg-white border border-[#e4e4e7]">
                        <div className="text-[16px] font-[600] font-mono">104</div>
                        <div className="text-[10px] text-[#71717a]">شحنة مكتملة</div>
                      </div>
                    </div>

                    {/* Donut Chart Visual Representation */}
                    <div className="p-3 bg-[#fbfbf5] rounded-[12px] border border-[#e4e4e7] space-y-2">
                      <div className="text-[11px] font-[600] text-[#000000]">توزيع الشحنات حسب الوجهة</div>
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#000000]"></span>
                            <span>بورتسودان (45%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#c1fbd4]"></span>
                            <span>كسلا (20%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#d4f9e0]"></span>
                            <span>عطبرة (15%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#d4d4d8]"></span>
                            <span>دنقلا (12%)</span>
                          </div>
                        </div>

                        {/* Circular ring */}
                        <div className="w-16 h-16 rounded-full border-4 border-[#000000] border-t-[#c1fbd4] border-l-[#d4f9e0] flex items-center justify-center font-mono font-[700] text-[11px]">
                          100%
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('تقرير تفصيلي', 'تم تصدير التقرير الفني الشهري PDF', 'info')}
                    className="w-full bg-[#000000] text-white py-2.5 rounded-full text-[11px] font-[500] hover:bg-[#3f3f46] transition-colors"
                  >
                    تصدير تقرير الأداء الشهري
                  </button>
                </div>
              )}

              {/* ============================================================ */}
              {/* SCREEN 8: USER PROFILE & SETTINGS */}
              {/* ============================================================ */}
              {activeScreen === 'profile' && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-3">
                  <div>
                    {/* User Avatar */}
                    <div className="text-center space-y-1 pt-2 pb-3 border-b border-[#e4e4e7]">
                      <div className="w-14 h-14 rounded-full bg-[#000000] text-white font-[600] text-[16px] mx-auto flex items-center justify-center">
                        MA
                      </div>
                      <div className="font-[600] text-[13px] text-[#000000]">محمد أحمد</div>
                      <div className="text-[10px] text-[#71717a]">عميل تجاري معتمد (B2B Shipper)</div>
                    </div>

                    {/* Menu Options */}
                    <div className="space-y-1 pt-2 text-[11px]">
                      <div onClick={() => showToast('معلومات شخصية', 'الملف الشخصي للعميل', 'info')} className="p-2.5 rounded-[8px] bg-white border border-[#e4e4e7] flex items-center justify-between cursor-pointer hover:bg-[#fbfbf5]">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#000000]" />
                          <span>معلومات شخصية</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#71717a]" />
                      </div>

                      <div onClick={() => showToast('إعدادات', 'خيارات التطبيق واللغة والتنبيهات', 'info')} className="p-2.5 rounded-[8px] bg-white border border-[#e4e4e7] flex items-center justify-between cursor-pointer hover:bg-[#fbfbf5]">
                        <div className="flex items-center gap-2">
                          <Settings className="w-3.5 h-3.5 text-[#000000]" />
                          <span>إعدادات التطبيق</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#71717a]" />
                      </div>

                      <div onClick={() => setActiveScreen('wallet')} className="p-2.5 rounded-[8px] bg-white border border-[#e4e4e7] flex items-center justify-between cursor-pointer hover:bg-[#fbfbf5]">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-[#000000]" />
                          <span>الدفعات والفواتير</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#71717a]" />
                      </div>

                      <div onClick={() => showToast('العناوين', 'دفتر العناوين ومواقع الاستلام والتسليم', 'info')} className="p-2.5 rounded-[8px] bg-white border border-[#e4e4e7] flex items-center justify-between cursor-pointer hover:bg-[#fbfbf5]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#000000]" />
                          <span>العناوين والمحطات المفضلة</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#71717a]" />
                      </div>

                      <div onClick={() => showToast('الدعم والمساعدة', 'فريق خدمة عملاء سودانيل في خدمتك', 'info')} className="p-2.5 rounded-[8px] bg-white border border-[#e4e4e7] flex items-center justify-between cursor-pointer hover:bg-[#fbfbf5]">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#000000]" />
                          <span>الدعم والمساعدة 24/7</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#71717a]" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveScreen('login')}
                    className="w-full bg-[#fbfbf5] text-[#000000] py-2 rounded-full text-[11px] font-[500] border border-[#e4e4e7] flex items-center justify-center gap-1.5 hover:bg-white transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}

              {/* Bottom Mobile Tab Bar (Shopify Clean Nav) */}
              <div className="h-14 border-t border-[#e4e4e7] bg-white flex items-center justify-around px-2 text-[9px] text-[#71717a]">
                <button
                  onClick={() => setActiveScreen('home')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'home' ? 'text-[#000000] font-[700]' : ''}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>الرئيسية</span>
                </button>
                <button
                  onClick={() => setActiveScreen('tracking')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'tracking' ? 'text-[#000000] font-[700]' : ''}`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>التتبع</span>
                </button>
                <button
                  onClick={() => setActiveScreen('services')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'services' ? 'text-[#000000] font-[700]' : ''}`}
                >
                  <Warehouse className="w-4 h-4" />
                  <span>المستودعات</span>
                </button>
                <button
                  onClick={() => setActiveScreen('create_shipment')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'create_shipment' ? 'text-[#000000] font-[700]' : ''}`}
                >
                  <Truck className="w-4 h-4" />
                  <span>الشحنات</span>
                </button>
                <button
                  onClick={() => setActiveScreen('profile')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'profile' ? 'text-[#000000] font-[700]' : ''}`}
                >
                  <User className="w-4 h-4" />
                  <span>الملف</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
