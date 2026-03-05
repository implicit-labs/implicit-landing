# Implicit Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a dark, mobile-first landing page with an animated CSS orb, PAS copy, and a waitlist email form (console.log for now).

**Architecture:** Single-page Vite + React + TypeScript + Tailwind app. No routing, no backend. One `App.tsx` composes section components top-to-bottom. CSS-only animated orb. Form logs email to console — Supabase swap documented in `docs/setup-guide.md`.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS v4, Inter font (Google Fonts)

---

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `postcss.config.js`, `.gitignore`

**Step 1: Scaffold with Vite**

```bash
npm create vite@latest . -- --template react-ts
```

Select: React, TypeScript

**Step 2: Install Tailwind CSS v4**

```bash
npm install tailwindcss @tailwindcss/vite
```

**Step 3: Configure Vite plugin**

Replace `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**Step 4: Set up Tailwind in CSS**

Replace `src/index.css`:

```css
@import "tailwindcss";
```

**Step 5: Clean up scaffolded files**

- Delete `src/App.css`
- Delete `src/assets/` directory
- Replace `src/App.tsx` with a minimal placeholder:

```tsx
function App() {
  return (
    <main className="min-h-screen bg-black text-white">
      <h1 className="text-4xl p-8">Implicit</h1>
    </main>
  );
}

export default App;
```

**Step 6: Add Inter font to `index.html`**

Add inside `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

Update `<title>` to: `Implicit — Your morning briefing, not your morning scroll`

**Step 7: Verify dev server**

```bash
npm run dev
```

Expected: Page loads at localhost:5173 with black background and white "Implicit" text.

**Step 8: Commit**

```bash
git checkout -b feat/landing-page
git add -A
git commit -m "chore: scaffold Vite + React + Tailwind project"
```

---

### Task 2: Design tokens and base layout

**Files:**
- Modify: `src/index.css`
- Modify: `src/App.tsx`

**Step 1: Add design tokens and global styles to `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --color-implicit-black: #000000;
  --color-implicit-blue: #007AFF;
  --color-implicit-blue-hover: #0066D6;
  --color-implicit-zinc-400: #a1a1aa;
  --color-implicit-zinc-700: #3f3f46;
  --color-implicit-zinc-900: #18181b;
  --font-family-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family-sans);
  background: var(--color-implicit-black);
  color: #ffffff;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Step 2: Set up App.tsx layout skeleton**

```tsx
function App() {
  return (
    <main className="min-h-screen bg-implicit-black">
      <section id="hero" className="min-h-screen flex items-center justify-center px-6">
        <p className="text-implicit-zinc-400">Hero</p>
      </section>
      <section id="problem" className="py-24 px-6">
        <p className="text-implicit-zinc-400">Problem</p>
      </section>
      <section id="how-it-works" className="py-24 px-6">
        <p className="text-implicit-zinc-400">How It Works</p>
      </section>
      <footer className="py-24 px-6 border-t border-implicit-zinc-700">
        <p className="text-implicit-zinc-400">Footer</p>
      </footer>
    </main>
  );
}

export default App;
```

**Step 3: Verify**

```bash
npm run dev
```

Expected: Black page with four labeled sections visible when scrolling.

**Step 4: Commit**

```bash
git add src/index.css src/App.tsx
git commit -m "style: add design tokens and section layout skeleton"
```

---

### Task 3: Animated CSS orb component

**Files:**
- Create: `src/components/Orb.tsx`

**Step 1: Create the orb component**

```tsx
export default function Orb() {
  return (
    <div className="relative w-48 h-48 mx-auto mb-12">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-implicit-blue/20 blur-3xl animate-pulse" />
      {/* Mid glow */}
      <div className="absolute inset-4 rounded-full bg-implicit-blue/30 blur-2xl animate-[pulse_3s_ease-in-out_infinite]" />
      {/* Core */}
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-implicit-blue/60 to-implicit-blue/20 blur-xl animate-[pulse_2s_ease-in-out_infinite]" />
      {/* Center dot */}
      <div className="absolute inset-16 rounded-full bg-implicit-blue/80 blur-sm" />
    </div>
  );
}
```

**Step 2: Smoke-test in App.tsx**

Temporarily add to hero section:

```tsx
import Orb from "./components/Orb";

