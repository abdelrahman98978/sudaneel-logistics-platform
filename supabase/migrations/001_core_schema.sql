-- ============================================================
-- Sudaneel Logistics Intelligence Platform
-- Phase 1: Core MVP Database Schema
-- ============================================================
-- This migration creates all Phase 1 tables with proper
-- constraints, indexes, enums, and Row Level Security.
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial data

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE org_type AS ENUM ('logistics_provider', 'shipper', 'carrier', 'warehouse_operator');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE customer_type AS ENUM ('individual', 'company', 'government', 'ngo');
CREATE TYPE customer_rating AS ENUM ('platinum', 'gold', 'silver', 'bronze', 'standard');
CREATE TYPE carrier_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification', 'blacklisted');
CREATE TYPE driver_status AS ENUM ('available', 'on_trip', 'offline', 'on_break', 'suspended', 'pending_verification');
CREATE TYPE vehicle_type AS ENUM ('truck', 'pickup', 'van', 'flatbed', 'reefer', 'tanker', 'container', 'trailer', 'custom');
CREATE TYPE vehicle_status AS ENUM ('available', 'assigned', 'loading', 'in_transit', 'maintenance', 'offline', 'blocked');
CREATE TYPE shipment_status AS ENUM (
  'draft', 'quote_requested', 'quoted', 'confirmed',
  'awaiting_carrier', 'carrier_assigned', 'driver_assigned',
  'en_route_pickup', 'at_pickup', 'loading',
  'in_transit', 'delayed', 'at_destination', 'unloading',
  'delivered', 'pod_verified', 'completed',
  'cancelled', 'failed'
);
CREATE TYPE cargo_type AS ENUM ('general', 'fragile', 'dangerous', 'perishable', 'liquid', 'bulk', 'container', 'oversized', 'valuable');
CREATE TYPE quote_status AS ENUM ('pending', 'sent', 'accepted', 'rejected', 'expired', 'countered');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'partially_paid', 'overdue', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('bank_transfer', 'cash', 'check', 'mobile_money', 'credit', 'wallet');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'cancelled');
CREATE TYPE notification_type AS ENUM ('shipment', 'quote', 'invoice', 'payment', 'incident', 'system', 'alert', 'reminder');
CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE document_type AS ENUM (
  'driver_license', 'vehicle_registration', 'insurance',
  'contract', 'invoice', 'pod', 'customs', 'certificate',
  'photo', 'signature', 'other'
);
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_type AS ENUM (
  'accident', 'breakdown', 'medical', 'cargo_damage',
  'theft', 'route_blocked', 'security', 'driver_unreachable',
  'customer_refused', 'gps_lost', 'internet_lost', 'temperature_violation'
);

-- ============================================================
-- 1. IDENTITY & ORGANIZATIONS
-- ============================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  type org_type NOT NULL DEFAULT 'logistics_provider',
  logo_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Sudan',
  tax_number VARCHAR(100),
  registration_number VARCHAR(100),
  website VARCHAR(255),
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  code VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Sudan',
  phone VARCHAR(50),
  email VARCHAR(255),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_headquarters BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. USERS, ROLES & PERMISSIONS
-- ============================================================

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  name_ar VARCHAR(100),
  description TEXT,
  is_system BOOLEAN DEFAULT false, -- System roles can't be deleted
  permissions JSONB DEFAULT '[]', -- Array of permission strings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, name)
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id),
  branch_id UUID REFERENCES branches(id),
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  full_name_ar VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  job_title VARCHAR(100),
  status user_status DEFAULT 'active',
  language VARCHAR(5) DEFAULT 'ar',
  theme VARCHAR(10) DEFAULT 'light',
  timezone VARCHAR(50) DEFAULT 'Africa/Khartoum',
  last_login_at TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- ============================================================
-- 3. CUSTOMERS
-- ============================================================

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  type customer_type DEFAULT 'company',
  rating customer_rating DEFAULT 'standard',
  email VARCHAR(255),
  phone VARCHAR(50),
  secondary_phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Sudan',
  tax_number VARCHAR(100),
  registration_number VARCHAR(100),
  industry VARCHAR(100),
  website VARCHAR(255),
  logo_url TEXT,
  credit_limit DECIMAL(15,2) DEFAULT 0,
  payment_terms INTEGER DEFAULT 30, -- days
  notes TEXT,
  tags TEXT[],
  lifetime_value DECIMAL(15,2) DEFAULT 0,
  total_shipments INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customer_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  job_title VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. CARRIERS
