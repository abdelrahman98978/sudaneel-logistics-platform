'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  ThemeMode,
  Shipment,
  ShipmentStatus,
  Vehicle,
  Carrier,
  Driver,
  BackhaulOpportunity,
  Incident,
  Invoice,
  Warehouse,
  WarehouseItem,
  WarehouseReservation,
  PortContainer,
  BorderCrossing,
  Claim,
  EnterpriseContract,
  CrmOpportunity,
  DigitalTwinScenario,
  AnomalyAlert,
  NegotiationOffer,
  BulkShipmentRow,
  CustomsDeclaration,
} from '@/types';
import {
  mockShipments,
  mockVehicles,
  mockCarriers,
  mockDrivers,
  mockBackhaulOpportunities,
  mockIncidents,
  mockInvoices,
  mockWarehouses,
  mockWarehouseItems,
  mockWarehouseReservations,
  mockPortContainers,
  mockBorderCrossings,
  mockClaims,
  mockContracts,
  mockCrmOpportunities,
  mockDigitalTwinScenarios,
  mockAnomalyAlerts,
  mockNegotiationOffers,
  mockBulkShipmentRows,
  mockCustomsDeclarations,
} from './mock-data';
import { dictionary } from './i18n';
import { demoMode } from './config';

export type AppView =
  | 'landing'
  | 'public_track'
  | 'control_tower'
  | 'marketplace'
  | 'smart_dispatch'
  | 'shipments'
  | 'create_shipment'
  | 'bulk_orders'
  | 'tracking_detail'
  | 'fleet'
  | 'carrier_portal'
  | 'driver_app'
  | 'driver_safety'
  | 'warehousing'
  | 'port_sudan'
  | 'customs_workspace'
  | 'cross_border'
  | 'incidents'
  | 'claims'
  | 'finance'
  | 'contracts_crm'
  | 'analytics'
  | 'ai_center'
  | 'reports'
  | 'locations'
  | 'support_center'
  | 'mobile_app'
  | 'invoices_ledger'
  | 'settings_rbac';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedShipmentId: string | null;
  setSelectedShipmentId: (id: string | null) => void;
  demoMode: boolean;

  // Domain Datasets
  shipments: Shipment[];
  vehicles: Vehicle[];
  carriers: Carrier[];
  drivers: Driver[];
  backhauls: BackhaulOpportunity[];
  incidents: Incident[];
  invoices: Invoice[];
  warehouses: Warehouse[];
  warehouseItems: WarehouseItem[];
  warehouseReservations: WarehouseReservation[];
  portContainers: PortContainer[];
  borderCrossings: BorderCrossing[];
  claims: Claim[];
  contracts: EnterpriseContract[];
  crmOpportunities: CrmOpportunity[];
  digitalTwinScenarios: DigitalTwinScenario[];
  anomalyAlerts: AnomalyAlert[];
  negotiationOffers: NegotiationOffer[];
  bulkShipmentRows: BulkShipmentRow[];
  customsDeclarations: CustomsDeclaration[];

  // Translations & Drawers
  t: typeof dictionary.ar;
  isAiCopilotOpen: boolean;
  setIsAiCopilotOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Toast System
  toasts: ToastItem[];
  showToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Action Mutators
  updateShipmentStatus: (id: string, newStatus: ShipmentStatus) => void;
  assignVehicleToShipment: (shipmentId: string, vehicleId: string, driverId: string) => void;
  addShipment: (shipment: Shipment) => void;
  reserveWarehouseSpace: (reservation: WarehouseReservation) => void;
  updateContainerStatus: (containerId: string, newStatus: import('@/types').PortCustomsStatus) => void;
  submitClaim: (claim: Claim) => void;
  updateClaimStatus: (claimId: string, newStatus: import('@/types').ClaimStatus, compensation?: number) => void;
  submitCustomsDeclaration: (declaration: CustomsDeclaration) => void;
  updateCustomsDeclarationStatus: (id: string, releaseStatus: CustomsDeclaration['releaseStatus'], inspectionStatus?: CustomsDeclaration['inspectionStatus']) => void;
  counterNegotiationOffer: (offerId: string, counterAmount: number) => void;
  acceptNegotiationOffer: (offerId: string) => void;
  importBulkShipments: (rows: BulkShipmentRow[]) => void;
  resolveIncident: (incidentId: string) => void;
  payInvoice: (invoiceId: string, paymentMethod: string, referenceNumber: string) => void;
  topUpWallet: (amount: number, method: string, reference: string) => void;
  resetToFactoryDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'sudaneel_platform_state_v3';

