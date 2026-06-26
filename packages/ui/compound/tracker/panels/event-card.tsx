"use client";

import { cn, PERSIAN_LOCALE } from "@/lib";
import { ChevronDown } from "lucide-react";
import type { NormalizedEvent } from "@/components/compound/tracker/types";

type EventCardProps = {
  event: NormalizedEvent;
  index: number;
  isActive?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  onToggle?: () => void;
  eventImage?: React.ReactNode;
};

export default function EventCard({
  event,
  index,
  isActive,
  isOpen,
  onClick,
  onToggle,
  eventImage,
}: EventCardProps) {
  return (
    <div
      className={cn("cursor-pointer rounded-md border bg-card p-3 text-sm", {
        "ring-2 ring-primary": isActive,
        "border-destructive": event.error,
        "border-warning": event.miss && !event.error,
      })}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium">{event.name ?? `#${index + 1}`}</span>
        <span className="ms-auto text-xs text-muted-foreground dir-ltr">
          {Intl.DateTimeFormat(PERSIAN_LOCALE, {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(event.time))}
        </span>
        <button
          type="button"
          className="rounded border border-border p-1"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
        >
          <ChevronDown
            className={cn("size-3 transition", { "rotate-180": isOpen })}
          />
        </button>
      </div>
      {isOpen && (
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          {event.province && (
            <div>
              <span className="text-muted-foreground">Province: </span>
              {event.province}
            </div>
          )}
          {event.road && (
            <div>
              <span className="text-muted-foreground">Road: </span>
              {event.road}
            </div>
          )}
          {event.speed != null && (
            <div>
              <span className="text-muted-foreground">Speed: </span>
              <span className="dir-ltr">{event.speed} km/h</span>
            </div>
          )}
          {event.crimes?.length ? (
            <div className="col-span-2">
              <span className="text-muted-foreground">Violations: </span>
              {event.crimes.join(", ")}
            </div>
          ) : null}
          {eventImage}
        </div>
      )}
    </div>
  );
}
