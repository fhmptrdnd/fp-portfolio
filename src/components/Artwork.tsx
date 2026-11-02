
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import type { Project } from "../data/projects";
import {
  reflectionVertexShader,
  reflectionFragmentShader,
} from "./ReflectionMaterial";

interface ArtworkProps {
  project: Project;
  position: [number, number, number];
  onSelect: (project: Project) => void;
}

export default function Artwork({
  project,
  position,
  onSelect,
}: ArtworkProps) {
  const group = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);

  const texture = useTexture(project.image);

    // Texture settings
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 8;

    // Maximum artwork dimensions
    const maxWidth = 2.5;
    const maxHeight = 3.4;

    // Read the actual image dimensions
    const image = texture.image as {
    width: number;
    height: number;
    };

    const aspectRatio =
    image.width / image.height;

    // Fit image inside the maximum dimensions
    const width =
    aspectRatio >= maxWidth / maxHeight
        ? maxWidth
        : maxHeight * aspectRatio;

    const height =
    aspectRatio >= maxWidth / maxHeight
        ? maxWidth / aspectRatio
        : maxHeight;
  const reflectionMaterial =
  useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!group.current) return;

    if (reflectionMaterial.current) {
        reflectionMaterial.current.uniforms.uTime.value =
            t;
    }

    // Floating animation
    group.current.position.y =
      position[1] + Math.sin(t * 0.6 + project.id) * 0.12;

    // Smooth hover effect
    const targetScale = hovered ? 1.06 : 1;

    group.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.08
    );

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      hovered ? 0 : position[0] * -0.08,
      0.06
    );
  });

  return (
    <group ref={group} position={position}>

      {/* Main artwork frame */}
        <mesh position={[0, 0, -0.06]}>
        <boxGeometry
            args={[
            width + 0.08,
            height + 0.08,
            0.08,
            ]}
        />

        <meshStandardMaterial
            color="#090d0f"
            metalness={0.45}
            roughness={0.35}
        />
        </mesh>

      {/* Artwork image */}
      
        <mesh
        position={[0, 0, 0.015]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(project)}
        >
        <planeGeometry
            args={[width, height]}
        />

        <meshBasicMaterial
            map={texture}
            toneMapped={false}
            side={THREE.DoubleSide}
        />
        </mesh>


      
    {/* Water reflection */}

    <mesh
    position={[0, -height - 0.1, 0.015]}
    rotation={[Math.PI, 0, 0]}
    >
    <planeGeometry
        args={[width, height]}
    />

    <shaderMaterial
        ref={reflectionMaterial}
        uniforms={{
            uTexture: { value: texture },
            uTime: { value: 0 },
            uOpacity: { value: 0.32 },
        }}
        vertexShader={reflectionVertexShader}
        fragmentShader={reflectionFragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        />
    </mesh>


      {/* Hover glow */}
      {hovered && (
        <pointLight
          position={[0, 0, 1]}
          color="#8bbbc5"
          intensity={1.2}
          distance={4}
        />
      )}

    </group>
  );
}