-- ============================================================

CREATE TABLE carriers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Sudan',
  registration_number VARCHAR(100),
  tax_number VARCHAR(100),
  fleet_size INTEGER DEFAULT 0,
  driver_count INTEGER DEFAULT 0,
  status carrier_status DEFAULT 'pending_verification',
  trust_score DECIMAL(5,2) DEFAULT 50.00, -- 0-100
  on_time_delivery_rate DECIMAL(5,2) DEFAULT 0,
  cancellation_rate DECIMAL(5,2) DEFAULT 0,
  damage_rate DECIMAL(5,2) DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  completed_trips INTEGER DEFAULT 0,
  insurance_number VARCHAR(100),
  insurance_expiry DATE,
  bank_name VARCHAR(100),
  bank_account VARCHAR(100),
  bank_iban VARCHAR(100),
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. DRIVERS
-- ============================================================

CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id), -- Links to auth user if driver has app access
  carrier_id UUID REFERENCES carriers(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  secondary_phone VARCHAR(50),
  email VARCHAR(255),
  national_id VARCHAR(50),
  license_number VARCHAR(50),
  license_type VARCHAR(20),
  license_expiry DATE,
  date_of_birth DATE,
  photo_url TEXT,
  status driver_status DEFAULT 'pending_verification',
  trust_score DECIMAL(5,2) DEFAULT 50.00,
  total_trips INTEGER DEFAULT 0,
  completed_trips INTEGER DEFAULT 0,
  on_time_delivery_rate DECIMAL(5,2) DEFAULT 0,
  current_latitude DOUBLE PRECISION,
  current_longitude DOUBLE PRECISION,
  last_location_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. VEHICLES / FLEET
-- ============================================================

CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  carrier_id UUID REFERENCES carriers(id) ON DELETE SET NULL,
  plate_number VARCHAR(20) NOT NULL,
  type vehicle_type NOT NULL DEFAULT 'truck',
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  color VARCHAR(50),
  capacity_tons DECIMAL(10,2),
  capacity_volume_m3 DECIMAL(10,2),
  fuel_type VARCHAR(20) DEFAULT 'diesel',
  status vehicle_status DEFAULT 'available',
  current_driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  current_mileage DECIMAL(12,2) DEFAULT 0,
  insurance_number VARCHAR(100),
  insurance_expiry DATE,
  registration_expiry DATE,
  last_inspection_date DATE,
  next_maintenance_date DATE,
  next_maintenance_km DECIMAL(12,2),
  current_latitude DOUBLE PRECISION,
  current_longitude DOUBLE PRECISION,
  last_location_at TIMESTAMPTZ,
  gps_device_id VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, plate_number)
);

CREATE TABLE vehicle_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  title VARCHAR(255),
  file_url TEXT,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE driver_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  title VARCHAR(255),
  file_url TEXT,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. SHIPMENTS
-- ============================================================

CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  tracking_number VARCHAR(20) NOT NULL UNIQUE,
  reference_number VARCHAR(50),
  customer_id UUID NOT NULL REFERENCES customers(id),
  
  -- Status (State Machine)
  status shipment_status DEFAULT 'draft',
  previous_status shipment_status,
  status_changed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Pickup
  pickup_address TEXT NOT NULL,
  pickup_city VARCHAR(100) NOT NULL,
  pickup_country VARCHAR(100) DEFAULT 'Sudan',
  pickup_latitude DOUBLE PRECISION,
  pickup_longitude DOUBLE PRECISION,
  pickup_contact_name VARCHAR(255),
  pickup_contact_phone VARCHAR(50),
  pickup_date DATE,
  pickup_time_from TIME,
  pickup_time_to TIME,
  actual_pickup_at TIMESTAMPTZ,
  
  -- Destination
  delivery_address TEXT NOT NULL,
  delivery_city VARCHAR(100) NOT NULL,
  delivery_country VARCHAR(100) DEFAULT 'Sudan',
  delivery_latitude DOUBLE PRECISION,
  delivery_longitude DOUBLE PRECISION,
  delivery_contact_name VARCHAR(255),
  delivery_contact_phone VARCHAR(50),
  delivery_date DATE,
  delivery_time_from TIME,
  delivery_time_to TIME,
  actual_delivery_at TIMESTAMPTZ,
  
  -- Cargo
  cargo_type cargo_type DEFAULT 'general',
  cargo_description TEXT,
  total_weight_kg DECIMAL(12,2),
  total_volume_m3 DECIMAL(12,2),
  total_pallets INTEGER,
  declared_value DECIMAL(15,2),
  is_fragile BOOLEAN DEFAULT false,
  is_dangerous BOOLEAN DEFAULT false,
  is_temperature_controlled BOOLEAN DEFAULT false,
  temperature_min DECIMAL(5,2),
  temperature_max DECIMAL(5,2),
  
  -- Vehicle Requirements
  required_vehicle_type vehicle_type,
  
  -- Assignment
  carrier_id UUID REFERENCES carriers(id),
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  assigned_at TIMESTAMPTZ,
  assigned_by UUID REFERENCES profiles(id),
  
  -- Pricing
  quoted_price DECIMAL(15,2),
  agreed_price DECIMAL(15,2),
  currency VARCHAR(3) DEFAULT 'SDG',
  
  -- Route
  distance_km DECIMAL(10,2),
  estimated_duration_hours DECIMAL(6,2),
  estimated_eta TIMESTAMPTZ,
  actual_eta TIMESTAMPTZ,
  eta_confidence DECIMAL(5,2), -- Predictive ETA confidence %
  
  -- Services
  needs_loading BOOLEAN DEFAULT false,
  needs_unloading BOOLEAN DEFAULT false,
  needs_insurance BOOLEAN DEFAULT false,
  needs_warehousing BOOLEAN DEFAULT false,
  needs_packaging BOOLEAN DEFAULT false,
  is_cod BOOLEAN DEFAULT false,
  cod_amount DECIMAL(15,2),
  priority VARCHAR(20) DEFAULT 'normal', -- normal, express, priority
  
  -- POD
  pod_type VARCHAR(20), -- otp, signature, photo
  pod_otp VARCHAR(10),
  pod_signature_url TEXT,
  pod_photo_url TEXT,
  pod_receiver_name VARCHAR(255),
  pod_received_at TIMESTAMPTZ,
  pod_latitude DOUBLE PRECISION,
  pod_longitude DOUBLE PRECISION,
  
  -- Metadata
  internal_notes TEXT,
  customer_notes TEXT,
  tags TEXT[],
  is_international BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shipment_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  weight_kg DECIMAL(10,2),
  length_cm DECIMAL(8,2),
  width_cm DECIMAL(8,2),
  height_cm DECIMAL(8,2),
  value DECIMAL(15,2),
  is_fragile BOOLEAN DEFAULT false,
  is_dangerous BOOLEAN DEFAULT false,
  hs_code VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shipment_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL,
  type VARCHAR(20) DEFAULT 'stop', -- pickup, delivery, stop, checkpoint
  address TEXT NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Sudan',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  contact_name VARCHAR(255),
  contact_phone VARCHAR(50),
  scheduled_at TIMESTAMPTZ,
  actual_arrival_at TIMESTAMPTZ,
  actual_departure_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shipment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- status_change, note, location, document, etc.
  status shipment_status,
  previous_status shipment_status,
  title VARCHAR(255),
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. QUOTES & PRICING
-- ============================================================

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  quote_number VARCHAR(20) NOT NULL UNIQUE,
  status quote_status DEFAULT 'pending',
  
  -- Pricing Breakdown
  base_rate DECIMAL(15,2) DEFAULT 0,
  distance_charge DECIMAL(15,2) DEFAULT 0,
  fuel_surcharge DECIMAL(15,2) DEFAULT 0,
  loading_charge DECIMAL(15,2) DEFAULT 0,
  unloading_charge DECIMAL(15,2) DEFAULT 0,
  insurance_charge DECIMAL(15,2) DEFAULT 0,
  risk_charge DECIMAL(15,2) DEFAULT 0,
  platform_fee DECIMAL(15,2) DEFAULT 0,
  discount DECIMAL(15,2) DEFAULT 0,
  tax DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'SDG',
  
  valid_until TIMESTAMPTZ,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. ASSIGNMENTS & DISPATCH
-- ============================================================

CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  carrier_id UUID REFERENCES carriers(id),
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  match_score DECIMAL(5,2), -- AI match quality score
  match_reasons JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, rejected, completed, cancelled
  cost DECIMAL(15,2),
  carrier_payout DECIMAL(15,2),
  driver_payout DECIMAL(15,2),
  platform_revenue DECIMAL(15,2),
  assigned_by UUID REFERENCES profiles(id),
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 10. GPS & TRACKING
-- ============================================================

