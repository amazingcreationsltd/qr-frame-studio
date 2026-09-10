import React from 'react';
import {
  Check,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Sliders,
  Maximize2,
  Square,
  Sparkles
} from 'lucide-react';
import { FrameStyle, QRState } from '../types/qr';
import fontsConfig from '../config/fonts.json';
import { ColorPickerPopover } from './ColorPickerPopover';

interface FramesTabProps {
  state: QRState;
  onChange: (updates: Partial<QRState>) => void;
}

const PRESET_FONT_SIZES = [
  { value: 12, label: '12px (Micro)' },
  { value: 16, label: '16px (Small)' },
  { value: 20, label: '20px (Compact)' },
  { value: 24, label: '24px (Normal)' },
  { value: 28, label: '28px (Medium - Default)' },
  { value: 32, label: '32px (Large)' },
  { value: 38, label: '38px (Extra Large)' },
  { value: 44, label: '44px (Huge)' },
  { value: 52, label: '52px (Display)' },
  { value: 64, label: '64px (Giant)' },
  { value: 80, label: '80px (Ultra)' }
];

const FRAMES: { id: FrameStyle; label: string; preview: React.ReactNode }[] = [
  {
    id: 'none',
    label: 'No Frame',
    preview: (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 rounded-lg border border-dashed border-zinc-700 text-[10px] text-zinc-500 font-mono">
        Clean QR
      </div>
    )
  },
  {
    id: 'bottom-pill',
    label: 'Bottom Pill',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-between p-2 bg-zinc-950 rounded-lg border border-zinc-800">
        <div className="w-8 h-8 rounded bg-zinc-800/80 mt-1" />
        <div className="px-2 py-0.5 rounded-full bg-blue-600 text-[8px] font-bold text-white tracking-wider">
          SCAN ME
        </div>
      </div>
    )
  },
  {
    id: 'top-ribbon',
    label: 'Top Ribbon',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-between p-2 bg-zinc-950 rounded-lg border border-zinc-800">
        <div className="w-full py-0.5 rounded bg-blue-600 text-[8px] font-bold text-white text-center tracking-wider">
          SCAN ME
        </div>
        <div className="w-8 h-8 rounded bg-zinc-800/80 mb-1" />
      </div>
    )
  },
  {
    id: 'bottom-ribbon',
    label: 'Bottom Ribbon',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-between p-2 bg-zinc-950 rounded-lg border border-zinc-800">
        <div className="w-8 h-8 rounded bg-zinc-800/80 mt-1" />
        <div className="w-full py-0.5 rounded bg-blue-600 text-[8px] font-bold text-white text-center tracking-wider">
          SCAN ME
        </div>
      </div>
    )
  },
  {
    id: 'top-pill',
    label: 'Top Pill',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-between p-2 bg-zinc-950 rounded-lg border border-zinc-800">
        <div className="px-2 py-0.5 rounded-full bg-blue-600 text-[8px] font-bold text-white tracking-wider">
          SCAN ME
        </div>
        <div className="w-8 h-8 rounded bg-zinc-800/80 mb-1" />
      </div>
    )
  },
  {
    id: 'polaroid',
    label: 'Polaroid Card',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-between p-2 bg-zinc-900 rounded-lg border border-zinc-700 shadow-sm">
        <div className="w-9 h-9 rounded bg-zinc-950 mt-1" />
        <div className="text-[9px] font-semibold text-zinc-300">
          Visit Us
        </div>
      </div>
    )
  },
  {
    id: 'phone',
    label: 'Smartphone',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-between p-1.5 bg-zinc-950 rounded-xl border-2 border-zinc-700">
        <div className="w-6 h-1 rounded-full bg-zinc-800" />
        <div className="w-8 h-8 rounded bg-zinc-900" />
        <div className="w-5 h-0.5 rounded-full bg-zinc-700" />
      </div>
    )
  },
  {
    id: 'chat-bubble',
    label: 'Chat Bubble',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-zinc-900 rounded-xl border border-zinc-700 relative">
        <div className="w-8 h-8 rounded bg-zinc-950" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 rotate-45 border-r border-b border-zinc-700" />
      </div>
    )
  },
  {
    id: 'ticket',
    label: 'Ticket Coupon',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-between p-2 bg-zinc-900 rounded-lg border border-dashed border-zinc-600">
        <div className="w-8 h-8 rounded bg-zinc-950" />
        <div className="text-[8px] font-mono text-zinc-400">#COUPON</div>
      </div>
    )
  },
  {
    id: 'circular-badge',
    label: 'Circular Badge',
    preview: (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 rounded-full border-2 border-dashed border-blue-500/60 p-2">
        <div className="w-7 h-7 rounded bg-zinc-800" />
      </div>
    )
  },
  {
    id: 'minimal-card',
    label: 'Minimal Card',
    preview: (
      <div className="w-full h-full flex flex-col items-center justify-between p-2 bg-zinc-950 rounded-lg border border-zinc-800">
        <div className="w-8 h-8 rounded bg-zinc-800/80 mt-1" />
        <div className="px-2 py-0.5 rounded bg-zinc-800 text-[8px] font-bold text-zinc-300">
          CONNECT
        </div>
      </div>
    )
  },
  {
    id: 'neon-border',
    label: 'Neon Glow',
    preview: (
      <div className="w-full h-full flex items-center justify-center bg-zinc-950 rounded-lg border-2 border-blue-500 shadow-md shadow-blue-500/30 p-2">
        <div className="w-8 h-8 rounded bg-zinc-900" />
      </div>
    )
  }
];

