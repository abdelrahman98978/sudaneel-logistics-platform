'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Bot,
  Sparkles,
  Send,
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Truck,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface CopilotResponse {
  query: string;
  insight: string;
  cause: string;
  impact: string;
  recommendation: string;
  actions: {
    label: string;
    actionType: string;
    payload?: any;
  }[];
}

export function AiCopilotDrawer() {
  const {
    isAiCopilotOpen,
    setIsAiCopilotOpen,
    setCurrentView,
    setSelectedShipmentId,
    t,
    lang,
    backhauls,
    shipments,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [conversation, setConversation] = useState<CopilotResponse[]>([
    {
      query: lang === 'ar' ? 'ما الشحنات المتوقع تأخرها أو المعرضة للمخاطر اليوم؟' : 'Which shipments are delayed or at risk today?',
      insight:
        lang === 'ar'
          ? 'تم رصد شحنة واحدة (#SDN-88419) محتجزة في نقطة تفتيش جمركية قرب شندي مع تأخير متوقع 45 دقيقة.'
          : 'Detected 1 shipment (#SDN-88419) delayed at customs checkpoint near Shendi with estimated 45 min buffer.',
      cause:
        lang === 'ar'
          ? 'إعادة مطابقة باركود أختام الحاويات إلكترونياً مع بوابات التفتيش الجمركي.'
          : 'Electronic digital seal barcode re-validation at security checkpoint.',
      impact:
        lang === 'ar'
          ? 'وصول الشاحنة إلى بورتسودان الساعة 17:30 بدلاً من 16:45 (ما زالت ضمن نافذة الـ SLA المسموحة 18:00).'
          : 'Arrival at Port Sudan at 17:30 instead of 16:45 (still within SLA cutoff 18:00).',
      recommendation:
        lang === 'ar'
          ? 'إرسال إشعار استباقي آلي للعميل DAL وتزويد السائق بمسار تفادي الازدحام عبر ممر هيا.'
          : 'Send automated proactive SMS alert to DAL and dispatch optimized bypass routing through Hayya pass.',
      actions: [
        { label: lang === 'ar' ? 'إرسال إشعار للعميل' : 'Notify Customer', actionType: 'notify_cust' },
        { label: lang === 'ar' ? 'عرض تتبع الشحنة' : 'View Live Tracking', actionType: 'view_shp', payload: 'shp-001' },
      ],
    },
  ]);

  if (!isAiCopilotOpen) return null;

  const handleSend = (text?: string) => {
    const q = text || inputQuery;
    if (!q.trim()) return;

    let response: CopilotResponse;

    if (q.includes('فارغة') || q.includes('عودة') || q.toLowerCase().includes('backhaul') || q.toLowerCase().includes('empty')) {
      response = {
        query: q,
        insight:
          lang === 'ar'
            ? `توجد ${backhauls.length} شاحنات عائدة فارغة اليوم (بورتسودان، عطبرة، الخرطوم) جاهزة للتحميل الفوري.`
            : `Found ${backhauls.length} empty backhaul assets available today (Port Sudan, Atbara, Khartoum).`,
        cause:
          lang === 'ar'
            ? 'اكتمال تفريغ شحنات واردات الميناء وتوفر شاحنة مسطحة 35 طن (PSD-6029-FLAT) في بورتسودان.'
            : 'Completed port container import deliveries leaving 35T flatbed (PSD-6029-FLAT) ready in Port Sudan.',
        impact:
          lang === 'ar'
            ? 'توفير 28% من تكلفة النقل للعميل وزيادة ربحية الناقل بمقدار 1,950,000 ج.س وخفض انبعاثات الكربون.'
            : '28% freight discount for shipper, +1,950,000 SDG carrier profit, and zero empty carbon waste.',
        recommendation:
          lang === 'ar'
            ? 'مطابقة شاحنة بورتسودان مع شحنة سكر كنانة #SDN-77312 أو بضائع الصادر العامة.'
            : 'Match Port Sudan asset with Kenana Sugar #SDN-77312 or general export cargo.',
        actions: [
          { label: lang === 'ar' ? 'فتح بورصة الشحن' : 'Open Marketplace', actionType: 'open_marketplace' },
          { label: lang === 'ar' ? 'التوزيع الآلي للشحنة' : 'Auto-Dispatch Match', actionType: 'open_dispatch' },
        ],
      };
    } else if (q.includes('SDN-77312') || q.includes('كنانة') || q.toLowerCase().includes('kenana')) {
      response = {
        query: q,
        insight:
          lang === 'ar'
            ? 'أفضل مركبة مطابقة لشحنة كنانة #SDN-77312 هي شاحنة البحر الأحمر (PSD-6029-FLAT) بنسبة توافق 98%.'
            : 'Best match for Kenana Sugar #SDN-77312 is Red Sea Freight Flatbed (PSD-6029-FLAT) at 98% AI Match.',
        cause:
          lang === 'ar'
            ? 'تواجد الشاحنة في بورتسودان بجوار مسار التحميل، سعة 35 طن، وسجل ثقة 94/100 مع تسليم في الموعد 96.5%.'
            : 'Truck located at Port Sudan corridor, 35T payload fit, Trust score 94/100, 96.5% historical OTD.',
        impact:
          lang === 'ar'
            ? 'توفير 820,000 ج.س على العميل مقارنة بالشاحنات المخصصة من الخرطوم.'
            : 'Saves 820,000 SDG for shipper versus deadheading dedicated trucks from Khartoum.',
        recommendation:
          lang === 'ar'
            ? 'تثبيت التعيين وإرسال إشعار القبول للسائق محمود إدريس.'
            : 'Confirm match and dispatch digital load manifest to driver Mahmoud Idris.',
        actions: [
          { label: lang === 'ar' ? 'اعتماد وتعيين الشاحنة' : 'Confirm Assignment', actionType: 'open_dispatch' },
        ],
      };
    } else {
      response = {
        query: q,
        insight:
          lang === 'ar'
            ? 'شبكة سودانيل اللوجستية تعمل بكفاءة 96.2% عبر الممرات الوطنية والدولية.'
            : 'Sudaneel logistics operating network functioning at 96.2% multi-corridor efficiency.',
        cause:
          lang === 'ar'
            ? 'انتظام تدفق الشاحنات على طريق التحدي واستقرار درجات حرارة الحاويات المبردة.'
            : 'Stable highway velocity on Al-Tahaddi corridor and 100% active telemetry on cold-chain reefers.',
        impact:
          lang === 'ar'
            ? 'معدل التسليم في الوقت المحدد (OTD) 97.4% خلال الـ 24 ساعة الماضية.'
            : 'On-Time Delivery rate sustained at 97.4% over the last 24-hour cycle.',
        recommendation:
          lang === 'ar'
            ? 'تفعيل عروض الخصم التنافسية للرحلات العائدة لتحفيز حجوزات المصدرين.'
            : 'Activate dynamic backhaul promotions to capture high-volume export shippers.',
        actions: [
          { label: lang === 'ar' ? 'عرض مركز العمليات' : 'Open Control Tower', actionType: 'open_control_tower' },
        ],
      };
    }

    setConversation((prev) => [...prev, response]);
    setInputQuery('');
  };

  const handleAction = (actionType: string, payload?: any) => {
    if (actionType === 'view_shp' && payload) {
      setSelectedShipmentId(payload);
      setCurrentView('tracking_detail');
      setIsAiCopilotOpen(false);
    } else if (actionType === 'open_marketplace') {
      setCurrentView('marketplace');
      setIsAiCopilotOpen(false);
    } else if (actionType === 'open_dispatch') {
      setCurrentView('smart_dispatch');
      setIsAiCopilotOpen(false);
    } else if (actionType === 'open_control_tower') {
      setCurrentView('control_tower');
      setIsAiCopilotOpen(false);
    } else {
      alert(lang === 'ar' ? 'تم تنفيذ الإجراء بنجاح وإرسال الإشعار الرقمي' : 'Action executed and digital notification dispatched');
    }
  };

  return (
    <div className="fixed inset-y-0 end-0 z-50 w-full sm:w-[460px] bg-navy-950/95 backdrop-blur-2xl border-s border-gold/30 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-gold/20 flex items-center justify-between bg-gradient-to-r from-navy-900 via-navy-900 to-navy-950">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold/30 to-amber-500/20 border border-gold/50 flex items-center justify-center">
            <Bot className="w-5 h-5 text-gold" />
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              <span>Sudaneel AI Copilot</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                Active
              </span>
            </div>
            <div className="text-[11px] text-gray-400">Logistics Decision Intelligence</div>
          </div>
        </div>
        <button
          onClick={() => setIsAiCopilotOpen(false)}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-navy-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 bg-navy-900/60 border-b border-gold/10 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => handleSend(lang === 'ar' ? 'ما المركبات التي تعود فارغة؟' : 'What vehicles are returning empty?')}
          className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-[11px] text-gold border border-gold/20 whitespace-nowrap cursor-pointer"
        >
          🔄 {lang === 'ar' ? 'الرحلات العائدة (Backhaul)' : 'Empty Backhaul'}
        </button>
        <button
          onClick={() => handleSend(lang === 'ar' ? 'أعطني أفضل مركبة لشحنة سكر كنانة SDN-77312' : 'Best match for Kenana Sugar SDN-77312')}
          className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-[11px] text-amber-300 border border-amber-500/20 whitespace-nowrap cursor-pointer"
        >
          ⚡ {lang === 'ar' ? 'مطابقة شحنة كنانة' : 'Kenana Match'}
        </button>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {conversation.map((msg, idx) => (
          <div key={idx} className="space-y-3">
            {/* User Query Bubble */}
            <div className="flex items-start gap-2.5 justify-end">
              <div className="max-w-[85%] p-3 rounded-2xl rounded-tr-none bg-gold/15 border border-gold/30 text-white text-xs sm:text-sm font-medium">
                {msg.query}
              </div>
            </div>

            {/* AI Structured Response */}
            <div className="p-4 rounded-2xl bg-navy-900/90 border border-gold/25 space-y-3 shadow-lg">
              {/* Insight */}
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-gold tracking-wider">Insight</div>
                  <div className="text-xs sm:text-sm text-gray-100 font-semibold">{msg.insight}</div>
                </div>
              </div>

              {/* Cause & Impact Grid */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gold/10 text-xs">
                <div className="p-2 rounded-lg bg-navy-950/60 border border-navy-800">
                  <span className="font-bold text-gray-400 text-[10px] uppercase block">Cause / السبب:</span>
                  <span className="text-gray-300 text-[11px]">{msg.cause}</span>
                </div>
                <div className="p-2 rounded-lg bg-navy-950/60 border border-navy-800">
                  <span className="font-bold text-emerald-400 text-[10px] uppercase block">Business Impact / الأثر:</span>
                  <span className="text-gray-300 text-[11px]">{msg.impact}</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                <span className="font-bold text-amber-400 text-[10px] uppercase block mb-1">AI Recommendation:</span>
                {msg.recommendation}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {msg.actions.map((act, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => handleAction(act.actionType, act.payload)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-gold/30 to-amber-500/30 hover:from-gold/50 hover:to-amber-500/50 border border-gold/40 text-gold text-xs font-semibold shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Zap className="w-3 h-3 text-gold" />
                    <span>{act.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-gold/20 bg-navy-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'اسأل المساعد اللوجستي الذكي...' : 'Ask AI Copilot anything...'}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-navy-900 border border-gold/20 text-white placeholder-gray-400 text-xs sm:text-sm outline-none focus:border-gold transition-colors"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-navy-950 font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
