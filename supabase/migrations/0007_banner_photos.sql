-- ==========================================
-- SELECTION HOUSE — BANNER PHOTOS STORAGE
-- ==========================================

insert into storage.buckets (id, name, public)
values ('site-banners', 'site-banners', true)
on conflict (id) do nothing;

create policy "Public read access for banners"
on storage.objects for select
using (bucket_id = 'site-banners');

create policy "Staff/admin can upload banners"
on storage.objects for insert
with check (bucket_id = 'site-banners' and public.is_staff_or_admin());

create policy "Staff/admin can update banners"
on storage.objects for update
using (bucket_id = 'site-banners' and public.is_staff_or_admin());

create policy "Staff/admin can delete banners"
on storage.objects for delete
using (bucket_id = 'site-banners' and public.is_staff_or_admin());
