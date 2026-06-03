import { forwardRef } from "react";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";

type LinkProps = Omit<RouterLinkProps, "to"> & {
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
