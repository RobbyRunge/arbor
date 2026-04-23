export function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthLabel(): string {
  return new Date().toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
}

/** Returns an ISO week key like "2026-W15" for a given date string (YYYY-MM-DD). */
export function getWeekKey(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const tmp = new Date(date);
  const day = tmp.getDay() || 7; // Mon=1 … Sun=7
  tmp.setDate(tmp.getDate() + 4 - day); // shift to Thursday of the week
  const year = tmp.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const week = Math.ceil(
    ((tmp.getTime() - startOfYear.getTime()) / 86_400_000 + 1) / 7,
  );
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** Returns label info for a week key, e.g. { kw: 15, range: "07.04. – 13.04.2026" } */
export function getWeekLabel(weekKey: string): { kw: number; range: string } {
  const [yearStr, weekStr] = weekKey.split("-W");
  const year = parseInt(yearStr);
  const week = parseInt(weekStr);

  // Monday of the ISO week
  const jan4 = new Date(year, 0, 4);
  const day = jan4.getDay() || 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - day + 1 + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.`;

  return {
    kw: week,
    range: `${fmt(monday)} – ${fmt(sunday)}${year}`,
  };
}
