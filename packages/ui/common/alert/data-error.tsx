import { AlertTriangle } from "lucide-react";
import Alert from "@/components/common/alert/alert";
import { useLanguage } from "@/lib";
import type { LegacyAlertProps } from "@/components/common/alert/types";

export default function DataError({ message }: LegacyAlertProps) {
  const { t } = useLanguage();

  return (
    <Alert severity="muted" animation="jumpIn">
      <Alert.Icon>
        <AlertTriangle />
      </Alert.Icon>
      <Alert.Description>{message || t("errors.fetch")}</Alert.Description>
    </Alert>
  );
}
