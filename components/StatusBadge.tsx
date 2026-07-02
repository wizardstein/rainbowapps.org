import { STATUS, type Availability } from "@/lib/site";
import { getAvailability } from "@/lib/content";

const DOT_COLOR: Record<Availability, string> = {
  green: "bg-status-green",
  amber: "bg-status-amber",
};

export default async function StatusBadge() {
  const availability = await getAvailability();
  const { label } = STATUS[availability];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink-soft">
      <span
        aria-hidden="true"
        className={`size-2.5 rounded-full ${DOT_COLOR[availability]}`}
      />
      {label}
    </span>
  );
}
