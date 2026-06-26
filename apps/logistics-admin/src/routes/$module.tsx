import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/shared/coming-soon";
import { isPlaceholderModule } from "@/config/menu-items";

function PlaceholderRoute() {
  const { module } = Route.useParams();
  const moduleKey = isPlaceholderModule(module) ? module : "fleet";
  return <ComingSoonPage moduleKey={moduleKey} />;
}

export const Route = createFileRoute("/$module")({
  component: PlaceholderRoute,
});
