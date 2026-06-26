import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonPage } from "@/shared/coming-soon";

function ComingSoonSubpageRoute() {
  const { module, subpage } = Route.useParams();

  return (
    <ComingSoonPage
      moduleKey={module}
      subpageKey={subpage}
      parentNavKey={module}
    />
  );
}

export const Route = createFileRoute("/$module/$subpage")({
  component: ComingSoonSubpageRoute,
});
