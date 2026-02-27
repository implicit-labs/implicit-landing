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
