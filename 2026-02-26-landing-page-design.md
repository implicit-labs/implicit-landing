# Landing Page Design

## Goals

1. **Drive waitlist signups** — maximize email capture with minimal friction
2. **Understand the market** — follow-up survey to learn who wants this and what they want it for

## Architecture

```
Vercel (landing page)
  └─ Static Vite + React + Tailwind site
  └─ Form POST → Supabase `waitlist` table

Supabase
  └─ `waitlist` table (email, created_at, source)
  └─ Database webhook on INSERT → Edge Function
  └─ Edge Function sends welcome email via Resend

Resend (transactional email)
  └─ Welcome email with Tally survey link
  └─ Free tier: 100/day, 3,000/month

Tally (survey)
  └─ Role, sources they check, biggest pain point
  └─ Free, no-code, hosted
```

## Waitlist Flow

```
1. User lands on page
2. Enters email → clicks "Join Waitlist"
3. INSERT into Supabase `waitlist` table
4. Supabase webhook fires → Edge Function
5. Edge Function calls Resend API → sends welcome email
6. Email says "You're on the list" + Tally survey link
7. User fills out survey (optional)
```

## Landing Page Structure

### Hero
- Tagline + one-liner describing Implicit
- Email input + "Join Waitlist" CTA
- Animated voice orb (reuse from client-web) as visual anchor

### Problem → Solution
- "You check 6 apps before breakfast" (problem)
- "Implicit reads them all, scores what matters, and briefs you in 90 seconds" (solution)

### How It Works (3 steps)
1. **Connect sources** — email, GitHub, Twitter, Slack, calendar
2. **AI scores signal vs noise** — personal cost function learns what matters to you
3. **Morning briefing** — voice + swipeable cards, one swipe per decision

### Social Proof / Positioning
- "Inspired by Apple's 1987 Knowledge Navigator"
- "Chief of staff, not news ticker"
- GitHub stars count (if public) or "Built by [team]"

### Footer CTA
- Repeat email capture
- Links: Twitter/X, GitHub

## Design Direction

Mirror the product's dark aesthetic:
- **Background:** Black (#000) or near-black
- **Accent:** iOS blue (#007AFF) for CTAs
- **Typography:** Inter or SF Pro fallback stack
- **Voice orb:** Animated hero element, same glow/pulse as product
- **Mobile-first:** Most traffic will come from Twitter/X on phones

## Tech Stack

| Layer | Tool | Why |
|-------|------|-----|
| Hosting | Vercel | Free, global CDN, static site |
| Framework | Vite + React + Tailwind | Same as product, no new tooling |
| Email capture | Supabase table | Already have it |
| Follow-up email | Resend | Free tier, simple API |
| Survey | Tally | Free, looks good, no-code |

## Supabase Schema

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'landing',  -- track where signups come from
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS: only service role can insert (via edge function or direct from client with anon key)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert" ON waitlist
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Deny all reads" ON waitlist
  FOR SELECT USING (false);
```

## Resend Edge Function (Supabase)

```typescript
// supabase/functions/waitlist-welcome/index.ts
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  const { record } = await req.json(); // Supabase webhook payload
  const email = record.email;

  await resend.emails.send({
    from: "Implicit <hello@implicit.app>",
    to: email,
    subject: "You're on the list",
    html: `
      <p>Thanks for joining the Implicit waitlist.</p>
      <p>We're building a voice-first AI assistant that reads your feeds,
         scores what matters, and briefs you every morning.</p>
      <p><strong>Quick favor:</strong> Tell us a bit about yourself so we
         can build the right thing.</p>
      <p><a href="https://tally.so/r/YOUR_FORM_ID">Take the 2-min survey →</a></p>
    `,
  });

  return new Response("ok");
});
```

## Growth Tactics (Increase Waitlist Numbers)

### Launch channels
- **Twitter/X** — thread announcing what you're building + waitlist link
- **Hacker News** — Show HN post when you have a demo GIF/video
- **Product Hunt** — "Coming Soon" page links to waitlist
- **Reddit** — r/artificial, r/productivity, r/SideProject

### On-page tactics
- **Live counter** — "X people on the waitlist" (social proof, updates via Supabase count)
- **Share incentive** — "Share to move up" is tempting but adds complexity. Start without it.
- **Demo GIF/video** — 15-second screen recording of the briefing flow. Worth more than any copy.

### Distribution multipliers
- **Open source angle** — if repo is public, devs share it naturally
- **Knowledge Navigator nostalgia** — the 1987 video is legendary in tech circles, reference it

## Survey Questions (Tally)

1. **What best describes you?** — Developer / Founder / VC / Product Manager / Designer / Other
2. **Which sources are noisiest for you?** (multi-select) — Email / GitHub / Twitter-X / Slack-Discord / Calendar / News-RSS
3. **How do you currently stay on top of everything?** (optional, open-ended)

## Domain Setup

- `implicit.app` → Vercel (landing page)
- `app.implicit.app` → Railway (product)
- Or: `implicit.app` → landing, redirect after auth to Railway domain

## Open Questions

- [ ] Do we have a domain yet? (implicit.app, getimplicit.com, etc.)
- [ ] Is the repo public? (affects GitHub-based growth tactics)
- [ ] Do we have a demo video/GIF ready?
- [ ] Resend requires a verified domain for custom `from` address — which domain?
