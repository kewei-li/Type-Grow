'use client';

import { useMemo } from 'react';

// ============ Types ============

interface KeyDef {
  label: string;
  value: string;
  shiftValue?: string;
  width?: number; // multiplier, 1.0 = standard key
  type?: 'letter' | 'modifier' | 'space' | 'special';
}

interface VirtualKeyboardProps {
  nextChar: string | null;
}

// ============ Keyboard Layout ============

const KEYBOARD_LAYOUT: KeyDef[][] = [
  // Row 0: Number row
  [
    { label: '`', value: '`', shiftValue: '~', type: 'special' },
    { label: '1', value: '1', shiftValue: '!', type: 'special' },
    { label: '2', value: '2', shiftValue: '@', type: 'special' },
    { label: '3', value: '3', shiftValue: '#', type: 'special' },
    { label: '4', value: '4', shiftValue: '$', type: 'special' },
    { label: '5', value: '5', shiftValue: '%', type: 'special' },
    { label: '6', value: '6', shiftValue: '^', type: 'special' },
    { label: '7', value: '7', shiftValue: '&', type: 'special' },
    { label: '8', value: '8', shiftValue: '*', type: 'special' },
    { label: '9', value: '9', shiftValue: '(', type: 'special' },
    { label: '0', value: '0', shiftValue: ')', type: 'special' },
    { label: '-', value: '-', shiftValue: '_', type: 'special' },
    { label: '=', value: '=', shiftValue: '+', type: 'special' },
    { label: '⌫', value: 'Backspace', width: 1.5, type: 'modifier' },
  ],
  // Row 1: QWERTY row
  [
    { label: 'Tab', value: 'Tab', width: 1.25, type: 'modifier' },
    { label: 'Q', value: 'q', shiftValue: 'Q', type: 'letter' },
    { label: 'W', value: 'w', shiftValue: 'W', type: 'letter' },
    { label: 'E', value: 'e', shiftValue: 'E', type: 'letter' },
    { label: 'R', value: 'r', shiftValue: 'R', type: 'letter' },
    { label: 'T', value: 't', shiftValue: 'T', type: 'letter' },
    { label: 'Y', value: 'y', shiftValue: 'Y', type: 'letter' },
    { label: 'U', value: 'u', shiftValue: 'U', type: 'letter' },
    { label: 'I', value: 'i', shiftValue: 'I', type: 'letter' },
    { label: 'O', value: 'o', shiftValue: 'O', type: 'letter' },
    { label: 'P', value: 'p', shiftValue: 'P', type: 'letter' },
    { label: '[', value: '[', shiftValue: '{', type: 'special' },
    { label: ']', value: ']', shiftValue: '}', type: 'special' },
    { label: '\\', value: '\\', shiftValue: '|', type: 'special' },
  ],
  // Row 2: Home row
  [
    { label: 'Caps', value: 'CapsLock', width: 1.5, type: 'modifier' },
    { label: 'A', value: 'a', shiftValue: 'A', type: 'letter' },
    { label: 'S', value: 's', shiftValue: 'S', type: 'letter' },
    { label: 'D', value: 'd', shiftValue: 'D', type: 'letter' },
    { label: 'F', value: 'f', shiftValue: 'F', type: 'letter' },
    { label: 'G', value: 'g', shiftValue: 'G', type: 'letter' },
    { label: 'H', value: 'h', shiftValue: 'H', type: 'letter' },
    { label: 'J', value: 'j', shiftValue: 'J', type: 'letter' },
    { label: 'K', value: 'k', shiftValue: 'K', type: 'letter' },
    { label: 'L', value: 'l', shiftValue: 'L', type: 'letter' },
    { label: ';', value: ';', shiftValue: ':', type: 'special' },
    { label: "'", value: "'", shiftValue: '"', type: 'special' },
    { label: 'Enter', value: 'Enter', width: 1.75, type: 'modifier' },
  ],
  // Row 3: Bottom row
  [
    { label: 'Shift', value: 'Shift', width: 2, type: 'modifier' },
    { label: 'Z', value: 'z', shiftValue: 'Z', type: 'letter' },
    { label: 'X', value: 'x', shiftValue: 'X', type: 'letter' },
    { label: 'C', value: 'c', shiftValue: 'C', type: 'letter' },
    { label: 'V', value: 'v', shiftValue: 'V', type: 'letter' },
    { label: 'B', value: 'b', shiftValue: 'B', type: 'letter' },
    { label: 'N', value: 'n', shiftValue: 'N', type: 'letter' },
    { label: 'M', value: 'm', shiftValue: 'M', type: 'letter' },
    { label: ',', value: ',', shiftValue: '<', type: 'special' },
    { label: '.', value: '.', shiftValue: '>', type: 'special' },
    { label: '/', value: '/', shiftValue: '?', type: 'special' },
    { label: 'Shift', value: 'Shift', width: 2, type: 'modifier' },
  ],
  // Row 4: Space bar
  [
    { label: '', value: ' ', width: 8, type: 'space' },
  ],
];

// ============ Shift map: shifted char → base key value ============

const SHIFT_MAP: Record<string, string> = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-',
  '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'",
  '<': ',', '>': '.', '?': '/',
};

// ============ Highlight Logic ============

function getHighlightedKeys(nextChar: string | null): {
  primaryKey: string | null;
  needsShift: boolean;
} {
  if (nextChar === null) return { primaryKey: null, needsShift: false };

  // Uppercase letter → Shift + lowercase
  if (nextChar >= 'A' && nextChar <= 'Z') {
    return { primaryKey: nextChar.toLowerCase(), needsShift: true };
  }

  // Shifted symbol
  if (SHIFT_MAP[nextChar]) {
    return { primaryKey: SHIFT_MAP[nextChar], needsShift: true };
  }

  // Regular unshifted character
  return { primaryKey: nextChar, needsShift: false };
}

// Home row bump indicators
const BUMP_KEYS = new Set(['f', 'j']);

// Base key width in pixels
const KEY_W = 28;
const KEY_H = 28;
const GAP = 2;

// ============ Component ============

export default function VirtualKeyboard({ nextChar }: VirtualKeyboardProps) {
  const { primaryKey, needsShift } = useMemo(
    () => getHighlightedKeys(nextChar),
    [nextChar]
  );

  return (
    <div
      className="flex flex-col items-center gap-[2px] py-2"
      aria-hidden="true"
      role="img"
      aria-label="Virtual keyboard showing next key to press"
    >
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-[2px] justify-center">
          {row.map((keyDef, keyIndex) => {
            const isActive =
              primaryKey !== null &&
              (keyDef.value === primaryKey || keyDef.shiftValue === nextChar);
            const isShiftHint = needsShift && keyDef.value === 'Shift';
            const hasBump = BUMP_KEYS.has(keyDef.value);

            const width = (keyDef.width ?? 1) * KEY_W + ((keyDef.width ?? 1) - 1) * GAP;

            let className = 'keyboard-key';
            if (isActive) className = 'keyboard-key keyboard-key-active';
            else if (isShiftHint) className = 'keyboard-key keyboard-key-shift';

            return (
              <div
                key={`${rowIndex}-${keyIndex}`}
                className={`${className} relative`}
                style={{ width: `${width}px`, height: `${KEY_H}px` }}
              >
                <span className="leading-none">{keyDef.label}</span>
                {hasBump && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-[2px] bg-current opacity-40 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
