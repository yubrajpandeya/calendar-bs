import {
  adKey,
  adToBs,
  BS_MONTHS_EN,
  BS_MONTHS_NE,
  bsKey,
  bsToAd,
  getDaysInBsMonth,
  getTodayInNepal,
  MAX_BS_YEAR,
  MIN_BS_YEAR,
  pad,
  toNepaliDigits,
  WEEKDAYS_EN,
  WEEKDAYS_NE,
  weekdayForAd,
  type AdDate,
  type BsDate,
} from "./calendar-engine";
import {
  CALENDAR_EVENTS_2083,
  DATA_SOURCES,
  EVENTS_BY_DATE,
  type CalendarEvent,
} from "./calendar-data";

export type CalendarDay = {
  key: string;
  bs: BsDate;
  ad: AdDate;
  adIso: string;
  weekday: number;
  weekdayNe: string;
  weekdayEn: string;
  isSaturday: boolean;
  isToday: boolean;
  events: CalendarEvent[];
};

export type CalendarMonthPayload = {
  calendar: "BS";
  year: number;
  month: number;
  monthNameNe: string;
  monthNameEn: string;
  daysInMonth: number;
  startsOn: number;
  adRange: {
    start: string;
    end: string;
    label: string;
  };
  days: CalendarDay[];
  upcoming: EventWithAd[];
  supportedRange: {
    minYear: number;
    maxYear: number;
  };
  generatedAt: string;
  sources: typeof DATA_SOURCES;
};

export type EventWithAd = CalendarEvent & {
  ad: AdDate;
  adIso: string;
};

export function getCalendarMonth(
  year: number,
  month: number,
): CalendarMonthPayload {
  const daysInMonth = getDaysInBsMonth(year, month);
  const todayAd = getTodayInNepal();
  const todayBs = adToBs(todayAd);
  const todayKey = bsKey(todayBs);

  const days = Array.from({ length: daysInMonth }, (_, index) => {
    const bs = { year, month, day: index + 1 };
    const ad = bsToAd(bs);
    const weekday = weekdayForAd(ad);
    const key = bsKey(bs);
    return {
      key,
      bs,
      ad,
      adIso: adKey(ad),
      weekday,
      weekdayNe: WEEKDAYS_NE[weekday],
      weekdayEn: WEEKDAYS_EN[weekday],
      isSaturday: weekday === 6,
      isToday: key === todayKey,
      events: EVENTS_BY_DATE[key] ?? [],
    };
  });

  const first = days[0];
  const last = days[days.length - 1];

  return {
    calendar: "BS",
    year,
    month,
    monthNameNe: BS_MONTHS_NE[month - 1],
    monthNameEn: BS_MONTHS_EN[month - 1],
    daysInMonth,
    startsOn: first.weekday,
    adRange: {
      start: first.adIso,
      end: last.adIso,
      label: `${formatAdMonth(first.ad)} ${first.ad.year} - ${formatAdMonth(last.ad)} ${last.ad.year}`,
    },
    days,
    upcoming: getUpcomingEvents(todayBs, 8),
    supportedRange: {
      minYear: MIN_BS_YEAR,
      maxYear: MAX_BS_YEAR,
    },
    generatedAt: new Date().toISOString(),
    sources: DATA_SOURCES,
  };
}

export function getAllEventsWithAd(year = 2083): EventWithAd[] {
  if (year !== 2083) return [];
  return CALENDAR_EVENTS_2083.map((item) => {
    const ad = bsToAd(item.date);
    return { ...item, ad, adIso: adKey(ad) };
  });
}

export function getUpcomingEvents(
  from: BsDate,
  limit = 8,
): EventWithAd[] {
  return getAllEventsWithAd(from.year)
    .filter((item) => bsKey(item.date) >= bsKey(from))
    .slice(0, limit);
}

export function getTodaySummary() {
  const ad = getTodayInNepal();
  const bs = adToBs(ad);
  const weekday = weekdayForAd(ad);
  return {
    bs,
    ad,
    adIso: adKey(ad),
    key: bsKey(bs),
    weekday,
    weekdayNe: WEEKDAYS_NE[weekday],
    weekdayEn: WEEKDAYS_EN[weekday],
    monthNameNe: BS_MONTHS_NE[bs.month - 1],
    monthNameEn: BS_MONTHS_EN[bs.month - 1],
    labelNe: `${WEEKDAYS_NE[weekday]}, ${toNepaliDigits(bs.day)} ${BS_MONTHS_NE[bs.month - 1]} ${toNepaliDigits(bs.year)}`,
    events: EVENTS_BY_DATE[bsKey(bs)] ?? [],
  };
}

export function parseIsoDate(value: string): AdDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError("Use YYYY-MM-DD format.");
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function parseBsDate(value: string): BsDate {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError("Use YYYY-MM-DD format.");
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function formatAdLong(ad: AdDate) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(Date.UTC(ad.year, ad.month - 1, ad.day)));
}

function formatAdMonth(ad: AdDate) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
  }).format(new Date(Date.UTC(ad.year, ad.month - 1, ad.day)));
}

export function formatBsIso(bs: BsDate) {
  return `${bs.year}-${pad(bs.month)}-${pad(bs.day)}`;
}
