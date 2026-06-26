import { cn } from "@/lib";

export type TimelineItem = {
  time?: string;
  title?: string;
  version?: string;
  description?: string;
  changes?: string[];
  image?: string;
  imageAlt?: string;
};

export type TimelineProps = {
  items: TimelineItem[];
  className?: string;
};

function getItemKey(item: TimelineItem, index: number) {
  return [item.time, item.title, item.version, index].filter(Boolean).join("-");
}

export default function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("w-full", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={getItemKey(item, index)} className="flex gap-3">
            <div className="flex w-20 shrink-0 flex-col items-end gap-1.5 pt-0.5 text-end">
              {item.time ? (
                <span className="text-sm font-semibold text-muted-foreground">
                  {item.time}
                </span>
              ) : null}
              {item.version ? (
                <span className="inline-flex h-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-2 text-xs font-medium text-primary">
                  {item.version}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col items-center self-stretch">
              <div
                className="mt-1.5 size-3 shrink-0 rounded-full bg-muted-foreground/60 ring-4 ring-card"
                aria-hidden
              />
              {!isLast ? (
                <div
                  className="mt-1 min-h-8 w-0.5 flex-1 bg-border"
                  aria-hidden
                />
              ) : null}
            </div>

            <div className={cn("min-w-0 flex-1", !isLast && "pb-8")}>
              <div className="flex flex-col gap-2">
                {item.title ? (
                  <span className="text-lg font-semibold text-foreground">
                    {item.title}
                  </span>
                ) : null}
                {item.description ? (
                  <span className="font-medium text-muted-foreground">
                    {item.description}
                  </span>
                ) : null}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.imageAlt ?? ""}
                    className="max-h-48 w-full rounded-lg border border-border object-cover"
                  />
                ) : null}
                {item.changes?.length ? (
                  <ul className="flex flex-col gap-2">
                    {item.changes.map((change, changeIndex) => (
                      <li
                        key={`${changeIndex}-${change}`}
                        className="flex items-center gap-3 font-medium text-muted-foreground"
                      >
                        <span
                          className="size-1 shrink-0 rounded-full bg-border"
                          aria-hidden
                        />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
