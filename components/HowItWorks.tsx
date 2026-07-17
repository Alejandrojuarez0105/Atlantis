"use client";

import { motion } from "motion/react";

const steps = [
  {
    number: 1,
    title: "Solicitud de Reserva.",
    description:
      'Completa el formulario de contacto o pulsa "Reserva tu tutoría". Responderemos a tu solicitud en menos de 24h.',
  },
  {
    number: 2,
    title: "Comienza a aprender.",
    description:
      "Nuestras clases son individuales para diseñar un plan personalizado según tu nivel, objetivos y ritmo de aprendizaje.",
  },
  {
    number: 3,
    title: "Progresa cada semana.",
    description:
      "Realizamos un seguimiento continuo para ayudarte a mejorar y resolver todas tus dudas.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative bg-[var(--bg-band)] px-6 py-16 text-[var(--on-band)] md:px-12 md:py-20 lg:px-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--bg-base)] to-transparent md:h-36" />

      <h2 className="relative text-center text-2xl font-bold md:text-4xl">
        Cómo funciona Atlantis
      </h2>

      <div className="relative mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3 md:gap-8">
        {steps.map((step) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: step.number * 0.1 }}
            className="rounded-2xl bg-[var(--bg-card)] p-6 md:p-10 md:min-h-[300px]"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-band)] text-sm font-bold text-[var(--on-band)] md:h-10 md:w-10 md:text-base">
              {step.number}
            </span>
            <h3 className="mt-4 text-xl font-bold text-[var(--text)] md:mt-6 md:text-2xl">
              {step.title}
            </h3>
            <p className="mt-3 text-[var(--text-muted)] md:text-lg">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-6 text-center">
        <p className="max-w-xl text-xl font-semibold md:text-2xl">
          ¡Estamos listos para acompañarte en cada paso hacia tus objetivos
          académicos!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#contacto"
            className="rounded-full bg-[var(--on-band)] px-6 py-3 text-base font-semibold text-[var(--bg-band)] transition-opacity hover:opacity-90"
          >
            Reserva tu tutoría
          </a>
          <a
            href="#servicios"
            className="rounded-full border border-[var(--on-band)] px-6 py-3 text-base font-semibold text-[var(--on-band)] transition-colors hover:bg-white/10"
          >
            Servicios
          </a>
        </div>
      </div>
    </section>
  );
}
