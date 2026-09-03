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
