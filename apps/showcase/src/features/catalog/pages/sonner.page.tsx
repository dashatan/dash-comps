import { Button } from "@/components/common/buttons";
import { Toaster, toast } from "@/components/common/sonner";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function SonnerPage() {
  return (
    <CatalogPageShell slug="sonner">
      <Toaster />
      <ShowcaseSection title="Toast variants">
        <Button onClick={() => toast.success("Saved successfully")}>Success</Button>
        <Button severity="danger" onClick={() => toast.error("Something went wrong")}>
          Error
        </Button>
        <Button severity="warning" onClick={() => toast.warning("Check your input")}>
          Warning
        </Button>
        <Button severity="info" variant="outlined" onClick={() => toast.info("Heads up")}>
          Info
        </Button>
      </ShowcaseSection>
      <ShowcaseSection title="With description" delay={0.05}>
        <Button
          variant="outlined"
          onClick={() =>
            toast.success("Profile updated", {
              description: "Changes will appear after refresh.",
            })
          }
        >
          Success + description
        </Button>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
