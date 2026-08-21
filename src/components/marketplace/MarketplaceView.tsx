'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Shipment, BackhaulOpportunity } from '@/types';
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
} from 'lucide-react';

export function MarketplaceView() {
  const {
    shipments,
    backhauls,
    t,
    lang,
    setCurrentView,
    setSelectedShipmentId,
    carriers,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all_loads' | 'backhaul_deals' | 'my_bids'>('all_loads');
  const [filterOrigin, setFilterOrigin] = useState<string>('all');
  const [filterDestination, setFilterDestination] = useState<string>('all');
  const [sortCriteria, setSortCriteria] = useState<'best' | 'cheap' | 'fast' | 'trust' | 'green'>('best');
  const [bidModalShipment, setBidModalShipment] = useState<Shipment | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');

  const openShipments = shipments.filter(
    (s) => s.status === 'awaiting_carrier' || s.status === 'confirmed' || s.status === 'in_transit'
  );

  const filteredShipments = openShipments.filter((s) => {
    if (filterOrigin !== 'all' && !s.origin.city.toLowerCase().includes(filterOrigin.toLowerCase())) return false;
    if (filterDestination !== 'all' && !s.destination.city.toLowerCase().includes(filterDestination.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-5">
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
                : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'عروض الشاحنات العائدة' : 'Empty Return Deals'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 text-white text-[10px] font-mono">
              {backhauls.length}
            </span>
          </button>
        </div>

        {/* Sort criteria */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">{lang === 'ar' ? 'الترتيب الذكي:' : 'AI Sort:'}</span>
          <div className="flex items-center gap-1 bg-navy-900/80 p-1 rounded-xl border border-gold/20 text-xs">
            <button
              onClick={() => setSortCriteria('best')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortCriteria === 'best' ? 'bg-gold/20 text-gold border border-gold/30 font-bold' : 'text-gray-400'
              }`}
            >
              {t.bestMatch}
            </button>
            <button
              onClick={() => setSortCriteria('cheap')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortCriteria === 'cheap' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-gray-400'
              }`}
            >
              {t.cheapest}
            </button>
            <button
              onClick={() => setSortCriteria('trust')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                sortCriteria === 'trust' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-gray-400'
              }`}
            >
              {t.mostReliable}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      {activeTab === 'backhaul_deals' ? (
        /* Empty Truck Backhaul Opportunities Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {backhauls.map((bh) => (
            <div
              key={bh.id}
              className="p-4 rounded-2xl bg-gradient-to-b from-navy-900/90 to-navy-950 border border-emerald-500/40 shadow-xl space-y-4 relative group hover:border-emerald-400 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider font-mono">
                    Backhaul Score: {bh.backhaulScore}%
                  </span>
                  <h3 className="font-bold text-base text-white mt-1.5 flex items-center gap-1.5">
                    <span>{bh.currentCity}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                    <span>{bh.targetCity}</span>
                  </h3>
                  <div className="text-xs text-gray-400">{bh.carrierName}</div>
                </div>

                <div className="text-end">
                  <div className="text-sm font-bold text-emerald-400 font-mono">-{bh.discountPercent}% Discount</div>
                  <div className="text-[10px] text-gray-400">{bh.detourDistanceKm} km detour</div>
                </div>
              </div>

              {/* Asset Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Truck Plate:</span>
                  <span className="font-bold text-white font-mono">{bh.vehiclePlate}</span>
                </div>
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Available Payload:</span>
                  <span className="font-bold text-gold font-mono">{bh.availableCapacityTons} Tons</span>
                </div>
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Ready Date:</span>
                  <span className="font-semibold text-gray-200">{bh.availableDate}</span>
                </div>
                <div className="p-2 rounded-xl bg-navy-950/80 border border-navy-800">
                  <span className="text-[10px] text-gray-400 block">Carrier Added Profit:</span>
                  <span className="font-semibold text-emerald-400 font-mono">+{bh.expectedProfitIncrease.toLocaleString()} SDG</span>
                </div>
              </div>

              {/* Instant Match CTA */}
              <button
                onClick={() => setCurrentView('smart_dispatch')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-navy-950 font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{lang === 'ar' ? 'حجز الشاحنة العائدة للشحنة' : 'Book Empty Asset for Load'}</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Standard Marketplace Loads */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShipments.map((shp) => (
            <div
              key={shp.id}
              className="p-4 rounded-2xl bg-navy-900/90 border border-gold/20 shadow-xl space-y-4 hover:border-gold/40 transition-all flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-gold text-sm">{shp.trackingNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-gray-300 border border-navy-700 font-mono">
                      {shp.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">
                    {shp.origin.city} ➔ {shp.destination.city}
                  </h4>
                  <div className="text-xs text-gray-400">{shp.customerNameAr || shp.customerName}</div>
                </div>

                <div className="text-end">
                  <div className="text-base font-bold text-white font-mono">
                    {shp.price.toLocaleString()} <span className="text-xs text-gold">{shp.currency}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">{shp.distanceKm} km</div>
                </div>
              </div>

              {/* Cargo Details */}
              <div className="p-3 rounded-xl bg-navy-950/80 border border-navy-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-gray-400">Cargo / البضاعة:</span>
                  <span className="font-semibold text-white truncate max-w-[180px]">{shp.cargoDescription}</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-gray-400">Weight & Vol:</span>
                  <span className="font-mono text-gold">{(shp.totalWeightKg / 1000).toFixed(1)} Tons ({shp.totalVolumeM3} m³)</span>
                </div>
                <div className="flex items-center justify-between text-gray-300">
                  <span className="text-gray-400">Required Fleet:</span>
                  <span className="font-semibold text-sky-400">{shp.requiredVehicleType}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-gold/10">
                <button
                  onClick={() => {
                    setSelectedShipmentId(shp.id);
                    setCurrentView('tracking_detail');
                  }}
                  className="flex-1 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-200 text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  {t.viewPassport}
                </button>
                <button
                  onClick={() => {
                    setBidModalShipment(shp);
                    setBidAmount(String(shp.price));
                  }}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 text-xs font-bold transition-all shadow cursor-pointer text-center"
                >
                  {lang === 'ar' ? 'تقديم عرض / تفاوض' : 'Bid / Negotiate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Negotiation / Bid Modal */}
      {bidModalShipment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-navy-900 border border-gold/40 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gold/20">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-gold" />
                <span>{lang === 'ar' ? 'تقديم عرض سعر للشحنة' : 'Submit Freight Offer / Bid'}</span>
              </h3>
              <button
                onClick={() => setBidModalShipment(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-300 space-y-1 bg-navy-950/80 p-3 rounded-xl border border-navy-800">
              <div>
                <strong>Shipment:</strong> {bidModalShipment.trackingNumber} ({bidModalShipment.origin.city} ➔ {bidModalShipment.destination.city})
              </div>
              <div>
                <strong>Original Target Price:</strong> {bidModalShipment.price.toLocaleString()} SDG
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-200 block">
                {lang === 'ar' ? 'مبلغ العرض المقترح (ج.س):' : 'Proposed Bid Amount (SDG):'}
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-gold/30 text-white font-mono text-sm outline-none focus:border-gold"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setBidModalShipment(null)}
                className="flex-1 py-2.5 rounded-xl bg-navy-800 text-gray-300 text-xs font-semibold hover:bg-navy-700 cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  alert(lang === 'ar' ? 'تم إرسال عرضك بنجاح للعميل!' : 'Your bid was sent to the shipper!');
                  setBidModalShipment(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-navy-950 text-xs font-bold shadow-lg hover:brightness-110 cursor-pointer"
              >
                {lang === 'ar' ? 'تأكيد إرسال العرض' : 'Submit Offer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
