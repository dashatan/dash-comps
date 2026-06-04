import { cn } from "@/lib";
import Button from "@/components/common/buttons";
import { ButtonProps } from "@/components/common/buttons/types";
import type { DateInputViewProps } from "../types";

type DateInputFooterComponentProps = Pick<
  DateInputViewProps,
  "inputProps" | "t" | "handleSubmit" | "handleClear" | "setOpen"
>;

export function DateInputFooter({
  inputProps,
  t,
  handleSubmit,
  handleClear,
  setOpen,
}: DateInputFooterComponentProps) {
  const dialogId = inputProps.id || "date-input";

  return (
    <div
      id={`${dialogId}-footer`}
      className="sticky bottom-0 mt-auto flex w-full flex-row-reverse items-center justify-start gap-2 border-t p-4"
    >
      <FooterButton
        id={`${dialogId}-ok`}
        label={t("common.ok")}
        severity="primary"
        className="min-w-32"
        onClick={handleSubmit}
      />
      <FooterButton
        id={`${dialogId}-cancel`}
        label={t("common.cancel")}
        severity="muted"
        onClick={() => setOpen(false)}
      />
      <FooterButton
        id={`${dialogId}-clear`}
        className="me-auto"
        label={t("common.remove")}
        variant="text"
        severity="danger"
        onClick={() => handleClear(true)}
      />
    </div>
  );
}

function FooterButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className={cn("h-12 min-w-24 text-base font-normal", props.className)}
    />
  );
}
