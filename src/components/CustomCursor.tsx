"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSmoothValue } from "@/lib/use-smooth-value";

const INTERACTIVE = "a, button, [role='button'], input, select, textarea, label";

/**
 * A small trailing dot with eased follow — technical, precise, not a toy.
 * White + mix-blend-difference so it reads on both the white body and the
 * navy sections without any color bookkeeping. The native cursor stays
 * visible (safety: the site never becomes cursor-less if JS stalls).
 * Mounted only on fine pointers; touch devices never run any of this.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const [x, setX] = useSmoothValue(-100, 0.22);
  const [y, setY] = useSmoothValue(-100, 0.22);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      setX(e.clientX);
      setY(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setHovering(!!target?.closest?.(INTERACTIVE));
    }
    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [setX, setY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] rounded-full bg-white mix-blend-difference"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: hovering ? 44 : 9,
        height: hovering ? 44 : 9,
        opacity: visible ? (hovering ? 0.9 : 1) : 0,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  );
}
