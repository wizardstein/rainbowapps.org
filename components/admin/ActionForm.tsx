"use client";

import { useActionState } from "react";
import type { AdminActionState } from "@/app/admin/actions";

type Action = (
  prev: AdminActionState,
  formData: FormData,
) => Promise<AdminActionState>;

/** Small client wrapper: any admin form gets pending-disable + inline
 *  error/success feedback from the server action, no per-form plumbing. */
export default function ActionForm({
  action,
  className,
  children,
}: {
  action: Action;
  className?: string;
  children: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className={className}>
      {state?.error && (
        <p role="alert" className="mb-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mb-3 text-sm text-status-green">
          Salvat.
        </p>
      )}
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
