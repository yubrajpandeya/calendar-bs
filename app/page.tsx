import CalendarApp from "./components/CalendarApp";
import {
  getAllEventsWithAd,
  getCalendarMonth,
  getTodaySummary,
} from "@/lib/calendar-service";

export const dynamic = "force-dynamic";

export default function Home() {
  const today = getTodaySummary();
  const initialCalendar = getCalendarMonth(today.bs.year, today.bs.month);
  const yearEvents = getAllEventsWithAd(today.bs.year);

  return (
    <CalendarApp
      initialCalendar={initialCalendar}
      today={today}
      yearEvents={yearEvents}
    />
  );
}
