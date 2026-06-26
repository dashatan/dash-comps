import type { ReactNode } from "react";
import type { DependencyList } from "react";
import useBreadcrumbs from "@/components/layout/dashboard/header/useBreadcrumbs";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumbLabel: string;
  breadcrumbHref?: string;
  children?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  breadcrumbLabel,
  breadcrumbHref = "/",
  children,
}: PageHeaderProps) {
  useBreadcrumbs(
    {
      title,
      items: [{ label: breadcrumbLabel, href: breadcrumbHref }],
    },
    [title, breadcrumbLabel, breadcrumbHref] satisfies DependencyList,
  );

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border px-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
