export function daysUntilBirthday(dob: string, from: Date = new Date()): number {
  const [, monthStr, dayStr] = dob.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);

  const today = new Date(Date.UTC(from.getFullYear(), from.getMonth(), from.getDate()));
  const currentYear = today.getUTCFullYear();

  const birthdayThisYear = Date.UTC(currentYear, month - 1, day);
  const nextBirthday =
    birthdayThisYear < today.getTime() ? Date.UTC(currentYear + 1, month - 1, day) : birthdayThisYear;

  return Math.round((nextBirthday - today.getTime()) / 86_400_000);
}

export function formatDateShort(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const utc = Date.UTC(year, month - 1, day) + days * 86_400_000;
  return new Date(utc).toISOString().slice(0, 10);
}
