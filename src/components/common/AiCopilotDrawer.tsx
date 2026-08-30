'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Bot,
  Send,
  X,
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
    lang,
    backhauls,
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
      alert(lang === 'ar' ? 'تم تنفيذ الإجراء بنجاح' : 'Action executed');
    }
  };

  return (
    <div className="fixed inset-y-0 end-0 z-50 w-full sm:w-[440px] bg-[#FFFFFF] border-s border-[#EEEEEE] flex flex-col animate-in slide-in-from-right duration-330">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#EEEEEE] flex items-center justify-between bg-[#FFFFFF]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[4px] bg-[#3E6AE1] flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="font-[500] text-[14px] text-[#171A20]">
              Sudaneel AI Copilot
            </div>
            <div className="text-[12px] text-[#8E8E8E]">Logistics Decision Intelligence</div>
          </div>
        </div>
        <button
          onClick={() => setIsAiCopilotOpen(false)}
          className="p-1.5 text-[#8E8E8E] hover:text-[#171A20] rounded-[4px] hover:bg-[#F4F4F4]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 bg-[#F4F4F4] border-b border-[#EEEEEE] flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => handleSend(lang === 'ar' ? 'ما المركبات التي تعود فارغة؟' : 'What vehicles are returning empty?')}
          className="px-3 py-1 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[12px] text-[#171A20] font-[400] whitespace-nowrap hover:bg-[#EEEEEE] transition-colors duration-330 cursor-pointer"
        >
          {lang === 'ar' ? 'الرحلات العائدة (Backhaul)' : 'Empty Backhaul'}
        </button>
        <button
          onClick={() => handleSend(lang === 'ar' ? 'أعطني أفضل مركبة لشحنة سكر كنانة SDN-77312' : 'Best match for Kenana Sugar SDN-77312')}
          className="px-3 py-1 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[12px] text-[#171A20] font-[400] whitespace-nowrap hover:bg-[#EEEEEE] transition-colors duration-330 cursor-pointer"
        >
          {lang === 'ar' ? 'مطابقة شحنة كنانة' : 'Kenana Match'}
        </button>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#FFFFFF]">
        {conversation.map((msg, idx) => (
          <div key={idx} className="space-y-3">
            {/* User Query Bubble */}
            <div className="flex items-start gap-2 justify-end">
              <div className="max-w-[85%] p-3 rounded-[4px] bg-[#F4F4F4] text-[#171A20] text-[14px] font-[400]">
                {msg.query}
              </div>
            </div>

            {/* AI Structured Response */}
            <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-3">
              {/* Insight */}
              <div className="space-y-1">
                <div className="text-[11px] font-[500] uppercase text-[#3E6AE1] tracking-wider">Insight</div>
                <div className="text-[14px] text-[#171A20] font-[500] leading-snug">{msg.insight}</div>
              </div>

              {/* Cause & Impact Grid */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-[#EEEEEE] text-[13px]">
                <div className="p-2 rounded-[4px] bg-[#F4F4F4]">
                  <span className="font-[500] text-[#5C5E62] text-[11px] block">Cause / السبب:</span>
                  <span className="text-[#393C41]">{msg.cause}</span>
                </div>
                <div className="p-2 rounded-[4px] bg-[#F4F4F4]">
                  <span className="font-[500] text-[#5C5E62] text-[11px] block">Business Impact / الأثر:</span>
                  <span className="text-[#393C41]">{msg.impact}</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-2.5 rounded-[4px] bg-[#F4F4F4] border-s-2 border-[#3E6AE1] text-[13px] text-[#171A20]">
                <span className="font-[500] text-[#171A20] text-[11px] block mb-0.5">Recommendation:</span>
                {msg.recommendation}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {msg.actions.map((act, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => handleAction(act.actionType, act.payload)}
                    className="btn-tesla-primary text-[13px] !min-h-[32px] !min-w-[120px] !py-1 !px-3"
                  >
                    <span>{act.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-[#EEEEEE] bg-[#FFFFFF]">
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
            placeholder={lang === 'ar' ? 'اسأل المساعد اللوجستي...' : 'Ask AI Copilot anything...'}
            className="flex-1 px-3 py-2 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] placeholder-[#8E8E8E] text-[14px] outline-none"
          />
          <button
            type="submit"
            className="p-2 rounded-[4px] bg-[#3E6AE1] text-white hover:bg-[#345ac2] transition-colors duration-330 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
