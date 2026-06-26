/**
 * Comprehensive Iranian License Plate Validation Utilities
 */

import { PlateValue } from "../types";
import { plateLetters } from "./letters";

export interface PlateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedPlate?: PlateValue;
}

export interface PlateValidationOptions {
  /** Maximum number of plates to process */
  maxPlates?: number;
  /** Whether to allow partial plates */
  allowPartial?: boolean;
  /** Whether to normalize plate values */
  normalize?: boolean;
  /** Custom validation rules */
  customRules?: PlateValidationRule[];
}

export interface PlateValidationRule {
  name: string;
  validate: (plate: PlateValue) => boolean;
  errorMessage: string;
}

/**
 * Iranian license plate validation rules
 */
export const IRANIAN_PLATE_RULES: PlateValidationRule[] = [
  {
    name: "p1_p2_range",
    validate: (plate) => {
      const p1 = Number(plate.p1);
      const p2 = Number(plate.p2);
      return p1 >= 1 && p1 <= 99 && p2 >= 0 && p2 <= 9;
    },
    errorMessage: "First two digits must be between 10-99",
  },
  {
    name: "p3_letter_valid",
    validate: (plate) => {
      if (!plate.p3) return false;
      const letterCode = Number(plate.p3);
      return plateLetters.letters.some((letter) => letter.code === letterCode);
    },
    errorMessage: "Letter code must be valid",
  },
  {
    name: "p4_p5_p6_range",
    validate: (plate) => {
      const p4 = Number(plate.p4);
      const p5 = Number(plate.p5);
      const p6 = Number(plate.p6);
      return p4 >= 0 && p4 <= 9 && p5 >= 0 && p5 <= 9 && p6 >= 0 && p6 <= 9;
    },
    errorMessage: "Middle three digits must be 0-9",
  },
  {
    name: "p7_p8_range",
    validate: (plate) => {
      const p7 = Number(plate.p7);
      const p8 = Number(plate.p8);
      return p7 >= 0 && p7 <= 9 && p8 >= 0 && p8 <= 9;
    },
    errorMessage: "Last two digits must be 0-9",
  },
  {
    name: "not_all_zeros",
    validate: (plate) => {
      const values = [
        plate.p1,
        plate.p2,
        plate.p4,
        plate.p5,
        plate.p6,
        plate.p7,
        plate.p8,
      ];
      return values.some((val) => val !== "0" && val !== "00");
    },
    errorMessage: "Plate cannot be all zeros",
  },
];

/**
 * Validates a single license plate
 */
