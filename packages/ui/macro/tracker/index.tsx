import TrackerContainer from "@/components/macro/tracker/comps";
import {
  TrackerProps,
  TrackerState,
} from "@/components/macro/tracker/utils/types";
import { makeTimes } from "@/components/macro/tracker/utils/remap";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import "./styles.css";
import DataAlert from "@/components/micro/alert";
import {
  remapWorkerDataType,
  remapWorkerReturnType,
} from "@/components/macro/tracker/utils/remapWorker";
import { signal } from "@preact/signals-react";
import { isWithinIran } from "@/utils/geographic";
import { useSignals } from "@preact/signals-react/runtime";
import { words } from "@/utils/words";
import {
  timeHourClear,
  timeSecondClear,
} from "@/components/micro/inputs/date/utils/dateFormatPersian";

export const totalTimeIndex = signal(0);
export const timeIndex = signal(0);
export const eventIndex = signal(0);
export const minutes = signal<number[]>([]);
export const showSettings = signal(false);
export const playSpeed = signal(1);
export const playSpeedIncrement = signal(1);
export const traceCount = signal(15);
export const autoPaneMap = signal(true);
export const maxPaneZoom = signal(8);
export const eventBasedPlay = signal(true);
export const emphasizeRadius = signal(120);
export const filterIran = signal(true);

export default function TrackerProvider({
  dates,
  tracks,
  emphasizes,
  emphasizesPanel,
  settings,
}: TrackerProps) {
  useSignals();
  const worker = new Worker(new URL("./utils/remapWorker.ts", import.meta.url));
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(false);
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [isError, setIsError] = useState<boolean | undefined>(false);

  const state = useForm<TrackerState>({ defaultValues: { emphasizes, dates } });

  useEffect(() => {
    if (settings) {
      showSettings.value = settings.show || false;
      traceCount.value = settings.traceCount || 5;
      playSpeed.value = settings.playSpeed || 1;
      autoPaneMap.value = settings.autoPaneMap || true;
      maxPaneZoom.value = settings.maxPaneZoom || 8;
      eventBasedPlay.value = settings.eventBasedPlay || true;
      filterIran.value = settings.filterIran || true;
    }
  }, [settings]);

  const hasInitializedPlayHead = useRef(false);

  useEffect(() => {
    if (!dates?.length || !tracks?.length || loading) return;
    initialize();
  }, [dates, tracks, emphasizes, filterIran.value]);

  useEffect(() => {
    if (!isSuccess || loading || hasInitializedPlayHead.current) return;
    const events = state.getValues("events");
    const totalTimes = state.getValues("totalTimes") || [];
    if (!events?.length || !totalTimes?.length) return;
    const firstEventTime = events[0].time;
    const totalIdx = totalTimes.findIndex(
      (x) =>
        x === firstEventTime ||
        timeSecondClear(x).getTime() ===
          timeSecondClear(firstEventTime).getTime() ||
        timeHourClear(x).getTime() === timeHourClear(firstEventTime).getTime(),
    );
    if (totalIdx < 0) return;
    const newTimes = makeTimes([
      totalTimes[totalIdx],
      totalTimes[totalIdx + 1],
    ]);
    const timeSlot = newTimes.findIndex((t) => t >= firstEventTime);
    if (timeSlot < 0) return;
    totalTimeIndex.value = totalIdx;
    timeIndex.value = timeSlot;
    eventIndex.value = 0;
    hasInitializedPlayHead.current = true;
  }, [isSuccess, loading, state]);

  function initialize() {
    setLoading(true);
    hasInitializedPlayHead.current = false;

    worker.postMessage({ dates, tracks } as remapWorkerDataType);
    worker.onmessage = (event) => {
      const { events, timeline, tracksWithEvents, totalTimes, daysWithEvent } =
        event.data as remapWorkerReturnType;
      state.setValue("events", events);
      state.setValue("tracks", tracks);
      state.setValue("tracksWithEvents", tracksWithEvents);
      state.setValue("totalTimes", totalTimes);
      state.setValue("timeline", timeline);
      state.setValue("emphasizes", emphasizes);
      state.setValue("daysWithEvent", daysWithEvent);
      setLoading(false);
      setIsSuccess(true);
    };
    worker.onerror = () => setIsError(true);
  }

  if (isError)
    return <DataAlert type="error" message={words.ERROR_BUILDING_TRACKS} />;
  if (loading && !isSuccess)
    return <DataAlert type="loading" message={words.HANDLING_TRACKS} />;
  if (!isSuccess) return <DataAlert type="loading" />;

  return (
    <FormProvider {...state}>
      <TrackerContainer emphasizesPanel={emphasizesPanel} />
    </FormProvider>
  );
}
