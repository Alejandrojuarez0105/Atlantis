import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";

// Regenera la página (con los testimonios frescos) como máximo cada 60s.
export const revalidate = 60;

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Services />
      <Testimonials />
      <Contact />
    </main>
  );
}
