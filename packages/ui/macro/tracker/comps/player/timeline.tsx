import { Slider } from "@/components/micro/slider";
import { classNames } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { PERSIAN_LOCALE, TEHRAN_TZ } from "@/components/micro/inputs/date/utils/dateFormatPersian";
import { useFormContext } from "react-hook-form";
import { TrackerState } from "@/components/macro/tracker/utils/types";
import { useResizeDetector } from "react-resize-detector";
import { calculateEvenlySpacedItems } from "@/components/macro/tracker/utils";
import { colors, getColor } from "@/components/micro/badge/color";
import { colorWords } from "@/utils/wordMap";
import { timeIndex, totalTimeIndex, eventIndex as EventIndex, minutes, filterIran } from "@/components/macro/tracker";
import { useSignals } from "@preact/signals-react/runtime";
import { makeTimes } from "@/components/macro/tracker/utils/remap";
import { isWithinIran } from "@/utils/geographic";

export default function TrackerTimeLine() {
  useSignals();
  const { getValues } = useFormContext<TrackerState>();
  const container = useResizeDetector();
  const timeline = getValues("totalTimes") || [];
  const tracksWithEvents = getValues("tracksWithEvents");
  const emphasizes = getValues("emphasizes");
  const events = getValues("events");
  const [index, setIndex] = useState(timeIndex.value);

  const today = timeline[totalTimeIndex.value];
  let nextDay = timeline[totalTimeIndex.value + 1];
  // totalTimes from breakTimes excludes end date; last index has no next — use current day + 24h
  if (nextDay == null && today != null) {
    nextDay = today + 24 * 60 * 60 * 1000;
  }

  const times = useMemo(() => {
    if (today == null || nextDay == null) return [];
    const newTimes = makeTimes([today, nextDay]);
    minutes.value = newTimes;
    return newTimes;
  }, [today, nextDay]);

  const currentTime = times[timeIndex.value];

  const containerWidth = container.width || 0;
  const thumbWidth = 12;
  const tickWidth = useMemo(() => (containerWidth - 16) / times.length, [containerWidth, times.length]);

  const evenlySpacedTimes = useMemo(() => calculateEvenlySpacedItems(times, containerWidth, 70), [containerWidth]);

  useEffect(() => {
    if (timeIndex.value === index) return;
    setIndex(timeIndex.value);
  }, [timeIndex.value]);

  useEffect(() => {
    timeIndex.value = index;
  }, [index]);

  useEffect(() => {
    const count = events?.filter((x) => x.time <= currentTime).length ?? 0;
    const index = count > 0 ? count - 1 : 0;
    if (index >= 0) {
      // When multiple events share the same time, preserve user selection (don't jump to last of group)
      const currentEventTime = events?.[EventIndex.value]?.time;
      if (currentEventTime === currentTime) return;
      EventIndex.value = index;
    }
  }, [currentTime]);

  function handleChange(index: number) {
    setIndex(index);
  }

  // TODO: Add a way to add events
  const renderEvents = useMemo(() => {
    return (
      <div className="flex flex-col px-2" style={{ width: container.width }}>
        {tracksWithEvents?.map((track, i) => {
          const color = getColor(colors[i]);
          const tt = times?.map((time, j) => {
            const event = track.events.find((x) => x.time === time);
            const emphasize = emphasizes?.find((x) => x.startTime <= time && x.endTime > time);
            const hasEvent = !!event;
            const hasEmphasize = !!emphasize;
            const outsideIran =
              !filterIran.value &&
              hasEvent &&
              event.latLng?.length >= 2 &&
              !isWithinIran(event.latLng[0], event.latLng[1]);
            return (
              <div key={j} className="relative flex w-full items-center justify-center">
                <div
                  className={classNames("h-1", eventClasses({ color, hasEvent, outsideIran }))}
                  style={{ width: tickWidth }}
                ></div>
                {hasEmphasize && (
                  <div
                    className={classNames(
                      "h-full bg-primary-500 opacity-10",
                      eventClasses({ color, hasEvent: true, outsideIran }),
                    )}
                    style={{ width: tickWidth / 10 }}
                  ></div>
                )}
              </div>
            );
          });

          return (
            <div key={i} className="relative mt-0.5 flex h-12 w-full border-b last:border-b-0">
              {tt}
            </div>
          );
        })}
      </div>
    );
  }, [tracksWithEvents, tickWidth, today, filterIran.value]);

  return (
    <div className="relative flex w-full flex-1 flex-col overflow-hidden px-6">
      <div className={classNames("pointer-events-auto absolute left-0 top-0 flex h-10 w-full border-y border-gray-300 bg-gray-100")}></div>
      <div ref={container.ref} className="relative flex w-full flex-1 flex-col">
        <Slider
          className="flex h-10 cursor-pointer flex-col items-start"
          trackClassName={classNames("bg-transparent h-10")}
          rangeClassName={classNames("bg-transparent h-10")}
          thumbClassName={classNames("time-slider-thumb rounded-none border-none bg-transparent p-0 flex items-start justify-center")}
          thumbProps={{
            children: (
              <div className="flex w-full flex-col items-center justify-start">
                <div className="time-slider-thumb-arrow h-5 w-4 rounded bg-primary-600"></div>
                <div className="-mt-1 w-0.5 bg-primary-600" style={{ height: `${(tracksWithEvents?.length || 0) * 60 + 24}px` }}></div>
              </div>
            ),
            style: { width: thumbWidth },
          }}
          min={0}
          max={times.length - 1}
          value={[index]}
          onValueChange={(val) => handleChange(val[0])}
        >
          <div
            className={classNames(
              "pointer-events-auto left-0 top-0 flex h-10 w-full justify-between border-y border-gray-300 bg-gray-100 font-main text-xs",
            )}
          >
            {evenlySpacedTimes?.map((x, i, a) => {
              return (
                <div key={i} className="flex h-10 flex-col items-center justify-end px-1.5" style={{ width: tickWidth }}>
                  <span>
                    {Intl.DateTimeFormat(PERSIAN_LOCALE, {
                      timeZone: TEHRAN_TZ,
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(x)}
                  </span>
                  <span className="h-2 w-px bg-gray-400"></span>
                </div>
              );
            })}
          </div>
        </Slider>
        {renderEvents}
      </div>
    </div>
  );
}

function eventClasses({
  color,
  hasEvent,
  outsideIran,
}: {
  hasEvent?: boolean;
  color?: any;
  outsideIran?: boolean;
}) {
  return {
    "bg-primary-600": hasEvent && !outsideIran,
    "bg-red-500": hasEvent && (outsideIran || color === "red" || color === colorWords.red),
    "bg-blue-500": hasEvent && !outsideIran && (color === "blue" || color === colorWords.blue),
    "bg-green-500": hasEvent && !outsideIran && (color === "green" || color === colorWords.green),
    "bg-yellow-500": hasEvent && !outsideIran && (color === "yellow" || color === colorWords.yellow),
    "bg-white": hasEvent && !outsideIran && (color === "white" || color === colorWords.white),
    "bg-gray-300":
      hasEvent && !outsideIran && (color === "gray" || color === colorWords.silver || color === undefined),
    "bg-black": hasEvent && !outsideIran && (color === "black" || color === colorWords.black),
    "bg-orange-500": hasEvent && !outsideIran && (color === "orange" || color === colorWords.orange),
    "bg-lime-500": hasEvent && !outsideIran && (color === "lime" || color === colorWords.lime),
    "bg-pink-500": hasEvent && !outsideIran && (color === "pink" || color === colorWords.pink),
    "bg-teal-500": hasEvent && !outsideIran && (color === "teal" || color === colorWords.teal),
    "bg-indigo-500": hasEvent && !outsideIran && (color === "indigo" || color === colorWords.indigo),
  };
}
