import { NextResponse } from "next/server";
import { getCalendarMonth } from "@/lib/calendar-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year") ?? 2083);
  const month = Number(searchParams.get("month") ?? 1);

  try {
    return NextResponse.json(getCalendarMonth(year, month), {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "invalid_calendar_request",
        message:
          error instanceof Error
            ? error.message
            : "Calendar request could not be processed.",
      },
      { status: 400 },
    );
  }
}
