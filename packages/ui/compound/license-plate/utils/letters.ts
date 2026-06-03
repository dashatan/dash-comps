export const plateLetters = {
  letters: [
    { code: 1, letter: 'الف', colorCode: 'protocol' },
    { code: 2, letter: 'ب' },
    { code: 3, letter: 'پ', dsc: 'پلیس', colorCode: 'police' },
    { code: 4, letter: 'ت', dsc: 'تاکسی', colorCode: 'taxi' },
    { code: 5, letter: 'ث', dsc: 'سپاه', colorCode: 'police' },
    { code: 6, letter: 'ج' },
    { code: 7, letter: 'چ' },
    { code: 8, letter: 'ح' },
    { code: 9, letter: 'خ' },
    { code: 10, letter: 'د' },
    { code: 11, letter: 'ذ' },
    { code: 12, letter: 'ر' },
    { code: 13, letter: 'ز', dsc: 'دفاع', colorCode: 'navy' },
    { code: 14, letter: 'ژ' },
    { code: 15, letter: 'س' },
    { code: 16, letter: 'ش', dsc: 'ارتش', colorCode: 'army' },
    { code: 17, letter: 'ص' },
    { code: 18, letter: 'ض' },
    { code: 19, letter: 'ط' },
    { code: 20, letter: 'ظ' },
    { code: 21, letter: 'ع', dsc: 'عمومی', colorCode: 'general' },
    { code: 22, letter: 'غ' },
    { code: 23, letter: 'ف' },
    { code: 24, letter: 'ق' },
    { code: 25, letter: 'ک', dsc: 'کشاورزی', colorCode: 'agriculture' },
    { code: 26, letter: 'گ' },
    { code: 27, letter: 'ل' },
    { code: 28, letter: 'م' },
    { code: 29, letter: 'ن' },
    { code: 30, letter: 'و' },
    { code: 31, letter: 'ه' },
    { code: 32, letter: 'ی' },
    { code: 36, letter: 'A' },
    { code: 33, letter: 'D', colorCode: 'service', dsc: 'خدمات' },
    { code: 37, letter: 'F' },
    { code: 40, letter: 'P' },
    { code: 39, letter: 'Q' },
    { code: 34, letter: 'S', colorCode: 'service', dsc: 'خدمات' },
  ],
  symbolLetters: [{ letter: '@' }],
  numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
}

export const lettersColorCodes = [
  { code: 1, letter: 'الف', dsc: 'دولتی', colorCode: 'protocol' },
  { code: 3, letter: 'پ', dsc: 'پلیس', colorCode: 'police' },
  { code: 4, letter: 'ت', dsc: 'تاکسی', colorCode: 'taxi' },
  { code: 5, letter: 'ث', dsc: 'سپاه', colorCode: 'police' },
  { code: 13, letter: 'ز', dsc: 'وزارت دفاع', colorCode: 'navy' },
  { code: 16, letter: 'ش', dsc: 'ارتش', colorCode: 'army' },
  { code: 21, letter: 'ع', dsc: 'عمومی', colorCode: 'general' },
  { code: 25, letter: 'ک', dsc: 'کشاورزی', colorCode: 'agriculture' },
  { code: 33, letter: 'D', colorCode: 'service', dsc: 'خدمات' },
  { code: 34, letter: 'S', colorCode: 'service', dsc: 'خدمات' },
]
export const lettersDescriptions = [
  { code: 1, letter: 'الف', dsc: 'دولتی' },
  { code: 3, letter: 'پ', dsc: 'پلیس' },
  { code: 4, letter: 'ت', dsc: 'تاکسی' },
  { code: 5, letter: 'ث', dsc: 'سپاه' },
  { code: 13, letter: 'ز', dsc: 'وزارت دفاع' },
  { code: 16, letter: 'ش', dsc: 'ارتش' },
  { code: 21, letter: 'ع', dsc: 'عمومی' },
  { code: 25, letter: 'ک', dsc: 'کشاورزی' },
  { code: 33, letter: 'D', dsc: 'خدمات' },
  { code: 34, letter: 'S', dsc: 'خدمات' },
]

// Persian letter to keyboard mapping (based on standard Persian keyboard layout ISIRI 9147)
// Each key on Persian keyboard has both Persian and English letters printed on it
export const letterToKeyboardMap: { [key: string]: string[] } = {
  // Row 1: q w e r t y u i o p [ ]
  ض: ['q', 'Q', 'ض'], // q key
  ص: ['w', 'W', 'ص'], // w key
  ث: ['e', 'E', 'ث'], // e key
  ق: ['r', 'R', 'ق'], // r key
  ف: ['t', 'T', 'ف'], // t key
  غ: ['y', 'Y', 'غ'], // y key
  ع: ['u', 'U', 'ع'], // u key
  ه: ['i', 'I', 'ه'], // i key
  خ: ['o', 'O', 'خ'], // o key
  ح: ['p', 'P', 'ح'], // p key
  ج: ['[', ']', 'ج'], // [ key
  چ: [']', '[', 'چ'], // ] key

  // Row 2: a s d f g h j k l ; '
  ش: ['a', 'A'], // a key
  س: ['s', 'S', 'س'], // s key
  ی: ['d', 'D', 'ی'], // d key
  ب: ['f', 'F', 'ب'], // f key
  ل: ['g', 'G', 'ل'], // g key
  ا: ['h', 'H', 'ا'], // h key
  الف: ['h', 'H', 'ا'], // h key
  ت: ['j', 'J', 'ت'], // j key
  ن: ['k', 'K', 'ن'], // k key
  م: ['l', 'L', 'م'], // l key
  ک: [';', ':', 'ک'], // ; key
  گ: ["'", '"', 'گ'], // ' key

  // Row 3: z x c v b n m , . /
  ظ: ['z', 'Z', 'ظ'], // z key
  ط: ['x', 'X', 'ط'], // x key
  ز: ['c', 'C', 'ز'], // c key
  ژ: ['c', 'C', 'ژ'], // z key
  ر: ['v', 'V', 'ر'], // v key
  ذ: ['b', 'B', 'ذ'], // b key
  د: ['n', 'N', 'د'], // n key
  پ: ['m', 'M', 'پ'], // m key
  و: [',', '<', 'و'], // , key

  // English letters (they map to themselves)
  A: ['a', 'A'],
  D: ['d', 'D', 'D'],
  F: ['f', 'F'],
  P: ['p', 'P'],
  Q: ['q', 'Q'],
  S: ['s', 'S'],
  '*': ['*'],
}
