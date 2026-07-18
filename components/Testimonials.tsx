"use client";

import { useState } from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Laura Gómez",
    subject: "Matemática I",
    review:
      "Las clases me ayudaron a entender lo que en el instituto no lograba. Explicaciones claras y mucha paciencia.",
    rating: 5,
  },
  {
    name: "Marcos Ruiz",
    subject: "Estadística I",
    review:
      "Aprobé el examen gracias a las tutorías. Me adaptaron el plan a mi ritmo y resolvieron todas mis dudas.",
    rating: 5,
  },
  {
    name: "Elena Torres",
    subject: "Lenguajes de Programación",
    review:
      "Muy buena disposición para explicar cuantas veces hiciera falta. Se nota que quieren que entiendas de verdad.",
    rating: 4,
  },
  {
    name: "Diego Fernández",
    subject: "Matemática Discreta",
    review:
      "Las sesiones son muy prácticas y se nota la experiencia del tutor. Recomendado para preparar exámenes.",
    rating: 5,
  },
  {
    name: "Carla Sánchez",
    subject: "Matemática Numérica",
    review:
      "Buena comunicación por mensaje entre clases para resolver dudas puntuales. Eso marcó la diferencia.",
    rating: 5,
  },
  {
    name: "Pablo Iglesias",
    subject: "Matemática II",
    review:
      "Empecé sin ninguna base y ahora llevo la asignatura al día. Muy recomendable para reforzar desde cero.",
    rating: 4,
  },
];

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 md:h-5 md:w-5 ${filled ? "text-[var(--on-band)]" : "text-[var(--on-band-muted)]"}`}
      fill="currentColor"
    >
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.61 1-5.79-4.21-4.1 5.82-.85L10 1.5z" />
    </svg>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Testimonio anterior" : "Siguiente testimonio"}
      className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-[var(--text)] transition-colors hover:text-[var(--accent-text)]"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d={direction === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export default function Testimonials() {
  const [start, setStart] = useState(0);
  const total = testimonials.length;
  const visible = [0, 1, 2].map(
    (offset) => testimonials[(start + offset) % total],
  );

  const prev = () => setStart((s) => (s - 1 + total) % total);
  const next = () => setStart((s) => (s + 1) % total);

  return (
    <section
      id="testimonios"
      className="px-6 pb-16 pt-4 md:px-12 md:pb-24 md:pt-6 lg:px-16"
    >
      <h2 className="text-center text-2xl font-bold text-[var(--text)] md:text-4xl">
        Testimonios
      </h2>

      <div className="mx-auto mt-10 flex max-w-7xl items-center gap-2 md:gap-6">
        <ArrowButton direction="prev" onClick={prev} />

        <div className="grid flex-1 gap-6 md:grid-cols-3">
          {visible.map((t, i) => (
            <motion.div
              key={`${t.name}-${start}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`rounded-2xl bg-[var(--bg-band)] p-6 text-[var(--on-band)] md:p-10 ${
                i > 0 ? "hidden md:block" : ""
              }`}
            >
              <p className="font-bold md:text-xl">{t.name}</p>
              <p className="text-sm text-[var(--on-band-muted)] md:text-base">
                {t.subject}
              </p>
              <p className="mt-4 text-sm leading-relaxed md:mt-6 md:text-lg">
                {t.review}
              </p>
              <div className="mt-4 flex gap-1 md:mt-6">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={starIndex} filled={starIndex < t.rating} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <ArrowButton direction="next" onClick={next} />
      </div>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        {total} testimonios
      </p>

      <div className="mt-6 flex justify-center">
        <a
          href="mailto:atlantis.tutorias@gmail.com?subject=Mi%20testimonio"
          className="rounded-full bg-[var(--bg-input)] px-6 py-3 text-base font-semibold text-[var(--bg-band)] transition-opacity hover:opacity-90"
        >
          Escribe tu testimonio
        </a>
      </div>
    </section>
  );
}
