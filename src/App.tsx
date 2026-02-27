import Hero from "./components/Hero";
import Problem from "./components/Problem";

function App() {
  return (
    <main className="min-h-screen bg-implicit-black">
      <Hero />
      <Problem />
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
