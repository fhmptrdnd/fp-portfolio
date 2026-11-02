
import { useMemo, useRef } from "react";

import {
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

export default function StarField() {
  const starsRef =
    useRef<THREE.Points>(null!);

  const starCount = 1200;

  const { positions, sizes } =
    useMemo(() => {
      const positions = new Float32Array(
        starCount * 3
      );

    //   const phases = new Float32Array(
    //     starCount
    //   );

      const sizes = new Float32Array(
        starCount
      );

      for (let i = 0; i < starCount; i++) {
        positions[i * 3] =
          (Math.random() - 0.5) * 50;

        positions[i * 3 + 1] =
          Math.random() * 18 + 1;

        positions[i * 3 + 2] =
          -Math.random() * 55 + 8;

        // phases[i] =
        //   Math.random() * Math.PI * 2;

        sizes[i] =
          Math.random() * 1.5 + 0.5;
      }

      return {
        positions,
        sizes,
      };
    }, []);

  useFrame((state) => {
    if (!starsRef.current) return;

    const material =
      starsRef.current.material as THREE.PointsMaterial;

    const t = state.clock.elapsedTime;

    material.opacity =
      0.65 + Math.sin(t * 0.7) * 0.15;

    starsRef.current.rotation.y =
      Math.sin(t * 0.03) * 0.02;
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />

        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>

      <pointsMaterial
        color="#c8e8f5"
        size={0.055}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
