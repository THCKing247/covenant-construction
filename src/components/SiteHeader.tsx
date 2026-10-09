"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <a className="brand" href="#home" aria-label="Covenant Construction of CA home">
        <img
          src="/images/logo.webp"
          alt="Official Covenant Construction of CA logo, Central Coast California, license 1160030"
        />
      </a>
      <button
        className="menu"
        type="button"
        aria-expanded={open}
        aria-label="Toggle navigation"
        onClick={() => setOpen((value) => !value)}
      >
        ☰
      </button>
      <nav id="nav" className={open ? "open" : undefined}>
        <a className="active" href="#home" onClick={() => setOpen(false)}>
          Home
        </a>
        <a href="#about" onClick={() => setOpen(false)}>
          About
        </a>
        <a href="#services" onClick={() => setOpen(false)}>
          Services
        </a>
        <a href="#projects" onClick={() => setOpen(false)}>
          Projects
        </a>
        <a href="#process" onClick={() => setOpen(false)}>
          Process
        </a>
        <a href="#testimonials" onClick={() => setOpen(false)}>
          Testimonials
        </a>
        <a href="#contact" onClick={() => setOpen(false)}>
          Contact
        </a>
      </nav>
      <div className="head-actions">
        <a className="btn" href="#contact">
          Get a Quote →
        </a>
        <div>
          <a className="phone-head" href={`tel:${site.phoneTel}`}>
            {site.phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}
