"use client";

import { MotionConfig } from "framer-motion";

// Centralizes prefers-reduced-motion handling: Framer Motion strips
// transform-based animation for every motion.* component under this
// provider when the user's OS has reduced motion enabled.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
