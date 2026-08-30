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

  // 8 Screen Definitions matching the Codex design
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
    <div className="space-y-8 font-sans text-[#171A20]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#3E6AE1] text-[12px] font-mono uppercase font-[500] mb-1">
            <Smartphone className="w-4 h-4" />
            <span>Official Mobile Experience • تطبيق سودانيل للهواتف الذكية</span>
          </div>
          <h1 className="text-[20px] font-[500] text-[#171A20]">
            منصة لوجستية ذكية متكاملة (Sudaneel iOS & Android)
          </h1>
          <p className="text-[13px] text-[#5C5E62] mt-1 max-w-2xl">
            حلول شحن متكاملة. أسطول حديث. تتبع ذكي. مستودعات ذكية. منصة موثوقة من الخرطوم إلى بورتسودان وإلى كافة الوجهات السودانية والإقليمية.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => showToast(
              lang === 'ar' ? 'تحميل تطبيق سودانيل' : 'Download Sudaneel App',
              lang === 'ar' ? 'جاري تجهيز حزمة التطبيق PWA / APK للتحميل المباشر' : 'PWA / APK package download initiated',
              'success'
            )}
            className="btn-tesla-primary !min-h-[36px] !py-1 !px-4 text-[13px] flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تثبيت التطبيق PWA' : 'Install PWA App'}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Pillars Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-[#F4F4F4] flex items-center justify-center flex-shrink-0 text-[#3E6AE1]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-[500] text-[#171A20]">تتبع لحظي دقيق</div>
            <div className="text-[11px] text-[#8E8E8E]">GPS Telemetry 4s</div>
          </div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-[#F4F4F4] flex items-center justify-center flex-shrink-0 text-[#3E6AE1]">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-[500] text-[#171A20]">مستودعات ذكية</div>
            <div className="text-[11px] text-[#8E8E8E]">120K m² Storage</div>
          </div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-[#F4F4F4] flex items-center justify-center flex-shrink-0 text-[#3E6AE1]">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-[500] text-[#171A20]">أسطول حديث ومتنوع</div>
            <div className="text-[11px] text-[#8E8E8E]">Euro 5/6 Heavy Fleet</div>
          </div>
        </div>

        <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex items-center gap-3">
          <div className="w-10 h-10 rounded-[4px] bg-[#F4F4F4] flex items-center justify-center flex-shrink-0 text-[#3E6AE1]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] font-[500] text-[#171A20]">موثوقية وأمان</div>
            <div className="text-[11px] text-[#8E8E8E]">100% Insured Loads</div>
          </div>
        </div>
      </div>

      {/* Master 8-Screens Overview Banner */}
      <div className="rounded-[4px] border border-[#EEEEEE] bg-[#FFFFFF] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
          <div>
            <h2 className="text-[16px] font-[500] text-[#171A20]">
              شاشات وتجربة مستخدم تطبيق سودانيل لوجيستك (Mobile UI Suite)
            </h2>
            <p className="text-[12px] text-[#5C5E62]">
              تصميم كامل لـ 8 شاشات رئيسية تغطي دورة حياة الشحنة، التتبع اللحظي، المدفوعات والتقارير
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-[2px] bg-[#F4F4F4] text-[#3E6AE1] border border-[#EEEEEE]">
            8 Native Screens
          </span>
        </div>

        <div className="rounded-[4px] overflow-hidden bg-[#F4F4F4] p-3 flex items-center justify-center border border-[#EEEEEE]">
          <img
            src="/images/mobile-app-showcase.png"
            alt="Sudaneel Mobile App 8 Screens Showcase"
            className="w-full h-auto max-h-[480px] object-contain rounded-[4px]"
          />
        </div>
      </div>

      {/* Interactive Mobile Device Simulator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              المحاكي التفاعلي المباشر (Interactive Device Simulator)
            </h2>
            <p className="text-[13px] text-[#5C5E62]">
              اختر أي شاشة من الشاشات الـ 8 لتجربتها مباشرة وبشكل تفاعلي داخل الجهاز
            </p>
          </div>
        </div>

        {/* Screen Picker Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {screenTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScreen === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveScreen(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
                  isActive
                    ? 'bg-[#171A20] text-white font-[500]'
                    : 'bg-white text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4] border border-[#EEEEEE]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? tab.titleAr : tab.titleEn}</span>
              </button>
            );
          })}
        </div>

        {/* Simulator Phone Chassis */}
        <div className="flex justify-center py-6 bg-[#F4F4F4] rounded-[8px] border border-[#EEEEEE]">
          <div className="w-[360px] h-[720px] bg-[#000000] p-3 rounded-[44px] shadow-2xl border-[4px] border-[#2A2E35] relative flex flex-col overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#171A20]"></div>
              <div className="w-2 h-2 rounded-full bg-[#3E6AE1]/60"></div>
            </div>

            {/* Inner Phone Screen Content */}
            <div className="w-full h-full bg-[#FFFFFF] rounded-[36px] overflow-hidden flex flex-col justify-between pt-8 font-sans text-[#171A20] select-none text-[13px]">
              
              {/* ============================================================ */}
              {/* SCREEN 1: LOGIN */}
              {/* ============================================================ */}
              {activeScreen === 'login' && (
                <div className="p-5 flex-1 flex flex-col justify-between text-center">
                  <div className="pt-8 space-y-4">
                    <div className="w-16 h-16 mx-auto bg-white p-1 rounded-[6px] border border-[#EEEEEE] flex items-center justify-center">
                      <img src="/images/brand-logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="font-[600] text-[16px] text-[#171A20]">سودانيل لوجيستك</h3>
                      <p className="text-[11px] text-[#8E8E8E]">SUDANIL LOGISTIC — نقل بثقة .. نوصل باحتراف</p>
                    </div>

                    <div className="space-y-2.5 pt-4 text-start">
                      <div>
                        <label className="text-[11px] text-[#5C5E62] block mb-1">البريد الإلكتروني أو رقم الجوال</label>
                        <input
                          type="text"
                          defaultValue="mohammed@sudaneel.sd"
                          className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-[4px] px-3 py-2 text-[12px] outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#5C5E62] block mb-1">كلمة المرور</label>
                        <input
                          type="password"
                          defaultValue="••••••••••••"
                          className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded-[4px] px-3 py-2 text-[12px] outline-none"
                        />
                      </div>
                      <div className="text-end">
                        <span className="text-[11px] text-[#3E6AE1] cursor-pointer">نسيت كلمة المرور؟</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveScreen('home')}
                      className="w-full bg-[#171A20] text-white py-2.5 rounded-[4px] font-[500] text-[13px] hover:bg-[#393C41] transition-colors"
                    >
                      تسجيل الدخول
                    </button>
                    <button
                      onClick={() => showToast('إنشاء حساب', 'تم فتح نموذج تسجيل العميل الجديد', 'info')}
                      className="w-full bg-white border border-[#D0D1D2] text-[#171A20] py-2 rounded-[4px] font-[400] text-[12px]"
                    >
                      إنشاء حساب جديد
                    </button>
                  </div>

                  <div className="text-[10px] text-[#8E8E8E] flex items-center justify-between pt-4 border-t border-[#EEEEEE]">
                    <span>v 1.0.0</span>
                    <span className="text-[#3E6AE1]">العربية / EN</span>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* SCREEN 2: HOME DASHBOARD */}
              {/* ============================================================ */}
              {activeScreen === 'home' && (
                <div className="p-4 flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar space-y-4">
                  {/* User greeting */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-[600] text-[15px] text-[#171A20]">مرحباً محمد 👋</div>
                      <div className="text-[11px] text-[#8E8E8E]">إدارة شحناتك بكل سهولة</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#F4F4F4] flex items-center justify-center text-[#5C5E62]">
                      <Bell className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                      <div className="text-[16px] font-[600] text-[#171A20] font-mono">12</div>
                      <div className="text-[10px] text-[#8E8E8E]">شحنة نشطة</div>
                    </div>
                    <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                      <div className="text-[16px] font-[600] text-[#3E6AE1] font-mono">5</div>
                      <div className="text-[10px] text-[#8E8E8E]">قيد التوصيل</div>
                    </div>
                    <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                      <div className="text-[16px] font-[600] text-[#171A20] font-mono">3</div>
                      <div className="text-[10px] text-[#8E8E8E]">شاحنة جاهزة</div>
                    </div>
                  </div>

                  {/* Quick Service Action Buttons (4 Icons) */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-[500] text-[#8E8E8E]">خدمات سريعة</div>
                    <div className="grid grid-cols-4 gap-1.5 text-center">
                      <button onClick={() => setActiveScreen('tracking')} className="p-2 rounded-[4px] bg-white border border-[#EEEEEE] hover:bg-[#F4F4F4] flex flex-col items-center gap-1">
                        <MapPin className="w-4 h-4 text-[#3E6AE1]" />
                        <span className="text-[10px]">تتبع</span>
                      </button>
                      <button onClick={() => setActiveScreen('services')} className="p-2 rounded-[4px] bg-white border border-[#EEEEEE] hover:bg-[#F4F4F4] flex flex-col items-center gap-1">
                        <Warehouse className="w-4 h-4 text-[#3E6AE1]" />
                        <span className="text-[10px]">مستودعات</span>
                      </button>
                      <button onClick={() => setActiveScreen('create_shipment')} className="p-2 rounded-[4px] bg-white border border-[#EEEEEE] hover:bg-[#F4F4F4] flex flex-col items-center gap-1">
                        <Truck className="w-4 h-4 text-[#3E6AE1]" />
                        <span className="text-[10px]">شحن جديد</span>
                      </button>
                      <button onClick={() => setActiveScreen('wallet')} className="p-2 rounded-[4px] bg-white border border-[#EEEEEE] hover:bg-[#F4F4F4] flex flex-col items-center gap-1">
                        <CreditCard className="w-4 h-4 text-[#3E6AE1]" />
                        <span className="text-[10px]">المحفظة</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Shipment Card */}
                  <div className="p-3 rounded-[4px] bg-[#171A20] text-white space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#8E8E8E] font-mono">#SUD123456</span>
                      <span className="px-2 py-0.5 rounded-[2px] bg-[#3E6AE1] text-white text-[10px]">في الطريق</span>
                    </div>
                    <div className="flex items-center justify-between font-[500]">
                      <span>الخرطوم</span>
                      <span className="text-[#3E6AE1]">➔</span>
                      <span>بورتسودان</span>
                    </div>
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#3E6AE1] h-full w-[65%]"></div>
                    </div>
                  </div>

                  {/* Recent Shipments */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-[500] text-[#8E8E8E]">الشحنات الأخيرة</div>
                    <div className="p-2.5 rounded-[4px] bg-white border border-[#EEEEEE] flex items-center justify-between">
                      <div>
                        <div className="font-mono text-[11px] text-[#171A20]">#LDC54321</div>
                        <div className="text-[10px] text-[#8E8E8E]">بورتسودان ➔ دنقلا</div>
                      </div>
                      <span className="text-[10px] text-[#171A20] bg-[#F4F4F4] px-2 py-0.5 rounded-[2px] border border-[#D0D1D2]">
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
                  <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2">
                    <div className="font-[600] text-[14px]">تتبع الشحنة</div>
                    <span className="font-mono text-[11px] text-[#3E6AE1]">#{phoneTrackingCode}</span>
                  </div>

                  {/* Route Visual Container */}
                  <div className="relative h-44 bg-[#F4F4F4] rounded-[4px] border border-[#EEEEEE] overflow-hidden flex items-center justify-center p-2">
                    <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                      <line x1="25%" y1="75%" x2="75%" y2="25%" stroke="#3E6AE1" strokeWidth="3" strokeDasharray="4 2" />
                    </svg>

                    <div className="absolute bottom-3 start-4 text-[10px] bg-white px-1.5 py-0.5 rounded border">
                      الخرطوم
                    </div>
                    <div className="absolute top-3 end-4 text-[10px] bg-white px-1.5 py-0.5 rounded border">
                      بورتسودان
                    </div>

                    {/* Truck icon moving */}
                    <div className="relative z-10 bg-white p-1.5 rounded-full border border-[#3E6AE1] shadow-sm">
                      <Truck className="w-5 h-5 text-[#3E6AE1]" />
                    </div>
                  </div>

                  {/* Timeline Stages */}
                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 rounded bg-white border border-[#EEEEEE]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3E6AE1]" />
                        <span>مغادرة الشحنة (الخرطوم)</span>
                      </div>
                      <span className="font-mono text-[#8E8E8E]">08:00</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-[#F4F4F4] border border-[#EEEEEE]">
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#3E6AE1] animate-pulse"></div>
                        <span className="font-[500]">على الطريق السريع (عطبرة)</span>
                      </div>
                      <span className="font-mono text-[#3E6AE1]">الآن</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded bg-white border border-[#EEEEEE] opacity-60">
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full border"></div>
                        <span>الوصول المتوقع (بورتسودان)</span>
                      </div>
                      <span className="font-mono text-[#8E8E8E]">18:30</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      showToast('جواز التتبع الرقمي', 'تم فتح السجل الكامل للبوليصة الإلكترونية', 'info');
                    }}
                    className="w-full bg-[#171A20] text-white py-2 rounded-[4px] text-[12px] font-[500]"
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
                    <div className="flex items-center justify-between text-[11px] mb-3 pb-2 border-b border-[#EEEEEE]">
                      <span className="font-[500] text-[#3E6AE1]">1. البيانات</span>
                      <span className="text-[#8E8E8E]">2. التفاصيل</span>
                      <span className="text-[#8E8E8E]">3. المراجعة</span>
                    </div>

                    <div className="space-y-2.5 text-[11px] text-start">
                      <div>
                        <label className="text-[#5C5E62] block mb-0.5">مدينة المنشأ</label>
                        <select className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded p-1.5">
                          <option>الخرطوم (Khartoum Central Hub)</option>
                          <option>بورتسودان (Port Sudan)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[#5C5E62] block mb-0.5">المدينة المرسل إليها</label>
                        <select className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded p-1.5">
                          <option>بورتسودان (Port Sudan SCT)</option>
                          <option>كسلا (Kassala)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[#5C5E62] block mb-0.5">نوع وتصنيف البضائع</label>
                        <input type="text" defaultValue="إلكترونيات ومعدات صناعية" className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded p-1.5" />
                      </div>

                      <div>
                        <label className="text-[#5C5E62] block mb-0.5">تاريخ الشحن المطلوب</label>
                        <input type="date" defaultValue="2026-08-30" className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded p-1.5" />
                      </div>

                      <div>
                        <label className="text-[#5C5E62] block mb-0.5">مقاسات الشحنة / الشاحنة</label>
                        <select className="w-full bg-[#F4F4F4] border border-[#D0D1D2] rounded p-1.5">
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
                    className="w-full bg-[#3E6AE1] text-white py-2 rounded-[4px] text-[12px] font-[500]"
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
                    <div className="text-[11px] text-[#8E8E8E] mb-3">حلول لوجستية متكاملة تلبي احتياجاتك</div>

                    <div className="space-y-2">
                      <div onClick={() => setActiveScreen('create_shipment')} className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Truck className="w-5 h-5 text-[#3E6AE1]" />
                          <div>
                            <div className="font-[500] text-[12px]">النقل البري</div>
                            <div className="text-[10px] text-[#8E8E8E]">شحن محلي وإقليمي</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8E8E8E]" />
                      </div>

                      <div onClick={() => showToast('النقل البحري', 'خدمات الشحن عبر ميناء بورتسودان', 'info')} className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Layers className="w-5 h-5 text-[#3E6AE1]" />
                          <div>
                            <div className="font-[500] text-[12px]">النقل البحري</div>
                            <div className="text-[10px] text-[#8E8E8E]">شحن دولي وحاويات</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8E8E8E]" />
                      </div>

                      <div onClick={() => showToast('التخزين والمستودعات', 'حجز مساحات التخزين الجاف والمبرد', 'info')} className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                        <div className="flex items-center gap-2.5">
                          <Warehouse className="w-5 h-5 text-[#3E6AE1]" />
                          <div>
                            <div className="font-[500] text-[12px]">التخزين</div>
                            <div className="text-[10px] text-[#8E8E8E]">مستودعات ذكية آمنة</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8E8E8E]" />
                      </div>

                      <div onClick={() => showToast('التخليص الجمركي', 'إجراءات التخليص الفوري ومكافحة التأخير', 'info')} className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center justify-between cursor-pointer hover:bg-white transition-colors">
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-5 h-5 text-[#3E6AE1]" />
                          <div>
                            <div className="font-[500] text-[12px]">التخليص الجمركي</div>
                            <div className="text-[10px] text-[#8E8E8E]">إجراءات سريعة ومضمونة</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-[#8E8E8E]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#FFFFFF] border border-[#EEEEEE] rounded text-center text-[10px] text-[#8E8E8E]">
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
                    {/* Wallet Balance Card */}
                    <div className="p-4 rounded-[4px] bg-[#171A20] text-white text-center space-y-1">
                      <span className="text-[11px] text-[#8E8E8E]">الرصيد الحالي</span>
                      <div className="text-[22px] font-[600] font-mono text-white">48,750</div>
                      <span className="text-[11px] text-[#D0D1D2]">جنيه سوداني (SDG)</span>
                    </div>

                    {/* 4 Action Buttons */}
                    <div className="grid grid-cols-4 gap-1.5 text-center my-3">
                      <button onClick={() => showToast('إيصال', 'تم تحميل إيصال التحصيل المالي', 'info')} className="p-2 rounded bg-[#F4F4F4] flex flex-col items-center gap-1">
                        <Receipt className="w-4 h-4 text-[#171A20]" />
                        <span className="text-[9px]">إيصال</span>
                      </button>
                      <button onClick={() => showToast('فاتورة', 'تم فتح فاتورة الشحن الرسمية', 'info')} className="p-2 rounded bg-[#F4F4F4] flex flex-col items-center gap-1">
                        <FileText className="w-4 h-4 text-[#171A20]" />
                        <span className="text-[9px]">فاتورة</span>
                      </button>
                      <button onClick={() => showToast('مشاركة', 'تم نسخ رابط التحويل', 'info')} className="p-2 rounded bg-[#F4F4F4] flex flex-col items-center gap-1">
                        <Share2 className="w-4 h-4 text-[#171A20]" />
                        <span className="text-[9px]">مشاركة</span>
                      </button>
                      <button onClick={() => showToast('دفع EBS', 'تم تشغيل بوابة الدفع بنكك / فوري', 'success')} className="p-2 rounded bg-[#3E6AE1] text-white flex flex-col items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-[9px]">دفع إلكتروني</span>
                      </button>
                    </div>

                    {/* Transaction History */}
                    <div className="space-y-1.5 text-[11px]">
                      <div className="font-[500] text-[#8E8E8E]">سجل التحديثات المالية</div>
                      <div className="p-2 rounded bg-white border border-[#EEEEEE] flex items-center justify-between">
                        <div>
                          <div className="font-[500]">تم التوصيل (#SUD123)</div>
                          <div className="text-[9px] text-[#8E8E8E]">2024-05-23 10:30</div>
                        </div>
                        <span className="font-mono text-[#3E6AE1] font-[600]">+12,530 SDG</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#EEEEEE] flex items-center justify-between">
                        <div>
                          <div className="font-[500]">في الطريق (#SUD124)</div>
                          <div className="text-[9px] text-[#8E8E8E]">2024-05-22 14:20</div>
                        </div>
                        <span className="font-mono text-[#3E6AE1] font-[600]">+7,250 SDG</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-[#EEEEEE] flex items-center justify-between">
                        <div>
                          <div className="font-[500]">تم الحجز (#SUD125)</div>
                          <div className="text-[9px] text-[#8E8E8E]">2024-05-21 09:15</div>
                        </div>
                        <span className="font-mono text-[#171A20] font-[600]">-10,000 SDG</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('كشف حساب', 'تم تصدير كشف الحساب المالي الكامل', 'info')}
                    className="w-full bg-[#F4F4F4] text-[#171A20] py-2 rounded-[4px] text-[11px] font-[500] border border-[#D0D1D2]"
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
                    <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-2">
                      <div className="font-[600] text-[14px]">التقارير والإحصائيات</div>
                      <span className="text-[10px] bg-[#F4F4F4] px-2 py-0.5 rounded border">هذا الشهر</span>
                    </div>

                    {/* 4 Stat Boxes */}
                    <div className="grid grid-cols-2 gap-2 my-3 text-center">
                      <div className="p-2.5 rounded bg-white border border-[#EEEEEE]">
                        <div className="text-[16px] font-[600] font-mono">128</div>
                        <div className="text-[10px] text-[#8E8E8E]">إجمالي الشحنات</div>
                        <span className="text-[9px] text-[#3E6AE1]">+12% أداء</span>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#EEEEEE]">
                        <div className="text-[16px] font-[600] font-mono">24</div>
                        <div className="text-[10px] text-[#8E8E8E]">الشحنات المعلقة</div>
                        <span className="text-[9px] text-[#3E6AE1]">+8% أداء</span>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#EEEEEE]">
                        <div className="text-[16px] font-[600] font-mono text-[#3E6AE1]">98%</div>
                        <div className="text-[10px] text-[#8E8E8E]">معدل التسليم</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-[#EEEEEE]">
                        <div className="text-[16px] font-[600] font-mono">104</div>
                        <div className="text-[10px] text-[#8E8E8E]">شحنة مكتملة</div>
                      </div>
                    </div>

                    {/* Donut Chart Visual Representation */}
                    <div className="p-3 bg-[#F4F4F4] rounded-[4px] space-y-2">
                      <div className="text-[11px] font-[500] text-[#171A20]">توزيع الشحنات حسب الوجهة</div>
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#3E6AE1]"></span>
                            <span>بورتسودان (45%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#171A20]"></span>
                            <span>كسلا (20%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#5C5E62]"></span>
                            <span>عطبرة (15%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#D0D1D2]"></span>
                            <span>دنقلا (12%)</span>
                          </div>
                        </div>

                        {/* Circular ring representation */}
                        <div className="w-16 h-16 rounded-full border-4 border-[#3E6AE1] border-t-[#171A20] border-l-[#5C5E62] flex items-center justify-center font-mono font-[600] text-[11px]">
                          100%
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('تقرير تفصيلي', 'تم تصدير التقرير الفني الشهري PDF', 'info')}
                    className="w-full bg-[#171A20] text-white py-2 rounded-[4px] text-[11px] font-[500]"
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
                    <div className="text-center space-y-1 pt-2 pb-3 border-b border-[#EEEEEE]">
                      <div className="w-14 h-14 rounded-full bg-[#171A20] text-white font-[600] text-[16px] mx-auto flex items-center justify-center">
                        MA
                      </div>
                      <div className="font-[600] text-[13px] text-[#171A20]">محمد أحمد</div>
                      <div className="text-[10px] text-[#8E8E8E]">عميل تجاري معتمد (B2B Shipper)</div>
                    </div>

                    {/* Menu Options */}
                    <div className="space-y-1 pt-2 text-[11px]">
                      <div onClick={() => showToast('معلومات شخصية', 'الملف الشخصي للعميل', 'info')} className="p-2.5 rounded bg-white border border-[#EEEEEE] flex items-center justify-between cursor-pointer hover:bg-[#F4F4F4]">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#5C5E62]" />
                          <span>معلومات شخصية</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8E8E8E]" />
                      </div>

                      <div onClick={() => showToast('إعدادات', 'خيارات التطبيق واللغة والتنبيهات', 'info')} className="p-2.5 rounded bg-white border border-[#EEEEEE] flex items-center justify-between cursor-pointer hover:bg-[#F4F4F4]">
                        <div className="flex items-center gap-2">
                          <Settings className="w-3.5 h-3.5 text-[#5C5E62]" />
                          <span>إعدادات التطبيق</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8E8E8E]" />
                      </div>

                      <div onClick={() => setActiveScreen('wallet')} className="p-2.5 rounded bg-white border border-[#EEEEEE] flex items-center justify-between cursor-pointer hover:bg-[#F4F4F4]">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-[#5C5E62]" />
                          <span>الدفعات والفواتير</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8E8E8E]" />
                      </div>

                      <div onClick={() => showToast('العناوين', 'دفتر العناوين ومواقع الاستلام والتسليم', 'info')} className="p-2.5 rounded bg-white border border-[#EEEEEE] flex items-center justify-between cursor-pointer hover:bg-[#F4F4F4]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#5C5E62]" />
                          <span>العناوين والمحطات المفضلة</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8E8E8E]" />
                      </div>

                      <div onClick={() => showToast('الدعم والمساعدة', 'فريق خدمة عملاء سودانيل في خدمتك', 'info')} className="p-2.5 rounded bg-white border border-[#EEEEEE] flex items-center justify-between cursor-pointer hover:bg-[#F4F4F4]">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#5C5E62]" />
                          <span>الدعم والمساعدة 24/7</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-[#8E8E8E]" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveScreen('login')}
                    className="w-full bg-[#F4F4F4] text-[#171A20] py-2 rounded-[4px] text-[11px] font-[500] border border-[#D0D1D2] flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}

              {/* Bottom Mobile Tab Bar */}
              <div className="h-14 border-t border-[#EEEEEE] bg-white flex items-center justify-around px-2 text-[9px] text-[#8E8E8E]">
                <button
                  onClick={() => setActiveScreen('home')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'home' ? 'text-[#3E6AE1] font-[600]' : ''}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>الرئيسية</span>
                </button>
                <button
                  onClick={() => setActiveScreen('tracking')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'tracking' ? 'text-[#3E6AE1] font-[600]' : ''}`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>التتبع</span>
                </button>
                <button
                  onClick={() => setActiveScreen('services')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'services' ? 'text-[#3E6AE1] font-[600]' : ''}`}
                >
                  <Warehouse className="w-4 h-4" />
                  <span>المستودعات</span>
                </button>
                <button
                  onClick={() => setActiveScreen('create_shipment')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'create_shipment' ? 'text-[#3E6AE1] font-[600]' : ''}`}
                >
                  <Truck className="w-4 h-4" />
                  <span>الشحنات</span>
                </button>
                <button
                  onClick={() => setActiveScreen('profile')}
                  className={`flex flex-col items-center gap-0.5 ${activeScreen === 'profile' ? 'text-[#3E6AE1] font-[600]' : ''}`}
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
