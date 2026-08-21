'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Shipment, CargoType, VehicleType } from '@/types';
import { calculateSmartPrice } from '@/lib/pricing-engine';
import {
  MapPin,
  Package,
  Truck,
  ShieldCheck,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Building2,
  Calendar,
} from 'lucide-react';

export function CreateShipmentWizard() {
  const { addShipment, setCurrentView, setSelectedShipmentId, t, lang, carriers } = useApp();

  const [step, setStep] = useState(1);

  // Wizard state
  const [originCity, setOriginCity] = useState('Khartoum');
  const [originAddress, setOriginAddress] = useState('North Industrial Zone, Warehouse 4');
  const [originContact, setOriginContact] = useState('Adil El-Mardi (+249 912 110 011)');
  const [pickupDate, setPickupDate] = useState('2026-08-23');

  const [destCity, setDestCity] = useState('Port Sudan');
  const [destAddress, setDestAddress] = useState('Port Sudan Free Zone, Gate 3');
  const [destContact, setDestContact] = useState('Sami Hamad (+249 912 110 022)');
  const [deliveryDate, setDeliveryDate] = useState('2026-08-25');

  const [cargoType, setCargoType] = useState<CargoType>('bulk');
  const [cargoDesc, setCargoDesc] = useState('Sesame & Grain Export Bags');
  const [weightKg, setWeightKg] = useState(25000);
  const [volumeM3, setVolumeM3] = useState(38);
  const [isFragile, setIsFragile] = useState(false);
  const [isTempControlled, setIsTempControlled] = useState(false);

  const [vehicleType, setVehicleType] = useState<VehicleType>('truck_heavy');
  const [hasInsurance, setHasInsurance] = useState(true);
  const [priority, setPriority] = useState<'normal' | 'express' | 'critical'>('normal');
  const [isBackhaulDeal, setIsBackhaulDeal] = useState(true);

  const [selectedCarrierId, setSelectedCarrierId] = useState('car-01');

  // Calculate pricing dynamically
  const priceBreakdown = calculateSmartPrice({
    distanceKm: 830,
    weightKg,
    cargoType,
    vehicleType,
    isFragile,
    isTempControlled,
    hasInsurance,
    isBackhaulApplicable: isBackhaulDeal,
    priority,
  });

  const handleFinish = () => {
    const newTracking = `SDN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newShipment: Shipment = {
      id: `shp-${Date.now()}`,
      trackingNumber: newTracking,
      customerName: 'Enterprise Client Logistics',
      customerNameAr: 'العميل المميز للخدمات اللوجستية',
      customerId: 'cust-demo',
      status: 'confirmed',
      cargoType,
      cargoDescription: cargoDesc,
      totalWeightKg: weightKg,
      totalVolumeM3: volumeM3,
      origin: {
        city: originCity,
        country: 'Sudan',
        address: originAddress,
        lat: 15.55,
        lng: 32.53,
        contactName: originContact,
      },
      destination: {
        city: destCity,
        country: 'Sudan',
        address: destAddress,
        lat: 19.61,
        lng: 37.21,
        contactName: destContact,
      },
      pickupDate,
      deliveryDate,
      requiredVehicleType: vehicleType,
      carrierId: selectedCarrierId,
      carrierName: carriers.find((c) => c.id === selectedCarrierId)?.name || 'Nile Express',
      price: priceBreakdown.total,
      currency: 'SDG',
      distanceKm: 830,
      estimatedEta: '26h Estimated Transit',
      etaConfidence: 95,
      priority,
      isFragile,
      isTempControlled,
      hasInsurance,
      events: [
        {
          id: 'ev-new-1',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'confirmed',
          titleAr: 'تم إنشاء الشحنة وتثبيت السعر الذكي',
          titleEn: 'Shipment Created with AI Pricing Lock',
          descriptionAr: 'تم تأكيد طلب الشحن بنجاح وتجهيز التعيين للأسطول',
          descriptionEn: 'Freight order locked with backhaul optimization discount',
        },
      ],
      backhaulMatched: isBackhaulDeal,
    };

    addShipment(newShipment);
    setSelectedShipmentId(newShipment.id);
    setCurrentView('tracking_detail');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Stepper Wizard Header */}
      <div className="p-5 rounded-2xl bg-navy-900/90 border border-gold/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span>{lang === 'ar' ? 'معالج إنشاء الشحنة الذكية (10-Step Wizard)' : 'Smart Shipment Creator (10-Step Wizard)'}</span>
            </h2>
            <p className="text-xs text-gray-400">
              {lang === 'ar' ? `المرحلة ${step} من 10: إعداد الشحنة والتسعير التنافسي` : `Step ${step} of 10: Logistics parameters & pricing`}
            </p>
          </div>
          <span className="font-mono text-gold text-sm font-bold bg-navy-950 px-3 py-1 rounded-xl border border-gold/20">
            Step {step} / 10
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden border border-gold/20">
          <div
            className="bg-gradient-to-r from-gold to-amber-500 h-full transition-all duration-300"
            style={{ width: `${(step / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 rounded-2xl bg-navy-900/90 border border-gold/25 shadow-2xl min-h-[380px] flex flex-col justify-between">
        {/* STEP 1: Pickup Location */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" />
              <span>Step 1: {lang === 'ar' ? 'بيانات نقطة التحميل (Pickup)' : 'Origin & Pickup Location'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'المدينة:' : 'City:'}</label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                >
                  <option value="Khartoum">Khartoum (الخرطوم)</option>
                  <option value="Port Sudan">Port Sudan (بورتسودان)</option>
                  <option value="Wad Madani">Wad Madani (ود مدني)</option>
                  <option value="Atbara">Atbara (عطبرة)</option>
                  <option value="Gedaref">Gedaref (القضارف)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'تاريخ التحميل:' : 'Pickup Date:'}</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'العنوان التفصيلي:' : 'Detailed Address:'}</label>
                <input
                  value={originAddress}
                  onChange={(e) => setOriginAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'مسؤول الموقع ورقم الهاتف:' : 'Site Contact & Phone:'}</label>
                <input
                  value={originContact}
                  onChange={(e) => setOriginContact(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Destination Location */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              <span>Step 2: {lang === 'ar' ? 'بيانات نقطة الوصول والتسليم (Destination)' : 'Destination & Delivery Site'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'مدينة الوصول:' : 'Destination City:'}</label>
                <select
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                >
                  <option value="Port Sudan">Port Sudan (بورتسودان)</option>
                  <option value="Khartoum">Khartoum (الخرطوم)</option>
                  <option value="Wad Madani">Wad Madani (ود مدني)</option>
                  <option value="Gedaref">Gedaref (القضارف)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'موعد التسليم المتوقع:' : 'Delivery Window:'}</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'عنوان موقع التسليم:' : 'Destination Address:'}</label>
                <input
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'المستلم وجهة الاتصال:' : 'Receiver Contact:'}</label>
                <input
                  value={destContact}
                  onChange={(e) => setDestContact(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Cargo Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-gold" />
              <span>Step 3: {lang === 'ar' ? 'مواصفات البضاعة والوزن (Cargo Details)' : 'Cargo Type & Weight'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'نوع البضاعة:' : 'Cargo Type:'}</label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value as CargoType)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                >
                  <option value="bulk">Bulk & Grain (صب وحبوب)</option>
                  <option value="general">General Cargo (بضائع عامة)</option>
                  <option value="perishable">Perishable Food (أغذية مبردة)</option>
                  <option value="pharmaceuticals">Pharmaceuticals (أدوية ومستلزمات طبية)</option>
                  <option value="heavy_machinery">Heavy Machinery (معدات ثقيلة)</option>
                  <option value="liquid">Liquid / Fuel (سوائل ووقود)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'الوزن الإجمالي (كجم):' : 'Total Weight (Kg):'}</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white font-mono outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-gray-300 font-semibold">{lang === 'ar' ? 'وصف الشحنة التفصيلي:' : 'Detailed Description:'}</label>
                <input
                  value={cargoDesc}
                  onChange={(e) => setCargoDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-navy-950 border border-gold/20 text-white outline-none"
                />
              </div>

              <div className="flex items-center gap-4 sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-200">
                  <input
                    type="checkbox"
                    checked={isFragile}
                    onChange={(e) => setIsFragile(e.target.checked)}
                    className="accent-gold w-4 h-4 rounded"
                  />
                  <span>Fragile Cargo (قابلة للكسر)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-gray-200">
                  <input
                    type="checkbox"
                    checked={isTempControlled}
                    onChange={(e) => setIsTempControlled(e.target.checked)}
                    className="accent-gold w-4 h-4 rounded"
                  />
                  <span>Cold-Chain Required (تحتاج تبريد)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Vehicle Type */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-gold" />
              <span>Step 4: {lang === 'ar' ? 'نوع الشاحنة المطلوبة (Fleet Requirement)' : 'Select Fleet Type'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { type: 'truck_heavy', label: 'Heavy Truck (شاحنة ثقيلة 30T)', desc: 'General & bulk loads' },
                { type: 'flatbed', label: 'Flatbed (مسطحة 35T)', desc: 'Containers & industrial steel' },
                { type: 'reefer', label: 'Reefer (شاحنة مبردة)', desc: 'Temperature controlled' },
                { type: 'tanker', label: 'Tanker (صهريج)', desc: 'Fuels & edible oils' },
                { type: 'pickup', label: 'Heavy Pickup (3T)', desc: 'Fast express parcels' },
                { type: 'van', label: 'Box Van (فان مقفل)', desc: 'Secure retail dry goods' },
              ].map((v) => (
                <button
                  key={v.type}
                  type="button"
                  onClick={() => setVehicleType(v.type as VehicleType)}
                  className={`p-3.5 rounded-xl border text-start transition-all cursor-pointer ${
                    vehicleType === v.type
                      ? 'bg-gold/20 border-gold text-white shadow-lg'
                      : 'bg-navy-950/70 border-navy-800 text-gray-300 hover:bg-navy-800'
                  }`}
                >
                  <div className="font-bold text-white">{v.label}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{v.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Value Added Services & Priority */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Step 5: {lang === 'ar' ? 'الخدمات الإضافية والأولويات' : 'Value Added Services & SLA'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                  className="accent-gold w-4 h-4 rounded"
                />
                <div>
                  <div className="font-bold text-white">Full Cargo Insurance (تأمين بوالص شامل)</div>
                  <div className="text-[10px] text-gray-400">100% financial protection against loss or damage</div>
                </div>
              </label>

              <label className="p-3.5 rounded-xl bg-navy-950/80 border border-emerald-500/40 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBackhaulDeal}
                  onChange={(e) => setIsBackhaulDeal(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4 rounded"
                />
                <div>
                  <div className="font-bold text-emerald-400">Apply Backhaul Discount (-22%)</div>
                  <div className="text-[10px] text-gray-300">Match with empty return trucks along the route</div>
                </div>
              </label>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-gray-200">SLA Priority / الأولوية:</label>
              <div className="flex gap-2">
                {(['normal', 'express', 'critical'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      priority === p
                        ? 'bg-gold text-navy-950 shadow-md'
                        : 'bg-navy-950 border border-navy-800 text-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Smart Price Estimate & Breakdown */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gold" />
              <span>Step 6: {lang === 'ar' ? 'حساب التسعير الديناميكي الذكي' : 'AI Smart Dynamic Price Estimate'}</span>
            </h3>

            <div className="p-4 rounded-xl bg-navy-950/90 border border-gold/30 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-300 pb-1.5 border-b border-navy-800">
                <span>Base Transportation & Distance (830 km):</span>
                <span className="font-mono text-white">{(priceBreakdown.baseTransport + priceBreakdown.distanceCharge).toLocaleString()} SDG</span>
              </div>
              <div className="flex items-center justify-between text-gray-300 pb-1.5 border-b border-navy-800">
                <span>Fuel Adjustment Buffer:</span>
                <span className="font-mono text-white">+{priceBreakdown.fuelAdjustment.toLocaleString()} SDG</span>
              </div>
              <div className="flex items-center justify-between text-gray-300 pb-1.5 border-b border-navy-800">
                <span>Route Risk & Mountain Pass Safety:</span>
                <span className="font-mono text-white">+{priceBreakdown.routeRiskFactor.toLocaleString()} SDG</span>
              </div>
              {isBackhaulDeal && (
                <div className="flex items-center justify-between text-emerald-400 font-semibold pb-1.5 border-b border-navy-800">
                  <span>Empty Truck Backhaul Discount:</span>
                  <span className="font-mono">-{priceBreakdown.backhaulDiscount.toLocaleString()} SDG</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-bold text-white pt-2">
                <span>Total Guaranteed Price:</span>
                <span className="font-mono text-gold text-lg">{priceBreakdown.total.toLocaleString()} SDG</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Carrier Selection */}
        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gold" />
              <span>Step 7: {lang === 'ar' ? 'اختيار وتثبيت الناقل المعتمد' : 'Select Certified Carrier'}</span>
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {carriers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCarrierId(c.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-start transition-all cursor-pointer ${
                    selectedCarrierId === c.id
                      ? 'bg-gold/20 border-gold text-white'
                      : 'bg-navy-950/70 border-navy-800 text-gray-300 hover:bg-navy-800'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-gray-400">{c.city} • {c.fleetCount} Trucks</div>
                  </div>
                  <div className="text-end">
                    <span className="text-xs font-mono font-bold text-gold px-2 py-0.5 rounded bg-navy-900 border border-gold/30">
                      Trust: {c.trustScore}/100
                    </span>
                    <div className="text-[10px] text-emerald-400 mt-1">{c.onTimeDeliveryRate}% OTD</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: Review Manifest */}
        {step === 8 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Step 8: {lang === 'ar' ? 'مراجعة بوليصة الشحن (Manifest Review)' : 'Review Manifest'}</span>
            </h3>
            <div className="p-4 rounded-xl bg-navy-950/90 border border-gold/20 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Route:</span>
                <span className="font-bold text-white">{originCity} ➔ {destCity} (830 km)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cargo:</span>
                <span className="font-bold text-white">{cargoDesc} ({(weightKg / 1000).toFixed(1)} Tons)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Carrier:</span>
                <span className="font-bold text-gold">{carriers.find((c) => c.id === selectedCarrierId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Agreed Amount:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">{priceBreakdown.total.toLocaleString()} SDG</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Payment & Terms */}
        {step === 9 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gold" />
              <span>Step 9: {lang === 'ar' ? 'طريقة الدفع والتسوية' : 'Payment & Contract Terms'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-gold/20 border border-gold text-white font-bold cursor-pointer">
                Enterprise Corporate Wallet (خصم تلقائي من المحفظة)
              </div>
              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-navy-800 text-gray-300 cursor-pointer">
                Bankak / Bank of Khartoum Direct API (بنكك)
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: Confirmation */}
        {step === 10 && (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'جاهز للتثبيت والإطلاق الفوري!' : 'Ready for Instant Dispatch & Locking!'}
            </h3>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              {lang === 'ar'
                ? 'سيتم إصدار الباركود الرقمي، إشعار الناقل والسائق، وتفعيل التتبع المباشر لحظياً.'
                : 'Digital manifest, driver notifications, and real-time GPS telemetry will activate instantly.'}
            </p>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gold/15 mt-4">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-gray-300 text-xs font-semibold flex items-center gap-1 disabled:opacity-30 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
          </button>

          {step < 10 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(10, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:brightness-110 text-navy-950 text-xs font-bold shadow-lg flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
            >
              <span>{lang === 'ar' ? 'التالي' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-navy-950 text-xs font-bold shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
            >
              <Zap className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إصدار الشحنة وتفعيل التتبع المباشر' : 'Launch Shipment & Live Tracking'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
