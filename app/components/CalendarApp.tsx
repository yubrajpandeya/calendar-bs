"use client";

import {
  ArrowRightLeft,
  CalendarCheck2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  ExternalLink,
  Menu,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent, EventType } from "@/lib/calendar-data";
import type {
  CalendarDay,
  CalendarMonthPayload,
  EventWithAd,
} from "@/lib/calendar-service";

type TodaySummary = {
  bs: { year: number; month: number; day: number };
  ad: { year: number; month: number; day: number };
  adIso: string;
  key: string;
  weekday: number;
  weekdayNe: string;
  weekdayEn: string;
  monthNameNe: string;
  monthNameEn: string;
  labelNe: string;
  events: CalendarEvent[];
};

type Props = {
  initialCalendar: CalendarMonthPayload;
  today: TodaySummary;
  yearEvents: EventWithAd[];
};

type ConverterResult = {
  resultIso: string;
  resultLabel: string;
  resultLabelEn?: string;
  weekday: { ne: string; en: string };
};

const MONTHS_NE = [
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

const WEEKDAYS = [
  ["आइत", "SUN"],
  ["सोम", "MON"],
  ["मंगल", "TUE"],
  ["बुध", "WED"],
  ["बिही", "THU"],
  ["शुक्र", "FRI"],
  ["शनि", "SAT"],
];

const EVENT_LABELS: Record<EventType, string> = {
  public: "सार्वजनिक बिदा",
  festival: "पर्व",
  regional: "क्षेत्रीय बिदा",
  observance: "दिवस",
};

const numberNe = (value: number | string) => {
  const digits = "०१२३४५६७८९";
  return String(value).replace(/\d/g, (digit) => digits[Number(digit)]);
};

const adLabel = (value: { year: number; month: number; day: number }) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(Date.UTC(value.year, value.month - 1, value.day)));

