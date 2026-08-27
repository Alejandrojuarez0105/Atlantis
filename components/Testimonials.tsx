import { getApprovedTestimonials } from "@/lib/testimonials";
import TestimonialsClient from "@/components/TestimonialsClient";

// Componente server: trae los testimonios aprobados en el render (la página usa
// `revalidate`, así que el resultado se cachea y regenera en segundo plano) y
// se los pasa al cliente ya listos — sin fetch en el navegador ni layout shift.
export default async function Testimonials() {
  const items = await getApprovedTestimonials();
  return <TestimonialsClient initialItems={items} />;
}
