'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Shipment, BackhaulOpportunity, NegotiationOffer } from '@/types';
import {
  Repeat,
  Filter,
  Search,
  Truck,
  TrendingDown,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Leaf,
  Layers,
  Award,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';

export function MarketplaceView() {
  const {
    shipments,
    backhauls,
    negotiationOffers,
    counterNegotiationOffer,
    acceptNegotiationOffer,
    t,
    lang,
    setCurrentView,
    setSelectedShipmentId,
    carriers,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all_loads' | 'backhaul_deals' | 'negotiations'>('all_loads');
  const [filterOrigin, setFilterOrigin] = useState<string>('all');
  const [filterDestination, setFilterDestination] = useState<string>('all');
  const [sortCriteria, setSortCriteria] = useState<'best' | 'cheap' | 'fast' | 'trust' | 'green'>('best');

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
    alert(
      lang === 'ar'
        ? `تم إرسال العرض المضاد بقيمة ${counterPriceInput.toLocaleString()} ج.س للناقل بنجاح!`
        : `Counteroffer of ${counterPriceInput.toLocaleString()} SDG dispatched to carrier!`
    );
    setSelectedOffer(null);
  };

  const handleAcceptOffer = (offerId: string) => {
    acceptNegotiationOffer(offerId);
    alert(
      lang === 'ar'
        ? 'تم قبول عرض الناقل وتثبيت السعر! تم توجيه الشحنة للتحميل.'
        : 'Carrier rate offer accepted! Load dispatched for loading.'
    );
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner: Digital Freight Exchange + Backhaul High-Value Incentive */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 border border-gold/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gold/20 text-gold border border-gold/40">
              <Repeat className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'بورصة الشحن الذكية والرحلات العائدة (Backhaul Exchange)' : 'Digital Freight Exchange & Backhaul Network'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
            {lang === 'ar'
              ? 'اربط شحناتك مع أكثر من 300+ شاحنة معتمدة واستفد من خوارزميات الذكاء الاصطناعي لخفض 28% من التكلفة عبر الشاحنات العائدة فارغة.'
              : 'Match your cargo with 300+ verified carriers and leverage AI to cut up to 28% cost using returning empty freight assets.'}
          </p>
        </div>

        {/* Backhaul quick metric badge */}
        <div className="flex items-center gap-3 bg-emerald-950/80 border border-emerald-500/40 p-3 rounded-xl z-10">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-emerald-300 font-semibold">{t.backhaulMatches}</div>
            <div className="text-lg font-bold text-white font-mono">{backhauls.length} Active Deals</div>
          </div>
        </div>
      </div>

      {/* Tabs & Multi-factor Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-gold/15">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-navy-900/90 rounded-xl border border-gold/20">
          <button
            onClick={() => setActiveTab('all_loads')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all_loads' ? 'bg-gold text-navy-950 shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'جميع الشحنات المتاحة' : 'All Available Loads'} ({openShipments.length})
          </button>
          <button
            onClick={() => setActiveTab('backhaul_deals')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'backhaul_deals'
                ? 'bg-emerald-500 text-navy-950 shadow-md'
                : 'text-gray-400 hover:text-emerald-400'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'عروض الشاحنات العائدة' : 'Backhaul Deals'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 text-[10px]">
              {backhauls.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('negotiations')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'negotiations' ? 'bg-gold text-navy-950 shadow-md' : 'text-gray-400 hover:text-gold'
            }`}
          >
            <span>{lang === 'ar' ? 'التفاوض والعروض' : 'Live Negotiations'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-gold/20 text-gold text-[10px]">
              {negotiationOffers.length}
            </span>
          </button>
        </div>

        {/* Route Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterOrigin}
            onChange={(e) => setFilterOrigin(e.target.value)}
            className="bg-navy-900 border border-gold/20 text-xs text-gray-200 px-3 py-1.5 rounded-xl outline-none"
          >
            <option value="all">{lang === 'ar' ? 'كل مواقع التحميل' : 'All Origins'}</option>
            <option value="Khartoum">Khartoum</option>
            <option value="Port Sudan">Port Sudan</option>
            <option value="Wad Madani">Wad Madani</option>
            <option value="Gedaref">Gedaref</option>
          </select>

          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="bg-navy-900 border border-gold/20 text-xs text-gray-200 px-3 py-1.5 rounded-xl outline-none"
          >
            <option value="all">{lang === 'ar' ? 'كل الوجهات' : 'All Destinations'}</option>
            <option value="Port Sudan">Port Sudan</option>
            <option value="Khartoum">Khartoum</option>
            <option value="Atbara">Atbara</option>
            <option value="Kassala">Kassala</option>
          </select>
        </div>
      </div>

      {/* Tab 1: All Available Loads */}
      {activeTab === 'all_loads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShipments.map((shp) => (
            <div
              key={shp.id}
              className="p-5 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4 hover:border-gold/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-sm font-bold text-gold">{shp.trackingNumber}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{shp.customerNameAr || shp.customerName}</h3>
                    <p className="text-xs text-gray-400">{shp.cargoDescription}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-800 text-gray-300 font-mono">
                    {shp.status}
                  </span>
                </div>

                {/* Route specs */}
                <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{shp.origin.city} ➔ {shp.destination.city}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400 pt-1">
                    <span>Payload: {(shp.totalWeightKg / 1000).toFixed(1)} Tons</span>
                    <span>Distance: {shp.distanceKm} km</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gold/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">Freight Value</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {shp.price.toLocaleString()} {shp.currency}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedShipmentId(shp.id);
                      setCurrentView('tracking_detail');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-200 text-xs font-semibold"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => alert(`Bid submitted on ${shp.trackingNumber}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-gold text-navy-950 font-bold text-xs hover:brightness-110 shadow-lg cursor-pointer"
                  >
                    Bid / Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Backhaul Deals (Empty Returning Trucks) */}
      {activeTab === 'backhaul_deals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {backhauls.map((bh) => (
            <div
              key={bh.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-navy-900 to-navy-950 border border-emerald-500/40 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 uppercase font-bold">
                    Empty Backhaul Asset • {bh.vehiclePlate}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">
                    {bh.currentCity} ➔ {bh.targetCity}
                  </h3>
                  <p className="text-xs text-gray-400">{bh.carrierName} ({bh.driverName})</p>
                </div>

                <div className="text-end">
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    -{bh.discountPercent}% OFF
                  </span>
                  <span className="text-[10px] text-gray-400 block">Shipper Discount</span>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Available Payload</span>
                  <span className="font-bold text-gold font-mono">{bh.availableCapacityTons} Tons</span>
                </div>
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Backhaul Score</span>
                  <span className="font-bold text-emerald-400 font-mono">{bh.backhaulScore}/100</span>
                </div>
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Detour Buffer</span>
                  <span className="font-bold text-sky-400 font-mono">{bh.detourDistanceKm} km</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-emerald-500/20">
                <span className="text-xs text-emerald-300 flex items-center gap-1">
                  <Leaf className="w-4 h-4" /> Zero Empty Carbon Trip
                </span>
                <button
                  onClick={() => alert(`Matched returning asset ${bh.vehiclePlate} with cargo load!`)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:brightness-110 text-navy-950 font-bold text-xs shadow-lg cursor-pointer"
                >
                  Book Backhaul Truck
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Live Negotiations */}
      {activeTab === 'negotiations' && (
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2 pb-2 border-b border-gold/15">
            <Clock className="w-5 h-5 text-gold" />
            <span>Active Freight Quote Bids & Counteroffers</span>
          </h3>

          <div className="space-y-3">
            {negotiationOffers.map((neg) => (
              <div
                key={neg.id}
                className="p-4 rounded-2xl bg-navy-950 border border-gold/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{neg.trackingNumber}</span>
                    <span className="text-xs text-gold font-semibold">{neg.carrierName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-mono font-bold">
                      Trust {neg.carrierTrustScore}/100
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Original Rate: <span className="font-mono line-through">{neg.originalPrice.toLocaleString()} SDG</span> • Current Offer: <span className="font-mono text-emerald-400 font-bold">{neg.carrierOfferPrice.toLocaleString()} SDG</span>
                  </div>
                  {neg.customerCounterPrice && (
                    <div className="text-xs text-sky-300">
                      Shipper Counteroffer: <span className="font-mono font-bold">{neg.customerCounterPrice.toLocaleString()} SDG</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-end mr-3 hidden sm:block">
                    <span className="text-[10px] text-gray-400 block">Offer Expiry Timer</span>
                    <span className="text-xs font-mono font-bold text-amber-400">{neg.expiresInMinutes} mins left</span>
                  </div>

                  <button
                    onClick={() => handleOpenNegotiation(neg)}
                    className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gold border border-gold/30 text-xs font-bold cursor-pointer"
                  >
                    Counteroffer
                  </button>

                  <button
                    onClick={() => handleAcceptOffer(neg.id)}
                    disabled={neg.currentStatus === 'accepted'}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:brightness-110 text-navy-950 text-xs font-bold shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {neg.currentStatus === 'accepted' ? 'Accepted' : 'Accept Rate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Counteroffer Negotiation Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-900 border border-gold/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gold/15">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold" />
                <span>Submit Counteroffer Rate</span>
              </h3>
              <button onClick={() => setSelectedOffer(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSendCounter} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
                <div className="flex justify-between text-gray-400">
                  <span>Shipment Code:</span>
                  <span className="font-mono text-white">{selectedOffer.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Carrier Initial Offer:</span>
                  <span className="font-mono text-gold">{selectedOffer.carrierOfferPrice.toLocaleString()} SDG</span>
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Your Proposed Target Rate (SDG)</label>
                <input
                  type="number"
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(Number(e.target.value))}
                  className="w-full bg-navy-950 border border-gold/30 text-emerald-400 font-bold p-2.5 rounded-xl outline-none font-mono text-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="px-4 py-2 rounded-xl bg-navy-800 text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gold text-navy-950 font-bold hover:brightness-110 shadow-lg cursor-pointer"
                >
                  Send Counteroffer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
