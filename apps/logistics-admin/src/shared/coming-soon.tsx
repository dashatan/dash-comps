import { Link } from "@tanstack/react-router";
import { useLogisticsT } from "@/i18n/provider";
import useBreadcrumbs from "@/components/layout/dashboard/header/useBreadcrumbs";
import type { DependencyList } from "react";

export function DashboardFooter() {
  const t = useLogisticsT();

  return (
    <div className="text-muted-foreground flex flex-col gap-0.5 px-2 py-3 text-xs">
      <span className="font-medium text-foreground">Logistics Admin</span>
      <span>{t("common.europeanOperations")}</span>
    </div>
  );
}

type ComingSoonPageProps = {
  moduleKey: string;
  subpageKey?: string;
  parentNavKey?: string;
};

export function ComingSoonPage({
  moduleKey,
  subpageKey,
  parentNavKey,
}: ComingSoonPageProps) {
  const t = useLogisticsT();

  const moduleLabelKey = parentNavKey
    ? (`placeholder.modules.${parentNavKey}` as Parameters<typeof t>[0])
    : (`placeholder.modules.${moduleKey}` as Parameters<typeof t>[0]);
  const moduleLabel = t(moduleLabelKey);

  const descriptionKey = subpageKey
    ? (`placeholder.subpages.${moduleKey}.${subpageKey}` as Parameters<typeof t>[0])
    : (`placeholder.modules.${moduleKey}` as Parameters<typeof t>[0]);
  const description =
    t(descriptionKey) || t(`placeholder.modules.${moduleKey}` as Parameters<typeof t>[0]);

  const subpageLabel = subpageKey
    ? t(`placeholder.subpageLabels.${subpageKey}` as Parameters<typeof t>[0])
    : undefined;

  const title = subpageLabel
    ? `${moduleLabel} — ${subpageLabel}`
    : moduleLabel;

  useBreadcrumbs(
    {
      title,
      items: [
        { label: moduleLabel, href: `/${moduleKey}` },
        ...(subpageLabel ? [{ label: subpageLabel }] : []),
      ],
    },
    [title, moduleLabel, subpageLabel] satisfies DependencyList,
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-border border-b px-6 py-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("common.comingSoon")}</p>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="border-border bg-card max-w-lg rounded-xl border p-8 text-center shadow-sm">
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            {description || t("common.comingSoonDescription")}
          </p>
          <Link
            to="/"
            className="bg-primary text-primary-foreground inline-flex rounded-md px-4 py-2 text-sm font-medium"
          >
            {t("common.backToOverview")}
          </Link>
        </div>
      </div>
    </div>
  );
}
