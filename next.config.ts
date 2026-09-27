import type { NextConfig } from "next";

// Headers de seguridad para todas las rutas. No incluye una CSP de scripts
// (script-src): el script anti-parpadeo del tema en layout.tsx es inline y
// una CSP estricta obligaría a manejar nonces. Esta CSP solo cubre lo que no
// rompe nada: nadie puede meter el sitio en un iframe, ni cambiar la URL base
// de los links, ni cargar plugins (<object>/<embed>).
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  },
  // Lo mismo que frame-ancestors, para navegadores viejos.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
