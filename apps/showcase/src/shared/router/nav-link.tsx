import { Link, useMatchRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { CatalogSlug } from "@/features/catalog/registry";
import type { CatalogPageSlug } from "@/features/catalog/page-components";

type NavLinkProps = {
  to: "/" | "/components" | "/components/$slug";
  params?: { slug: CatalogPageSlug };
  end?: boolean;
  title?: string;
  className?: string | ((state: { isActive: boolean }) => string);
  children?: ReactNode;
};

export function NavLink({ end, className, children, to, params, title }: NavLinkProps) {
  const matchRoute = useMatchRoute();
  const isActive = Boolean(matchRoute({ to, params, fuzzy: !end }));

  const resolvedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link
      to={to}
      params={params}
      activeOptions={{ exact: end }}
      className={resolvedClassName}
      title={title}
    >
      {children}
    </Link>
  );
}

export function catalogLinkParams(slug: CatalogSlug): { slug: CatalogPageSlug } {
  return { slug: slug as CatalogPageSlug };
}
