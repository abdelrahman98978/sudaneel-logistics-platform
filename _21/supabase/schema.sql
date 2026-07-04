-- ============================================================
-- Sudanil Logistics Platform — Supabase Database Schema
-- Full Production Schema with RLS Policies
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  full_name_en TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'manager', 'accountant', 'logistics', 'customer')),
  avatar_url TEXT DEFAULT '',
  company_name TEXT DEFAULT '',
  company_name_en TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  public.get_current_user_role() = 'admin'
);
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (
  public.get_current_user_role() = 'admin'
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. WAREHOUSES / TERMINALS
-- ============================================================
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  city_ar TEXT DEFAULT '',
  city_en TEXT DEFAULT '',
  capacity_total INTEGER NOT NULL DEFAULT 0,
  capacity_current INTEGER NOT NULL DEFAULT 0,
  occupancy_pct NUMERIC(5,2) GENERATED ALWAYS AS (
    CASE WHEN capacity_total > 0 THEN ROUND((capacity_current::NUMERIC / capacity_total) * 100, 2) ELSE 0 END
  ) STORED,
  status TEXT NOT NULL DEFAULT 'stable' CHECK (status IN ('stable', 'critical', 'offline')),
  lat NUMERIC(10,6) DEFAULT 0,
  lng NUMERIC(10,6) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can view warehouses" ON warehouses;
DROP POLICY IF EXISTS "Admins can manage warehouses" ON warehouses;
CREATE POLICY "Authenticated users can view warehouses" ON warehouses FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins can manage warehouses" ON warehouses FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager')
);

-- ============================================================
-- 3. CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT '',
  company_ar TEXT DEFAULT '',
  company_en TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  tier TEXT DEFAULT 'standard' CHECK (tier IN ('standard', 'gold', 'platinum', 'vip')),
  rating TEXT DEFAULT 'Silver' CHECK (rating IN ('Bronze', 'Silver', 'Gold', 'Platinum')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  total_shipments INTEGER DEFAULT 0,
  total_payments NUMERIC(14,2) DEFAULT 0,
  satisfaction INTEGER DEFAULT 0 CHECK (satisfaction >= 0 AND satisfaction <= 100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view customers" ON customers;
DROP POLICY IF EXISTS "Admins can manage customers" ON customers;
CREATE POLICY "Authenticated can view customers" ON customers FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admins can manage customers" ON customers FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager')
);

-- ============================================================
-- 4. SHIPMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  dest_ar TEXT NOT NULL DEFAULT '',
  dest_en TEXT NOT NULL DEFAULT '',
  cargo_ar TEXT NOT NULL DEFAULT '',
  cargo_en TEXT NOT NULL DEFAULT '',
  cargo_weight NUMERIC(10,2) DEFAULT 0,
  route_type TEXT DEFAULT 'land' CHECK (route_type IN ('land', 'sea', 'air')),
  origin_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  destination_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'transit', 'warehouse', 'customs', 'delivered', 'cancelled')),
  customs_status TEXT DEFAULT 'pending' CHECK (customs_status IN ('pending', 'in_progress', 'released', 'failed')),
  customs_declaration_no TEXT DEFAULT '',
  estimated_delivery TIMESTAMPTZ,
  actual_delivery TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view shipments" ON shipments;
DROP POLICY IF EXISTS "Staff can manage shipments" ON shipments;
CREATE POLICY "Authenticated can view shipments" ON shipments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage shipments" ON shipments FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager', 'logistics')
);

-- ============================================================
-- 5. SHIPMENT HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS shipment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  location_ar TEXT DEFAULT '',
  location_en TEXT DEFAULT '',
  message_ar TEXT DEFAULT '',
  message_en TEXT DEFAULT '',
  status TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shipment_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view history" ON shipment_history;
DROP POLICY IF EXISTS "Staff can manage history" ON shipment_history;
CREATE POLICY "Authenticated can view history" ON shipment_history FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage history" ON shipment_history FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager', 'logistics')
);

-- ============================================================
-- 6. INVENTORY CATALOG
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT '',
  category_ar TEXT DEFAULT '',
  category_en TEXT DEFAULT '',
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  qty INTEGER DEFAULT 0,
  status TEXT DEFAULT 'normal' CHECK (status IN ('normal', 'low', 'critical', 'full')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view inventory" ON inventory;
DROP POLICY IF EXISTS "Staff can manage inventory" ON inventory;
CREATE POLICY "Authenticated can view inventory" ON inventory FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage inventory" ON inventory FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager', 'logistics')
);

