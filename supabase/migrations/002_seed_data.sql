-- ============================================================
-- Sudaneel Logistics Intelligence Platform
-- Seed Data for Development & Demo
-- ============================================================

-- 1. Create the main Sudaneel organization
INSERT INTO organizations (id, name, name_ar, type, email, phone, city, country, website) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Sudaneel Logistics', 'سودانيل لوجستيكس', 'logistics_provider', 'info@sudaneel.com', '+249123456789', 'Khartoum', 'Sudan', 'https://sudaneel.com');

-- 2. Branches
INSERT INTO branches (id, org_id, name, name_ar, code, city, country, is_headquarters, latitude, longitude) VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Khartoum HQ', 'المقر الرئيسي - الخرطوم', 'KRT', 'Khartoum', 'Sudan', true, 15.5007, 32.5599),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'Port Sudan Branch', 'فرع بورتسودان', 'PSD', 'Port Sudan', 'Sudan', false, 19.6158, 37.2164),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'Medani Branch', 'فرع ود مدني', 'MDN', 'Wad Madani', 'Sudan', false, 14.4011, 33.5197);

-- 3. Roles
INSERT INTO roles (id, org_id, name, name_ar, is_system, permissions) VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', 'Super Admin', 'مدير النظام', true, '["*"]'),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', 'Operations Manager', 'مدير العمليات', true, '["shipments.*","dispatch.*","tracking.*","carriers.read","drivers.read","vehicles.read","customers.read","incidents.*","reports.read"]'),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0000-000000000001', 'Dispatcher', 'منسق التوزيع', true, '["shipments.read","shipments.assign","dispatch.*","tracking.read","vehicles.read","drivers.read"]'),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0000-000000000001', 'Fleet Manager', 'مدير الأسطول', true, '["vehicles.*","drivers.*","maintenance.*","fuel.*"]'),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0000-000000000001', 'Finance Manager', 'مدير المالية', true, '["finance.*","invoices.*","payments.*","wallets.*","settlements.*","reports.financial"]'),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0000-000000000001', 'Sales Manager', 'مدير المبيعات', true, '["customers.*","quotes.*","contracts.*","crm.*"]'),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0000-000000000001', 'Customer Portal', 'بوابة العملاء', true, '["shipments.own.read","shipments.own.create","tracking.own","invoices.own.read","quotes.own.read"]'),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0000-000000000001', 'Carrier Portal', 'بوابة الناقل', true, '["loads.available","loads.own.*","vehicles.own.*","drivers.own.*","earnings.own"]'),
  ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0000-000000000001', 'Driver', 'سائق', true, '["trips.own.*","tracking.own","pod.create","incidents.create"]');

-- 4. Customers (Demo)
INSERT INTO customers (id, org_id, name, name_ar, type, rating, email, phone, city, country, industry, credit_limit, total_shipments, is_active) VALUES
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000001', 'DAL Group', 'مجموعة دال', 'company', 'platinum', 'logistics@dalgroup.com', '+249912345001', 'Khartoum', 'Sudan', 'Conglomerate', 500000, 145, true),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000001', 'Haggar Group', 'مجموعة هجار', 'company', 'gold', 'shipping@haggar.sd', '+249912345002', 'Khartoum', 'Sudan', 'Manufacturing', 300000, 89, true),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-000000000001', 'Sayga Group', 'مجموعة صايغة', 'company', 'gold', 'ops@sayga.sd', '+249912345003', 'Khartoum', 'Sudan', 'Food & Beverages', 250000, 67, true),
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-000000000001', 'GIAD Industrial Group', 'مجموعة جياد الصناعية', 'company', 'silver', 'transport@giad.sd', '+249912345004', 'Khartoum', 'Sudan', 'Industrial', 200000, 42, true),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-000000000001', 'Port Sudan Free Zone', 'المنطقة الحرة بورتسودان', 'government', 'platinum', 'ops@psfz.gov.sd', '+249912345005', 'Port Sudan', 'Sudan', 'Government', 1000000, 234, true),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0000-000000000001', 'Kenana Sugar Company', 'شركة سكر كنانة', 'company', 'gold', 'logistics@kenana.com', '+249912345006', 'Khartoum', 'Sudan', 'Agriculture', 350000, 78, true),
  ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0000-000000000001', 'Ahmed Trading Co.', 'شركة أحمد للتجارة', 'company', 'silver', 'info@ahmedtrading.sd', '+249912345007', 'Wad Madani', 'Sudan', 'Trading', 100000, 31, true),
  ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0000-000000000001', 'Red Sea Mills', 'مطاحن البحر الأحمر', 'company', 'bronze', 'shipping@rsmills.sd', '+249912345008', 'Port Sudan', 'Sudan', 'Food Processing', 150000, 23, true);

