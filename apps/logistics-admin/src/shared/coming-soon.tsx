import { Link } from "@tanstack/react-router";
import { useAppLanguage } from "@/i18n/use-app-language";
import useBreadcrumbs from "@/components/layout/dashboard/header/useBreadcrumbs";
import type { DependencyList } from "react";

export function DashboardFooter() {
  const { t } = useAppLanguage();

  return (
    <div className="flex flex-col gap-0.5 px-2 py-3 text-xs text-muted-foreground">
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
  const { t } = useAppLanguage();

  const moduleLabelKey = parentNavKey
    ? (`placeholder.modules.${parentNavKey}` as Parameters<typeof t>[0])
    : (`placeholder.modules.${moduleKey}` as Parameters<typeof t>[0]);
  const moduleLabel = t(moduleLabelKey);

  const descriptionKey = subpageKey
    ? (`placeholder.subpages.${moduleKey}.${subpageKey}` as Parameters<
        typeof t
      >[0])
    : (`placeholder.modules.${moduleKey}` as Parameters<typeof t>[0]);
  const description =
    t(descriptionKey) ||
    t(`placeholder.modules.${moduleKey}` as Parameters<typeof t>[0]);

  const subpageLabel = subpageKey
    ? t(`placeholder.subpageLabels.${subpageKey}` as Parameters<typeof t>[0])
    : undefined;

  const title = subpageLabel ? `${moduleLabel} — ${subpageLabel}` : moduleLabel;

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
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("common.comingSoon")}
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="max-w-lg rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            {description || t("common.comingSoonDescription")}
          </p>
          <Link
            to="/"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            {t("common.backToOverview")}
          </Link>
        </div>
      </div>
    </div>
  );
}
