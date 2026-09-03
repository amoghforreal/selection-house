# Maintenance and Troubleshooting

## Known Limitations (Built But Not Fully Finished)

Honest list of things that exist in the database or admin panel but aren'"'"'t
fully connected to the live site yet. None of these break anything, they'"'"'re
just not live features yet:

- **Multiple product photos**: only one cover photo per product is shown.
  The database supports a full photo gallery (`product_images` table) but no
  page displays it yet.
- **Banners**: you can upload and manage banners in the admin panel, but the
  homepage/category pages don'"'"'t display them yet, they still show a
  placeholder hero image.
- **Coupons at checkout**: coupons can be created and managed, but there is
  no field on the checkout page for a buyer to actually enter a coupon code.
- **Invoice PDFs**: the "Download Invoice" button links to the order detail
  page (which shows the same information), it does not generate an actual
  downloadable PDF file yet.
- **In-app notifications**: the database has a notifications table but
  nothing writes to it or displays it yet (e.g. "your order shipped"
  notifications don'"'"'t exist as in-app alerts, though the order status is
  visible in Order History).
- **Shipping and tax**: one flat rate for all orders, not zone-based
  shipping or proper state-wise GST breakdown.
- **Search**: matches product name, brand, and description as plain text,
  no typo correction or smart ranking.
- **Email/SMS**: no automated emails or SMS are sent for order confirmations,
  status changes, etc. Buyers check status by logging into their dashboard.

None of these need to be fixed urgently, they'"'"'re natural next features
whenever there'"'"'s appetite to keep building.

## Security Notes

- **Row Level Security (RLS)** is enabled on every table. This means the
  database itself enforces who can see/edit what (buyers only see their own
  orders, pricing tiers are public, only staff/admin can edit products,
  etc.), even if someone tried to bypass the website entirely and query the
  database directly, these rules still apply.
- **Never share the Supabase service role key or Razorpay secret key** with
  anyone, they bypass all security rules. Only the developer and Vercel'"'"'s
  environment variables should ever have them.
- **The GitHub repository is public.** This is intentional (developer
  portfolio purposes), but it means the source code is visible to anyone.
  No secrets are stored in the code itself, only in Vercel'"'"'s environment
  variables and the local `.env.local` file (which is excluded from what
  gets uploaded to GitHub).
- **The Audit Log** (Admin Panel → Audit Log) automatically tracks every
  change to products, categories, businesses, orders, and coupons, useful
  for spotting unexpected changes.

## Common Troubleshooting

**"The site looks broken or shows an error"**
Check Vercel → Deployments, the most recent one should say "Ready". If it
says "Error", something in the last code change failed to build, contact
your developer with a screenshot of the error.

**"I forgot my admin password"**
Go to the site'"'"'s Login page → "Forgot your password?" and follow the reset
flow. If that page isn'"'"'t working, a developer can reset it directly from
Supabase Dashboard → Authentication → Users → find your account → reset
password.

**"A buyer says they can'"'"'t log in"**
Check Admin Panel → All Users to confirm their account exists and see their
last login time. Check Admin Panel → Businesses to confirm their account
isn'"'"'t blocked.

**"I need to give someone else admin access"**
Admin Panel → Staff and Roles → search their email (they must have an
account already, ask them to register first) → change role to Admin or
Staff.

**"Stock/price changes aren'"'"'t showing on the live site"**
Changes made in the Admin Panel save directly to the live database and
should appear within seconds, no redeploy needed. If something still looks
wrong, try a hard refresh (Ctrl+Shift+R) in case your browser cached an old
version of the page.
