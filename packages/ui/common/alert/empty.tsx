import { SearchX } from "lucide-react";
import BaseAlert from "./base-alert";
import { useLanguage } from "@/lib";
import { AlertProps } from ".";

export default function EmptyAlert({ message }: AlertProps) {
  const { t } = useLanguage();
  return (
    <BaseAlert
      icon={<SearchX size={40} />}
      message={message || t("errors.empty")}
      animation="animate-shake"
      className="text-icon"
    />
  );
}
