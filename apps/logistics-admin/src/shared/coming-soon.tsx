import { Link } from "@tanstack/react-router";
import { useLogisticsT } from "@/i18n/provider";

export function DashboardFooter() {
  const t = useLogisticsT();

  return (
    <div className="text-muted-foreground flex flex-col gap-0.5 px-2 py-3 text-xs">
      <span className="font-medium text-foreground">Logistics Admin</span>
      <span>{t("common.europeanOperations")}</span>
    </div>
  );
}

export function ComingSoonPage({ moduleKey }: { moduleKey: string }) {
  const t = useLogisticsT();
  const descriptionKey = `placeholder.${moduleKey}` as Parameters<typeof t>[0];
  const description = t(descriptionKey);

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="border-border bg-card max-w-lg rounded-xl border p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">{t("placeholder.title")}</h1>
        <p className="text-muted-foreground mb-2 text-sm">{t("common.comingSoon")}</p>
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
  );
}
