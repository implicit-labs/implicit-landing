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
