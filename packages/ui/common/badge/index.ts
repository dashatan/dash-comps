import Badge, { type BadgeProps, badgeVariants } from "./badge";
import ColorField, {
  type ColorFieldProps,
  type ColorType,
  colors,
  colorWords,
  getColor,
  colorFieldVariants,
} from "./color";

export {
  badgeVariants,
  ColorField,
  colors,
  colorWords,
  getColor,
  colorFieldVariants,
};

export type { BadgeProps, ColorFieldProps, ColorType };
export default Badge;
