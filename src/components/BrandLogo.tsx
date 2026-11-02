
import { useState } from "react";

const brandText = "Fahmi Putra's Portfolio";

export default function BrandLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#home"
      className={`brand-logo ${hovered ? "is-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label="Fahmi Putra's Portfolio"
    >
      <span className="brand-short">FP.</span>

      <span className="brand-full" aria-hidden="true">
        {brandText.split("").map((char, index) => (
          <span
            className="brand-char"
            key={`${char}-${index}`}
            style={{
              animationDelay: `${index * 35}ms`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </a>
  );
}
