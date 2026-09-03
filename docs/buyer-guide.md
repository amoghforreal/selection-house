# Buyer Guide

How a shop owner or school buyer experiences the site, end to end, and how
to switch payments from test mode to real money.

## The Buyer Journey

1. **Browse without an account** — anyone can browse every category and see
   real wholesale pricing, including bulk discounts that update live as they
   adjust the quantity on a product page. No login required to browse or
   see prices.
2. **Register** — takes under a minute: name, phone, email, password, shop
   name, address. The account is active immediately, no waiting for approval.
3. **Login required only to actually order** — adding to cart, checking out,
   viewing order history, and invoices all require being logged in. This is
   intentional, browsing stays frictionless, only the final commitment needs
   an account.
4. **Cart** (`/dashboard/cart`) — adjust quantities or remove items.
5. **Checkout** (`/dashboard/checkout`) — select a delivery address (added
   under Addresses if none exist yet), review the order, and pay via
   Razorpay. Shipping and tax are calculated automatically from the rates
   you set in Admin Panel → Settings.
6. **Order History and Order Detail** — track status (pending → confirmed →
   packed → shipped → delivered), updated by you from the Admin Panel.
7. **Invoices** — every paid order appears here with a link to its full
   breakdown. Note: this links to the order detail page, an actual
   downloadable PDF invoice is not yet built, see `maintenance.md`.
8. **Saved for Reorder** — buyers can save products they order often (via
   the button on any product page) for quick access later, useful for
   schools or shops that reorder the same items every term/season.
9. **Support** — logged-in buyers can raise a support ticket about an order
   from their dashboard. Separate from the public Contact Us form, which
   anyone can use without an account.
10. **Reviews** — logged-in buyers can leave a star rating and comment on
    any product. Reviews are hidden until you approve them in Admin Panel →
    Reviews.

## Payments — Switching From Test Mode to Real Money

**Right now, Razorpay is running on placeholder/test keys, no real money can
be charged.** To start accepting real payments:

1. Create a Razorpay account at https://razorpay.com (business documents
   like PAN, bank account, and GST if applicable will be needed for
   verification, this can take a few days)
2. Once approved, go to Razorpay Dashboard → Settings → API Keys → generate
   **Live** keys (not test keys)
3. Go to Vercel → selection-house project → Settings → Environment Variables
4. Update these three with the real live values:
   - `RAZORPAY_KEY_ID` (Secret)
   - `RAZORPAY_KEY_SECRET` (Secret)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` (Config, same value as `RAZORPAY_KEY_ID`)
5. Go to Deployments → latest → "..." → Redeploy
6. Also update the same three values in the developer'"'"'s local `.env.local`
   file if further local development happens

That'"'"'s it, checkout will immediately start processing real payments once
these are updated. Test a small real order yourself first to confirm
everything works end to end before announcing it publicly.

## Shipping and Tax

Both are currently a single flat rate/percentage applied to every order,
set in Admin Panel → Settings → Shipping and Tax. This is intentionally
simple for launch. If you need zone-based shipping (different rates by
city/state) or proper GST-compliant tax breakdowns (CGST/SGST/IGST by
state, HSN codes on invoices), that is a larger feature a developer would
need to build, it is not automatic.
