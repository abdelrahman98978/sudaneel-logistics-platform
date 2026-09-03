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
} from 'lucide-react';

export function CreateShipmentWizard() {
  const { addShipment, setCurrentView, setSelectedShipmentId, lang, carriers } = useApp();

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
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-[#000000] shopify-theme" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Stepper Wizard Header (Shopify 12px Card) */}
      <div className="p-8 shopify-card bg-[#ffffff] space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="shopify-tag-mint !text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Booking • حجز شحنة ذكية</span>
            </div>
            <h1 className="text-[24px] font-[500] text-[#000000] tracking-tight">
              {lang === 'ar' ? 'معالج إنشاء الشحنة الذكية' : 'Smart Shipment Creator'}
            </h1>
            <p className="text-[14px] font-[420] text-[#71717a]">
              {lang === 'ar' ? `المرحلة ${step} من 10: إعداد الشحنة والتسعير التنافسي` : `Step ${step} of 10: Logistics parameters & pricing`}
            </p>
          </div>
          <span className="shopify-tag-shade !text-[12px] font-mono font-[600]">
            Step {step} / 10
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#fbfbf5] rounded-full h-2 overflow-hidden border border-[#e4e4e7]">
          <div
            className="bg-[#000000] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 10) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-8 shopify-card bg-[#ffffff] min-h-[400px] flex flex-col justify-between">
        {/* STEP 1: Pickup Location */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3E6AE1]" />
              <span>Step 1: {lang === 'ar' ? 'بيانات نقطة التحميل (Pickup)' : 'Origin & Pickup Location'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div className="space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'المدينة:' : 'City:'}</label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                >
                  <option value="Khartoum">Khartoum (الخرطوم)</option>
                  <option value="Port Sudan">Port Sudan (بورتسودان)</option>
                  <option value="Wad Madani">Wad Madani (ود مدني)</option>
                  <option value="Atbara">Atbara (عطبرة)</option>
                  <option value="Gedaref">Gedaref (القضارف)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'تاريخ التحميل:' : 'Pickup Date:'}</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'العنوان التفصيلي:' : 'Detailed Address:'}</label>
                <input
                  value={originAddress}
                  onChange={(e) => setOriginAddress(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'مسؤول الموقع ورقم الهاتف:' : 'Site Contact & Phone:'}</label>
                <input
                  value={originContact}
                  onChange={(e) => setOriginContact(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Destination Location */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3E6AE1]" />
              <span>Step 2: {lang === 'ar' ? 'بيانات نقطة الوصول والتسليم (Destination)' : 'Destination & Delivery Site'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div className="space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'مدينة الوصول:' : 'Destination City:'}</label>
                <select
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                >
                  <option value="Port Sudan">Port Sudan (بورتسودان)</option>
                  <option value="Khartoum">Khartoum (الخرطوم)</option>
                  <option value="Wad Madani">Wad Madani (ود مدني)</option>
                  <option value="Gedaref">Gedaref (القضارف)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'موعد التسليم المتوقع:' : 'Delivery Window:'}</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'عنوان موقع التسليم:' : 'Destination Address:'}</label>
                <input
                  value={destAddress}
                  onChange={(e) => setDestAddress(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'المستلم وجهة الاتصال:' : 'Receiver Contact:'}</label>
                <input
                  value={destContact}
                  onChange={(e) => setDestContact(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Cargo Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#3E6AE1]" />
              <span>Step 3: {lang === 'ar' ? 'مواصفات البضاعة والوزن (Cargo Details)' : 'Cargo Type & Weight'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div className="space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'نوع البضاعة:' : 'Cargo Type:'}</label>
                <select
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value as CargoType)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
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
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'الوزن الإجمالي (كجم):' : 'Total Weight (Kg):'}</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] font-mono outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[#5C5E62]">{lang === 'ar' ? 'وصف الشحنة التفصيلي:' : 'Detailed Description:'}</label>
                <input
                  value={cargoDesc}
                  onChange={(e) => setCargoDesc(e.target.value)}
                  className="w-full p-2.5 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#171A20] outline-none"
                />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#171A20]">
                  <input
                    type="checkbox"
                    checked={isFragile}
                    onChange={(e) => setIsFragile(e.target.checked)}
                    className="accent-[#3E6AE1] w-4 h-4 rounded"
                  />
                  <span>Fragile Cargo (قابلة للكسر)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#171A20]">
                  <input
                    type="checkbox"
                    checked={isTempControlled}
                    onChange={(e) => setIsTempControlled(e.target.checked)}
                    className="accent-[#3E6AE1] w-4 h-4 rounded"
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
            <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#3E6AE1]" />
              <span>Step 4: {lang === 'ar' ? 'نوع الشاحنة المطلوبة (Fleet Requirement)' : 'Select Fleet Type'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
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
                  className={`p-4 rounded-[4px] border text-start transition-colors duration-330 cursor-pointer ${
                    vehicleType === v.type
                      ? 'bg-[#F4F4F4] border-[#3E6AE1] text-[#171A20]'
                      : 'bg-[#FFFFFF] border-[#EEEEEE] text-[#5C5E62] hover:bg-[#F4F4F4]'
                  }`}
                >
                  <div className="font-[500] text-[#171A20]">{v.label}</div>
                  <div className="text-[11px] text-[#8E8E8E] mt-1">{v.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Value Added Services */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#3E6AE1]" />
              <span>Step 5: {lang === 'ar' ? 'الخدمات الإضافية والأولويات' : 'Value Added Services & SLA'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <label className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInsurance}
                  onChange={(e) => setHasInsurance(e.target.checked)}
                  className="accent-[#3E6AE1] w-4 h-4 rounded"
                />
                <div>
                  <div className="font-[500] text-[#171A20]">Full Cargo Insurance (تأمين بوالص شامل)</div>
                  <div className="text-[11px] text-[#5C5E62]">100% financial protection against loss or damage</div>
                </div>
              </label>

              <label className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBackhaulDeal}
                  onChange={(e) => setIsBackhaulDeal(e.target.checked)}
                  className="accent-[#3E6AE1] w-4 h-4 rounded"
                />
                <div>
                  <div className="font-[500] text-[#3E6AE1]">Apply Backhaul Discount (-22%)</div>
                  <div className="text-[11px] text-[#5C5E62]">Match with empty return trucks along the route</div>
                </div>
              </label>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[13px] font-[500] text-[#171A20]">SLA Priority / الأولوية:</label>
              <div className="flex gap-2">
                {(['normal', 'express', 'critical'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-[4px] text-[13px] font-[500] uppercase transition-colors duration-330 cursor-pointer ${
                      priority === p
                        ? 'bg-[#171A20] text-white'
                        : 'bg-[#FFFFFF] border border-[#D0D1D2] text-[#5C5E62]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Smart Price Estimate */}
        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#3E6AE1]" />
              <span>Step 6: {lang === 'ar' ? 'حساب التسعير الديناميكي الذكي' : 'AI Dynamic Price Estimate'}</span>
            </h3>

            <div className="p-5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] space-y-2 text-[13px]">
              <div className="flex items-center justify-between text-[#5C5E62] pb-1.5 border-b border-[#EEEEEE]">
                <span>Base Transportation & Distance (830 km):</span>
                <span className="font-mono text-[#171A20]">{(priceBreakdown.baseTransport + priceBreakdown.distanceCharge).toLocaleString()} SDG</span>
              </div>
              <div className="flex items-center justify-between text-[#5C5E62] pb-1.5 border-b border-[#EEEEEE]">
                <span>Fuel Adjustment Buffer:</span>
                <span className="font-mono text-[#171A20]">+{priceBreakdown.fuelAdjustment.toLocaleString()} SDG</span>
              </div>
              <div className="flex items-center justify-between text-[#5C5E62] pb-1.5 border-b border-[#EEEEEE]">
                <span>Route Risk & Safety Factor:</span>
                <span className="font-mono text-[#171A20]">+{priceBreakdown.routeRiskFactor.toLocaleString()} SDG</span>
              </div>
              {isBackhaulDeal && (
                <div className="flex items-center justify-between text-[#3E6AE1] font-[500] pb-1.5 border-b border-[#EEEEEE]">
                  <span>Empty Truck Backhaul Discount:</span>
                  <span className="font-mono">-{priceBreakdown.backhaulDiscount.toLocaleString()} SDG</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[15px] font-[500] text-[#171A20] pt-2">
                <span>Total Guaranteed Price:</span>
                <span className="font-mono text-[#171A20] text-[18px]">{priceBreakdown.total.toLocaleString()} SDG</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Carrier Selection */}
        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#3E6AE1]" />
              <span>Step 7: {lang === 'ar' ? 'اختيار وتثبيت الناقل المعتمد' : 'Select Certified Carrier'}</span>
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
              {carriers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCarrierId(c.id)}
                  className={`w-full p-4 rounded-[4px] border flex items-center justify-between text-start transition-colors duration-330 cursor-pointer ${
                    selectedCarrierId === c.id
                      ? 'bg-[#F4F4F4] border-[#3E6AE1]'
                      : 'bg-[#FFFFFF] border-[#EEEEEE] text-[#5C5E62] hover:bg-[#F4F4F4]'
                  }`}
                >
                  <div>
                    <div className="font-[500] text-[#171A20]">{c.name}</div>
                    <div className="text-[11px] text-[#8E8E8E]">{c.city} • {c.fleetCount} Trucks</div>
                  </div>
                  <div className="text-end">
                    <span className="text-[11px] font-mono font-[500] text-[#171A20] px-2 py-0.5 rounded-[2px] bg-white border border-[#D0D1D2]">
                      Trust: {c.trustScore}/100
                    </span>
                    <div className="text-[11px] text-[#3E6AE1] mt-1">{c.onTimeDeliveryRate}% OTD</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: Review Manifest */}
        {step === 8 && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3E6AE1]" />
              <span>Step 8: {lang === 'ar' ? 'مراجعة بوليصة الشحن (Manifest Review)' : 'Review Manifest'}</span>
            </h3>
            <div className="p-5 rounded-[4px] bg-[#F4F4F4] border border-[#EEEEEE] text-[13px] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#5C5E62]">Route:</span>
                <span className="font-[500] text-[#171A20]">{originCity} ➔ {destCity} (830 km)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5E62]">Cargo:</span>
                <span className="font-[500] text-[#171A20]">{cargoDesc} ({(weightKg / 1000).toFixed(1)} Tons)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5E62]">Carrier:</span>
                <span className="font-[500] text-[#171A20]">{carriers.find((c) => c.id === selectedCarrierId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5E62]">Agreed Amount:</span>
                <span className="font-mono font-[700] text-[#059669] text-[16px]">{priceBreakdown.total.toLocaleString()} SDG</span>
              </div>
              <div className="pt-2 border-t border-[#e4e4e7] grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#71717a]">
                <div>
                  <span className="block font-[600] text-[#000000] font-mono">{priceBreakdown.carrierPayout.toLocaleString()} SDG</span>
                  <span>{lang === 'ar' ? 'مستحقات الناقل' : 'Carrier Payout'}</span>
                </div>
                <div>
                  <span className="block font-[600] text-[#0849A8] font-mono">{priceBreakdown.sudaneelMarginAmount.toLocaleString()} SDG ({priceBreakdown.sudaneelMarginPercent}%)</span>
                  <span>{lang === 'ar' ? 'هامش منصة سودانيل' : 'Platform Margin'}</span>
                </div>
                <div>
                  <span className="block font-[600] text-[#059669] font-mono">-{priceBreakdown.co2SavingsKg} kg CO₂</span>
                  <span>{lang === 'ar' ? 'وفر الكربون (Backhaul)' : 'CO₂ Avoided'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Payment & Terms */}
        {step === 9 && (
          <div className="space-y-4">
            <h3 className="text-[15px] font-[500] text-[#171A20] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#3E6AE1]" />
              <span>Step 9: {lang === 'ar' ? 'طريقة الدفع والتسوية' : 'Payment & Contract Terms'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
              <div className="p-4 rounded-[4px] bg-[#F4F4F4] border border-[#3E6AE1] text-[#171A20] font-[500] cursor-pointer">
                Enterprise Corporate Wallet (خصم تلقائي من المحفظة)
              </div>
              <div className="p-4 rounded-[4px] bg-[#FFFFFF] border border-[#D0D1D2] text-[#5C5E62] cursor-pointer">
                Bankak / Bank of Khartoum Direct API (بنكك)
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: Confirmation */}
        {step === 10 && (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-[#F4F4F4] border border-[#EEEEEE] text-[#3E6AE1] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-[17px] font-[500] text-[#171A20]">
              {lang === 'ar' ? 'جاهز للتثبيت والإطلاق الفوري!' : 'Ready for Instant Dispatch & Locking!'}
            </h3>
            <p className="text-[13px] text-[#5C5E62] max-w-md mx-auto">
              {lang === 'ar'
                ? 'سيتم إصدار الباركود الرقمي، إشعار الناقل والسائق، وتفعيل التتبع المباشر لحظياً.'
                : 'Digital manifest, driver notifications, and real-time GPS telemetry will activate instantly.'}
            </p>
          </div>
        )}

        {/* Stepper Navigation Buttons (Shopify Pill CTAs) */}
        <div className="flex items-center justify-between pt-6 border-t border-[#e4e4e7] mt-6">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            className="btn-shopify-outline !py-2 !px-5 text-[13px] flex items-center gap-1.5 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
          </button>

          {step < 10 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(10, prev + 1))}
              className="btn-shopify-pill !py-2 !px-6 text-[13px] flex items-center gap-1.5"
            >
              <span>{lang === 'ar' ? 'التالي' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="btn-shopify-pill !py-2.5 !px-7 text-[13.5px] flex items-center gap-2 bg-[#000000] text-[#ffffff]"
            >
              <Zap className="w-4 h-4 text-[#c1fbd4]" />
              <span>{lang === 'ar' ? 'إصدار الشحنة وتفعيل التتبع المباشر' : 'Launch Shipment & Live Tracking'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
