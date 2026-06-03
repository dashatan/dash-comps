/**
 * Types for license plate components
 */

/**
 * Available types of license plates
 */
export type PlateType = "car" | "motorcycle" | "protocol" | "simple";

/**
 * Mapping of plate type codes to their corresponding types
 */
export const plateTypesKeyValue: Record<number, PlateType> = {
  1: "car",
  2: "motorcycle",
  3: "protocol",
  4: "simple",
};

/**
 * Input value structure for license plates
 * Each property represents a part of the license plate number
 */
export type CarPlateInputValue = {
  /** First two digits (e.g., 12) */
  p1?: string;
  /** Letter (e.g., الف) */
  p2?: string;
  /** Three digits (e.g., 345) */
  p3?: string;
  /** Last two digits (e.g., 67) */
  p4?: string;
};
export type PlateValue = {
  p1?: string;
  p2?: string;
  p3?: string;
  p4?: string;
  p5?: string;
  p6?: string;
  p7?: string;
  p8?: string;
};

export type PlateValueRequestParams = {
  p1?: number;
  p2?: number;
  p3?: number;
  p4?: number;
  p5?: number;
  p6?: number;
  p7?: number;
  p8?: number;
};

/**
 * Props for the main license plate input component
 */
export type PlateInputProps = {
  /** Whether to show a clear button */
  withClear?: boolean;
  /** Callback when the plate value changes */
  onChange?: (val?: PlateValue) => void;
  /** Callback when the plate is cleared */
  onClear?: () => void;
  /** Current plate value */
  value?: PlateValue;
  /** Width of the input */
  width?: number | string;
  /** Type of license plate */
  variant: PlateType;
  /** Unique identifier for the plate input */
  id?: string;
  /** Custom class names for styling */
  className?: {
    /** Root container class */
    root?: string;
    /** Container class */
    container?: string;
    /** Number input class */
    numberInput?: string;
    /** Text input class */
    textInput?: string;
    /** Car plate specific classes */
    car?: {
      /** Root container class */
      root?: string;
      /** Flag section classes */
      flag?: {
        /** Root container class */
        root?: string;
        /** Image class */
        image?: string;
        /** Text class */
        text?: string;
      };
      /** Icon class */
      icon?: string;
    };
  };
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is readonly */
  readonly?: boolean;
  /** Whether the input is in error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Label text */
  label?: string;
  /** Helper text */
  helperText?: string;
};

/**
 * Structure for a license plate letter
 */
export type PlateLetter = {
  /** Unique identifier */
  id: number;
  /** Letter character */
  name: string;
  /** Optional description */
  description?: string;
  /** Optional color code */
  colorCode?: string;
};

/**
 * Props for the letters box component
 */
export type LettersBoxProps = {
  /** Callback when a letter is selected */
  onChange: (val: string, colorCode?: string) => void;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Custom class names */
  className?: {
    /** Root container class */
    root?: string;
    /** Letter button class */
    letter?: string;
    /** Description text class */
    description?: string;
  };
};

export type CarPlateInputProps = {
  /** Callback when value changes */
  onChange?: (val?: PlateValue) => void;
  /** Current values */
  defaultValue?: PlateValue;
  /** Color code for the plate */
  colorCode?: string;
  /** Whether to clear the input */
  clear?: boolean;
  /** Callback when clear is triggered */
  onClear?: (clear: boolean) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is readonly */
  readonly?: boolean;
  /** Whether the input is in error state */
  error?: boolean;
  /** Container width */
  containerWidth?: number | string;
  /** Unique identifier for the plate */
  id?: string;
  /** Custom class names */
  className?: {
    numberInput?: string;
    textInput?: string;
    car?: {
      root?: string;
      flag?: {
        root?: string;
        image?: string;
        text?: string;
      };
      icon?: string;
    };
  };
};
