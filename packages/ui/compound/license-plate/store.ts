import { create } from "zustand";
import type { PlateLetter } from "@/components/compound/license-plate/types";
import { plateLetters } from "@/components/compound/license-plate/utils/letters";

const initialLetters = plateLetters.letters.map((letter) => ({
  id: letter.code,
  name: letter.letter,
  colorCode: letter.colorCode,
})) as PlateLetter[];

type PlateStoreState = {
  letters: PlateLetter[];
  width: number | string;
  setLetters: (letters: PlateLetter[]) => void;
  setWidth: (width: number | string) => void;
};

export const usePlateStore = create<PlateStoreState>((set) => ({
  letters: initialLetters,
  width: 280,
  setLetters: (letters) => set({ letters }),
  setWidth: (width) => set({ width }),
}));

export default function usePlateSignals() {
  const letters = usePlateStore((state) => state.letters);
  const setLetters = usePlateStore((state) => state.setLetters);
  const width = usePlateStore((state) => state.width);
  const setWidth = usePlateStore((state) => state.setWidth);

  return { letters, setLetters, width, setWidth };
}

export const plateContext = undefined;

export function usePlateContext() {
  throw new Error("usePlateContext must be used within a PlateProvider");
}