CREATE TABLE gps_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed DECIMAL(6,2), -- km/h
  heading DECIMAL(5,2), -- degrees
  altitude DECIMAL(8,2),
  accuracy DECIMAL(8,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE geofences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) DEFAULT 'circle', -- circle, polygon
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  radius_meters DECIMAL(10,2), -- for circle type
  polygon JSONB, -- GeoJSON for polygon type
  trigger_on_enter BOOLEAN DEFAULT true,
  trigger_on_exit BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 11. FINANCE
-- ============================================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_number VARCHAR(20) NOT NULL UNIQUE,
  shipment_id UUID REFERENCES shipments(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  status invoice_status DEFAULT 'draft',
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  amount_paid DECIMAL(15,2) DEFAULT 0,
  amount_due DECIMAL(15,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'SDG',
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id),
  customer_id UUID REFERENCES customers(id),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'SDG',
  method payment_method DEFAULT 'bank_transfer',
  status payment_status DEFAULT 'pending',
  reference VARCHAR(100),
  notes TEXT,
  paid_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. INCIDENTS
-- ============================================================

CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  incident_number VARCHAR(20) NOT NULL UNIQUE,
  shipment_id UUID REFERENCES shipments(id),
  driver_id UUID REFERENCES drivers(id),
  vehicle_id UUID REFERENCES vehicles(id),
  type incident_type NOT NULL,
  severity incident_severity DEFAULT 'medium',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  status VARCHAR(20) DEFAULT 'open', -- open, investigating, resolved, closed
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES profiles(id),
  reported_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 13. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  org_id UUID REFERENCES organizations(id),
  type notification_type DEFAULT 'system',
  priority notification_priority DEFAULT 'normal',
  title VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255),
  message TEXT,
  message_ar TEXT,
  link VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 14. AUDIT LOGS
-- ============================================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES organizations(id),
  user_id UUID REFERENCES profiles(id),
  action VARCHAR(50) NOT NULL, -- create, update, delete, login, etc.
  resource_type VARCHAR(50) NOT NULL, -- shipment, customer, invoice, etc.
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Make audit_logs append-only (no updates or deletes)
CREATE RULE audit_no_update AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE RULE audit_no_delete AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

-- ============================================================
-- 15. DOCUMENTS
-- ============================================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type document_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  entity_type VARCHAR(50), -- shipment, carrier, driver, vehicle, etc.
  entity_id UUID,
  expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES profiles(id),
  verified_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Organizations & Users
CREATE INDEX idx_branches_org ON branches(org_id);
CREATE INDEX idx_profiles_org ON profiles(org_id);
CREATE INDEX idx_profiles_branch ON profiles(branch_id);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- Customers
CREATE INDEX idx_customers_org ON customers(org_id);
CREATE INDEX idx_customers_rating ON customers(org_id, rating);
CREATE INDEX idx_customer_contacts_customer ON customer_contacts(customer_id);

-- Carriers & Drivers & Vehicles
CREATE INDEX idx_carriers_org ON carriers(org_id);
CREATE INDEX idx_carriers_status ON carriers(org_id, status);
CREATE INDEX idx_carriers_trust ON carriers(org_id, trust_score DESC);
CREATE INDEX idx_drivers_org ON drivers(org_id);
CREATE INDEX idx_drivers_carrier ON drivers(carrier_id);
CREATE INDEX idx_drivers_status ON drivers(org_id, status);
CREATE INDEX idx_vehicles_org ON vehicles(org_id);
CREATE INDEX idx_vehicles_carrier ON vehicles(carrier_id);
CREATE INDEX idx_vehicles_status ON vehicles(org_id, status);
CREATE INDEX idx_vehicles_type ON vehicles(org_id, type);

-- Shipments
CREATE INDEX idx_shipments_org ON shipments(org_id);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_customer ON shipments(customer_id);
CREATE INDEX idx_shipments_status ON shipments(org_id, status);
CREATE INDEX idx_shipments_carrier ON shipments(carrier_id);
CREATE INDEX idx_shipments_driver ON shipments(driver_id);
CREATE INDEX idx_shipments_dates ON shipments(pickup_date, delivery_date);
CREATE INDEX idx_shipments_created ON shipments(created_at DESC);
CREATE INDEX idx_shipment_events_shipment ON shipment_events(shipment_id, created_at DESC);
CREATE INDEX idx_shipment_stops_shipment ON shipment_stops(shipment_id, stop_order);

