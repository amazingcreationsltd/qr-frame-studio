import React from 'react';
import { Check, Sparkles, Sliders, Palette, Link2 } from 'lucide-react';
import { BodyShape, EyeFrameShape, EyeBallShape, QRState } from '../types/qr';
import { ColorPickerPopover } from './ColorPickerPopover';

interface PatternsTabProps {
  state: QRState;
  onChange: (updates: Partial<QRState>) => void;
}

const BODY_SHAPES: { id: BodyShape; label: string; svg: React.ReactNode }[] = [
  {
    id: 'square',
    label: 'Square',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    )
  },
  {
    id: 'rounded',
    label: 'Rounded',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <rect x="3" y="3" width="7" height="7" rx="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" />
        <rect x="14" y="14" width="7" height="7" rx="2" />
      </svg>
    )
  },
  {
    id: 'extra-rounded',
    label: 'Squircle',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <rect x="3" y="3" width="7" height="7" rx="3.5" />
        <rect x="14" y="3" width="7" height="7" rx="3.5" />
        <rect x="3" y="14" width="7" height="7" rx="3.5" />
        <rect x="14" y="14" width="7" height="7" rx="3.5" />
      </svg>
    )
  },
  {
    id: 'dots',
    label: 'Dots',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <circle cx="6.5" cy="6.5" r="3.5" />
        <circle cx="17.5" cy="6.5" r="3.5" />
        <circle cx="6.5" cy="17.5" r="3.5" />
        <circle cx="17.5" cy="17.5" r="3.5" />
      </svg>
    )
  },
  {
    id: 'small-dots',
    label: 'Micro Dots',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <circle cx="6.5" cy="6.5" r="2.2" />
        <circle cx="17.5" cy="6.5" r="2.2" />
        <circle cx="6.5" cy="17.5" r="2.2" />
        <circle cx="17.5" cy="17.5" r="2.2" />
      </svg>
    )
  },
  {
    id: 'fluid-liquid',
    label: 'Fluid',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M4 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
        <circle cx="17.5" cy="6.5" r="3.5" />
        <path d="M12 16a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" />
        <rect x="4" y="14" width="7" height="7" rx="3.5" />
      </svg>
    )
  },
  {
    id: 'horizontal-lines',
    label: 'Horizontal Lines',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <rect x="3" y="4.5" width="18" height="4" rx="2" />
        <rect x="3" y="11" width="18" height="4" rx="2" />
        <rect x="3" y="17.5" width="18" height="4" rx="2" />
      </svg>
    )
  },
  {
    id: 'vertical-lines',
    label: 'Vertical Lines',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <rect x="4.5" y="3" width="4" height="18" rx="2" />
        <rect x="11" y="3" width="4" height="18" rx="2" />
        <rect x="17.5" y="3" width="4" height="18" rx="2" />
      </svg>
    )
  },
  {
    id: 'circuit',
    label: 'Circuit',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <circle cx="6" cy="6" r="3" />
        <path d="M6 9v6h6v3" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="18" cy="18" r="3" />
      </svg>
    )
  },
  {
    id: 'diamonds',
    label: 'Diamonds',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <polygon points="6.5,2 11,6.5 6.5,11 2,6.5" />
        <polygon points="17.5,2 22,6.5 17.5,11 13,6.5" />
        <polygon points="6.5,13 11,17.5 6.5,22 2,17.5" />
        <polygon points="17.5,13 22,17.5 17.5,22 13,17.5" />
      </svg>
    )
  },
  {
    id: 'sparkles',
    label: 'Sparkles',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M12 2c0 5 5 10 10 10-5 0-10 5-10 10 0-5-5-10-10-10 5 0 10-5 10-10z" />
      </svg>
    )
  },
  {
    id: 'hearts',
    label: 'Hearts',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    )
  },
  {
    id: 'crosses',
    label: 'Crosses',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M10 3h4v6h6v4h-6v8h-4v-8H4V9h6z" />
      </svg>
    )
  },
  {
    id: 'triangles',
    label: 'Triangles',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <polygon points="6.5,3 11,10 2,10" />
        <polygon points="17.5,3 22,10 13,10" />
        <polygon points="6.5,14 11,21 2,21" />
        <polygon points="17.5,14 22,21 13,21" />
      </svg>
    )
  },
  {
    id: 'blobs',
    label: 'Blobs',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <rect x="3" y="3" width="8" height="8" rx="4" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="4" />
      </svg>
    )
  },
  {
    id: 'bubbles',
    label: 'Bubbles',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <circle cx="8" cy="8" r="5" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="16" cy="16" r="4.5" />
      </svg>
    )
  },
  {
    id: 'hexagons',
    label: 'Hexagons',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" />
      </svg>
    )
  },
  {
    id: 'chamfered',
    label: 'Chamfered',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <polygon points="6,2 18,2 22,6 22,18 18,22 6,22 2,18 2,6" />
      </svg>
    )
  },
  {
    id: 'diagonal',
    label: 'Diagonal',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <line x1="3" y1="21" x2="21" y2="3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'stars',
    label: 'Stars',
    svg: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.3 9,8.5" />
      </svg>
    )
  }
];

