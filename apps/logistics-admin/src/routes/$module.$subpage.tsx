import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/shared/coming-soon";
import { isComingSoonModule } from "@/config/menu-items";

function ComingSoonSubpageRoute() {
  const { module, subpage } = Route.useParams();
  const moduleKey = isComingSoonModule(module) ? module : "tracker";

  return (
    <ComingSoonPage
      moduleKey={moduleKey}
      subpageKey={subpage}
      parentNavKey={moduleKey}
    />
  );
}

export const Route = createFileRoute("/$module/$subpage")({
  component: ComingSoonSubpageRoute,
});
