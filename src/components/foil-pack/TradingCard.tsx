import { motion } from "framer-motion";
import { useFoilTilt } from "./use-foil-tilt";
import { HoloOverlay } from "./HoloOverlay";
import type { TradingCardProps, FoilPackTheme } from "./types";

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif';

const DEFAULT_THEME: FoilPackTheme = {
  gradient:
    "linear-gradient(135deg, #3eb8ff 0%, #1DA1F2 25%, #1a8cd8 50%, #1680c4 75%, #1270ad 100%)",
  crimpColor1: "#0f6098",
  crimpColor2: "#1478b8",
};

export function TradingCard({
  icon,
  name,
  cardType,
  flavorText,
  stats,
  theme = DEFAULT_THEME,
  dragX,
  className,
}: TradingCardProps) {
  const { ref, tilt, isActive, shouldReduceMotion } = useFoilTilt(dragX);
  const { x, y } = tilt;
  const rotateX = y * -16;
  const rotateY = x * 16;

  return (
    <div style={{ perspective: "900px" }} className={className}>
      <motion.div
        ref={ref}
        animate={shouldReduceMotion ? {} : { rotateX, rotateY }}
        transition={{ duration: 0 }}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "5 / 7",
          borderRadius: 12,
          overflow: "hidden",
          transformStyle: "preserve-3d",
          border: "3px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
          background: theme.gradient,
          isolation: "isolate",
          fontFamily: FONT,
        }}
      >
        {/* Diagonal lighting */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            borderRadius: "inherit",
            background:
              "linear-gradient(155deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 15%, transparent 40%, rgba(0,0,0,0.06) 80%, rgba(0,0,0,0.12) 100%)",
          }}
        />

        {/* Double frame border */}
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: 8,
            border: "2px solid rgba(255,255,255,0.12)",
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 4,
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>

        {/* Art area */}
        <div
          style={{
            position: "absolute",
            top: "6%",
            left: 18,
            right: 18,
            height: "42%",
            borderRadius: 6,
            background: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, rgba(0,0,0,0.06) 100%), ${theme.gradient}`,
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            zIndex: 3,
          }}
        >
          {icon}
        </div>

        {/* Text zone */}
        <div
          style={{
            position: "absolute",
            top: "52%",
            left: 18,
            right: 18,
            bottom: 18,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            zIndex: 4,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.5px",
            }}
          >
            {name}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {cardType}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontStyle: "italic",
              lineHeight: 1.5,
              marginTop: 2,
            }}
          >
            &ldquo;{flavorText}&rdquo;
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  padding: "5px 12px",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                {stat.label}
                <span
                  style={{
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 800,
                    display: "block",
                    marginTop: 2,
                  }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Holo overlay */}
        <HoloOverlay x={x} y={y} isActive={isActive} />
      </motion.div>
    </div>
  );
}
