# Admin Panel Guide

Full walkthrough of every page under `/admin`. Only visible to accounts with
the staff, admin, or super_admin role.

## Overview (`/admin`)
Quick snapshot: orders in progress, total orders, total revenue, businesses
needing attention, and low-stock alerts (any product variant under 10 units).

## Products (`/admin/products`)
- Click **Add Product** to create a new product: name, category, description,
  brand, base price (this is the price shown for the minimum order quantity,
  before any bulk discount), MOQ (minimum order quantity), SKU, and whether
  it'"'"'s featured on the homepage.
- Click any product in the list to edit it. On the edit page you can:
  - **Upload a photo**: click "Upload Photo", choose an image from your
    device, it saves and displays immediately. This becomes the product'"'"'s
    cover image everywhere on the site.
  - **Manage stock**: under "Variants and Stock", add a variant (e.g. "Size
    L", "Red", or just "Standard" if the product has no real variants) and
    set its stock quantity. You can update the stock number any time by
    typing a new value in the box, it saves automatically.
  - **Set bulk pricing**: under "Bulk Pricing Tiers", add rules like "25+
    units = 5% off" or "50+ units = 10% off". These automatically appear on
    the product page and the price updates live as a buyer changes quantity.
  - **Delete Product**: removes it permanently.

## Categories (`/admin/categories`)
Add new categories, hide/show existing ones (hidden categories disappear
from the site but keep their products), or delete a category entirely
(this will fail if products still reference it, remove or reassign those
products first).

## Orders (`/admin/orders`)
Every order placed on the site. Filter by status. Change an order'"'"'s status
using the dropdown next to it (pending → confirmed → packed → shipped →
delivered, or cancelled). Click an order to see full details: items, buyer,
delivery address, and payment breakdown.

## Businesses (`/admin/businesses`)
Every registered shop/business account. Since accounts activate immediately
on signup, this page is mainly for oversight, you can still **Block** a
business here if needed (e.g. suspected fraud), which locks them out of their
dashboard with a message to contact you.

## All Users (`/admin/users`)
Every account ever created on the site (buyers, staff, admins), with their
role, shop name, when they registered, and when they last logged in. This is
your complete user directory.

## Payments (`/admin/payments`)
Read-only list of every payment transaction, with status and total amount
collected shown at the top.

## Coupons (`/admin/coupons`)
Create discount codes (e.g. "WELCOME10" for 10% off), set a minimum order
amount and a usage limit if desired. Toggle active/inactive or delete.
Note: coupons are not yet wired into the checkout page itself for buyers to
actually apply, see `maintenance.md`.

## Banners (`/admin/banners`)
Upload promotional images for the homepage hero, category pages, or a promo
strip. Choose an image, add an optional title and link, and it saves
immediately. Note: banners are not yet wired to actually display anywhere on
the public site (the homepage hero currently uses a placeholder photo), see
`maintenance.md`.

## Reviews (`/admin/reviews`)
Buyers can leave a star rating and comment on any product page. New reviews
are hidden from the public until you click **Approve** here. You can also
delete inappropriate reviews.

## Staff and Roles (`/admin/staff`)
Search any registered user by name or email, and change their role: Buyer,
Staff, Admin, or Super Admin. Use this to give a family member or employee
admin access without needing database access.

## Audit Log (`/admin/audit-log`)
Automatic history of every change to products, categories, businesses,
orders, and coupons, who did it and when. Useful if something changes
unexpectedly and you want to know who/what caused it.

## Contact Messages (`/admin/messages`)
Messages submitted through the public Contact Us page (from people without
an account). Mark as read or delete once handled.

## Settings (`/admin/settings`)
Edit business phone, WhatsApp number, address, and hours, shown across the
Footer, Contact page, and WhatsApp buttons site-wide. Also set the default
shipping rate and tax percent applied at checkout.
