import { actionButtonClassNames } from "@/components/macro/tracker/utils/classes";
import { PERSIAN_LOCALE, TEHRAN_TZ, timeHourClear, timeSecondClear } from "@/components/micro/inputs/date/utils/dateFormatPersian";
import { classNames } from "@/utils";
import { Pause, Play, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Slider } from "@/components/micro/slider";
import { useFormContext } from "react-hook-form";
import { TrackerEvent, TrackerState } from "@/components/macro/tracker/utils/types";
import TrackerTotalTimeLine from "@/components/macro/tracker/comps/player/total-timeline";
import {
  eventBasedPlay,
  eventIndex,
  minutes,
  playSpeed,
  playSpeedIncrement,
  showSettings,
  timeIndex,
  totalTimeIndex,
} from "@/components/macro/tracker";
import { useSignals } from "@preact/signals-react/runtime";
import { makeTimes } from "@/components/macro/tracker/utils/remap";

export default function TrackerControls() {
  useSignals();
  const { getValues } = useFormContext<TrackerState>();
  const timeline = getValues("totalTimes") || [];
  const events = getValues("events");
  const DateButtonRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLDivElement>(null);
  const settingButtonRef = useRef<HTMLDivElement>(null);
  const times = minutes.value;
  const activeTime = times[timeIndex.value];

  const [play, setPlay] = useState<boolean>();

  useEffect(() => {
    let i = timeIndex;
    let newEventIndex = eventIndex.value;
    const end = events?.length && eventIndex.value >= events.length;

    if (play && end) {
      setPlay(false);
      return;
    }
    if (!play) return;
    if (eventBasedPlay.value) {
      const interval = setInterval(() => {
        newEventIndex++;
        const event = events ? events[newEventIndex] : undefined;
        eventIndex.value = newEventIndex;
        handleChange(event, newEventIndex);
      }, 200 / playSpeed.value);
      return () => {
        clearInterval(interval);
      };
    } else {
      const interval = setInterval(() => {
        if (timeIndex.value < times.length - 1) {
          timeIndex.value += playSpeed.value * playSpeedIncrement.value;
        } else {
          timeIndex.value = 0;
          if (totalTimeIndex.value < timeline.length - 1) {
            totalTimeIndex.value++;
          } else {
            setPlay(false);
            return;
          }
        }
      }, 1);
      return () => {
        clearInterval(interval);
      };
    }
  }, [play, playSpeed.value, times, eventIndex.value, eventBasedPlay.value]);

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

  async function handleChange(event?: TrackerEvent, EventIndex?: number) {
    if (!event || !EventIndex) return;
    const newTotalTimeIndex = findTotalTimeIndex(event.time);
    if (newTotalTimeIndex) {
      if (totalTimeIndex.value === newTotalTimeIndex) {
        timeIndex.value = times.findIndex((x) => x === event.time);
        eventIndex.value = EventIndex;
        return;
      }
      const newTimes = makeTimes([timeline[newTotalTimeIndex], timeline[newTotalTimeIndex + 1]]);
      const newTimeIndex = newTimes.filter((x) => x <= event.time).length;
      totalTimeIndex.value = newTotalTimeIndex;
      timeIndex.value = newTimeIndex;
      eventIndex.value = EventIndex;
    }
  }

  return (
    <section id="control" className="flex w-full select-none items-center gap-2 px-4">
      <div ref={playButtonRef} className={classNames(actionButtonClassNames, "order-1")} onClick={() => setPlay((x) => !x)}>
        {!play ? <Play className="w-4 fill-gray-600 text-gray-600" /> : <Pause className="w-4 fill-gray-600 text-gray-600" />}
      </div>
      <div ref={DateButtonRef} className={classNames(actionButtonClassNames, "order-2 min-w-32 px-2 font-main text-xs")}>
        {Intl.DateTimeFormat(PERSIAN_LOCALE, {
          timeZone: TEHRAN_TZ,
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(activeTime)}
      </div>
      <div className={classNames(actionButtonClassNames, "order-3 flex min-w-48 gap-2 px-2 font-main text-xs")}>
        <span>1x</span>
        <Slider
          min={0.1}
          max={3}
          step={0.3}
          defaultValue={[playSpeed.value]}
          onValueChange={(val) => {
            playSpeed.value = val[0];
          }}
          className="w-full"
        />
        <span>20x</span>
      </div>
      <div
        ref={settingButtonRef}
        className={classNames(actionButtonClassNames, "order-4")}
        onClick={() => {
          showSettings.value = !showSettings.value;
        }}
      >
        <Settings className="w-5" />
      </div>
      <TrackerTotalTimeLine />
    </section>
  );
}
