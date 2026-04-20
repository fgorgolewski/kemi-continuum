import { useEffect, useState } from "react";
import { format, parseISO, isToday, isTomorrow, startOfDay, addDays } from "date-fns";
import { Calendar, Clock, MapPin } from "lucide-react";

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
}

const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;

export function CalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CALENDAR_ID || !API_KEY) {
      setLoading(false);
      setError("calendar_not_configured");
      return;
    }

    const timeMin = startOfDay(new Date()).toISOString();
    const timeMax = addDays(startOfDay(new Date()), 7).toISOString();

    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events` +
        `?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&maxResults=15&singleEvents=true&orderBy=startTime`,
    )
      .then((r) => {
        if (!r.ok) throw new Error(`Calendar API ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setEvents(data.items ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatTime = (ev: CalendarEvent) => {
    const start = ev.start.dateTime ?? ev.start.date;
    if (!start) return "";
    if (ev.start.date && !ev.start.dateTime) return "All day";
    return format(parseISO(start), "h:mm a");
  };

  const formatDay = (ev: CalendarEvent) => {
    const start = ev.start.dateTime ?? ev.start.date;
    if (!start) return "";
    const d = parseISO(start);
    if (isToday(d)) return "Today";
    if (isTomorrow(d)) return "Tomorrow";
    return format(d, "EEE, MMM d");
  };

  // Group events by day
  const grouped: Record<string, CalendarEvent[]> = {};
  for (const ev of events) {
    const day = formatDay(ev);
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(ev);
  }

  // Not configured state
  if (error === "calendar_not_configured") {
    return (
      <div className="border border-border/60 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
            Calendar
          </span>
        </div>
        <div className="space-y-3">
          {["9:00 AM — Client fitting", "11:30 AM — Vendor call", "2:00 PM — Sourcing review", "4:30 PM — Wardrobe consultation"].map(
            (placeholder, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                <div className="h-2 w-2 rounded-full bg-border" />
                <span className="text-sm text-muted-foreground/40">{placeholder}</span>
              </div>
            ),
          )}
        </div>
        <p className="text-xs text-muted-foreground/50 mt-4">
          Connect Google Calendar: add VITE_GOOGLE_CALENDAR_ID and VITE_GOOGLE_CALENDAR_API_KEY to .env.local
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="border border-border/60 rounded-lg p-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Loading calendar...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-border/60 rounded-lg p-6">
        <div className="text-sm text-muted-foreground">
          Calendar unavailable. {error}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border/60 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
          This week
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming events this week.</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([day, dayEvents]) => (
            <div key={day}>
              <div className="text-xs uppercase tracking-[0.1em] text-muted-foreground mb-2 font-medium">
                {day}
              </div>
              <div className="space-y-1">
                {dayEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0"
                  >
                    <div className="flex items-center gap-1.5 min-w-[5rem] text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      {formatTime(ev)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">{ev.summary}</div>
                      {ev.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {ev.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
