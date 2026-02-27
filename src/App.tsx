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
