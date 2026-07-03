// The brand symbol (assets-brand): an arc of 7 nodes — every app a color,
// linked in the same network. Color order is fixed.
export const SPECTRU = [
  "#E2574C", // coral
  "#F0933D", // portocaliu
  "#EFC23F", // auriu
  "#55A45E", // verde
  "#3FA39B", // turcoaz
  "#4E7FD0", // albastru
  "#8B66C6", // violet
] as const;

const NODURI: Array<[number, number]> = [
  [30, 106],
  [39.1, 72],
  [64, 47.1],
  [98, 38],
  [132, 47.1],
  [156.9, 72],
  [166, 106],
];

export default function ArcMark({
  mono = false,
  className,
}: {
  mono?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="24 32 172 104" className={className} aria-hidden="true">
      <polyline
        points="42,118 51.1,84 76,59.1 110,50 144,59.1 168.9,84 178,118"
        fill="none"
        stroke={mono ? "#2B2723" : "#DAD3C6"}
        strokeWidth="2.5"
      />
      {NODURI.map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="24"
          height="24"
          rx="7.5"
          fill={mono ? "#2B2723" : SPECTRU[i]}
        />
      ))}
    </svg>
  );
}
