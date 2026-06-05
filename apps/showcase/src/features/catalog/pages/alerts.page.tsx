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
import { useShowcasePage } from "@/features/catalog/i18n";
import { Alert } from "@/components/common/alert";

const ANIMATION_KEYS = [
  { key: "jumpIn", value: "animate-jump-in" },
  { key: "shake", value: "animate-shake" },
  { key: "bounceIn", value: "animate-bounce-in" },
  { key: "flipUp", value: "animate-flip-up" },
  { key: "none", value: "" },
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
  const p = useShowcasePage("alerts");

  return (
    <CatalogPageShell slug="alerts">
      <ShowcaseSection
        title={p("builtInAlerts.title")}
        description={p("builtInAlerts.description")}
      >
        <AlertPreview label={p("builtInAlerts.emptyDefault")}>
          <Alert.Empty />
        </AlertPreview>
        <AlertPreview label={p("builtInAlerts.emptyCustom")}>
          <Alert.Empty message={p("builtInAlerts.emptyCustomMessage")} />
        </AlertPreview>
        <AlertPreview label={p("builtInAlerts.loadingDefault")} tall>
          <Alert.Loading />
        </AlertPreview>
        <AlertPreview label={p("builtInAlerts.loadingCustom")} tall>
          <Alert.Loading message={p("builtInAlerts.loadingCustomMessage")} />
        </AlertPreview>
        <AlertPreview label={p("builtInAlerts.errorDefault")}>
          <Alert.Error />
        </AlertPreview>
        <AlertPreview label={p("builtInAlerts.errorCustom")}>
          <Alert.Error message={p("builtInAlerts.errorCustomMessage")} />
        </AlertPreview>
        <AlertPreview label={p("builtInAlerts.forbidden")}>
          <Alert.Forbidden />
        </AlertPreview>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("baseAnimations.title")}
        description={p("baseAnimations.description")}
        delay={0.05}
      >
        {ANIMATION_KEYS.map(({ key, value }) => (
          <AlertPreview key={key} label={p(`animations.${key}`)}>
            <Alert.Base
              icon={<Package size={38} />}
              message={p("baseAnimations.packageMessage")}
              animation={value}
            />
          </AlertPreview>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("iconsSituations.title")}
        description={p("iconsSituations.description")}
        delay={0.1}
        layout="stack"
        contentClassName="flex-row flex-wrap"
      >
        <AlertPreview label={p("iconsSituations.offline")}>
          <Alert.Base
            icon={<WifiOff size={38} />}
            message={p("iconsSituations.offlineMessage")}
            animation="animate-shake"
          />
        </AlertPreview>
        <AlertPreview label={p("iconsSituations.serviceDown")}>
          <Alert.Base
            icon={<CloudOff size={38} />}
            message={p("iconsSituations.serviceDownMessage")}
            animation="animate-bounce-in"
          />
        </AlertPreview>
        <AlertPreview label={p("iconsSituations.emptyInbox")}>
          <Alert.Base
            icon={<Inbox size={38} />}
            message={p("iconsSituations.emptyInboxMessage")}
            animation="animate-jump-in"
          />
        </AlertPreview>
        <AlertPreview label={p("iconsSituations.noDocuments")}>
          <Alert.Base
            icon={<FileX size={38} />}
            message={p("iconsSituations.noDocumentsMessage")}
            animation="animate-flip-up"
          />
        </AlertPreview>
        <AlertPreview label={p("iconsSituations.sessionExpired")}>
          <Alert.Base
            icon={<Clock size={38} />}
            message={p("iconsSituations.sessionExpiredMessage")}
            animation="animate-shake"
            className="text-accent-foreground"
          />
        </AlertPreview>
        <AlertPreview label={p("iconsSituations.maintenance")}>
          <Alert.Base
            icon={<Wrench size={38} />}
            message={p("iconsSituations.maintenanceMessage")}
            animation="animate-bounce-in"
          />
        </AlertPreview>
        <AlertPreview label={p("iconsSituations.notificationsOff")}>
          <Alert.Base
            icon={<BellOff size={38} />}
            message={p("iconsSituations.notificationsOffMessage")}
            animation="animate-jump-in"
          />
        </AlertPreview>
        <AlertPreview label={p("iconsSituations.allCaughtUp")}>
          <Alert.Base
            icon={<CheckCircle2 size={38} className="text-success" />}
            message={p("iconsSituations.allCaughtUpMessage")}
            animation="animate-flip-up"
          />
        </AlertPreview>
        <AlertPreview label={p("iconsSituations.emptyWarehouse")} tall>
          <Alert.Base
            icon={
              <Box
                variant="Bulk"
                className="size-10 animate-shake text-icon animation-duration-[3000ms] animate-infinite"
              />
            }
            message={p("iconsSituations.emptyWarehouseMessage")}
            animation=""
          >
            <div className="h-px w-20 rounded-full bg-border" />
          </Alert.Base>
        </AlertPreview>
        <AlertPreview label={p("iconsSituations.accessBlocked")}>
          <Alert.Base
            icon={
              <ShieldCross
                variant="Bulk"
                className="size-10 text-accent-foreground"
              />
            }
            message={p("iconsSituations.accessBlockedMessage")}
            animation="animate-flip-up"
            className="text-accent-foreground"
          />
        </AlertPreview>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
