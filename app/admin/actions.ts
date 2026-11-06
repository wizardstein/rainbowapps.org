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
    published: formData.get("published") === "on",
  };
  if (!row.title || !row.description || !row.url) {
    return { error: "Titlul, descrierea și adresa sunt obligatorii." };
  }

  const supabase = createServiceClient();
  const { error } = id
    ? await supabase.from("projects").update(row).eq("id", id)
    : await supabase
        .from("projects")
        .insert({ ...row, sort_order: await nextSortOrder("projects") });
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
    published: formData.get("published") === "on",
  };
  if (!row.author || !row.text) {
    return { error: "Numele și textul sunt obligatorii." };
  }

  const supabase = createServiceClient();
  const { error } = id
    ? await supabase.from("testimonials").update(row).eq("id", id)
    : await supabase
        .from("testimonials")
        .insert({ ...row, sort_order: await nextSortOrder("testimonials") });
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

// ── Ordering by drag and drop (owner, 2026-11-06) ──────────────────────────
// The admin lists are sorted by dragging; the server stores the position as
// sort_order 1..n. Nobody types an index any more: rows added from the admin
// go to the end, testimonials sent from /sustine arrive with the default 0,
// so they show first in the admin list until they are moved.

type OrderedTable = "projects" | "testimonials";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function nextSortOrder(table: OrderedTable): Promise<number> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  return ((data?.[0]?.sort_order as number | undefined) ?? 0) + 1;
}

async function saveOrder(
  table: OrderedTable,
  ids: unknown,
): Promise<AdminActionState> {
  if (!(await requireAdmin())) return { error: NOT_ALLOWED };
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > 500 ||
    !ids.every((id) => typeof id === "string" && UUID.test(id)) ||
    new Set(ids).size !== ids.length
  ) {
    return { error: GENERIC };
  }

  const supabase = createServiceClient();
  const results = await Promise.all(
    (ids as string[]).map((id, i) =>
      supabase.from(table).update({ sort_order: i + 1 }).eq("id", id),
    ),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error(`saveOrder(${table}) failed:`, failed.error.message);
    return { error: GENERIC };
  }
  updateTag(table);
  revalidatePath(table === "projects" ? "/admin/portofoliu" : "/admin/testimoniale");
  return { ok: true };
}

export async function reorderProjects(ids: string[]): Promise<AdminActionState> {
  return saveOrder("projects", ids);
}

export async function reorderTestimonials(ids: string[]): Promise<AdminActionState> {
  return saveOrder("testimonials", ids);
}
