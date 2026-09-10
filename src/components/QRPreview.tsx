import React, { useRef, useEffect, useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ShieldCheck,
  FileImage,
  FileCode,
  FileText,
  Sparkles,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRState } from '../types/qr';
import { renderQRCodeToCanvas } from '../engine/renderers';
import { exportQRCode, copyQRCodeToClipboard } from '../engine/exportEngine';

interface QRPreviewProps {
  state: QRState;
  logoImage: HTMLImageElement | null;
}

export const QRPreview: React.FC<QRPreviewProps> = ({ state, logoImage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resolution, setResolution] = useState<1024 | 2048 | 4096>(2048);

  // Render to canvas whenever state or logoImage changes
  useEffect(() => {
    if (!canvasRef.current) return;
    renderQRCodeToCanvas({
      canvas: canvasRef.current,
      state,
      size: 800,
      logoImage
    });

    // Ensure Google Font true weight (700 for bold, 400 for regular) is loaded into browser font cache
    if (typeof document !== 'undefined' && document.fonts && state.frame?.style !== 'none') {
      const fontFam = state.frame?.font || 'Manrope';
      const weight = state.frame?.bold !== false ? '700' : '400';
      const style = state.frame?.italic ? 'italic' : 'normal';
      const fontSpec = `${style} ${weight} 28px "${fontFam}"`;

      document.fonts.load(fontSpec).then(() => {
        if (canvasRef.current) {
          renderQRCodeToCanvas({
            canvas: canvasRef.current,
            state,
            size: 800,
            logoImage
          });
        }
      }).catch(() => {});
    }
  }, [state, logoImage]);

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    const ok = await copyQRCodeToClipboard(canvasRef.current);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async (format: 'png' | 'svg' | 'webp' | 'pdf') => {
    setDownloading(true);
    try {
      await exportQRCode({
        state,
        logoImage,
        format,
        resolution,
        fileName: `qr-code-${Date.now()}`
      });

      // Confetti burst!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#60a5fa', '#10b981', '#f59e0b']
      });
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Preview Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl shadow-black/50 backdrop-blur-xl relative overflow-hidden">
        {/* Card Header & Scannability Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-200 tracking-wide uppercase font-heading">
              Live Vector Preview
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Scannable</span>
          </div>
        </div>

        {/* Canvas Display Stage */}
        <div className="relative aspect-square w-full max-w-[380px] mx-auto rounded-2xl p-4 bg-checkered flex items-center justify-center border border-zinc-800/80 shadow-inner group">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain rounded-xl drop-shadow-xl transition-transform duration-200 group-hover:scale-[1.01]"
          />
        </div>

        {/* Resolution Selector Pill */}
        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">Export Quality:</span>
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {([1024, 2048, 4096] as const).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer ${
                  resolution === res
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {res === 4096 ? '4K Print' : res === 2048 ? '2K HD' : '1K Web'}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          <button
            type="button"
            onClick={() => handleExport('png')}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <FileImage className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport('svg')}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] text-zinc-100 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>SVG</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] text-zinc-100 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] text-zinc-100 text-xs font-semibold border border-zinc-700 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scannability Tech Details Card */}
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-xs space-y-2">
        <div className="flex items-center justify-between text-zinc-400">
          <span>Error Correction</span>
          <span className="font-mono text-zinc-200">Level H (High 30%)</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>Safe Logo Zone</span>
          <span className="font-mono text-emerald-400">Protected</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>Print Readiness</span>
          <span className="font-mono text-zinc-200">300 DPI Vector Equivalent</span>
        </div>
      </div>
    </div>
  );
};
