"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "servicios", label: "Servicios" },
  { id: "testimonios", label: "Testimonios" },
  { id: "contacto", label: "Contacto" },
];

export default function Navbar() {
  const [active, setActive] = useState("inicio");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-3 md:px-12 lg:px-16">
        <a href="#inicio" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Atlantis"
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />
          <span className="hidden sm:block h-8 w-px bg-[var(--border)]" />
          <span className="hidden sm:block text-xs leading-tight font-semibold text-[var(--text)]">
            Tutorías
            <br />
            Académicas
          </span>
        </a>

        <div className="hidden md:flex items-center gap-3">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`text-base px-6 py-3 rounded-full transition-colors ${
                active === id
                  ? "bg-[var(--accent)] text-[var(--on-accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--accent-text)]"
              }`}
            >
              {label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-1.5 p-1"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span
              className={`block h-0.5 w-6 bg-[var(--text)] transition-transform duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[var(--text)] transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[var(--text)] transition-transform duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${
          open ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-6 pb-4 bg-[var(--bg-base)] border-b border-[var(--border)]">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className={`py-2.5 text-sm transition-colors ${
                active === id
                  ? "text-[var(--accent-text)] font-semibold"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
