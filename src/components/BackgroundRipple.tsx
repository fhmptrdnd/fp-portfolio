import { useEffect, useRef } from "react";

export default function BackgroundRipple() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const ripple = document.createElement("span");

      ripple.className = "background-ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;

      // Variasi kecil agar ripple tidak selalu identik
      const size = 180 + Math.random() * 70;
      const duration = 1.5 + Math.random() * 0.35;

      ripple.style.setProperty("--ripple-size", `${size}px`);
      ripple.style.setProperty("--ripple-duration", `${duration}s`);
      ripple.dataset.rippleId = String(nextId.current++);

      container.appendChild(ripple);

      ripple.addEventListener(
        "animationend",
        () => ripple.remove(),
        { once: true }
      );
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="background-ripple-layer"
      aria-hidden="true"
    >
      <svg className="ripple-filter-svg" aria-hidden="true">
        <filter id="water-ripple-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.018 0.025"
            numOctaves="2"
            seed="8"
            result="noise"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="5"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
}