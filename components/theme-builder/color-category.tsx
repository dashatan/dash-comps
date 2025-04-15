'use client';

import * as React from 'react';
import type { ColorVar } from '@/components/theme-builder/types';
import { ColorPicker } from './color-picker';

interface ColorCategoryProps {
  colors: ColorVar[];
  onChange: (name: string, value: string) => void;
}

/**
 * Displays a group of related color pickers
 */
export function ColorCategory({ colors, onChange }: ColorCategoryProps) {
  return (
    <div className="space-y-6">
      {colors.map((color) => (
        <ColorPicker key={color.name} color={color} onChange={onChange} />
      ))}
    </div>
  );
}
