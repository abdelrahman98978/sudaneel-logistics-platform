'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import {
  Bot,
  Send,
  X,
  Zap,
  Sparkles,
  ArrowRight,
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
    showToast,
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
            : 'Optimal matched carrier for Kenana Sugar #SDN-77312 is Red Sea Heavy Trailer (PSD-6029-FLAT) with 98% score.',
        cause:
          lang === 'ar'
            ? 'موقع الشاحنة يبعد 4 كم فقط عن مستودع سنار مع توفر شهادة فحص سلامة سارية.'
            : 'Vehicle located 4 km from Sennar hub with valid cold-chain / bulk integrity certificate.',
        impact:
          lang === 'ar'
            ? 'بدء التحميل خلال 30 دقيقة بدلاً من الانتظار 6 ساعات مع توفير 180,000 ج.س.'
            : 'Loading starts in 30 mins instead of 6h delay, saving 180,000 SDG in idling costs.',
        recommendation:
          lang === 'ar'
            ? 'اعتماد التكليف الآلي وإصدار بوليصة الشحن الرقمية فوراً.'
            : 'Approve instant dispatch and generate blockchain digital consignment passport.',
        actions: [
          { label: lang === 'ar' ? 'اعتماد وإصدار البوليصة' : 'Confirm & Issue Waybill', actionType: 'assign_shp', payload: 'SDN-77312' },
          { label: lang === 'ar' ? 'عرض تفاصيل الشحنة' : 'View Details', actionType: 'view_shp', payload: 'shp-002' },
        ],
      };
    } else {
      response = {
        query: q,
        insight:
          lang === 'ar'
            ? `تم تحليل الاستفسار: "${q}". جميع المؤشرات التشغيلية على الممرات الرئيسية تعمل بكفاءة 99.4%.`
            : `Analyzed query: "${q}". Operational throughput on primary corridors is optimal at 99.4%.`,
        cause:
          lang === 'ar'
            ? 'استقرار تدفق القوافل اللوجستية وتوفر طاقة استيعابية كافية في محطة بورتسودان وسنار.'
            : 'Smooth convoy telemetry and adequate berth capacity at Port Sudan SCT terminal.',
        impact:
          lang === 'ar'
            ? 'زمن العبور بين الخرطوم وبورتسودان مستقر عند 14.5 ساعة بدون اختناقات.'
            : 'Average transit time stable at 14.5h without severe chokepoints.',
        recommendation:
          lang === 'ar'
            ? 'المتابعة عبر برج المراقبة وتفعيل التنبيهات الآلية لأي طارئ.'
            : 'Monitor via Live Control Tower with automated sensor anomaly detection.',
        actions: [
          { label: lang === 'ar' ? 'فتح برج المراقبة' : 'Open Control Tower', actionType: 'open_tower' },
          { label: lang === 'ar' ? 'فحص الأسطول' : 'Check Fleet', actionType: 'open_fleet' },
        ],
      };
    }

    setConversation((prev) => [...prev, response]);
    setInputQuery('');
  };

  const handleAction = (type: string, payload?: any) => {
    if (type === 'notify_cust') {
      showToast(
        lang === 'ar' ? 'تم إرسال الإشعار' : 'Customer Notified',
        lang === 'ar' ? 'تم إرسال رسالة SMS ورابط التتبع المباشر لمدير المستودع لدى العميل.' : 'Sent proactive SMS alert and live digital passport link to customer.',
        'success'
      );
    } else if (type === 'view_shp') {
      if (payload) setSelectedShipmentId(payload);
      setCurrentView('tracking_detail');
      setIsAiCopilotOpen(false);
    } else if (type === 'open_marketplace') {
      setCurrentView('marketplace');
      setIsAiCopilotOpen(false);
    } else if (type === 'open_dispatch') {
      setCurrentView('smart_dispatch');
      setIsAiCopilotOpen(false);
    } else if (type === 'assign_shp') {
      showToast(
        lang === 'ar' ? 'تم التكليف بنجاح' : 'Dispatch Confirmed',
        lang === 'ar' ? `تم تكليف الشاحنة بنجاح بالشحنة ${payload} وتحديث الجدول التشغيلي.` : `Assigned vehicle to shipment ${payload} successfully.`,
        'success'
      );
      setCurrentView('shipments');
      setIsAiCopilotOpen(false);
    } else if (type === 'open_tower') {
      setCurrentView('control_tower');
      setIsAiCopilotOpen(false);
    } else if (type === 'open_fleet') {
      setCurrentView('fleet');
      setIsAiCopilotOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-y-0 end-0 z-50 w-full max-w-md bg-[#ffffff] border-s border-[#e4e4e7] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col animate-in slide-in-from-right duration-200 shopify-theme"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Drawer Header */}
      <div className="h-16 border-b border-[#e4e4e7] px-5 flex items-center justify-between bg-[#ffffff]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#c1fbd4] flex items-center justify-center text-[#000000]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-[600] text-[15px] text-[#000000]">
              {lang === 'ar' ? 'المساعد الذكي (AI Copilot)' : 'AI Operations Copilot'}
            </h3>
            <p className="text-[11px] text-[#71717a] font-[420]">
              {lang === 'ar' ? 'محرك التوصيات والقرارات الاستباقية' : 'Proactive Operations Intelligence'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAiCopilotOpen(false)}
          className="p-1.5 rounded-full hover:bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts (Shopify Pill Tabs) */}
      <div className="p-3 border-b border-[#e4e4e7] bg-[#fbfbf5] flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => handleSend(lang === 'ar' ? 'ما الشحنات المعرضة للتأخير اليوم؟' : 'Which shipments are delayed today?')}
          className="px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#e4e4e7] text-[12px] text-[#000000] font-[500] whitespace-nowrap hover:bg-[#c1fbd4] transition-colors cursor-pointer shadow-sm"
        >
          {lang === 'ar' ? 'الشحنات المعرضة للتأخير' : 'Delayed Shipments'}
        </button>
        <button
          onClick={() => handleSend(lang === 'ar' ? 'أظهر لي الشاحنات العائدة الفارغة' : 'Show empty backhaul trucks')}
          className="px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#e4e4e7] text-[12px] text-[#000000] font-[500] whitespace-nowrap hover:bg-[#c1fbd4] transition-colors cursor-pointer shadow-sm"
        >
          {lang === 'ar' ? 'الشاحنات الفارغة' : 'Empty Backhauls'}
        </button>
        <button
          onClick={() => handleSend(lang === 'ar' ? 'أعطني أفضل مركبة لشحنة سكر كنانة SDN-77312' : 'Best match for Kenana Sugar SDN-77312')}
          className="px-3.5 py-1.5 rounded-full bg-[#ffffff] border border-[#e4e4e7] text-[12px] text-[#000000] font-[500] whitespace-nowrap hover:bg-[#c1fbd4] transition-colors cursor-pointer shadow-sm"
        >
          {lang === 'ar' ? 'مطابقة شحنة كنانة' : 'Kenana Match'}
        </button>
      </div>

      {/* Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#ffffff]">
        {conversation.map((msg, idx) => (
          <div key={idx} className="space-y-3">
            {/* User Query Bubble */}
            <div className="flex items-start gap-2 justify-end">
              <div className="max-w-[85%] p-3.5 rounded-[16px] bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] text-[13.5px] font-[420]">
                {msg.query}
              </div>
            </div>

            {/* AI Structured Response */}
            <div className="shopify-card p-5 space-y-3 bg-[#ffffff] border border-[#e4e4e7]">
              {/* Insight */}
              <div className="space-y-1">
                <div className="shopify-tag-mint !text-[10px]">
                  <Sparkles className="w-3 h-3" />
                  <span>Insight</span>
                </div>
                <div className="text-[14px] text-[#000000] font-[600] leading-snug pt-1">{msg.insight}</div>
              </div>

              {/* Cause & Impact Grid */}
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-[#e4e4e7] text-[12.5px]">
                <div className="p-2.5 rounded-[8px] bg-[#fbfbf5] border border-[#e4e4e7]">
                  <span className="font-[600] text-[#71717a] text-[11px] block mb-0.5">Cause / السبب:</span>
                  <span className="text-[#000000]">{msg.cause}</span>
                </div>
                <div className="p-2.5 rounded-[8px] bg-[#fbfbf5] border border-[#e4e4e7]">
                  <span className="font-[600] text-[#71717a] text-[11px] block mb-0.5">Business Impact / الأثر:</span>
                  <span className="text-[#000000]">{msg.impact}</span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3 rounded-[8px] bg-[#c1fbd4] border border-[#a8f5c2] text-[12.5px] text-[#000000]">
                <span className="font-[700] text-[#000000] text-[11px] block mb-0.5">Recommendation / التوصية:</span>
                {msg.recommendation}
              </div>

              {/* Action Buttons (Shopify Pill Buttons) */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {msg.actions.map((act, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => handleAction(act.actionType, act.payload)}
                    className={aIdx === 0 ? 'btn-shopify-pill !py-1.5 !px-4 !text-[12px]' : 'btn-shopify-outline !py-1.5 !px-4 !text-[12px]'}
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
      <div className="p-3 border-t border-[#e4e4e7] bg-[#ffffff]">
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
            className="flex-1 px-4 py-2.5 rounded-full bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] placeholder-[#71717a] text-[13.5px] outline-none focus:border-[#000000]"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#000000] text-white hover:bg-[#3f3f46] flex items-center justify-center transition-colors duration-200 cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
