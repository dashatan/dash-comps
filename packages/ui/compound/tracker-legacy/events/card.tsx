import Button from "@/components/common/buttons";
import { Collapsible, CollapsibleContent } from "@/components/common/collapsible";
import ObserveImageModal from "@/features/observe-details/components/tracker/image";
import { Event } from "@/components/compound/tracker-legacy/types";
import { cn, useLanguage } from "@/lib";
import { getIntlLocale } from "@/components/compound/tracker-legacy/utils";
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

type EventCardProps = {
  event: Event;
  index?: number;
  isActive?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
  onToggle?: () => void;
};

export default function EventCard({
  event,
  index,
  isActive,
  isOpen,
  onClick,
  onToggle,
}: EventCardProps) {
  const { t, language } = useLanguage();
  const dateLocale = getIntlLocale(language);

  const info: { title?: string; className?: string; value: ReactNode }[] = [
    { title: t("common.province"), value: <span>{event.province}</span> },
    { title: t("common.road"), value: <span>{event.road}</span> },
    {
      title: t("common.speed"),
      value: <span className="dir-ltr flex items-center gap-2">{event.speed} km/h</span>,
    },
    { value: <ObserveImageModal index={index} /> },
  ];

  if (event.crimes?.length > 0) {
    info.push({
      title: t("common.violations"),
      value: <span>{event.crimes.join()}</span>,
      className: "col-span-2",
    });
  }

  const handleCardClick = () => {
    onClick?.();
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className={cn("rounded-md border select-none", {
        "ring-primary ring-offset-card ring-2 ring-offset-2": isActive,
        "border-error": event.error,
        "border-warning": event.miss && !event.error,
      })}
    >
      <div
        className={cn(
          "bg-card/75 flex max-h-10 cursor-pointer flex-row items-center gap-2 rounded-md p-3 text-sm backdrop-blur-sm",
          {
            "bg-error/25": event.error,
            "bg-warning/35": event.miss && !event.error,
          },
        )}
        onClick={handleCardClick}
      >
        <span>{event.name}</span>
        <div className="ms-auto flex items-center gap-2">
          {event.miss && (
            <span className="text-warning text-sm whitespace-nowrap">
              {t("common.noObserve")}
            </span>
          )}
          <div className="flex flex-col items-end">
            {event.error && (
              <span className="text-error text-sm whitespace-nowrap">
                {t("common.hasViolation")}
              </span>
            )}
            {!event.miss && (
              <div className="dir-ltr flex items-center justify-center gap-2">
                <span>
                  {Intl.DateTimeFormat(dateLocale, { dateStyle: "short" }).format(
                    event.time,
                  )}{" "}
                </span>
                <span>
                  {Intl.DateTimeFormat(dateLocale, { timeStyle: "medium" }).format(
                    event.time,
                  )}
                </span>
              </div>
            )}
          </div>
          {!event.miss && (
            <Button
              size={24}
              variant="outlined"
              severity="secondary"
              rounded="md"
              className="bg-muted/70 hover:bg-muted text-foreground ms-auto border-none"
              onClick={handleChevronClick}
            >
              <ChevronDown
                size={14}
                className={cn("cursor-pointer transition-all", { "rotate-180": isOpen })}
              />
            </Button>
          )}
        </div>
      </div>
      <CollapsibleContent>
        <div className="p-2">
          {/* <div className='flex items-center gap-2 pb-2'>
            <div className='bg-accent size-2 rounded-[2px]' />
            <span className='text-sm'>{t('common.totalInfo')}</span>
          </div> */}
          <div className="bg-accent/50 grid w-full grid-cols-2 gap-px overflow-hidden rounded-md border border-border/40 backdrop-blur-sm">
            {info.map(({ title, value, className }, infoIndex) => {
              return (
                <div
                  key={infoIndex}
                  className={cn(
                    "bg-card/60 flex items-center gap-4 p-2 text-sm backdrop-blur-sm",
                    className,
                  )}
                >
                  {title && <span className="text-foreground/70">{title}:</span>}
                  {value}
                </div>
              );
            })}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
