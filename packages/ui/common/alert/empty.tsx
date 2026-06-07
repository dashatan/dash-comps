import { SearchX } from "lucide-react";
import Alert from "@/components/common/alert/alert";
import { useLanguage } from "@/lib";
import type { LegacyAlertProps } from "@/components/common/alert/types";

export default function EmptyAlert({ message }: LegacyAlertProps) {
  const { t } = useLanguage();

  return (
    <Alert severity="muted" animation="shake">
      <Alert.Icon>
        <SearchX />
      </Alert.Icon>
      <Alert.Description>{message || t("errors.empty")}</Alert.Description>
    </Alert>
  );
}
