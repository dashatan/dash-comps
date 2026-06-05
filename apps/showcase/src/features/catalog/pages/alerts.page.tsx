import type { ReactNode } from "react";
import {
  BellOff,
  CheckCircle2,
  Clock,
  CloudOff,
  FileX,
  Inbox,
  Package,
  WifiOff,
  Wrench,
} from "lucide-react";
import { Box, ShieldCross } from "iconsax-reactjs";
import { cn } from "@/lib";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { Alert } from "@/components/common/alert";

const ANIMATIONS = [
  { label: "Jump in (default)", value: "animate-jump-in" },
  { label: "Shake", value: "animate-shake" },
  { label: "Bounce in", value: "animate-bounce-in" },
  { label: "Flip up", value: "animate-flip-up" },
  { label: "None", value: "" },
] as const;

function AlertPreview({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  tall?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div
        className={cn(
          "flex h-44 w-full max-w-xs min-w-[240px] items-center justify-center rounded-xl border border-border bg-muted/30 p-4",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AlertsPage() {
  return (
    <CatalogPageShell slug="alerts">
      <ShowcaseSection
        title="Built-in alerts"
        description="Preset states used across data views — each shown in a compact panel, not full width."
      >
        <AlertPreview label="Empty (default)">
          <Alert.Empty />
        </AlertPreview>
        <AlertPreview label="Empty (custom)">
          <Alert.Empty message="No orders match your filters." />
        </AlertPreview>
        <AlertPreview label="Loading (default)" tall>
          <Alert.Loading />
        </AlertPreview>
        <AlertPreview label="Loading (custom)" tall>
          <Alert.Loading message="Fetching shipments…" />
        </AlertPreview>
        <AlertPreview label="Error (default)">
          <Alert.Error />
        </AlertPreview>
        <AlertPreview label="Error (custom)">
          <Alert.Error message="Could not sync inventory. Try again later." />
        </AlertPreview>
        <AlertPreview label="Forbidden">
          <Alert.Forbidden />
        </AlertPreview>
      </ShowcaseSection>

      <ShowcaseSection
        title="Base alert — animations"
        description="Same message and icon; only the entrance animation changes."
        delay={0.05}
      >
        {ANIMATIONS.map(({ label, value }) => (
          <AlertPreview key={label} label={label}>
            <Alert.Base
              icon={<Package size={38} />}
              message="Your package is on the way."
              animation={value}
            />
          </AlertPreview>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title="Base alert — icons & situations"
        description="Custom icons and copy for common empty, error, and info states."
        delay={0.1}
        layout="stack"
        contentClassName="flex-row flex-wrap"
      >
        <AlertPreview label="Offline">
          <Alert.Base
            icon={<WifiOff size={38} />}
            message="You are offline. Check your connection."
            animation="animate-shake"
          />
        </AlertPreview>
        <AlertPreview label="Service down">
          <Alert.Base
            icon={<CloudOff size={38} />}
            message="Service temporarily unavailable."
            animation="animate-bounce-in"
          />
        </AlertPreview>
        <AlertPreview label="Empty inbox">
          <Alert.Base
            icon={<Inbox size={38} />}
            message="Your inbox is empty."
            animation="animate-jump-in"
          />
        </AlertPreview>
        <AlertPreview label="No documents">
          <Alert.Base
            icon={<FileX size={38} />}
            message="No documents uploaded yet."
            animation="animate-flip-up"
          />
        </AlertPreview>
        <AlertPreview label="Session expired">
          <Alert.Base
            icon={<Clock size={38} />}
            message="Session expired. Sign in again."
            animation="animate-shake"
            className="text-accent-foreground"
          />
        </AlertPreview>
        <AlertPreview label="Maintenance">
          <Alert.Base
            icon={<Wrench size={38} />}
            message="Scheduled maintenance in progress."
            animation="animate-bounce-in"
          />
        </AlertPreview>
        <AlertPreview label="Notifications off">
          <Alert.Base
            icon={<BellOff size={38} />}
            message="Notifications are disabled."
            animation="animate-jump-in"
          />
        </AlertPreview>
        <AlertPreview label="All caught up">
          <Alert.Base
            icon={<CheckCircle2 size={38} className="text-success" />}
            message="You are all caught up!"
            animation="animate-flip-up"
          />
        </AlertPreview>
        <AlertPreview label="Empty warehouse" tall>
          <Alert.Base
            icon={
              <Box
                variant="Bulk"
                className="size-10 animate-shake text-icon animation-duration-[3000ms] animate-infinite"
              />
            }
            message="No stock in this warehouse."
            animation=""
          >
            <div className="h-px w-20 rounded-full bg-border" />
          </Alert.Base>
        </AlertPreview>
        <AlertPreview label="Access blocked">
          <Alert.Base
            icon={
              <ShieldCross
                variant="Bulk"
                className="size-10 text-accent-foreground"
              />
            }
            message="This area requires admin access."
            animation="animate-flip-up"
            className="text-accent-foreground"
          />
        </AlertPreview>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
