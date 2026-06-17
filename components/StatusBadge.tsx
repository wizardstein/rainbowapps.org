import { AVAILABILITY, STATUS } from "@/lib/site";

const DOT_COLOR: Record<typeof AVAILABILITY, string> = {
  green: "bg-status-green",
  amber: "bg-status-amber",
};

export default function StatusBadge() {
  const { label } = STATUS[AVAILABILITY];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink-soft">
      <span
        aria-hidden="true"
        className={`size-2.5 rounded-full ${DOT_COLOR[AVAILABILITY]}`}
      />
      {label}
    </span>
  );
}
