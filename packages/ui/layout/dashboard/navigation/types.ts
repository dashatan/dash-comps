import type {
  ComponentType,
  MouseEvent,
  ReactNode,
  RefAttributes,
} from "react";

export type DashboardLinkProps = {
  href: string;
  children?: ReactNode;
  className?: string;
  id?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export type DashboardLinkComponent = ComponentType<
  DashboardLinkProps & RefAttributes<HTMLAnchorElement>
>;

export type DashboardNavigation = {
  pathname: string;
  push: (href: string) => void;
  back: () => void;
  Link: DashboardLinkComponent;
};