export function validatePlate(
  plate: PlateValue,
  options: PlateValidationOptions = {},
): PlateValidationResult {
  const { customRules = [], allowPartial = false, normalize = true } = options;
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if plate has required fields
  const requiredFields = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];
  const missingFields = requiredFields.filter(
    (field) => !plate[field as keyof PlateValue],
  );

  if (missingFields.length > 0 && !allowPartial) {
    errors.push(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Normalize plate values
  let normalizedPlate = plate;
  if (normalize) {
    normalizedPlate = normalizePlate(plate);
  }

  // Apply standard validation rules
  const allRules = [...IRANIAN_PLATE_RULES, ...customRules];

  for (const rule of allRules) {
    if (!rule.validate(normalizedPlate)) {
      errors.push(rule.errorMessage);
    }
  }

  // Additional business logic validations
  if (normalizedPlate.p1 === "0" && normalizedPlate.p2 === "0") {
    warnings.push("Plate starts with 00 - verify if this is correct");
  }

  // Check for common invalid patterns
  if (
    normalizedPlate.p4 === "0" &&
    normalizedPlate.p5 === "0" &&
    normalizedPlate.p6 === "0"
  ) {
    warnings.push("Middle digits are all zeros - verify if this is correct");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    normalizedPlate: normalize ? normalizedPlate : undefined,
  };
}

/**
 * Normalizes plate values to ensure consistency
 */
export function normalizePlate(plate: {
  p1?: string | number;
  p2?: string | number;
  p3?: string | number;
  p4?: string | number;
  p5?: string | number;
  p6?: string | number;
  p7?: string | number;
  p8?: string | number;
}): PlateValue {
  return {
    p1: plate.p1?.toString(),
    p2: plate.p2?.toString(),
    p3: plate.p3?.toString(),
    p4: plate.p4?.toString(),
    p5: plate.p5?.toString(),
    p6: plate.p6?.toString(),
    p7: plate.p7?.toString(),
    p8: plate.p8?.toString(),
  };
}

/**
 * Validates multiple plates from Excel data
 */
export function validatePlatesFromExcel(
  data: any[],
  options: PlateValidationOptions = {},
): {
  validPlates: PlateValue[];
  invalidPlates: PlateValue[];
  errors: string[];
  warnings: string[];
} {
  const { maxPlates = 500 } = options;
  const validPlates: PlateValue[] = [];
  const invalidPlates: PlateValue[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || !Array.isArray(data)) {
    errors.push("Invalid data format: Expected array of rows");
    return { validPlates, invalidPlates, errors, warnings };
  }

  if (data.length === 0) {
    warnings.push("No data found in Excel file");
    return { validPlates, invalidPlates, errors, warnings };
  }

  for (let i = 0; i < data.length; i++) {
    if (validPlates.length >= maxPlates) {
      warnings.push(
        `Maximum plate limit (${maxPlates}) reached. ${data.length - i} remaining plates will be ignored.`,
      );
      break;
    }

    const row = data[i];

    if (!row || !Array.isArray(row)) {
      errors.push(`Row ${i + 1}: Invalid row format`);
      continue;
    }

    const plate = parsePlateFromRow(row);

    if (!plate) {
      invalidPlates.push(createEmptyPlate());
      errors.push(`Row ${i + 1}: Unable to parse plate data - check format`);
      continue;
    }

    const validation = validatePlate(plate, options);

    if (validation.isValid) {
      validPlates.push(validation.normalizedPlate || plate);

      // Add warnings if any
      if (validation.warnings.length > 0) {
        warnings.push(`Row ${i + 1}: ${validation.warnings.join(", ")}`);
      }
    } else {
      invalidPlates.push(plate);
      errors.push(`Row ${i + 1}: ${validation.errors.join(", ")}`);
    }
  }

  // Add summary warnings
  if (validPlates.length === 0 && invalidPlates.length > 0) {
    warnings.push("No valid plates found. Please check your data format.");
  }

  if (validPlates.length > 0 && invalidPlates.length > 0) {
    warnings.push(
      `Found ${validPlates.length} valid and ${invalidPlates.length} invalid plates`,
    );
  }

  return { validPlates, invalidPlates, errors, warnings };
}

/**
 * Parses plate data from Excel row
 */
function parsePlateFromRow(row: any[]): PlateValue | null {
  if (!row) return null;

  // Type 1: Structured format (p1,p2,p3,p4,p5,p6,p7,p8)
  if (
    row.length === 8 &&
    row.every((cell) => cell !== undefined && cell !== null)
  ) {
    return {
      p1: row[0]?.toString(),
      p2: row[1]?.toString(),
      p3: row[2]?.toString(),
      p4: row[3]?.toString(),
      p5: row[4]?.toString(),
      p6: row[5]?.toString(),
      p7: row[6]?.toString(),
      p8: row[7]?.toString(),
    };
  }

  // Type 2: Alternative format (check for specific patterns)
  if (row.length === 5) {
    // Check if it's the alternative format with letter in position 3
    const letterIndex = 3;
    const letter = row[letterIndex];

    if (typeof letter === "string") {
      const letterCode = plateLetters.letters.find(
        (l) => l.letter === letter,
      )?.code;
      if (letterCode) {
        return {
          p1: row[4]?.[0]?.toString(),
          p2: row[4]?.[1]?.toString(),
          p3: letterCode.toString(),
          p4: row[2]?.[0]?.toString(),
          p5: row[2]?.[1]?.toString(),
          p6: row[2]?.[2]?.toString(),
          p7: row[1]?.[0]?.toString(),
          p8: row[1]?.[1]?.toString(),
        };
      }
    }
  }

  return null;
}

/**
 * Creates an empty plate for error cases
 */
function createEmptyPlate(): PlateValue {
  return {
    p1: "",
    p2: "",
    p3: "",
    p4: "",
    p5: "",
    p6: "",
    p7: "",
    p8: "",
  };
}

/**
 * Formats plate for display
 */
export function formatPlateForDisplay(plate: PlateValue): string {
  const { p1, p2, p3, p4, p5, p6, p7, p8 } = plate;
  const letter =
    plateLetters.letters.find((l) => l.code === Number(p3))?.letter || p3;
  return `${p1 || "**"}${p2 || "*"} ${letter || "*"} ${p4 || "*"}${p5 || "*"}${p6 || "*"} ${p7 || "*"}${p8 || "*"}`;
}

/**
 * Checks if two plates are equal
 */
export function arePlatesEqual(
  plate1: PlateValue,
  plate2: PlateValue,
): boolean {
  const fields: (keyof PlateValue)[] = [
    "p1",
    "p2",
    "p3",
    "p4",
    "p5",
    "p6",
    "p7",
    "p8",
  ];
  return fields.every((field) => plate1[field] === plate2[field]);
}

/**
 * Removes duplicate plates from an array
 */
export function removeDuplicatePlates(plates: PlateValue[]): PlateValue[] {
  const unique: PlateValue[] = [];

  for (const plate of plates) {
    if (!unique.some((existing) => arePlatesEqual(existing, plate))) {
      unique.push(plate);
    }
  }

  return unique;
}
