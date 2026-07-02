// Romanian labels for the submission statuses (DB values stay English —
// they're in the check constraint from SPEC §8).

export const STATUS_LABELS: Record<string, string> = {
  new: "Nouă",
  reviewing: "În evaluare",
  accepted: "Acceptată",
  building: "În lucru",
  shipped: "Livrată",
  declined: "Refuzată",
};

export const STATUS_ORDER = [
  "new",
  "reviewing",
  "accepted",
  "building",
  "shipped",
  "declined",
] as const;
