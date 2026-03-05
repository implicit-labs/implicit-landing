const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

interface HoloOverlayProps {
  x: number;
  y: number;
  isActive: boolean;
  rainbowGradient?: string;
  rainbowBlendMode?: string;
}

/**
 * Shared holographic overlay — 4 layers:
 * rainbow band, spotlight, specular band, grain.
 */
const DEFAULT_RAINBOW = `conic-gradient(from 0deg,
  rgba(255,0,0,0.10),
  rgba(255,165,0,0.10),
  rgba(255,255,0,0.10),
  rgba(0,255,0,0.10),
  rgba(0,191,255,0.10),
  rgba(138,43,226,0.10),
  rgba(255,0,0,0.10))`;

export function HoloOverlay({ x, y, isActive, rainbowGradient, rainbowBlendMode }: HoloOverlayProps) {
  const spotX = x * 45 + 50;
  const spotY = y * 45 + 50;
  const holoAngle = 135 + x * 35;
  const holoOpacity = isActive ? 1 : 0;

  return (
    <>
      {/* Rainbow band */}
      <div
        style={{
          position: "absolute",
          inset: "-50%",
          width: "200%",
          height: "200%",
          zIndex: 20,
          background: rainbowGradient || DEFAULT_RAINBOW,
          mixBlendMode: (rainbowBlendMode || "color-dodge") as React.CSSProperties["mixBlendMode"],
          opacity: holoOpacity,
          transition: "opacity 0.4s ease",
          transform: `rotate(${holoAngle - 135}deg)`,
          pointerEvents: "none",
        }}
      />

      {/* Spotlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          background: `radial-gradient(circle at ${spotX}% ${spotY}%,
            rgba(255,255,255,0.5) 0%,
            rgba(255,255,255,0.1) 25%,
            rgba(255,255,255,0) 55%)`,
          mixBlendMode: "overlay",
          opacity: holoOpacity,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Specular band */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          background: `linear-gradient(${holoAngle}deg,
            transparent 25%,
            rgba(255,255,255,0.15) 45%,
            rgba(255,255,255,0.28) 50%,
            rgba(255,255,255,0.15) 55%,
            transparent 75%)`,
          mixBlendMode: "overlay",
          opacity: holoOpacity,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {/* Grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          opacity: 0.035,
          mixBlendMode: "overlay",
          backgroundImage: GRAIN_SVG,
          backgroundSize: "128px 128px",
          pointerEvents: "none",
        }}
      />
    </>
  );
}
