import Button from "@/components/common/buttons";
import { ArrowRight3 } from "iconsax-reactjs";

interface PrevBtnProps {
  disabled?: boolean;
  onClick: () => void;
}

export default function PrevBtn({ disabled, onClick }: PrevBtnProps) {
  return (
    <Button
      className="bg-neutral-800 focus-visible:ring-0"
      onClick={onClick}
      disabled={disabled}
      variant="contained"
      severity="info"
      size={"xl"}
    >
      <ArrowRight3
        color={disabled ? "var(--color-gray-500)" : "var(--color-white)"}
        stroke={disabled ? "var(--color-gray-500)" : "var(--color-white)"}
      />
    </Button>
  );
}
