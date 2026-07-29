import { NextResponse } from "next/server";
import {
  adToBs,
  BS_MONTHS_EN,
  BS_MONTHS_NE,
  bsToAd,
  toNepaliDigits,
  WEEKDAYS_EN,
  WEEKDAYS_NE,
  weekdayForAd,
} from "@/lib/calendar-engine";
import {
  formatAdLong,
  formatBsIso,
  parseBsDate,
  parseIsoDate,
} from "@/lib/calendar-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const value = searchParams.get("date") ?? "";

  try {
    if (from === "bs") {
      const bs = parseBsDate(value);
      const ad = bsToAd(bs);
      const weekday = weekdayForAd(ad);
      return NextResponse.json({
        from: "BS",
        input: bs,
        result: ad,
        resultIso: `${ad.year}-${String(ad.month).padStart(2, "0")}-${String(ad.day).padStart(2, "0")}`,
        resultLabel: formatAdLong(ad),
        weekday: {
          ne: WEEKDAYS_NE[weekday],
          en: WEEKDAYS_EN[weekday],
        },
      });
    }

    if (from === "ad") {
      const ad = parseIsoDate(value);
      const bs = adToBs(ad);
      const weekday = weekdayForAd(ad);
      return NextResponse.json({
        from: "AD",
        input: ad,
        result: bs,
        resultIso: formatBsIso(bs),
        resultLabel: `${toNepaliDigits(bs.day)} ${BS_MONTHS_NE[bs.month - 1]} ${toNepaliDigits(bs.year)}`,
        resultLabelEn: `${BS_MONTHS_EN[bs.month - 1]} ${bs.day}, ${bs.year}`,
        weekday: {
          ne: WEEKDAYS_NE[weekday],
          en: WEEKDAYS_EN[weekday],
        },
      });
    }

    return NextResponse.json(
      {
        error: "invalid_conversion_direction",
        message: "Use from=bs or from=ad.",
      },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "invalid_date",
        message:
          error instanceof Error
            ? error.message
            : "Date could not be converted.",
      },
      { status: 400 },
    );
  }
}
