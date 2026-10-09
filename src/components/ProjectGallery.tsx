"use client";

import { useEffect, useState } from "react";

const projects = [
  {
    src: "/images/kitchen.webp",
    label: "KITCHEN REMODEL",
    place: "Kitchen renovation",
    alt: "Kitchen renovation — digitally staged presentation",
    action: "View kitchen remodel",
  },
  {
    src: "/images/primary-bathroom.webp",
    label: "PRIMARY BATHROOM",
    place: "Custom bathroom finishes",
    alt: "Custom bathroom finishes — digitally staged presentation",
    action: "View primary bathroom",
  },
  {
    src: "/images/custom-shower.webp",
    label: "CUSTOM SHOWER",
    place: "Tile & stone craftsmanship",
    alt: "Tile & stone craftsmanship — digitally staged presentation",
    action: "View custom shower",
  },
  {
    src: "/images/bathroom-renovation.webp",
    label: "BATHROOM RENOVATION",
    place: "Freestanding tub & shower",
    alt: "Freestanding tub & shower — digitally staged presentation",
    action: "View bathroom renovation",
  },
  {
    src: "/images/living-room.webp",
    label: "LIVING ROOM REMODEL",
    place: "Open-concept interior",
    alt: "Open-concept interior — digitally staged presentation",
    action: "View living room remodel",
  },
  {
    src: "/images/residential-exterior.webp",
    label: "RESIDENTIAL EXTERIOR",
    place: "Exterior construction",
    alt: "Exterior construction — digitally staged presentation",
    action: "View residential exterior",
  },
];

export function ProjectGallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openProject = openIndex === null ? null : projects[openIndex];

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenIndex(null);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <section className="gallery" id="projects">
        {projects.map((project, index) => (
          <button
            key={project.src}
            className="project"
            type="button"
            aria-label={project.action}
            onClick={() => setOpenIndex(index)}
          >
            <img src={project.src} alt={project.alt} loading="lazy" />
            <span className="project-name">{project.label}</span>
            <span className="project-place">{project.place}</span>
          </button>
        ))}
      </section>
      <div
        className={openProject ? "modal open" : "modal"}
        id="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Project photo"
        onClick={(event) => {
          if (event.currentTarget === event.target) setOpenIndex(null);
        }}
      >
        <button type="button" aria-label="Close photo" onClick={() => setOpenIndex(null)}>
          ×
        </button>
        {openProject ? <img id="modalImg" alt={openProject.label} src={openProject.src} /> : <img id="modalImg" alt="" />}
        <div className="modal-caption" id="modalCaption">
          {openProject?.label ?? ""}
        </div>
      </div>
    </>
  );
}
