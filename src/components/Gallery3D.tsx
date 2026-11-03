
import {
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  RefObject,
  AnimationEvent,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import * as THREE from "three";

import StarField from "./StarField";
import Artwork from "./Artwork";
import Water from "./Water";
import SoftwareStar from "./SoftwareStar";

import { projects } from "../data/projects";
import type { Project } from "../data/projects";

interface GallerySceneProps {
  progress: RefObject<number>;
  onSelect: (project: Project) => void;
}

function GalleryScene({
  progress,
  onSelect,
}: GallerySceneProps) {
  const cameraTarget = useRef(
    new THREE.Vector3(0, 0, 5)
  );

  const lookTarget = useRef(
    new THREE.Vector3(0, 0, -5)
  );

  // Calculate the final camera position
  // based on the last artwork.
  const galleryEndZ =
    -(Math.max(projects.length - 1, 0) * 7 + 8);

  useFrame(({ camera }, delta) => {
    const p = progress.current ?? 0;

    // Camera moves through the gallery.
    const targetZ = THREE.MathUtils.lerp(
      10,
      galleryEndZ,
      p
    );

    const targetX =
      Math.sin(p * Math.PI * 2) * 0.3;

    cameraTarget.current.set(
      targetX,
      0,
      targetZ
    );

    // Smooth camera movement.
    const smooth =
      1 - Math.exp(-3 * delta);

    camera.position.lerp(
      cameraTarget.current,
      smooth
    );

    // Look toward the next artwork.
    lookTarget.current.set(
      targetX * 0.3,
      0,
      targetZ - 8
    );

    camera.lookAt(lookTarget.current);
  });

  return (
    <>
      <ambientLight intensity={0.45} />

      <pointLight
        position={[0, 5, 0]}
        intensity={2}
        color="#9bbfc7"
      />

      <fog
        attach="fog"
        args={["#030506", 8, 38]}
      />

      <StarField />
      <Water />

      {projects.map((project, index) => {
        const side =
          index % 2 === 0 ? -1 : 1;

        const x = side * 2.1;
        const z = -index * 7;

        return (
          <Artwork
            key={project.id}
            project={project}
            position={[x, 0.1, z]}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
}

export default function Gallery3D() {
  const sectionRef =
    useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);

  const [selected, setSelected] =
    useState<Project | null>(null);

  const [modalClosing, setModalClosing] =
    useState(false);

  // Controls the visibility of the final star.
  const [showSoftwareStar, setShowSoftwareStar] =
    useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const section = sectionRef.current;

      if (!section) return;

      const rect =
        section.getBoundingClientRect();

      const scrollDistance =
        section.offsetHeight -
        window.innerHeight;

      if (scrollDistance <= 0) {
        progressRef.current = 0;
        setShowSoftwareStar(false);
        return;
      }

      const progress =
        -rect.top / scrollDistance;

      const normalizedProgress =
        THREE.MathUtils.clamp(
          progress,
          0,
          1
        );

      progressRef.current =
        normalizedProgress;

      // Reveal the star near the end
      // of the gallery scrolling experience.
      const shouldShowStar =
        normalizedProgress >= 0.96;

      setShowSoftwareStar(
        shouldShowStar
      );
    };

    updateScroll();

    window.addEventListener(
      "scroll",
      updateScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateScroll
      );

      window.removeEventListener(
        "resize",
        updateScroll
      );
    };
  }, []);

  // Project modal controls.
  const openModal = (project: Project) => {
    setSelected(project);
    setModalClosing(false);
  };

  const closeModal = () => {
    setModalClosing(true);
  };

  const handleModalAnimationEnd = (
    event: AnimationEvent<HTMLDivElement>
  ) => {
    if (
      event.target === event.currentTarget &&
      event.animationName === "modalFadeOut"
    ) {
      setSelected(null);
      setModalClosing(false);
    }
  };

  return (
    <div
      ref={sectionRef}
      className="gallery-3d"
    >
      <div className="gallery-3d-sticky">

        {/* 3D Gallery */}
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 45,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <Suspense fallback={null}>
            <GalleryScene
              progress={progressRef}
              onSelect={openModal}
            />
          </Suspense>
        </Canvas>

        {/* Final Software Star */}
        <SoftwareStar
          visible={
            showSoftwareStar &&
            selected === null
          }
        />

      </div>

      {/* Project Detail Modal */}
      {selected && (
        <div
          className={`project-modal ${
            modalClosing ? "modal-closing" : ""
          }`}
          onClick={closeModal}
          onAnimationEnd={handleModalAnimationEnd}
        >
          <div
            className={`modal-content ${
              modalClosing
                ? "modal-content-closing"
                : ""
            }`}
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="modal-close"
              onClick={closeModal}
              aria-label="Close project details"
            >
              CLOSE ×
            </button>

            <div className="modal-gallery">
              <img
                src={selected.image}
                alt={`${selected.title} cover`}
                className="modal-image"
              />

              {selected.details?.map(
                (image, index) => (
                  <img
                    key={`${selected.id}-detail-${index}`}
                    src={image}
                    alt={`${selected.title} detail ${index + 1}`}
                    className="modal-detail-image"
                  />
                )
              )}
            </div>

            <span>{selected.category}</span>

            <h2>{selected.title}</h2>

            <p>{selected.description}</p>
          </div>
        </div>
      )}

    </div>
  );
}
