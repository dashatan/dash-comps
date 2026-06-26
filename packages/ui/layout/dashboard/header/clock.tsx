import {
  formatPersianDate,
  createDate,
  formatPersianTime,
  cn,
} from "@dash/core";
import { useEffect, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";

export default function Clock() {
  const [now, setNow] = useState(() => createDate().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(createDate().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
        <span>{formatPersianDate(now)}</span>
        <CalendarDays size={16} />
      </div>
      <div className="flex items-center gap-4">
        <Time time={now} />
        <Clock3 size={16} />
      </div>
    </div>
  );
}

function Time({ time }: { time: number }) {
  return <span>{formatPersianTime(time)}</span>;
}
