import React, { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { colord } from 'colord';
import { Pipette, Check } from 'lucide-react';

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  showAlpha?: boolean;
}

// Curated Material Design Color Swatches
const MATERIAL_SWATCHES = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7',
  '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
  '#009688', '#4caf50', '#8bc34a', '#cddc39',
  '#ffeb3b', '#ffc107', '#ff9800', '#ff5722',
  '#795548', '#607d8b', '#18181b', '#ffffff'
];

export const ColorPickerPopover: React.FC<ColorPickerPopoverProps> = ({
  color,
  onChange,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(color || '#000000');
  const popoverRef = useRef<HTMLDivElement>(null);

  // Sync internal hex text when color prop changes
  useEffect(() => {
    setHexInput(color || '#000000');
  }, [color]);

  // Click outside to close popover
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (colord(val).isValid()) {
      onChange(colord(val).toHex());
    }
  };

  const handlePickerChange = (newHex: string) => {
    setHexInput(newHex);
    onChange(newHex);
  };

  const validColor = colord(color).isValid() ? color : '#ffffff';

  return (
    <div className="relative inline-block w-full" ref={popoverRef}>
      {/* Trigger Button & Color Preview */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-8 h-8 rounded-xl border border-zinc-700 hover:border-blue-500 shadow-sm cursor-pointer transition-transform active:scale-95 shrink-0 overflow-hidden group"
          title={`Choose ${label || 'color'}`}
        >
          <span
            className="absolute inset-0 w-full h-full"
            style={{ backgroundColor: validColor }}
          />
          <span className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Pipette className="w-3.5 h-3.5 text-white" />
          </span>
        </button>

        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#ffffff"
          className="w-full px-2.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none focus:border-blue-500 transition-colors uppercase"
        />
      </div>

      {/* Material Style Popover Dialog */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-3 bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 w-[240px]">
          {label && (
            <div className="text-[11px] font-semibold text-zinc-300 mb-2 pb-1.5 border-b border-zinc-800 flex items-center justify-between">
              <span>{label}</span>
              <span className="font-mono text-[10px] text-blue-400">{validColor}</span>
            </div>
          )}

          {/* Smooth 60fps Color Wheel */}
          <div className="custom-color-picker mb-3">
            <HexColorPicker color={validColor} onChange={handlePickerChange} />
          </div>

          {/* Quick Material Swatches Palette */}
          <div>
            <div className="text-[10px] text-zinc-500 mb-1.5 uppercase font-medium tracking-wider">
              Material Palette
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {MATERIAL_SWATCHES.map((swatch) => {
                const isSelected = swatch.toLowerCase() === validColor.toLowerCase();
                return (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => {
                      handlePickerChange(swatch);
                    }}
                    style={{ backgroundColor: swatch }}
                    className="relative w-7 h-7 rounded-lg border border-white/10 hover:scale-110 active:scale-95 transition-transform cursor-pointer flex items-center justify-center shadow-xs"
                    title={swatch}
                  >
                    {isSelected && (
                      <Check
                        className={`w-3.5 h-3.5 stroke-[3] ${
                          colord(swatch).isLight() ? 'text-black' : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
