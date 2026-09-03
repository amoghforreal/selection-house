# Selection House — Owner Manual

Start here. This is a short index, each topic has its own focused file in
this `docs/` folder so you never have to dig through one giant document.

## What This Is

A full wholesale ordering website for Selection House (sports goods supplier,
Pilibhit, since 1989). Shop owners and school buyers can browse the catalogue,
see wholesale pricing (visible to everyone, no login needed to browse), create
a free account, place bulk orders, and pay online. You (the admin) manage
everything through a separate admin panel: products, stock, pricing,
categories, orders, buyers, payments, coupons, banners, reviews, staff
accounts, and site settings.

## Guides in This Folder

- **`admin-guide.md`** — full walkthrough of every admin panel page
- **`buyer-guide.md`** — how the buyer journey works, checkout, and how to
  switch payments from test mode to real money
- **`database.md`** — database structure and full migration history
- **`deployment.md`** — how the site is hosted, environment variables, and
  how to connect a custom domain
- **`maintenance.md`** — known limitations, common issues, and security notes

## Quick Reference — Where Everything Lives

| What | Where |
|---|---|
| Live website | https://selection-house.vercel.app (or your custom domain once connected) |
| Source code | https://github.com/amoghforreal/selection-house |
| Hosting/deployment | https://vercel.com (project: selection-house) |
| Database, accounts, file storage | https://supabase.com (project: Selection House, region: Asia-Pacific) |
| Supabase Project URL | `https://cblcrbxbjqktjtynxkqy.supabase.co` |
| Supabase Project Ref | `cblcrbxbjqktjtynxkqy` |
| Payments | https://razorpay.com (not yet connected with live keys, see `buyer-guide.md`) |

**Where to find your actual secret keys** (never written in these docs or
committed to GitHub, since the code repository is public):
- Supabase keys: Supabase Dashboard → your project → Project Settings → API Keys
- Razorpay keys: Razorpay Dashboard → Settings → API Keys
- Both are also stored in Vercel → selection-house project → Settings →
  Environment Variables (source of truth for the live site)
- And in a file on the developer'"'"'s computer at `.env.local` (source of truth
  for local development, never uploaded anywhere)

## Accounts You Own

- **Supabase account**: sign in with the email `selectionhousepbt89@gmail.com`
  (or whichever email was used at setup)
- **Vercel account**: currently under the developer'"'"'s personal account, a
  transfer to your own Vercel Team was discussed but not yet completed, ask
  your developer for status
- **GitHub repo**: public, for portfolio purposes, contains all source code
  but no secrets
- **Admin login on the website itself**: use the same email registered as
  `super_admin`, log in at `/login`, it will take you straight to `/admin`

## How to Log In as Admin

1. Go to the live site
2. Click "Login" (top right)
3. Enter your admin email and password
4. You will land directly on the Admin Panel (`/admin`)

If you ever need to make another person an admin or staff member, go to
**Admin Panel → Staff and Roles**, search their email, and change their role
from the dropdown.
