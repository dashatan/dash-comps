import FileUploader from "@/components/compound/file-uploader";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useShowcasePage } from "@/features/catalog/i18n";

export function FileUploaderPage() {
  const p = useShowcasePage("file-uploader");

  return (
    <CatalogPageShell slug="file-uploader">
      <ShowcaseSection title={p("dropZone.title")} className="w-full">
        <div className="w-full">
          <FileUploader />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
