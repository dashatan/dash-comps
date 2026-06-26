export const colors: { [key: string]: string } = {
  police: "bg-police text-gray-100 shadow-police",
  taxi: "bg-taxi text-plate-foreground shadow-taxi",
  agriculture: "bg-taxi text-plate-foreground shadow-taxi",
  general: "bg-taxi text-plate-foreground shadow-taxi",
  army: "bg-army text-plate-foreground shadow-army",
  navy: "bg-navy text-gray-100 shadow-navy",
  protocol: "bg-protocol text-gray-100 shadow-protocol",
  service: "bg-service text-plate-foreground shadow-service",
};

export const getPlateForegroundColorVariable = (colorCode?: PlateColorCode) => {
  const lightColors = ["protocol", "navy", "police"] as PlateColorCode[];
  if (colorCode && lightColors.includes(colorCode))
    return "var(--color-gray-100)";
  return "var(--color-plate-foreground)";
};

export type PlateColorCode = keyof typeof colors;
