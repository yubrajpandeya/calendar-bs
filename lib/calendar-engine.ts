import { dateConfigMap } from "nepali-date-converter";

const MONTH_KEYS = [
  "Baisakh",
  "Jestha",
  "Asar",
  "Shrawan",
  "Bhadra",
  "Aswin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
] as const;

const DAY_MS = 86_400_000;
const EPOCH_AD = Date.UTC(1943, 3, 14);

export const MIN_BS_YEAR = 2000;
export const MAX_BS_YEAR = 2090;

export type BsDate = {
  year: number;
  month: number;
  day: number;
};

export type AdDate = {
  year: number;
  month: number;
  day: number;
};

export const BS_MONTHS_NE = [
  "वैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुस",
  "माघ",
  "फागुन",
  "चैत",
];

export const BS_MONTHS_EN = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

export const WEEKDAYS_NE = [
  "आइतबार",
  "सोमबार",
  "मंगलबार",
  "बुधबार",
  "बिहीबार",
  "शुक्रबार",
  "शनिबार",
];

export const WEEKDAYS_SHORT_NE = [
  "आइत",
  "सोम",
  "मंगल",
  "बुध",
  "बिही",
  "शुक्र",
  "शनि",
];

export const WEEKDAYS_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function toNepaliDigits(value: number | string) {
  const map: Record<string, string> = {
    "0": "०",
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९",
  };
  return String(value).replace(/\d/g, (digit) => map[digit]);
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function bsKey(date: BsDate) {
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

export function adKey(date: AdDate) {
  return `${date.year}-${pad(date.month)}-${pad(date.day)}`;
}

export function getDaysInBsMonth(year: number, month: number) {
  assertBsYear(year);
  if (month < 1 || month > 12) {
    throw new RangeError("BS month must be between 1 and 12.");
  }
  const yearConfig = dateConfigMap[String(year)];
  return yearConfig[MONTH_KEYS[month - 1]];
}

export function isValidBsDate(date: BsDate) {
  if (
    !Number.isInteger(date.year) ||
    !Number.isInteger(date.month) ||
    !Number.isInteger(date.day) ||
    date.year < MIN_BS_YEAR ||
    date.year > MAX_BS_YEAR ||
    date.month < 1 ||
    date.month > 12
  ) {
    return false;
  }
  return date.day >= 1 && date.day <= getDaysInBsMonth(date.year, date.month);
}

export function bsToAd(date: BsDate): AdDate {
  if (!isValidBsDate(date)) {
    throw new RangeError("Invalid Bikram Sambat date.");
  }

  let dayOffset = date.day - 1;
  for (let year = MIN_BS_YEAR; year < date.year; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      dayOffset += getDaysInBsMonth(year, month);
    }
  }
  for (let month = 1; month < date.month; month += 1) {
    dayOffset += getDaysInBsMonth(date.year, month);
  }

  const converted = new Date(EPOCH_AD + dayOffset * DAY_MS);
  return {
    year: converted.getUTCFullYear(),
    month: converted.getUTCMonth() + 1,
    day: converted.getUTCDate(),
  };
}

export function adToBs(date: AdDate): BsDate {
  const utc = Date.UTC(date.year, date.month - 1, date.day);
  const check = new Date(utc);
  if (
    check.getUTCFullYear() !== date.year ||
    check.getUTCMonth() + 1 !== date.month ||
    check.getUTCDate() !== date.day
  ) {
    throw new RangeError("Invalid Gregorian date.");
  }

  let remaining = Math.floor((utc - EPOCH_AD) / DAY_MS);
  if (remaining < 0) {
    throw new RangeError("Date is earlier than the supported calendar range.");
  }

  let year = MIN_BS_YEAR;
  while (year <= MAX_BS_YEAR) {
    let yearDays = 0;
    for (let month = 1; month <= 12; month += 1) {
      yearDays += getDaysInBsMonth(year, month);
    }
    if (remaining < yearDays) break;
    remaining -= yearDays;
    year += 1;
  }

  if (year > MAX_BS_YEAR) {
    throw new RangeError("Date is later than the supported calendar range.");
  }

  let month = 1;
  while (month <= 12) {
    const monthDays = getDaysInBsMonth(year, month);
    if (remaining < monthDays) break;
    remaining -= monthDays;
    month += 1;
  }

  return { year, month, day: remaining + 1 };
}

export function weekdayForAd(date: AdDate) {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

export function getTodayInNepal(): AdDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
  };
}

function assertBsYear(year: number) {
  if (
    !Number.isInteger(year) ||
    year < MIN_BS_YEAR ||
    year > MAX_BS_YEAR ||
    !dateConfigMap[String(year)]
  ) {
    throw new RangeError(
      `BS year must be between ${MIN_BS_YEAR} and ${MAX_BS_YEAR}.`,
    );
  }
}
