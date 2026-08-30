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
    <div className="space-y-6 font-sans text-[#171A20]">
      {/* Top Banner: Digital Freight Exchange */}
      <div className="p-6 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Repeat className="w-5 h-5 text-[#3E6AE1]" />
            <h2 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'بورصة الشحن الذكية والرحلات العائدة (Backhaul Exchange)' : 'Digital Freight Exchange & Backhaul Network'}
            </h2>
          </div>
          <p className="text-[14px] font-[400] text-[#5C5E62] max-w-2xl">
            {lang === 'ar'
              ? 'اربط شحناتك مع أكثر من 300+ شاحنة معتمدة واستفد من خوارزميات الذكاء الاصطناعي لخفض 28% من التكلفة عبر الشاحنات العائدة فارغة.'
              : 'Match your cargo with 300+ verified carriers and leverage AI to cut up to 28% cost using returning empty freight assets.'}
          </p>
        </div>

        {/* Backhaul quick metric badge */}
        <div className="flex items-center gap-3 bg-[#F4F4F4] border border-[#EEEEEE] p-3 rounded-[4px]">
          <div>
            <div className="text-[12px] text-[#5C5E62] font-[400]">{t.backhaulMatches}</div>
            <div className="text-[17px] font-[500] text-[#171A20] font-mono">{backhauls.length} Active Deals</div>
          </div>
        </div>
      </div>

      {/* Tabs & Multi-factor Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-[#EEEEEE]">
        {/* Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('all_loads')}
            className={`px-4 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 cursor-pointer ${
              activeTab === 'all_loads' ? 'bg-[#171A20] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4] font-[400]'
            }`}
          >
            {lang === 'ar' ? 'جميع الشحنات المتاحة' : 'All Available Loads'} ({openShipments.length})
          </button>
          <button
            onClick={() => setActiveTab('backhaul_deals')}
            className={`px-4 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'backhaul_deals'
                ? 'bg-[#3E6AE1] text-white font-[500]'
                : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4] font-[400]'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'عروض الشاحنات العائدة' : 'Backhaul Deals'}</span>
            <span className="px-1.5 py-0.2 rounded-[2px] bg-white/20 text-[10px]">
              {backhauls.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('negotiations')}
            className={`px-4 py-1.5 rounded-[4px] text-[13px] transition-colors duration-330 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'negotiations' ? 'bg-[#171A20] text-white font-[500]' : 'text-[#5C5E62] hover:text-[#171A20] hover:bg-[#F4F4F4] font-[400]'
            }`}
          >
            <span>{lang === 'ar' ? 'التفاوض والعروض' : 'Live Negotiations'}</span>
            <span className="px-1.5 py-0.2 rounded-[2px] bg-[#F4F4F4] text-[#171A20] text-[10px]">
              {negotiationOffers.length}
            </span>
          </button>
        </div>

        {/* Route Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterOrigin}
            onChange={(e) => setFilterOrigin(e.target.value)}
            className="bg-[#FFFFFF] border border-[#D0D1D2] text-[13px] text-[#171A20] px-3 py-1.5 rounded-[4px] outline-none"
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
            className="bg-[#FFFFFF] border border-[#D0D1D2] text-[13px] text-[#171A20] px-3 py-1.5 rounded-[4px] outline-none"
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
              className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[13px] font-[500] text-[#3E6AE1]">{shp.trackingNumber}</span>
                    <h3 className="text-[15px] font-[500] text-[#171A20] mt-0.5">{shp.customerNameAr || shp.customerName}</h3>
                    <p className="text-[13px] text-[#5C5E62]">{shp.cargoDescription}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#EEEEEE] font-mono">
                    {shp.status}
                  </span>
                </div>

                {/* Route specs */}
                <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-1.5 text-[13px]">
                  <div className="flex items-center gap-2 text-[#171A20]">
                    <MapPin className="w-4 h-4 text-[#3E6AE1] flex-shrink-0" />
                    <span>{shp.origin.city} ➔ {shp.destination.city}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#5C5E62] pt-1">
                    <span>Payload: {(shp.totalWeightKg / 1000).toFixed(1)} Tons</span>
                    <span>Distance: {shp.distanceKm} km</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EEEEEE] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#8E8E8E] block">Freight Value</span>
                  <span className="text-[15px] font-[500] font-mono text-[#171A20]">
                    {shp.price.toLocaleString()} {shp.currency}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedShipmentId(shp.id);
                      setCurrentView('tracking_detail');
                    }}
                    className="px-3 py-1.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] text-[13px] font-[500] hover:bg-[#F4F4F4]"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => alert(`Bid submitted on ${shp.trackingNumber}`)}
                    className="btn-tesla-primary !min-w-[90px] !min-h-[32px] !py-1 !px-3 text-[13px]"
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
              className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-[2px] bg-[#F4F4F4] text-[#171A20] border border-[#D0D1D2] uppercase font-[500]">
                    Empty Backhaul Asset • {bh.vehiclePlate}
                  </span>
                  <h3 className="text-[17px] font-[500] text-[#171A20] mt-1">
                    {bh.currentCity} ➔ {bh.targetCity}
                  </h3>
                  <p className="text-[13px] text-[#5C5E62]">{bh.carrierName} ({bh.driverName})</p>
                </div>

                <div className="text-end">
                  <span className="text-[20px] font-[500] font-mono text-[#3E6AE1]">
                    -{bh.discountPercent}% OFF
                  </span>
                  <span className="text-[11px] text-[#8E8E8E] block">Shipper Discount</span>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 text-[12px] text-center">
                <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                  <span className="text-[10px] text-[#5C5E62] block">Available Payload</span>
                  <span className="font-[500] text-[#171A20] font-mono">{bh.availableCapacityTons} Tons</span>
                </div>
                <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                  <span className="text-[10px] text-[#5C5E62] block">Backhaul Score</span>
                  <span className="font-[500] text-[#3E6AE1] font-mono">{bh.backhaulScore}/100</span>
                </div>
                <div className="p-2 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE]">
                  <span className="text-[10px] text-[#5C5E62] block">Detour Buffer</span>
                  <span className="font-[500] text-[#171A20] font-mono">{bh.detourDistanceKm} km</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EEEEEE]">
                <span className="text-[12px] text-[#5C5E62] flex items-center gap-1">
                  <Leaf className="w-4 h-4 text-[#3E6AE1]" /> Zero Empty Carbon Trip
                </span>
                <button
                  onClick={() => alert(`Matched returning asset ${bh.vehiclePlate} with cargo load!`)}
                  className="btn-tesla-primary !min-w-[140px] !min-h-[34px] !py-1 !px-4 text-[13px]"
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
        <div className="p-5 rounded-[4px] bg-[#FFFFFF] border border-[#EEEEEE] space-y-4">
          <h3 className="font-[500] text-[15px] text-[#171A20] flex items-center gap-2 pb-2 border-b border-[#EEEEEE]">
            <Clock className="w-4 h-4 text-[#3E6AE1]" />
            <span>Active Freight Quote Bids & Counteroffers</span>
          </h3>

          <div className="space-y-3">
            {negotiationOffers.map((neg) => (
              <div
                key={neg.id}
                className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] font-[500] text-[#171A20]">{neg.trackingNumber}</span>
                    <span className="text-[13px] text-[#5C5E62] font-[500]">{neg.carrierName}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-[2px] bg-white text-[#171A20] border border-[#D0D1D2] font-mono">
                      Trust {neg.carrierTrustScore}/100
                    </span>
                  </div>
                  <div className="text-[12px] text-[#5C5E62]">
                    Original Rate: <span className="font-mono line-through">{neg.originalPrice.toLocaleString()} SDG</span> • Current Offer: <span className="font-mono text-[#3E6AE1] font-[500]">{neg.carrierOfferPrice.toLocaleString()} SDG</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenNegotiation(neg)}
                    className="px-3.5 py-1.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] text-[13px] font-[500] hover:bg-[#EEEEEE]"
                  >
                    Counteroffer
                  </button>

                  <button
                    onClick={() => handleAcceptOffer(neg.id)}
                    disabled={neg.currentStatus === 'accepted'}
                    className="btn-tesla-primary !min-w-[100px] !min-h-[32px] !py-1 !px-3 text-[13px] disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-[#171A20]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#EEEEEE] rounded-[4px] p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE]">
              <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#3E6AE1]" />
                <span>Submit Counteroffer Rate</span>
              </h3>
              <button onClick={() => setSelectedOffer(null)} className="text-[#8E8E8E] hover:text-[#171A20]">✕</button>
            </div>

            <form onSubmit={handleSendCounter} className="space-y-3 text-[13px]">
              <div className="p-3 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-1">
                <div className="flex justify-between text-[#5C5E62]">
                  <span>Shipment Code:</span>
                  <span className="font-mono text-[#171A20] font-[500]">{selectedOffer.trackingNumber}</span>
                </div>
                <div className="flex justify-between text-[#5C5E62]">
                  <span>Carrier Initial Offer:</span>
                  <span className="font-mono text-[#171A20]">{selectedOffer.carrierOfferPrice.toLocaleString()} SDG</span>
                </div>
              </div>

              <div>
                <label className="text-[#5C5E62] block mb-1">Your Proposed Target Rate (SDG)</label>
                <input
                  type="number"
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(Number(e.target.value))}
                  className="w-full bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] font-[500] p-2.5 rounded-[4px] outline-none font-mono text-[14px]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="btn-tesla-secondary !min-w-[80px] !min-h-[34px] !py-1 !px-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-tesla-primary !min-w-[140px] !min-h-[34px] !py-1 !px-3"
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
