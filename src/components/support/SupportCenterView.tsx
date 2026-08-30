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
      icon: HelpCircle,
      title: 'الأسئلة الشائعة',
      desc: 'إجابات وافية على أكثر استفسارات العملاء والناقلين تكراراً.',
    },
    {
      icon: PackageSearch,
      title: 'تتبع الشحنات',
      desc: 'إرشادات حول أجهزة التتبع الفضائية وتحديثات الـ ETA.',
    },
    {
      icon: Receipt,
      title: 'الفواتير والمدفوعات',
      desc: 'تسويات نظام EBS، الدفع عبر بنكك، والمطالبات الضريبية.',
    },
    {
      icon: UserCog,
      title: 'الحساب والصلاحيات',
      desc: 'إدارة أدوار RBAC، التحقق الثنائي MFA، وتراخيص الناقلين.',
    },
    {
      icon: Boxes,
      title: 'خدمات التخزين والموانئ',
      desc: 'شروط الإيداع بميناء بورتسودان وسعات المستودعات المركزية.',
    },
    {
      icon: PhoneCall,
      title: 'الاتصال المباشر 24/7',
      desc: 'غرفة العمليات المركزية: 9200-SUDAN / support@sudaneel.sd',
    },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    const newTicket: Ticket = {
      id: `TCK-2026-0${activeTickets.length + 82}`,
      subject: ticketSubject,
      category: ticketCategory === 'shipment' ? 'الشحنات والتتبع' : ticketCategory === 'invoice' ? 'الفواتير' : 'الدعم العام',
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
    <div className="space-y-6 font-sans text-[#171A20]" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] border border-[#EEEEEE] p-6 rounded-[4px]">
        <div>
          <div className="flex items-center gap-2 text-[#3E6AE1] text-[12px] font-[500] uppercase tracking-wider mb-1">
            <LifeBuoy className="w-4 h-4" />
            <span>مركز الدعم والمساعدة الفنية الموحد</span>
          </div>
          <h1 className="text-[20px] font-[500] text-[#171A20]">كيف يمكننا مساعدتك اليوم؟</h1>
          <p className="text-[13px] text-[#5C5E62] mt-1">
            فريق الدعم الفني وغرفة العمليات اللوجستية في خدمتك على مدار 24 ساعة طوال أيام الأسبوع.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('control_tower')}
          className="btn-tesla-secondary !min-h-[36px] !py-1 !px-3 text-[13px]"
        >
          العودة لبرج المراقبة
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-3xl mx-auto">
        <Search className="w-4 h-4 absolute right-4 top-3.5 text-[#8E8E8E]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن إجابة لسؤالك، دليل إجراءات الجمارك، أو رقم تذكرة..."
          className="w-full bg-[#FFFFFF] border border-[#D0D1D2] rounded-[4px] pr-11 pl-4 py-2.5 text-[14px] text-[#171A20] placeholder-[#8E8E8E] outline-none"
        />
      </div>

      {/* 6 Support Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {supportCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] hover:bg-[#F4F4F4] transition-colors duration-330 cursor-pointer space-y-2"
            >
              <div className="w-10 h-10 rounded-[4px] bg-[#F4F4F4] text-[#3E6AE1] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-[500] text-[14px] text-[#171A20]">{c.title}</h3>
              <p className="text-[12px] text-[#5C5E62] leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Grid: Create Ticket (7 cols) + Active Tickets (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Create Ticket Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
            <MessageSquare className="w-4 h-4 text-[#3E6AE1]" />
            <h2 className="font-[500] text-[15px] text-[#171A20]">فتح تذكرة دعم فني جديدة</h2>
          </div>

          {submitted && (
            <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#3E6AE1] text-[#171A20] text-[12px] font-[500] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" />
              <span>تم استلام التذكرة بنجاح وجارٍ المتابعة الفورية من قبل فريق العمليات!</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4 text-[13px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#5C5E62]">التصنيف</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-white border border-[#D0D1D2] rounded-[4px] px-3 py-2 text-[#171A20] outline-none"
                >
                  <option value="shipment">شحنة وتتبع</option>
                  <option value="invoice">فاتورة ومدفوعات</option>
                  <option value="customs">تخليص جمركي</option>
                  <option value="technical">خلل تقني في المنصة</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#5C5E62]">الأولوية</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full bg-white border border-[#D0D1D2] rounded-[4px] px-3 py-2 text-[#171A20] outline-none"
                >
                  <option value="low">منخفضة (استفسار عام)</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية (تأخير شحنة)</option>
                  <option value="urgent">طارئة (حادث / عطل أمني)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#5C5E62]">موضوع التذكرة</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="مثال: طلب تغيير نقطة تسليم الشحنة SDN-2024-1258..."
                className="w-full bg-white border border-[#D0D1D2] rounded-[4px] px-3 py-2 text-[#171A20] outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#5C5E62]">تفاصيل البلاغ / الاستفسار</label>
              <textarea
                rows={4}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="يرجى كتابة التفاصيل الكاملة ورقم الشحنة أو المركبة المعنية..."
                className="w-full bg-white border border-[#D0D1D2] rounded-[4px] p-3 text-[#171A20] outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-tesla-primary w-full !min-h-[38px] text-[13px] flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>إرسال التذكرة إلى غرفة العمليات</span>
            </button>
          </form>
        </div>

        {/* Active Tickets List (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#3E6AE1]" />
              <h2 className="font-[500] text-[15px] text-[#171A20]">تذاكر الدعم النشطة</h2>
            </div>
            <span className="text-[12px] font-mono text-[#3E6AE1] font-[500]">{activeTickets.length} تذاكر</span>
          </div>

          <div className="space-y-3">
            {activeTickets.map((t) => (
              <div key={t.id} className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-mono font-[500] text-[#3E6AE1]">{t.id}</span>
                  <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-[500] bg-white border border-[#D0D1D2]">
                    {t.status === 'resolved' ? 'تم الحل' : t.status === 'in_progress' ? 'قيد المعالجة' : 'مفتوحة'}
                  </span>
                </div>

                <h4 className="font-[500] text-[13px] text-[#171A20] leading-snug">{t.subject}</h4>

                <div className="flex items-center justify-between text-[11px] text-[#5C5E62] pt-1 border-t border-[#EEEEEE]">
                  <span>{t.category}</span>
                  <span className="flex items-center gap-1 font-mono text-[#8E8E8E]">
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
