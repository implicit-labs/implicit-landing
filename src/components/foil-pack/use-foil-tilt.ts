import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const STIFFNESS = 0.06;
const DAMPING = 0.78;

/**
 * Shared spring-physics tilt hook for foil pack components.
 * Handles pointer tracking + spring animation loop.
 * On mobile: supports touch drag and device orientation (gyroscope).
 * Returns { ref, tilt, isActive }.
 */
export function useFoilTilt(dragX?: number | null) {
  const shouldReduceMotion = useReducedMotion();

  const elRef = useRef<HTMLDivElement | null>(null);
  const springRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, vx: 0, vy: 0 });
  const isHoveringRef = useRef(false);
  const isTouchingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const gyroGrantedRef = useRef(false);

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const ref = useCallback((el: HTMLDivElement | null) => {
    elRef.current = el;
    // Prevent scroll hijack when touching the card
    if (el) el.style.touchAction = "none";
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

  // Pointer tracking (desktop hover + touch drag)
  useEffect(() => {
    const el = elRef.current;
    if (!el || shouldReduceMotion) return;

    function updateFromPointer(e: PointerEvent) {
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

    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === "touch") {
        isTouchingRef.current = true;
        el!.setPointerCapture(e.pointerId);
        updateFromPointer(e);
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType === "touch" && !isTouchingRef.current) return;
      updateFromPointer(e);
    }

    function onPointerUp(e: PointerEvent) {
      if (e.pointerType === "touch") {
        isTouchingRef.current = false;
      }
      springRef.current.tx = 0;
      springRef.current.ty = 0;
      isHoveringRef.current = false;
    }

    function onPointerLeave() {
      if (isTouchingRef.current) return; // captured touch, ignore leave
      springRef.current.tx = 0;
      springRef.current.ty = 0;
      isHoveringRef.current = false;
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("pointerleave", onPointerLeave);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [shouldReduceMotion]);

  // Device orientation (gyroscope) — passive tilt when not touching
  useEffect(() => {
    if (shouldReduceMotion) return;
    const el = elRef.current;
    if (!el) return;

    // Only use gyro on touch devices
    const isTouch = "ontouchstart" in window;
    if (!isTouch) return;

    function handleOrientation(e: DeviceOrientationEvent) {
      // Don't override active touch
      if (isTouchingRef.current) return;

      const beta = e.beta ?? 0; // front-back tilt (-180 to 180)
      const gamma = e.gamma ?? 0; // left-right tilt (-90 to 90)

      // Map to -1..1 range with a ~20° range for comfortable tilt
      const x = Math.max(-1, Math.min(1, gamma / 20));
      const y = Math.max(-1, Math.min(1, (beta - 45) / 20)); // 45° is natural phone hold angle

      springRef.current.tx = x;
      springRef.current.ty = y;
      isHoveringRef.current = true;
    }

    function requestGyro() {
      // iOS 13+ requires permission
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DOE.requestPermission === "function") {
        // We'll request on first touch of the card
        const onFirstTouch = async () => {
          try {
            const perm = await DOE.requestPermission!();
            if (perm === "granted") {
              gyroGrantedRef.current = true;
              window.addEventListener("deviceorientation", handleOrientation);
            }
          } catch {
            // silently fail
          }
        };
        el!.addEventListener("touchstart", onFirstTouch, { once: true });
      } else {
        // Android and non-iOS — no permission needed
        gyroGrantedRef.current = true;
        window.addEventListener("deviceorientation", handleOrientation);
      }
    }

    requestGyro();

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
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
