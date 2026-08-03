const BUSINESS_TIME_ZONE = "America/Sao_Paulo";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const CIVIL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/u;

function invalidRange(): never {
  throw new Error("Intervalo de datas inválido");
}

function parseCivilDate(value: string) {
  const match = CIVIL_DATE_PATTERN.exec(value);
  if (!match) return invalidRange();

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return invalidRange();
  }

  return date;
}

function toCivilDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatBusinessCivilDate(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

export function resolveBusinessMonthToDate(date: Date = new Date()) {
  const endDate = formatBusinessCivilDate(date);
  return { startDate: `${endDate.slice(0, 7)}-01`, endDate };
}

export function resolveCivilDateRange(startDate: string, endDate: string) {
  const start = parseCivilDate(startDate);
  const end = parseCivilDate(endDate);
  if (end.getTime() < start.getTime()) return invalidRange();

  const inclusiveDays = (end.getTime() - start.getTime()) / DAY_IN_MS + 1;
  const previousEnd = new Date(start.getTime() - DAY_IN_MS);
  const previousStart = new Date(
    previousEnd.getTime() - (inclusiveDays - 1) * DAY_IN_MS,
  );

  return {
    startDate,
    endDate,
    start,
    end,
    inclusiveDays,
    previousStartDate: toCivilDate(previousStart),
    previousEndDate: toCivilDate(previousEnd),
    previousStart,
    previousEnd,
  };
}
