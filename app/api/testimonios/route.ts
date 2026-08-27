import { NextResponse } from "next/server";
import { getApprovedTestimonials } from "@/lib/testimonials";

export async function GET() {
  const testimonials = await getApprovedTestimonials();
  return NextResponse.json({ testimonials });
}
