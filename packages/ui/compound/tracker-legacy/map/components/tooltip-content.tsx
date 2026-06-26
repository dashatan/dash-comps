import React from "react";
import { Event } from "../../types";
import { cn, Translation } from "@/lib";
import {
  TRACKER_TOOLTIP_ICONS,
  type TrackerTooltipIcon,
} from "@/components/compound/tracker-legacy/map/components/tracker-tooltip-icons";

interface TooltipContentProps {
  event: Event;
  events: Event[];
  t: Translation;
  locale: string;
}

interface DeviceEventItemProps {
  event: Event;
  activeEvent: Event;
  index: number;
  showIndex: boolean;
  locale: string;
  t: Translation;
}

function TooltipIcon({
  icon,
  className,
}: {
  icon: TrackerTooltipIcon;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-muted-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: TRACKER_TOOLTIP_ICONS[icon] }}
      aria-hidden
    />
  );
}

function formatEventDate(timestamp: number, locale: string): string {
  return Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  }).format(timestamp);
}

function isSameEvent(a: Event, b: Event): boolean {
  return a.id === b.id && a.time === b.time && a.deviceId === b.deviceId;
}

function EventStatusBadge({ event, t }: { event: Event; t: Translation }) {
  if (event.error) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-error/15 px-2 py-0.5 text-[10px] font-medium text-error">
        <TooltipIcon icon="violation" className="size-3 text-error" />
        {t("common.hasViolation")}
      </span>
    );
  }

  if (event.miss) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-medium text-warning">
        <TooltipIcon icon="alert" className="size-3 text-warning" />
        {t("common.noObserve")}
      </span>
    );
  }

  return null;
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: TrackerTooltipIcon;
  label: string;
  value: string;
}) {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2 text-xs">
      <TooltipIcon icon={icon} />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

const DeviceEventItem: React.FC<DeviceEventItemProps> = ({
  event,
  activeEvent,
  index,
  showIndex,
  locale,
  t,
}) => {
  const isActive = isSameEvent(event, activeEvent);
  const formattedDate = formatEventDate(event.time, locale);

  return (
    <div
      className={cn("flex w-full flex-col gap-1 rounded-md border p-2", {
        "border-primary/40 bg-primary/10 ring-1 ring-primary/20": isActive,
        "border-error/30 bg-error/10": !isActive && event.error,
        "border-warning/30 bg-warning/10":
          !isActive && event.miss && !event.error,
        "border-border/60 bg-muted/40":
          !isActive && !event.error && !event.miss,
      })}
    >
      <div className="flex items-center gap-2">
        {showIndex && (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-background text-[10px] font-semibold text-muted-foreground">
            {index + 1}
          </span>
        )}
        <span className="truncate text-xs font-medium text-foreground">
          {event.name}
        </span>
        <EventStatusBadge event={event} t={t} />
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center gap-x-3 gap-y-1",
          showIndex ? "ps-7" : "",
        )}
      >
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground dir-ltr">
          <TooltipIcon icon="calendar" className="size-3" />
          {formattedDate}
        </span>
        {!event.miss && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground dir-ltr">
            <TooltipIcon icon="speed" className="size-3" />
            {event.speed} km/h
          </span>
        )}
      </div>

      {event.crimes?.length > 0 && (
        <div className={cn("text-[11px] text-error", showIndex ? "ps-7" : "")}>
          <span className="text-muted-foreground">
            {t("common.violations")}:{" "}
          </span>
          {event.crimes.join(", ")}
        </div>
      )}
    </div>
  );
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
  event,
  events,
  t,
  locale,
}) => {
  const deviceEvents = events.filter((e) => e.deviceId === event.deviceId);
  const showIndex = deviceEvents.length > 1;

  return (
    <div className="flex w-72 max-w-[min(20rem,calc(100vw-2rem))] animate-in flex-col gap-3 rounded-lg border border-border bg-card p-3 font-family text-xs text-card-foreground shadow-lg duration-200 ease-out fade-in-15 slide-in-from-top-5">
      <div className="flex flex-col gap-3 border-b border-border pb-3">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <TooltipIcon
              icon="camera"
              className="size-5 text-primary [&>svg]:size-5"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate text-sm font-semibold text-foreground">
              {event.name || ""}
            </span>
            <EventStatusBadge event={event} t={t} />
          </div>
        </div>

        <div className="grid gap-1.5">
          <MetaRow
            icon="mapPin"
            label={t("common.province")}
            value={event.province}
          />
          <MetaRow icon="road" label={t("common.road")} value={event.road} />
          {!event.miss && (
            <MetaRow
              icon="speed"
              label={t("common.speed")}
              value={`${event.speed} km/h`}
            />
          )}
        </div>

        {event.crimes?.length > 0 && (
          <div className="flex items-start gap-2 rounded-md bg-error/10 p-2 text-[11px] text-error">
            <TooltipIcon
              icon="violation"
              className="mt-0.5 shrink-0 text-error"
            />
            <div>
              <span className="font-medium">{t("common.violations")}: </span>
              {event.crimes.join(", ")}
            </div>
          </div>
        )}
      </div>

      {deviceEvents.length > 0 && (
        <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
          {deviceEvents.map((deviceEvent, index) => (
            <DeviceEventItem
              key={`${deviceEvent.deviceId}-${deviceEvent.time}-${index}`}
              event={deviceEvent}
              activeEvent={event}
              index={index}
              showIndex={showIndex}
              locale={locale}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
};
