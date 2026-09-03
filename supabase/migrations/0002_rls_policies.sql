-- ==========================================
-- SELECTION HOUSE — RLS POLICIES (Part 1)
-- Profiles, Businesses, Categories, Products, Images, Variants, Pricing Tiers
-- ==========================================

-- ==========================================
-- HELPER FUNCTION: check if current user is admin/staff/super_admin
-- ==========================================
create or replace function is_staff_or_admin()
returns boolean as \$\$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role in ('staff', 'admin', 'super_admin')
  );
\$\$ language sql security definer stable;

create or replace function is_super_admin()
returns boolean as \$\$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'super_admin'
  );
\$\$ language sql security definer stable;

-- ==========================================
-- PROFILES
-- ==========================================
alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Staff/admin can view all profiles"
  on profiles for select
  using (is_staff_or_admin());

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile on signup"
  on profiles for insert
  with check (auth.uid() = id);

-- ==========================================
-- BUSINESSES
-- ==========================================
alter table businesses enable row level security;

create policy "Buyers can view their own business"
  on businesses for select
  using (profile_id = auth.uid());

create policy "Staff/admin can view all businesses"
  on businesses for select
  using (is_staff_or_admin());

create policy "Buyers can insert their own business"
  on businesses for insert
  with check (profile_id = auth.uid());

create policy "Buyers can update their own business (before approval)"
  on businesses for update
  using (profile_id = auth.uid() and status = 'pending');

create policy "Staff/admin can update any business (approve/reject/block)"
  on businesses for update
  using (is_staff_or_admin());

-- ==========================================
-- CATEGORIES (public read, admin write)
-- ==========================================
alter table categories enable row level security;

create policy "Anyone can view active categories"
  on categories for select
  using (is_active = true or is_staff_or_admin());

create policy "Staff/admin can manage categories"
  on categories for all
  using (is_staff_or_admin());

-- ==========================================
-- PRODUCTS (public read basic info, pricing gated in app layer)
-- ==========================================
alter table products enable row level security;

create policy "Anyone can view active products"
  on products for select
  using (is_active = true or is_staff_or_admin());

create policy "Staff/admin can manage products"
  on products for all
  using (is_staff_or_admin());

-- ==========================================
-- PRODUCT IMAGES
-- ==========================================
alter table product_images enable row level security;

create policy "Anyone can view product images"
  on product_images for select
  using (true);

create policy "Staff/admin can manage product images"
  on product_images for all
  using (is_staff_or_admin());

-- ==========================================
-- PRODUCT VARIANTS
-- ==========================================
alter table product_variants enable row level security;

create policy "Anyone can view active variants"
  on product_variants for select
  using (is_active = true or is_staff_or_admin());

create policy "Staff/admin can manage variants"
  on product_variants for all
  using (is_staff_or_admin());

-- ==========================================
-- PRICING TIERS (only visible to logged-in buyers, per the login-gated pricing rule)
-- ==========================================
alter table pricing_tiers enable row level security;

create policy "Logged-in users can view pricing tiers"
  on pricing_tiers for select
  using (auth.uid() is not null);

create policy "Staff/admin can manage pricing tiers"
  on pricing_tiers for all
  using (is_staff_or_admin());

