import {
  useLocation,
  useNavigate,
  useRouter as useTanStackRouter,
} from "@tanstack/react-router";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const router = useTanStackRouter();
  return {
    push: (href: string) => navigate({ to: href }),
    replace: (href: string) => navigate({ to: href, replace: true }),
    back: () => router.history.back(),
    forward: () => router.history.forward(),
    refresh: () => navigate({ to: location.pathname, replace: true }),
    pathname: location.pathname,
  };
}

export function usePathname() {
  return useLocation({ select: (state) => state.pathname });
}

export function useSearchParams() {
  const search = useLocation({ select: (state) => state.search });
  return new URLSearchParams(search);
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
