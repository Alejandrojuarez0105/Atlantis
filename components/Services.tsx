"use client";

import { motion } from "motion/react";

const plans = [
  {
    hours: "1 hora",
    description: "Ideal para resolver dudas específicas",
    popular: false,
  },
  {
    hours: "2 horas",
    description: "Perfecto para preparar exámenes",
    popular: true,
  },
  {
    hours: "3 horas",
    description: "Recomendado para reforzar varios temas",
    popular: false,
  },
];

const checklist = [
  "Clases individuales y personalizadas.",
  "Nos desplazamos a cualquier punto de Santander.",
  "Resolvemos tus dudas durante la tutoría y también por mensaje.",
  "Adaptamos cada sesión a tus objetivos académicos.",
];

const subjectColumns = [
  ["Matemática I", "Matemática II"],
  ["Matemática Numérica", "Matemática Discreta"],
  ["Estadística I", "Lenguajes de Programación",],
  ["Marketing Estratégico y Operativo"],
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className="h-5 w-5 flex-none text-[var(--accent-text)]"
    >
      <path
        d="M4 10.5 8 14.5 16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Services() {
  return (
    <section
      id="servicios"
      className="relative px-6 py-16 md:px-12 md:py-24 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--bg-band)] to-transparent md:h-36" />

      <h2 className="relative text-center text-2xl font-bold text-[var(--text)] md:text-4xl">
        Servicios
      </h2>

      <div className="relative mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-3 md:gap-6 md:pt-10">
        {plans.map((plan) => (
          <motion.div
            key={plan.hours}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="relative md:h-full"
          >
            {plan.popular && (
              <div className="mx-auto w-fit rounded-t-xl bg-[var(--bg-input)] px-6 py-2 text-sm font-semibold text-[var(--bg-band)] md:absolute md:inset-x-0 md:-top-10">
                Más popular
              </div>
            )}
            <div
              className={`rounded-2xl border-2 px-6 pb-8 pt-8 text-center md:px-8 md:h-full ${
                plan.popular
                  ? "border-[var(--accent)] md:pb-10 md:pt-10"
                  : "border-[var(--border)]"
              }`}
            >
              <span className="inline-block -mt-14 rounded-full bg-[var(--accent)] px-6 py-2 text-base font-semibold text-[var(--on-accent)]">
                {plan.hours}
              </span>
              <p className="mt-6 text-[var(--text-muted)] md:text-lg">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-2xl">
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckIcon />
              <span className="text-[var(--text)]">{item}</span>
            </li>
          ))}
        </ul>

        <a
          href="#contacto"
          className="mt-6 inline-block text-[var(--accent-text)] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
        >
          Contáctanos para consultar precios
        </a>
      </div>

      <div className="mt-16 flex flex-col gap-8 rounded-2xl bg-[var(--bg-band)] px-6 py-10 text-[var(--on-band)] md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <h3 className="text-xl font-bold md:text-2xl">Materias</h3>
          <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
            {subjectColumns.map((column) => (
              <ul key={column[0]} className="space-y-2">
                {column.map((subject) => (
                  <li key={subject} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-none rounded-full bg-[var(--on-band)]" />
                    {subject}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <a
          href="#contacto"
          className="inline-block w-fit flex-none rounded-full bg-[var(--on-band)] px-6 py-3 text-base font-semibold text-[var(--bg-band)] transition-opacity hover:opacity-90"
        >
          Reserva tu tutoría
        </a>
      </div>
    </section>
  );
}
