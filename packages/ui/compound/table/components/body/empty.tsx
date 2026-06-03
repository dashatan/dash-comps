import { FileX, SearchX } from "lucide-react";
import { cn, useLanguage } from "@/lib";

export default function EmptyTemplate(props?: { size?: "sm" | "lg" }) {
  const { t } = useLanguage();
  return (
    <div
      className={cn(
        "flex-full absolute top-1/2 flex w-full flex-col items-center justify-center gap-4",
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
          className={cn("text-foreground size-18 opacity-40", {
            "size-8": props?.size === "sm",
          })}
        />
      </div>
      <span
        className={cn("text-foreground text-xl font-semibold opacity-40", {
          "text-lg": props?.size === "sm",
        })}
      >
        {t("common.noResult")}
      </span>
    </div>
  );
}
