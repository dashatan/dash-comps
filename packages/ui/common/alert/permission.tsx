import { Lock } from "lucide-react";
import Alert from "@/components/common/alert/alert";
import { useLanguage } from "@/lib";

export default function PermissionAlert() {
  const { t } = useLanguage();

  return (
    <Alert severity="danger" animation="flipUp">
      <Alert.Icon>
        <Lock />
      </Alert.Icon>
      <Alert.Description>{t("errors.noPermission")}</Alert.Description>
    </Alert>
  );
}
