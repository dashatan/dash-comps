import Alert from "@/components/common/alert/alert";
import type { LegacyAlertProps } from "@/components/common/alert/types";
import { resolveLegacyAnimationClass } from "@/components/common/alert/variants";

export type BaseAlertProps = LegacyAlertProps;

export default function BaseAlert({
  icon,
  message,
  className,
  children,
  animation,
}: BaseAlertProps) {
  const animationClass = resolveLegacyAnimationClass(animation);

  return (
    <Alert className={className} animation="none">
      {icon ? (
        <Alert.Icon className={animationClass || undefined}>{icon}</Alert.Icon>
      ) : null}
      {message ? (
        <Alert.Description className={animationClass || undefined}>
          {message}
        </Alert.Description>
      ) : null}
      {children}
    </Alert>
  );
}