-- ============================================================
-- 7. INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  shipment_id UUID REFERENCES shipments(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'overdue', 'cancelled')),
  notes TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view invoices" ON invoices;
DROP POLICY IF EXISTS "Finance can manage invoices" ON invoices;
CREATE POLICY "Authenticated can view invoices" ON invoices FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Finance can manage invoices" ON invoices FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager', 'accountant')
);

-- ============================================================
-- 8. FLEET
-- ============================================================
CREATE TABLE IF NOT EXISTS fleet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_code TEXT UNIQUE NOT NULL,
  type_ar TEXT NOT NULL DEFAULT '',
  type_en TEXT NOT NULL DEFAULT '',
  driver_ar TEXT DEFAULT '',
  driver_en TEXT DEFAULT '',
  location_ar TEXT DEFAULT '',
  location_en TEXT DEFAULT '',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  fuel_consumption NUMERIC(5,2) DEFAULT 0,
  fuel_capacity INTEGER DEFAULT 0,
  last_service DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fleet ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view fleet" ON fleet;
DROP POLICY IF EXISTS "Staff can manage fleet" ON fleet;
CREATE POLICY "Authenticated can view fleet" ON fleet FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Staff can manage fleet" ON fleet FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager', 'logistics')
);

-- ============================================================
-- 9. EMPLOYEES (HR)
-- ============================================================
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT '',
  department_ar TEXT DEFAULT '',
  department_en TEXT DEFAULT '',
  position_ar TEXT DEFAULT '',
  position_en TEXT DEFAULT '',
  hire_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')),
  attendance_pct INTEGER DEFAULT 0 CHECK (attendance_pct >= 0 AND attendance_pct <= 100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view employees" ON employees;
DROP POLICY IF EXISTS "HR can manage employees" ON employees;
CREATE POLICY "Authenticated can view employees" ON employees FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "HR can manage employees" ON employees FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'manager')
);

-- ============================================================
-- 10. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'system' CHECK (type IN ('shipment', 'capacity', 'invoice', 'fleet', 'system', 'hr')),
  title_ar TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  desc_ar TEXT DEFAULT '',
  desc_en TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own notifications" ON notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
DROP POLICY IF EXISTS "Admins manage all notifications" ON notifications;
DROP POLICY IF EXISTS "Authenticated can insert notifications" ON notifications;
CREATE POLICY "Users see own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all notifications" ON notifications FOR ALL USING (
  public.get_current_user_role() = 'admin'
);
-- Allow system inserts
CREATE POLICY "Authenticated can insert notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (TRUE);

-- ============================================================
-- 11. ACTIVITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_name_ar TEXT DEFAULT '',
  user_name_en TEXT DEFAULT '',
  action_ar TEXT NOT NULL DEFAULT '',
  action_en TEXT NOT NULL DEFAULT '',
  entity_type TEXT DEFAULT '',
  entity_id TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view activity" ON activity_log;
DROP POLICY IF EXISTS "Authenticated can insert activity" ON activity_log;
CREATE POLICY "Authenticated can view activity" ON activity_log FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Authenticated can insert activity" ON activity_log FOR INSERT TO authenticated WITH CHECK (TRUE);

-- ============================================================
-- 12. HELPER FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY['profiles', 'warehouses', 'customers', 'shipments', 'inventory', 'invoices', 'fleet', 'employees'])
  LOOP
    EXECUTE format('
      CREATE OR REPLACE TRIGGER set_updated_at
        BEFORE UPDATE ON %I
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', t);
  END LOOP;
END;
$$;

-- ============================================================
-- 13. REALTIME SUBSCRIPTIONS
-- ============================================================
-- Enable realtime for key tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    WHERE p.pubname = 'supabase_realtime' AND c.relname = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    WHERE p.pubname = 'supabase_realtime' AND c.relname = 'shipments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE shipments;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_rel pr
    JOIN pg_publication p ON p.oid = pr.prpubid
    JOIN pg_class c ON c.oid = pr.prrelid
    WHERE p.pubname = 'supabase_realtime' AND c.relname = 'activity_log'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE activity_log;
  END IF;
END $$;
