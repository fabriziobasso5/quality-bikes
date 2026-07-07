"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import LogoMesh from "./LogoMesh";
import { withBasePath } from "@/lib/base-path";

const ROTATION_SPEED = 0.3; // rad/s — lento, ritmo de plataforma giratoria

/**
 * La moto del isotipo como pieza de museo: giro lento y continuo SOLO sobre
 * el eje vertical (Y), como plataforma giratoria de exhibición — sin
 * inclinación ni bamboleo en otros ejes, sin mouse-follow ni coreografía de
 * scroll. Con reduced motion descansa en un ángulo 3/4 fijo.
 */
function TurningPiece({ reduceMotion }: { reduceMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!group.current || reduceMotion) return;
    group.current.rotation.y += delta * ROTATION_SPEED;
  });

  return (
    <group ref={group} rotation={[0, reduceMotion ? -0.5 : 0, 0]}>
      <LogoMesh svgUrl={withBasePath("/assets/logo/quality-bikes-moto-silueta.svg")} />
    </group>
  );
}

export default function Logo3DCanvas({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 16], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Iluminación tipo museo: key light frontal cálida-neutra + rim light
          trasera fría que dibuja el contorno del metal, ambiente mínimo. */}
      <ambientLight intensity={0.22} />
      <directionalLight position={[7, 9, 9]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-9, 4, -8]} intensity={1.4} color="#bcd2ff" />
      <Suspense fallback={null}>
        {/* Bundled locally: the drei preset fetches from an external CDN at
            runtime, an unacceptable dependency on slow/filtered connections. */}
        <Environment files={withBasePath("/assets/hdri/studio_small_03_1k.hdr")} />
        <TurningPiece reduceMotion={reduceMotion} />
      </Suspense>
    </Canvas>
  );
}
