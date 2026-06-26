import { SearchX } from "lucide-react";
import { cn, useLanguage } from "@/lib";

export default function EmptyTemplate(props?: { size?: "sm" | "lg" }) {
  const { t } = useLanguage();
  return (
    <div
      className={cn(
        "absolute top-1/2 flex w-full flex-full flex-col items-center justify-center gap-4",
        {
          "flex-row gap-2": props?.size === "sm",
        },
      )}
    >
      <div
        className={cn("flex rounded-full", {
          "-mt-2": props?.size === "sm",
        })}
      >
        <SearchX
          className={cn("size-18 text-foreground opacity-40", {
            "size-8": props?.size === "sm",
          })}
        />
      </div>
      <span
        className={cn("text-xl font-semibold text-foreground opacity-40", {
          "text-lg": props?.size === "sm",
        })}
      >
        {t("common.noResult")}
      </span>
    </div>
  );
}
