'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  ThemeMode,
  Shipment,
  Vehicle,
  Carrier,
  Driver,
  BackhaulOpportunity,
  Incident,
  Invoice,
} from '@/types';
import {
  mockShipments,
  mockVehicles,
  mockCarriers,
  mockDrivers,
  mockBackhaulOpportunities,
  mockIncidents,
  mockInvoices,
} from './mock-data';
import { dictionary } from './i18n';

export type AppView =
  | 'landing'
  | 'control_tower'
  | 'marketplace'
  | 'smart_dispatch'
  | 'shipments'
  | 'create_shipment'
  | 'tracking_detail'
  | 'fleet'
  | 'carrier_portal'
  | 'driver_app'
  | 'driver_safety_mode'
  | 'finance'
  | 'incidents'
  | 'analytics';

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
  shipments: Shipment[];
  vehicles: Vehicle[];
  carriers: Carrier[];
  drivers: Driver[];
  backhauls: BackhaulOpportunity[];
  incidents: Incident[];
  invoices: Invoice[];
  t: typeof dictionary.ar;
  isAiCopilotOpen: boolean;
  setIsAiCopilotOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  updateShipmentStatus: (id: string, newStatus: any) => void;
  assignVehicleToShipment: (shipmentId: string, vehicleId: string, driverId: string) => void;
  addShipment: (shipment: Shipment) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('super_admin');
  const [lang, setLang] = useState<Language>('ar');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>('shp-001');
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [backhauls, setBackhauls] = useState<BackhaulOpportunity[]>(mockBackhaulOpportunities);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const t = dictionary[lang];

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
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status === 'in_transit') {
            // Jiggle coordinates slightly to simulate smooth continuous GPS streaming
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

  const updateShipmentStatus = (id: string, newStatus: any) => {
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
    // Mark vehicle as assigned
    setVehicles((prev) =>
      prev.map((veh) => (veh.id === vehicleId ? { ...veh, status: 'assigned' } : veh))
    );
  };

  const addShipment = (shipment: Shipment) => {
    setShipments((prev) => [shipment, ...prev]);
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
        shipments,
        vehicles,
        carriers,
        drivers,
        backhauls,
        incidents,
        invoices,
        t,
        isAiCopilotOpen,
        setIsAiCopilotOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        updateShipmentStatus,
        assignVehicleToShipment,
        addShipment,
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
