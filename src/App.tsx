import Hero from "./components/Hero";
import Problem from "./components/Problem";
import HowItWorks from "./components/HowItWorks";

function App() {
  return (
    <main className="min-h-screen bg-implicit-black">
      <Hero />
      <Problem />
      <HowItWorks />
      <footer className="py-24 px-6 border-t border-implicit-zinc-700">
        <p className="text-implicit-zinc-400">Footer</p>
      </footer>
    </main>
  );
}

export default App;
