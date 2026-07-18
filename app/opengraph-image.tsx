import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "Atlantis — Tutorías Académicas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logoData = await readFile(
    join(process.cwd(), "public/logo-icon-dark.png"),
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "60px",
          background: "#04344c",
          backgroundImage:
            "radial-gradient(700px circle at 50% -5%, rgba(176,237,249,0.18), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={190} height={158} alt="" />

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 2,
          }}
        >
          ATLANTIS
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 32,
            fontWeight: 600,
            color: "#b0edf9",
          }}
        >
          Tutorías Académicas
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 24,
            color: "#e4e4e7",
            maxWidth: 780,
            lineHeight: 1.4,
          }}
        >
          Matemáticas, Estadística, Programación y Marketing en Santander
        </div>
      </div>
    ),
    { ...size },
  );
}
