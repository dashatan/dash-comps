import { cn } from "@/lib";
import { Fragment, ReactNode } from "react";

export type StepsProps = {
  steps?: {
    name?: string | ReactNode;
    title?: string | ReactNode;
    subtitle?: string | ReactNode;
  }[];
  active?: number;
};

export default function Steps({ active, steps }: StepsProps) {
  const activeStep = steps?.find((_, i) => i === active);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="text-foreground text-lg font-bold">{activeStep?.title}</div>
        <div className="text-muted-foreground text-lg">{activeStep?.subtitle}</div>
      </div>
      <div className="flex h-10 w-full items-center justify-between">
        {steps?.map((step, i, a) => {
          const isActive = active === i;
          const isLast = i === a.length - 1;
          return (
            <Fragment key={i}>
              <div
                className={cn("flex cursor-pointer items-center gap-2 text-nowrap")}
                key={i}
              >
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full pt-1 text-lg font-bold",
                    {
                      "bg-primary/10 border-primary text-primary border": isActive,
                      "border-border text-muted-foreground border opacity-60": !isActive,
                    },
                  )}
                >
                  {i + 1}
                </div>
                <div
                  className={cn("text-lg font-semibold", {
                    "text-foreground": isActive,
                    "text-muted-foreground opacity-60": !isActive,
                  })}
                >
                  {step.name}
                </div>
              </div>
              {!isLast && (
                <div className="bg-muted mx-2 h-0.5 w-full min-w-10 flex-1 rounded-sm" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
