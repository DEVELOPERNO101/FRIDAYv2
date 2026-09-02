# Jarvis — MVP

A real login system: Google sign-in, a database, and a dashboard —
the foundation everything else (Gmail, Drive, socials, billing) gets
wired into next.

This is **not a finished product**. Nothing here actually reads your
email or posts to Instagram yet — those are the next steps, added one
at a time, only after this login foundation works.

## What's actually real here

- Google sign-in (via NextAuth) — creates a real account in a real database
- A protected `/dashboard` route only signed-in users can see
- A Stripe checkout stub, ready to activate once you add real keys
- Your logo + brand colors applied throughout

## What's NOT real yet (on purpose)

- The "Gmail / Drive / Instagram / YouTube" rows on the dashboard are
  placeholders — they show `NOT WIRED YET`. Each one is a separate,
  future build.
- Billing is a stub — clicking "Upgrade" won't charge anyone until you
  add your own Stripe keys.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up your database (local, no external service needed yet)

This project uses SQLite locally so you don't need to sign up for
anything to start. Copy the environment template:

```bash
cp .env.example .env
```

Then generate a secret for NextAuth:

```bash
openssl rand -base64 32
```

Paste that into `NEXTAUTH_SECRET` in your `.env` file.

## 3. Create a Google OAuth app (for real sign-in)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (any name — e.g. "Jarvis")
3. Go to **APIs & Services > OAuth consent screen** — choose
   "External," fill in the basic app info, and **add your own email
   as a test user**. This lets you use Google sign-in immediately
   without waiting for Google's review process (that review is only
   required before *other* people outside your test list can sign in).
4. Go to **APIs & Services > Credentials > Create Credentials >
   OAuth Client ID**
   - Application type: **Web application**
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy the **Client ID** and **Client Secret** into your `.env` file
   as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

## 4. Set up the database tables

```bash
npx prisma migrate dev --name init
```

## 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — click "Continue
with Google," sign in with your test account, and you should land on
a real, protected dashboard with your name and email pulled from your
actual Google account.

## Next steps, in order

1. **Get login working locally** (this step) — confirm you can sign
   in and see your real name/email on the dashboard.
2. **Add one real integration** (Gmail is the natural first one) —
   this means uncommenting the Gmail scope in `lib/auth.ts`, and
   writing one API route that calls the Gmail API with your stored
   access token.
3. **Deploy it** somewhere with a real domain (Vercel is the easiest
   pairing with Next.js) and switch the database from SQLite to a
   hosted Postgres (e.g. Supabase, Neon) — SQLite is fine for your
   laptop, not for multiple real users hitting a live server.
4. **Turn on Stripe for real** — create a Product + Price in your
   Stripe dashboard, add the keys, and the checkout stub will work.
5. **Submit for Google's OAuth verification** once you're ready for
   people outside your test list to sign in with Gmail/Drive scopes —
   this is required before the public can use those specific scopes,
   and can take some time, so it's worth starting once the core
   product works for you.

Come back for help with any of these one at a time — each is its own
focused build.
