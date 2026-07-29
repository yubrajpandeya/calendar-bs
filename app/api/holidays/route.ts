import { NextResponse } from "next/server";
import { DATA_SOURCES } from "@/lib/calendar-data";
import { getAllEventsWithAd } from "@/lib/calendar-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = Number(searchParams.get("year") ?? 2083);
  const type = searchParams.get("type");

  const allEvents = getAllEventsWithAd(year);
  const events = type
    ? allEvents.filter((item) => item.type === type)
    : allEvents;

  return NextResponse.json({
    year,
    count: events.length,
    events,
    verifiedAt: "2026-07-29",
    sources: DATA_SOURCES,
  });
}
