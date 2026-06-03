import { useLanguage } from "@/lib";
import BaseAlert from "./base-alert";
import { AlertTriangle } from "lucide-react";
import { AlertProps } from ".";

export default function DataError({ message }: AlertProps) {
  const { t } = useLanguage();
  return (
    <BaseAlert
      icon={<AlertTriangle size={38} />}
      message={message || t("errors.fetch")}
      className="text-icon"
    />
  );
}
