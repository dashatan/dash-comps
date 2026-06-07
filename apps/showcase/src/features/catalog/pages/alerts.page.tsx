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
import { Alert } from "@/components/common/alert";
import { Button } from "@/components/common/buttons";
import {
  showcaseAlertAnimations,
  showcaseAlertAppearances,
  showcaseAlertLayouts,
  showcaseAlertSeverities,
  showcaseAlertSizes,
} from "@/features/catalog/data/alert-samples";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";
import { cn } from "@/lib";

function AlertFrame({
  label,
  children,
  className,
  tall = false,
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
          "flex min-h-44 w-full min-w-80 items-center",
          "justify-center rounded-xl border border-border bg-muted/30 p-4",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function AlertStack({ children }: { children: ReactNode }) {
  return <div className="flex w-full min-w-0 flex-col gap-4">{children}</div>;
}

export function AlertsPage() {
  const p = useShowcasePage("alerts");

  return (
    <CatalogPageShell slug="alerts">
      <ShowcaseSection
        title={p("compound.title")}
        description={p("compound.description")}
        layout="stack"
      >
        <AlertFrame label={p("compound.label")} className="">
          <Alert
            size="lg"
            severity="primary"
            appearance="soft"
            layout="center"
            animation="bounceIn"
            className="rounded-lg"
          >
            <Alert.Icon>
              <Package />
            </Alert.Icon>
            <Alert.Title>{p("compound.titleText")}</Alert.Title>
            <Alert.Description>
              {p("compound.descriptionText")}
            </Alert.Description>
            <Alert.Actions>
              <Button size="sm">{p("compound.primaryAction")}</Button>
              <Button size="sm" variant="outlined">
                {p("compound.secondaryAction")}
              </Button>
            </Alert.Actions>
          </Alert>
        </AlertFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("presets.title")}
        description={p("presets.description")}
        delay={0.03}
      >
        <AlertFrame label={p("presets.emptyDefault")}>
          <Alert.Empty />
        </AlertFrame>
        <AlertFrame label={p("presets.emptyCustom")}>
          <Alert.Empty message={p("presets.emptyCustomMessage")} />
        </AlertFrame>
        <AlertFrame label={p("presets.loadingDefault")} tall>
          <Alert.Loading />
        </AlertFrame>
        <AlertFrame label={p("presets.loadingCustom")} tall>
          <Alert.Loading message={p("presets.loadingCustomMessage")} />
        </AlertFrame>
        <AlertFrame label={p("presets.errorDefault")}>
          <Alert.Error />
        </AlertFrame>
        <AlertFrame label={p("presets.errorCustom")}>
          <Alert.Error message={p("presets.errorCustomMessage")} />
        </AlertFrame>
        <AlertFrame label={p("presets.forbidden")}>
          <Alert.Forbidden />
        </AlertFrame>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("severities.title")}
        description={p("severities.description")}
        layout="stack"
        delay={0.05}
      >
        <AlertStack>
          {showcaseAlertSeverities.map((severity) => (
            <Alert
              key={severity}
              size="md"
              severity={severity}
              appearance="soft"
              layout="row"
              fullWidth
              className="rounded-xl"
            >
              <Alert.Icon>
                <Inbox />
              </Alert.Icon>
              <Alert.Content>
                <Alert.Title>{p(`severities.${severity}`)}</Alert.Title>
                <Alert.Description>
                  {p(`severities.${severity}Description`)}
                </Alert.Description>
              </Alert.Content>
            </Alert>
          ))}
        </AlertStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("appearances.title")}
        description={p("appearances.description")}
        layout="stack"
        delay={0.07}
      >
        <AlertStack>
          {showcaseAlertAppearances.map((appearance) => (
            <Alert
              key={appearance}
              size="md"
              severity="primary"
              appearance={appearance}
              layout="center"
              fullWidth
              className="min-h-36 rounded-xl"
            >
              <Alert.Icon>
                <CloudOff />
              </Alert.Icon>
              <Alert.Title>{p(`appearances.${appearance}`)}</Alert.Title>
              <Alert.Description>
                {p(`appearances.${appearance}Description`)}
              </Alert.Description>
            </Alert>
          ))}
        </AlertStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sizes.title")}
        description={p("sizes.description")}
        layout="stack"
        delay={0.09}
      >
        <AlertStack>
          {showcaseAlertSizes.map((size) => (
            <AlertFrame key={size} label={size}>
              <Alert size={size} severity="muted" appearance="ghost">
                <Alert.Icon>
                  <FileX />
                </Alert.Icon>
                <Alert.Description>
                  {p("sizes.message", { size })}
                </Alert.Description>
              </Alert>
            </AlertFrame>
          ))}
        </AlertStack>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("layouts.title")}
        description={p("layouts.description")}
        delay={0.11}
      >
        {showcaseAlertLayouts.map((layout) => (
          <AlertFrame key={layout} label={p(`layouts.${layout}`)}>
            <Alert
              size="md"
              severity="info"
              appearance="soft"
              layout={layout}
              animation="jumpIn"
            >
              <Alert.Icon>
                <WifiOff />
              </Alert.Icon>
              <Alert.Content>
                <Alert.Title>{p("layouts.heading")}</Alert.Title>
                <Alert.Description>
                  {p(`layouts.${layout}Description`)}
                </Alert.Description>
                {layout === "row" ? (
                  <Alert.Actions>
                    <Button size="sm" variant="outlined">
                      {p("layouts.action")}
                    </Button>
                  </Alert.Actions>
                ) : null}
              </Alert.Content>
            </Alert>
          </AlertFrame>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("animations.title")}
        description={p("animations.description")}
        delay={0.13}
      >
        {showcaseAlertAnimations.map((animation) => (
          <AlertFrame key={animation} label={p(`animations.${animation}`)}>
            <Alert size="md" severity="secondary" animation={animation}>
              <Alert.Icon>
                <Package />
              </Alert.Icon>
              <Alert.Description>{p("animations.message")}</Alert.Description>
            </Alert>
          </AlertFrame>
        ))}
      </ShowcaseSection>

      <ShowcaseSection
        title={p("situations.title")}
        description={p("situations.description")}
        delay={0.15}
        layout="stack"
        contentClassName="flex-row flex-wrap"
      >
        <AlertFrame label={p("situations.offline")}>
          <Alert severity="warning" animation="shake">
            <Alert.Icon>
              <WifiOff />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.offlineMessage")}
            </Alert.Description>
          </Alert>
        </AlertFrame>
        <AlertFrame label={p("situations.serviceDown")}>
          <Alert severity="danger" animation="bounceIn">
            <Alert.Icon>
              <CloudOff />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.serviceDownMessage")}
            </Alert.Description>
          </Alert>
        </AlertFrame>
        <AlertFrame label={p("situations.emptyInbox")}>
          <Alert severity="muted" animation="jumpIn">
            <Alert.Icon>
              <Inbox />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.emptyInboxMessage")}
            </Alert.Description>
          </Alert>
        </AlertFrame>
        <AlertFrame label={p("situations.noDocuments")}>
          <Alert severity="muted" animation="flipUp">
            <Alert.Icon>
              <FileX />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.noDocumentsMessage")}
            </Alert.Description>
          </Alert>
        </AlertFrame>
        <AlertFrame label={p("situations.sessionExpired")}>
          <Alert severity="warning" animation="shake">
            <Alert.Icon>
              <Clock />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.sessionExpiredMessage")}
            </Alert.Description>
          </Alert>
        </AlertFrame>
        <AlertFrame label={p("situations.maintenance")}>
          <Alert severity="info" appearance="soft" animation="bounceIn">
            <Alert.Icon>
              <Wrench />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.maintenanceMessage")}
            </Alert.Description>
          </Alert>
        </AlertFrame>
        <AlertFrame label={p("situations.notificationsOff")}>
          <Alert severity="muted" animation="jumpIn">
            <Alert.Icon>
              <BellOff />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.notificationsOffMessage")}
            </Alert.Description>
          </Alert>
        </AlertFrame>
        <AlertFrame label={p("situations.allCaughtUp")}>
          <Alert severity="success" animation="flipUp">
            <Alert.Icon>
              <CheckCircle2 />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.allCaughtUpMessage")}
            </Alert.Description>
          </Alert>
        </AlertFrame>
        <AlertFrame label={p("situations.emptyWarehouse")} tall>
          <Alert severity="muted" animation="none">
            <Alert.Icon>
              <Box
                variant="Bulk"
                className="animate-shake animation-duration-[3000ms] animate-infinite"
              />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.emptyWarehouseMessage")}
            </Alert.Description>
            <Alert.Divider />
          </Alert>
        </AlertFrame>
        <AlertFrame label={p("situations.accessBlocked")}>
          <Alert severity="danger" animation="flipUp">
            <Alert.Icon>
              <ShieldCross variant="Bulk" />
            </Alert.Icon>
            <Alert.Description>
              {p("situations.accessBlockedMessage")}
            </Alert.Description>
          </Alert>
        </AlertFrame>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
