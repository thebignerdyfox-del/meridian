# Meridian

A markets dashboard where each user connects their own Alpaca brokerage
account and places real orders through it. Meridian never holds anyone's
money — it's a thin, encrypted pass-through to each user's own broker.

## 1. Local setup

```bash
cd meridian
npm install
cp .env.local.example .env.local
```

You'll fill in `.env.local` in the next two steps.

## 2. Create a free Supabase project

1. Go to https://supabase.com, create a free project.
2. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server-only)
3. In the Supabase dashboard, open **SQL Editor**, paste the contents of
   `supabase/schema.sql`, and run it. This creates the `broker_credentials`
   table with row-level security so users can only ever see their own row.
4. In **Authentication → Providers**, email/password is enabled by default —
   nothing else to do for now.

## 3. Generate an encryption secret

This encrypts every user's Alpaca keys before they're stored in the database.

```bash
openssl rand -hex 32
```

Paste the output into `ENCRYPTION_SECRET` in `.env.local`.

## 4. Get Alpaca API keys (for testing)

1. Sign up free at https://alpaca.markets.
2. In your Alpaca dashboard, switch to **Paper Trading** and generate an
   API key + secret. Paper trading uses fake money against real market
   data — perfect for testing before anyone connects a live account.
3. You don't need to put these in `.env.local` — each user (including you,
   while testing) enters their own keys through the app's **Connect broker**
   page. Keys are encrypted and stored per-user in Supabase.

## 5. Run it

```bash
npm run dev
```

Visit http://localhost:3000, sign up, connect your paper Alpaca keys, and
you'll see live prices and be able to place real (paper) orders.

## 6. Host it for free

**Frontend + backend → Vercel**
1. Push this project to a GitHub repo.
2. Go to https://vercel.com, sign in with GitHub, click **New Project**,
   import the repo.
3. In the Vercel project's **Environment Variables**, add the same four
   values from your `.env.local`.
4. Deploy. Vercel's free tier covers this comfortably.

**Database + auth → Supabase**
Already free — no extra step. Your Vercel deployment talks to the same
Supabase project you set up in step 2.

Total hosting cost: $0/month for personal/small-scale use.

## How trading actually works here

- A user enters their own Alpaca API key + secret on `/connect-broker`.
- The server verifies the keys work, encrypts them (AES-256-GCM), and
  stores them in Supabase, scoped to that user by row-level security.
- Market data and orders are fetched server-side in the API routes
  (`app/api/...`), using that user's own decrypted keys — the keys are
  never sent to the browser after the initial connect step.
- When a user clicks Buy/Sell, the order goes straight to *their* Alpaca
  account. Meridian is a UI layer, not a custodian — it never holds funds
  or securities.

## Important notes before going further

- Start with **paper trading** for everyone, including yourself, until
  you're confident in the flow.
- If you ever want Meridian itself to hold client funds or trade on
  people's behalf with a single pooled account, that crosses into
  broker-dealer / investment-adviser territory and needs real licensing —
  this build deliberately avoids that by keeping every account
  non-custodial (each user's own Alpaca login, their own money).
- Consider adding: email verification enforcement, rate limiting on the
  order endpoint, and a confirmation step for live (non-paper) orders.
