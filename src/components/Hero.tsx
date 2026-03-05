import { useWaitlistForm } from "../hooks/useWaitlistForm";
import { SealedPack } from "./foil-pack";


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
          fontWeight: 400,
          letterSpacing: "6px",
          textTransform: "uppercase",
          color: "rgba(40,35,28,0.4)",
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

export default function Hero() {
  const { email, setEmail, submitted, handleSubmit } = useWaitlistForm();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="w-44 sm:w-52 mb-10">
        <SealedPack
          icon={<KithBranding />}
          brandName=""
          subtitle=""
          theme={{
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
          }}
        />
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
        I've read everything.{" "}
        <span className="text-implicit-zinc-400">Here's what matters.</span>
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-implicit-zinc-400 max-w-2xl">
        Your email, GitHub, Slack, Twitter, and calendar — scored, sorted, and
        briefed to you in 90 seconds.
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
