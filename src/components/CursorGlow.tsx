"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSmoothValue } from "@/lib/use-smooth-value";

/**
 * Drop inside any dark section (parent must be relative + overflow-hidden):
 * a soft radial glow trails the cursor within that section, like a light
 * grazing brushed metal. Very low intensity by design — it should be felt,
 * not seen. Transform-only (the gradient itself never repaints; only its
 * container translates). Inert on touch / reduced motion.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [inside, setInside] = useState(false);

  const [x, setX] = useSmoothValue(0, 0.12);
  const [y, setY] = useSmoothValue(0, 0.12);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const parent = ref.current?.parentElement;
    if (!parent) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      const rect = parent!.getBoundingClientRect();
      setX(e.clientX - rect.left);
      setY(e.clientY - rect.top);
      setInside(true);
    }
    function onLeave() {
      setInside(false);
    }

    parent.addEventListener("mousemove", onMove, { passive: true });
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [setX, setY]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {enabled && (
        <motion.div
          className="absolute h-[560px] w-[560px] rounded-full"
          style={{
            x,
            y,
            translateX: "-50%",
            translateY: "-50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 35%, transparent 65%)",
          }}
          animate={{ opacity: inside ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  );
}
