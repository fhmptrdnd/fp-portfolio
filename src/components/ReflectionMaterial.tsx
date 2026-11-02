
export const reflectionVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position =
      projectionMatrix *
      modelViewMatrix *
      vec4(position, 1.0);
  }
`;

export const reflectionFragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    float t = uTime;

    // Water distortion
    float distortion =
      sin(uv.y * 28.0 + t * 0.7) * 0.012 +
      sin(uv.y * 11.0 - t * 0.35) * 0.008;

    uv.x += distortion;

    // Slight vertical distortion
    uv.y += sin(
      uv.x * 18.0 + t * 0.3
    ) * 0.004;

    // Multiple samples create a soft blur
    vec4 center = texture2D(
      uTexture,
      uv
    );

    vec4 sample1 = texture2D(
      uTexture,
      uv + vec2(0.003, 0.0)
    );

    vec4 sample2 = texture2D(
      uTexture,
      uv - vec2(0.003, 0.0)
    );

    vec4 sample3 = texture2D(
      uTexture,
      uv + vec2(0.006, 0.0)
    );

    vec4 sample4 = texture2D(
      uTexture,
      uv - vec2(0.006, 0.0)
    );

    vec4 blurred =
      center * 0.4 +
      sample1 * 0.2 +
      sample2 * 0.2 +
      sample3 * 0.1 +
      sample4 * 0.1;

    // Fade from the top to the bottom
    float fade = pow(
      1.0 - vUv.y,
      2.2
    );

    // Stronger blur toward the end
    float edgeBlur = smoothstep(
      0.15,
      1.0,
      1.0 - vUv.y
    );

    // Water ripple modulation
    float ripple = sin(
      vUv.x * 42.0 +
      vUv.y * 20.0 +
      t * 0.6
    );

    float rippleIntensity =
      0.9 + ripple * 0.08;

    // Cool water tint
    vec3 waterTint = vec3(
      0.38,
      0.62,
      0.72
    );

    vec3 finalColor = mix(
      blurred.rgb,
      waterTint,
      0.10 + edgeBlur * 0.08
    );

    // Reduce brightness toward the edge
    finalColor *= 0.88 + fade * 0.12;

    float alpha =
      blurred.a *
      fade *
      uOpacity *
      rippleIntensity;

    gl_FragColor = vec4(
      finalColor,
      alpha
    );
  }
`;
