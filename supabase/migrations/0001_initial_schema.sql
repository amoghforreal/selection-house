-- ==========================================
-- SELECTION HOUSE — INITIAL SCHEMA (Part 1)
-- Enums, Profiles, Businesses
-- ==========================================

-- Custom types
create type user_role as enum ('buyer', 'staff', 'admin', 'super_admin');
create type business_status as enum ('pending', 'approved', 'rejected', 'blocked');
create type buyer_tier as enum ('retailer', 'distributor', 'vip');

-- ==========================================
-- PROFILES (extends Supabase auth.users)
-- ==========================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role user_role not null default 'buyer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==========================================
-- BUSINESSES (wholesale buyer's shop details)
-- One buyer profile has one business
-- ==========================================
create table businesses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade unique,
  shop_name text not null,
  gst_number text,
  gst_document_url text,
  business_address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  status business_status not null default 'pending',
  tier buyer_tier not null default 'retailer',
  custom_discount_percent numeric(5,2) default 0,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_businesses_status on businesses(status);
create index idx_businesses_profile on businesses(profile_id);

-- ==========================================
-- CATEGORIES
-- ==========================================
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_categories_slug on categories(slug);

-- ==========================================
-- PRODUCTS
-- ==========================================
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  brand text,
  base_price numeric(10,2) not null,
  moq int not null default 1,
  sku text unique,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_category on products(category_id);
create index idx_products_slug on products(slug);
create index idx_products_active on products(is_active);

-- ==========================================
-- PRODUCT IMAGES
-- ==========================================
create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_product_images_product on product_images(product_id);

-- ==========================================
-- PRODUCT VARIANTS (size, color, etc.)
-- ==========================================
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_name text not null,
  sku text unique,
  price_override numeric(10,2),
  stock_quantity int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_product_variants_product on product_variants(product_id);

-- ==========================================
-- PRICING TIERS (bulk quantity discounts per product)
-- e.g. 10-49 units = 5% off, 50+ units = 10% off
-- ==========================================
create table pricing_tiers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  min_quantity int not null,
  discount_percent numeric(5,2) not null default 0,
  created_at timestamptz not null default now()
);

create index idx_pricing_tiers_product on pricing_tiers(product_id);

-- ==========================================
-- ADDRESSES (buyer can have multiple shop/branch addresses)
-- ==========================================
create table addresses (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  label text not null default 'Main Branch',
  recipient_name text not null,
  phone text not null,
  address_line text not null,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_addresses_business on addresses(business_id);

-- ==========================================
-- CART ITEMS
-- ==========================================
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  variant_id uuid references product_variants(id) on delete cascade,
  quantity int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, product_id, variant_id)
);

create index idx_cart_items_profile on cart_items(profile_id);

-- ==========================================
-- ORDERS
-- ==========================================
create type order_status as enum (
  'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'
);
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  business_id uuid not null references businesses(id) on delete restrict,
  address_id uuid not null references addresses(id) on delete restrict,
  status order_status not null default 'pending',
  payment_status payment_status not null default 'pending',
  subtotal numeric(10,2) not null,
  discount_amount numeric(10,2) not null default 0,
  shipping_amount numeric(10,2) not null default 0,
  tax_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null,
  notes text,
  razorpay_order_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_orders_business on orders(business_id);
create index idx_orders_status on orders(status);
create index idx_orders_number on orders(order_number);

-- ==========================================
-- ORDER ITEMS
-- ==========================================
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  variant_id uuid references product_variants(id) on delete restrict,
  product_name text not null,
  variant_name text,
  unit_price numeric(10,2) not null,
  quantity int not null,
  line_total numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create index idx_order_items_order on order_items(order_id);

-- ==========================================
-- PAYMENTS (transaction log, separate from orders for refund/retry history)
-- ==========================================
create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  razorpay_payment_id text,
  razorpay_signature text,
  amount numeric(10,2) not null,
  status payment_status not null default 'pending',
  method text,
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create index idx_payments_order on payments(order_id);

-- ==========================================
-- COUPONS
-- ==========================================
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_percent numeric(5,2),
  discount_flat numeric(10,2),
  min_order_amount numeric(10,2) default 0,
  max_uses int,
  used_count int not null default 0,
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ==========================================
-- BANNERS (homepage/category CMS, editable without touching code)
-- ==========================================
create table banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  link_url text,
  placement text not null default 'homepage_hero',
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ==========================================
-- REVIEWS
-- ==========================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_reviews_product on reviews(product_id);

-- ==========================================
-- NOTIFICATIONS (in-app + log for email/SMS/WhatsApp triggers)
-- ==========================================
create type notification_channel as enum ('in_app', 'email', 'sms', 'whatsapp');

create table notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  channel notification_channel not null default 'in_app',
  title text not null,
  message text not null,
  is_read boolean not null default false,
  related_order_id uuid references orders(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_notifications_profile on notifications(profile_id);

-- ==========================================
-- SUPPORT TICKETS
-- ==========================================
create type ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');

create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  subject text not null,
  message text not null,
  status ticket_status not null default 'open',
  related_order_id uuid references orders(id) on delete set null,
  assigned_to uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_support_tickets_business on support_tickets(business_id);

-- ==========================================
-- AUDIT LOGS (tracks admin/staff actions)
-- ==========================================
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index idx_audit_logs_actor on audit_logs(actor_id);
