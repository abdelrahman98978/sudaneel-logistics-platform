'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { CommandPalette } from '@/components/common/CommandPalette';
import { AiCopilotDrawer } from '@/components/common/AiCopilotDrawer';

// View Components
import { ControlTowerView } from '@/components/control-tower/ControlTowerView';
import { MarketplaceView } from '@/components/marketplace/MarketplaceView';
import { SmartDispatchView } from '@/components/dispatch/SmartDispatchView';
import { ShipmentsListView } from '@/components/shipments/ShipmentsListView';
import { CreateShipmentWizard } from '@/components/shipments/CreateShipmentWizard';
import { ShipmentTrackingPassport } from '@/components/shipments/ShipmentTrackingPassport';
import { FleetView } from '@/components/fleet/FleetView';
import { CarrierPortalView } from '@/components/carrier-portal/CarrierPortalView';
import { DriverAppView } from '@/components/driver-app/DriverAppView';
import { IncidentCenterView } from '@/components/incidents/IncidentCenterView';
import { FinanceView } from '@/components/finance/FinanceView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { LandingView } from '@/components/landing/LandingView';

export default function Home() {
  const { currentView } = useApp();

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
      case 'tracking_detail':
        return <ShipmentTrackingPassport />;
      case 'fleet':
        return <FleetView />;
      case 'carrier_portal':
        return <CarrierPortalView />;
      case 'driver_app':
        return <DriverAppView />;
      case 'incidents':
        return <IncidentCenterView />;
      case 'finance':
        return <FinanceView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'landing':
        return <LandingView />;
      default:
        return <ControlTowerView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-navy-950 text-gray-100 selection:bg-gold selection:text-navy-950 font-sans">
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Global AI Copilot Assistant Drawer */}
      <AiCopilotDrawer />

      {/* Left / Right Sidebar based on direction */}
      <Sidebar />

      {/* Main Dynamic Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto custom-scrollbar">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