-- ==========================================
-- ADDRESSES (buyer sees only their own business's addresses)
-- ==========================================
alter table addresses enable row level security;

create policy "Buyers can view their own addresses"
  on addresses for select
  using (
    business_id in (select id from businesses where profile_id = auth.uid())
  );

create policy "Staff/admin can view all addresses"
  on addresses for select
  using (is_staff_or_admin());

create policy "Buyers can manage their own addresses"
  on addresses for insert
  with check (
    business_id in (select id from businesses where profile_id = auth.uid())
  );

create policy "Buyers can update their own addresses"
  on addresses for update
  using (
    business_id in (select id from businesses where profile_id = auth.uid())
  );

create policy "Buyers can delete their own addresses"
  on addresses for delete
  using (
    business_id in (select id from businesses where profile_id = auth.uid())
  );

-- ==========================================
-- CART ITEMS (fully private to the buyer)
-- ==========================================
alter table cart_items enable row level security;

create policy "Buyers can view their own cart"
  on cart_items for select
  using (profile_id = auth.uid());

create policy "Buyers can insert into their own cart"
  on cart_items for insert
  with check (profile_id = auth.uid());

create policy "Buyers can update their own cart"
  on cart_items for update
  using (profile_id = auth.uid());

create policy "Buyers can delete from their own cart"
  on cart_items for delete
  using (profile_id = auth.uid());

-- ==========================================
-- ORDERS (buyer sees only their own business's orders)
-- ==========================================
alter table orders enable row level security;

create policy "Buyers can view their own orders"
  on orders for select
  using (
    business_id in (select id from businesses where profile_id = auth.uid())
  );

create policy "Staff/admin can view all orders"
  on orders for select
  using (is_staff_or_admin());

create policy "Buyers can create their own orders"
  on orders for insert
  with check (
    business_id in (select id from businesses where profile_id = auth.uid())
  );

create policy "Staff/admin can update orders (status changes)"
  on orders for update
  using (is_staff_or_admin());

-- ==========================================
-- ORDER ITEMS (visible if you can see the parent order)
-- ==========================================
alter table order_items enable row level security;

create policy "Buyers can view items of their own orders"
  on order_items for select
  using (
    order_id in (
      select id from orders where business_id in (
        select id from businesses where profile_id = auth.uid()
      )
    )
  );

create policy "Staff/admin can view all order items"
  on order_items for select
  using (is_staff_or_admin());

create policy "Buyers can insert items into their own orders"
  on order_items for insert
  with check (
    order_id in (
      select id from orders where business_id in (
        select id from businesses where profile_id = auth.uid()
      )
    )
  );

-- ==========================================
-- PAYMENTS (visible if you can see the parent order; only server can write)
-- ==========================================
alter table payments enable row level security;

create policy "Buyers can view payments for their own orders"
  on payments for select
  using (
    order_id in (
      select id from orders where business_id in (
        select id from businesses where profile_id = auth.uid()
      )
    )
  );

create policy "Staff/admin can view all payments"
  on payments for select
  using (is_staff_or_admin());

create policy "Staff/admin can manage payments"
  on payments for all
  using (is_staff_or_admin());

-- ==========================================
-- COUPONS (only logged-in users can view active ones; admin manages)
-- ==========================================
alter table coupons enable row level security;

create policy "Logged-in users can view active coupons"
  on coupons for select
  using (auth.uid() is not null and is_active = true);

create policy "Staff/admin can view all coupons"
  on coupons for select
  using (is_staff_or_admin());

create policy "Staff/admin can manage coupons"
  on coupons for all
  using (is_staff_or_admin());

-- ==========================================
-- BANNERS (public read, admin write)
-- ==========================================
alter table banners enable row level security;

create policy "Anyone can view active banners"
  on banners for select
  using (is_active = true or is_staff_or_admin());

create policy "Staff/admin can manage banners"
  on banners for all
  using (is_staff_or_admin());

-- ==========================================
-- REVIEWS (public read approved; buyer manages own; admin moderates)
-- ==========================================
alter table reviews enable row level security;

create policy "Anyone can view approved reviews"
  on reviews for select
  using (is_approved = true or is_staff_or_admin() or profile_id = auth.uid());

create policy "Logged-in users can create their own reviews"
  on reviews for insert
  with check (profile_id = auth.uid());

create policy "Users can update their own reviews"
  on reviews for update
  using (profile_id = auth.uid());

create policy "Staff/admin can moderate reviews"
  on reviews for update
  using (is_staff_or_admin());

create policy "Users can delete their own reviews"
  on reviews for delete
  using (profile_id = auth.uid() or is_staff_or_admin());

-- ==========================================
-- NOTIFICATIONS (fully private to the recipient)
-- ==========================================
alter table notifications enable row level security;

create policy "Users can view their own notifications"
  on notifications for select
  using (profile_id = auth.uid());

create policy "Users can mark their own notifications read"
  on notifications for update
  using (profile_id = auth.uid());

create policy "Staff/admin can create notifications for anyone"
  on notifications for insert
  with check (is_staff_or_admin());

-- ==========================================
-- SUPPORT TICKETS
-- ==========================================
alter table support_tickets enable row level security;

create policy "Buyers can view their own tickets"
  on support_tickets for select
  using (
    business_id in (select id from businesses where profile_id = auth.uid())
  );

create policy "Staff/admin can view all tickets"
  on support_tickets for select
  using (is_staff_or_admin());

create policy "Buyers can create their own tickets"
  on support_tickets for insert
  with check (
    business_id in (select id from businesses where profile_id = auth.uid())
  );

create policy "Buyers can update their own open tickets"
  on support_tickets for update
  using (
    business_id in (select id from businesses where profile_id = auth.uid())
    and status = 'open'
  );

create policy "Staff/admin can update any ticket"
  on support_tickets for update
  using (is_staff_or_admin());

-- ==========================================
-- AUDIT LOGS (staff/admin only, insert via server, read by super_admin)
-- ==========================================
alter table audit_logs enable row level security;

create policy "Super admin can view audit logs"
  on audit_logs for select
  using (is_super_admin());

create policy "Staff/admin can insert audit logs"
  on audit_logs for insert
  with check (is_staff_or_admin());
