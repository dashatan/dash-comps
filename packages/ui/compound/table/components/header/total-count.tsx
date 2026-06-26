import Skeleton from "@/components/common/skeleton";
import { useLanguage } from "@/lib";

export default function TotalCount({
  total,
  label,
  loading,
}: {
  total: number;
  label?: string;
  loading?: boolean;
}) {
  const { t } = useLanguage();
  if (loading) {
    return <Skeleton className="w[70px]" />;
  }
  return (
    <div className="flex h-full w-fit flex-col items-center justify-center border-e ps-3 pe-6">
      <span className="text-sm font-normal text-input-foreground/70">
        {label || t("common.totalCount")}
      </span>
      <span className="text-xl font-semibold">
        {total ? Intl.NumberFormat().format(total) : 0}
      </span>
    </div>
  );
}
