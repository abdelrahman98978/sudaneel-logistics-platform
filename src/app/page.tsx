'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { CommandPalette } from '@/components/common/CommandPalette';
import { AiCopilotDrawer } from '@/components/common/AiCopilotDrawer';
import { TeslaToastContainer } from '@/components/common/TeslaToast';

// Operations & Core Views
import { ControlTowerView } from '@/components/control-tower/ControlTowerView';
import { MarketplaceView } from '@/components/marketplace/MarketplaceView';
import { SmartDispatchView } from '@/components/dispatch/SmartDispatchView';
import { ShipmentsListView } from '@/components/shipments/ShipmentsListView';
import { CreateShipmentWizard } from '@/components/shipments/CreateShipmentWizard';
import { BulkOrdersView } from '@/components/shipments/BulkOrdersView';
import { ShipmentTrackingPassport } from '@/components/shipments/ShipmentTrackingPassport';
import { PublicTrackingView } from '@/components/public-tracking/PublicTrackingView';
import { FleetView } from '@/components/fleet/FleetView';
import { CarrierPortalView } from '@/components/carrier-portal/CarrierPortalView';
import { DriverAppView } from '@/components/driver-app/DriverAppView';

// Infrastructure & Ecosystem Views
import { WarehouseView } from '@/components/warehousing/WarehouseView';
import { PortSudanView } from '@/components/port-sudan/PortSudanView';
import { CrossBorderView } from '@/components/cross-border/CrossBorderView';

// Finance, Risk & Intelligence Views
import { IncidentCenterView } from '@/components/incidents/IncidentCenterView';
import { ClaimsView } from '@/components/claims/ClaimsView';
import { FinanceView } from '@/components/finance/FinanceView';
import { ContractsCrmView } from '@/components/crm-contracts/ContractsCrmView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { AiCenterView } from '@/components/ai-center/AiCenterView';
import { ReportsView } from '@/components/reports/ReportsView';
import { LocationsView } from '@/components/locations/LocationsView';
import { SupportCenterView } from '@/components/support/SupportCenterView';
import { InvoicesLedgerView } from '@/components/finance/InvoicesLedgerView';
import { SettingsRbacView } from '@/components/settings/SettingsRbacView';
import { LandingView } from '@/components/landing/LandingView';

export default function Home() {
  const { currentView } = useApp();

  // If in public landing mode, render the full-viewport edge-to-edge digital showroom
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#FFFFFF] text-[#171A20] selection:bg-[#3E6AE1] selection:text-[#FFFFFF] font-sans">
        <CommandPalette />
        <AiCopilotDrawer />
        <TeslaToastContainer />
        <LandingView />
      </div>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'control_tower':
        return <ControlTowerView />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'smart_dispatch':
        return <SmartDispatchView />;
      case 'shipments':
        return <ShipmentsListView />;
      case 'create_shipment':
        return <CreateShipmentWizard />;
      case 'bulk_orders':
        return <BulkOrdersView />;
      case 'tracking_detail':
        return <ShipmentTrackingPassport />;
      case 'public_track':
        return <PublicTrackingView />;
      case 'fleet':
        return <FleetView />;
      case 'carrier_portal':
        return <CarrierPortalView />;
      case 'driver_app':
      case 'driver_safety':
        return <DriverAppView />;
      case 'warehousing':
        return <WarehouseView />;
      case 'port_sudan':
        return <PortSudanView />;
      case 'cross_border':
        return <CrossBorderView />;
      case 'incidents':
        return <IncidentCenterView />;
      case 'claims':
        return <ClaimsView />;
      case 'finance':
        return <FinanceView />;
      case 'contracts_crm':
        return <ContractsCrmView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'ai_center':
        return <AiCenterView />;
      case 'reports':
        return <ReportsView />;
      case 'locations':
        return <LocationsView />;
      case 'support_center':
        return <SupportCenterView />;
      case 'invoices_ledger':
        return <InvoicesLedgerView />;
      case 'settings_rbac':
        return <SettingsRbacView />;
      default:
        return <ControlTowerView />;
    }
  };

  // Internal Operations OS Layout (Sidebar + Topbar + Content)
  return (
    <div className="flex min-h-screen bg-[#F4F4F4] text-[#171A20] selection:bg-[#3E6AE1] selection:text-[#FFFFFF] font-sans">
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Global AI Copilot Assistant Drawer */}
      <AiCopilotDrawer />

      {/* Global Tesla Toast Notifications Container */}
      <TeslaToastContainer />

      {/* Left / Right Sidebar */}
      <Sidebar />

      {/* Main Operations Dynamic Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto custom-scrollbar bg-[#F4F4F4]">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
