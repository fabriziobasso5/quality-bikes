"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSmoothValue } from "@/lib/use-smooth-value";

const MAX_DEG = 7;

/**
 * Tilts its child in 3D toward the cursor position (max 7°), easing flat
 * on leave. The deepened shadow on hover + the perspective tilt over it is
 * what sells the depth. Renders children untouched on touch devices and
 * under reduced motion.
 */
export default function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const [rotateX, setRotateX] = useSmoothValue(0, 0.16);
  const [rotateY, setRotateY] = useSmoothValue(0, 0.16);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduced);
  }, []);

  function onMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setRotateY(nx * MAX_DEG);
    setRotateX(-ny * MAX_DEG);
  }

  function onMouseLeave() {
    setRotateX(0);
    setRotateY(0);
  }

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className} style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="transition-shadow duration-300 hover:shadow-2xl hover:shadow-brand-navy/20"
      >
        {children}
      </motion.div>
    </div>
  );
}
