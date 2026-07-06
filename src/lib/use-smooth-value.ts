"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

/**
 * A motion value that eases toward its target with a per-frame lerp,
 * self-stopping once converged. Exists because framer-motion 12.x's
 * useSpring hook silently fails to propagate updates under React 19 in this
 * project (plain motion values and `animate` props work fine) — verified
 * empirically; see TiltCard history. Visually equivalent for cursor-driven
 * micro-interactions, and cheaper: one rAF only while values are moving.
 */
export function useSmoothValue(
  initial: number,
  factor = 0.18
): [MotionValue<number>, (target: number) => void] {
  const value = useMotionValue(initial);
  const target = useRef(initial);
  const raf = useRef<number | null>(null);

  const tick = useCallback(() => {
    const current = value.get();
    const t = target.current;
    const next = current + (t - current) * factor;
    if (Math.abs(t - next) < 0.01) {
      value.set(t);
      raf.current = null;
      return;
    }
    value.set(next);
    raf.current = requestAnimationFrame(tick);
  }, [value, factor]);

  const set = useCallback(
    (t: number) => {
      target.current = t;
      if (raf.current == null) raf.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  useEffect(
    () => () => {
      if (raf.current != null) cancelAnimationFrame(raf.current);
    },
    []
  );

  return [value, set];
}
