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

export default function Logo3D({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const [ready, setReady] = useState(false);
  const [use3D, setUse3D] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUse3D(detectCanUse3D());
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div ref={wrapperRef} className="pointer-events-none absolute inset-0">
      {use3D ? (
        <Logo3DCanvas
          heroRef={heroRef}
          canvasWrapperRef={wrapperRef}
          isTouch={isTouch}
          reduceMotion={reduceMotion}
        />
      ) : (
        <LogoFallback2D />
      )}
    </div>
  );
}
