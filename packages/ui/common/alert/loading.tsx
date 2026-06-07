import { Truck } from "iconsax-reactjs";
import Alert from "@/components/common/alert/alert";
import type { LegacyAlertProps } from "@/components/common/alert/types";

export default function LoadingAlert({ message }: LegacyAlertProps) {
  return (
    <Alert severity="muted" animation="none">
      <Alert.Icon>
        <Truck
          variant="Bulk"
          className="animate-shake animation-duration-[3000ms] animate-infinite"
        />
      </Alert.Icon>
      {message ? <Alert.Description>{message}</Alert.Description> : null}
      <Alert.Divider />
    </Alert>
  );
}
