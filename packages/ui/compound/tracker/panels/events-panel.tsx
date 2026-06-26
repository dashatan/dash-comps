"use client";

import { cn, PERSIAN_LOCALE } from "@/lib";
import Badge from "@/components/common/badge/badge";
import ColorField, { colors, getColor } from "@/components/common/badge/color";
import {
  useActiveEventIndex,
  usePanelEvents,
  useResolvedOptions,
  useTrackerStore,
} from "@/components/compound/tracker/store/hooks";
import { findTotalTimeIndex } from "@/components/compound/tracker/store/selectors";
import { makeTimes } from "@/components/compound/tracker/data/remap";
import { isWithinIran } from "@/components/compound/tracker/utils/geo";
import EventCard from "@/components/compound/tracker/panels/event-card";
import type { TrackerSlots } from "@/components/compound/tracker/types";
import type { NormalizedEvent } from "@/components/compound/tracker/types/normalized";
import { SkipBack, SkipForward, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import type { PlateInputValue } from "@/components/compound/tracker/types/input";

function formatPlate(plate?: PlateInputValue) {
  if (!plate) return "—";
  return [plate.p1, plate.p2, plate.p3, plate.p4].filter(Boolean).join(" ");
}

export default function EventsPanel({ slots }: { slots?: TrackerSlots }) {
  const options = useResolvedOptions();
  const variant = options.panels.events;
  const events = usePanelEvents();
  const allEvents = useTrackerStore((s) => s.events);
  const activeEventIndex = useActiveEventIndex();
  const setActiveEventIndex = useTrackerStore((s) => s.setActiveEventIndex);
  const incrementActiveEventIndex = useTrackerStore((s) => s.incrementActiveEventIndex);
  const decrementActiveEventIndex = useTrackerStore((s) => s.decrementActiveEventIndex);
  const totalTimes = useTrackerStore((s) => s.totalTimes);
  const setTotalTimeIndex = useTrackerStore((s) => s.setTotalTimeIndex);
  const setTimeIndex = useTrackerStore((s) => s.setTimeIndex);
  const setMinutes = useTrackerStore((s) => s.setMinutes);
  const showOutsideIranBadge = options.geo.showOutsideIranBadge;
  const filterIran = useTrackerStore((s) => s.filterIran);
  const open = useTrackerStore((s) => s.eventsPanelOpen);
  const setOpen = useTrackerStore((s) => s.setEventsPanelOpen);
  const openCardIndex = useTrackerStore((s) => s.openCardIndex);
  const setOpenCardIndex = useTrackerStore((s) => s.setOpenCardIndex);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const lastScrolledIndex = useRef<number | null>(null);

  const panelActiveIndex = useMemo(() => {
    const activeEvent = allEvents[activeEventIndex];
    if (!activeEvent) return 0;
    const index = events.findIndex((event) => event === activeEvent);
    return index >= 0 ? index : 0;
  }, [activeEventIndex, allEvents, events]);

  const navigateToEvent = useCallback(
    (index: number) => {
      const event = allEvents[index];
      if (!event) return;
      const dayIndex = findTotalTimeIndex(totalTimes, event.time);
      if (dayIndex != null) {
        const dayEnd = totalTimes[dayIndex + 1] ?? totalTimes[dayIndex] + 86400000;
        const newMinutes = makeTimes([totalTimes[dayIndex], dayEnd]);
        setMinutes(newMinutes);
        setTotalTimeIndex(dayIndex);
        const timeIdx = newMinutes.filter((t) => t <= event.time).length - 1;
        setTimeIndex(Math.max(0, timeIdx));
      }
      setActiveEventIndex(index);
    },
    [allEvents, setActiveEventIndex, setMinutes, setTimeIndex, setTotalTimeIndex, totalTimes],
  );

  useEffect(() => {
    lastScrolledIndex.current = null;
  }, [events, filterIran]);

  useEffect(() => {
    if (!options.panels.eventNavigation.scrollSync || !open || !events.length) return;
    if (lastScrolledIndex.current === panelActiveIndex) return;
    lastScrolledIndex.current = panelActiveIndex;
    virtuoso.current?.scrollToIndex({
      index: panelActiveIndex,
      align: "center",
      behavior: "smooth",
    });
  }, [panelActiveIndex, open, events.length, options.panels.eventNavigation.scrollSync]);

  const renderFleetRow = useCallback(
    (index: number, event: NormalizedEvent) => {
      const originalIndex = allEvents.indexOf(event);
      const outside =
        !filterIran && showOutsideIranBadge && !isWithinIran(event.latlng[0], event.latlng[1]);
      return (
        <div
          className={cn(
            "hover:bg-muted mb-2 flex cursor-pointer gap-3 rounded-lg p-2",
            originalIndex === activeEventIndex && "bg-muted",
          )}
          onClick={() => navigateToEvent(originalIndex >= 0 ? originalIndex : index)}
        >
          <div className="bg-background flex size-8 items-center justify-center rounded-md border text-xs font-semibold">
            {index + 1}
          </div>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <span>{formatPlate(event.plate)}</span>
              {event.trackIndex != null && <ColorField color={getColor(colors[event.trackIndex])} />}
              {outside && (
                <Badge severity="danger" size="xs">
                  Outside Iran
                </Badge>
              )}
            </div>
            {event.road && <span className="font-semibold">{event.road}</span>}
            <span className="text-muted-foreground dir-ltr">
              {Intl.DateTimeFormat(PERSIAN_LOCALE, { dateStyle: "short", timeStyle: "short" }).format(
                new Date(event.time),
              )}
            </span>
          </div>
        </div>
      );
    },
    [activeEventIndex, allEvents, filterIran, navigateToEvent, showOutsideIranBadge],
  );

  const renderObserveRow = useCallback(
    (index: number, event: NormalizedEvent) => {
      const originalIndex = allEvents.indexOf(event);
      const idx = originalIndex >= 0 ? originalIndex : index;
      const isNewDay =
        index === 0 ||
        new Date(event.time).toDateString() !== new Date(events[index - 1].time).toDateString();
      return (
        <div className="p-1">
          {isNewDay && (
            <div className="text-muted-foreground mb-2 border-b border-dashed pb-1 text-xs">
              {Intl.DateTimeFormat(PERSIAN_LOCALE, { weekday: "long" }).format(new Date(event.time))}
              {" · "}
              {Intl.DateTimeFormat(PERSIAN_LOCALE, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              }).format(new Date(event.time))}
            </div>
          )}
          <EventCard
            index={idx}
            event={event}
            isActive={idx === activeEventIndex}
            isOpen={openCardIndex === idx}
            onClick={() => navigateToEvent(idx)}
            onToggle={() => setOpenCardIndex(openCardIndex === idx ? null : idx)}
            eventImage={slots?.eventImage?.({ index: idx, event })}
          />
        </div>
      );
    },
    [activeEventIndex, allEvents, events, navigateToEvent, openCardIndex, setOpenCardIndex, slots],
  );

  const itemContent = useCallback(
    (index: number, event: NormalizedEvent) => {
      if (variant === "fleet") return renderFleetRow(index, event);
      return renderObserveRow(index, event);
    },
    [renderFleetRow, renderObserveRow, variant],
  );

  if (!variant) return null;

  return (
    <div className="bg-background dir-rtl flex w-80 flex-col rounded-md border p-2">
      <div className="flex items-center justify-between pb-2">
        <span className="text-sm font-semibold">Events</span>
        <button type="button" className="text-xs" onClick={() => setOpen(!open)}>
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && (
        <>
          <Virtuoso
            ref={virtuoso}
            style={{ height: 280 }}
            data={events}
            initialTopMostItemIndex={{ index: panelActiveIndex, align: "center" }}
            itemContent={itemContent}
          />
          {options.panels.eventNavigation.prevNext && (
            <div className="dir-ltr mt-2 flex justify-between gap-2 border-t pt-2">
              {options.panels.eventNavigation.firstLast && (
                <NavBtn onClick={() => navigateToEvent(0)}>
                  <ChevronsLeft className="size-4" />
                </NavBtn>
              )}
              <NavBtn onClick={() => decrementActiveEventIndex()}>
                <SkipBack className="size-4" />
              </NavBtn>
              <NavBtn onClick={() => incrementActiveEventIndex()}>
                <SkipForward className="size-4" />
              </NavBtn>
              {options.panels.eventNavigation.firstLast && (
                <NavBtn onClick={() => navigateToEvent(allEvents.length - 1)}>
                  <ChevronsRight className="size-4" />
                </NavBtn>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NavBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      className="border-border bg-card hover:bg-muted flex size-9 items-center justify-center rounded-md border"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
