export function toMonthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function monthsAgo(count: number) {
  const date = new Date();
  date.setUTCMonth(date.getUTCMonth() - count);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}
