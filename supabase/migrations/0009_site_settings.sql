-- ==========================================
-- SELECTION HOUSE — SITE SETTINGS
-- Single-row table for store-wide configuration the admin can edit
-- without touching code: contact info, shipping, tax.
-- ==========================================

create table site_settings (
  id uuid primary key default gen_random_uuid(),
  business_phone text,
  business_whatsapp text,
  business_address text,
  business_hours text,
  default_shipping_rate numeric(10,2) default 0,
  default_tax_percent numeric(5,2) default 0,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

create policy "Anyone can view site settings"
  on site_settings for select
  using (true);

create policy "Staff/admin can manage site settings"
  on site_settings for all
  using (is_staff_or_admin());

insert into site_settings (business_phone, business_whatsapp, business_address, business_hours, default_shipping_rate, default_tax_percent)
values (
  '+91 63986 58181',
  '916398658181',
  'Station Road, Pilibhit, Opp. BOB Bank, Pilibhit, Uttar Pradesh',
  'Mon to Sat: 10:00 AM to 8:00 PM',
  0,
  0
);
