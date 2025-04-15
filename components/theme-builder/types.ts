export interface ColorVar {
  name: string;
  label: string;
  value: string;
  isHue?: boolean;
}

export interface ThemeColors {
  background: ColorVar[];
  primary: ColorVar[];
  utility: ColorVar[];
}