export const FramesTab: React.FC<FramesTabProps> = ({ state, onChange }) => {
  const frame = state.frame;
  const canvas = state.canvas || {
    qrPadding: 16,
    canvasRadius: 20,
    canvasBg: '#ffffff',
    canvasBorderWidth: 0,
    canvasBorderColor: '#e4e4e7',
    canvasShadow: false
  };

  // Dynamic list of fonts from src/config/fonts.json
  const fontList = fontsConfig.fonts || [];

  return (
    <div className="space-y-7">
      {/* 1. Frame Style Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Select Frame Style
          </label>
          <span className="text-[11px] text-zinc-500 font-mono">
            {FRAMES.find((f) => f.id === frame.style)?.label}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {FRAMES.map((f) => {
            const active = frame.style === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() =>
                  onChange({
                    frame: { ...frame, style: f.id }
                  })
                }
                className={`relative flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer text-center group ${
                  active
                    ? 'bg-zinc-900 border-blue-500 ring-2 ring-blue-500/30 shadow-md shadow-blue-500/10'
                    : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div className="w-full h-14 mb-2 flex items-center justify-center">
                  {f.preview}
                </div>
                <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white truncate max-w-full">
                  {f.label}
                </span>
                {active && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white ring-1 ring-zinc-900">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. White Bounding Box & Canvas Padding Customization */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-blue-400" />
            White Bounding Box & Canvas Padding
          </span>
          <span className="text-[10px] text-zinc-500">QR Code Remains 100% Intact</span>
        </div>

        {/* QR Inner Padding Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-300">
            <span className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              QR Code Margin (Inner Padding within Bounding Box)
            </span>
            <span className="font-mono text-zinc-400 text-xs font-semibold">
              {canvas.qrPadding || 0}px
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={45}
            value={canvas.qrPadding ?? 16}
            onChange={(e) =>
              onChange({
                canvas: { ...canvas, qrPadding: parseInt(e.target.value) }
              })
            }
            className="w-full"
          />
          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
            <span>Edge-to-Edge (0px)</span>
            <span>Balanced (16px)</span>
            <span>Generous Whitespace (45px)</span>
          </div>
        </div>

        {/* Bounding Box Corner Radius & Background */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-zinc-800/60">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Square className="w-3.5 h-3.5 text-blue-400" />
                Card Corner Radius
              </span>
              <span className="font-mono text-zinc-400 text-xs">{canvas.canvasRadius ?? 20}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={canvas.canvasRadius ?? 20}
              onChange={(e) =>
                onChange({
                  canvas: { ...canvas, canvasRadius: parseInt(e.target.value) }
                })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Card Background Color
            </label>
            <ColorPickerPopover
              color={canvas.canvasBg || '#ffffff'}
              onChange={(c) => onChange({ canvas: { ...canvas, canvasBg: c } })}
              label="Card Background"
            />
          </div>
        </div>

        {/* Border Stroke on Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-zinc-800/60">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span>Card Border Stroke Width</span>
              <span className="font-mono text-zinc-400 text-xs">{canvas.canvasBorderWidth ?? 0}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              value={canvas.canvasBorderWidth ?? 0}
              onChange={(e) =>
                onChange({
                  canvas: { ...canvas, canvasBorderWidth: parseInt(e.target.value) }
                })
              }
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Card Border Color
            </label>
            <ColorPickerPopover
              color={canvas.canvasBorderColor || '#e4e4e7'}
              onChange={(c) => onChange({ canvas: { ...canvas, canvasBorderColor: c } })}
              label="Card Border"
            />
          </div>
        </div>
      </div>

      {/* 3. Frame Banner & Text Typography Customization */}
      {frame.style !== 'none' && (
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Type className="w-4 h-4 text-blue-400" />
              Frame Banner & Text Customization
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">fonts.json active</span>
          </div>

          {/* Primary CTA & Subtext */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Primary CTA Text
              </label>
              <input
                type="text"
                value={frame.text}
                maxLength={30}
                onChange={(e) =>
                  onChange({
                    frame: { ...frame, text: e.target.value }
                  })
                }
                placeholder="SCAN ME"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Subtext (Optional for cards)
              </label>
              <input
                type="text"
                value={frame.subtext}
                maxLength={40}
                onChange={(e) =>
                  onChange({
                    frame: { ...frame, subtext: e.target.value }
                  })
                }
                placeholder="Point camera to open link"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Typography Toolbar: Google Font Dropdown, Size, Align, Bold, Italic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-zinc-800/60">
            {/* Font Family Dropdown from JSON */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Google Font Family <span className="text-[10px] text-zinc-500">(from fonts.json)</span>
              </label>
              <select
                value={frame.font || 'Manrope'}
                onChange={(e) =>
                  onChange({
                    frame: { ...frame, font: e.target.value }
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {fontList.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size: Preset Dropdown Menu + Custom Font Size Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-zinc-300">
                <span className="font-medium">Font Size</span>
                <span className="font-mono text-blue-400 text-xs font-semibold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                  {frame.fontSize || 28}px
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {/* General Sizes Dropdown */}
                <select
                  value={
                    PRESET_FONT_SIZES.some((p) => p.value === (frame.fontSize || 28))
                      ? (frame.fontSize || 28)
                      : 'custom'
                  }
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) onChange({ frame: { ...frame, fontSize: val } });
                    }
                  }}
                  className="col-span-3 px-2.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                  title="Select General Font Size"
                >
                  {PRESET_FONT_SIZES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                  <option value="custom">Custom Size...</option>
                </select>

                {/* Custom Font Size Number Input */}
                <div className="col-span-2 relative flex items-center">
                  <input
                    type="number"
                    min={6}
                    max={140}
                    value={frame.fontSize || 28}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val)) {
                        onChange({ frame: { ...frame, fontSize: Math.max(6, Math.min(140, val)) } });
                      }
                    }}
                    placeholder="28"
                    className="w-full px-2 py-2 pr-6 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 font-mono text-center"
                    title="Enter custom font size in pixels (6px - 140px)"
                  />
                  <span className="absolute right-2 text-[10px] text-zinc-500 pointer-events-none font-mono">
                    px
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Alignment & Formatting Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
            {/* Alignment Buttons */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {(['left', 'center', 'right'] as const).map((al) => {
                const active = (frame.textAlign || 'center') === al;
                const IconComp = al === 'left' ? AlignLeft : al === 'center' ? AlignCenter : AlignRight;
                return (
                  <button
                    key={al}
                    type="button"
                    onClick={() => onChange({ frame: { ...frame, textAlign: al } })}
                    className={`p-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                    title={`Align ${al}`}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            {/* Bold, Italic, Uppercase Toggles */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ frame: { ...frame, bold: !(frame.bold !== false) } })}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  frame.bold !== false
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
                title="Toggle Bold"
              >
                <Bold className="w-3.5 h-3.5" />
                <span>Bold</span>
              </button>

              <button
                type="button"
                onClick={() => onChange({ frame: { ...frame, italic: !frame.italic } })}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium italic transition-all cursor-pointer flex items-center gap-1 ${
                  frame.italic
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
                title="Toggle Italic"
              >
                <Italic className="w-3.5 h-3.5" />
                <span>Italic</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange({ frame: { ...frame, uppercase: !(frame.uppercase !== false) } })
                }
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  frame.uppercase !== false
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
                title="Toggle Uppercase"
              >
                AA (Caps)
              </button>
            </div>
          </div>

          {/* High Performance Material Color Palettes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-800/60">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Badge / Accent
              </label>
              <ColorPickerPopover
                color={frame.badgeColor || '#2563eb'}
                onChange={(c) => onChange({ frame: { ...frame, badgeColor: c } })}
                label="Badge / Accent"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Frame Body
              </label>
              <ColorPickerPopover
                color={frame.bgColor || '#18181b'}
                onChange={(c) => onChange({ frame: { ...frame, bgColor: c } })}
                label="Frame Body"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Text Color
              </label>
              <ColorPickerPopover
                color={frame.textColor || '#ffffff'}
                onChange={(c) => onChange({ frame: { ...frame, textColor: c } })}
                label="Text Color"
              />
            </div>

            <div>
              <label className="block text-[11px] text-zinc-400 mb-1">
                Stroke Color
              </label>
              <ColorPickerPopover
                color={frame.strokeColor || '#27272a'}
                onChange={(c) => onChange({ frame: { ...frame, strokeColor: c } })}
                label="Stroke Color"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
