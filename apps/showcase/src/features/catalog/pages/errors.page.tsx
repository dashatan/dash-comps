import { Alert } from "@/components/common/alert";
import { useDataErrorHandler } from "@/components/common/errors";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

function ErrorHandlerDemo({
  data,
  isLoading,
  isError,
  error,
  permitted,
}: {
  data?: { ok: boolean };
  isLoading?: boolean;
  isError?: boolean;
  error?: { status?: number; message?: string };
  permitted?: boolean;
}) {
  const view = useDataErrorHandler({ data, isLoading, isError, error, permitted });
  if (view) return view;
  return <p className="text-sm text-success">Data loaded successfully.</p>;
}

export function ErrorsPage() {
  return (
    <CatalogPageShell slug="errors">
      <ShowcaseSection title="useDataErrorHandler — loading" className="w-full">
        <ErrorHandlerDemo isLoading />
      </ShowcaseSection>
      <ShowcaseSection title="Empty" delay={0.05} className="w-full">
        <ErrorHandlerDemo />
      </ShowcaseSection>
      <ShowcaseSection title="Error" delay={0.1} className="w-full">
        <ErrorHandlerDemo isError error={{ message: "Network request failed" }} />
      </ShowcaseSection>
      <ShowcaseSection title="Forbidden" delay={0.15} className="w-full">
        <ErrorHandlerDemo isError error={{ status: 403 }} permitted />
      </ShowcaseSection>
      <ShowcaseSection title="Success state" delay={0.2} className="w-full">
        <ErrorHandlerDemo data={{ ok: true }} permitted />
      </ShowcaseSection>
      <ShowcaseSection title="Alert.Error (primitive)" delay={0.25} className="w-full">
        <Alert.Error message="Standalone error alert from the alert module." />
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
