"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import LogoMesh, { type RotationTarget } from "./LogoMesh";
import { withBasePath } from "@/lib/base-path";

gsap.registerPlugin(ScrollTrigger);

const MAX_TILT = (15 * Math.PI) / 180;

function InteractiveLogo({
  isTouch,
  reduceMotion,
  scrollGroupRef,
}: {
  isTouch: boolean;
  reduceMotion: boolean;
  scrollGroupRef: React.RefObject<THREE.Group | null>;
}) {
  const rotationTarget = useRef<RotationTarget>({ x: 0, y: 0 });

  // Desktop: the piece tilts toward the cursor.
  useEffect(() => {
    if (isTouch || reduceMotion) return;
    function onMouseMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      rotationTarget.current = { x: -ny * MAX_TILT, y: nx * MAX_TILT };
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [isTouch, reduceMotion]);

  // Touch: slow constant auto-rotation instead of a cursor to follow.
  useEffect(() => {
    if (!isTouch || reduceMotion) return;
    let raf: number;
    let t = 0;
    function tick() {
      t += 0.004;
      rotationTarget.current = { x: Math.sin(t * 0.6) * 0.08, y: t };
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, [isTouch, reduceMotion]);

  return (
    <group ref={scrollGroupRef}>
      <LogoMesh
        svgUrl={withBasePath("/assets/logo/quality-bikes-isotipo-qb.svg")}
        rotationTarget={rotationTarget}
      />
    </group>
  );
}

export default function Logo3DCanvas({
  heroRef,
  canvasWrapperRef,
  isTouch,
  reduceMotion,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
  canvasWrapperRef: React.RefObject<HTMLDivElement | null>;
  isTouch: boolean;
  reduceMotion: boolean;
}) {
  const scrollGroupRef = useRef<THREE.Group>(null);

  // Scroll through the hero: the piece keeps rotating, pulls back in Z, and
  // fades — read as a camera move away from the object, not a plain fade.
  useEffect(() => {
    if (reduceMotion || !heroRef.current || !scrollGroupRef.current) return;
    const group = scrollGroupRef.current;
    const wrapper = canvasWrapperRef.current;

    const ctx = gsap.context(() => {
      const scrollTween = {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(group.rotation, { y: 1.4, scrollTrigger: scrollTween });
      gsap.to(group.position, { z: -14, scrollTrigger: scrollTween });
      if (wrapper) {
        gsap.to(wrapper, {
          opacity: 0,
          scrollTrigger: { ...scrollTween, end: "60% top" },
        });
      }
    });

    return () => ctx.revert();
  }, [heroRef, canvasWrapperRef, reduceMotion]);

  // Safety net: on some layout timings the canvas mounts before its
  // container has settled its final size. A single deferred resize nudge
  // costs nothing and guarantees the renderer picks up the real dimensions.
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 16], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 8, 10]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-8, -3, 4]} intensity={0.5} color="#a8c6ff" />
      <Suspense fallback={null}>
        {/* Bundled locally: the drei preset fetches from an external CDN at
            runtime, an unacceptable dependency on slow/filtered connections. */}
        <Environment files={withBasePath("/assets/hdri/studio_small_03_1k.hdr")} />
        <InteractiveLogo isTouch={isTouch} reduceMotion={reduceMotion} scrollGroupRef={scrollGroupRef} />
      </Suspense>
    </Canvas>
  );
}
