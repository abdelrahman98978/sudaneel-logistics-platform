'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { NegotiationOffer } from '@/types';
import {
  Repeat,
  MapPin,
  Leaf,
  Clock,
  DollarSign,
  Package,
  Sparkles,
  ArrowRight,
  TrendingDown,
  X,
  CheckCircle2,
} from 'lucide-react';

export function MarketplaceView() {
  const {
    shipments,
    backhauls,
    negotiationOffers,
    counterNegotiationOffer,
    acceptNegotiationOffer,
    showToast,
    t,
    lang,
    setCurrentView,
    setSelectedShipmentId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all_loads' | 'backhaul_deals' | 'negotiations'>('all_loads');
  const [filterOrigin, setFilterOrigin] = useState<string>('all');
  const [filterDestination, setFilterDestination] = useState<string>('all');

  // Counteroffer modal state
  const [selectedOffer, setSelectedOffer] = useState<NegotiationOffer | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState<number>(3000000);

  const openShipments = shipments.filter(
    (s) => s.status === 'awaiting_carrier' || s.status === 'confirmed' || s.status === 'in_transit'
  );

  const filteredShipments = openShipments.filter((s) => {
    if (filterOrigin !== 'all' && !s.origin.city.toLowerCase().includes(filterOrigin.toLowerCase())) return false;
    if (filterDestination !== 'all' && !s.destination.city.toLowerCase().includes(filterDestination.toLowerCase())) return false;
    return true;
  });

  const handleOpenNegotiation = (offer: NegotiationOffer) => {
    setSelectedOffer(offer);
    setCounterPriceInput(offer.customerCounterPrice || Math.round(offer.carrierOfferPrice * 0.92));
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;
    counterNegotiationOffer(selectedOffer.id, counterPriceInput);
    showToast(
      lang === 'ar' ? 'تم إرسال العرض المضاد' : 'Counteroffer Dispatched',
      lang === 'ar'
        ? `تم إرسال العرض المضاد بقيمة ${counterPriceInput.toLocaleString()} SDG للناقل بنجاح!`
        : `Counteroffer of ${counterPriceInput.toLocaleString()} SDG dispatched to carrier!`,
      'success'
    );
    setSelectedOffer(null);
  };

  return (
    <div className="space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Banner */}
      <div className="p-8 shopify-card bg-[#ffffff] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="shopify-tag-mint">
            <Repeat className="w-4 h-4" />
            <span>Digital Freight Exchange • بورصة الشحن الذكية</span>
          </div>
          <h1 className="text-[26px] font-[500] text-[#000000] tracking-tight">
            {t.marketplace} (Freight Exchange & Backhaul)
          </h1>
          <p className="text-[14px] text-[#71717a] font-[420] leading-relaxed">
            {lang === 'ar'
              ? 'سوق فوري للناقلين والشاحنين مع خصومات رحلات العودة (Backhaul) بنسبة تصل إلى 25% وخفض الكيلومترات الفارغة.'
              : 'Spot freight exchange connecting enterprise shippers with verified fleet operators. Maximize truck utilization.'}
          </p>
        </div>

        {/* Pill Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all_loads', label: 'جميع الحمولات المفتوحة', count: openShipments.length },
            { id: 'backhaul_deals', label: 'عروض الرجوع (Backhaul)', count: backhauls.length },
            { id: 'negotiations', label: 'التفاوض والعروض المضادة', count: negotiationOffers.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-[13px] font-[500] transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-[#fbfbf5] text-[#71717a] hover:text-[#000000] border border-[#e4e4e7]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="font-mono text-[11px] opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Backhaul Spotlight Banner (Shopify Pistachio Band Style) */}
      <div className="shopify-card-pistachio p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="shopify-tag-mint !text-[11px]">
              AI Route Matching Engine
            </span>
          </div>
          <h2 className="text-[20px] font-[600] text-[#000000]">
            وفر حتى 25% عبر مطابقة الشاحنات العائدة من بورتسودان
          </h2>
          <p className="text-[13.5px] text-[#000000]/80 leading-relaxed font-[420]">
            تقوم خوارزمياتنا بربط بضائع الصادر من الخرطوم والولايات بالشاحنات الفارغة العائدة بعد تفريغ واردات الميناء، مما يقلل الانبعاثات ويرفع دخل الناقلين.
          </p>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="p-3.5 rounded-[12px] bg-white/70 border border-[#000000]/10">
            <div className="font-mono text-[20px] font-[700] text-[#000000]">-25%</div>
            <div className="text-[11px] text-[#000000]/70 font-[500]">خصم الشحن</div>
          </div>
          <div className="p-3.5 rounded-[12px] bg-white/70 border border-[#000000]/10">
            <div className="font-mono text-[20px] font-[700] text-[#000000]">0 km</div>
            <div className="text-[11px] text-[#000000]/70 font-[500]">مسار فارغ</div>
          </div>
        </div>
      </div>

      {/* TAB 1: ALL OPEN LOADS */}
      {activeTab === 'all_loads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShipments.map((s) => (
            <div
              key={s.id}
              className="shopify-card p-6 space-y-4 hover:border-[#a1a1aa] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
                  <span className="font-mono font-[700] text-[15px] text-[#000000]">{s.trackingNumber}</span>
                  <span className={s.status === 'in_transit' ? 'shopify-tag-mint' : 'shopify-tag-pistachio'}>
                    {s.status}
                  </span>
                </div>

                <div className="space-y-2 text-[13px] text-[#000000]">
                  <div className="flex items-center gap-2 font-[600]">
                    <span>{s.origin.city}</span>
                    <span className="text-[#71717a]">➔</span>
                    <span>{s.destination.city}</span>
                  </div>
                  <div className="text-[#71717a] text-[12px]">{s.cargoType} • {(s.totalWeightKg / 1000).toFixed(1)} طن</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#71717a]">التعرفة المتفق عليها:</span>
                    <span className="font-mono font-[700] text-[16px] text-[#000000]">{s.price.toLocaleString()} SDG</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedShipmentId(s.id);
                    setCurrentView('tracking_detail');
                  }}
                  className="w-full btn-shopify-pill !py-2 text-[12.5px]"
                >
                  <span>عرض التفاصيل وحجز الحمولة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BACKHAUL DEALS */}
      {activeTab === 'backhaul_deals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {backhauls.map((b) => (
            <div key={b.id} className="shopify-card p-6 space-y-4 hover:border-[#a1a1aa] transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
                  <span className="shopify-tag-mint !text-[11px]">Backhaul Deal • خصم الرجوع</span>
                  <span className="font-mono font-[700] text-[14px] text-[#000000]">-{b.discountPercent}%</span>
                </div>

                <div className="space-y-2 text-[13px] text-[#000000]">
                  <div className="font-[600]">{b.currentCity} ➔ {b.targetCity}</div>
                  <div className="text-[12px] text-[#71717a]">الناقل: {b.carrierName} ({b.availableCapacityTons} طن متاح)</div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#71717a]">توفير التكلفة المتوقع:</span>
                    <span className="font-mono font-[700] text-[16px] text-[#000000]">{b.expectedProfitIncrease.toLocaleString()} SDG</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => showToast('تم حجز العرض', `تم حجز رحلة الرجوع من ${b.currentCity} إلى ${b.targetCity} بسعر مخفض!`, 'success')}
                  className="w-full btn-shopify-pill !py-2 text-[12.5px]"
                >
                  <span>تأكيد الحجز بالخصم الفوري</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counteroffer Negotiation Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#ffffff] border border-[#e4e4e7] rounded-[20px] p-6 space-y-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e4e7]">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#000000]" />
                <h3 className="text-[16px] font-[600] text-[#000000]">تقديم عرض سعر مضاد (Counteroffer)</h3>
              </div>
              <button onClick={() => setSelectedOffer(null)} className="p-1 rounded-full hover:bg-[#fbfbf5] text-[#71717a]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendCounter} className="space-y-4 text-[13px]">
              <div className="p-4 rounded-[12px] bg-[#fbfbf5] border border-[#e4e4e7] space-y-1">
                <div className="flex justify-between text-[#71717a]">
                  <span>رقم الشحنة:</span>
                  <span className="font-mono text-[#000000] font-[600]">{selectedOffer.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-[#71717a]">
                  <span>سعر الناقل الأولي:</span>
                  <span className="font-mono text-[#000000] font-[600]">{selectedOffer.carrierOfferPrice.toLocaleString()} SDG</span>
                </div>
              </div>

              <div>
                <label className="text-[#71717a] block mb-1 font-[500]">سعرك المقترح المستهدف (SDG)</label>
                <input
                  type="number"
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(Number(e.target.value))}
                  className="w-full bg-[#fbfbf5] border border-[#e4e4e7] text-[#000000] font-[600] p-2.5 rounded-[8px] outline-none font-mono text-[14px] focus:border-[#000000]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="btn-shopify-outline flex-1"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn-shopify-pill flex-1"
                >
                  إرسال العرض المضاد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
