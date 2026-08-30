'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  HelpCircle,
  PackageSearch,
  Receipt,
  UserCog,
  Boxes,
  PhoneCall,
  Search,
  Send,
  CheckCircle2,
  FileText,
  LifeBuoy,
  MessageSquare,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
}

export function SupportCenterView() {
  const { setCurrentView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketCategory, setTicketCategory] = useState('shipment');
  const [ticketPriority, setTicketPriority] = useState('medium');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [activeTickets, setActiveTickets] = useState<Ticket[]>([
    {
      id: 'TCK-2026-081',
      subject: 'طلب تحديث مسار الشاحنة SDN-2024-1256 بسبب أمطار كسلا',
      category: 'الشحنات والتتبع',
      priority: 'high',
      status: 'in_progress',
      createdAt: 'اليوم، 10:30 ص',
    },
    {
      id: 'TCK-2026-079',
      subject: 'استفسار عن مطابقة فاتورة الإيداع الجمركي INV-2026-0421',
      category: 'الفواتير والمدفوعات',
      priority: 'medium',
      status: 'resolved',
      createdAt: 'أمس، 02:15 م',
    },
  ]);

  const supportCards = [
    {
      icon: PackageSearch,
      title: 'تتبع الشحنات والاستلام',
      desc: 'الاستعلام عن بوالص الشحن، أوقات الوصول المقدرة، أو طلب تغيير وجهة التسليم.',
      action: () => setCurrentView('shipments'),
    },
    {
      icon: Receipt,
      title: 'الفواتير والمدفوعات',
      desc: 'الاستفسار عن التسويات البنكية، شحن المحفظة، أو مطابقة فواتير الجمارك.',
      action: () => setCurrentView('invoices_ledger'),
    },
    {
      icon: Boxes,
      title: 'المستودعات والتخزين',
      desc: 'إدارة مساحات التخزين المحجوزة، فحص المخزون (WMS)، أو استلام البضائع.',
      action: () => setCurrentView('warehousing'),
    },
    {
      icon: PhoneCall,
      title: 'غرفة الطوارئ 24/7',
      desc: 'التواصل المباشر مع مشرفي العمليات وفرق الإنقاذ الميداني على الطرق القومية.',
      action: () => setCurrentView('incidents'),
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;

    const newTicket: Ticket = {
      id: `TCK-2026-0${activeTickets.length + 82}`,
      subject: ticketSubject,
      category: ticketCategory === 'shipment' ? 'الشحنات والتتبع' : ticketCategory === 'billing' ? 'الفواتير والمدفوعات' : 'الدعم الفني',
      priority: ticketPriority as any,
      status: 'open',
      createdAt: 'الآن',
    };

    setActiveTickets([newTicket, ...activeTickets]);
    setSubmitted(true);
    setTicketSubject('');
    setTicketDescription('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir="rtl">
      {/* Header */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <LifeBuoy className="w-4 h-4" />
            <span>24/7 Operations Help Desk • مركز الدعم والمساعدة</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">مركز الدعم والمساعدة الموحد</h1>
          <p className="text-[14px] text-[#71717a] leading-relaxed">
            فريق عمليات مخصص لمتابعة رحلاتكم على مدار الساعة وحل أي معوقات لوجستية أو جمركية فورياً.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('incidents')}
            className="btn-shopify-pill"
          >
            <span>مركز البلاغات الطارئة</span>
          </button>
        </div>
      </div>

      {/* Fast Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {supportCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={card.action}
              className="shopify-card p-6 space-y-4 hover:border-[#a1a1aa] transition-colors cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] flex items-center justify-center text-[#000000]">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-[600] text-[15px] text-[#000000]">{card.title}</h3>
                  <p className="text-[12.5px] text-[#71717a] mt-1 line-clamp-2">{card.desc}</p>
                </div>
              </div>

              <div className="pt-2 text-[12px] font-[600] text-[#000000] flex items-center justify-between">
                <span>فتح القسم</span>
                <span>➔</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Split: Ticket Form (7 cols) + Active Tickets (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ticket Submission Form */}
        <div className="lg:col-span-7 shopify-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e4e7]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#000000]" />
              <h2 className="font-[600] text-[17px] text-[#000000]">فتح تذكرة دعم جديدة</h2>
            </div>
            <span className="shopify-tag-mint !text-[11px]">استجابة خلال 15 دقيقة</span>
          </div>

          {submitted && (
            <div className="p-4 rounded-[12px] bg-[#c1fbd4] border border-[#a8f5c2] text-[#000000] text-[13px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم استلام تذكرتك بنجاح وجارٍ مراجعتها من قبل مشرف العمليات المختص.</span>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4 text-[13px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#71717a] font-[500]">تصنيف المشكلة</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2.5 text-[#000000] outline-none focus:border-[#000000]"
                >
                  <option value="shipment">الشحنات والتتبع</option>
                  <option value="billing">الفواتير والتسويات</option>
                  <option value="customs">التخليص الجمركي بميناء بورتسودان</option>
                  <option value="technical">دعم تقني وتطبيق الهاتف</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#71717a] font-[500]">درجة الأهمية</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2.5 text-[#000000] outline-none focus:border-[#000000]"
                >
                  <option value="low">منخفضة (استفسار عام)</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية (تأخير شحنة)</option>
                  <option value="urgent">طارئة (حادث / عطل أمني)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#71717a] font-[500]">موضوع التذكرة</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="مثال: طلب تغيير نقطة تسليم الشحنة SDN-2024-1258..."
                className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] px-3.5 py-2.5 text-[#000000] outline-none focus:border-[#000000]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#71717a] font-[500]">تفاصيل البلاغ / الاستفسار</label>
              <textarea
                rows={4}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="يرجى كتابة التفاصيل الكاملة ورقم الشحنة أو المركبة المعنية..."
                className="w-full bg-[#fbfbf5] border border-[#e4e4e7] rounded-[8px] p-3.5 text-[#000000] outline-none focus:border-[#000000]"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-shopify-pill w-full !py-3 text-[13.5px] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#c1fbd4]" />
              <span>إرسال التذكرة إلى غرفة العمليات</span>
            </button>
          </form>
        </div>

        {/* Active Tickets List (5 cols) */}
        <div className="lg:col-span-5 shopify-card p-6 space-y-4 bg-[#ffffff]">
          <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#000000]" />
              <h2 className="font-[600] text-[15px] text-[#000000]">تذاكر الدعم النشطة</h2>
            </div>
            <span className="shopify-tag-mint font-mono font-[600]">{activeTickets.length} تذاكر</span>
          </div>

          <div className="space-y-3">
            {activeTickets.map((t) => (
              <div key={t.id} className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono font-[700] text-[#000000]">{t.id}</span>
                  <span className={t.status === 'resolved' ? 'shopify-tag-mint !text-[10px]' : 'shopify-tag-shade !text-[10px]'}>
                    {t.status === 'resolved' ? 'تم الحل' : t.status === 'in_progress' ? 'قيد المعالجة' : 'مفتوحة'}
                  </span>
                </div>

                <h4 className="font-[600] text-[13px] text-[#000000] leading-snug">{t.subject}</h4>

                <div className="flex items-center justify-between text-[11px] text-[#71717a] pt-2 border-t border-[#e4e4e7]">
                  <span>{t.category}</span>
                  <span className="flex items-center gap-1 font-mono text-[#71717a]">
                    <Clock className="w-3 h-3" />
                    {t.createdAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
