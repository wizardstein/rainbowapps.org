import { unstable_cache } from "next/cache";
import { createServiceClient } from "@/lib/supabase";
import { AVAILABILITY, PROJECTS, type Availability, type Project } from "@/lib/site";

// DB-driven site content, cached with tags so admin edits show up in seconds
// (revalidateTag in the admin actions) while pages stay static for visitors.
// Every reader falls back to the hardcoded values in lib/site.ts — the public
// site must keep working even if a table is missing or the DB is down.

export type Testimonial = {
  id: string;
  author: string;
  text: string;
  url: string | null;
};

export const getAvailability = unstable_cache(
  async (): Promise<Availability> => {
    try {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("site_settings")
        .select("availability")
        .limit(1)
        .single();
      if (error || !data) return AVAILABILITY;
      return data.availability === "amber" ? "amber" : "green";
    } catch {
      return AVAILABILITY;
    }
  },
  ["availability"],
  { tags: ["settings"] },
);

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    try {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("projects")
        .select("title, description, url")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error || !data || data.length === 0) return PROJECTS;
      return data;
    } catch {
      return PROJECTS;
    }
  },
  ["projects"],
  { tags: ["projects"] },
);

export const getTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    try {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, author, text, url")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },
  ["testimonials"],
  { tags: ["testimonials"] },
);
