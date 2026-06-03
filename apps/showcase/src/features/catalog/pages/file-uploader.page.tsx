import FileUploader from "@/components/compound/file-uploader";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";

export function FileUploaderPage() {
  return (
    <CatalogPageShell slug="file-uploader">
      <ShowcaseSection title="Drop zone" className="w-full">
        <div className="w-full max-w-xl">
          <FileUploader onChange={() => undefined} />
        </div>
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
