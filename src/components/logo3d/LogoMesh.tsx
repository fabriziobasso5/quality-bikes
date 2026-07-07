"use client";

import { useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import * as THREE from "three";

const DEPTH = 24;

/**
 * Malla 3D extruida de la silueta de la moto del isotipo QB (solo la moto,
 * sin las letras "QB" — pieza escultural). Material único gunmetal: metal
 * oscuro con reflejos sutiles, como emblema maquinado en exhibición.
 * Geometría pura — el movimiento lo aplica el padre.
 */
export default function LogoMesh({ svgUrl }: { svgUrl: string }) {
  const data = useLoader(SVGLoader, svgUrl);

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

    return { geometries: geoms, offset: center, fitScale: 10 / maxDim };
  }, [data]);

  return (
    <group
      scale={[fitScale, -fitScale, fitScale]}
      position={[-offset.x * fitScale, offset.y * fitScale, -DEPTH * 0.5 * fitScale]}
    >
      {geometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshPhysicalMaterial
            color="#43474e"
            metalness={0.92}
            roughness={0.32}
            clearcoat={0.35}
            clearcoatRoughness={0.25}
            envMapIntensity={1.1}
          />
        </mesh>
      ))}
    </group>
  );
}
