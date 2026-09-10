import React, { useState } from 'react';
import { X, Download, FileImage, FileCode, FileText, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRState } from '../types/qr';
import { exportQRCode } from '../engine/exportEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: QRState;
  logoImage: HTMLImageElement | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  state,
  logoImage
}) => {
  const [fileName, setFileName] = useState('my-qr-code');
  const [format, setFormat] = useState<'png' | 'svg' | 'webp' | 'pdf'>('png');
  const [resolution, setResolution] = useState<1024 | 2048 | 4096>(2048);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      await exportQRCode({
        state,
        logoImage,
        format,
        resolution,
        fileName: fileName.trim() || 'qr-code'
      });

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-6 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Export QR Code
              </h3>
              <p className="text-xs text-zinc-400">
                Vector or high-resolution raster graphic
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-300">
            File Name
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="my-qr-code"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Format Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-300">
            File Format
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'png', label: 'PNG', sub: 'High Res' },
              { id: 'svg', label: 'SVG', sub: 'Vector' },
              { id: 'pdf', label: 'PDF', sub: 'Print Doc' },
              { id: 'webp', label: 'WEBP', sub: 'Compact' }
            ].map((fmt) => {
              const active = format === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setFormat(fmt.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600/15 border-blue-500 text-blue-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <div className="font-bold text-xs">{fmt.label}</div>
                  <div className="text-[10px] text-zinc-500">{fmt.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resolution Options */}
        {format !== 'svg' && (
          <div className="space-y-2">
            <label className="block text-xs font-medium text-zinc-300">
              Resolution
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { res: 1024, label: '1024 × 1024', desc: 'Web & Digital' },
                { res: 2048, label: '2048 × 2048', desc: 'HD / Retinas' },
                { res: 4096, label: '4096 × 4096', desc: 'Ultra 4K Print' }
              ].map((r) => {
                const active = resolution === r.res;
                return (
                  <button
                    key={r.res}
                    type="button"
                    onClick={() => setResolution(r.res as any)}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="font-mono text-xs font-semibold">{r.label}</div>
                    <div className="text-[10px] text-zinc-500">{r.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Download Action */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Generating...' : `Download ${format.toUpperCase()}`}</span>
        </button>
      </div>
    </div>
  );
};
