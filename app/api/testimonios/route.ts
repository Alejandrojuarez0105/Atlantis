import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("testimonials")
    .select("name, subject, rating, message")
    .eq("approved", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching testimonials", error);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }

  return NextResponse.json({ testimonials: data ?? [] });
}
