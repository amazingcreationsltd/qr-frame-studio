import React, { useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  ZoomIn,
  Sliders,
  Sparkles,
  Link2,
  Shield,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { LogoConfig, QRState } from '../types/qr';
import { extractBrandColors } from '../engine/colorExtractor';
import { ColorPickerPopover } from './ColorPickerPopover';

interface LogoTabProps {
  state: QRState;
  onChange: (updates: Partial<QRState>) => void;
  logoImage: HTMLImageElement | null;
  onLogoLoad: (img: HTMLImageElement | null) => void;
}

// Brand preset icons with SVG data URIs
const BRAND_PRESETS = [
  {
    name: 'LinkedIn',
    color: '#0a66c2',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="#0a66c2"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.9 0 1.63-.73 1.63-1.63s-.73-1.63-1.63-1.63a1.63 1.63 0 0 0-1.63 1.63c0 .9.73 1.63 1.63 1.63m1.4 9.74v-8.37H5.06v8.37h2.8z"/></svg>`
  },
  {
    name: 'Instagram',
    color: '#e1306c',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="#e1306c"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
  },
  {
    name: 'WhatsApp',
    color: '#25d366',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="#25d366"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.14 0-.36.05-.54.26-.19.2-.72.7-.72 1.71 0 1.01.73 1.99.84 2.13.1.14 1.44 2.21 3.5 3.09.49.21.87.34 1.17.43.49.16.94.14 1.3-.02.39-.18 1.21-.49 1.38-.97.17-.48.17-.89.12-.97-.05-.08-.18-.14-.36-.23-.18-.09-1.09-.54-1.26-.6-.17-.06-.3-.09-.42.09-.13.18-.49.6-.6.73-.11.12-.22.14-.4.05-.18-.09-.77-.28-1.47-.91-.55-.49-.91-1.1-.1.02-.18-.1-.02-.19.07-.28.08-.08.18-.21.27-.31.09-.1.12-.17.18-.28.06-.12.03-.22-.02-.31-.04-.09-.42-1.01-.58-1.39-.15-.36-.3-.31-.41-.32z"/></svg>`
  },
  {
    name: 'YouTube',
    color: '#ff0000',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`
  },
  {
    name: 'Facebook',
    color: '#1877f2',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
  },
  {
    name: 'GitHub',
    color: '#ffffff',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`
  },
  {
    name: 'X',
    color: '#ffffff',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="#ffffff"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
  },
  {
    name: 'Spotify',
    color: '#1db954',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 24 24" fill="#1db954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`
  }
];

export const LogoTab: React.FC<LogoTabProps> = ({
  state,
  onChange,
  logoImage,
  onLogoLoad
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [extractedBrand, setExtractedBrand] = useState<{ color: string } | null>(null);

  const logo = state.logo;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let dataUrl = event.target?.result as string;
      if (file.type === 'image/svg+xml' && typeof dataUrl === 'string') {
        try {
          const parts = dataUrl.split(',');
          if (parts.length === 2) {
            const decoded = atob(parts[1]);
            if (!decoded.includes('width=') && decoded.includes('<svg')) {
              const fixed = decoded.replace('<svg ', '<svg width="256" height="256" ');
              dataUrl = `data:image/svg+xml;base64,${btoa(fixed)}`;
            }
          }
        } catch {
          // ignore
        }
      }

      const img = new Image();
      img.onload = () => {
        onLogoLoad(img);
        const palette = extractBrandColors(img);
        setExtractedBrand({ color: palette.dominant });
      };
      img.src = dataUrl;

      onChange({
        logo: {
          ...logo,
          url: dataUrl
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (preset: typeof BRAND_PRESETS[0]) => {
    let svgStr = preset.svg;
    if (!svgStr.includes('width=')) {
      svgStr = svgStr.replace('<svg ', '<svg width="256" height="256" ');
    }
    const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;
    const img = new Image();
    img.onload = () => {
      onLogoLoad(img);
      setExtractedBrand({ color: preset.color });
    };
    img.src = svgDataUrl;

    onChange({
      logo: {
        ...logo,
        url: svgDataUrl,
        bgColor: '#ffffff',
        borderColor: preset.color
      }
    });
  };

  // Automatically extract brand colors from logoImage when available
  React.useEffect(() => {
    if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
      const palette = extractBrandColors(logoImage);
      setExtractedBrand({ color: palette.dominant });
    }
  }, [logoImage]);

  const handleApplyBrandColor = (onlyBoundary: boolean = false) => {
    if (!extractedBrand) return;
    const c = extractedBrand.color;

    if (onlyBoundary) {
      onChange({
        logo: {
          ...logo,
          borderColor: c
        }
      });
      return;
    }

    onChange({
      logo: {
        ...logo,
        borderColor: c
      },
      colors: {
        ...state.colors,
        color1: c,
        color2: c,
        eyeBorderColor: c,
        eyeCenterColor: c
      },
      frame: {
        ...state.frame,
        badgeColor: c,
        strokeColor: c
      }
    });
  };

  const handleClearLogo = () => {
    onLogoLoad(null);
    setExtractedBrand(null);
    onChange({
      logo: {
        ...logo,
        url: ''
      }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Upload & Preset Area (Matching Screenshot 3) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-blue-400" />
            Logo & Brand Icon
          </label>
          {logo.url && (
            <button
              type="button"
              onClick={handleClearLogo}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          )}
        </div>

        {/* Upload Dropzone */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          className="hidden"
        />

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Logo Thumbnail preview box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 shrink-0 rounded-2xl bg-zinc-950 border-2 border-dashed border-zinc-700 hover:border-blue-500 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group shadow-inner"
          >
            {logo.url ? (
              <img
                src={logo.url}
                alt="Logo preview"
                className="w-14 h-14 object-contain p-1"
              />
            ) : (
              <>
                <Upload className="w-6 h-6 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 mt-1 font-medium">
                  Upload
                </span>
              </>
            )}
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="text-xs text-zinc-400">
              Upload custom logo (PNG, SVG, JPG) or choose popular preset:
            </div>

            {/* Presets Row */}
            <div className="flex items-center gap-2 flex-wrap">
              {BRAND_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  title={preset.name}
                  className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 p-1.5 transition-transform active:scale-95 cursor-pointer flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: preset.svg }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Match Your Brand Button (Matching Screenshot 3) */}
        {extractedBrand && (
          <div className="pt-2 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={() => handleApplyBrandColor(false)}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 hover:border-blue-500 text-xs font-medium text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm group"
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: extractedBrand.color }}
              />
              <Link2 className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-45 transition-transform" />
              <span>Match your brand: apply logo color to QR code</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Logo Size & Boundary Stroke Sliders (Matching Screenshot 3) */}
      {logo.url && (
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
          <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            Logo Scale & Boundary Controls
          </div>

          {/* Slider 1: Logo Zoom / Size */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-blue-400" />
                Logo Size (Zoom)
              </span>
              <span className="font-mono text-zinc-400 text-xs">{logo.size}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={24}
              value={Math.min(Math.max(logo.size || 18, 10), 24)}
              onChange={(e) =>
                onChange({
                  logo: { ...logo, size: parseInt(e.target.value) }
                })
              }
              className="w-full"
            />
          </div>

          {/* Slider 2: Boundary Margin & Stroke */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Boundary Stroke & Padding
              </span>
              <span className="font-mono text-zinc-400 text-xs">{logo.margin || 6}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={12}
              value={logo.margin ?? 6}
              onChange={(e) =>
                onChange({
                  logo: { ...logo, margin: parseInt(e.target.value) }
                })
              }
              className="w-full"
            />
          </div>

          {/* Sizing vs Boundary Stroke Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
            <div>
              <label htmlFor="bleed-toggle" className="text-xs font-medium text-zinc-200 block cursor-pointer">
                Scale larger than boundary stroke
              </label>
              <p className="text-[11px] text-zinc-500">
                Allow logo graphic to bleed outside the boundary badge cutout
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="bleed-toggle"
                type="checkbox"
                checked={logo.largerThanBoundary}
                onChange={(e) =>
                  onChange({
                    logo: { ...logo, largerThanBoundary: e.target.checked }
                  })
                }
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Match Your Brand Action (Under Sliders - Matching Screenshot 3) */}
          {extractedBrand && (
            <div className="pt-2 border-t border-zinc-800/60">
              <button
                type="button"
                onClick={() => handleApplyBrandColor(false)}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-950/40 border border-blue-500/40 hover:border-blue-400 text-xs font-medium text-blue-200 hover:text-white transition-all cursor-pointer shadow-sm group"
              >
                <span
                  className="w-4 h-4 rounded-md border border-white/30 shadow-sm shrink-0"
                  style={{ backgroundColor: extractedBrand.color }}
                />
                <Link2 className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-45 transition-transform shrink-0" />
                <span className="truncate font-semibold">Match your brand: apply logo color to QR code</span>
              </button>
            </div>
          )}

          {/* Boundary Background Shape */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/60">
            <label className="block text-xs font-medium text-zinc-300">
              Boundary Cutout Shape
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['squircle', 'circle', 'rounded', 'square', 'none'] as const).map((shape) => {
                const active = logo.shape === shape;
                return (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => onChange({ logo: { ...logo, shape } })}
                    className={`py-1.5 px-2 rounded-xl border text-xs font-medium capitalize transition-all cursor-pointer text-center ${
                      active
                        ? 'bg-blue-600/15 border-blue-500 text-blue-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {shape}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Boundary Colors & Stroke Width */}
          {logo.shape !== 'none' && (
            <div className="space-y-3 pt-2 border-t border-zinc-800/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Badge Background Color
                  </label>
                  <ColorPickerPopover
                    color={logo.bgColor || '#ffffff'}
                    onChange={(c) => onChange({ logo: { ...logo, bgColor: c } })}
                    label="Badge Background"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-zinc-400">
                      Boundary Stroke Color
                    </label>
                    {extractedBrand && (
                      <button
                        type="button"
                        onClick={() => handleApplyBrandColor(true)}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer underline flex items-center gap-1"
                      >
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: extractedBrand.color }}
                        />
                        Match Logo
                      </button>
                    )}
                  </div>
                  <ColorPickerPopover
                    color={logo.borderColor || '#3b82f6'}
                    onChange={(c) => onChange({ logo: { ...logo, borderColor: c } })}
                    label="Boundary Stroke"
                  />
                </div>
              </div>

              {/* Match Logo Color dedicated action row under boundary stroke */}
              {extractedBrand && (
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-md border border-white/20"
                      style={{ backgroundColor: extractedBrand.color }}
                    />
                    <span className="text-[11px] text-zinc-300">
                      Logo Color: <span className="font-mono text-blue-400">{extractedBrand.color}</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyBrandColor(false)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 text-[11px] font-semibold text-blue-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>Apply to QR & Stroke</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
