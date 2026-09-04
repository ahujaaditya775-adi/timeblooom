# TimeBloom 🌙

A digital time-capsule platform — preserve a memory today, and rediscover it on a future date you choose. Built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase (Auth + Postgres + Storage, all under Row Level Security), and Framer Motion.

## What's inside

- **Landing page** — hero with an animated floating capsule, "how it works," feature cards, sample memories, final CTA
- **Auth** — email/password sign up with verification, login, forgot/reset password, protected routes via middleware
- **Dashboard** — summary stats, search/filter by status and mood, capsule grid with live countdowns
- **4-step capsule wizard** — basics → memory letter + photos/video/voice → unlock date/timezone/privacy → preview & seal
- **Locked capsule view** — countdown only; the server strips the letter and media from the response entirely until `unlock_at` has passed, so there's nothing to leak even via a direct API call
- **Unlocked reveal** — tap-to-open cinematic animation, letter, photo gallery, video/audio, a reflection field
- **Settings** — profile + avatar, password change, email notification toggle, per-capsule deletion, full account deletion
- **API routes** for capsules, media upload, reflections, public share links, and a cron endpoint for unlock emails

## 1. Prerequisites

- Node.js 18.18+
- A free [Supabase](https://supabase.com) project
- (Optional) A [Resend](https://resend.com) account for real emails — without one, emails are simply logged to the server console and everything else keeps working

## 2. Set up Supabase

1. Create a new Supabase project.
2. Open the **SQL Editor** and run the entire contents of [`supabase/schema.sql`](./supabase/schema.sql). This creates all four tables, indexes, triggers, Row Level Security policies, and the two storage buckets (`capsule-media` — private, `avatars` — public) with their own storage policies.
3. In **Authentication → URL Configuration**, set your Site URL and add a redirect URL for `/reset-password` and `/dashboard` (both `http://localhost:3000/...` for local dev and your production domain later).
4. In **Authentication → Email Templates**, TimeBloom relies on Supabase's built-in email confirmation and password-reset flows — no changes required, but feel free to restyle the templates.

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page — **server-only, never expose this to the client** |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Optional — [resend.com](https://resend.com). Omit and emails just log to the console |
| `CRON_SECRET` | Any long random string you choose |

## 4. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 5. Wire up the unlock-notification cron (optional but recommended)

`GET /api/cron/notify?secret=YOUR_CRON_SECRET` sends "opens soon" and "just unlocked" emails, and is idempotent (tracked per-capsule in the `notification_log` table so retries never double-send). Schedule it to run every 15–60 minutes with:

- **Vercel Cron** — add a `vercel.json` with a cron entry hitting that URL, or use the Vercel dashboard's Cron Jobs UI
- **GitHub Actions** — a scheduled workflow with a `curl` step
- **cron-job.org** or similar — point it at your deployed URL with the secret as a query param

## 6. Add real media assets (optional)

Two decorative assets are referenced but not included, since sourcing real photography/video isn't something this repo can do for you:

- `public/images/hero-poster.jpg` — a still image shown before/instead of the hero video
- `public/videos/moonlit-clouds.mp4` — a short, muted, looping night-sky clip

The app works and looks intentional without them (the starfield, glow orbs, and gradient carry the hero section), but adding them completes the "cinematic" effect described in the brief. See the `README.md` files inside each of those folders for specs.

## 7. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` in the Vercel project settings.
4. Deploy. Update `NEXT_PUBLIC_SITE_URL` and your Supabase redirect URLs to the production domain afterward.

## Project structure

```
src/
  app/                  # Routes (App Router)
    (auth)/             # login, signup, forgot/reset password
    dashboard/          # authenticated dashboard
    capsule/new/        # 4-step creation wizard
    capsule/[id]/       # locked or unlocked capsule view
    settings/           # profile, password, notifications, deletion
    api/                # capsules, media, reflections, share, cron
  components/           # ui/, landing/, dashboard/, capsule/, settings/, layout/
  lib/
    supabase/           # browser client, server client, service-role client, middleware
    data/                # server-only data access (enforces unlock status)
    emails/              # Resend wrapper with console-log fallback
    types.ts / utils.ts
supabase/
  schema.sql            # tables, RLS policies, storage buckets — run this first
```

## Security notes

- Every table has Row Level Security enabled; the anon/browser key can never read another user's row.
- Locked capsule content (`memory_text`, media) is stripped **server-side** before the response is built — not hidden in the UI — so a direct fetch to `/api/capsules/[id]` before `unlock_at` still returns nothing sensitive.
- The Supabase **service-role key** is only ever used in two places, both server-only: the cron notification route and the public share-token route (since an anonymous visitor has no session for RLS to scope against). It is never sent to the browser.
- Uploaded media lives in a **private** storage bucket; the app hands out short-lived signed URLs rather than public links.
- Account deletion uses `supabase.auth.admin.deleteUser`, which cascades through capsules, media, and reflections via foreign keys.
