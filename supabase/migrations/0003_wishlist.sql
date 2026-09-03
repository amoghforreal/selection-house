-- ==========================================
-- SELECTION HOUSE — WISHLIST TABLE
-- Added after initial schema; buyers can save products for later
-- ==========================================

create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (profile_id, product_id)
);

create index idx_wishlist_items_profile on wishlist_items(profile_id);

alter table wishlist_items enable row level security;

create policy "Buyers can view their own wishlist"
  on wishlist_items for select
  using (profile_id = auth.uid());

create policy "Buyers can add to their own wishlist"
  on wishlist_items for insert
  with check (profile_id = auth.uid());

create policy "Buyers can remove from their own wishlist"
  on wishlist_items for delete
  using (profile_id = auth.uid());