// In hero section:
<Orb />
```

**Step 3: Verify**

Expected: Glowing blue orb with layered pulse animation centered on black background.

**Step 4: Commit**

```bash
git add src/components/Orb.tsx src/App.tsx
git commit -m "feat: add animated CSS orb component"
```

---

### Task 4: Hero section with email form

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/App.tsx`

**Step 1: Create Hero component**

```tsx
import { useState } from "react";
import Orb from "./Orb";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log("Waitlist signup:", email);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Orb />

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
        Your morning briefing,{" "}
        <span className="text-implicit-zinc-400">not your morning scroll</span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-implicit-zinc-400 max-w-2xl">
        Implicit reads your email, GitHub, Slack, Twitter, and calendar — scores
        what matters — and briefs you in 90 seconds.
      </p>

      {submitted ? (
        <p className="mt-10 text-implicit-blue text-lg font-medium">
          You're on the list. We'll be in touch.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-md"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-implicit-zinc-900 border border-implicit-zinc-700 text-white placeholder-implicit-zinc-400 focus:outline-none focus:border-implicit-blue transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-implicit-blue hover:bg-implicit-blue-hover text-white font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Join the Waitlist
          </button>
        </form>
      )}
    </section>
  );
}
```

**Step 2: Wire into App.tsx**

Replace the hero placeholder with `<Hero />`.

```tsx
import Hero from "./components/Hero";

function App() {
  return (
    <main className="min-h-screen bg-implicit-black">
      <Hero />
      <section id="problem" className="py-24 px-6">
        <p className="text-implicit-zinc-400">Problem</p>
      </section>
      <section id="how-it-works" className="py-24 px-6">
        <p className="text-implicit-zinc-400">How It Works</p>
      </section>
      <footer className="py-24 px-6 border-t border-implicit-zinc-700">
        <p className="text-implicit-zinc-400">Footer</p>
      </footer>
    </main>
  );
}

export default App;
```

**Step 3: Verify**

- Open dev server
- See orb + headline + subheadline + email form
- Enter email, submit → console shows "Waitlist signup: ..."
- Form replaced with "You're on the list" confirmation
- Test mobile viewport (375px) — stacks vertically

**Step 4: Commit**

```bash
git add src/components/Hero.tsx src/App.tsx
git commit -m "feat: add hero section with email capture form"
```

---

### Task 5: Problem + Solution section

**Files:**
- Create: `src/components/Problem.tsx`
- Modify: `src/App.tsx`

**Step 1: Create Problem component**

```tsx
export default function Problem() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
          You check 6 apps before breakfast.{" "}
          <span className="text-implicit-zinc-400">
            You skim 50 notifications to find the 3 that matter. By 9am, you're already behind.
          </span>
        </p>

        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-implicit-zinc-700 to-transparent" />

        <p className="mt-16 text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
          Implicit is your AI chief of staff.{" "}
          <span className="text-implicit-zinc-400">
            It connects to your sources, learns your priorities, and delivers a spoken briefing every morning — one swipe per decision.
          </span>
        </p>
      </div>
    </section>
  );
}
```

**Step 2: Wire into App.tsx**

Replace the problem placeholder:

```tsx
import Problem from "./components/Problem";

// Replace: <section id="problem">...</section>
// With: <Problem />
```

**Step 3: Verify**

Expected: Problem text in white, elaboration in zinc-400, separated by a fading horizontal line.

**Step 4: Commit**

```bash
git add src/components/Problem.tsx src/App.tsx
git commit -m "feat: add problem/solution section"
```

---

### Task 6: How It Works section

**Files:**
- Create: `src/components/HowItWorks.tsx`
- Modify: `src/App.tsx`

**Step 1: Create HowItWorks component**

```tsx
const steps = [
  {
    number: "1",
    title: "Connect your sources",
    description: "Email, GitHub, Twitter, Slack, Calendar",
  },
  {
    number: "2",
    title: "AI scores signal vs noise",
    description: "A personal cost function learns what matters to you",
  },
  {
    number: "3",
    title: "90-second morning briefing",
    description: "Voice + swipeable cards, one swipe per decision",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-implicit-zinc-700 text-implicit-blue font-semibold text-sm mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-implicit-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Wire into App.tsx**

Replace the how-it-works placeholder:

```tsx
import HowItWorks from "./components/HowItWorks";

