"use client";

import { useState, useRef, FormEvent } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/lib/theme-context";

const paymentMethods = [
  { label: "Bizum", icon: "bizum" },
  { label: "Efectivo", icon: "efectivo" },
  { label: "Transferencia Bancaria", icon: "transferencia" },
] as const;

const timeSlots = (() => {
  const slots: string[] = [];
  for (let h = 10; h <= 20; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 20) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
})();

function inputClass() {
  return "w-full rounded-lg bg-[var(--bg-input)] px-4 py-3 text-[var(--bg-band)] placeholder:text-gray-500 outline-none transition-shadow focus:ring-2 focus:ring-[var(--accent)] [color-scheme:light]";
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-none">
      <path
        d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-none">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 6.5l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 flex-none">
      <path
        d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Contact() {
  const { theme, mounted } = useTheme();
  const isDark = mounted && theme === "dark";
  const [form, setForm] = useState({
    nombre: "",
    materia: "",
    fecha: "",
    hora: "",
    nota: "",
  });
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleChange =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const body = [
      `Nombre: ${form.nombre}`,
      `Materia: ${form.materia}`,
      `Fecha: ${form.fecha || "--/--/--"}`,
      `Hora: ${form.hora || "00:00"}`,
      form.nota && `Nota: ${form.nota}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:atlantis.tutorias@gmail.com?subject=${encodeURIComponent(
      "Solicitud de Reserva",
    )}&body=${encodeURIComponent(body)}`;
  };

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <section
      id="contacto"
      className="px-6 pb-16 pt-4 md:px-12 md:pb-24 md:pt-6 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-[var(--text)] md:text-4xl">
            Solicitud de Reserva
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Nombre"
              required
              value={form.nombre}
              onChange={handleChange("nombre")}
              className={inputClass()}
            />
            <input
              type="text"
              placeholder="Materia"
              required
              value={form.materia}
              onChange={handleChange("materia")}
              className={inputClass()}
            />
            <div className="flex gap-4">
              <div className="relative flex-1 rounded-lg focus-within:ring-2 focus-within:ring-[var(--accent)]">
                <input
                  ref={dateInputRef}
                  type="date"
                  aria-label="Fecha"
                  min={todayStr}
                  value={form.fecha}
                  onChange={handleChange("fecha")}
                  onKeyDown={(e) => {
                    if (e.key !== "Tab") e.preventDefault();
                  }}
                  onClick={() => dateInputRef.current?.showPicker?.()}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 outline-none"
                />
                <div className="pointer-events-none flex h-full items-center rounded-lg bg-[var(--bg-input)] px-4 py-3">
                  {form.fecha ? (
                    <span className="text-[var(--bg-band)]">
                      {new Date(`${form.fecha}T00:00:00`).toLocaleDateString(
                        "es-ES",
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-500">Fecha</span>
                  )}
                </div>
              </div>
              <select
                aria-label="Hora"
                required
                value={form.hora}
                onChange={handleChange("hora")}
                className={`${inputClass()} flex-1 ${form.hora ? "" : "!text-gray-500"}`}
              >
                <option value="" disabled>
                  Hora
                </option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Nota (opcional)"
              rows={5}
              value={form.nota}
              onChange={handleChange("nota")}
              className={`${inputClass()} resize-none`}
            />

            <button
              type="submit"
              className="rounded-full bg-[var(--accent)] px-8 py-3 text-base font-semibold text-[var(--on-accent)] transition-opacity hover:opacity-90"
            >
              Enviar solicitud
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl bg-[var(--bg-band)] p-8 text-[var(--on-band)] md:p-10"
        >
          <h3 className="text-xl font-bold md:text-2xl">Contacto</h3>
          <ul className="mt-6 space-y-4">
            <li className="flex items-center gap-3">
              <PhoneIcon />
              <span>
                <a
                  href="https://wa.me/34695102093"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  +34 695 102 093
                </a>{" "}
                /{" "}
                <a
                  href="https://wa.me/34634739385"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  +34 634 739 385
                </a>
              </span>
            </li>
            <li className="flex items-center gap-3">
              <MailIcon />
              <a
                href="mailto:atlantis.tutorias@gmail.com"
                className="hover:underline"
              >
                atlantis.tutorias@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PinIcon />
              <span>España, Cantabria, Santander</span>
            </li>
          </ul>

          <h3 className="mt-10 text-xl font-bold md:text-2xl">
            Métodos de Pago
          </h3>
          <ul className="mt-6 space-y-3">
            {paymentMethods.map((method) => (
              <li key={method.label} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/payment-${method.icon}${isDark ? "" : "-dark"}.png`}
                  alt=""
                  className="h-7 w-7 flex-none object-contain"
                />
                <span>{method.label}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
