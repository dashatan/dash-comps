import type { ReactNode } from "react";
import { GridCard, GridHeader } from "@/components/common/grid";
import { cn } from "@/lib";

export function KpiCard({
  label,
  description,
  value,
  icon,
  className,
}: {
  label: string;
  description: string;
  value: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <GridCard
      className={cn(
        "col-span-12 h-full gap-0 @lg:col-span-6 @2xl:col-span-3",
        className,
      )}
    >
      <div
        className="flex items-start justify-between gap-3"
        title={description}
      >
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-2xl font-semibold tabular-nums">{value}</span>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>
      </div>
    </GridCard>
  );
}

export function ChartCard({
  className,
  icon,
  title,
  description,
  children,
}: {
  className?: string;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <GridCard className={cn("h-full", className)}>
      <GridHeader Icon={icon} title={title} subtitle={description} />
      <div className="min-h-96 w-full flex-1 overflow-hidden">{children}</div>
    </GridCard>
  );
}

export function PanelCard({
  className,
  icon,
  title,
  description,
  children,
}: {
  className?: string;
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <GridCard className={cn("h-full min-h-0", className)}>
      <GridHeader Icon={icon} title={title} subtitle={description} />
      <div className="flex min-h-0 flex-1 flex-col gap-2">{children}</div>
    </GridCard>
  );
}

export function ListRow({
  primary,
  secondary,
  meta,
  trailing,
}: {
  primary: string;
  secondary?: string;
  meta?: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{primary}</p>
        {secondary ? (
          <p className="truncate text-xs text-muted-foreground">{secondary}</p>
        ) : null}
      </div>
      {meta ? (
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {meta}
        </span>
      ) : null}
      {trailing}
    </div>
  );
}

export function WidgetStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function WidgetProgress({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const width = `${Math.min(Math.max(value, 0), 100)}%`;

  return (
    <div className="rounded-lg border border-border bg-muted/20 px-3 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold tabular-nums">{value}%</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width }}
        />
      </div>
    </div>
  );
}

export function WidgetDetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/10 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}
