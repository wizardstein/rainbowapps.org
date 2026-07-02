"use server";

import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";

// Every action re-checks the session (defense in depth — the layout gate is
// not enough on its own) and returns a plain Romanian error string on failure.

export type AdminActionState = { error?: string; ok?: boolean } | null;

const NOT_ALLOWED = "Nu ai voie aici.";
const GENERIC = "Ceva n-a mers. Încearcă din nou.";

const SUBMISSION_STATUSES = [
  "new",
  "reviewing",
  "accepted",
  "building",
  "shipped",
  "declined",
] as const;

export async function setAvailability(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdmin())) return { error: NOT_ALLOWED };
  const value = String(formData.get("availability"));
  if (value !== "green" && value !== "amber") return { error: GENERIC };

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("site_settings")
    .update({ availability: value, updated_at: new Date().toISOString() })
    .eq("id", true);
  if (error) {
    console.error("setAvailability failed:", error.message);
    return { error: GENERIC };
  }
  updateTag("settings");
  revalidatePath("/admin");
  return { ok: true };
}

export async function updateSubmission(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdmin())) return { error: NOT_ALLOWED };
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const notes = String(formData.get("notes") ?? "");
  if (!SUBMISSION_STATUSES.includes(status as never)) {
    return { error: GENERIC };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("submissions")
    .update({ status, notes: notes.trim() || null })
    .eq("id", id);
  if (error) {
    console.error("updateSubmission failed:", error.message);
    return { error: GENERIC };
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/idei/${id}`);
  return { ok: true };
}

export async function saveProject(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdmin())) return { error: NOT_ALLOWED };
  const id = String(formData.get("id") ?? "").trim();
  const row = {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    published: formData.get("published") === "on",
  };
  if (!row.title || !row.description || !row.url) {
    return { error: "Titlul, descrierea și adresa sunt obligatorii." };
  }

  const supabase = createServiceClient();
  const { error } = id
    ? await supabase.from("projects").update(row).eq("id", id)
    : await supabase.from("projects").insert(row);
  if (error) {
    console.error("saveProject failed:", error.message);
    return { error: GENERIC };
  }
  updateTag("projects");
  revalidatePath("/admin/portofoliu");
  return { ok: true };
}

export async function deleteProject(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdmin())) return { error: NOT_ALLOWED };
  const id = String(formData.get("id") ?? "");
  const supabase = createServiceClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    console.error("deleteProject failed:", error.message);
    return { error: GENERIC };
  }
  updateTag("projects");
  revalidatePath("/admin/portofoliu");
  return { ok: true };
}

export async function saveTestimonial(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdmin())) return { error: NOT_ALLOWED };
  const id = String(formData.get("id") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const row = {
    author: String(formData.get("author") ?? "").trim(),
    text: String(formData.get("text") ?? "").trim(),
    url: url || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    published: formData.get("published") === "on",
  };
  if (!row.author || !row.text) {
    return { error: "Numele și textul sunt obligatorii." };
  }

  const supabase = createServiceClient();
  const { error } = id
    ? await supabase.from("testimonials").update(row).eq("id", id)
    : await supabase.from("testimonials").insert(row);
  if (error) {
    console.error("saveTestimonial failed:", error.message);
    return { error: GENERIC };
  }
  updateTag("testimonials");
  revalidatePath("/admin/testimoniale");
  return { ok: true };
}

export async function deleteTestimonial(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  if (!(await requireAdmin())) return { error: NOT_ALLOWED };
  const id = String(formData.get("id") ?? "");
  const supabase = createServiceClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) {
    console.error("deleteTestimonial failed:", error.message);
    return { error: GENERIC };
  }
  updateTag("testimonials");
  revalidatePath("/admin/testimoniale");
  return { ok: true };
}