export default function CalendarApp({
  initialCalendar,
  today,
  yearEvents,
}: Props) {
  const [calendar, setCalendar] = useState(initialCalendar);
  const [selectedKey, setSelectedKey] = useState(today.key);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarError, setCalendarError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clock, setClock] = useState("नेपाल समय");
  const [eventFilter, setEventFilter] = useState<EventType | "all">("all");
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    const updateClock = () =>
      setClock(
        new Intl.DateTimeFormat("ne-NP", {
          timeZone: "Asia/Kathmandu",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const selectedDay =
    calendar.days.find((day) => day.key === selectedKey) ?? calendar.days[0];

  const filteredEvents = useMemo(
    () =>
      yearEvents.filter(
        (item) => eventFilter === "all" || item.type === eventFilter,
      ),
    [eventFilter, yearEvents],
  );

  async function loadMonth(year: number, month: number) {
    setIsLoading(true);
    setCalendarError("");
    try {
      const response = await fetch(`/api/calendar?year=${year}&month=${month}`);
      if (!response.ok) throw new Error("पात्रो लोड हुन सकेन।");
      const payload = (await response.json()) as CalendarMonthPayload;
      setCalendar(payload);
      const currentDay = payload.days.find((day) => day.isToday);
      setSelectedKey(currentDay?.key ?? payload.days[0].key);
    } catch (error) {
      setCalendarError(
        error instanceof Error ? error.message : "पात्रो लोड हुन सकेन।",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function changeMonth(offset: number) {
    let year = calendar.year;
    let month = calendar.month + offset;
    if (month < 1) {
      month = 12;
      year -= 1;
    } else if (month > 12) {
      month = 1;
      year += 1;
    }
    void loadMonth(year, month);
  }

  function returnToToday() {
    void loadMonth(today.bs.year, today.bs.month);
  }

  return (
    <div className="app-frame">
      <a className="skip-link" href="#main-content">
        मुख्य सामग्रीमा जानुहोस्
      </a>

      <header className="site-header">
        <div className="top-strip">
          <div className="page-shell top-strip-inner">
            <div className="top-strip-item">
              <CalendarDays size={17} aria-hidden="true" />
              <span>{today.labelNe}</span>
            </div>
            <div className="top-strip-actions">
              <span className="top-strip-item">
                <Clock3 size={16} aria-hidden="true" />
                <span aria-live="off">{clock}</span>
              </span>
              <a href="https://www.newsbihani.com/" target="_blank" rel="noreferrer">
                News Bihani
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="main-nav">
          <div className="page-shell nav-inner">
            <a className="brand" href="#calendar" aria-label="News Bihani पात्रो">
              <span className="brand-mark">
                <CalendarDays size={25} strokeWidth={2.2} aria-hidden="true" />
              </span>
              <span className="brand-copy">
                <strong>न्युज बिहानी</strong>
                <small>पात्रो</small>
              </span>
            </a>

            <nav className="desktop-nav" aria-label="मुख्य नेभिगेसन">
              <a className="active" href="#calendar">
                पात्रो
              </a>
              <a href="#converter">मिति रूपान्तरण</a>
              <a href="#holidays">बिदा तथा पर्व</a>
              <a href="/api-docs">API</a>
            </nav>

            <button
              className="mobile-menu-button"
              type="button"
              aria-label={mobileMenuOpen ? "मेनु बन्द गर्नुहोस्" : "मेनु खोल्नुहोस्"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="mobile-nav" aria-label="मोबाइल नेभिगेसन">
              <a href="#calendar" onClick={() => setMobileMenuOpen(false)}>
                पात्रो
              </a>
              <a href="#converter" onClick={() => setMobileMenuOpen(false)}>
                मिति रूपान्तरण
              </a>
              <a href="#holidays" onClick={() => setMobileMenuOpen(false)}>
                बिदा तथा पर्व
              </a>
              <a href="/api-docs">API</a>
            </nav>
          )}
        </div>
      </header>

      <main id="main-content">
        <section className="today-hero">
          <div className="page-shell today-hero-inner">
            <div className="today-date-block">
              <span className="today-kicker">आजको नेपाली मिति</span>
              <div className="today-date-line">
                <strong>{numberNe(today.bs.day)}</strong>
                <div>
                  <h1>
                    {today.monthNameNe} {numberNe(today.bs.year)}
                  </h1>
                  <p>
                    {today.weekdayNe} <span aria-hidden="true">•</span>{" "}
                    {adLabel(today.ad)}
                  </p>
                </div>
              </div>
            </div>

            <div className="hero-trust">
              <ShieldCheck size={28} aria-hidden="true" />
              <div>
                <strong>स्थानीय र भरपर्दो</strong>
                <span>बाह्य API बिना, नेपाल समयअनुसार</span>
              </div>
            </div>
          </div>
        </section>

        <div className="page-shell content-shell">
          <section className="calendar-section" id="calendar" aria-labelledby="calendar-heading">
            <div className="section-heading">
              <div>
                <span className="section-kicker">वि.सं. मासिक पात्रो</span>
                <h2 id="calendar-heading">मिति, बिदा र पर्व एकै ठाउँमा</h2>
              </div>
              <button className="today-button" type="button" onClick={returnToToday}>
                <RotateCcw size={17} aria-hidden="true" />
                आज
              </button>
            </div>

            <div className="calendar-layout">
              <div className={`calendar-card${isLoading ? " is-loading" : ""}`}>
                <div className="calendar-toolbar">
                  <button
                    className="icon-button"
                    type="button"
                    aria-label="अघिल्लो महिना"
                    onClick={() => changeMonth(-1)}
                    disabled={isLoading || (calendar.year === 2000 && calendar.month === 1)}
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <div className="month-selectors">
                    <label>
                      <span className="sr-only">महिना छान्नुहोस्</span>
                      <select
                        value={calendar.month}
                        onChange={(event) =>
                          void loadMonth(calendar.year, Number(event.target.value))
                        }
                        disabled={isLoading}
                      >
                        {MONTHS_NE.map((month, index) => (
                          <option value={index + 1} key={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span className="sr-only">वर्ष छान्नुहोस्</span>
                      <select
                        value={calendar.year}
                        onChange={(event) =>
                          void loadMonth(Number(event.target.value), calendar.month)
                        }
                        disabled={isLoading}
                      >
                        {Array.from({ length: 91 }, (_, index) => 2000 + index).map(
                          (year) => (
                            <option value={year} key={year}>
                              {numberNe(year)}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                  </div>

                  <button
                    className="icon-button"
                    type="button"
                    aria-label="अर्को महिना"
                    onClick={() => changeMonth(1)}
                    disabled={isLoading || (calendar.year === 2090 && calendar.month === 12)}
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>

                <div className="calendar-title-row">
                  <div>
                    <h3>
                      {calendar.monthNameNe} {numberNe(calendar.year)}
                    </h3>
                    <p>
                      {calendar.monthNameEn} {calendar.year} BS
                    </p>
                  </div>
                  <span>{calendar.adRange.label}</span>
                </div>

                {calendarError && (
                  <div className="calendar-error" role="alert">
                    {calendarError}
                  </div>
                )}

                <div className="weekday-grid" role="row">
                  {WEEKDAYS.map(([nepali, english], index) => (
                    <div className={index === 6 ? "saturday" : ""} role="columnheader" key={nepali}>
                      <strong>{nepali}</strong>
                      <span>{english}</span>
                    </div>
                  ))}
                </div>

                <div className="days-grid" role="grid" aria-label={`${calendar.monthNameNe} ${calendar.year}`}>
                  {calendar.days.map((day, index) => (
                    <CalendarCell
                      key={day.key}
                      day={day}
                      isSelected={selectedKey === day.key}
                      isFirst={index === 0}
                      onSelect={() => setSelectedKey(day.key)}
                    />
                  ))}
                </div>

                <div className="calendar-legend" aria-label="पात्रो सङ्केत">
                  <span>
                    <i className="legend-today" /> आज
                  </span>
                  <span>
                    <i className="legend-holiday" /> सार्वजनिक बिदा
                  </span>
                  <span>
                    <i className="legend-saturday" /> शनिबार
                  </span>
                </div>
              </div>

              <aside className="calendar-sidebar" aria-label="छानिएको मिति र आगामी पर्व">
                <SelectedDateCard day={selectedDay} />

                <div className="sidebar-card upcoming-card">
                  <div className="sidebar-card-heading">
                    <div>
                      <span>आउँदैछन्</span>
                      <h3>पर्व र बिदा</h3>
                    </div>
                    <CalendarCheck2 size={22} aria-hidden="true" />
                  </div>
                  <div className="upcoming-list">
                    {calendar.upcoming.length ? (
                      calendar.upcoming.slice(0, 5).map((item) => (
                        <a href="#holidays" className="upcoming-item" key={item.id}>
                          <span className="upcoming-date">
                            <strong>{numberNe(item.date.day)}</strong>
                            <small>{MONTHS_NE[item.date.month - 1]}</small>
                          </span>
                          <span>
                            <strong>{item.titleNe}</strong>
                            <small>{adLabel(item.ad)}</small>
                          </span>
                          <ChevronRight size={17} aria-hidden="true" />
                        </a>
                      ))
                    ) : (
                      <p className="empty-copy">
                        यो वर्षका विशेष मिति उपलब्ध छैनन्।
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <DateConverter today={today} />

          <section className="holidays-section" id="holidays" aria-labelledby="holidays-heading">
            <div className="section-heading holidays-heading">
              <div>
                <span className="section-kicker">प्रमाणित २०८३ सूची</span>
                <h2 id="holidays-heading">बिदा तथा प्रमुख पर्व</h2>
                <p>
                  राष्ट्रिय, क्षेत्रीय र समुदायगत बिदालाई छुट्टाछुट्टै देखाइएको छ।
                </p>
              </div>
            </div>

            <div className="filter-row" role="group" aria-label="बिदा सूची फिल्टर">
              {(
                [
                  ["all", "सबै"],
                  ["public", "सार्वजनिक"],
                  ["festival", "पर्व"],
                  ["regional", "क्षेत्रीय"],
                  ["observance", "दिवस"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={eventFilter === value ? "active" : ""}
                  aria-pressed={eventFilter === value}
                  onClick={() => setEventFilter(value)}
                >
                  {eventFilter === value && <Check size={15} aria-hidden="true" />}
                  {label}
                </button>
              ))}
            </div>

            <div className="events-list">
              {(showAllEvents ? filteredEvents : filteredEvents.slice(0, 12)).map(
                (item) => (
                  <article className="event-row" key={item.id}>
                    <div className="event-date">
                      <strong>{numberNe(item.date.day)}</strong>
                      <span>{MONTHS_NE[item.date.month - 1]}</span>
                    </div>
                    <div className="event-copy">
                      <div className="event-title-line">
                        <h3>{item.titleNe}</h3>
                        <span className={`event-type ${item.type}`}>
                          {EVENT_LABELS[item.type]}
                        </span>
                      </div>
                      <p>
                        {item.titleEn} <span aria-hidden="true">•</span> {item.scope}
                      </p>
                    </div>
                    <time dateTime={item.adIso}>{adLabel(item.ad)}</time>
                  </article>
                ),
              )}
            </div>

            {filteredEvents.length > 12 && (
              <button
                className="show-all-button"
                type="button"
                onClick={() => setShowAllEvents((show) => !show)}
              >
                {showAllEvents ? "छोटो सूची देखाउनुहोस्" : `सबै ${numberNe(filteredEvents.length)} मिति देखाउनुहोस्`}
                <ChevronRight
                  size={18}
                  className={showAllEvents ? "rotate-up" : ""}
                  aria-hidden="true"
                />
              </button>
            )}
          </section>

          <section className="data-note" aria-label="डाटा विश्वसनीयता">
            <ShieldCheck size={27} aria-hidden="true" />
            <div>
              <h2>डाटा कहाँबाट आउँछ?</h2>
              <p>
                मिति गणना स्थानीय वि.सं. तालिकाबाट हुन्छ। २०८३ का सार्वजनिक
                बिदा गृह मन्त्रालयको राजपत्र र पर्व मिति नेपाली पञ्चाङ्ग
                सन्दर्भसँग मिलाइएको छ। बाह्य API मा निर्भर छैन।
              </p>
            </div>
            <a
              href="https://moha.gov.np/en/page/government-and-public-holidays-in-2083"
              target="_blank"
              rel="noreferrer"
            >
              आधिकारिक स्रोत
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-inner">
          <div className="footer-brand">
            <span className="brand-mark">
              <CalendarDays size={22} aria-hidden="true" />
            </span>
            <div>
              <strong>न्युज बिहानी पात्रो</strong>
              <span>नेपाली मिति, सरल र सही</span>
            </div>
          </div>
          <nav aria-label="फुटर नेभिगेसन">
            <a href="#calendar">पात्रो</a>
            <a href="#converter">रूपान्तरण</a>
            <a href="#holidays">बिदा</a>
            <a href="/api-docs">
              <Code2 size={15} aria-hidden="true" />
              API
            </a>
          </nav>
          <p>© २०८३ News Bihani. सर्वाधिकार सुरक्षित।</p>
        </div>
      </footer>
    </div>
  );
}

function CalendarCell({
  day,
  isSelected,
  isFirst,
  onSelect,
}: {
  day: CalendarDay;
  isSelected: boolean;
  isFirst: boolean;
  onSelect: () => void;
}) {
  const isPublicHoliday = day.events.some((item) => item.type === "public");
  const classNames = [
    "day-cell",
    day.isSaturday ? "is-saturday" : "",
    isPublicHoliday ? "is-holiday" : "",
    day.isToday ? "is-today" : "",
    isSelected ? "is-selected" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const eventText = day.events.map((item) => item.titleNe).join(", ");

  return (
    <button
      className={classNames}
      type="button"
      role="gridcell"
      style={isFirst ? { gridColumnStart: day.weekday + 1 } : undefined}
      aria-label={`${day.weekdayNe}, ${day.bs.day} ${MONTHS_NE[day.bs.month - 1]} ${day.bs.year}${eventText ? `, ${eventText}` : ""}`}
      aria-current={day.isToday ? "date" : undefined}
      aria-selected={isSelected}
      onClick={onSelect}
      data-testid={`day-${day.bs.day}`}
    >
      <span className="bs-day">{numberNe(day.bs.day)}</span>
      <span className="ad-day">{day.ad.day}</span>
      {day.events.length > 0 && (
        <span className="day-event">
          {day.events[0].titleNe}
          {day.events.length > 1 && <em>+{numberNe(day.events.length - 1)}</em>}
        </span>
      )}
      {day.isToday && <span className="today-label">आज</span>}
    </button>
  );
}

function SelectedDateCard({ day }: { day: CalendarDay }) {
  return (
    <div className="selected-date-card">
      <div className="selected-date-top">
        <span>
          <strong>{numberNe(day.bs.day)}</strong>
          <small>{MONTHS_NE[day.bs.month - 1]}</small>
        </span>
        <div>
          <p>{day.weekdayNe}</p>
          <h3>{numberNe(day.bs.year)} वि.सं.</h3>
          <time dateTime={day.adIso}>{adLabel(day.ad)}</time>
        </div>
      </div>
      <div className="selected-date-events">
        {day.events.length ? (
          day.events.map((item) => (
            <div className="selected-event" key={item.id}>
              <span className={`event-type ${item.type}`}>
                {EVENT_LABELS[item.type]}
              </span>
              <strong>{item.titleNe}</strong>
              <small>{item.scope}</small>
            </div>
          ))
        ) : (
          <div className="selected-event is-empty">
            <CalendarCheck2 size={20} aria-hidden="true" />
            <span>यो दिन कुनै प्रमुख बिदा वा पर्व छैन।</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DateConverter({ today }: { today: TodaySummary }) {
  const [direction, setDirection] = useState<"ad" | "bs">("ad");
  const [dateValue, setDateValue] = useState(today.adIso);
  const [result, setResult] = useState<ConverterResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  function switchDirection(next: "ad" | "bs") {
    setDirection(next);
    setDateValue(
      next === "ad"
        ? today.adIso
        : `${today.bs.year}-${String(today.bs.month).padStart(2, "0")}-${String(today.bs.day).padStart(2, "0")}`,
    );
    setResult(null);
    setStatus("idle");
    setMessage("");
  }

  async function convert(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(
        `/api/convert?from=${direction}&date=${encodeURIComponent(dateValue)}`,
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message ?? "मिति रूपान्तरण हुन सकेन।");
      }
      setResult(payload as ConverterResult);
      setStatus("idle");
    } catch (error) {
      setResult(null);
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "मिति रूपान्तरण हुन सकेन।",
      );
    }
  }

  return (
    <section className="converter-section" id="converter" aria-labelledby="converter-heading">
      <div className="converter-intro">
        <span className="section-kicker">छिटो र सही</span>
        <h2 id="converter-heading">मिति रूपान्तरण</h2>
        <p>वि.सं. २००० देखि २०९० सम्म BS र AD मिति तुरुन्त रूपान्तरण गर्नुहोस्।</p>
        <div className="api-assurance">
          <Code2 size={19} aria-hidden="true" />
          <span>News Bihani को आफ्नै API बाट सञ्चालित</span>
        </div>
      </div>

      <div className="converter-card">
        <div className="direction-tabs" role="tablist" aria-label="रूपान्तरण दिशा">
          <button
            type="button"
            role="tab"
            aria-selected={direction === "ad"}
            className={direction === "ad" ? "active" : ""}
            onClick={() => switchDirection("ad")}
          >
            AD बाट BS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={direction === "bs"}
            className={direction === "bs" ? "active" : ""}
            onClick={() => switchDirection("bs")}
          >
            BS बाट AD
          </button>
        </div>

        <form onSubmit={convert}>
          <label htmlFor="converter-date">
            {direction === "ad" ? "अङ्ग्रेजी मिति (AD)" : "नेपाली मिति (BS)"}
          </label>
          <div className="converter-input-row">
            <input
              id="converter-date"
              type={direction === "ad" ? "date" : "text"}
              inputMode={direction === "ad" ? undefined : "numeric"}
              value={dateValue}
              placeholder="2083-04-13"
              pattern={direction === "bs" ? "\\d{4}-\\d{2}-\\d{2}" : undefined}
              onChange={(event) => setDateValue(event.target.value)}
              required
            />
            <button type="submit" disabled={status === "loading"}>
              <ArrowRightLeft size={19} aria-hidden="true" />
              {status === "loading" ? "रूपान्तरण हुँदैछ" : "रूपान्तरण गर्नुहोस्"}
            </button>
          </div>
          <small>ढाँचा: YYYY-MM-DD</small>
        </form>

        <div className="converter-result" aria-live="polite">
          {status === "error" ? (
            <p className="converter-error">{message}</p>
          ) : result ? (
            <>
              <span>रूपान्तरित मिति</span>
              <strong>{result.resultLabel}</strong>
              {result.resultLabelEn && <p>{result.resultLabelEn}</p>}
              <small>
                {result.weekday.ne} / {result.weekday.en}
              </small>
            </>
          ) : (
            <p>मिति छानेर रूपान्तरण गर्नुहोस्। नतिजा यहाँ देखिन्छ।</p>
          )}
        </div>
      </div>
    </section>
  );
}
