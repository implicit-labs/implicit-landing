import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const STIFFNESS = 0.06;
const DAMPING = 0.78;

/**
 * Shared spring-physics tilt hook for foil pack components.
 * Handles pointer tracking + spring animation loop.
 * Returns { ref, tilt, isActive }.
 */
export function useFoilTilt(dragX?: number | null) {
  const shouldReduceMotion = useReducedMotion();

  const elRef = useRef<HTMLDivElement | null>(null);
  const springRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0 });
  const isHoveringRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const ref = useCallback((el: HTMLDivElement | null) => {
    elRef.current = el;
  }, []);

  // Spring animation loop
  useEffect(() => {
    if (shouldReduceMotion) return;
    let running = true;

    function tick() {
      if (!running) return;
      const s = springRef.current;
      s.vx = (s.vx + (s.tx - s.x) * STIFFNESS) * DAMPING;
      s.vy = (s.vy + (s.ty - s.y) * STIFFNESS) * DAMPING;
      s.x += s.vx;
      s.y += s.vy;
      setTilt({ x: s.x, y: s.y });
      setIsActive(isHoveringRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [shouldReduceMotion]);

  // Pointer tracking
  useEffect(() => {
    const el = elRef.current;
    if (!el || shouldReduceMotion) return;

    function onPointerMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      springRef.current.tx = Math.max(
        -1,
        Math.min(1, (e.clientX - cx) / (rect.width / 2))
      );
      springRef.current.ty = Math.max(
        -1,
        Math.min(1, (e.clientY - cy) / (rect.height / 2))
      );
      isHoveringRef.current = true;
    }

    function onPointerLeave() {
      springRef.current.tx = 0;
      springRef.current.ty = 0;
      isHoveringRef.current = false;
    }

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [shouldReduceMotion]);

  // Optional dragX integration
  useEffect(() => {
    if (dragX == null || shouldReduceMotion) return;
    if (Math.abs(dragX) > 2) {
      const el = elRef.current;
      const w = el ? el.getBoundingClientRect().width : 380;
      springRef.current.tx = Math.max(-1, Math.min(1, dragX / (w * 0.5)));
      isHoveringRef.current = true;
    }
  }, [dragX, shouldReduceMotion]);

  return { ref, tilt, isActive, shouldReduceMotion };
}
