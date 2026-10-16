import { STATUS, type Availability } from "@/lib/site";
import { getAvailability } from "@/lib/content";

const DOT_COLOR: Record<Availability, string> = {
  green: "bg-status-green",
  amber: "bg-status-amber",
};

/** Availability pill, owner-controlled from /admin. Sits above the hero
 *  headline as its eyebrow. */
export default async function StatusBadge() {
  const availability = await getAvailability();
  const { label } = STATUS[availability];

  return (
    <span className="tag gap-2 self-start py-1">
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${DOT_COLOR[availability]}`}
      />
      {label}
    </span>
  );
}
