import { buttonVariants } from "@/components/common/buttons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/collapsible";
import { Select } from "@/components/common/inputs/select";
import EventCard from "@/components/compound/tracker-legacy/events/card";
import {
  type Event,
  playSpeedOptions,
} from "@/components/compound/tracker-legacy/types";
import { useTrackerStore } from "@/components/compound/tracker-legacy/store";
import { cn, useLanguage } from "@/lib";
import { getIntlLocale } from "@/components/compound/tracker-legacy/utils";
import { DivProps } from "@/lib/types";
import {
  AlertTriangle,
  Loader2,
  Minus,
  Pause,
  Play,
  Plus,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

export type EventsPanelProps = {
  isLoading?: boolean;
  noData?: boolean;
  containerHeight?: number | null;
};

const HEADER_HEIGHT = 60;
const CONTENT_HEADER_HEIGHT = 86;
const PLAYBACK_BAR_HEIGHT = 80;

export default function EventsPanel({
  isLoading,
  noData,
  containerHeight = 0,
}: EventsPanelProps) {
  const { t, language } = useLanguage();
  const virtuoso = useRef<VirtuosoHandle>(null);
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(true);

  const events = useTrackerStore((state) => state.events);
  const activeEventIndex = useTrackerStore((state) => state.activeEventIndex);
  const play = useTrackerStore((state) => state.play);
  const playSpeed = useTrackerStore((state) => state.playSpeed);
  const setPlay = useTrackerStore((state) => state.setPlay);
  const setPlaySpeed = useTrackerStore((state) => state.setPlaySpeed);
  const setActiveEventIndex = useTrackerStore(
    (state) => state.setActiveEventIndex,
  );
  const incrementActiveEventIndex = useTrackerStore(
    (state) => state.incrementActiveEventIndex,
  );
  const decrementActiveEventIndex = useTrackerStore(
    (state) => state.decrementActiveEventIndex,
  );
  const dateLocale = getIntlLocale(language);
  const height = containerHeight ?? 0;
  const contentHeight = open ? Math.max(0, height - HEADER_HEIGHT) : 0;
  const showPlayback = !isLoading && !noData;
  const listHeight = showPlayback
    ? Math.max(0, contentHeight - CONTENT_HEADER_HEIGHT - PLAYBACK_BAR_HEIGHT)
    : contentHeight;

  useEffect(() => {
    if (!play) return;

    const playInterval = window.setInterval(() => {
      const state = useTrackerStore.getState();
      if (state.activeEventIndex >= state.events.length - 1) {
        state.setPlay(false);
        return;
      }
      state.incrementActiveEventIndex();
    }, playSpeed);

    return () => window.clearInterval(playInterval);
  }, [play, playSpeed, events.length]);

  useEffect(() => {
    if (
      virtuoso.current &&
      activeEventIndex >= 0 &&
      activeEventIndex < events.length
    ) {
      virtuoso.current.scrollToIndex({
        index: activeEventIndex,
        align: "center",
        behavior: "smooth",
      });
    }
  }, [activeEventIndex, events.length]);

  function handlePlay() {
    const nextPlay = !play;
    setPlay(nextPlay);

    if (nextPlay && activeEventIndex < events.length - 1) {
      incrementActiveEventIndex();
    }
  }

  function handleNextEvent() {
    incrementActiveEventIndex();
  }

  function handlePrevEvent() {
    decrementActiveEventIndex();
  }

  function handleCardClick(index: number) {
    setActiveEventIndex(index);
  }

  function handleCardToggle(index: number) {
    setOpenCardIndex(openCardIndex === index ? null : index);
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={(o) => setOpen(o)}
      defaultOpen
      className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-border/40 bg-background/55 backdrop-blur-md mobile:rounded-b-none"
    >
      <div
        className="flex shrink-0 items-center justify-between border-b border-border/40 bg-background/40 p-4 backdrop-blur-sm"
        style={{ height: HEADER_HEIGHT }}
      >
        <span className="w-full">{t("observe.chosenPlateInfo")}</span>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              buttonVariants({ variant: "outlined", severity: "info" }),
              "me-auto size-10 max-w-10",
            )}
          >
            {open ? <Minus className="size-5" /> : <Plus className="size-5" />}
          </div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent asChild>
        <div
          className="relative flex min-h-0 flex-1 flex-col"
          style={{ height: contentHeight }}
        >
          {isLoading && (
            <div className="m-2 flex cursor-default items-center gap-2 rounded-md border border-primary/70 bg-background/70 p-2 text-sm backdrop-blur-sm">
              <Loader2 className="animate-spin" />
              <span>{t("observe.isLoading")}</span>
            </div>
          )}
          {!isLoading && noData && (
            <div className="m-2 flex cursor-default items-center gap-2 rounded-md border border-error/70 bg-background/70 p-2 text-base text-destructive backdrop-blur-sm">
              <AlertTriangle />
              <span>{t("observe.noData")}</span>
            </div>
          )}
          {!isLoading && !noData && (
            <>
              <div
                className="sticky top-0 flex shrink-0 flex-col border-b border-border/40 bg-background/45 p-4 text-sm backdrop-blur-sm"
                style={{ height: CONTENT_HEADER_HEIGHT }}
              >
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-[2px] bg-accent" />
                  <span>{t("common.totalInfo")}</span>
                </div>
                <div className="flex gap-4 rounded-md bg-card/70 p-3 backdrop-blur-sm">
                  <span>{t("observe.observesInDateRange")}:</span>
                  <span>
                    {events.length} {t("common.view")}
                  </span>
                </div>
              </div>

              <Virtuoso
                ref={virtuoso}
                data={events}
                style={{ height: listHeight }}
                initialTopMostItemIndex={{
                  index: activeEventIndex >= 0 ? activeEventIndex : 0,
                  align: "center",
                }}
                itemContent={(index, event) => {
                  const isActive = activeEventIndex === index;
                  const isOpen = openCardIndex === index;

                  const getDateString = (e: Event) =>
                    Intl.DateTimeFormat(dateLocale, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }).format(e.time);

                  const getWeekDay = (e: Event) =>
                    Intl.DateTimeFormat(dateLocale, {
                      weekday: "long",
                    }).format(e.time);

                  const isNewDay =
                    index === 0 ||
                    getDateString(event) !== getDateString(events[index - 1]);

                  return (
                    <div key={index} className="flex flex-col gap-4 p-2 pt-0">
                      {isNewDay && (
                        <div className="flex w-full items-center gap-2 p-3 pb-0 text-xs">
                          <div className="flex items-center gap-2">
                            <span>{getWeekDay(event)}</span>
                            <span>{getDateString(event)}</span>
                          </div>
                          <div className="w-full border-t border-dashed" />
                        </div>
                      )}
                      <EventCard
                        index={index}
                        event={event}
                        isActive={isActive}
                        isOpen={isOpen}
                        onClick={() => handleCardClick(index)}
                        onToggle={() => handleCardToggle(index)}
                      />
                    </div>
                  );
                }}
              />
            </>
          )}

          {!isLoading && !noData && (
            <div className="sticky bottom-0 m-4 mt-auto flex shrink-0 justify-between gap-2 rounded-md border border-border/40 bg-background/70 p-2 text-sm backdrop-blur-md dir-ltr">
              <ControlButton onClick={handlePrevEvent}>
                <SkipBack size={18} />
              </ControlButton>
              <ControlButton onClick={handlePlay}>
                {play ? <Pause size={18} /> : <Play size={18} />}
              </ControlButton>
              <ControlButton onClick={handleNextEvent}>
                <SkipForward size={18} />
              </ControlButton>
              <div className="h-10 w-1 bg-foreground" />
              <Select.Single
                value={playSpeed}
                onChange={(value) => setPlaySpeed(value as number)}
                labelElement={(value) => (
                  <ControlButton className="w-12">{value}</ControlButton>
                )}
                options={playSpeedOptions.map((option) => ({
                  label: option.label,
                  value: option.value,
                }))}
              />
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ControlButton(props: DivProps) {
  return (
    <div
      {...props}
      className={cn(
        buttonVariants({ variant: "contained", severity: "info" }),
        "w-full bg-background/70 transition-all hover:bg-background/90",
        props.className,
      )}
    />
  );
}
