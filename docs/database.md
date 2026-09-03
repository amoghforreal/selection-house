# Database Guide

Reference for how the Selection House database is structured. You will not
normally need to touch this directly, the Admin Panel handles everything,
this is here for troubleshooting or if a developer ever rebuilds the
database from scratch.

## Database Structure (Plain-Language Summary)

The database has about 25 tables:

- **profiles** — every user'"'"'s name, phone, and role (buyer/staff/admin/super_admin)
- **businesses** — shop details for each buyer (shop name, GST, address, status)
- **categories** — the 23 product categories
- **products** — every product (name, price, description, cover photo)
- **product_images** — extra gallery photos per product (not yet used by any
  page, only the single cover photo is currently shown)
- **product_variants** — size/color options per product, each with its own
  stock count
- **pricing_tiers** — bulk discount rules per product (e.g. 50+ units = 10% off)
- **addresses** — saved delivery addresses per business
- **cart_items** — items currently in a buyer'"'"'s cart
- **orders** / **order_items** — placed orders and their line items
- **payments** — Razorpay transaction records
- **coupons** — discount codes
- **banners** — homepage/category promotional images
- **reviews** — product reviews (pending admin approval before showing publicly)
- **notifications** — in-app notification records (table exists, not yet
  wired to any UI)
- **support_tickets** — issues raised by logged-in buyers about their orders
- **contact_messages** — messages from the public Contact Us form (anyone,
  no login needed)
- **wishlist_items** — "Saved for Reorder" list per buyer
- **audit_logs** — automatic record of every change to products, categories,
  businesses, orders, and coupons (who changed what, when)
- **site_settings** — single row holding business phone, WhatsApp, address,
  hours, shipping rate, and tax percent, editable from Admin Panel → Settings

## Migration History (Database Changes, in Order)

These SQL files, stored in `supabase/migrations/` in the code repository,
built the database in this order:

1. `0001_initial_schema.sql` — all core tables
2. `0002_rls_policies.sql` — security rules (who can see/edit what)
3. `0003_wishlist.sql` — wishlist/Saved-for-Reorder table
4. `0004_product_photos.sql` — product cover photo field + photo storage
5. `0005_auto_create_profile.sql` — automatic profile creation on signup
6. `0006_remove_approval_gate.sql` — removed the business approval wait,
   accounts are active immediately upon registration
7. `0007_banner_photos.sql` — banner image storage
8. `0008_audit_logging.sql` — automatic change-tracking triggers
9. `0009_site_settings.sql` — the editable site settings table
10. `0010_contact_messages.sql` — public contact form storage

If you ever set up a brand new Supabase project (for example, moving to a
different Supabase account), a developer would need to run all 10 of these
files, in this exact order, in the Supabase SQL Editor, then re-enter the new
project'"'"'s URL and keys into Vercel'"'"'s environment variables.
