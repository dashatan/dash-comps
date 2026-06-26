/**
 * Convert HSL values to a hex color value
 */
export function hslToColorValue(hslValue: string): string {
  try {
    // Parse HSL values - assuming format: "H S% L%"
    const [h, s, l] = hslValue.split(" ").map((val) => {
      return parseFloat(val.replace("%", ""));
    });

    // Convert HSL to RGB
    const h1 = h / 360;
    const s1 = s / 100;
    const l1 = l / 100;

    let r, g, b;

    if (s1 === 0) {
      r = g = b = l1;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l1 < 0.5 ? l1 * (1 + s1) : l1 + s1 - l1 * s1;
      const p = 2 * l1 - q;
      r = hue2rgb(p, q, h1 + 1 / 3);
      g = hue2rgb(p, q, h1);
      b = hue2rgb(p, q, h1 - 1 / 3);
    }

    // Convert to hex
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch (error) {
    console.error("Error converting HSL to color value:", error);
    return "#000000";
  }
}

/**
 * Convert hex color value to HSL format
 */
export function colorValueToHsl(
  colorValue: string,
  originalHsl: string,
): string {
  try {
    // Convert hex to RGB
    const hex = colorValue.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    // Convert to HSL format
    const hDeg = Math.round(h * 360);
    const sPercent = Math.round(s * 100);
    const lPercent = Math.round(l * 100);

    return `${hDeg} ${sPercent}% ${lPercent}%`;
  } catch (error) {
    console.error("Error converting color value to HSL:", error);
    return originalHsl;
  }
}

/**
 * Get the current theme (light or dark)
 */
export function getCurrentTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
