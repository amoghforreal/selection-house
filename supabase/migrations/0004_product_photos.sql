-- ==========================================
-- SELECTION HOUSE — PRODUCT PHOTOS
-- Adds a cover image field to products, and sets up Supabase Storage
-- for admin-uploaded product photos.
-- ==========================================

alter table products add column cover_image_url text;

-- Storage bucket for product photos, public read (so photos display on the
-- public site without login), write restricted to staff/admin.
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

create policy "Public read access for product photos"
on storage.objects for select
using (bucket_id = 'product-photos');

create policy "Staff/admin can upload product photos"
on storage.objects for insert
with check (bucket_id = 'product-photos' and public.is_staff_or_admin());

create policy "Staff/admin can update product photos"
on storage.objects for update
using (bucket_id = 'product-photos' and public.is_staff_or_admin());

create policy "Staff/admin can delete product photos"
on storage.objects for delete
using (bucket_id = 'product-photos' and public.is_staff_or_admin());
