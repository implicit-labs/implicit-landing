const steps = [
  {
    number: "1",
    title: "I read your sources",
    description: "Email, GitHub, Twitter, Slack, Calendar — all of them, every morning.",
  },
  {
    number: "2",
    title: "I learn what matters",
    description: "Signal gets through. Noise doesn't. It gets better every day.",
  },
  {
    number: "3",
    title: "I brief you in 90 seconds",
    description: "Voice and cards. One swipe per decision. Then you're done.",
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