function readUiPreference<T extends string>(key: 'lang' | 'theme', fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved) as Record<string, unknown>;
    return typeof parsed[key] === 'string' ? (parsed[key] as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('super_admin');
  const [lang, setLang] = useState<Language>(() => readUiPreference('lang', 'ar'));
  const [theme, setTheme] = useState<ThemeMode>(() => readUiPreference('theme', 'dark'));
  const [currentView, setCurrentView] = useState<AppView>('control_tower');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>('shp-001');

  // Datasets State
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [backhauls, setBackhauls] = useState<BackhaulOpportunity[]>(mockBackhaulOpportunities);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>(mockWarehouseItems);
  const [warehouseReservations, setWarehouseReservations] = useState<WarehouseReservation[]>(mockWarehouseReservations);
  const [portContainers, setPortContainers] = useState<PortContainer[]>(mockPortContainers);
  const [borderCrossings, setBorderCrossings] = useState<BorderCrossing[]>(mockBorderCrossings);
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [contracts, setContracts] = useState<EnterpriseContract[]>(mockContracts);
  const [crmOpportunities, setCrmOpportunities] = useState<CrmOpportunity[]>(mockCrmOpportunities);
  const [digitalTwinScenarios, setDigitalTwinScenarios] = useState<DigitalTwinScenario[]>(mockDigitalTwinScenarios);
  const [anomalyAlerts, setAnomalyAlerts] = useState<AnomalyAlert[]>(mockAnomalyAlerts);
  const [negotiationOffers, setNegotiationOffers] = useState<NegotiationOffer[]>(mockNegotiationOffers);
  const [bulkShipmentRows, setBulkShipmentRows] = useState<BulkShipmentRow[]>(mockBulkShipmentRows);
  const [customsDeclarations, setCustomsDeclarations] = useState<CustomsDeclaration[]>(mockCustomsDeclarations);

  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const isRtl = lang === 'ar' || lang === 'ur' || lang === 'fa';
  const dir: 'rtl' | 'ltr' = isRtl ? 'rtl' : 'ltr';
  const t = dictionary[lang] || dictionary.ar;

  // Toast System
  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastItem = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Persist only non-sensitive UI preferences. Operational records come from the server.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stateToSave = { lang, theme };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [lang, theme]);

  // Set document direction on language change
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  // Keyboard shortcut for Command Palette (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated live telemetry movement for vehicles
  useEffect(() => {
    if (!demoMode) return;
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status === 'in_transit') {
            const deltaLat = (Math.random() - 0.48) * 0.003;
            const deltaLng = (Math.random() - 0.45) * 0.003;
            return {
              ...v,
              currentLat: Number((v.currentLat + deltaLat).toFixed(4)),
              currentLng: Number((v.currentLng + deltaLng).toFixed(4)),
              speedKmh: Math.floor(60 + Math.random() * 20),
            };
          }
          return v;
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const updateShipmentStatus = (id: string, newStatus: ShipmentStatus) => {
    setShipments((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const assignVehicleToShipment = (shipmentId: string, vehicleId: string, driverId: string) => {
    const v = vehicles.find((veh) => veh.id === vehicleId);
    const d = drivers.find((drv) => drv.id === driverId);
    setShipments((prev) =>
      prev.map((s) => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'carrier_assigned',
            vehicleId: v?.id,
            vehiclePlate: v?.plateNumber,
            driverId: d?.id,
            driverName: d?.nameAr || d?.name,
            driverPhone: d?.phone,
            carrierName: v?.carrierName,
          };
        }
        return s;
      })
    );
    setVehicles((prev) =>
      prev.map((veh) => (veh.id === vehicleId ? { ...veh, status: 'assigned' } : veh))
    );
  };

  const addShipment = (shipment: Shipment) => {
    setShipments((prev) => [shipment, ...prev]);
  };

  const reserveWarehouseSpace = (reservation: WarehouseReservation) => {
    setWarehouseReservations((prev) => [reservation, ...prev]);
    setWarehouses((prev) =>
      prev.map((wh) => {
        if (wh.id === reservation.warehouseId) {
          const newAvailable = Math.max(0, wh.availableAreaM2 - reservation.reservedAreaM2);
          const newOccupancy = Number((((wh.totalAreaM2 - newAvailable) / wh.totalAreaM2) * 100).toFixed(1));
          return { ...wh, availableAreaM2: newAvailable, occupancyPercent: newOccupancy };
        }
        return wh;
      })
    );
  };

  const updateContainerStatus = (containerId: string, newStatus: import('@/types').PortCustomsStatus) => {
    setPortContainers((prev) =>
      prev.map((cntr) => (cntr.id === containerId ? { ...cntr, customsStatus: newStatus } : cntr))
    );
  };

  const submitClaim = (claim: Claim) => {
    setClaims((prev) => [claim, ...prev]);
  };

  const updateClaimStatus = (claimId: string, newStatus: import('@/types').ClaimStatus, compensation?: number) => {
    setClaims((prev) =>
      prev.map((clm) => (clm.id === claimId ? { ...clm, status: newStatus, compensationOffered: compensation ?? clm.compensationOffered } : clm))
    );
  };

  const counterNegotiationOffer = (offerId: string, counterAmount: number) => {
    setNegotiationOffers((prev) =>
      prev.map((off) => {
        if (off.id === offerId) {
          const savings = off.originalPrice - counterAmount;
          const savingsPct = Number(((savings / off.originalPrice) * 100).toFixed(1));
          return {
            ...off,
            customerCounterPrice: counterAmount,
            currentStatus: 'customer_countered',
            savingsAmount: savings,
            savingsPercent: savingsPct,
          };
        }
        return off;
      })
    );
  };

  const acceptNegotiationOffer = (offerId: string) => {
    setNegotiationOffers((prev) =>
      prev.map((off) => (off.id === offerId ? { ...off, currentStatus: 'accepted' } : off))
    );
  };

  const importBulkShipments = (rows: BulkShipmentRow[]) => {
    const validRows = rows.filter((r) => r.validationStatus === 'valid');
    const newGeneratedShipments: Shipment[] = validRows.map((r, idx) => ({
      id: `shp-bulk-${Date.now()}-${idx}`,
      trackingNumber: `SDN-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: 'Enterprise Bulk Shipper',
      customerNameAr: 'شاحن البضائع المجمعة',
      customerId: 'cust-bulk',
      status: 'confirmed',
      cargoType: 'bulk',
      cargoDescription: r.cargoDesc,
      totalWeightKg: r.weightTons * 1000,
      totalVolumeM3: Math.round(r.weightTons * 1.5),
      origin: { city: r.pickupCity, country: 'Sudan', address: 'Commercial Freight Depot', lat: 15.55, lng: 32.53 },
      destination: { city: r.destCity, country: 'Sudan', address: 'Regional Logistics Hub', lat: 19.61, lng: 37.21 },
      pickupDate: r.pickupDate,
      deliveryDate: '2026-08-28',
      requiredVehicleType: r.vehicleType,
      price: r.priceEstimate,
      currency: 'SDG',
      distanceKm: 830,
      estimatedEta: '2026-08-28 16:00',
      etaConfidence: 92,
      priority: 'normal',
      isFragile: false,
      isTempControlled: false,
      hasInsurance: true,
      events: [
        {
          id: `ev-${Date.now()}-${idx}`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          status: 'confirmed',
          titleAr: 'تم استيراد الشحنة وتأكيدها آلياً عبر ملف الدفعات',
          titleEn: 'Batch shipment verified and ingested via CSV engine',
          descriptionAr: 'تم تخصيص رمز التتبع وبدء عملية مطابقة الناقلين',
          descriptionEn: 'Assigned tracking ID and queued for freight matching',
        },
      ],
    }));

    setShipments((prev) => [...newGeneratedShipments, ...prev]);
  };

  const resolveIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, status: 'resolved' } : inc))
    );
  };

  const payInvoice = (invoiceId: string, paymentMethod: string, referenceNumber: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              status: 'paid',
              paidAt: new Date().toISOString().slice(0, 10),
            }
          : inv
      )
    );
  };

  const submitCustomsDeclaration = (declaration: CustomsDeclaration) => {
    setCustomsDeclarations((prev) => [declaration, ...prev]);
    showToast(
      lang === 'ar' ? 'تم تسجيل الإقرار الجمركي' : 'Customs Declaration Filed',
      lang === 'ar'
        ? `تم تسجيل الإقرار رقم ${declaration.declarationNumber} وإرساله لمنفذ ${declaration.entryPort}`
        : `Declaration ${declaration.declarationNumber} submitted to ${declaration.entryPort}`,
      'success'
    );
  };

  const updateCustomsDeclarationStatus = (
    id: string,
    releaseStatus: CustomsDeclaration['releaseStatus'],
    inspectionStatus?: CustomsDeclaration['inspectionStatus']
  ) => {
    setCustomsDeclarations((prev) =>
      prev.map((dec) => {
        if (dec.id === id) {
          return {
            ...dec,
            releaseStatus,
            inspectionStatus: inspectionStatus || dec.inspectionStatus,
            releasedAt: releaseStatus === 'released' ? new Date().toISOString().slice(0, 16).replace('T', ' ') : dec.releasedAt,
          };
        }
        return dec;
      })
    );
    showToast(
      lang === 'ar' ? 'تحديث حالة الإقرار الجمركي' : 'Customs Status Updated',
      lang === 'ar' ? `تم تحديث حالة المعاملة إلى: ${releaseStatus}` : `Status updated to ${releaseStatus}`,
      'info'
    );
  };

  const topUpWallet = (amount: number, method: string, reference: string) => {
    // Add transaction to first shipper or current user
    showToast('تم شحن المحفظة', `تمت إضافة مبلغ ${amount.toLocaleString()} SDG إلى الرصيد التشغيلي`, 'success');
  };

  const resetToFactoryDefaults = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setShipments(mockShipments);
    setVehicles(mockVehicles);
    setCarriers(mockCarriers);
    setDrivers(mockDrivers);
    setInvoices(mockInvoices);
    setWarehouseReservations(mockWarehouseReservations);
    setClaims(mockClaims);
    setIncidents(mockIncidents);
    showToast('تمت استعادة البيانات الأصلية', 'تمت إعادة ضبط كافة الجداول والحركات لقيم المصنع الافتراضية بنجاح', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        lang,
        setLang,
        dir,
        theme,
        setTheme,
        currentView,
        setCurrentView,
        selectedShipmentId,
        setSelectedShipmentId,
        demoMode,
        shipments,
        vehicles,
        carriers,
        drivers,
        backhauls,
        incidents,
        invoices,
        warehouses,
        warehouseItems,
        warehouseReservations,
        portContainers,
        borderCrossings,
        claims,
        contracts,
        crmOpportunities,
        digitalTwinScenarios,
        anomalyAlerts,
        negotiationOffers,
        bulkShipmentRows,
        customsDeclarations,
        t,
        isAiCopilotOpen,
        setIsAiCopilotOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toasts,
        showToast,
        dismissToast,
        updateShipmentStatus,
        assignVehicleToShipment,
        addShipment,
        reserveWarehouseSpace,
        updateContainerStatus,
        submitClaim,
        updateClaimStatus,
        submitCustomsDeclaration,
        updateCustomsDeclarationStatus,
        counterNegotiationOffer,
        acceptNegotiationOffer,
        importBulkShipments,
        resolveIncident,
        payInvoice,
        topUpWallet,
        resetToFactoryDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
