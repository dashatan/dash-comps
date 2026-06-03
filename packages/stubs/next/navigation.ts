import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => navigate(0),
    pathname: location.pathname,
  };
}

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

export function redirect(_url: string) {
  return undefined;
}

export function notFound() {
  return undefined;
}

export function useParams<T extends Record<string, string>>() {
  return {} as T;
}

export function useSelectedLayoutSegment() {
  return null;
}

export function useSelectedLayoutSegments() {
  return [] as string[];
}

export function useLinkStatus() {
  return { pending: false };
}