-- 5. Carriers (Demo)
INSERT INTO carriers (id, org_id, name, name_ar, email, phone, city, country, fleet_size, driver_count, status, trust_score, on_time_delivery_rate, total_trips, completed_trips) VALUES
  ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0000-000000000001', 'Nile Express Transport', 'النيل إكسبرس للنقل', 'ops@nileexpress.sd', '+249922001001', 'Khartoum', 'Sudan', 25, 30, 'active', 92.5, 95.2, 450, 428),
  ('00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0000-000000000001', 'Sahara Freight', 'الصحراء للشحن', 'contact@saharafreight.sd', '+249922001002', 'Khartoum', 'Sudan', 18, 22, 'active', 87.3, 91.8, 320, 294),
  ('00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0000-000000000001', 'Red Sea Logistics', 'البحر الأحمر للوجستيات', 'info@redseaLog.sd', '+249922001003', 'Port Sudan', 'Sudan', 32, 40, 'active', 94.1, 96.5, 580, 560),
  ('00000000-0000-0000-0004-000000000004', '00000000-0000-0000-0000-000000000001', 'Blue Nile Carriers', 'ناقلات النيل الأزرق', 'dispatch@bluenile.sd', '+249922001004', 'Wad Madani', 'Sudan', 12, 15, 'active', 85.0, 89.3, 210, 188),
  ('00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0000-000000000001', 'Desert Hawks Transport', 'صقور الصحراء للنقل', 'ops@deserthawks.sd', '+249922001005', 'Khartoum', 'Sudan', 8, 10, 'active', 78.5, 85.0, 150, 128);

-- 6. Drivers (Demo)
INSERT INTO drivers (id, org_id, carrier_id, name, name_ar, phone, license_number, status, trust_score, total_trips, completed_trips, on_time_delivery_rate, current_latitude, current_longitude) VALUES
  ('00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000001', 'Mohamed Ahmed Hassan', 'محمد أحمد حسن', '+249911001001', 'DL-KRT-2024-001', 'available', 94.0, 120, 118, 97.5, 15.5007, 32.5599),
  ('00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000001', 'Ibrahim Osman Ali', 'إبراهيم عثمان علي', '+249911001002', 'DL-KRT-2024-002', 'on_trip', 91.5, 95, 92, 96.8, 16.8921, 33.9234),
  ('00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000002', 'Khalid Yousif Mohamed', 'خالد يوسف محمد', '+249911001003', 'DL-KRT-2024-003', 'on_trip', 88.0, 78, 74, 94.9, 18.4523, 36.1234),
  ('00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000003', 'Abdalla Hamid Salih', 'عبد الله حامد صالح', '+249911001004', 'DL-PSD-2024-004', 'available', 96.0, 145, 143, 98.6, 19.6158, 37.2164),
  ('00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000003', 'Omer Babiker Idris', 'عمر بابكر إدريس', '+249911001005', 'DL-PSD-2024-005', 'on_trip', 89.5, 102, 98, 96.1, 17.7123, 35.8945),
  ('00000000-0000-0000-0005-000000000006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000004', 'Mustafa Eltayeb Adam', 'مصطفى الطيب آدم', '+249911001006', 'DL-MDN-2024-006', 'offline', 82.0, 55, 50, 90.9, 14.4011, 33.5197);

