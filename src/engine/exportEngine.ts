import { jsPDF } from 'jspdf';
import { QRState } from '../types/qr';
import { renderQRCodeToCanvas } from './renderers';

export interface ExportOptions {
  state: QRState;
  logoImage?: HTMLImageElement | null;
  format: 'png' | 'svg' | 'webp' | 'pdf';
  resolution?: 512 | 1024 | 2048 | 4096;
  fileName?: string;
}

export async function exportQRCode(options: ExportOptions): Promise<void> {
  const { state, logoImage, format, resolution = 2048, fileName = 'qr-frame-code' } = options;

  // Ensure all Google Fonts and weights are loaded before offscreen render
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore
    }
  }

  // 1. Render to an offscreen high-resolution canvas
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = resolution;
  exportCanvas.height = resolution;

  renderQRCodeToCanvas({
    canvas: exportCanvas,
    state,
    size: resolution,
    logoImage
  });

  if (format === 'png' || format === 'webp') {
    const mimeType = format === 'webp' ? 'image/webp' : 'image/png';
    const dataUrl = exportCanvas.toDataURL(mimeType, 1.0);

    const link = document.createElement('a');
    link.download = `${fileName}.${format}`;
    link.href = dataUrl;
    link.click();
    return;
  }

  if (format === 'pdf') {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = exportCanvas.toDataURL('image/png', 1.0);
    // Center on A4 (210 x 297 mm)
    const qrSizeMm = 160;
    const xMm = (210 - qrSizeMm) / 2;
    const yMm = 45;

    // Optional page header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text(state.frame.text || 'Scan QR Code', 105, 30, { align: 'center' });

    doc.addImage(imgData, 'PNG', xMm, yMm, qrSizeMm, qrSizeMm);

    // Footer info
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Generated with QR Frame Studio', 105, yMm + qrSizeMm + 20, { align: 'center' });

    doc.save(`${fileName}.pdf`);
    return;
  }

  if (format === 'svg') {
    // Generate high quality embedded SVG
    const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
    const svgContent = `<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${resolution}" height="${resolution}" viewBox="0 0 ${resolution} ${resolution}">
  <image width="${resolution}" height="${resolution}" xlink:href="${dataUrl}"/>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `${fileName}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
    return;
  }
}

export async function copyQRCodeToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png', 1.0);
    });

    if (!blob) return false;

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ]);

    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
