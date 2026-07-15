"use client";

import { motion } from "framer-motion";

// Re-mounts on every route change, giving each page a soft entrance
// (fade + 0.98→1 scale) instead of an instant swap. Exit animations are
// intentionally not attempted: App Router's static export can't hold two
// routes alive to cross-fade, and faking it costs more than it's worth.
// The site-wide MotionConfig strips the scale under prefers-reduced-motion.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      // Origen arriba, no al centro: con scale<1 el achique nunca deja ver
      // el fondo blanco de <body> por encima del header (línea/gap blanco
      // entre el header y el hero mientras corre o si se traba la entrada).
      style={{ transformOrigin: "top" }}
    >
      {children}
    </motion.div>
  );
}
