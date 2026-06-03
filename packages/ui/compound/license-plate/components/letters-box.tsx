import usePlateSignals from "@/components/compound/license-plate/context/usePlateSignals";
import {
  lettersDescriptions,
  letterToKeyboardMap,
} from "@/components/compound/license-plate/utils/letters";
import { lettersColorCodes } from "@/components/compound/license-plate/utils/letters";
import { cn } from "@/lib";

import { useState, useRef, useEffect } from "react";

export type MoveDir = "next" | "prev" | "clear";
export type LettersBoxOnChange = (
  val: string | null,
  colorCode?: string,
  moveDir?: MoveDir,
) => void;

export type LettersBoxProps = {
  onChange: LettersBoxOnChange;
  width?: number | string;
};

export default function LettersBox({ onChange, width }: LettersBoxProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const letterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { letters } = usePlateSignals();

  useEffect(() => {
    if (focusedIndex !== null && letterRefs.current[focusedIndex]) {
      letterRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  // Function to find letter by keyboard input
  const findLetterByKey = (key: string): number | null => {
    const normalizedKey = key.toLowerCase();

    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      const letterKeys = letterToKeyboardMap[letter.name];

      if (letterKeys && letterKeys.some((k) => k.toLowerCase() === normalizedKey)) {
        return i;
      }
    }

    return null;
  };

  // Handle global keyboard events
  // useEffect(() => {
  //   const handleGlobalKeyDown = (event: KeyboardEvent) => {
  //     // Only handle single character keys (letters, numbers, symbols)
  //     if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
  //       const foundIndex = findLetterByKey(event.key);
  //       if (foundIndex !== null) {
  //         event.preventDefault();
  //         setFocusedIndex(foundIndex);
  //       }
  //     }
  //   };

  //   // Add event listener to document
  //   document.addEventListener("keydown", handleGlobalKeyDown);

  //   // Cleanup
  //   return () => {
  //     document.removeEventListener("keydown", handleGlobalKeyDown);
  //   };
  // }, [letters]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    event.stopPropagation();
    event.preventDefault();

    const letterCount = letters.length;

    switch (event.key) {
      case "ArrowRight":
        setFocusedIndex((prevIndex) =>
          prevIndex !== null
            ? (prevIndex - 1 + letterCount) % letterCount
            : letterCount - 1,
        );
        break;
      case "ArrowLeft":
        setFocusedIndex((prevIndex) =>
          prevIndex !== null ? (prevIndex + 1) % letterCount : 0,
        );
        break;
      case "ArrowUp":
        setFocusedIndex((prevIndex) =>
          prevIndex !== null
            ? (prevIndex - 5 + letterCount) % letterCount
            : letterCount - 1,
        );
        break;
      case "ArrowDown":
        setFocusedIndex((prevIndex) =>
          prevIndex !== null ? (prevIndex + 5) % letterCount : 0,
        );
        break;
      case "Enter": {
        const letter = letters[index];
        if (!letter) break;

        const colorCode = lettersColorCodes.find(
          (x) => x.letter === letter.name,
        )?.colorCode;
        onChange(letter.name, colorCode);
        break;
      }
      case "Backspace":
        onChange(null, undefined, "clear");
        break;
      case "Tab":
        onChange(null, undefined, event.shiftKey ? "prev" : "next");
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          const foundIndex = findLetterByKey(event.key);
          if (foundIndex !== null) {
            setFocusedIndex(foundIndex);
          }
        }
        break;
    }
  };

  return (
    <div
      className="bg-card flex-full z-2 h-auto max-h-80 overflow-y-auto rounded-md border"
      style={{ width }}
    >
      <div className="flex w-full flex-col p-2">
        <div className="grid max-h-[500px] grid-cols-5 gap-3 overflow-y-auto p-2">
          {letters?.map((letter, index) => {
            const colorCode = lettersColorCodes.find(
              (x) => x.letter === letter.name,
            )?.colorCode;
            const dsc = lettersDescriptions.find((x) => x.letter === letter.name)?.dsc;
            return (
              <div
                key={letter.name}
                ref={(el) => {
                  letterRefs.current[index] = el;
                }}
                tabIndex={0}
                onClick={() => onChange(letter.name, colorCode)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onFocus={() => setFocusedIndex(index)}
                className={cn(
                  "flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden whitespace-nowrap",
                  "bg-muted text-muted-foreground rounded-md transition",
                  "focus-visible:ring-foreground focus-visible:ring-offset-card focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-offset-2",
                  "hover:ring-foreground hover:ring-offset-card hover:z-1 hover:ring-2 hover:ring-offset-2",
                  "outline-none",
                  colorCode ? colors[colorCode] : "",
                )}
              >
                <span className="text-base font-semibold">{letter.name}</span>
                {dsc && <span className="text-[9px] font-medium">{dsc}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export const colors: { [key: string]: string } = {
  police: "bg-police text-gray-100",
  taxi: "bg-taxi text-plate-foreground",
  general: "bg-taxi text-plate-foreground",
  agriculture: "bg-taxi text-plate-foreground",
  army: "bg-army text-plate-foreground",
  navy: "bg-navy text-gray-100",
  protocol: "bg-protocol text-gray-100",
  service: "bg-service text-plate-foreground",
};
