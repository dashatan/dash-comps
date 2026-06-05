import { Button } from "@/components/common/buttons";
import { Toaster, toast } from "@/components/common/sonner";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function SonnerPage() {
  const p = useShowcasePage("sonner");

  return (
    <CatalogPageShell slug="sonner">
      <Toaster />
      <ShowcaseSection title={p("toastVariants.title")}>
        <Button onClick={() => toast.success(p("toastVariants.toasts.savedSuccessfully"))}>
          {p("toastVariants.buttons.success")}
        </Button>
        <Button
          severity="danger"
          onClick={() => toast.error(p("toastVariants.toasts.somethingWrong"))}
        >
          {p("toastVariants.buttons.error")}
        </Button>
        <Button
          severity="warning"
          onClick={() => toast.warning(p("toastVariants.toasts.checkInput"))}
        >
          {p("toastVariants.buttons.warning")}
        </Button>
        <Button
          severity="info"
          variant="outlined"
          onClick={() => toast.info(p("toastVariants.toasts.headsUp"))}
        >
          {p("toastVariants.buttons.info")}
        </Button>
      </ShowcaseSection>
      <ShowcaseSection title={p("withDescription.title")} delay={0.05}>
        <Button
          variant="outlined"
          onClick={() =>
            toast.success(p("withDescription.toastTitle"), {
              description: p("withDescription.description"),
            })
          }
        >
          {p("withDescription.button")}
        </Button>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
