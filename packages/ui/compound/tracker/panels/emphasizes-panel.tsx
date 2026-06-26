"use client";

import { PERSIAN_LOCALE } from "@/lib";
import { useTrackerStore } from "@/components/compound/tracker/store/hooks";
import { findTotalTimeIndex } from "@/components/compound/tracker/store/selectors";
import { makeTimes } from "@/components/compound/tracker/data/remap";
import type { EmphasizesPanelConfig } from "@/components/compound/tracker/types/input";
import type { Emphasize } from "@/components/compound/tracker/types/input";

export default function EmphasizesPanel({ config }: { config?: EmphasizesPanelConfig | true }) {
  const emphasizes = useTrackerStore((s) => s.emphasizes);
  const events = useTrackerStore((s) => s.events);
  const totalTimes = useTrackerStore((s) => s.totalTimes);
  const setTotalTimeIndex = useTrackerStore((s) => s.setTotalTimeIndex);
  const setTimeIndex = useTrackerStore((s) => s.setTimeIndex);
  const setMinutes = useTrackerStore((s) => s.setMinutes);
  const setActiveEventIndex = useTrackerStore((s) => s.setActiveEventIndex);
  const open = useTrackerStore((s) => s.emphasizesPanelOpen);
  const setOpen = useTrackerStore((s) => s.setEmphasizesPanelOpen);
  const panelConfig = config === true ? {} : config;

  if (!emphasizes.length) return null;

  function handleClick(item: Emphasize) {
    const eventIndex = events.findIndex((x) => x.time >= item.startTime && x.time < item.endTime);
    const event = events[eventIndex];
    if (!event) return;
    const dayIndex = findTotalTimeIndex(totalTimes, event.time);
    if (dayIndex == null) return;
    const dayEnd = totalTimes[dayIndex + 1] ?? totalTimes[dayIndex] + 86400000;
    const newMinutes = makeTimes([totalTimes[dayIndex], dayEnd]);
    setMinutes(newMinutes);
    setTotalTimeIndex(dayIndex);
    setTimeIndex(Math.max(0, newMinutes.findIndex((t) => t === event.time)));
    setActiveEventIndex(eventIndex);
  }

  return (
    <div className="bg-background dir-rtl flex w-80 flex-col rounded-md border p-2 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{panelConfig?.title ?? "Emphasizes"}</div>
          {panelConfig?.subtitle && (
            <div className="text-muted-foreground text-xs">{panelConfig.subtitle}</div>
          )}
        </div>
        <button type="button" className="text-xs" onClick={() => setOpen(!open)}>
          {open ? "Hide" : "Show"}
        </button>
      </div>
      {open && (
        <div className="mt-2 max-h-60 overflow-y-auto">
          {panelConfig?.listTitle && <div className="mb-2 font-semibold">{panelConfig.listTitle}</div>}
          {emphasizes.map((item, index) => (
            <button
              key={index}
              type="button"
              className="hover:bg-muted mb-1 flex w-full gap-2 rounded-md p-2 text-start"
              onClick={() => handleClick(item)}
            >
              <span className="bg-muted flex size-8 items-center justify-center rounded-md border text-xs">
                {index + 1}
              </span>
              <span className="flex flex-col text-xs">
                <span>{item.title ?? item.latLng.join(", ")}</span>
                <span className="text-muted-foreground dir-ltr">
                  {Intl.DateTimeFormat(PERSIAN_LOCALE, { dateStyle: "short", timeStyle: "short" }).format(item.startTime)}
                  {" – "}
                  {Intl.DateTimeFormat(PERSIAN_LOCALE, { dateStyle: "short", timeStyle: "short" }).format(item.endTime)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
