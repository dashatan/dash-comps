"use client";

import TextInput, { TextInputProps } from "@/components/common/inputs/text";
import PasswordToggle from "@/components/common/inputs/text/password-toggle";
import { useState, forwardRef, useRef } from "react";

const PasswordInput = forwardRef<
  HTMLInputElement,
  TextInputProps & { passShow?: boolean }
>((props, forwardedRef) => {
  const [passShow, setPassShow] = useState(props.passShow);
  const ref = useRef<HTMLInputElement>(null);

  const handleToggle = (active: boolean) => {
    setPassShow(active);
    ref.current?.focus();
  };

  return (
    <TextInput
      {...props}
      type={passShow ? "text" : "password"}
      suffix={
        <PasswordToggle
          active={passShow}
          onChange={(a) => handleToggle(a)}
          size={props.size}
        />
      }
      className="dir-ltr px-4 py-0 pt-0.5"
      ref={ref}
    />
  );
});

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
