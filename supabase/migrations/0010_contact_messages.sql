-- ==========================================
-- SELECTION HOUSE — CONTACT MESSAGES
-- For public/guest inquiries via the Contact Us page. Separate from
-- support_tickets, which is for registered buyers with an order/account
-- issue tied to their business.
-- ==========================================

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "Anyone can submit a contact message"
  on contact_messages for insert
  with check (true);

create policy "Staff/admin can view contact messages"
  on contact_messages for select
  using (is_staff_or_admin());

create policy "Staff/admin can update contact messages"
  on contact_messages for update
  using (is_staff_or_admin());

create policy "Staff/admin can delete contact messages"
  on contact_messages for delete
  using (is_staff_or_admin());
