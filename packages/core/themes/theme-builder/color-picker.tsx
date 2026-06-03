'use client';

import * as React from 'react';
import { ColorVar } from './types';
import {
  hslToColorValue,
  colorValueToHsl,
} from './color-utils';

interface ColorPickerProps {
  color: ColorVar;
  onChange: (name: string, value: string) => void;
}

/**
 * Component for selecting and adjusting colors
 */
export function ColorPicker({ color, onChange }: ColorPickerProps) {
  function handleColorInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = colorValueToHsl(e.target.value, color.value);
    onChange(color.name, newValue);
  }

  function handleHslInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(color.name, e.target.value);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor={color.name}
          className="text-sm font-medium text-foreground"
        >
          {color.label}
        </label>
        <div
          className="w-6 h-6 rounded-full border border-border"
          style={{ backgroundColor: hslToColorValue(color.value) }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Color picker input */}
        <input
          type="color"
          id={color.name}
          className="w-full h-8 cursor-pointer"
          value={hslToColorValue(color.value)}
          onChange={handleColorInputChange}
        />

        {/* HSL value input */}
        <input
          type="text"
          className="w-full h-8 px-2 text-xs bg-background border border-border rounded"
          value={color.value}
          onChange={handleHslInputChange}
        />

        <div className="flex items-center">
          <span className="text-xs text-muted-foreground">HSL</span>
        </div>
      </div>
    </div>
  );
}
