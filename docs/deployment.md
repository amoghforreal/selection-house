# Deployment Guide

How the site is hosted, how updates go live, and how to connect a custom
domain name (like `selectionhouse.in`) instead of the default Vercel URL.

## How It'"'"'s Hosted

- **Code**: lives on GitHub at https://github.com/amoghforreal/selection-house
- **Hosting**: Vercel, connected directly to that GitHub repository
- **Automatic deployment**: every time code is pushed to the `main` branch on
  GitHub, Vercel automatically builds and publishes a new live version within
  about a minute, no manual steps needed
- **Database**: Supabase, entirely separate from Vercel, the website just
  connects to it over the internet using the credentials below

## Environment Variables

These are the settings Vercel needs to run the site. Set under Vercel →
selection-house project → Settings → Environment Variables. Names only
listed here, actual values live in Vercel and in the developer'"'"'s local
`.env.local` file, never in this document or on GitHub.

**Public (safe to expose in the browser)**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_NAME`

**Secret (must stay private)**:
- `SUPABASE_SERVICE_ROLE_KEY` — full database access, bypasses all security
  rules, treat like a master password
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `ADMIN_SETUP_SECRET` — currently unused placeholder, reserved for a future
  one-time admin setup flow if needed

If any secret key is ever accidentally exposed (posted publicly, committed
to code, etc.), rotate it immediately: Supabase keys can be regenerated in
Project Settings → API Keys, Razorpay keys in Settings → API Keys, then
update the new values in Vercel and redeploy.

## How to Manually Redeploy

Normally never needed (pushes to GitHub auto-deploy), but if you ever change
an environment variable, you must manually redeploy for it to take effect:
Vercel → Deployments tab → find the latest deployment → "..." menu →
Redeploy.

## Connecting a Custom Domain

To use `selectionhouse.in` (or whichever domain you own) instead of
`selection-house.vercel.app`:

1. Buy the domain if you don'"'"'t already own it (GoDaddy, Namecheap, Google
   Domains, etc.)
2. Vercel → selection-house project → Settings → Domains → enter your domain
   → Add
3. Vercel will show you DNS records (usually an A record and/or CNAME record)
   to add at your domain registrar
4. Log into wherever you bought the domain, find "DNS settings" or "Manage
   DNS", add the exact records Vercel showed you
5. Wait for DNS to propagate (can take a few minutes to a few hours)
6. Once connected, also update `NEXT_PUBLIC_SITE_URL` in Vercel'"'"'s environment
   variables to the new domain, then redeploy

## Vercel Account Ownership

As of writing, the Vercel project is still under the developer'"'"'s personal
account. A transfer to a Vercel Team owned by you was discussed (see chat
history for the exact steps: create a Team, invite your email as Owner,
transfer the project into that Team). Confirm with your developer whether
this transfer has been completed. Until it is, you do not have direct
account-level access to Vercel (billing, domain, deployment settings),
only the live site and its GitHub-connected auto-deploys are yours to use
day-to-day.
