import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, FileIcon, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/common/buttons";
import Switch from "@/components/common/inputs/switch/switch";
import FileUploader from "@/components/compound/file-uploader";
import UploadBackgroundImage, {
  UploadErrorBackgroundImage,
  UploadSuccessBackgroundImage,
  UploadingBackgroundImage,
} from "@/components/compound/file-uploader/background";
import { toast } from "@/components/common/sonner";
import { useShowcasePage } from "@/features/catalog/i18n";
import { CatalogPageShell } from "@/features/catalog/ui/catalog-page-shell";
import { ShowcaseSection } from "@/features/catalog/ui/showcase-section";
import { useLanguage } from "@/lib/language/client";
import { cn } from "@/lib";

const ACCEPTED_IMAGE_TYPES = ["png", "jpg", "jpeg", "webp"] as const;
const MAX_FILE_SIZE_MB = 1;

type UploadPhase = "idle" | "uploading" | "success" | "error";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileNames(file: File | File[] | null): string[] {
  if (!file) return [];
  return Array.isArray(file) ? file.map((item) => item.name) : [file.name];
}

function ShowcaseRow({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

function DropZonePreview({
  background,
  message,
  tone = "default",
}: {
  background: ReactNode;
  message: ReactNode;
  tone?: "default" | "uploading" | "success" | "error";
}) {
  const toneClasses: Record<typeof tone, string> = {
    default: "border-border bg-muted/10",
    uploading: "border-primary/40 bg-primary/5",
    success: "border-success/40 bg-success/5",
    error: "border-error/40 bg-error/5",
  };

  return (
    <div
      className={cn(
        "relative flex min-h-52 w-full flex-col items-center justify-end gap-4 rounded-lg border border-dashed p-4",
        toneClasses[tone],
      )}
    >
      {background}
      <div className="text-foreground z-1 px-2 text-center text-sm">{message}</div>
    </div>
  );
}

function SelectedFilesList({
  files,
  emptyLabel,
}: {
  files: File | File[] | null;
  emptyLabel: string;
}) {
  const names = getFileNames(files);

  if (names.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{emptyLabel}</p>
    );
  }

  return (
    <ul className="flex w-full flex-col gap-2">
      {names.map((name) => (
        <li
          key={name}
          className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm"
        >
          <FileIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 truncate">{name}</span>
        </li>
      ))}
    </ul>
  );
}

function FileMetaPanel({
  file,
  labels,
}: {
  file: File | null;
  labels: {
    empty: string;
    name: string;
    size: string;
    type: string;
  };
}) {
  if (!file) {
    return <p className="text-sm text-muted-foreground">{labels.empty}</p>;
  }

  return (
    <div className="w-full rounded-lg border border-border bg-muted/20 p-4 text-sm">
      <dl className="grid gap-2 sm:grid-cols-3">
        <div>
          <dt className="text-muted-foreground">{labels.name}</dt>
          <dd className="truncate font-medium">{file.name}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{labels.size}</dt>
          <dd className="font-medium">{formatFileSize(file.size)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{labels.type}</dt>
          <dd className="font-medium">{file.type || "—"}</dd>
        </div>
      </dl>
    </div>
  );
}

export function FileUploaderPage() {
  const p = useShowcasePage("file-uploader");
  const { t } = useLanguage();

  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[] | null>(null);
  const [controlledFile, setControlledFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPreviewFile, setDragPreviewFile] = useState<File | null>(null);

  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);

  useEffect(() => {
    if (uploadPhase !== "uploading" || !uploadedFile) return;

    const timer = window.setTimeout(() => {
      setUploadPhase(simulateFailure ? "error" : "success");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [uploadPhase, uploadedFile, simulateFailure]);

  const resetUploadFlow = () => {
    setUploadPhase("idle");
    setUploadedFile(null);
  };

  const startUploadFlow = (file: File | File[]) => {
    const selected = Array.isArray(file) ? file[0] : file;
    if (!selected) return;
    setUploadedFile(selected);
    setUploadPhase("uploading");
  };

  return (
    <CatalogPageShell slug="file-uploader">
      <ShowcaseSection
        title={p("dropZone.title")}
        description={p("dropZone.description")}
        layout="stack"
        className="w-full"
      >
        <FileUploader />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("singleFile.title")}
        description={p("singleFile.description")}
        layout="stack"
      >
        <FileUploader
          handleChange={(file) => {
            if (file instanceof File) setSingleFile(file);
          }}
        />
        <FileMetaPanel
          file={singleFile}
          labels={{
            empty: p("singleFile.empty"),
            name: p("singleFile.nameLabel"),
            size: p("singleFile.sizeLabel"),
            type: p("singleFile.typeLabel"),
          }}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("multipleFiles.title")}
        description={p("multipleFiles.description")}
        layout="stack"
      >
        <FileUploader
          multiple
          handleChange={(files) => {
            if (Array.isArray(files)) setMultipleFiles(files);
          }}
        />
        <SelectedFilesList
          files={multipleFiles}
          emptyLabel={p("multipleFiles.empty")}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("acceptedTypes.title")}
        description={p("acceptedTypes.description", {
          types: ACCEPTED_IMAGE_TYPES.join(", "),
        })}
        layout="stack"
      >
        <FileUploader
          types={[...ACCEPTED_IMAGE_TYPES]}
          onTypeError={() => toast.error(p("acceptedTypes.typeError"))}
          handleChange={(file) => {
            if (file instanceof File) {
              toast.success(p("acceptedTypes.success", { name: file.name }));
            }
          }}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("sizeLimits.title")}
        description={p("sizeLimits.description", { max: MAX_FILE_SIZE_MB })}
        layout="stack"
      >
        <FileUploader
          maxSize={MAX_FILE_SIZE_MB}
          onSizeError={() => toast.error(p("sizeLimits.sizeError", { max: MAX_FILE_SIZE_MB }))}
          handleChange={(file) => {
            if (file instanceof File) {
              toast.success(p("sizeLimits.success", { name: file.name }));
            }
          }}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("disabled.title")}
        description={p("disabled.description")}
        layout="stack"
      >
        <FileUploader disabled />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("controlled.title")}
        description={p("controlled.description")}
        layout="stack"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outlined"
            onClick={() => setControlledFile(null)}
            disabled={!controlledFile}
          >
            {p("controlled.clear")}
          </Button>
          <p className="text-sm text-muted-foreground">
            {p("controlled.current", {
              value: controlledFile
                ? controlledFile.name
                : p("controlled.none"),
            })}
          </p>
        </div>
        <FileUploader
          fileOrFiles={controlledFile}
          handleChange={(file) => {
            if (file instanceof File) setControlledFile(file);
          }}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("dragging.title")}
        description={p("dragging.description")}
        layout="stack"
      >
        <div
          className={cn(
            "rounded-lg border px-4 py-2 text-sm transition-colors",
            isDragging
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-border bg-muted/20 text-muted-foreground",
          )}
        >
          {isDragging ? p("dragging.active") : p("dragging.idle")}
        </div>
        <FileUploader
          onDraggingStateChange={setIsDragging}
          handleChange={(file) => {
            if (file instanceof File) setDragPreviewFile(file);
          }}
        />
        <FileMetaPanel
          file={dragPreviewFile}
          labels={{
            empty: p("dragging.empty"),
            name: p("singleFile.nameLabel"),
            size: p("singleFile.sizeLabel"),
            type: p("singleFile.typeLabel"),
          }}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title={p("visualStates.title")}
        description={p("visualStates.description")}
        layout="stack"
      >
        <div className="grid w-full gap-4 md:grid-cols-2">
          <ShowcaseRow label={p("visualStates.idle")}>
            <DropZonePreview
              tone="default"
              background={
                <UploadBackgroundImage className="absolute top-5/12 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              }
              message={
                <>
                  <span>{t("common.dragAndDropFileHere")}</span>{" "}
                  <span>{t("common.or")}</span>{" "}
                  <span className="font-bold underline">{t("common.chooseAFile")}</span>
                </>
              }
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("visualStates.uploading")}>
            <DropZonePreview
              tone="uploading"
              background={
                <UploadingBackgroundImage className="absolute top-5/12 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              }
              message={p("visualStates.uploadingMessage")}
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("visualStates.success")}>
            <DropZonePreview
              tone="success"
              background={
                <UploadSuccessBackgroundImage className="absolute top-5/12 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              }
              message={
                <span className="inline-flex items-center gap-2 text-success">
                  <CheckCircle2 className="size-4" />
                  {p("visualStates.successMessage")}
                </span>
              }
            />
          </ShowcaseRow>
          <ShowcaseRow label={p("visualStates.error")}>
            <DropZonePreview
              tone="error"
              background={
                <UploadErrorBackgroundImage className="absolute top-5/12 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              }
              message={
                <span className="inline-flex items-center gap-2 text-error">
                  <XCircle className="size-4" />
                  {p("visualStates.errorMessage")}
                </span>
              }
            />
          </ShowcaseRow>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        title={p("uploadFlow.title")}
        description={p("uploadFlow.description")}
        layout="stack"
      >
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Switch
              active={simulateFailure}
              onChange={setSimulateFailure}
              id="upload-failure-switch"
            />
            {p("uploadFlow.simulateFailure")}
          </label>
          {uploadPhase !== "idle" ? (
            <Button size="sm" variant="outlined" onClick={resetUploadFlow}>
              <RotateCcw className="size-4" />
              {p("uploadFlow.reset")}
            </Button>
          ) : null}
        </div>

        {uploadPhase === "idle" ? (
          <FileUploader handleChange={startUploadFlow} />
        ) : null}

        {uploadPhase === "uploading" ? (
          <DropZonePreview
            tone="uploading"
            background={
              <UploadingBackgroundImage className="absolute top-5/12 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            }
            message={p("uploadFlow.uploading", { name: uploadedFile?.name ?? "" })}
          />
        ) : null}

        {uploadPhase === "success" ? (
          <DropZonePreview
            tone="success"
            background={
              <UploadSuccessBackgroundImage className="absolute top-5/12 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            }
            message={
              <span className="inline-flex items-center gap-2 text-success">
                <CheckCircle2 className="size-4" />
                {p("uploadFlow.success", { name: uploadedFile?.name ?? "" })}
              </span>
            }
          />
        ) : null}

        {uploadPhase === "error" ? (
          <DropZonePreview
            tone="error"
            background={
              <UploadErrorBackgroundImage className="absolute top-5/12 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            }
            message={
              <span className="inline-flex flex-col items-center gap-2 text-error">
                <span className="inline-flex items-center gap-2">
                  <XCircle className="size-4" />
                  {p("uploadFlow.error", { name: uploadedFile?.name ?? "" })}
                </span>
                <Button size="sm" variant="outlined" onClick={resetUploadFlow}>
                  {p("uploadFlow.tryAgain")}
                </Button>
              </span>
            }
          />
        ) : null}
      </ShowcaseSection>
    </CatalogPageShell>
  );
}
