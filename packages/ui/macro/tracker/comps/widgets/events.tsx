import { TableCellDateElement } from "@/components/compound/table/components/shared";
import {
  eventIndex,
  filterIran,
  minutes,
  timeIndex,
  totalTimeIndex,
} from "@/components/macro/tracker";
import { actionButtonClassNames } from "@/components/macro/tracker/utils/classes";
import { makeTimes } from "@/components/macro/tracker/utils/remap";
import {
  TrackerEvent,
  TrackerState,
} from "@/components/macro/tracker/utils/types";
import Badge from "@/components/micro/badge/badge";
import ColorField, { colors, getColor } from "@/components/micro/badge/color";
import { Divider } from "@/components/micro/divider";
import {
  timeHourClear,
  timeSecondClear,
} from "@/components/micro/inputs/date/utils/dateFormatPersian";
import PlateField from "@/features/traffic/comps/table/comps/body/plate";
import { classNames } from "@/utils";
import { words } from "@/utils/words";
import { isWithinIran } from "@/utils/geographic";
import { useSignals } from "@preact/signals-react/runtime";
import { ArrowDown2, ArrowUp2, RouteSquare } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

export default function TracksPanel() {
  useSignals();
  const { getValues } = useFormContext<TrackerState>();
  const timeline = getValues("totalTimes") || [];
  const events = getValues("events");
  const [open, setOpen] = useState(true);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const times = minutes.value;

  useEffect(() => {
    virtuoso.current?.scrollToIndex({
      index: eventIndex.value,
      align: "center",
      behavior: "smooth",
    });
  }, [eventIndex.value]);

  function findTotalTimeIndex(time: number) {
    if (!timeline?.length) return undefined;
    const eventDay = timeHourClear(time).getTime();
    const index = timeline.findIndex((x) => {
      return (
        x === time ||
        timeSecondClear(x).getTime() === timeSecondClear(time).getTime() ||
        timeHourClear(x).getTime() === eventDay
      );
    });
    if (index >= 0) return index;
    // totalTimes from breakTimes excludes the end date, so events on the last day don't match
    const lastDay = timeHourClear(timeline[timeline.length - 1]).getTime();
    if (eventDay >= lastDay) return timeline.length - 1;
    const firstDay = timeHourClear(timeline[0]).getTime();
    if (eventDay <= firstDay) return 0;
    return undefined;
  }

  function handleEventClick(event: TrackerEvent, EventIndex: number) {
    if (!event) return;
    const currentTotalTimeIndex = findTotalTimeIndex(event.time);

    if (currentTotalTimeIndex !== undefined && currentTotalTimeIndex >= 0) {
      if (totalTimeIndex.value === currentTotalTimeIndex) {
        const sameDayIdx = times.filter((x) => x <= event.time).length - 1;
        timeIndex.value = sameDayIdx >= 0 ? sameDayIdx : 0;
        eventIndex.value = EventIndex;
        return;
      }
      const newCurrentDay = timeline[currentTotalTimeIndex];
      let newNextDay = timeline[currentTotalTimeIndex + 1];
      // totalTimes excludes end date, so last day has no next entry; use current day + 24h for makeTimes
      if (newNextDay == null) {
        newNextDay = newCurrentDay + 24 * 60 * 60 * 1000;
      }
      const newTimes = makeTimes([newCurrentDay, newNextDay]);
      const newTimeIdx = newTimes.filter((x) => x <= event.time).length - 1;
      // Set minutes first so total-timeline/player effects see correct times and don't overwrite timeIndex/eventIndex
      minutes.value = newTimes;
      totalTimeIndex.value = currentTotalTimeIndex;
      timeIndex.value =
        newTimeIdx >= 0 ? Math.min(newTimeIdx, newTimes.length - 1) : 0;
      eventIndex.value = EventIndex;
    }
  }

  function toEvent(position: "last" | "first" | "next" | "prev") {
    if (!events?.length) return;
    switch (position) {
      case "last":
        handleEventClick(events[events.length - 1], events.length - 1);
        break;
      case "first":
        handleEventClick(events[0], 0);
        break;
      case "next":
        handleEventClick(events[eventIndex.value + 1], eventIndex.value + 1);
        break;
      case "prev":
        handleEventClick(events[eventIndex.value - 1], eventIndex.value - 1);
        break;
    }
  }

  return (
    <div className="flex w-80 animate-fade flex-col rounded-md bg-gray-50 p-2 animate-duration-300 dir-rtl">
      <div
        id="header"
        className="flex h-10 w-full items-center justify-between"
      >
        <div className="text-primary-500 flex gap-2">
          <RouteSquare />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              رهگیری موقعیت‌‌ها بر روی نقشه
            </span>
            <span className="text-xs font-semibold text-gray-500">
              بر اساس شماره پلاک
            </span>
          </div>
        </div>
        <div
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200"
          onClick={() => setOpen((x) => !x)}
        >
          {open ? (
            <ArrowUp2 className="w-5 text-gray-500" />
          ) : (
            <ArrowDown2 className="w-5 text-gray-500" />
          )}
        </div>
      </div>
      <div
        className="w-full overflow-x-hidden overflow-y-auto transition-all"
        style={{ height: open ? "auto" : 0 }}
      >
        <Divider className="my-2" />
        <div className="flex h-60 w-full flex-col overflow-y-auto">
          <Virtuoso
            ref={virtuoso}
            data={events}
            style={{ height: 300 }}
            initialTopMostItemIndex={{
              index:
                eventIndex !== undefined && eventIndex.value >= 0
                  ? eventIndex.value
                  : 0,
              align: "center",
            }}
            itemContent={(index, event) => {
              return (
                <div
                  key={index}
                  className={classNames(
                    "group my-2 me-2 flex cursor-pointer gap-4 rounded-lg p-2 transition-all select-none hover:bg-gray-200",
                    {
                      "bg-gray-200": eventIndex.value === index,
                    },
                  )}
                  onClick={() => handleEventClick(event, index)}
                >
                  <div className="flex min-w-10 items-start justify-center">
                    <div className="flex size-10 items-center justify-center rounded-md border bg-gray-100 font-semibold transition-all group-hover:bg-gray-500 group-hover:text-gray-50">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-2 text-nowrap">
                    <div className="-ms-6 -mb-2 flex scale-75 items-center gap-2">
                      <PlateField value={event.plate} />
                      <ColorField color={getColor(colors[event.trackIndex])} />
                      {!filterIran.value &&
                        event.latLng?.length >= 2 &&
                        !isWithinIran(event.latLng[0], event.latLng[1]) && (
                          <Badge
                            severity="danger"
                            size="xs"
                            variant="wide"
                            className="h-5 px-1.5 text-[10px]"
                          >
                            {words.OUTSIDE_IRAN}
                          </Badge>
                        )}
                    </div>
                    {event.road && (
                      <div className="text-sm font-semibold">{event.road}</div>
                    )}
                    <div className="flex gap-1 text-xs font-semibold text-gray-500">
                      <span>تاریخ: </span>
                      <DateElement
                        val={event.time}
                        className="[&_span]:w-auto"
                      />
                    </div>
                    {event.province && (
                      <div className="text-xs font-semibold">
                        استان: {event.province}
                      </div>
                    )}
                  </div>
                </div>
              );
            }}
          />
        </div>
        <Divider className="my-2" />
        <div className="flex h-10 w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={actionButtonClassNames}
              onClick={() => toEvent("last")}
            >
              <ArrowDown2
                variant="Bold"
                size={20}
                className="-rotate-90 text-gray-500"
              />
              <ArrowDown2
                variant="Bold"
                size={20}
                className="-ms-3.5 -rotate-90 text-gray-500"
              />
            </div>
            <div
              className={actionButtonClassNames}
              onClick={() => toEvent("next")}
            >
              <ArrowDown2
                variant="Bold"
                size={20}
                className="-rotate-90 text-gray-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={actionButtonClassNames}
              onClick={() => toEvent("prev")}
            >
              <ArrowDown2
                variant="Bold"
                size={20}
                className="rotate-90 text-gray-500"
              />
            </div>
            <div
              className={actionButtonClassNames}
              onClick={() => toEvent("first")}
            >
              <ArrowDown2
                variant="Bold"
                size={20}
                className="rotate-90 text-gray-500"
              />
              <ArrowDown2
                variant="Bold"
                size={20}
                className="-ms-3.5 rotate-90 text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
