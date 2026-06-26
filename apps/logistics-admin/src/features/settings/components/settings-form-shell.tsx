import type { ReactNode } from "react";
import Button from "@/components/common/buttons";
import { toast } from "@/components/common/sonner";
import { useLogisticsT } from "@/i18n/provider";

export function DemoFormFooter({
  onSave,
  onReset,
  saveLabel,
  resetLabel,
}: {
  onSave?: () => void;
  onReset?: () => void;
  saveLabel?: string;
  resetLabel?: string;
}) {
  const t = useLogisticsT();

  const handleSave = () => {
    toast.success(t("settings.demo.saved"));
    onSave?.();
  };

  const handleReset = () => {
    onReset?.();
    toast.info(t("settings.demo.reset"));
  };

  return (
    <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-end gap-3 border-t border-border bg-background/95 px-6 py-4 backdrop-blur-sm">
      {onReset ? (
        <Button variant="outlined" severity="secondary" onClick={handleReset}>
          {resetLabel ?? t("settings.demo.resetAction")}
        </Button>
      ) : null}
      <Button variant="contained" severity="primary" onClick={handleSave}>
        {saveLabel ?? t("settings.demo.saveAction")}
      </Button>
    </div>
  );
}

export function SettingsField({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/10 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
