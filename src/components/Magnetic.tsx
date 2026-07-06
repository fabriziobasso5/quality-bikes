"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSmoothValue } from "@/lib/use-smooth-value";

const PULL = 0.35;
const MAX_SHIFT = 10;

/**
 * Wraps a CTA so it drifts a few px toward the cursor while hovered and
 * eases back on leave. Subtle by design: max 10px, transform-only.
 * Inert on touch devices and under reduced motion (renders children as-is).
 */
export default function Magnetic({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const [x, setX] = useSmoothValue(0, 0.2);
  const [y, setY] = useSmoothValue(0, 0.2);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  function onMouseMove(e: React.MouseEvent) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setX(Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, relX * PULL)));
    setY(Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, relY * PULL)));
  }

  function onMouseLeave() {
    setX(0);
    setY(0);
  }

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
}
