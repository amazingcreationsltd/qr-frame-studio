/**
 * Dominant Brand Color Extractor
 * Reads an HTMLImageElement or image URL and extracts vibrant brand colors using HTML Canvas
 */

export interface ExtractedPalette {
  dominant: string;
  secondary: string;
  isDark: boolean;
}

export function extractBrandColors(img: HTMLImageElement): ExtractedPalette {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { dominant: '#3b82f6', secondary: '#1d4ed8', isDark: false };
  }

  const sampleSize = 64;
  canvas.width = sampleSize;
  canvas.height = sampleSize;

  try {
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
    const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
    const data = imageData.data;

    const colorMap: Record<string, { r: number; g: number; b: number; count: number; score: number }> = {};

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Ignore transparent or near-white / near-black background pixels
      if (a < 128) continue;
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      if (brightness > 245 || brightness < 15) continue;

      // Calculate saturation to favor rich brand colors
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;

      // Quantize to 16 buckets per channel
      const qr = Math.round(r / 16) * 16;
      const qg = Math.round(g / 16) * 16;
      const qb = Math.round(b / 16) * 16;
      const key = `${qr},${qg},${qb}`;

      if (!colorMap[key]) {
        colorMap[key] = { r: qr, g: qg, b: qb, count: 0, score: 0 };
      }
      colorMap[key].count++;
      // Score favors saturated, distinct brand colors
      colorMap[key].score += 1 + sat * 4;
    }

    const sorted = Object.values(colorMap).sort((a, b) => b.score - a.score);

    if (sorted.length > 0) {
      const best = sorted[0];
      const second = sorted[1] || best;

      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      const dominant = `#${toHex(best.r)}${toHex(best.g)}${toHex(best.b)}`;
      const secondary = `#${toHex(second.r)}${toHex(second.g)}${toHex(second.b)}`;
      const isDark = (best.r * 299 + best.g * 587 + best.b * 114) / 1000 < 128;

      return { dominant, secondary, isDark };
    }
  } catch (e) {
    console.warn('Could not extract color from image due to CORS or format', e);
  }

  return { dominant: '#3b82f6', secondary: '#1d4ed8', isDark: false };
}
