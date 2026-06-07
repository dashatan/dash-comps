import { Slider } from "@/components/micro/slider";
import { classNames } from "@/utils";
import { memo, useEffect, useMemo, useState } from "react";
import {
  PERSIAN_LOCALE,
  TEHRAN_TZ,
} from "@/components/micro/inputs/date/utils/dateFormatPersian";
import { useFormContext } from "react-hook-form";
import { TrackerState } from "@/components/macro/tracker/utils/types";
import { ArrowLeft2, ArrowRight2 } from "iconsax-reactjs";
import { actionButtonClassNames } from "@/components/macro/tracker/utils/classes";
import { useResizeDetector } from "react-resize-detector";
import { calculateEvenlySpacedItems } from "@/components/macro/tracker/utils";
import { minutes, timeIndex, totalTimeIndex } from "@/components/macro/tracker";
import { useSignals } from "@preact/signals-react/runtime";

function TrackerTotalTimeLineInner() {
  useSignals();
  const container = useResizeDetector();
  const { getValues } = useFormContext<TrackerState>();
  const events = getValues("events") || [];
  const timeline = getValues("totalTimes") || [];
  const daysWithEvent = getValues("daysWithEvent") || [];
  const [index, setIndex] = useState(0);
  const containerWidth = container.width || 0;
  const thumbWidth = 12;
  const itemWidth = 70;
  const tickWidth = useMemo(
    () => containerWidth / timeline.length,
    [timeline, containerWidth],
  );

  const evenlySpacedTimes = useMemo(
    () => calculateEvenlySpacedItems(timeline, containerWidth, itemWidth),
    [timeline, containerWidth],
  );

  const daySegments = useMemo(
    () =>
      timeline.map((_, i) => ({
        index: i,
        hasEvent: daysWithEvent.includes(i),
      })),
    [timeline, daysWithEvent],
  );
  const currentDayIndex = totalTimeIndex.value;

  useEffect(() => {
    setIndex(currentDayIndex);
    const times = minutes.value;
    const currentTime = times[timeIndex.value];
    const event = [...events].reverse().find((x) => x.time <= currentTime);
    const idx = times?.findIndex((x) => x === event?.time);
    if (idx !== undefined && idx >= 0) timeIndex.value = idx;
  }, [currentDayIndex, events]);

  useEffect(() => {
    const timer = setTimeout(() => {
      totalTimeIndex.value = index;
    }, 100);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="order-5 flex w-full flex-1 items-center justify-center gap-2">
      <div
        className={classNames(actionButtonClassNames)}
        onClick={() => {
          totalTimeIndex.value = totalTimeIndex.value - 1;
        }}
      >
        <ArrowLeft2 />
      </div>
      <div
        ref={container.ref}
        className={classNames(
          "flex-full dir-ltr relative me-auto flex h-10 flex-col overflow-hidden rounded-md border border-gray-200 bg-gray-100 px-6",
        )}
      >
        <div className="flex-full dir-ltr pointer-events-none absolute inset-x-0 inset-y-0 z-0 flex w-full">
          <div className="flex-full dir-ltr relative flex h-full">
            {daySegments.map(({ index: i, hasEvent }) => {
              return (
                <div
                  key={i}
                  className={classNames(
                    "flex-full shrink-0",
                    hasEvent ? "bg-primary-100" : "bg-transparent",
                  )}
                />
              );
            })}
          </div>
        </div>
        <Slider
          className="z-20 h-10 cursor-pointer items-start"
          trackClassName={classNames("bg-transparent")}
          rangeClassName={classNames("bg-transparent")}
          thumbClassName={classNames(
            "time-slider-thumb rounded-none border-none bg-transparent p-0 flex items-start justify-center",
          )}
          thumbProps={{
            children: (
              <div className="flex w-full flex-col items-center justify-start">
                <div className="time-slider-thumb-arrow bg-primary-600 h-5 w-4 rounded"></div>
              </div>
            ),
            style: { width: thumbWidth },
          }}
          min={0}
          max={timeline.length - 1}
          value={[index]}
          onValueChange={(val) => {
            setIndex(val[0]);
          }}
        ></Slider>

        <div
          className={classNames(
            "font-main pointer-events-auto absolute -top-0.5 flex h-10 items-end justify-between text-xs",
          )}
          style={{ width: container.width, padding: `0 ${thumbWidth / 2}px` }}
        >
          {evenlySpacedTimes.map((x, i) => {
            return (
              <div
                key={i}
                className={classNames(
                  "dir-ltr relative flex max-w-px flex-col items-center justify-end",
                )}
                style={{ width: tickWidth }}
              >
                <span>
                  {Intl.DateTimeFormat(PERSIAN_LOCALE, {
                    timeZone: TEHRAN_TZ,
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(x)}
                </span>
                <span className="h-1 w-full max-w-px bg-gray-400"></span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={classNames(actionButtonClassNames)}
        onClick={() => {
          totalTimeIndex.value = totalTimeIndex.value + 1;
        }}
      >
        <ArrowRight2 />
      </div>
    </div>
  );
}

export default memo(TrackerTotalTimeLineInner);
