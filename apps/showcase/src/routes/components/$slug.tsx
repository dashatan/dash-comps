import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  catalogPageComponents,
  isCatalogPageSlug,
} from "@/features/catalog/page-components";

export const Route = createFileRoute("/components/$slug")({
  params: {
    parse: (params) => {
      if (!isCatalogPageSlug(params.slug)) {
        throw redirect({ to: "/components" });
      }

      return { slug: params.slug };
    },
    stringify: ({ slug }) => ({ slug }),
  },
  component: CatalogSlugPage,
});

function CatalogSlugPage() {
  const { slug } = Route.useParams();
  const Page = catalogPageComponents[slug];
  return <Page />;
}
