"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";

const DEPTH = 16;

export interface RotationTarget {
  x: number;
  y: number;
}

/**
 * Builds a real extruded 3D mesh from the QB isotipo SVG (three paths: the
 * rider/motorcycle silhouette, the "QB" mark, and the red accent dot — all
 * with evenodd holes that SVGLoader resolves natively). Rendered as one
 * polished-metal material regardless of the source SVG's flat brand colors,
 * since this is meant to read as a machined emblem, not a flat cutout.
 */
export default function LogoMesh({
  svgUrl,
  rotationTarget,
}: {
  svgUrl: string;
  rotationTarget: React.RefObject<RotationTarget>;
}) {
  const data = useLoader(SVGLoader, svgUrl);
  const groupRef = useRef<THREE.Group>(null);

  const { geometries, offset, fitScale } = useMemo(() => {
    const geoms: THREE.ExtrudeGeometry[] = [];
    const box = new THREE.Box3();

    for (const path of data.paths) {
      const shapes = path.toShapes();
      for (const shape of shapes) {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: DEPTH,
          bevelEnabled: true,
          bevelThickness: 3,
          bevelSize: 2,
          bevelSegments: 4,
          curveSegments: 12,
        });
        geometry.computeBoundingBox();
        if (geometry.boundingBox) box.union(geometry.boundingBox);
        geoms.push(geometry);
      }
    }

    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y) || 1;

    return { geometries: geoms, offset: center, fitScale: 9 / maxDim };
  }, [data]);

  useFrame(() => {
    const group = groupRef.current;
    const target = rotationTarget.current;
    if (!group || !target) return;
    group.rotation.y += (target.y - group.rotation.y) * 0.06;
    group.rotation.x += (target.x - group.rotation.x) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <group
        scale={[fitScale, -fitScale, fitScale]}
        position={[-offset.x * fitScale, offset.y * fitScale, -DEPTH * 0.5]}
      >
        {geometries.map((geometry, i) => (
          <mesh key={i} geometry={geometry}>
            <meshPhysicalMaterial
              color="#dcdde0"
              metalness={0.9}
              roughness={0.15}
              clearcoat={0.5}
              clearcoatRoughness={0.2}
              envMapIntensity={1.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
