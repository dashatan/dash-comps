import { FileUploader as FileUploaderSrc } from "react-drag-drop-files";
import { cn } from "@/lib";
import UploadBackgroundImage from "@/components/compound/file-uploader/background";
import { useLanguage } from "@/lib";

const FileUploaderTyped: typeof FileUploaderSrc = FileUploaderSrc;

export default function FileUploader({
  className,
  ...props
}: React.ComponentProps<typeof FileUploaderTyped> & { className?: string }) {
  const { t } = useLanguage();
  return (
    <FileUploaderTyped
      {...props}
      classes="focus-within:!outline-none"
      hoverTitle={" "}
      dropMessageStyle={{
        background: "color-mix(in srgb, var(--color-muted) 10%, transparent)",
        border: "none",
      }}
    >
      <div
        className={cn(
          "relative flex min-h-64 w-full flex-col items-center justify-end gap-4 rounded-lg border border-dashed p-4",
          "cursor-pointer bg-background text-foreground",
          "bg-muted/10 hover:bg-muted/15",
          className,
        )}
      >
        <UploadBackgroundImage className="absolute top-5/12 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="z-1 flex items-center gap-1 text-foreground">
          <span>{t("common.dragAndDropFileHere")}</span>
          <span>{t("common.or")}</span>
          <span className="font-bold underline">{t("common.chooseAFile")}</span>
        </div>
      </div>
    </FileUploaderTyped>
  );
}
