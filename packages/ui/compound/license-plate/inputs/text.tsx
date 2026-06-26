"use client";

import { forwardRef, useEffect, useState } from "react";

/* ---------------------------------- Types --------------------------------- */
type HtmlInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type Props = Omit<HtmlInputProps, "onChange"> & {
  onFinish: (value: string, colorCode?: string) => void;
  onPrev?: () => void;
  onChange?: (value?: number) => void;
  onClick?: () => void;
  value?: string;
  disabled?: boolean;
  containerWidth?: number | string;
  id?: string;
};

/* ------------------------------ Main Function ----------------------------- */
const Text = forwardRef<HTMLDivElement, Props>(
  ({ onFinish, onPrev, containerWidth, id, onClick, ...props }: Props, ref) => {
    const [value, setValue] = useState<string | undefined>(props.value);
    const inputId = id || "plate-text-input";

    /* --------------------------------- Effects -------------------------------- */
    useEffect(() => {
      setValue(props.value);
    }, [props.value]);

    /* ----------------------------------- JSX ---------------------------------- */
    return (
      <div className="w-full" onClick={onClick}>
        <div
          ref={ref}
          id={inputId}
          className="flex h-full w-full cursor-pointer items-center justify-center text-[22px] font-extrabold"
        >
          {value}
        </div>
      </div>
    );
  },
);

Text.displayName = "Text";

export default Text;
