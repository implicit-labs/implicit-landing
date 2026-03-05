import { useMemo } from "react";
import { motion } from "framer-motion";
import { useFoilTilt } from "./use-foil-tilt";
import { HoloOverlay } from "./HoloOverlay";
import type { SealedPackProps, FoilPackTheme } from "./types";

const FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif';

const FOIL_TEXTURE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8 0.4' numOctaves='3' seed='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const DEFAULT_THEME: FoilPackTheme = {
  gradient:
    "linear-gradient(135deg, #3eb8ff 0%, #1DA1F2 20%, #1a8cd8 50%, #1680c4 75%, #1270ad 100%)",
  crimpColor1: "#0f6098",
  crimpColor2: "#1478b8",
};

/*
 * Concave clip-path from source: path('M 6,0 H 214 Q 220,0 220,6 L 220,75 C 217,180 217,310 220,394 Q 220,400 214,400 H 6 Q 0,400 0,394 C 3,310 3,180 0,75 L 0,6 Q 0,0 6,0 Z')
 * Original is 220x400. Normalized to objectBoundingBox (0-1 range):
 */
const CLIP_PATH_ID = "foil-pack-clip";

function FoilPackClipDef() {
  // Original: 220w x 400h
  // Normalize all coords: x/220, y/400
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <clipPath id={CLIP_PATH_ID} clipPathUnits="objectBoundingBox">
          <path
            d={`M ${6 / 220},0
                H ${214 / 220}
                Q 1,0 1,${6 / 400}
                L 1,${75 / 400}
                C ${217 / 220},${180 / 400} ${217 / 220},${310 / 400} 1,${394 / 400}
                Q 1,1 ${214 / 220},1
                H ${6 / 220}
                Q 0,1 0,${394 / 400}
                C ${3 / 220},${310 / 400} ${3 / 220},${180 / 400} 0,${75 / 400}
                L 0,${6 / 400}
                Q 0,0 ${6 / 220},0
                Z`}
          />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ── Bulge lighting (trapezoid cross-section) ── */

const FLAP_END = 21;
const BOTTOM_END = 96;
const SIDE_MARGIN = 6;

function useBulgeLighting(x: number, y: number) {
  return useMemo(() => {
    const tiltMag = Math.min(Math.sqrt(x * x + y * y), 1);
    const baseIntensity = tiltMag * 0.4;
    const angle = Math.atan2(y, x);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const leftW = cosA * baseIntensity;
    const rightW = -cosA * baseIntensity;
    const topW = sinA * baseIntensity;
    const bottomW = -sinA * baseIntensity;

    function edgeColor(w: number) {
      if (w > 0) return `rgba(255,255,255,${w.toFixed(3)})`;
      return `rgba(0,0,0,${(-w).toFixed(3)})`;
    }

    const background = [
      `linear-gradient(90deg, ${edgeColor(leftW)} 0%, transparent 12%, transparent 100%)`,
      `linear-gradient(270deg, ${edgeColor(rightW)} 0%, transparent 12%, transparent 100%)`,
      `linear-gradient(180deg, transparent ${FLAP_END - 1}%, ${edgeColor(topW)} ${FLAP_END + 1}%, transparent ${FLAP_END + 10}%, transparent 100%)`,
      `linear-gradient(180deg, transparent 0%, transparent ${BOTTOM_END - 10}%, ${edgeColor(bottomW)} ${BOTTOM_END - 1}%, transparent ${BOTTOM_END + 1}%)`,
    ].join(",");

    const mask = [
      `linear-gradient(180deg, transparent ${FLAP_END}%, black ${FLAP_END + 3}%, black ${BOTTOM_END - 3}%, transparent ${BOTTOM_END}%)`,
      `linear-gradient(90deg, transparent ${SIDE_MARGIN - 1}%, black ${SIDE_MARGIN + 4}%, black ${100 - SIDE_MARGIN - 4}%, transparent ${100 - SIDE_MARGIN + 1}%)`,
    ].join(",");

    return { background, mask };
  }, [x, y]);
}

export function SealedPack({
  icon,
  brandName,
  subtitle,
  theme = DEFAULT_THEME,
  dragX,
  className,
}: SealedPackProps) {
  const { ref, tilt, isActive, shouldReduceMotion } = useFoilTilt(dragX);
  const { x, y } = tilt;
  const rotateX = y * -16;
  const rotateY = x * 16;
  const bulge = useBulgeLighting(x, y);

  // Kith-specific overrides (cream pack)
  const isKith = theme.crimpColor1 === "#a0ab95";
  const wrinkleOpacity = isKith ? 0.03 : 0.04;
  const flapBackground = isKith
    ? "linear-gradient(165deg, rgba(90,120,75,0.12) 0%, rgba(90,120,75,0.04) 40%, transparent 70%)"
    : "linear-gradient(165deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)";
  const highlightBackground = isKith
    ? "linear-gradient(150deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 12%, rgba(255,255,255,0.04) 25%, transparent 45%, transparent 65%, rgba(0,0,0,0.04) 85%, rgba(0,0,0,0.08) 100%)"
    : "linear-gradient(150deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 12%, rgba(255,255,255,0.02) 25%, transparent 45%, transparent 65%, rgba(0,0,0,0.06) 85%, rgba(0,0,0,0.12) 100%)";

  return (
    <div style={{ perspective: "900px" }} className={className}>
      <FoilPackClipDef />
      <motion.div
        ref={ref}
        animate={shouldReduceMotion ? {} : { rotateX, rotateY }}
        transition={{ duration: 0 }}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "11 / 20",
          clipPath: `url(#${CLIP_PATH_ID})`,
          overflow: "hidden",
          transformStyle: "preserve-3d",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.2)",
          background: theme.gradient,
          isolation: "isolate",
          fontFamily: FONT,
        }}
      >
        {/* Foil texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            opacity: 0.06,
            backgroundImage: FOIL_TEXTURE_SVG,
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
          }}
        />

        {/* Wrinkle lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
            opacity: wrinkleOpacity,
            background: [
              "linear-gradient(162deg, transparent 32%, rgba(255,255,255,0.5) 32.3%, transparent 32.6%)",
              "linear-gradient(158deg, transparent 58%, rgba(0,0,0,0.4) 58.2%, transparent 58.5%)",
              "linear-gradient(170deg, transparent 74%, rgba(255,255,255,0.3) 74.2%, transparent 74.5%)",
              "linear-gradient(155deg, transparent 18%, rgba(0,0,0,0.3) 18.2%, transparent 18.5%)",
            ].join(","),
          }}
        />

        {/* Top crimp seal */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            zIndex: 6,
            background: `repeating-linear-gradient(90deg, ${theme.crimpColor1} 0px, ${theme.crimpColor1} 2.5px, ${theme.crimpColor2} 2.5px, ${theme.crimpColor2} 5px)`,
          }}
        />

        {/* Bottom crimp seal */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            zIndex: 6,
            background: `repeating-linear-gradient(90deg, ${theme.crimpColor1} 0px, ${theme.crimpColor1} 2.5px, ${isKith ? "#adb8a2" : theme.crimpColor2} 2.5px, ${isKith ? "#adb8a2" : theme.crimpColor2} 5px)`,
          }}
        />

        {/* Flap zone */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 75,
            zIndex: 5,
            pointerEvents: "none",
            background: flapBackground,
          }}
        />

        {/* Hang hole */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: "50%",
            transform: "translateX(-50%)",
            width: 20,
            height: 20,
            borderRadius: "50%",
            zIndex: 7,
            pointerEvents: "none",
            background: isKith
              ? "radial-gradient(circle, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.02) 100%)"
              : "radial-gradient(circle, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.08) 100%)",
            boxShadow: isKith
              ? "inset 0 1px 2px rgba(0,0,0,0.12), inset 0 -1px 1px rgba(255,255,255,0.2)"
              : "inset 0 1px 2px rgba(0,0,0,0.3), inset 0 -1px 1px rgba(255,255,255,0.08)",
          }}
        />

        {/* Flap crease */}
        <div
          style={{
            position: "absolute",
            top: 75,
            left: 0,
            right: 0,
            height: 3,
            zIndex: 5,
            pointerEvents: "none",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.08) 50%, rgba(255,255,255,0.06) 100%)",
          }}
        />

        {/* Highlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            background: highlightBackground,
          }}
        />

        {/* Side edge shadows */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
            boxShadow:
              "inset 8px 0 12px -8px rgba(0,0,0,0.12), inset -8px 0 12px -8px rgba(0,0,0,0.12), inset 1px 1px 0 0 rgba(255,255,255,0.08), inset -1px -1px 0 0 rgba(0,0,0,0.12)",
          }}
        />

        {/* Side indent left */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            bottom: "5%",
            left: 0,
            width: 10,
            zIndex: 4,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 10px 50% at 0% 50%, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.06) 40%, transparent 100%)",
          }}
        />

        {/* Side indent right */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            bottom: "5%",
            right: 0,
            width: 10,
            zIndex: 4,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 10px 50% at 100% 50%, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.06) 40%, transparent 100%)",
          }}
        />

        {/* Dynamic bulge lighting */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            pointerEvents: "none",
            overflow: "hidden",
            background: bulge.background,
            maskImage: bulge.mask,
            WebkitMaskImage: bulge.mask,
            maskComposite: "intersect" as never,
            WebkitMaskComposite: "source-in" as never,
          }}
        />

        {/* Holo overlay */}
        <HoloOverlay
          x={x}
          y={y}
          isActive={isActive}
          rainbowGradient={theme.holoRainbow}
          rainbowBlendMode={theme.holoBlendMode}
        />

        {/* Branding content */}
        <div
          style={{
            position: "absolute",
            top: 82,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            padding: 20,
            pointerEvents: "none",
          }}
        >
          {icon}
          {brandName && (
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginTop: 10,
              }}
            >
              {brandName}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: 900,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                textShadow: "0 2px 8px rgba(0,0,0,0.35)",
              }}
            >
              {subtitle}
            </div>
          )}
          {(brandName || subtitle) && (
            <div
              style={{
                width: 40,
                height: 2,
                borderRadius: 1,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                marginTop: 14,
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}