const EYE_FRAMES: { id: EyeFrameShape; label: string; svg: React.ReactNode }[] = [
  {
    id: 'square',
    label: 'Square Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <path fillRule="evenodd" d="M2 2h24v24H2V2zm4 4h16v16H6V6z" />
      </svg>
    )
  },
  {
    id: 'rounded',
    label: 'Rounded Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <rect x="2" y="2" width="24" height="24" rx="6" />
        <rect x="6" y="6" width="16" height="16" rx="3" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'circle',
    label: 'Circle Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <circle cx="14" cy="14" r="12" />
        <circle cx="14" cy="14" r="8" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'squircle',
    label: 'Squircle Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <rect x="2" y="2" width="24" height="24" rx="10" />
        <rect x="6" y="6" width="16" height="16" rx="7" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'leaf-single',
    label: 'Leaf Single',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <path d="M14 2h12v24H2V14C2 7.37 7.37 2 14 2z" />
        <path d="M14 6h8v16H6v-8c0-4.42 3.58-8 8-8z" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'leaf-dual',
    label: 'Leaf Dual',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <path d="M14 2h12v12c0 6.63-5.37 12-12 12H2V14C2 7.37 7.37 2 14 2z" />
        <path d="M14 6h8v8c0 4.42-3.58 8-8 8H6v-8c0-4.42 3.58-8 8-8z" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'chamfered',
    label: 'Chamfered',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <polygon points="7,2 21,2 26,7 26,21 21,26 7,26 2,21 2,7" />
        <polygon points="9,6 19,6 22,9 22,19 19,22 9,22 6,19 6,9" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'hexagon',
    label: 'Hexagon Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <polygon points="14,2 24,7.5 24,20.5 14,26 4,20.5 4,7.5" />
        <polygon points="14,6 20,9.5 20,18.5 14,22 8,18.5 8,9.5" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'octagon',
    label: 'Octagon Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <polygon points="9,2 19,2 26,9 26,19 19,26 9,26 2,19 2,9" />
        <polygon points="10,6 18,6 22,10 22,18 18,22 10,22 6,18 6,10" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'beaded',
    label: 'Beaded Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <circle cx="14" cy="3" r="2" />
        <circle cx="21.5" cy="6.5" r="2" />
        <circle cx="25" cy="14" r="2" />
        <circle cx="21.5" cy="21.5" r="2" />
        <circle cx="14" cy="25" r="2" />
        <circle cx="6.5" cy="21.5" r="2" />
        <circle cx="3" cy="14" r="2" />
        <circle cx="6.5" cy="6.5" r="2" />
      </svg>
    )
  },
  {
    id: 'postage',
    label: 'Postage Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <rect x="3" y="3" width="22" height="22" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" fill="none" />
      </svg>
    )
  },
  {
    id: 'speech',
    label: 'Speech Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <path d="M2 8a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H8l-6 4z" />
        <rect x="6" y="6" width="16" height="12" rx="3" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'double-ring',
    label: 'Double Ring',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="14" cy="14" r="11" />
        <circle cx="14" cy="14" r="7" />
      </svg>
    )
  },
  {
    id: 'diamond',
    label: 'Diamond Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <polygon points="14,2 26,14 14,26 2,14" />
        <polygon points="14,6 22,14 14,22 6,14" fill="#09090b" />
      </svg>
    )
  },
  {
    id: 'pillow',
    label: 'Pillow Frame',
    svg: (
      <svg viewBox="0 0 28 28" className="w-7 h-7 fill-current">
        <rect x="2" y="2" width="24" height="24" rx="4" />
        <rect x="6" y="6" width="16" height="16" rx="2" fill="#09090b" />
      </svg>
    )
  }
];

