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