-- 7. Vehicles (Demo)
INSERT INTO vehicles (id, org_id, carrier_id, plate_number, type, make, model, year, capacity_tons, status, current_driver_id, current_mileage, current_latitude, current_longitude) VALUES
  ('00000000-0000-0000-0006-000000000001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000001', 'KRT-1234-A', 'truck', 'Mercedes-Benz', 'Actros 2645', 2022, 25.0, 'available', '00000000-0000-0000-0005-000000000001', 85000, 15.5007, 32.5599),
  ('00000000-0000-0000-0006-000000000002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000001', 'KRT-5678-B', 'truck', 'MAN', 'TGS 33.440', 2021, 22.0, 'in_transit', '00000000-0000-0000-0005-000000000002', 120000, 16.8921, 33.9234),
  ('00000000-0000-0000-0006-000000000003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000002', 'KRT-9012-C', 'flatbed', 'Volvo', 'FH16 750', 2023, 30.0, 'in_transit', '00000000-0000-0000-0005-000000000003', 45000, 18.4523, 36.1234),
  ('00000000-0000-0000-0006-000000000004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000003', 'PSD-3456-D', 'container', 'Scania', 'R500', 2022, 28.0, 'available', '00000000-0000-0000-0005-000000000004', 95000, 19.6158, 37.2164),
  ('00000000-0000-0000-0006-000000000005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000003', 'PSD-7890-E', 'reefer', 'DAF', 'XF 480', 2023, 20.0, 'in_transit', '00000000-0000-0000-0005-000000000005', 35000, 17.7123, 35.8945),
  ('00000000-0000-0000-0006-000000000006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000004', 'MDN-2345-F', 'pickup', 'Toyota', 'Hilux', 2024, 3.0, 'offline', '00000000-0000-0000-0005-000000000006', 15000, 14.4011, 33.5197),
  ('00000000-0000-0000-0006-000000000007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000001', 'KRT-1111-G', 'tanker', 'Mercedes-Benz', 'Arocs 3340', 2021, 35.0, 'maintenance', NULL, 180000, 15.5007, 32.5599),
  ('00000000-0000-0000-0006-000000000008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0004-000000000005', 'KRT-2222-H', 'van', 'Hyundai', 'H350', 2023, 2.5, 'available', NULL, 22000, 15.5100, 32.5500);

