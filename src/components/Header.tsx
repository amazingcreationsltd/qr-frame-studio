import React from 'react';
import { QrCode, Sparkles, RotateCcw, Download, Check } from 'lucide-react';
import { DESIGN_PRESETS } from '../engine/presets';
import { QRState } from '../types/qr';

interface HeaderProps {
  onSelectPreset: (presetState: Partial<QRState>) => void;
  onReset: () => void;
  onOpenExportModal: () => void;
  scannable: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onReset,
  onOpenExportModal,
  scannable
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight font-heading">
                QR Frame Studio
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Pro
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Vector frames, custom patterns & brand styling
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Presets Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Templates</span>
            </button>
            <div className="absolute right-0 mt-2 w-56 p-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-150 z-50">
              <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">
                Instant Presets
              </div>
              <div className="space-y-1 mt-1">
                {DESIGN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset.state)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    <span>{preset.name}</span>
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ background: preset.previewGradient }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            title="Reset to default"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Primary Export Action */}
          <button
            type="button"
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export QR</span>
          </button>
        </div>
      </div>
    </header>
  );
};