// Replace: <section id="how-it-works">...</section>
// With: <HowItWorks />
```

**Step 3: Verify**

- Desktop: 3 columns side by side
- Mobile: stacked single column, centered text

**Step 4: Commit**

```bash
git add src/components/HowItWorks.tsx src/App.tsx
git commit -m "feat: add how it works section"
```

---

### Task 7: Footer with repeat CTA

**Files:**
- Create: `src/components/Footer.tsx`
- Modify: `src/App.tsx`

**Step 1: Create Footer component**

```tsx
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log("Waitlist signup:", email);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="py-24 px-6 border-t border-implicit-zinc-700">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Get early access
        </h2>
        <p className="text-implicit-zinc-400 mb-10">
          Join the waitlist. We'll let you know when it's ready.
        </p>

        {submitted ? (
          <p className="text-implicit-blue text-lg font-medium">
            You're on the list. We'll be in touch.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-implicit-zinc-900 border border-implicit-zinc-700 text-white placeholder-implicit-zinc-400 focus:outline-none focus:border-implicit-blue transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-implicit-blue hover:bg-implicit-blue-hover text-white font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Join the Waitlist
            </button>
          </form>
        )}

        <div className="mt-16 flex items-center justify-center gap-6 text-implicit-zinc-400 text-sm">
          <a
            href="https://x.com/implicit"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Twitter/X
          </a>
          <a
            href="https://github.com/implicit"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Wire into App.tsx**

Replace the footer placeholder. Final `App.tsx`:

```tsx
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";

function App() {
  return (
    <main className="min-h-screen bg-implicit-black">
      <Hero />
      <Problem />
      <HowItWorks />
      <Footer />
    </main>
  );
}

export default App;
```

**Step 3: Verify**

- Scroll to bottom — see repeat email form and links
- Submit email — same console.log + confirmation behavior
- Links open in new tab

**Step 4: Commit**

```bash
git add src/components/Footer.tsx src/App.tsx
git commit -m "feat: add footer with repeat CTA and social links"
```

---

### Task 8: Final polish and Vercel config

**Files:**
- Modify: `index.html` (meta tags)
- Create: `public/favicon.svg`

**Step 1: Add meta tags to `index.html`**

Add inside `<head>`:

```html
<meta name="description" content="Implicit reads your email, GitHub, Slack, Twitter, and calendar — scores what matters — and briefs you in 90 seconds." />
<meta property="og:title" content="Implicit — Your morning briefing, not your morning scroll" />
<meta property="og:description" content="A voice-first AI chief of staff that reads your feeds, scores what matters, and briefs you every morning." />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Implicit — Your morning briefing, not your morning scroll" />
<meta name="twitter:description" content="A voice-first AI chief of staff that reads your feeds, scores what matters, and briefs you every morning." />
```

**Step 2: Create a simple favicon**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="12" fill="#007AFF" opacity="0.8"/>
  <circle cx="16" cy="16" r="6" fill="#007AFF"/>
</svg>
```

**Step 3: Run build to verify no errors**

```bash
npm run build
```

Expected: `dist/` folder created with no errors.

**Step 4: Commit**

```bash
git add index.html public/favicon.svg
git commit -m "chore: add meta tags and favicon"
```

---

## Summary

| Task | What | Commit |
|------|------|--------|
| 1 | Scaffold Vite + React + Tailwind | `chore: scaffold Vite + React + Tailwind project` |
| 2 | Design tokens + section skeleton | `style: add design tokens and section layout skeleton` |
| 3 | Animated CSS orb | `feat: add animated CSS orb component` |
| 4 | Hero + email form | `feat: add hero section with email capture form` |
| 5 | Problem/Solution copy | `feat: add problem/solution section` |
| 6 | How It Works 3-step | `feat: add how it works section` |
| 7 | Footer + repeat CTA | `feat: add footer with repeat CTA and social links` |
| 8 | Meta tags + favicon + build verify | `chore: add meta tags and favicon` |