-- Quotes
CREATE INDEX idx_quotes_org ON quotes(org_id);
CREATE INDEX idx_quotes_shipment ON quotes(shipment_id);
CREATE INDEX idx_quotes_customer ON quotes(customer_id);
CREATE INDEX idx_quotes_status ON quotes(org_id, status);

-- Assignments
CREATE INDEX idx_assignments_shipment ON assignments(shipment_id);
CREATE INDEX idx_assignments_carrier ON assignments(carrier_id);
CREATE INDEX idx_assignments_driver ON assignments(driver_id);

-- GPS
CREATE INDEX idx_gps_vehicle ON gps_events(vehicle_id, recorded_at DESC);
CREATE INDEX idx_gps_driver ON gps_events(driver_id, recorded_at DESC);
CREATE INDEX idx_gps_shipment ON gps_events(shipment_id, recorded_at DESC);

-- Finance
CREATE INDEX idx_invoices_org ON invoices(org_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_shipment ON invoices(shipment_id);
CREATE INDEX idx_invoices_status ON invoices(org_id, status);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);

-- Incidents
CREATE INDEX idx_incidents_org ON incidents(org_id);
CREATE INDEX idx_incidents_shipment ON incidents(shipment_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_org ON notifications(org_id);

-- Audit
CREATE INDEX idx_audit_org ON audit_logs(org_id, created_at DESC);
CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);

-- Documents
CREATE INDEX idx_documents_org ON documents(org_id);
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_expiry ON documents(expiry_date) WHERE expiry_date IS NOT NULL;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate tracking number
CREATE OR REPLACE FUNCTION generate_tracking_number()
RETURNS TEXT AS $$
DECLARE
  result TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM shipments;
  result := 'SDN-' || LPAD(counter::TEXT, 6, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  result TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM invoices;
  result := 'INV-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(counter::TEXT, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Generate quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  result TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM quotes;
  result := 'QTE-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(counter::TEXT, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Generate incident number
CREATE OR REPLACE FUNCTION generate_incident_number()
RETURNS TEXT AS $$
DECLARE
  result TEXT;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM incidents;
  result := 'INC-' || TO_CHAR(NOW(), 'YYMM') || '-' || LPAD(counter::TEXT, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update timestamps
CREATE TRIGGER trg_organizations_updated BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_branches_updated BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_carriers_updated BEFORE UPDATE ON carriers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_drivers_updated BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_shipments_updated BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_quotes_updated BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_assignments_updated BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_invoices_updated BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_incidents_updated BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate tracking number on shipment creation
CREATE OR REPLACE FUNCTION set_tracking_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_number IS NULL OR NEW.tracking_number = '' THEN
    NEW.tracking_number := generate_tracking_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_shipment_tracking BEFORE INSERT ON shipments FOR EACH ROW EXECUTE FUNCTION set_tracking_number();

-- Auto-generate invoice number
CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
    NEW.invoice_number := generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_number BEFORE INSERT ON invoices FOR EACH ROW EXECUTE FUNCTION set_invoice_number();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile
CREATE POLICY profiles_own ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (id = auth.uid());

-- Notifications: users see only their own
CREATE POLICY notifications_own ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY notifications_update_own ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Service role bypass for all tables
CREATE POLICY service_role_all_organizations ON organizations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_branches ON branches FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_profiles ON profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_customers ON customers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_carriers ON carriers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_drivers ON drivers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_vehicles ON vehicles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_shipments ON shipments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_invoices ON invoices FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_notifications ON notifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_all_audit ON audit_logs FOR ALL USING (auth.role() = 'service_role');

-- Org-scoped access for authenticated users (via profile's org_id)
CREATE POLICY org_customers ON customers FOR SELECT USING (
  org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY org_carriers ON carriers FOR SELECT USING (
  org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY org_drivers ON drivers FOR SELECT USING (
  org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY org_vehicles ON vehicles FOR SELECT USING (
  org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY org_shipments ON shipments FOR SELECT USING (
  org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
);
CREATE POLICY org_invoices ON invoices FOR SELECT USING (
  org_id IN (SELECT org_id FROM profiles WHERE id = auth.uid())
);

-- Public tracking: allow anonymous read of shipment by tracking number
CREATE POLICY public_tracking ON shipments FOR SELECT USING (true);
