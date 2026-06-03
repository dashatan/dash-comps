import Button from "@/components/common/buttons";
import { cn } from "@/lib";

interface ScrollTabItemProps {
  onClick: () => void;
  isActive: boolean;
  label: string;
}

export default function ScrollTabItem({ isActive, label, onClick }: ScrollTabItemProps) {
  return (
    <Button
      className={cn("text-md w-full bg-[#1a1a1a] text-white focus-visible:ring-0")}
      variant={isActive ? "outlined" : "contained"}
      size={"xl"}
      severity="info"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
