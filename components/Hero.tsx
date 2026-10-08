"use client";

import { getImageProps } from "next/image";
import { useTheme } from "@/lib/theme-context";

const subjects = [
  "Matemática I",
  "Matemática II",
  "Matemática Discreta",
  "Matemática Numérica",
  "Estadística I",
  "Lenguajes de Programación",
  "Marketing Estratégico y Operativo",
];
const loopSubjects = [...subjects, ...subjects];
const EMPTY_GIF =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

function LogoGraphic() {
  const { theme, mounted } = useTheme();
  const logoSrc =
    mounted && theme === "dark" ? "/logo-icon-dark.png" : "/logo-icon.png";
  const {
    props: { srcSet, sizes, ...rest },
  } = getImageProps({
    src: logoSrc,
    alt: "",
    fill: true,
    sizes: "54vw",
    loading: "eager",
    className: "object-contain object-right-top",
  });

  return (
    <div className="absolute top-20 right-16 xl:right-0 -z-10 overflow-hidden pointer-events-none hidden xl:block w-[54%] h-[430px]">
      {/* Solo se ve desde xl, donde es el LCP: carga eager, pero solo dentro
          del <source> de xl. Debajo de 1280px el <img> cae a un GIF vacío en
          línea, así que el móvil no descarga el logo aunque esté oculto. */}
      <picture>
        <source media="(min-width: 1280px)" srcSet={srcSet} sizes={sizes} />
        <img {...rest} alt="" src={EMPTY_GIF} />
      </picture>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24"
    >
      <LogoGraphic />

      <div className="px-6 md:px-12 lg:px-16">
        <h1 className="fade-up text-4xl sm:text-5xl md:text-7xl font-bold text-[var(--accent-text)] max-w-2xl md:max-w-none">
          <span className="md:whitespace-nowrap">Impulsa tu éxito académico</span>
          <br className="hidden md:block" />
          <span className="md:whitespace-nowrap"> con tutorías personalizadas</span>
        </h1>

        <p
          style={{ animationDelay: "0.1s" }}
          className="fade-up mt-10 text-3xl md:text-5xl font-bold text-[var(--text)] max-w-2xl"
        >
          Aprende con confianza y alcanza tus metas académicas
        </p>
      </div>

      <div
        style={{ animationDelay: "0.3s" }}
        className="fade-in marquee mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap text-xl md:text-3xl font-semibold text-[var(--text-muted)]">
          {loopSubjects.map((subject, i) => (
            <span
              key={i}
              aria-hidden={i >= subjects.length}
              className="flex items-center gap-10"
            >
              {subject}
              <span aria-hidden="true" className="text-[var(--border)]">
                •
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