const EYE_BALLS: { id: EyeBallShape; label: string; svg: React.ReactNode }[] = [
  {
    id: 'square',
    label: 'Square Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <rect x="3" y="3" width="14" height="14" />
      </svg>
    )
  },
  {
    id: 'circle',
    label: 'Circle Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <circle cx="10" cy="10" r="7" />
      </svg>
    )
  },
  {
    id: 'rounded',
    label: 'Rounded Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <rect x="3" y="3" width="14" height="14" rx="4" />
      </svg>
    )
  },
  {
    id: 'leaf-single',
    label: 'Leaf Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <path d="M10 3h7v14H3V10C3 6.13 6.13 3 10 3z" />
      </svg>
    )
  },
  {
    id: 'leaf-dual',
    label: 'Dual Leaf Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <path d="M10 3h7v7c0 3.87-3.13 7-7 7H3V10c0-3.87 3.13-7 7-7z" />
      </svg>
    )
  },
  {
    id: 'diamond',
    label: 'Diamond Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <polygon points="10,2 18,10 10,18 2,10" />
      </svg>
    )
  },
  {
    id: 'heart',
    label: 'Heart Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <path d="M10 17.5l-1.2-1.1C4.5 12.5 2 9.9 2 6.8 2 4.3 4 2.3 6.5 2.3c1.4 0 2.8.7 3.5 1.7.7-1 2.1-1.7 3.5-1.7 2.5 0 4.5 2 4.5 4.5 0 3.1-2.5 5.7-6.8 9.6L10 17.5z" />
      </svg>
    )
  },
  {
    id: 'star',
    label: 'Star Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <polygon points="10,2 12.5,7 18,7.7 14,11.5 15.2,17 10,14.2 4.8,17 6,11.5 2,7.7 7.5,7" />
      </svg>
    )
  },
  {
    id: 'sparkle',
    label: 'Sparkle Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <path d="M10 2c0 4 4 8 8 8-4 0-8 4-8 8 0-4-4-8-8-8 4 0 8-4 8-8z" />
      </svg>
    )
  },
  {
    id: 'cross',
    label: 'Cross Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <path d="M7 2h6v5h5v6h-5v5H7v-5H2V7h5z" />
      </svg>
    )
  },
  {
    id: 'dot-grid',
    label: '3x3 Grid Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <circle cx="5" cy="5" r="1.8" />
        <circle cx="10" cy="5" r="1.8" />
        <circle cx="15" cy="5" r="1.8" />
        <circle cx="5" cy="10" r="1.8" />
        <circle cx="10" cy="10" r="1.8" />
        <circle cx="15" cy="10" r="1.8" />
        <circle cx="5" cy="15" r="1.8" />
        <circle cx="10" cy="15" r="1.8" />
        <circle cx="15" cy="15" r="1.8" />
      </svg>
    )
  },
  {
    id: 'vertical-bars',
    label: '3 Bars Vertical',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <rect x="3.5" y="3" width="3" height="14" rx="1.5" />
        <rect x="8.5" y="3" width="3" height="14" rx="1.5" />
        <rect x="13.5" y="3" width="3" height="14" rx="1.5" />
      </svg>
    )
  },
  {
    id: 'horizontal-bars',
    label: '3 Bars Horizontal',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <rect x="3" y="3.5" width="14" height="3" rx="1.5" />
        <rect x="3" y="8.5" width="14" height="3" rx="1.5" />
        <rect x="3" y="13.5" width="14" height="3" rx="1.5" />
      </svg>
    )
  },
  {
    id: 'flower',
    label: 'Flower Scallop',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <circle cx="7" cy="7" r="3.5" />
        <circle cx="13" cy="7" r="3.5" />
        <circle cx="7" cy="13" r="3.5" />
        <circle cx="13" cy="13" r="3.5" />
      </svg>
    )
  },
  {
    id: 'octagon',
    label: 'Octagon Ball',
    svg: (
      <svg viewBox="0 0 20 20" className="w-5 h-5 fill-current">
        <polygon points="7,3 13,3 17,7 17,13 13,17 7,17 3,13 3,7" />
      </svg>
    )
  }
];

