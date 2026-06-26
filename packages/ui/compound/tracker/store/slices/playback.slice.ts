import type { StateCreator } from "zustand";
import type { PlaybackMode } from "@dash/ui/compound/tracker/types";
import type { TrackerStore } from "@dash/ui/compound/tracker/store/create-store";

export type PlaybackSlice = {
  play: boolean;
  mode: PlaybackMode;
  activeEventIndex: number;
  totalTimeIndex: number;
  timeIndex: number;
  eventIntervalMs: number;
  timeMultiplier: number;
  timeStepMultiplier: number;
  loop: boolean;
  initToFirstEvent: boolean;
  setPlay: (play: boolean) => void;
  togglePlay: () => void;
  setMode: (mode: PlaybackMode) => void;
  setLoop: (loop: boolean) => void;
  setActiveEventIndex: (index: number) => void;
  incrementActiveEventIndex: () => void;
  decrementActiveEventIndex: () => void;
  setTotalTimeIndex: (index: number) => void;
  setTimeIndex: (index: number) => void;
  setEventIntervalMs: (ms: number) => void;
  setTimeMultiplier: (value: number) => void;
  setTimeStepMultiplier: (value: number) => void;
  advanceEvent: () => void;
  advanceTime: () => void;
  initPlaybackToFirstEvent: () => void;
};

export const createPlaybackSlice: StateCreator<
  TrackerStore,
  [],
  [],
  PlaybackSlice
> = (set, get) => ({
  play: false,
  mode: "event",
  activeEventIndex: 0,
  totalTimeIndex: 0,
  timeIndex: 0,
  eventIntervalMs: 1000,
  timeMultiplier: 1,
  timeStepMultiplier: 1,
  loop: false,
  initToFirstEvent: true,
  setPlay: (play) => set({ play }),
  togglePlay: () => set({ play: !get().play }),
  setMode: (mode) => set({ mode }),
  setLoop: (loop) => set({ loop }),
  setActiveEventIndex: (activeEventIndex) => set({ activeEventIndex }),
  incrementActiveEventIndex: () => {
    const { activeEventIndex, events } = get();
    if (activeEventIndex < events.length - 1) {
      set({ activeEventIndex: activeEventIndex + 1 });
    }
  },
  decrementActiveEventIndex: () => {
    const { activeEventIndex } = get();
    if (activeEventIndex > 0) set({ activeEventIndex: activeEventIndex - 1 });
  },
  setTotalTimeIndex: (totalTimeIndex) =>
    set((state) =>
      state.totalTimeIndex === totalTimeIndex ? state : { totalTimeIndex },
    ),
  setTimeIndex: (timeIndex) =>
    set((state) => (state.timeIndex === timeIndex ? state : { timeIndex })),
  setEventIntervalMs: (eventIntervalMs) => set({ eventIntervalMs }),
  setTimeMultiplier: (timeMultiplier) => set({ timeMultiplier }),
  setTimeStepMultiplier: (timeStepMultiplier) => set({ timeStepMultiplier }),
  advanceEvent: () => {
    const { activeEventIndex, events, play, loop } = get();
    if (activeEventIndex >= events.length - 1) {
      set({ play: loop ? play : false });
      if (loop) set({ activeEventIndex: 0 });
      return;
    }
    set({ activeEventIndex: activeEventIndex + 1 });
  },
  advanceTime: () => {
    const {
      timeIndex,
      minutes,
      totalTimeIndex,
      totalTimes,
      timeMultiplier,
      timeStepMultiplier,
      loop,
    } = get();
    const step = Math.max(1, Math.round(timeMultiplier * timeStepMultiplier));
    if (timeIndex < minutes.length - 1) {
      set({ timeIndex: Math.min(timeIndex + step, minutes.length - 1) });
      return;
    }
    if (totalTimeIndex < totalTimes.length - 1) {
      set({ totalTimeIndex: totalTimeIndex + 1, timeIndex: 0 });
      return;
    }
    if (loop) {
      set({ totalTimeIndex: 0, timeIndex: 0 });
    } else {
      set({ play: false, timeIndex: 0 });
    }
  },
  initPlaybackToFirstEvent: () => {
    const { events, totalTimes, initToFirstEvent } = get();
    if (!initToFirstEvent || !events.length || !totalTimes.length) return;
    const firstTime = events[0].time;
    const totalIdx = totalTimes.findIndex((x) => x === firstTime);
    set({
      activeEventIndex: 0,
      totalTimeIndex: totalIdx >= 0 ? totalIdx : 0,
      timeIndex: 0,
    });
  },
});
