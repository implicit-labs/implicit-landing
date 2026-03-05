import { useWaitlistForm } from "../hooks/useWaitlistForm";

export default function Footer() {
  const { email, setEmail, submitted, handleSubmit } = useWaitlistForm();

  return (
    <footer className="py-24 px-6 border-t border-implicit-zinc-700">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          I'll be ready when you are.
        </h2>
        <p className="text-implicit-zinc-400 mb-10">
          Join the waitlist. You'll be the first to know.
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
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-implicit-zinc-900 border border-implicit-zinc-700 text-white placeholder-implicit-zinc-400 focus:outline-none focus:border-implicit-blue transition-colors"
            />
            <button
              type="submit"
              className="btn-waitlist px-6 py-3 rounded-lg bg-implicit-blue hover:bg-implicit-blue-hover text-white font-semibold cursor-pointer whitespace-nowrap"
            >
              Join the Waitlist
            </button>
          </form>
        )}

        <div className="mt-16 flex items-center justify-center text-implicit-zinc-400 text-sm">
          <a
            href="https://x.com/_pikachur"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-implicit-cream transition-colors"
          >
            @_pikachur
          </a>
        </div>
      </div>
    </footer>
  );
}
