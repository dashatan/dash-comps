import { forwardRef } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import type { LinkProps as TanStackLinkProps } from "@tanstack/react-router";

type LinkProps = Omit<TanStackLinkProps, "to"> & {
  href: string;
  prefetch?: boolean;
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch: _prefetch, ...props },
  ref,
) {
  return <RouterLink ref={ref} to={href} {...props} />;
});

export default Link;
