import { TableCellDateElement as DateElement } from '@/components/compound/table/components/shared'
import {
  eventIndex,
  minutes,
  timeIndex,
  totalTimeIndex,
} from "@/components/macro/tracker";
import { makeTimes } from "@/components/macro/tracker/utils/remap";
import { Emphasize, TrackerState } from "@/components/macro/tracker/utils/types";
import { Divider } from "@/components/micro/divider";
import {
  timeHourClear,
  timeSecondClear,
} from "@/components/micro/inputs/date/utils/dateFormatPersian";
import { ArrowDown2, ArrowUp2 } from "iconsax-reactjs";
import { ReactNode, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Virtuoso } from "react-virtuoso";

export type EmphasizesPanelProps = {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  countTitle?: (count: number) => string;
  listTitle?: string;
};

export default function EmphasizesPanel(props: EmphasizesPanelProps) {
  const { getValues } = useFormContext<TrackerState>();
  const emphasizes = getValues("emphasizes") || [];
  const timeline = getValues("totalTimes") || [];
  const events = getValues("events") || [];
  const times = minutes.value;
  const [open, setOpen] = useState(false);

  function findTotalTimeIndex(time: number) {
    const index = timeline?.findIndex((x) => {
      const date = x;
      return (
        date === time ||
        timeSecondClear(date).getTime() === timeSecondClear(time).getTime() ||
        timeHourClear(date).getTime() === timeHourClear(time).getTime()
      );
    });
    if (index && index >= 0) return index;
  }

  function handleEventClick(item: Emphasize, emphasizeIndex: number) {
    if (!item) return;
    const EventIndex = events.findIndex(
      (x) => x.time >= item.startTime && x.time < item.endTime,
    );
    const event = events[EventIndex];
    if (!event) return;
    const index = findTotalTimeIndex(event.time);
    if (index) {
      if (totalTimeIndex.value === index) {
        timeIndex.value = times.findIndex((x) => x === event.time);
        eventIndex.value = EventIndex;
        return;
      }
      const newCurrentDay = timeline[index];
      const newNextDay = timeline[index + 1];
      const newTimes = makeTimes([newCurrentDay, newNextDay]);
      totalTimeIndex.value = index;
      timeIndex.value = newTimes.findIndex((x) => x === event.time);
      eventIndex.value = EventIndex;
    }
  }

  return (
    <div className="animate-fade animate-duration-300 dir-rtl flex w-80 flex-col rounded-md bg-gray-50 p-2">
      <div id="header" className="flex h-10 w-full items-center justify-between">
        <div className="text-primary-500 flex gap-2">
          {props.icon}
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{props.title}</span>
            <span className="text-xs font-semibold text-gray-500">{props.subtitle}</span>
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
        <Divider />
        <div className="px-4 pb-2 text-sm font-semibold">{props.listTitle}</div>
        <div className="flex h-60 w-full flex-col overflow-y-auto">
          <Virtuoso
            data={emphasizes}
            style={{ height: 300 }}
            itemContent={(index, emphasize) => {
              return (
                <div
                  key={index}
                  className="group flex cursor-pointer gap-4 rounded-lg p-2 transition-all hover:bg-gray-200"
                  onClick={() => handleEventClick(emphasize, index)}
                >
                  <div className="flex min-w-10 items-start justify-center">
                    <div className="flex size-10 items-center justify-center rounded-md border bg-gray-100 font-semibold transition-all group-hover:bg-gray-500 group-hover:text-gray-50">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-1 text-nowrap">
                    <div className="text-xs font-semibold">
                      {emphasize.title || emphasize.latLng.join(" _ ")}
                    </div>
                    <div className="text-2xs flex gap-1 font-semibold text-gray-500">
                      <span>از تاریخ: </span>
                      <DateElement val={emphasize.startTime} />
                    </div>
                    <div className="text-2xs flex gap-2 font-semibold text-gray-500">
                      <span>تا تاریخ: </span>
                      <DateElement val={emphasize.endTime} />
                    </div>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
