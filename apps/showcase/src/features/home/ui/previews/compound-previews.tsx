import type { CatalogSlug } from "@/features/catalog/registry";
import { cn } from "@/lib";

const previewFrameClass =
  "relative flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-background/60";

export function CompoundComponentPreview({ slug }: { slug: CatalogSlug }) {
  switch (slug) {
    case "tracker":
      return <TrackerPreview />;
    case "location-picker":
      return <LocationPickerPreview />;
    case "table":
      return <TablePreview />;
    case "dashboard":
      return <DashboardPreview />;
    case "license-plate":
      return <LicensePlatePreview />;
    case "form":
      return <FormPreview />;
    default:
      return null;
  }
}

function TrackerPreview() {
  return (
    <div className={cn(previewFrameClass, "min-h-44 p-2")}>
      <div
        className="relative h-full min-h-40 w-full overflow-hidden rounded-lg bg-cover bg-center"
        style={{ backgroundImage: "url(/location-picker/routing-routes.jpg)" }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
        <svg
          viewBox="0 0 400 200"
          className="absolute inset-0 h-full w-full text-primary"
          aria-hidden
        >
          <path
            d="M40 150 C120 40, 180 180, 260 80 S 360 120, 370 60"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="8 6"
            className="opacity-90"
          />
          <circle cx="40" cy="150" r="6" fill="currentColor" />
          <circle
            cx="370"
            cy="60"
            r="6"
            fill="currentColor"
            className="text-success"
          />
        </svg>
        <div className="absolute start-3 end-3 bottom-3 flex items-center justify-between gap-2">
          <div className="rounded-lg border border-border/60 bg-background/80 px-2.5 py-1.5 text-[0.65rem] font-medium backdrop-blur-sm">
            Live route replay
          </div>
          <div className="rounded-full bg-primary px-2 py-1 text-[0.6rem] font-semibold text-primary-foreground">
            12 events
          </div>
        </div>
      </div>
    </div>
  );
}

function LocationPickerPreview() {
  return (
    <div
      className={cn(
        previewFrameClass,
        "min-h-52 flex-col items-stretch gap-2 p-2",
      )}
    >
      <div
        className="h-28 w-full rounded-lg bg-cover bg-center"
        style={{ backgroundImage: "url(/location-picker/trigger-devices.jpg)" }}
      />
      <div className="grid grid-cols-3 gap-1.5">
        {["Devices", "Routes", "Filters"].map((label) => (
          <div
            key={label}
            className="rounded-md border border-border/50 bg-muted/50 px-2 py-2 text-center text-[0.6rem] font-medium text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function TablePreview() {
  const rows = [
    { name: "Fleet A", status: "Active", count: 128 },
    { name: "Fleet B", status: "Idle", count: 42 },
    { name: "Fleet C", status: "Alert", count: 7 },
  ];

  return (
    <div className={cn(previewFrameClass, "items-stretch p-2")}>
      <div className="w-full overflow-hidden rounded-lg border border-border/50 text-[0.65rem]">
        <div className="grid grid-cols-3 gap-2 border-b border-border/50 bg-muted/40 px-3 py-2 font-semibold">
          <span>Name</span>
          <span>Status</span>
          <span className="text-end">Units</span>
        </div>
        {rows.map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-3 gap-2 border-b border-border/30 px-3 py-2 last:border-0"
          >
            <span className="font-medium">{row.name}</span>
            <span
              className={cn(
                "w-fit rounded-full px-2 py-0.5 text-[0.55rem] font-medium",
                row.status === "Active" && "bg-success/15 text-success",
                row.status === "Idle" && "bg-muted text-muted-foreground",
                row.status === "Alert" && "bg-warning/15 text-warning",
              )}
            >
              {row.status}
            </span>
            <span className="text-end tabular-nums">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardPreview() {
  const stats = [
    { label: "Revenue", value: "$48.2k", trend: "+12%" },
    { label: "Users", value: "2,841", trend: "+8%" },
    { label: "Latency", value: "124ms", trend: "-4%" },
  ];

  return (
    <div className={cn(previewFrameClass, "items-stretch gap-2 p-2")}>
      <div className="grid grid-cols-3 gap-1.5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border/50 bg-card p-2"
          >
            <p className="text-[0.55rem] text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-sm font-bold tabular-nums">{stat.value}</p>
            <p className="text-[0.55rem] font-medium text-success">
              {stat.trend}
            </p>
          </div>
        ))}
      </div>
      <div className="flex h-16 items-end gap-1 rounded-lg border border-border/40 bg-muted/30 p-2">
        {[35, 58, 42, 72, 48, 80, 65].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-primary/70"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function LicensePlatePreview() {
  return (
    <div className={cn(previewFrameClass, "p-3")}>
      <div className="flex w-fit overflow-hidden rounded-lg border-2 border-foreground/80 bg-white text-black shadow-md">
        <div className="flex w-8 shrink-0 flex-col items-center justify-center gap-0.5 bg-[#003399] py-2 text-white">
          <span className="text-[0.45rem] font-bold">IR</span>
          <span className="text-[0.4rem]">IRN</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-1 px-2 py-2.5 text-lg font-bold tracking-wider">
          <span>12</span>
          <span className="rounded bg-amber-400 px-1.5 text-sm text-black">
            ب
          </span>
          <span>345</span>
          <span className="ms-1 text-xs font-normal text-muted-foreground">
            | 67
          </span>
        </div>
      </div>
    </div>
  );
}

function FormPreview() {
  return (
    <div className={cn(previewFrameClass, "items-stretch gap-2 p-3")}>
      <div className="space-y-2">
        <div className="space-y-1">
          <div className="h-2 w-12 rounded bg-muted/60" />
          <div className="h-8 rounded-md border border-border/60 bg-input" />
        </div>
        <div className="space-y-1">
          <div className="h-2 w-16 rounded bg-muted/60" />
          <div className="h-8 rounded-md border border-border/60 bg-input" />
        </div>
        <div className="mt-1 h-8 rounded-md bg-primary" />
      </div>
    </div>
  );
}
