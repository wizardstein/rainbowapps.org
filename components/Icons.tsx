// The few stroke icons the pages share (24×24, currentColor).

const ARROW = "M5 12h14M13 6l6 6-6 6";
const ARROW_BACK = "M19 12H5M11 6l-6 6 6 6";
const CHECK = "M5 12l5 5L20 7";

function Icon({
  d,
  className = "size-[18px]",
  strokeWidth = 2,
}: {
  d: string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return <Icon d={ARROW} className={className} />;
}

export function ArrowBackIcon({ className }: { className?: string }) {
  return <Icon d={ARROW_BACK} className={className} />;
}

export function CheckIcon({ className }: { className?: string }) {
  return <Icon d={CHECK} strokeWidth={2.4} className={className} />;
}
