"use client";

import { motion, useReducedMotion } from "framer-motion";
import { withBasePath } from "@/lib/base-path";

// Same "piece rotating in space" idea as the 3D version, without touching
// WebGL at all — used on low-end devices, narrow screens, and as the safety
// net if WebGL genuinely isn't available.
export default function LogoFallback2D() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex h-full w-full items-center justify-center [perspective:1200px]">
      {/* eslint-disable-next-line @next/next/no-img-element -- animated via Framer Motion transform, not next/image territory */}
      <motion.img
        src={withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg")}
        alt="Quality Bikes"
        className="h-40 w-auto drop-shadow-2xl sm:h-56"
        animate={shouldReduceMotion ? undefined : { rotateY: [0, 360] }}
        transition={
          shouldReduceMotion ? undefined : { duration: 16, repeat: Infinity, ease: "linear" }
        }
      />
    </div>
  );
}
