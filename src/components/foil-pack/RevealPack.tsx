import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SealedPack } from "./SealedPack";
import { TradingCard } from "./TradingCard";
import type { RevealPackProps } from "./types";

export function RevealPack({ sealedProps, cardProps, className }: RevealPackProps) {
  const [revealed, setRevealed] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div style={{ position: "relative", width: "100%" }} className={className}>
      <AnimatePresence mode="wait">
        {!revealed ? (
          <motion.div
            key="sealed"
            initial={{ opacity: 1, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.08, rotate: 2 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setRevealed(true)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <SealedPack {...sealedProps} />

            {/* "Tap to open" hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{
                position: "absolute",
                bottom: "12%",
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  textShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                }}
              >
                Tap to open
              </span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.85 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={
              shouldReduceMotion
                ? { duration: 0.2 }
                : { type: "spring", damping: 18, stiffness: 160, delay: 0.15 }
            }
          >
            <TradingCard {...cardProps} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* White flash on transition */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "white",
              borderRadius: 15,
              pointerEvents: "none",
              zIndex: 50,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
