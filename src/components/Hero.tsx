import { useWaitlistForm } from "../hooks/useWaitlistForm";
import Orb from "./Orb";

export default function Hero() {
  const { email, setEmail, submitted, handleSubmit } = useWaitlistForm();

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
