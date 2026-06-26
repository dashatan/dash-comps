import { cn } from "@/lib";
import Number from "../inputs/number";
import Text from "../inputs/text";
import { forwardRef, useEffect, useRef, useState, useCallback } from "react";
import {
  colors,
  getPlateForegroundColorVariable,
} from "@/components/compound/license-plate/utils/color-classes";
import { lettersColorCodes } from "@/components/compound/license-plate/utils/letters";
import {
  CarPlateInputProps,
  CarPlateInputValue,
} from "@/components/compound/license-plate/types";
import {
  normalizeCarToPlateValue,
  normalizePlateValueToCar,
} from "@/components/compound/license-plate/utils";
import { usePlateClipboardActions } from "../hooks";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/common/overlay/popover";
import LettersBox from "@/components/compound/license-plate/components/letters-box";
import { MoveDir } from "@/components/compound/license-plate/components/letters-box";
import IranPlateIcon from "@/components/common/icons/iran-plate";

const CarPlate = forwardRef<HTMLDivElement, CarPlateInputProps>(
  (props, ref) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const {
      onChange,
      defaultValue,
      colorCode: initialColorCode,
      clear,
      onClear,
      disabled,
      readonly,
      className,
      containerWidth,
      id,
    } = props;

    const [colorCode, setColorCode] = useState<string | undefined>(
      initialColorCode,
    );
    const [localValues, setLocalValues] = useState<
      CarPlateInputValue | undefined
    >(normalizePlateValueToCar(defaultValue));
    const [isHovered, setIsHovered] = useState(false);
    const bg =
      colorCode && colors[colorCode]
        ? colors[colorCode]
        : "bg-plate-background text-plate-foreground";
    const foregroundVariable = getPlateForegroundColorVariable(colorCode);
    const [open, setOpen] = useState(false);

    // Reset on clear
    useEffect(() => {
      if (clear) {
        setLocalValues(normalizePlateValueToCar());
        setColorCode(undefined);
        onClear?.(false);
      }
    }, [clear, onClear]);

    // Set color code from defaultValue letter
    useEffect(() => {
      if (defaultValue?.p3) {
        const code = lettersColorCodes.find(
          (x) => x.letter === defaultValue.p3,
        )?.colorCode;
        setColorCode(code || undefined);
      } else {
        setColorCode(undefined);
      }
      if (
        JSON.stringify(localValues) !==
        JSON.stringify(normalizePlateValueToCar(defaultValue))
      ) {
        setLocalValues(normalizePlateValueToCar(defaultValue));
      }
    }, [defaultValue]);

    // Handlers
    const handleFinish = useCallback(
      ({
        key,
        colorCode,
        index,
        val,
      }: {
        key: keyof CarPlateInputValue;
        val?: string | number | null;
        colorCode?: string;
        index?: number;
      }) => {
        if (disabled || readonly) return;
        const nextRef = inputRefs.current[(index || 0) + 1];
        const newVal = { ...localValues, [key]: val };
        setLocalValues(newVal);
        onChange?.(normalizeCarToPlateValue(newVal));

        if (index === 1) setColorCode(colorCode || undefined);
        if (index === 0) {
          nextRef?.click();
        }
        if (index !== undefined && index < 3) nextRef?.focus();
      },
      [disabled, readonly, localValues, onChange],
    );

    const handleChange = useCallback(
      (key: keyof CarPlateInputValue, val?: string | number) => {
        if (disabled || readonly) return;
        const newVal = { ...localValues, [key]: val };
        setLocalValues(newVal);
        onChange?.(normalizeCarToPlateValue(newVal));
      },
      [disabled, readonly, localValues, onChange],
    );

    // Use clipboard actions hook
    const { handleCopy, handlePaste, buttons } = usePlateClipboardActions(
      localValues,
      setLocalValues,
      setColorCode,
      onChange,
      disabled,
      readonly,
    );

    const handleKeyDown = useCallback(
      (
        i: number,
        e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>,
      ) => {
        if (disabled || readonly) return;

        const key = `p${i + 1}` as keyof CarPlateInputValue;
        if (e.key === "Backspace") {
          if (!localValues?.[key] && i > 0) {
            const prevRef = inputRefs.current[i - 1];
            prevRef?.click();
            prevRef?.focus();
            e.preventDefault();
            return;
          }
          if (localValues?.[key]) handleChange(key, "");
        }
        if (!e.shiftKey && e.key === "Tab") {
          e.preventDefault();
          if (i === 0) {
            inputRefs.current[1]?.click();
            return;
          } else {
            inputRefs.current[i + 1]?.focus();
            return;
          }
        }
        if (e.shiftKey && e.key === "Tab") {
          e.preventDefault();
          if (i === 2) {
            inputRefs.current[1]?.click();
            return;
          } else {
            inputRefs.current[i - 1]?.focus();
            return;
          }
        }
      },
      [readonly, localValues, handleChange, handleCopy, handlePaste],
    );

    // Global keyboard shortcuts for the component
    const handleGlobalKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
        if (e.ctrlKey) {
          if (e.key === "c" || e.key === "ز") {
            e.preventDefault();
            handleCopy(e as any);
          }
          if (e.key === "v" || e.key === "ر") {
            e.preventDefault();
            handlePaste(e as any);
          }
        }
      },
      [disabled, readonly, handleCopy, handlePaste],
    );

    const handleTextChange = useCallback(
      (val: string | null, colorCode?: string, moveDir?: MoveDir) => {
        if (moveDir === "next") {
          inputRefs.current[2]?.focus();
          return;
        }
        if (moveDir === "prev") {
          inputRefs.current[0]?.focus();
          return;
        }
        if (moveDir === "clear") {
          setOpen(false);
          handleChange("p2", undefined);
          inputRefs.current[0]?.focus();
          return;
        }
        handleFinish({ key: "p2", val, colorCode });
        inputRefs.current[2]?.focus();
      },
      [handleFinish, handleChange, inputRefs],
    );

    const inputConfig: {
      Comp: React.ComponentType<any>;
      max: number;
      suffix?: React.ReactNode;
      containerWidth?: number | string;
    }[] = [
      { Comp: Number, max: 2 },
      { Comp: Text, max: 2 },
      { Comp: Number, max: 3 },
      {
        Comp: Number,
        max: 2,
        suffix: (
          <IranPlateIcon color={foregroundVariable} className={cn("h-9 w-9")} />
        ),
      },
    ];
    const plateId = id || "car-plate";

    return (
      <Popover open={open} onOpenChange={(open) => setOpen(open)}>
        <PopoverAnchor className="h-full w-full">
          <div
            ref={(node) => {
              containerRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            id={plateId}
            onKeyDown={handleGlobalKeyDown}
            className={cn(
              "flex h-14 w-fit overflow-hidden rounded-lg border-2 border-input-border transition-none duration-100 dir-ltr",
              { "cursor-not-allowed opacity-50": disabled },
              bg,
              className?.car?.root,
            )}
            role="group"
            aria-label="Iranian car license plate"
          >
            <div
              id={`${plateId}-flag`}
              className={cn(
                "group relative flex h-14 max-w-10 min-w-10 flex-1 flex-col items-start justify-center gap-1 bg-plate-flag p-2 text-white",
                className?.car?.flag?.root,
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src="/iran-flag.png"
                alt="Iran flag"
                className={cn("w-fit", className?.car?.flag?.image)}
                width={20}
                height={20}
                aria-hidden="true"
              />
              <div
                className={cn(
                  "flex flex-col text-2xs font-bold dir-ltr",
                  className?.car?.flag?.text,
                )}
              >
                <span>I.R.</span>
                <span className="-mt-1">IRAN</span>
              </div>

              {/* Hover buttons */}
              {isHovered && !disabled && !readonly && (
                <div className="absolute inset-0 flex flex-1 flex-col justify-center bg-background/30 backdrop-blur-sm duration-200">
                  {buttons.map((button, index) => (
                    <div
                      key={index}
                      className="flex flex-1 cursor-pointer items-center justify-center"
                      onClick={button.onClick}
                    >
                      <span className="-mt-1">{button.icon}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {inputConfig.map(({ Comp, max, suffix }, i, a) => {
              const key = `p${i + 1}` as keyof CarPlateInputValue;
              return (
                <div
                  key={i}
                  id={`${plateId}-input-${i + 1}`}
                  className={cn("flex h-full w-full min-w-14 border-r", {
                    "border-r-0": i === a.length - 1,
                  })}
                >
                  <Comp
                    ref={(el: HTMLInputElement | null) => {
                      inputRefs.current[i] = el;
                    }}
                    value={localValues?.[key] ?? ""}
                    className={cn(className?.numberInput)}
                    onFinish={(val: string | number, code?: string) =>
                      handleFinish({ key, val, colorCode: code, index: i })
                    }
                    onFocus={(e: any) => e.target.select()}
                    onChange={(val: string | number) => handleChange(key, val)}
                    onKeyDown={(e: any) => handleKeyDown(i, e)}
                    onPaste={(e: any) => handlePaste(e as any)}
                    aria-label={i === 1 ? "Letter" : "Number"}
                    maxLength={max}
                    suffix={suffix}
                    disabled={disabled || readonly}
                    aria-disabled={disabled}
                    containerWidth={containerWidth}
                    id={`${plateId}-input-${i + 1}-field`}
                    onClick={() => {
                      if (i === 1) setOpen((x) => !x);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </PopoverAnchor>
        <PopoverContent
          withPortal
          side="bottom"
          className="dir-rtl"
          style={{
            width:
              containerRef.current?.clientWidth || containerWidth || "100%",
            zIndex: 99999999,
          }}
        >
          <LettersBox onChange={handleTextChange} />
        </PopoverContent>
      </Popover>
    );
  },
);

CarPlate.displayName = "CarPlate";

export default CarPlate;
