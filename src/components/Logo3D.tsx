"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import LogoFallback2D from "./logo3d/LogoFallback2D";

const Logo3DCanvas = dynamic(() => import("./logo3d/Logo3DCanvas"), {
  ssr: false,
  loading: () => null,
});

function detectCanUse3D() {
  if (window.innerWidth < 768) return false;
  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores < 4) return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Lazy 3D emblem: WebGL only downloads when this section approaches the
 * viewport AND the device can afford it; everyone else gets the animated
 * 2D fallback (or a static logo without WebGL/JS).
 */
export default function Logo3D() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUse3D(detectCanUse3D());
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);

  // Defer the WebGL bundle until the section is actually approaching.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="pointer-events-none h-full w-full">
      {ready &&
        (use3D ? (
          nearViewport && <Logo3DCanvas reduceMotion={reduceMotion} />
        ) : (
          <LogoFallback2D />
        ))}
    </div>
  );
}
