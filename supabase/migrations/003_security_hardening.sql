-- Security hardening for the production application.
-- This migration intentionally keeps public tracking behind a safe RPC projection.

create schema if not exists private;

create or replace function private.current_user_org_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select org_id from public.profiles where id = (select auth.uid()) limit 1;
$$;

revoke all on function private.current_user_org_id() from public, anon, authenticated, service_role;

-- Enable tenant enforcement on every operational table in the core schema.
alter table public.organizations enable row level security;
alter table public.branches enable row level security;
alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.customers enable row level security;
alter table public.customer_contacts enable row level security;
alter table public.carriers enable row level security;
alter table public.drivers enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_documents enable row level security;
alter table public.driver_documents enable row level security;
alter table public.shipments enable row level security;
alter table public.shipment_items enable row level security;
alter table public.shipment_stops enable row level security;
alter table public.shipment_events enable row level security;
alter table public.quotes enable row level security;
alter table public.assignments enable row level security;
alter table public.gps_events enable row level security;
alter table public.geofences enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;
alter table public.payments enable row level security;
alter table public.incidents enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.documents enable row level security;

-- Existing policies were broad SELECT-only policies. Replace them with policies
-- that also protect writes and use a cached, indexed organization lookup.
drop policy if exists public_tracking on public.shipments;

drop policy if exists organizations_member_access on public.organizations;
create policy organizations_member_access on public.organizations
  for select to authenticated
  using (id = (select private.current_user_org_id()));

drop policy if exists branches_org_access on public.branches;
create policy branches_org_access on public.branches
  for all to authenticated
  using (org_id = (select private.current_user_org_id()))
  with check (org_id = (select private.current_user_org_id()));

drop policy if exists roles_org_access on public.roles;
create policy roles_org_access on public.roles
  for select to authenticated
  using (org_id is null or org_id = (select private.current_user_org_id()));

drop policy if exists user_roles_self_access on public.user_roles;
create policy user_roles_self_access on public.user_roles
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Tenant-owned tables.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'customers', 'carriers', 'drivers', 'vehicles', 'shipments',
    'quotes', 'geofences', 'invoices', 'payments', 'incidents',
    'documents'
  ] loop
    execute format('drop policy if exists tenant_access on public.%I', table_name);
    execute format(
      'create policy tenant_access on public.%I for all to authenticated using (org_id = (select private.current_user_org_id())) with check (org_id = (select private.current_user_org_id()))',
      table_name
    );
  end loop;
end $$;

drop policy if exists customer_contacts_tenant_access on public.customer_contacts;
create policy customer_contacts_tenant_access on public.customer_contacts
  for all to authenticated
  using (exists (select 1 from public.customers c where c.id = customer_id and c.org_id = (select private.current_user_org_id())))
  with check (exists (select 1 from public.customers c where c.id = customer_id and c.org_id = (select private.current_user_org_id())));

drop policy if exists vehicle_documents_tenant_access on public.vehicle_documents;
create policy vehicle_documents_tenant_access on public.vehicle_documents
  for all to authenticated
  using (exists (select 1 from public.vehicles v where v.id = vehicle_id and v.org_id = (select private.current_user_org_id())))
  with check (exists (select 1 from public.vehicles v where v.id = vehicle_id and v.org_id = (select private.current_user_org_id())));

drop policy if exists driver_documents_tenant_access on public.driver_documents;
create policy driver_documents_tenant_access on public.driver_documents
  for all to authenticated
  using (exists (select 1 from public.drivers d where d.id = driver_id and d.org_id = (select private.current_user_org_id())))
  with check (exists (select 1 from public.drivers d where d.id = driver_id and d.org_id = (select private.current_user_org_id())));

drop policy if exists shipment_items_tenant_access on public.shipment_items;
create policy shipment_items_tenant_access on public.shipment_items
  for all to authenticated
  using (exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id())))
  with check (exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id())));

drop policy if exists shipment_stops_tenant_access on public.shipment_stops;
create policy shipment_stops_tenant_access on public.shipment_stops
  for all to authenticated
  using (exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id())))
  with check (exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id())));

drop policy if exists shipment_events_tenant_access on public.shipment_events;
create policy shipment_events_tenant_access on public.shipment_events
  for all to authenticated
  using (exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id())))
  with check (exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id())));

drop policy if exists assignments_tenant_access on public.assignments;
create policy assignments_tenant_access on public.assignments
  for all to authenticated
  using (exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id())))
  with check (exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id())));

drop policy if exists gps_events_tenant_access on public.gps_events;
create policy gps_events_tenant_access on public.gps_events
  for all to authenticated
  using (
    exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id()))
    or exists (select 1 from public.vehicles v where v.id = vehicle_id and v.org_id = (select private.current_user_org_id()))
  )
  with check (
    exists (select 1 from public.shipments s where s.id = shipment_id and s.org_id = (select private.current_user_org_id()))
    or exists (select 1 from public.vehicles v where v.id = vehicle_id and v.org_id = (select private.current_user_org_id()))
  );

drop policy if exists invoice_items_tenant_access on public.invoice_items;
create policy invoice_items_tenant_access on public.invoice_items
  for all to authenticated
  using (exists (select 1 from public.invoices i where i.id = invoice_id and i.org_id = (select private.current_user_org_id())))
  with check (exists (select 1 from public.invoices i where i.id = invoice_id and i.org_id = (select private.current_user_org_id())));

drop policy if exists notifications_self_access on public.notifications;
create policy notifications_self_access on public.notifications
  for all to authenticated
  using (user_id = (select auth.uid()) and (org_id is null or org_id = (select private.current_user_org_id())))
  with check (user_id = (select auth.uid()) and (org_id is null or org_id = (select private.current_user_org_id())));

drop policy if exists audit_logs_tenant_access on public.audit_logs;
create policy audit_logs_tenant_access on public.audit_logs
  for select to authenticated
  using (org_id is null or org_id = (select private.current_user_org_id()));

drop policy if exists profiles_org_access on public.profiles;
create policy profiles_org_access on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or org_id = (select private.current_user_org_id()));

-- Public tracking exposes only city-level routing, status, ETA and approved events.
create or replace function public.public_tracking_snapshot(p_tracking_number text)
returns jsonb
language sql
security definer
stable
set search_path = public
as $$
  select jsonb_build_object(
    'trackingNumber', s.tracking_number,
    'status', s.status,
    'originCity', s.pickup_city,
    'destinationCity', s.delivery_city,
    'eta', s.estimated_eta,
    'lastUpdatedAt', s.updated_at,
    'milestones', coalesce((
      select jsonb_agg(jsonb_build_object(
        'status', e.status,
        'title', coalesce(e.title, e.event_type),
        'location', null,
        'occurredAt', e.created_at
      ) order by e.created_at desc)
      from (
        select status, title, event_type, created_at
        from public.shipment_events
        where shipment_id = s.id
        order by created_at desc
        limit 8
      ) e
    ), '[]'::jsonb)
  )
  from public.shipments s
  where s.tracking_number = upper(trim(p_tracking_number));
$$;

revoke all on function public.public_tracking_snapshot(text) from public;
grant execute on function public.public_tracking_snapshot(text) to anon, authenticated;

create index if not exists idx_shipments_active_org
  on public.shipments (org_id, updated_at desc)
  where status not in ('completed', 'cancelled', 'failed');

create index if not exists idx_notifications_unread_user
  on public.notifications (user_id, created_at desc)
  where is_read = false;

create index if not exists idx_shipment_events_recent
  on public.shipment_events (shipment_id, created_at desc);
