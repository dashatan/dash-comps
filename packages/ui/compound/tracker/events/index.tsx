import { buttonVariants } from "@/components/common/buttons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/common/collapsible";
import { Select } from "@/components/common/inputs/select";
import EventCard from "@/components/compound/tracker/events/card";
import { type Event, playSpeedOptions } from "@/components/compound/tracker/types";
import { useTrackerStore } from "@/components/compound/tracker/store";
import { cn, PERSIAN_LOCALE, useLanguage } from "@/lib";
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

export default function EventsPanel({
  isLoading,
  noData,
  containerHeight = 0,
}: EventsPanelProps) {
  const { t } = useLanguage();
  const virtuoso = useRef<VirtuosoHandle>(null);
  const [openCardIndex, setOpenCardIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(true);

  const events = useTrackerStore((state) => state.events);
  const activeEventIndex = useTrackerStore((state) => state.activeEventIndex);
  const play = useTrackerStore((state) => state.play);
  const playSpeed = useTrackerStore((state) => state.playSpeed);
  const setPlay = useTrackerStore((state) => state.setPlay);
  const setPlaySpeed = useTrackerStore((state) => state.setPlaySpeed);
  const setActiveEventIndex = useTrackerStore((state) => state.setActiveEventIndex);
  const incrementActiveEventIndex = useTrackerStore((state) => state.incrementActiveEventIndex);
  const decrementActiveEventIndex = useTrackerStore((state) => state.decrementActiveEventIndex);

  useEffect(() => {
    if (!play) return;

    const playInterval = setInterval(() => {
      if (activeEventIndex >= events.length - 1) {
        setPlay(false);
        return;
      }
      incrementActiveEventIndex();
    }, playSpeed);

    return () => clearInterval(playInterval);
  }, [play, playSpeed, activeEventIndex, events.length, setPlay, incrementActiveEventIndex]);

  useEffect(() => {
    if (virtuoso.current && activeEventIndex >= 0 && activeEventIndex < events.length) {
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
      className="bg-background mobile:h-fit mobile:rounded-b-none w-full overflow-hidden rounded-md border"
    >
      <div
        className="flex items-center justify-between border-b p-4"
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
          className="mobile:max-h-[360px] relative flex flex-col"
          style={{ height: containerHeight - HEADER_HEIGHT - 36 }}
        >
          {isLoading && (
            <div className="bg-primary/10 border-primary/70 m-2 flex cursor-default items-center gap-2 rounded-md border p-2 text-sm">
              <Loader2 className="animate-spin" />
              <span>{t("observe.isLoading")}</span>
            </div>
          )}
          {!isLoading && noData && (
            <div className="border-error/70 bg-error/10 text-destructive m-2 flex cursor-default items-center gap-2 rounded-md border p-2 text-base">
              <AlertTriangle />
              <span>{t("observe.noData")}</span>
            </div>
          )}
          {!isLoading && !noData && (
            <>
              <div
                className="sticky top-0 flex flex-col border-b p-4 text-sm"
                style={{ height: CONTENT_HEADER_HEIGHT }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-accent size-2 rounded-[2px]" />
                  <span>{t("common.totalInfo")}</span>
                </div>
                <div className="bg-card flex gap-4 rounded-md p-3">
                  <span>{t("observe.observesInDateRange")}:</span>
                  <span>
                    {events.length} {t("common.view")}
                  </span>
                </div>
              </div>

              <Virtuoso
                ref={virtuoso}
                data={events}
                style={{ height: containerHeight, marginBottom: 10, paddingBottom: 10 }}
                initialTopMostItemIndex={{
                  index: activeEventIndex >= 0 ? activeEventIndex : 0,
                  align: "center",
                }}
                itemContent={(index, event) => {
                  const isActive = activeEventIndex === index;
                  const isOpen = openCardIndex === index;

                  const getDateString = (e: Event) =>
                    Intl.DateTimeFormat(PERSIAN_LOCALE, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }).format(e.time);

                  const getWeekDay = (e: Event) =>
                    Intl.DateTimeFormat(PERSIAN_LOCALE, {
                      weekday: "long",
                    }).format(e.time);

                  const isNewDay =
                    index === 0 || getDateString(event) !== getDateString(events[index - 1]);

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
            <div className="bg-muted/30 dir-ltr sticky bottom-0 m-4 mt-auto flex justify-between gap-2 rounded-md p-2 text-sm">
              <ControlButton onClick={handlePrevEvent}>
                <SkipBack size={18} />
              </ControlButton>
              <ControlButton onClick={handlePlay}>
                {play ? <Pause size={18} /> : <Play size={18} />}
              </ControlButton>
              <ControlButton onClick={handleNextEvent}>
                <SkipForward size={18} />
              </ControlButton>
              <div className="bg-foreground h-10 w-1" />
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
        "bg-background/70 hover:bg-background/90 w-full transition-all",
        props.className,
      )}
    />
  );
}
