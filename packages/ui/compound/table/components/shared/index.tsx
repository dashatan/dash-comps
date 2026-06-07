import { cn, formatPersianTime, formatPersianDate } from '@/lib'
import { DivProps } from '@/lib/types'
import { Minus } from 'lucide-react'
import { ReactNode } from 'react'
import { ColorType, colorFieldVariants } from '@/components/common/badge/color'

function formatNumber(value: number) {
  return Intl.NumberFormat().format(Math.round(value || 0))
}

export type TableCellTextFieldProps = {
  value?: string | number;
  prefix?: string;
  justify?: "center" | "start" | "end";
  className?: string;
  onClick?: () => void;
  emptyValue?: string | ReactNode;
};

export function TableCellTextField({
  value,
  prefix,
  justify = "center",
  className,
  onClick,
  emptyValue,
}: TableCellTextFieldProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 px-4",
        {
          "justify-center": justify === "center",
          "justify-start": justify === "start",
          "justify-end": justify === "end",
          "cursor-pointer": onClick,
        },
        className,
      )}
    >
      {!value ? (
        (emptyValue ?? <TableNoContent />)
      ) : (
        <>
          <span>{value}</span>
          <span>{prefix}</span>
        </>
      )}
    </div>
  );
}

export function TableHeaderCell({
  value,
  prefix,
  justify = "center",
  className,
  ...props
}: DivProps & TableCellTextFieldProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full items-center gap-2",
        {
          "justify-center": justify === "center",
          "justify-start": justify === "start",
          "justify-end": justify === "end",
        },
        className,
      )}
    >
      {props.children ||
        (!value ? (
          <TableNoContent />
        ) : (
          <>
            <span>{value}</span>
            <span>{prefix}</span>
          </>
        ))}
    </div>
  );
}

export function TableCellLinkButton({ text, icon }: { text: string; icon: ReactNode }) {
  return (
    <div className="flex h-10 items-center gap-2 px-2">
      <span className="w-6">{icon}</span>
      <div className="h-full w-px" />
      <span className="w-full text-sm font-medium">{text}</span>
    </div>
  );
}

export type NumberFieldProps = {
  value?: number;
  prefix?: string | ReactNode;
  suffix?: string | ReactNode;
  className?: string;
  valueClassName?: string;
  prefixClassName?: string;
  justify?: "center" | "start" | "end";
};
export function TableCellNumberField({
  value,
  prefix,
  suffix,
  className,
  valueClassName,
  prefixClassName,
  justify = "center",
}: NumberFieldProps) {
  return (
    <div
      className={cn("dir-ltr flex w-full items-center gap-1", className, {
        "justify-center": justify === "center",
        "justify-start": justify === "start",
        "justify-end": justify === "end",
      })}
    >
      <span className={cn("", prefixClassName)}>{prefix}</span>
      <span className={cn("", valueClassName)}>{formatNumber(value ?? 0)}</span>
      <span className={cn("", prefixClassName)}>{suffix}</span>
    </div>
  );
}

export function TableNoContent(props: DivProps) {
  return (
    <div
      {...props}
      className={cn("text-hint flex items-center justify-center", props.className)}
    >
      <Minus className="size-5" />
    </div>
  );
}

export default function TableHeaderCountBox(props: {
  label?: string;
  value?: string | number;
  className?: string;
}) {
  const value = typeof props.value === "string" ? parseFloat(props.value) : props.value;
  const formattedValue = formatNumber(value ?? 0);
  return (
    <div
      className={cn(
        "flex h-20 flex-col items-center justify-center border-e px-6 pe-8",
        props.className,
      )}
    >
      <span className="text-hint text-xs font-semibold">{props.label}</span>
      <span className="text-xl font-semibold">{formattedValue}</span>
    </div>
  );
}

export function TableCellDateField({
  value,
  justify = "center",
}: {
  value?: number | string | null;
  justify?: "center" | "start" | "end";
}) {
  return (
    <div
      className={cn("flex w-full items-center gap-2", {
        "justify-center": justify === "center",
        "justify-start": justify === "start",
        "justify-end": justify === "end",
      })}
    >
      <span>{formatPersianDate(value) || <TableNoContent />}</span>
    </div>
  );
}

export function TableCellTimeField({
  value,
  justify = "center",
}: {
  value?: number | string;
  justify?: "center" | "start" | "end";
}) {
  return (
    <div
      className={cn("flex items-center gap-2", {
        "justify-center": justify === "center",
        "justify-start": justify === "start",
        "justify-end": justify === "end",
      })}
    >
      <span>{formatPersianTime(value) || <TableNoContent />}</span>
    </div>
  );
}

export function TableCellDateTimeField({
  value,
  justify = 'center',
}: {
  value?: number | string
  justify?: 'center' | 'start' | 'end'
}) {
  return (
    <div
      className={cn('flex flex-row-reverse items-center gap-2', {
        'justify-center': justify === 'center',
        'justify-start': justify === 'start',
        'justify-end': justify === 'end',
      })}
    >
      <span>{formatPersianDate(value) || <TableNoContent />}</span>
      <span>{formatPersianTime(value) || <TableNoContent />}</span>
    </div>
  )
}

/** Macro-style combined time | date cell with divider (tracker parity) */
export function TableCellDateElement({
  val,
  className,
  justify = 'start',
}: {
  val?: number | null
  className?: string
  justify?: 'center' | 'start' | 'end'
}) {
  if (!val) {
    return (
      <div
        className={cn('flex items-center gap-2', className, {
          'justify-start': justify === 'start',
          'justify-center': justify === 'center',
          'justify-end': justify === 'end',
        })}
      >
        <TableNoContent />
      </div>
    )
  }
  return (
    <div
      className={cn('flex items-center gap-2', className, {
        'justify-start': justify === 'start',
        'justify-center': justify === 'center',
        'justify-end': justify === 'end',
      })}
    >
      <span className="w-20 border-e border-slate-300 pl-2 text-left">{formatPersianTime(val)}</span>
      <span>{formatPersianDate(val)}</span>
    </div>
  )
}

/** @deprecated Use TableCellDateElement */
export const DateElement = TableCellDateElement

export function TableCellColorDot({ color }: { color?: ColorType }) {
  return (
    <span
      className={cn('inline-block h-2 w-2 rounded-sm', colorFieldVariants({ color: color ?? 'gray' }))}
    />
  )
}

/** @deprecated Use TableCellColorDot */
export const ColorDot = TableCellColorDot