-- 8. Shipments (Demo - various statuses)
INSERT INTO shipments (id, org_id, tracking_number, customer_id, status, pickup_address, pickup_city, pickup_country, pickup_latitude, pickup_longitude, pickup_contact_name, pickup_contact_phone, pickup_date, delivery_address, delivery_city, delivery_country, delivery_latitude, delivery_longitude, delivery_contact_name, delivery_contact_phone, delivery_date, cargo_type, cargo_description, total_weight_kg, required_vehicle_type, carrier_id, driver_id, vehicle_id, agreed_price, currency, distance_km, priority, created_at) VALUES
  ('00000000-0000-0000-0007-000000000001', '00000000-0000-0000-0000-000000000001', 'SDN-000001', '00000000-0000-0000-0003-000000000001', 'in_transit', 'Industrial Area, Block 5', 'Khartoum', 'Sudan', 15.5007, 32.5599, 'Ahmed DAL', '+249912345001', CURRENT_DATE - 1, 'Port Sudan Free Zone, Gate 3', 'Port Sudan', 'Sudan', 19.6158, 37.2164, 'Hassan Port', '+249912345005', CURRENT_DATE + 1, 'general', 'Industrial Equipment Parts', 18500, 'truck', '00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0005-000000000002', '00000000-0000-0000-0006-000000000002', 85000, 'SDG', 830, 'normal', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0007-000000000002', '00000000-0000-0000-0000-000000000001', 'SDN-000002', '00000000-0000-0000-0003-000000000003', 'loading', 'Sayga Factory, North Industrial', 'Khartoum', 'Sudan', 15.6200, 32.4800, 'Omar Sayga', '+249912345003', CURRENT_DATE, 'Red Sea Mills Warehouse', 'Port Sudan', 'Sudan', 19.5800, 37.2000, 'Ali Mills', '+249912345008', CURRENT_DATE + 2, 'perishable', 'Processed Food Products', 22000, 'reefer', '00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0005-000000000005', '00000000-0000-0000-0006-000000000005', 120000, 'SDG', 845, 'express', NOW() - INTERVAL '6 hours'),
  ('00000000-0000-0000-0007-000000000003', '00000000-0000-0000-0000-000000000001', 'SDN-000003', '00000000-0000-0000-0003-000000000004', 'in_transit', 'GIAD Assembly Plant', 'Khartoum', 'Sudan', 15.4500, 32.6500, 'Salih GIAD', '+249912345004', CURRENT_DATE - 2, 'Wad Madani Distribution Center', 'Wad Madani', 'Sudan', 14.4011, 33.5197, 'Kamal Center', '+249912345007', CURRENT_DATE, 'general', 'Automotive Spare Parts', 12000, 'flatbed', '00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0005-000000000003', '00000000-0000-0000-0006-000000000003', 45000, 'SDG', 190, 'normal', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0007-000000000004', '00000000-0000-0000-0000-000000000001', 'SDN-000004', '00000000-0000-0000-0003-000000000002', 'confirmed', 'Haggar Compound, Khartoum 2', 'Khartoum', 'Sudan', 15.5500, 32.5200, 'Yousif Haggar', '+249912345002', CURRENT_DATE + 1, 'Port Sudan Industrial Zone', 'Port Sudan', 'Sudan', 19.6300, 37.2300, 'Omer Zone', '+249912345005', CURRENT_DATE + 3, 'general', 'Textile Raw Materials', 15000, 'truck', NULL, NULL, NULL, 72000, 'SDG', 835, 'normal', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0007-000000000005', '00000000-0000-0000-0000-000000000001', 'SDN-000005', '00000000-0000-0000-0003-000000000006', 'delivered', 'Kenana Sugar Refinery', 'Kenana', 'Sudan', 13.1667, 32.6667, 'Mahdi Kenana', '+249912345006', CURRENT_DATE - 5, 'Khartoum Central Market', 'Khartoum', 'Sudan', 15.6000, 32.5300, 'Market Recv', '+249912345001', CURRENT_DATE - 3, 'bulk', 'Refined Sugar - 500 bags', 25000, 'truck', '00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0006-000000000001', 55000, 'SDG', 320, 'normal', NOW() - INTERVAL '6 days'),
  ('00000000-0000-0000-0007-000000000006', '00000000-0000-0000-0000-000000000001', 'SDN-000006', '00000000-0000-0000-0003-000000000005', 'delayed', 'Port Sudan Container Terminal', 'Port Sudan', 'Sudan', 19.6158, 37.2164, 'Port Ops', '+249912345005', CURRENT_DATE - 1, 'Khartoum Industrial Area', 'Khartoum', 'Sudan', 15.5007, 32.5599, 'Factory Recv', '+249912345004', CURRENT_DATE, 'container', '2x 40ft Containers - Machinery', 35000, 'container', '00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0005-000000000004', '00000000-0000-0000-0006-000000000004', 180000, 'SDG', 830, 'priority', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0007-000000000007', '00000000-0000-0000-0000-000000000001', 'SDN-000007', '00000000-0000-0000-0003-000000000007', 'draft', 'Ahmed Trading Warehouse', 'Wad Madani', 'Sudan', 14.3900, 33.5100, 'Ahmed Trading', '+249912345007', CURRENT_DATE + 3, 'Khartoum North Market', 'Khartoum', 'Sudan', 15.6500, 32.5100, 'North Market', '+249912345001', CURRENT_DATE + 5, 'general', 'Agricultural Products', 8000, 'pickup', NULL, NULL, NULL, NULL, 'SDG', 195, 'normal', NOW()),
  ('00000000-0000-0000-0007-000000000008', '00000000-0000-0000-0000-000000000001', 'SDN-000008', '00000000-0000-0000-0003-000000000001', 'completed', 'DAL Factory Complex', 'Khartoum', 'Sudan', 15.5200, 32.5400, 'DAL Shipping', '+249912345001', CURRENT_DATE - 8, 'Atbara Distribution Hub', 'Atbara', 'Sudan', 17.7000, 33.9800, 'Atbara Hub', '+249911001006', CURRENT_DATE - 6, 'general', 'Consumer Products', 14000, 'truck', '00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0005-000000000001', '00000000-0000-0000-0006-000000000001', 62000, 'SDG', 310, 'normal', NOW() - INTERVAL '9 days');

-- 9. Shipment Events (Timeline data)
INSERT INTO shipment_events (shipment_id, event_type, status, title, description, created_at) VALUES
  -- SDN-000001 events
  ('00000000-0000-0000-0007-000000000001', 'status_change', 'draft', 'Shipment Created', 'New shipment created by DAL Group', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0007-000000000001', 'status_change', 'confirmed', 'Order Confirmed', 'Customer confirmed the shipment', NOW() - INTERVAL '2 days' + INTERVAL '1 hour'),
  ('00000000-0000-0000-0007-000000000001', 'status_change', 'carrier_assigned', 'Carrier Assigned', 'Nile Express Transport assigned', NOW() - INTERVAL '1 day' + INTERVAL '6 hours'),
  ('00000000-0000-0000-0007-000000000001', 'status_change', 'driver_assigned', 'Driver Assigned', 'Ibrahim Osman Ali assigned with vehicle KRT-5678-B', NOW() - INTERVAL '1 day' + INTERVAL '7 hours'),
  ('00000000-0000-0000-0007-000000000001', 'status_change', 'loading', 'Loading Started', 'Vehicle arrived at pickup. Loading in progress.', NOW() - INTERVAL '1 day' + INTERVAL '10 hours'),
  ('00000000-0000-0000-0007-000000000001', 'status_change', 'in_transit', 'Departed', 'Vehicle departed from Khartoum towards Port Sudan', NOW() - INTERVAL '1 day' + INTERVAL '12 hours'),
  -- SDN-000005 completed shipment events
  ('00000000-0000-0000-0007-000000000005', 'status_change', 'draft', 'Shipment Created', 'Sugar shipment from Kenana', NOW() - INTERVAL '6 days'),
  ('00000000-0000-0000-0007-000000000005', 'status_change', 'confirmed', 'Confirmed', 'Order confirmed', NOW() - INTERVAL '6 days' + INTERVAL '30 minutes'),
  ('00000000-0000-0000-0007-000000000005', 'status_change', 'in_transit', 'In Transit', 'Departed from Kenana', NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0007-000000000005', 'status_change', 'delivered', 'Delivered', 'Arrived at Khartoum Central Market', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0007-000000000005', 'status_change', 'completed', 'Completed', 'POD verified and shipment completed', NOW() - INTERVAL '3 days' + INTERVAL '2 hours');

-- 10. Invoices (Demo)
INSERT INTO invoices (id, org_id, invoice_number, shipment_id, customer_id, status, issue_date, due_date, subtotal, tax_amount, total, amount_paid, amount_due) VALUES
  ('00000000-0000-0000-0008-000000000001', '00000000-0000-0000-0000-000000000001', 'INV-2608-0001', '00000000-0000-0000-0007-000000000005', '00000000-0000-0000-0003-000000000006', 'paid', CURRENT_DATE - 3, CURRENT_DATE + 27, 55000, 0, 55000, 55000, 0),
  ('00000000-0000-0000-0008-000000000002', '00000000-0000-0000-0000-000000000001', 'INV-2608-0002', '00000000-0000-0000-0007-000000000008', '00000000-0000-0000-0003-000000000001', 'paid', CURRENT_DATE - 6, CURRENT_DATE + 24, 62000, 0, 62000, 62000, 0),
  ('00000000-0000-0000-0008-000000000003', '00000000-0000-0000-0000-000000000001', 'INV-2608-0003', '00000000-0000-0000-0007-000000000001', '00000000-0000-0000-0003-000000000001', 'sent', CURRENT_DATE, CURRENT_DATE + 30, 85000, 0, 85000, 0, 85000),
  ('00000000-0000-0000-0008-000000000004', '00000000-0000-0000-0000-000000000001', 'INV-2608-0004', '00000000-0000-0000-0007-000000000006', '00000000-0000-0000-0003-000000000005', 'sent', CURRENT_DATE, CURRENT_DATE + 30, 180000, 0, 180000, 0, 180000);
