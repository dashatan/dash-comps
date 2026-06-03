import { cn } from "@/lib";
import { cva, type VariantProps } from "class-variance-authority";

export type ColorType =
  | "blue"
  | "green"
  | "red"
  | "white"
  | "black"
  | "yellow"
  | "pink"
  | "orange"
  | "teal"
  | "indigo"
  | "lime"
  | "gray";

export const colors: ColorType[] = [
  "blue",
  "green",
  "red",
  "white",
  "black",
  "yellow",
  "pink",
  "orange",
  "teal",
  "indigo",
  "lime",
  "gray",
];

// Assuming colorWords is a translation map for different languages
export const colorWords: Record<string, ColorType> = {
  // Add your color word mappings here
  blue: "blue",
  green: "green",
  red: "red",
  white: "white",
  black: "black",
  yellow: "yellow",
  pink: "pink",
  orange: "orange",
  teal: "teal",
  indigo: "indigo",
  lime: "lime",
  gray: "gray",
  silver: "gray",
};

const colorFieldVariants = cva("size-7 rounded-full border-2 ", {
  variants: {
    color: {
      blue: "bg-blue-400 border-blue-500",
      red: "bg-red-400 border-red-500",
      green: "bg-green-400 border-green-500",
      yellow: "bg-yellow-400 border-yellow-500",
      white: "bg-white border-gray-400",
      gray: "bg-gray-400 border-gray-500",
      black: "bg-gray-800 border-gray-600",
      orange: "bg-orange-400 border-orange-500",
      lime: "bg-lime-500 border-lime-400",
      pink: "bg-pink-400 border-pink-500",
      teal: "bg-teal-400 border-teal-500",
      indigo: "bg-indigo-400 border-indigo-500",
    },
  },
  defaultVariants: {
    color: "gray",
  },
});

export interface ColorFieldProps extends VariantProps<typeof colorFieldVariants> {
  className?: string;
}

export default function ColorField({ color, className }: ColorFieldProps) {
  return (
    <div className="flex items-center justify-center">
      <div className={cn(colorFieldVariants({ color }), className)}></div>
    </div>
  );
}

export function getColor(text?: string): ColorType | undefined {
  if (!text) return;
  return colors.find((x) => x === text || x === colorWords[text]) as ColorType;
}

export { colorFieldVariants };
