import { supabaseAdmin } from "@/lib/supabase";

export type Testimonial = {
  name: string;
  subject: string;
  rating: number;
  message: string;
};

// Testimonios aprobados y con el correo confirmado, con los destacados (`featured`) primero y luego por
// fecha. Lo usa el componente server de la sección de Testimonios.
export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("name, subject, rating, message")
    .eq("approved", true)
    .eq("verified", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials", error);
    return [];
  }

  return data ?? [];
}
