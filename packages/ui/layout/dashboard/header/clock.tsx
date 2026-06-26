import {
  formatPersianDate,
  createDate,
  formatPersianTime,
  cn,
  useLanguage,
} from "@dash/core";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";

function getClockLocale(language: string): string {
  switch (language) {
    case "fa":
      return "fa-IR-u-nu-latn";
    case "ar":
      return "ar-SA";
    default:
      return "en-GB";
  }
}

function formatClockDate(timestamp: number, language: string): string {
  if (language === "fa") {
    return formatPersianDate(timestamp, {
      yearFormat: "numeric",
      monthFormat: "numeric",
      dayFormat: "numeric",
    });
  }

  return new Intl.DateTimeFormat(getClockLocale(language), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(timestamp);
}

function formatClockTime(timestamp: number, language: string): string {
  if (language === "fa") {
    return formatPersianTime(timestamp);
  }

  return new Intl.DateTimeFormat(getClockLocale(language), {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(timestamp);
}

export default function Clock() {
  const { language } = useLanguage();
  const [now, setNow] = useState(() => createDate().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(createDate().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedDate = useMemo(
    () => formatClockDate(now, language),
    [now, language],
  );
  const formattedTime = useMemo(
    () => formatClockTime(now, language),
    [now, language],
  );

  return (
    <div
      className={cn(
        "flex min-w-28 flex-col items-end justify-center px-2 py-1",
        "cursor-default gap-1 rounded-md text-xs font-semibold",
        "border-2 bg-sidebar text-sidebar-foreground",
        "hidden sm:flex",
      )}
    >
      <div className="flex items-center gap-4">
        <span>{formattedDate}</span>
        <CalendarDays size={16} />
      </div>
      <div className="flex items-center gap-4">
        <span>{formattedTime}</span>
        <Clock3 size={16} />
      </div>
    </div>
  );
}
