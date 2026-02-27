# Setup Guide: Waitlist Backend

The landing page ships as UI-only. This guide wires up the backend when you're ready.

## 1. Supabase Waitlist Table

You already have a Supabase project. Run this in the SQL Editor:

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'landing',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Deny all reads" ON waitlist
  FOR SELECT USING (false);
```

Then in your landing page code, replace the console.log with:

```typescript
// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

```typescript
// In your form submit handler, replace console.log:
import { supabase } from "./lib/supabase";

const { error } = await supabase.from("waitlist").insert({ email });
if (error?.code === "23505") {
  // Already on the list — show success anyway (don't leak membership)
}
```

Add to `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Install the dependency:
```bash
npm install @supabase/supabase-js
```

---

## 2. Resend Welcome Email

### Create account
1. Go to [resend.com](https://resend.com) and sign up
2. Add and verify your sending domain (e.g. `implicit.app`)
3. Copy your API key

### Deploy the Supabase Edge Function

```bash
supabase functions new waitlist-welcome
```

Write `supabase/functions/waitlist-welcome/index.ts`:

```typescript
import { Resend } from "npm:resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  const { record } = await req.json();

  await resend.emails.send({
    from: "Implicit <hello@implicit.app>",
    to: record.email,
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

Set the secret and deploy:
```bash
supabase secrets set RESEND_API_KEY=re_xxxxx
supabase functions deploy waitlist-welcome
```

### Wire the webhook
1. Supabase Dashboard → Database → Webhooks
2. Create webhook:
   - Table: `waitlist`
   - Events: `INSERT`
   - Type: Supabase Edge Function
   - Function: `waitlist-welcome`

---

## 3. Tally Survey

1. Go to [tally.so](https://tally.so) and create a form
2. Add these questions:
   - **What best describes you?** (single select) — Developer / Founder / VC / Product Manager / Designer / Other
   - **Which sources are noisiest for you?** (multi-select) — Email / GitHub / Twitter-X / Slack-Discord / Calendar / News-RSS
   - **How do you currently stay on top of everything?** (long text, optional)
3. Publish the form and copy the URL
4. Replace `YOUR_FORM_ID` in the Resend email template above

---

## 4. Live Waitlist Counter (Optional)

When you have real signups and want social proof:

Add a Supabase RPC function:
```sql
CREATE FUNCTION waitlist_count() RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM waitlist;
$$ LANGUAGE sql SECURITY DEFINER;
```

Call it from the frontend:
```typescript
const { data } = await supabase.rpc("waitlist_count");
// data is the count number
```

Display it near the CTA: `${count}+ people on the waitlist`.

---

## Order of Operations

1. **Ship the landing page** (UI-only, console.log)
2. **Wire Supabase** (10 min — table + client swap)
3. **Create Tally form** (5 min — copy the questions above)
4. **Set up Resend** (15 min — account, domain verification, edge function)
5. **Add live counter** (5 min — when you have signups worth showing)
