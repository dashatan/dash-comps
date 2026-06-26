import { useRef } from "react";
import { Button } from "@/components/common/buttons";
import { Toaster, toast } from "@/components/common/sonner";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

function fakeRequest(shouldFail: boolean, delayMs = 2000) {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) reject(new Error("Request failed"));
      else resolve();
    }, delayMs);
  });
}

export function SonnerPage() {
  const p = useShowcasePage("sonner");
  const loadingToastId = useRef<string | number | null>(null);

  return (
    <CatalogPageShell slug="sonner">
      <Toaster closeButton expand visibleToasts={5} />

      <ShowcaseSection
        title={p("toastVariants.title")}
        description={p("toastVariants.description")}
      >
        <Button
          onClick={() =>
            toast.success(p("toastVariants.toasts.savedSuccessfully"))
          }
        >
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

      <ShowcaseSection
        title={p("withDescription.title")}
        description={p("withDescription.description")}
      >
        <Button
          onClick={() =>
            toast.success(p("withDescription.toasts.successTitle"), {
              description: p("withDescription.descriptions.success"),
            })
          }
        >
          {p("withDescription.buttons.success")}
        </Button>
        <Button
          severity="danger"
          onClick={() =>
            toast.error(p("withDescription.toasts.errorTitle"), {
              description: p("withDescription.descriptions.error"),
            })
          }
        >
          {p("withDescription.buttons.error")}
        </Button>
        <Button
          severity="warning"
          onClick={() =>
            toast.warning(p("withDescription.toasts.warningTitle"), {
              description: p("withDescription.descriptions.warning"),
            })
          }
        >
          {p("withDescription.buttons.warning")}
        </Button>
        <Button
          severity="info"
          variant="outlined"
          onClick={() =>
            toast.info(p("withDescription.toasts.infoTitle"), {
              description: p("withDescription.descriptions.info"),
            })
          }
        >
          {p("withDescription.buttons.info")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("multipleDescriptions.title")}
        description={p("multipleDescriptions.description")}
      >
        <Button
          severity="danger"
          variant="outlined"
          onClick={() =>
            toast.error(p("multipleDescriptions.toastTitle"), {
              descriptions: [
                p("multipleDescriptions.lines.first"),
                p("multipleDescriptions.lines.second"),
                p("multipleDescriptions.lines.third"),
              ],
            })
          }
        >
          {p("multipleDescriptions.button")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("defaultMessage.title")}
        description={p("defaultMessage.description")}
      >
        <Button
          variant="outlined"
          onClick={() => toast.message(p("defaultMessage.toast"))}
        >
          {p("defaultMessage.button")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("loading.title")}
        description={p("loading.description")}
      >
        <Button
          variant="outlined"
          onClick={() => {
            loadingToastId.current = toast.loading(p("loading.toast"));
          }}
        >
          {p("loading.showButton")}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            if (loadingToastId.current != null) {
              toast.dismiss(loadingToastId.current);
              loadingToastId.current = null;
            }
          }}
        >
          {p("loading.dismissButton")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("promise.title")}
        description={p("promise.description")}
      >
        <Button
          onClick={() =>
            toast.promise(fakeRequest(false), {
              loading: p("promise.loading"),
              success: p("promise.success"),
              error: p("promise.error"),
            })
          }
        >
          {p("promise.resolveButton")}
        </Button>
        <Button
          severity="danger"
          variant="outlined"
          onClick={() =>
            toast.promise(fakeRequest(true), {
              loading: p("promise.loading"),
              success: p("promise.success"),
              error: p("promise.error"),
            })
          }
        >
          {p("promise.rejectButton")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("actionButton.title")}
        description={p("actionButton.description")}
      >
        <Button
          onClick={() =>
            toast.success(p("actionButton.toastTitle"), {
              description: p("actionButton.descriptionText"),
              action: {
                label: p("actionButton.actionLabel"),
                onClick: () => toast.info(p("actionButton.actionFeedback")),
              },
            })
          }
        >
          {p("actionButton.button")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("cancelButton.title")}
        description={p("cancelButton.description")}
      >
        <Button
          severity="warning"
          onClick={() =>
            toast.warning(p("cancelButton.toastTitle"), {
              description: p("cancelButton.descriptionText"),
              cancel: {
                label: p("cancelButton.cancelLabel"),
                onClick: () => toast.info(p("cancelButton.cancelFeedback")),
              },
              action: {
                label: p("cancelButton.confirmLabel"),
                onClick: () => toast.success(p("cancelButton.confirmFeedback")),
              },
            })
          }
        >
          {p("cancelButton.button")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("closeButton.title")}
        description={p("closeButton.description")}
      >
        <Button
          variant="outlined"
          onClick={() =>
            toast.info(p("closeButton.toast"), {
              closeButton: true,
              duration: Number.POSITIVE_INFINITY,
            })
          }
        >
          {p("closeButton.button")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("duration.title")}
        description={p("duration.description")}
      >
        <Button
          variant="outlined"
          onClick={() =>
            toast.info(p("duration.shortToast"), {
              duration: 2000,
            })
          }
        >
          {p("duration.shortButton")}
        </Button>
        <Button
          variant="outlined"
          onClick={() =>
            toast.info(p("duration.persistentToast"), {
              duration: Number.POSITIVE_INFINITY,
            })
          }
        >
          {p("duration.persistentButton")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("stacking.title")}
        description={p("stacking.description")}
      >
        <Button
          onClick={() => {
            toast.success(p("stacking.toasts.success"));
            toast.info(p("stacking.toasts.info"));
            toast.warning(p("stacking.toasts.warning"));
            toast.error(p("stacking.toasts.error"));
          }}
        >
          {p("stacking.button")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dismissAll.title")}
        description={p("dismissAll.description")}
      >
        <Button
          variant="outlined"
          onClick={() => {
            toast.success(p("dismissAll.sampleOne"));
            toast.info(p("dismissAll.sampleTwo"));
          }}
        >
          {p("dismissAll.showButton")}
        </Button>
        <Button
          severity="danger"
          variant="outlined"
          onClick={() => toast.dismiss()}
        >
          {p("dismissAll.dismissButton")}
        </Button>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("custom.title")}
        description={p("custom.description")}
      >
        <Button
          variant="outlined"
          onClick={() =>
            toast.custom((id) => (
              <div className="flex w-full items-center gap-4 rounded-xl border border-border bg-card p-4 text-foreground shadow-lg">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">
                    {p("custom.toastTitle")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p("custom.toastBody")}
                  </p>
                </div>
                <Button size="sm" onClick={() => toast.dismiss(id)}>
                  {p("custom.dismissLabel")}
                </Button>
              </div>
            ))
          }
        >
          {p("custom.button")}
        </Button>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