export const PatternsTab: React.FC<PatternsTabProps> = ({ state, onChange }) => {
  return (
    <div className="space-y-8">
      {/* 1. Body Shape Selector (Matching Screenshot 1 & 2) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shadow-sm"
              style={{ backgroundColor: state.colors.color1 || '#2563eb' }}
            />
            Body Shape
          </label>
          <span className="text-[11px] text-zinc-500 font-mono">
            {BODY_SHAPES.find((s) => s.id === state.bodyShape)?.label}
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2.5">
          {BODY_SHAPES.map((shape) => {
            const active = state.bodyShape === shape.id;
            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => onChange({ bodyShape: shape.id })}
                title={shape.label}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all cursor-pointer p-2 ${
                  active
                    ? 'bg-zinc-800 border-blue-500 text-blue-400 ring-2 ring-blue-500/30 shadow-md shadow-blue-500/10'
                    : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                {shape.svg}
                {active && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center text-white ring-1 ring-zinc-900">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Body Module Scale & Density Controls */}
        <div className="mt-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          {/* Module Scale Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-2 font-medium">
                <Sliders className="w-4 h-4 text-blue-400" />
                Body Shape Scale (Dot Size)
              </span>
              <span className="font-mono text-zinc-400 text-xs font-semibold">
                {state.moduleScale || 90}%
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={100}
              value={state.moduleScale || 90}
              onChange={(e) =>
                onChange({ moduleScale: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
              <span>Finer & Spaced (40%)</span>
              <span>Balanced (85%)</span>
              <span>Bold & Touching (100%)</span>
            </div>
          </div>

          {/* Grid Density / Error Correction Level */}
          <div className="pt-3 border-t border-zinc-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="font-medium">Grid Density & Dot Quantity</span>
              <span className="text-[10px] text-zinc-500">
                {state.errorCorrectionLevel === 'L' && 'Fewest & Largest Dots (7% ECL)'}
                {state.errorCorrectionLevel === 'M' && 'Balanced Grid (15% ECL)'}
                {state.errorCorrectionLevel === 'Q' && 'Dense Grid (25% ECL)'}
                {state.errorCorrectionLevel === 'H' && 'Maximum Redundancy (30% ECL)'}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'L', label: 'Low', desc: 'Fewest Dots' },
                { id: 'M', label: 'Medium', desc: 'Standard' },
                { id: 'Q', label: 'Quartile', desc: 'High' },
                { id: 'H', label: 'High', desc: 'Max Recovery' }
              ].map((lvl) => {
                const active = state.errorCorrectionLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        errorCorrectionLevel: lvl.id as 'L' | 'M' | 'Q' | 'H'
                      })
                    }
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{lvl.id}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{lvl.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Markers Shape (Finder Eyes) */}
      <div className="pt-2 border-t border-zinc-800/80 space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shadow-sm"
              style={{
                backgroundColor: state.colors.eyeUseCustom
                  ? (state.colors.eyeBorderColor || state.colors.color1)
                  : (state.colors.color1 || '#2563eb')
              }}
            />
            Markers Shape (Eyes)
          </label>
        </div>

        {/* Marker Border (Eye Frame) */}
        <div>
          <div className="text-[11px] font-medium text-zinc-400 mb-2">
            Marker Border (Outer Frame)
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {EYE_FRAMES.map((frame) => {
              const active = state.eyeFrameShape === frame.id;
              return (
                <button
                  key={frame.id}
                  type="button"
                  onClick={() => onChange({ eyeFrameShape: frame.id })}
                  title={frame.label}
                  className={`relative aspect-square flex items-center justify-center rounded-xl border transition-all cursor-pointer p-1.5 ${
                    active
                      ? 'bg-zinc-800 border-blue-500 text-blue-400 ring-2 ring-blue-500/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/70 hover:text-white'
                  }`}
                >
                  {frame.svg}
                  {active && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center text-white ring-1 ring-zinc-900">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Marker Centre (Eye Ball) */}
        <div>
          <div className="text-[11px] font-medium text-zinc-400 mb-2">
            Marker Centre (Inner Pupil)
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {EYE_BALLS.map((ball) => {
              const active = state.eyeBallShape === ball.id;
              return (
                <button
                  key={ball.id}
                  type="button"
                  onClick={() => onChange({ eyeBallShape: ball.id })}
                  title={ball.label}
                  className={`relative aspect-square flex items-center justify-center rounded-xl border transition-all cursor-pointer p-1.5 ${
                    active
                      ? 'bg-zinc-800 border-blue-500 text-blue-400 ring-2 ring-blue-500/30'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/70 hover:text-white'
                  }`}
                >
                  {ball.svg}
                  {active && (
                    <span className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center text-white ring-1 ring-zinc-900">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colors (Body, Eyes & Pupils) Customization */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" />
              <span>Colors (Body, Eyes & Pupils)</span>
            </label>

            {/* Separate Eye Colors Toggle */}
            <div className="flex items-center gap-2">
              <label htmlFor="custom-eye-toggle" className="text-xs font-medium text-zinc-300 cursor-pointer flex items-center gap-1.5">
                <span>Separate Eye Colors</span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="custom-eye-toggle"
                  type="checkbox"
                  checked={state.colors.eyeUseCustom}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    onChange({
                      colors: {
                        ...state.colors,
                        eyeUseCustom: checked,
                        // When turned off, sync eye colors back to body color
                        ...(!checked ? {
                          eyeBorderColor: state.colors.color1,
                          eyeCenterColor: state.colors.color1
                        } : {})
                      }
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* 1. Global Color Bar: Apply Color Globally to Body, Eyes & Pupils */}
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Global Color (Sync Body, Eyes & Pupils)</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  Changes color across the entire QR code (Body pattern, Eye outer frames, and Pupils) all together.
                </div>
              </div>

              {/* Master Global Color Picker */}
              <div className="w-full sm:w-48 shrink-0">
                <ColorPickerPopover
                  color={state.colors.color1 || '#2563eb'}
                  onChange={(c) => {
                    onChange({
                      colors: {
                        ...state.colors,
                        color1: c,
                        color2: state.colors.type === 'solid' ? c : state.colors.color2,
                        eyeBorderColor: c,
                        eyeCenterColor: c
                      }
                    });
                  }}
                  label="Global Color"
                />
              </div>
            </div>

            {/* Quick Preset Palette Swatches */}
            <div className="flex items-center gap-2 flex-wrap pt-2.5 border-t border-zinc-900">
              <span className="text-[10px] text-zinc-500 font-medium">Quick Global:</span>
              {[
                { name: 'Cobalt', color: '#2563eb' },
                { name: 'Emerald', color: '#10b981' },
                { name: 'Purple', color: '#8b5cf6' },
                { name: 'Sunset', color: '#f97316' },
                { name: 'Coral', color: '#f43f5e' },
                { name: 'Cyan', color: '#06b6d4' },
                { name: 'Amber', color: '#f59e0b' },
                { name: 'Pitch Dark', color: '#09090b' }
              ].map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  title={`Apply ${swatch.name} globally to all`}
                  onClick={() => {
                    onChange({
                      colors: {
                        ...state.colors,
                        color1: swatch.color,
                        color2: state.colors.type === 'solid' ? swatch.color : state.colors.color2,
                        eyeBorderColor: swatch.color,
                        eyeCenterColor: swatch.color
                      }
                    });
                  }}
                  className="w-5 h-5 rounded-md border border-white/20 hover:scale-115 active:scale-95 transition-transform cursor-pointer shadow-sm"
                  style={{ backgroundColor: swatch.color }}
                />
              ))}
            </div>
          </div>

          {/* 2. Individual Color Customization */}
          <div className="space-y-2">
            <div className="text-[11px] font-medium text-zinc-400">
              Individual Element Colors
            </div>

            <div className={`grid grid-cols-1 ${state.colors.eyeUseCustom ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3`}>
              {/* Body Shape Color */}
              <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-zinc-300">
                    Body Shape
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const c = state.colors.color1;
                      onChange({
                        colors: {
                          ...state.colors,
                          color2: state.colors.type === 'solid' ? c : state.colors.color2,
                          eyeBorderColor: c,
                          eyeCenterColor: c
                        }
                      });
                    }}
                    title="Apply body shape color to eyes & pupils"
                    className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1 font-medium hover:underline"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Apply to All</span>
                  </button>
                </div>
                <ColorPickerPopover
                  color={state.colors.color1 || '#2563eb'}
                  onChange={(c) =>
                    onChange({
                      colors: {
                        ...state.colors,
                        color1: c,
                        color2: state.colors.type === 'solid' ? c : state.colors.color2,
                        ...(!state.colors.eyeUseCustom ? {
                          eyeBorderColor: c,
                          eyeCenterColor: c
                        } : {})
                      }
                    })
                  }
                  label="Body Color"
                />
              </div>

              {state.colors.eyeUseCustom ? (
                <>
                  {/* Eye Border Color */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-medium text-zinc-300">
                        Eye Border (Outer)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const c = state.colors.eyeBorderColor || state.colors.color1;
                          onChange({
                            colors: {
                              ...state.colors,
                              color1: c,
                              color2: state.colors.type === 'solid' ? c : state.colors.color2,
                              eyeCenterColor: c
                            }
                          });
                        }}
                        title="Apply eye border color to body & pupils"
                        className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1 font-medium hover:underline"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Apply to All</span>
                      </button>
                    </div>
                    <ColorPickerPopover
                      color={state.colors.eyeBorderColor || state.colors.color1}
                      onChange={(c) =>
                        onChange({
                          colors: {
                            ...state.colors,
                            eyeBorderColor: c
                          }
                        })
                      }
                      label="Eye Border"
                    />
                  </div>

                  {/* Eye Centre / Pupil Color */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-medium text-zinc-300">
                        Inner Pupil
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const c = state.colors.eyeCenterColor || state.colors.color1;
                          onChange({
                            colors: {
                              ...state.colors,
                              color1: c,
                              color2: state.colors.type === 'solid' ? c : state.colors.color2,
                              eyeBorderColor: c
                            }
                          });
                        }}
                        title="Apply pupil color to body & eye border"
                        className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1 font-medium hover:underline"
                      >
                        <Link2 className="w-3 h-3" />
                        <span>Apply to All</span>
                      </button>
                    </div>
                    <ColorPickerPopover
                      color={state.colors.eyeCenterColor || state.colors.color1}
                      onChange={(c) =>
                        onChange({
                          colors: {
                            ...state.colors,
                            eyeCenterColor: c
                          }
                        })
                      }
                      label="Pupil Color"
                    />
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-xl bg-zinc-950/40 border border-dashed border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span className="flex items-center gap-2 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    Eyes & Pupils currently synchronized with Body Color
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange({ colors: { ...state.colors, eyeUseCustom: true } })}
                    className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 cursor-pointer underline ml-2 shrink-0"
                  >
                    Customize Separately
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
