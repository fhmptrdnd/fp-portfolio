
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./SoftwareStar.css";

interface Software {
  name: string;
  category: string;
  logo: string;
}

const software: Software[] = [
  {
    name: "Photoshop",
    category: "Image Editing",
    logo: "https://cdn.simpleicons.org/adobephotoshop",
  },
  {
    name: "Illustrator",
    category: "Vector Design",
    logo: "https://cdn.simpleicons.org/adobeillustrator",
  },
  {
    name: "Premiere Pro",
    category: "Video Editing",
    logo: "https://cdn.simpleicons.org/adobepremierepro",
  },
  {
    name: "After Effects",
    category: "Motion Graphics",
    logo: "https://cdn.simpleicons.org/adobeaftereffects",
  },
  {
    name: "Blender",
    category: "3D Design",
    logo: "https://cdn.simpleicons.org/blender",
  },
  {
    name: "Figma",
    category: "UI / UX Design",
    logo: "https://cdn.simpleicons.org/figma",
  },
];

interface SoftwareStarProps {
  visible: boolean;
}

export default function SoftwareStar({
  visible,
}: SoftwareStarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close modal with Escape key.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Hide modal when the star is no longer visible.
  useEffect(() => {
    if (!visible) {
      setIsOpen(false);
    }
  }, [visible]);

  return (
    <>
      <div
        className={`software-star-container ${
          visible ? "star-visible" : ""
        }`}
        aria-hidden={!visible}
      >
        <span className="software-hint">
          A LITTLE SOMETHING BEHIND THE SCENE
        </span>

        <button
          type="button"
          className="star-trigger"
          onClick={() => setIsOpen(true)}
          aria-label="Discover software used"
          aria-expanded={isOpen}
          tabIndex={visible ? 0 : -1}
        >
          <span className="star-glow" />
          <span className="star-symbol">✦</span>
        </button>

        <span className="star-caption">
          DISCOVER
        </span>
      </div>

      {isOpen &&
        createPortal(
          <div
            className="software-overlay"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="software-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="software-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="software-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close software information"
              >
                ×
              </button>

              <span className="software-eyebrow">
                BEHIND THE CREATION
              </span>

              <h2 id="software-title">
                Software That I Used<span>.</span>
              </h2>

              <p className="software-description">
                The tools behind every idea, experiment,
                and visual creation.
              </p>

              <div className="software-grid">
                {software.map((item) => (
                  <div
                    className="software-item"
                    key={item.name}
                  >
                    <div className="software-logo">
                      <img
                        src={item.logo}
                        alt={`${item.name} logo`}
                        loading="lazy"
                      />
                    </div>

                    <h3>{item.name}</h3>

                    <span>{item.category}</span>
                  </div>
                ))}
              </div>

              <span className="software-footer">
                TOOLS ARE JUST THE BEGINNING.
              </span>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
