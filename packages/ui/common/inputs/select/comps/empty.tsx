import { useLanguage } from "@/lib";

export default function EmptyTemplate() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="my-4 text-sm font-semibold text-muted-foreground">
        {t("common.noResult")}
      </span>
    </div>
  );
}
