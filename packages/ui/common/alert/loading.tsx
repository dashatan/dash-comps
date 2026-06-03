import BaseAlert from "./base-alert";
import { AlertProps } from ".";
import { Truck } from "iconsax-reactjs";

export default function LoadingAlert({ message }: AlertProps) {
  return (
    <BaseAlert
      icon={
        <Truck
          variant="Bulk"
          className="animate-shake animation-duration-[3000ms] animate-infinite size-10"
        />
      }
      message={message}
      className="text-icon"
      animation=""
    >
      <div className="bg-border h-px w-20 rounded-full" />
    </BaseAlert>
  );
}
