import React from 'react';
import { Palette, SunMedium, Compass } from 'lucide-react';
import { ColorConfig, QRState } from '../types/qr';
import { ColorPickerPopover } from './ColorPickerPopover';

interface ColorsTabProps {
  state: QRState;
  onChange: (updates: Partial<QRState>) => void;
}

const COLOR_PALETTES = [
  { name: 'Electric Cobalt', c1: '#2563eb', c2: '#1d4ed8' },
  { name: 'Cyber Emerald', c1: '#10b981', c2: '#047857' },
  { name: 'Neon Purple', c1: '#8b5cf6', c2: '#6d28d9' },
  { name: 'Sunset Orange', c1: '#f97316', c2: '#db2777' },
  { name: 'Amber Gold', c1: '#fbbf24', c2: '#d97706' },
  { name: 'Rose Coral', c1: '#f43f5e', c2: '#be123c' },
  { name: 'Deep Cyan', c1: '#06b6d4', c2: '#0e7490' },
  { name: 'Obsidian Black', c1: '#09090b', c2: '#18181b' }
];

export const ColorsTab: React.FC<ColorsTabProps> = ({ state, onChange }) => {
  const colors = state.colors;

  return (
    <div className="space-y-6">
      {/* 1. Fill Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
          QR Color Fill Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['solid', 'linear', 'radial'] as const).map((type) => {
            const active = colors.type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ colors: { ...colors, type } })}
                className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer text-center ${
                  active
                    ? 'bg-blue-600/15 border-blue-500 text-blue-400 shadow-sm'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {type} {type !== 'solid' && 'Gradient'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Color Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" />
          Color Palette
        </div>

        {/* Primary Color and Secondary Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Primary Color
            </label>
            <ColorPickerPopover
              color={colors.color1 || '#2563eb'}
              onChange={(c) => onChange({ colors: { ...colors, color1: c } })}
              label="Primary Color"
            />
          </div>

          {colors.type !== 'solid' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Secondary Gradient Color
              </label>
              <ColorPickerPopover
                color={colors.color2 || '#1d4ed8'}
                onChange={(c) => onChange({ colors: { ...colors, color2: c } })}
                label="Secondary Color"
              />
            </div>
          )}
        </div>

        {/* Gradient Angle Slider */}
        {colors.type === 'linear' && (
          <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-400" />
                Gradient Angle
              </span>
              <span className="font-mono text-zinc-400">{colors.angle}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={colors.angle}
              onChange={(e) =>
                onChange({
                  colors: { ...colors, angle: parseInt(e.target.value) }
                })
              }
              className="w-full"
            />
          </div>
        )}

        {/* Quick Palette Bar */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
          <label className="block text-[11px] text-zinc-400">
            Quick Color Presets
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {COLOR_PALETTES.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() =>
                  onChange({
                    colors: {
                      ...colors,
                      color1: p.c1,
                      color2: p.c2
                    }
                  })
                }
                title={p.name}
                className="w-7 h-7 rounded-lg border border-zinc-700 hover:border-white transition-transform hover:scale-110 cursor-pointer shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${p.c1} 0%, ${p.c2} 100%)`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 3. Background Color & Transparency */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <SunMedium className="w-4 h-4 text-blue-400" />
            Canvas Background
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={colors.bgTransparent}
              onChange={(e) =>
                onChange({
                  colors: { ...colors, bgTransparent: e.target.checked }
                })
              }
              className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-blue-600 focus:ring-blue-500"
            />
            Transparent
          </label>
        </div>

        {!colors.bgTransparent && (
          <div className="space-y-1.5">
            <ColorPickerPopover
              color={colors.bgColor || '#ffffff'}
              onChange={(c) => onChange({ colors: { ...colors, bgColor: c } })}
              label="Canvas Background"
            />
          </div>
        )}
      </div>
    </div>
  );
};
