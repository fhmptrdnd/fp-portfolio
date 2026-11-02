
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
    
    varying vec2 vUv;

    uniform float uTime;

    void main() {
    vUv = uv;

    vec3 pos = position;

    float wave1 = sin(
        pos.x * 0.8 +
        uTime * 0.35
    );

    float wave2 = cos(
        pos.y * 1.1 -
        uTime * 0.25
    );

    float wave3 = sin(
        pos.x * 1.8 +
        pos.y * 0.6 +
        uTime * 0.5
    );

    pos.z += (
        wave1 * 0.35 +
        wave2 * 0.25 +
        wave3 * 0.12
    );

    vec4 worldPosition =
        modelMatrix *
        vec4(pos, 1.0);

    gl_Position =
        projectionMatrix *
        viewMatrix *
        worldPosition;
    }
`;

const fragmentShader = `
    
    varying vec2 vUv;

    uniform float uTime;

    float hash(vec2 p) {
    return fract(
        sin(dot(p, vec2(127.1, 311.7))) *
        43758.5453
    );
    }

    float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(
        mix(a, b, f.x),
        mix(c, d, f.x),
        f.y
    );
    }

    void main() {
    vec2 uv = vUv;

    float t = uTime;

    // Large, slow water movement
    float largeWave =
        sin(uv.x * 9.0 + uv.y * 3.0 + t * 0.25) *
        cos(uv.y * 12.0 - t * 0.2);

    // Medium wave layers
    float mediumWave =
        sin(uv.x * 24.0 - uv.y * 8.0 + t * 0.45) *
        cos(uv.y * 18.0 + uv.x * 4.0 - t * 0.35);

    // Fine water ripples
    float fineWave =
        sin(uv.x * 65.0 + uv.y * 20.0 + t * 0.8) *
        cos(uv.y * 42.0 - uv.x * 12.0 + t * 0.6);

    // Organic noise
    float waterNoise = noise(
        uv * 18.0 + vec2(t * 0.08, -t * 0.05)
    );

    float wave =
        largeWave * 0.32 +
        mediumWave * 0.42 +
        fineWave * 0.16 +
        waterNoise * 0.25;

    // Broken and irregular highlights
    float highlight = smoothstep(
        0.32,
        0.82,
        wave
    );

    // Add irregular shimmer
    float shimmer = smoothstep(
        0.45,
        0.9,
        noise(
        uv * 35.0 +
        vec2(t * 0.12, t * 0.06)
        )
    );

    highlight *= 0.65 + shimmer * 0.35;

    // Dark blue water
    vec3 deepWater = vec3(
        0.006,
        0.014,
        0.022
    );

    // Blue-green reflection
    vec3 waterHighlight = vec3(
        0.12,
        0.29,
        0.36
    );

    // Additional subtle cyan shimmer
    vec3 shimmerColor = vec3(
        0.25,
        0.43,
        0.48
    );

    vec3 color = mix(
        deepWater,
        waterHighlight,
        highlight * 0.85
    );

    color = mix(
        color,
        shimmerColor,
        shimmer * highlight * 0.22
    );

    // Horizon brightness
    float horizon = smoothstep(
        0.0,
        0.85,
        uv.y
    );

    color *= 0.45 + horizon * 0.65;

    // Avoid overly bright water
    color = min(
        color,
        vec3(0.3, 0.45, 0.5)
    );

    gl_FragColor = vec4(
        color,
        1.0
    );
    }
`;

export default function Water() {
  const material = useRef<THREE.ShaderMaterial>(null!);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value =
        state.clock.elapsedTime;
    }
  });

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.8, -10]}
    >
      <planeGeometry args={[100, 50, 256, 256]} />

      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
            uTime: { value: 0 },
        }}
        side={THREE.DoubleSide}
        depthWrite={true}
        transparent={false}
       />
    </mesh>
  );
}
