import Button from "@/components/common/buttons";
import { ArrowLeft3 } from "iconsax-reactjs";

interface NextBtnProps {
  disabled?: boolean;
  onClick: () => void;
}

export default function NextBtn({ onClick, disabled }: NextBtnProps) {
  return (
    <Button
      className="bg-neutral-800 focus-visible:ring-0"
      onClick={onClick}
      disabled={disabled}
      variant="contained"
      severity="info"
      size={"xl"}
    >
      <ArrowLeft3
        color={disabled ? "var(--color-gray-500)" : "var(--color-white)"}
        stroke={disabled ? "var(--color-gray-500)" : "var(--color-white)"}
      />
    </Button>
  );
}
