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
  AlertCircle,
  FileText,
  LifeBuoy,
  MessageSquare,
  Clock,
  ChevronDown,
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
      category: 'faq',
    },
    {
      icon: PackageSearch,
      title: 'تتبع الشحنات',
      desc: 'إرشادات حول أجهزة التتبع الفضائية وتحديثات الـ ETA.',
      category: 'tracking',
    },
    {
      icon: Receipt,
      title: 'الفواتير والمدفوعات',
      desc: 'تسويات نظام EBS، الدفع عبر بنكك، والمطالبات الضريبية.',
      category: 'billing',
    },
    {
      icon: UserCog,
      title: 'الحساب والصلاحيات',
      desc: 'إدارة أدوار RBAC، التحقق الثنائي MFA، وتراخيص الناقلين.',
      category: 'account',
    },
    {
      icon: Boxes,
      title: 'خدمات التخزين والموانئ',
      desc: 'شروط الإيداع بميناء بورتسودان وسعات المستودعات المركزية.',
      category: 'warehousing',
    },
    {
      icon: PhoneCall,
      title: 'الاتصال المباشر 24/7',
      desc: 'غرفة العمليات المركزية: 9200-SUDAN / support@sudaneel.sd',
      category: 'contact',
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
    <div className="space-y-6 pb-12 font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-navy-900 border border-gold/30 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider mb-1">
            <LifeBuoy className="w-4 h-4" />
            <span>مركز الدعم والمساعدة الفنية الموحد</span>
          </div>
          <h1 className="text-2xl font-black text-white">كيف يمكننا مساعدتك اليوم؟</h1>
          <p className="text-xs text-gray-300 mt-1">
            فريق الدعم الفني وغرفة العمليات اللوجستية في خدمتك على مدار 24 ساعة طوال أيام الأسبوع.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('control_tower')}
          className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-xl text-xs font-bold border border-white/10 transition-colors"
        >
          العودة لبرج المراقبة
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-3xl mx-auto">
        <Search className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن إجابة لسؤالك، دليل إجراءات الجمارك، أو رقم تذكرة..."
          className="w-full bg-navy-900 border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-gold shadow-lg"
        />
      </div>

      {/* 6 Support Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {supportCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="p-5 rounded-2xl bg-navy-900/80 border border-white/5 hover:border-gold/50 transition-all hover:-translate-y-1 cursor-pointer group shadow-lg"
            >
              <div className="w-11 h-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-white">{c.title}</h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Grid: Create Ticket (Left) + Active Tickets (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Create Ticket Form (7 cols) */}
        <div className="lg:col-span-7 bg-navy-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gold" />
            <h2 className="font-extrabold text-base text-white">فتح تذكرة دعم فني جديدة</h2>
          </div>

          {submitted && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم استلام التذكرة بنجاح وجارٍ المتابعة الفورية من قبل فريق العمليات!</span>
            </div>
          )}

          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">التصنيف</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-gold"
                >
                  <option value="shipment">شحنة وتتبع</option>
                  <option value="invoice">فاتورة ومدفوعات</option>
                  <option value="customs">تخليص جمركي</option>
                  <option value="technical">خلل تقني في المنصة</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">الأولوية</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-gold"
                >
                  <option value="low">منخفضة (استفسار عام)</option>
                  <option value="medium">متوسطة</option>
                  <option value="high">عالية (تأخير شحنة)</option>
                  <option value="urgent">طارئة (حادث / عطل أمني)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">موضوع التذكرة</label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="مثال: طلب تغيير نقطة تسليم الشحنة SDN-2024-1258..."
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-gold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">تفاصيل البلاغ / الاستفسار</label>
              <textarea
                rows={4}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="يرجى كتابة التفاصيل الكاملة ورقم الشحنة أو المركبة المعنية..."
                className="w-full bg-navy-950 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-gold"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gold hover:bg-gold-light text-navy-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال التذكرة إلى غرفة العمليات</span>
            </button>
          </form>
        </div>

        {/* Active Tickets List (5 cols) */}
        <div className="lg:col-span-5 bg-navy-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold" />
              <h2 className="font-extrabold text-base text-white">تذاكر الدعم النشطة</h2>
            </div>
            <span className="text-xs font-mono text-gold font-bold">{activeTickets.length} تذاكر</span>
          </div>

          <div className="space-y-3">
            {activeTickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gold">{t.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'resolved'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : t.status === 'in_progress'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {t.status === 'resolved' ? 'تم الحل' : t.status === 'in_progress' ? 'قيد المعالجة' : 'مفتوحة'}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-white leading-snug">{t.subject}</h4>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-white/5">
                  <span>{t.category}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-gray-500" />
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
