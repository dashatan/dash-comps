import { Alert } from "@/components/common/alert";
import { useDataErrorHandler } from "@/components/common/errors";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

function ErrorHandlerDemo({
  data,
  isLoading,
  isError,
  error,
  permitted,
  successMessage,
}: {
  data?: { ok: boolean };
  isLoading?: boolean;
  isError?: boolean;
  error?: { status?: number; message?: string };
  permitted?: boolean;
  successMessage: string;
}) {
  const view = useDataErrorHandler({ data, isLoading, isError, error, permitted });
  if (view) return view;
  return <p className="text-sm text-success">{successMessage}</p>;
}

export function ErrorsPage() {
  const p = useShowcasePage("errors");

  return (
    <CatalogPageShell slug="errors">
      <ShowcaseSection title={p("loading.title")} className="w-full">
        <ErrorHandlerDemo isLoading successMessage={p("successState.dataLoaded")} />
      </ShowcaseSection>
      <ShowcaseSection title={p("empty.title")} delay={0.05} className="w-full">
        <ErrorHandlerDemo successMessage={p("successState.dataLoaded")} />
      </ShowcaseSection>
      <ShowcaseSection title={p("error.title")} delay={0.1} className="w-full">
        <ErrorHandlerDemo
          isError
          error={{ message: p("error.networkFailed") }}
          successMessage={p("successState.dataLoaded")}
        />
      </ShowcaseSection>
      <ShowcaseSection title={p("forbidden.title")} delay={0.15} className="w-full">
        <ErrorHandlerDemo
          isError
          error={{ status: 403 }}
          permitted
          successMessage={p("successState.dataLoaded")}
        />
      </ShowcaseSection>
      <ShowcaseSection title={p("successState.title")} delay={0.2} className="w-full">
        <ErrorHandlerDemo data={{ ok: true }} permitted successMessage={p("successState.dataLoaded")} />
      </ShowcaseSection>
      <ShowcaseSection title={p("alertError.title")} delay={0.25} className="w-full">
        <Alert.Error message={p("alertError.message")} />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
