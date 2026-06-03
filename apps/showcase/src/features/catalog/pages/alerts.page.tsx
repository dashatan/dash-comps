import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { Alert } from "@/components/common/alert";

export function AlertsPage() {
  return (
    <CatalogPageShell slug="alerts">
      <ShowcaseSection title="Empty state">
        <div className="w-full">
          <Alert.Empty />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Loading" delay={0.05}>
        <div className="w-full">
          <Alert.Loading />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Error" delay={0.1}>
        <div className="w-full">
          <Alert.Error message="Something went wrong while fetching data." />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Permission denied" delay={0.15}>
        <div className="w-full">
          <Alert.Forbidden />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Custom base alert" delay={0.2}>
        <div className="w-full">
          <Alert.Base message="This is a custom alert with animation." animation="animate-bounce-in" />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
