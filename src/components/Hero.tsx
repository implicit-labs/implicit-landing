import { useState } from "react";
import { useWaitlistForm } from "../hooks/useWaitlistForm";
import { SealedPack } from "./foil-pack";
import type { SealedPackProps } from "./foil-pack";

/* ── Twitter bird SVG ── */

function TwitterBird() {
  return (
    <svg
      viewBox="0 0 300 244"
      fill="white"
      style={{
        width: 72,
        height: "auto",
        filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
      }}
    >
      <path d="M94.7 243.2c112.5 0 174-93.2 174-174 0-2.6 0-5.3-.2-7.9 11.9-8.6 22.3-19.4 30.5-31.6-10.9 4.9-22.7 8.1-35 9.6 12.6-7.5 22.3-19.5 26.8-33.7-11.8 7-24.8 12-38.7 14.8-11.1-11.8-27-19.2-44.6-19.2-33.7 0-61.1 27.4-61.1 61.1 0 4.8.5 9.5 1.6 14C96.1 73.7 51 49.1 20.8 12.4c-5.2 9-8.2 19.5-8.2 30.6 0 21.2 10.8 39.9 27.2 50.9-10-.3-19.5-3.1-27.7-7.6v.8c0 29.6 21.1 54.3 49 59.9-5.1 1.4-10.5 2.1-16.1 2.1-3.9 0-7.8-.4-11.5-1.1 7.8 24.3 30.3 42 57 42.5-20.9 16.4-47.2 26.1-75.8 26.1-4.9 0-9.8-.3-14.6-.9 27 17.3 59.1 27.4 93.6 27.4" />
    </svg>
  );
}

/* ── Kith branding (Cormorant Garamond serif) ── */

function KithBranding() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}
    >
      <div
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: 38,
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: "2px",
          color: "rgba(25,20,12,0.95)",
          textShadow: "0 1px 2px rgba(255,255,255,0.4)",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        implicit
      </div>
      <div
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "6px",
          textTransform: "uppercase",
          color: "rgba(25,20,12,0.65)",
          marginTop: 6,
        }}
      >
        Booster Pack
      </div>
      <div
        style={{
          width: 50,
          height: 1,
          background: "rgba(40,35,28,0.15)",
          margin: "16px 0",
        }}
      />
      <div
        style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontSize: 13,
          fontWeight: 400,
          fontStyle: "italic",
          letterSpacing: "1px",
          color: "rgba(40,35,28,0.35)",
        }}
      >
        Series One
      </div>
    </div>
  );
}

/* ── Preset configs ── */

type PackPreset = Pick<SealedPackProps, "icon" | "brandName" | "subtitle" | "theme">;

const PRESETS: Record<string, PackPreset> = {
  Kith: {
    icon: <KithBranding />,
    brandName: "",
    subtitle: "",
    theme: {
      gradient:
        "linear-gradient(135deg, #f5f0e8 0%, #ece5d8 20%, #e0d9cc 50%, #d6cfc2 75%, #ccc5b8 100%)",
      crimpColor1: "#a0ab95",
      crimpColor2: "#b4bfaa",
      holoRainbow: `conic-gradient(from 0deg,
        rgba(180,160,120,0.06),
        rgba(200,180,140,0.10),
        rgba(220,200,160,0.14),
        rgba(180,165,130,0.08),
        rgba(210,190,150,0.12),
        rgba(190,170,130,0.06),
        rgba(180,160,120,0.06))`,
      holoBlendMode: "overlay",
    },
  },
  Twitter: {
    icon: <TwitterBird />,
    brandName: "Twitter",
    subtitle: "Booster Pack",
    theme: {
      gradient:
        "linear-gradient(135deg, #3eb8ff 0%, #1DA1F2 20%, #1a8cd8 50%, #1680c4 75%, #1270ad 100%)",
      crimpColor1: "#0f6098",
      crimpColor2: "#1478b8",
    },
  },
};

const PRESET_KEYS = Object.keys(PRESETS);

export default function Hero() {
  const { email, setEmail, submitted, handleSubmit } = useWaitlistForm();
  const [activePreset, setActivePreset] = useState("Kith");
  const preset = PRESETS[activePreset];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-44 sm:w-52 mb-6">
        <SealedPack {...preset} />
      </div>

      {/* Pack toggle */}
      <button
        onClick={() =>
          setActivePreset((prev) =>
            PRESET_KEYS[(PRESET_KEYS.indexOf(prev) + 1) % PRESET_KEYS.length]
          )
        }
        className="mb-10 w-12 h-6 rounded-full relative cursor-pointer group"
        aria-label="Toggle pack style"
        style={{
          background: activePreset === PRESET_KEYS[0]
            ? "linear-gradient(135deg, #d6cfc2, #b4bfaa)"
            : "linear-gradient(135deg, #1a8cd8, #1270ad)",
          transition: "background 0.2s ease",
          boxShadow: activePreset === PRESET_KEYS[0]
            ? "0 0 12px rgba(180,160,120,0.3), inset 0 1px 1px rgba(255,255,255,0.3)"
            : "0 0 12px rgba(29,161,242,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
        }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]"
          style={{
            left: activePreset === PRESET_KEYS[0] ? 4 : "calc(100% - 20px)",
            background: "white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2), 0 0 8px rgba(255,255,255,0.4)",
          }}
        />
      </button>

      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal italic tracking-wide max-w-3xl">
        <span className="text-implicit-cream">Information,</span>{" "}
        <span className="text-implicit-cream-muted">dealt just right.</span>
      </h1>

      <p className="mt-6 text-xl sm:text-2xl md:text-3xl text-implicit-cream max-w-2xl tracking-wide leading-relaxed">
        A new interface that feels intuitive without the prompting. Every card
        surfaces just what you need to communicate with AI and your world.
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
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-implicit-zinc-900 border border-implicit-zinc-700 text-implicit-cream placeholder-implicit-zinc-400 focus:outline-none focus:border-implicit-blue transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-implicit-blue hover:bg-implicit-blue-hover text-implicit-black font-semibold transition-colors cursor-pointer whitespace-nowrap"
          >
            Join the Waitlist
          </button>
        </form>
      )}
    </section>
  );
}
