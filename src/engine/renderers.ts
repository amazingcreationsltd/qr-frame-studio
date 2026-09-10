import { QRState, BodyShape, EyeFrameShape, EyeBallShape, FrameStyle } from '../types/qr';
import { createQRMatrix, QRMatrixResult } from './qrMatrix';

export interface RenderOptions {
  canvas: HTMLCanvasElement;
  state: QRState;
  size?: number; // target square size (default 800)
  logoImage?: HTMLImageElement | null;
}

// Helper for round rect
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | number[]
) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    // Fallback
    const radius = typeof r === 'number' ? r : r[0] || 0;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

// Helper for star drawing
function drawStarPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

// Helper for 4-point sparkle
function drawSparklePath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
) {
  const r = size * 0.5;
  const cut = size * 0.12;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.quadraticCurveTo(cx, cy - cut, cx + r, cy);
  ctx.quadraticCurveTo(cx + cut, cy, cx, cy + r);
  ctx.quadraticCurveTo(cx, cy + cut, cx - r, cy);
  ctx.quadraticCurveTo(cx - cut, cy, cx, cy - r);
  ctx.closePath();
}

// Helper for Heart shape
function drawHeartPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number
) {
  const s = size * 0.5;
  ctx.beginPath();
  const topY = cy - s * 0.7;
  ctx.moveTo(cx, cy + s * 0.8);
  ctx.bezierCurveTo(cx - s * 1.1, cy + s * 0.1, cx - s * 1.1, topY, cx - s * 0.5, topY);
  ctx.bezierCurveTo(cx - s * 0.1, topY, cx, cy - s * 0.3, cx, cy - s * 0.3);
  ctx.bezierCurveTo(cx, cy - s * 0.3, cx + s * 0.1, topY, cx + s * 0.5, topY);
  ctx.bezierCurveTo(cx + s * 1.1, topY, cx + s * 1.1, cy + s * 0.1, cx, cy + s * 0.8);
  ctx.closePath();
}

// Helper for Hexagon
function drawHexagon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// Helper for Octagon
function drawOctagon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i - Math.PI / 8;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// Draw a single body module with dynamic scaling
function drawBodyModule(
  ctx: CanvasRenderingContext2D,
  shape: BodyShape,
  x: number,
  y: number,
  size: number,
  r: number,
  c: number,
  matrix: boolean[][],
  matrixSize: number,
  moduleScale: number = 100
) {
  const scale = Math.max(Math.min(moduleScale / 100, 1.0), 0.35);
  const s = size * scale;
  const ox = (size - s) / 2;
  const oy = (size - s) / 2;
  const sx = x + ox;
  const sy = y + oy;
  const cx = x + size / 2;
  const cy = y + size / 2;
  const pad = s * 0.04;

  ctx.beginPath();

  switch (shape) {
    case 'square':
      ctx.rect(sx + pad, sy + pad, s - pad * 2, s - pad * 2);
      break;

    case 'rounded':
      drawRoundRect(ctx, sx + pad, sy + pad, s - pad * 2, s - pad * 2, s * 0.25);
      break;

    case 'extra-rounded':
      drawRoundRect(ctx, sx + pad, sy + pad, s - pad * 2, s - pad * 2, s * 0.45);
      break;

    case 'dots':
      ctx.arc(cx, cy, (s / 2) * 0.92, 0, Math.PI * 2);
      break;

    case 'small-dots':
      ctx.arc(cx, cy, (s / 2) * 0.65, 0, Math.PI * 2);
      break;

    case 'fluid-liquid': {
      // Connect to neighbors
      const top = r > 0 && matrix[r - 1][c];
      const bottom = r < matrixSize - 1 && matrix[r + 1][c];
      const left = c > 0 && matrix[r][c - 1];
      const right = c < matrixSize - 1 && matrix[r][c + 1];

      const rTL = !top && !left ? s * 0.45 : 0;
      const rTR = !top && !right ? s * 0.45 : 0;
      const rBR = !bottom && !right ? s * 0.45 : 0;
      const rBL = !bottom && !left ? s * 0.45 : 0;

      drawRoundRect(ctx, sx, sy, s, s, [rTL, rTR, rBR, rBL]);
      break;
    }

    case 'horizontal-lines': {
      const left = c > 0 && matrix[r][c - 1];
      const right = c < matrixSize - 1 && matrix[r][c + 1];
      const rL = !left ? s * 0.35 : 0;
      const rR = !right ? s * 0.35 : 0;
      drawRoundRect(ctx, sx, sy + s * 0.15, s, s * 0.7, [rL, rR, rR, rL]);
      break;
    }

    case 'vertical-lines': {
      const top = r > 0 && matrix[r - 1][c];
      const bottom = r < matrixSize - 1 && matrix[r + 1][c];
      const rT = !top ? s * 0.35 : 0;
      const rB = !bottom ? s * 0.35 : 0;
      drawRoundRect(ctx, sx + s * 0.15, sy, s * 0.7, s, [rT, rT, rB, rB]);
      break;
    }

    case 'circuit':
      // Circuit node + wire
      ctx.arc(cx, cy, s * 0.32, 0, Math.PI * 2);
      ctx.rect(cx - s * 0.08, sy, s * 0.16, s);
      ctx.rect(sx, cy - s * 0.08, s, s * 0.16);
      break;

    case 'diamonds':
      ctx.moveTo(cx, sy + pad);
      ctx.lineTo(sx + s - pad, cy);
      ctx.lineTo(cx, sy + s - pad);
      ctx.lineTo(sx + pad, cy);
      ctx.closePath();
      break;

    case 'sparkles':
      drawSparklePath(ctx, cx, cy, s * 0.95);
      break;

    case 'hearts':
      drawHeartPath(ctx, cx, cy, s * 0.9);
      break;

    case 'crosses': {
      const w = s * 0.28;
      ctx.rect(cx - w / 2, sy + pad, w, s - pad * 2);
      ctx.rect(sx + pad, cy - w / 2, s - pad * 2, w);
      break;
    }

    case 'triangles':
      ctx.moveTo(cx, sy + pad);
      ctx.lineTo(sx + s - pad, sy + s - pad);
      ctx.lineTo(sx + pad, sy + s - pad);
      ctx.closePath();
      break;

    case 'blobs': {
      // Organic blob with alternating single corner
      const alt = (r + c) % 4;
      const rads = [
        alt === 0 ? s * 0.45 : s * 0.15,
        alt === 1 ? s * 0.45 : s * 0.15,
        alt === 2 ? s * 0.45 : s * 0.15,
        alt === 3 ? s * 0.45 : s * 0.15
      ];
      drawRoundRect(ctx, sx + pad, sy + pad, s - pad * 2, s - pad * 2, rads);
      break;
    }

    case 'bubbles': {
      const r1 = s * 0.35;
      const r2 = s * 0.18;
      ctx.arc(cx - s * 0.1, cy - s * 0.1, r1, 0, Math.PI * 2);
      ctx.arc(cx + s * 0.25, cy + s * 0.25, r2, 0, Math.PI * 2);
      break;
    }

    case 'hexagons':
      drawHexagon(ctx, cx, cy, (s / 2) * 0.95);
      break;

    case 'chamfered': {
      const cut = s * 0.25;
      ctx.moveTo(sx + cut, sy);
      ctx.lineTo(sx + s - cut, sy);
      ctx.lineTo(sx + s, sy + cut);
      ctx.lineTo(sx + s, sy + s - cut);
      ctx.lineTo(sx + s - cut, sy + s);
      ctx.lineTo(sx + cut, sy + s);
      ctx.lineTo(sx, sy + s - cut);
      ctx.lineTo(sx, sy + cut);
      ctx.closePath();
      break;
    }

    case 'diagonal':
      ctx.moveTo(sx + pad, sy + s - pad);
      ctx.lineTo(sx + s - pad, sy + pad);
      ctx.lineWidth = s * 0.3;
      ctx.lineCap = 'round';
      ctx.stroke();
      return;

    case 'stars':
      drawStarPath(ctx, cx, cy, 5, s * 0.48, s * 0.22);
      break;

    default:
      ctx.rect(sx, sy, s, s);
  }

  ctx.fill();
}

// Draw 7x7 Eye Marker Frame (Outer)
function drawEyeFrame(
  ctx: CanvasRenderingContext2D,
  shape: EyeFrameShape,
  x: number,
  y: number,
  size: number
) {
  // Eye frame spans 7 modules = size. Thickness is 1 module = size / 7.
  const m = size / 7;
  const cx = x + size / 2;
  const cy = y + size / 2;

  ctx.save();
  ctx.beginPath();

  switch (shape) {
    case 'square':
      ctx.rect(x, y, size, size);
      ctx.rect(x + m, y + m, size - m * 2, size - m * 2);
      break;

    case 'rounded':
      drawRoundRect(ctx, x, y, size, size, m * 1.8);
      drawRoundRect(ctx, x + m, y + m, size - m * 2, size - m * 2, m * 0.9);
      break;

    case 'circle':
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.arc(cx, cy, size / 2 - m, 0, Math.PI * 2);
      break;

    case 'squircle':
      drawRoundRect(ctx, x, y, size, size, m * 3.2);
      drawRoundRect(ctx, x + m, y + m, size - m * 2, size - m * 2, m * 2.2);
      break;

    case 'leaf-single':
      // Top-left round, others sharp
      drawRoundRect(ctx, x, y, size, size, [m * 3.2, 0, 0, 0]);
      drawRoundRect(ctx, x + m, y + m, size - m * 2, size - m * 2, [m * 2.2, 0, 0, 0]);
      break;

    case 'leaf-dual':
      // Top-left & Bottom-right round
      drawRoundRect(ctx, x, y, size, size, [m * 3.2, 0, m * 3.2, 0]);
      drawRoundRect(ctx, x + m, y + m, size - m * 2, size - m * 2, [m * 2.2, 0, m * 2.2, 0]);
      break;

    case 'chamfered': {
      const cutO = m * 1.5;
      const cutI = m * 0.8;
      // Outer
      ctx.moveTo(x + cutO, y);
      ctx.lineTo(x + size - cutO, y);
      ctx.lineTo(x + size, y + cutO);
      ctx.lineTo(x + size, y + size - cutO);
      ctx.lineTo(x + size - cutO, y + size);
      ctx.lineTo(x + cutO, y + size);
      ctx.lineTo(x, y + size - cutO);
      ctx.lineTo(x, y + cutO);
      ctx.closePath();
      // Inner
      const ix = x + m;
      const iy = y + m;
      const isize = size - m * 2;
      ctx.moveTo(ix + cutI, iy);
      ctx.lineTo(ix + isize - cutI, iy);
      ctx.lineTo(ix + isize, iy + cutI);
      ctx.lineTo(ix + isize, iy + isize - cutI);
      ctx.lineTo(ix + isize - cutI, iy + isize);
      ctx.lineTo(ix + cutI, iy + isize);
      ctx.lineTo(ix, iy + isize - cutI);
      ctx.lineTo(ix, iy + cutI);
      ctx.closePath();
      break;
    }

    case 'hexagon':
      drawHexagon(ctx, cx, cy, size / 2);
      drawHexagon(ctx, cx, cy, size / 2 - m);
      break;

    case 'octagon':
      drawOctagon(ctx, cx, cy, size / 2);
      drawOctagon(ctx, cx, cy, size / 2 - m);
      break;

    case 'beaded': {
      // Draw a ring of dots for frame
      const numDots = 16;
      for (let i = 0; i < numDots; i++) {
        const angle = ((Math.PI * 2) / numDots) * i;
        const bx = cx + (size / 2 - m / 2) * Math.cos(angle);
        const by = cy + (size / 2 - m / 2) * Math.sin(angle);
        ctx.moveTo(bx + m * 0.45, by);
        ctx.arc(bx, by, m * 0.45, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
      return;
    }

    case 'postage': {
      // Scalloped postage edges
      ctx.rect(x, y, size, size);
      ctx.rect(x + m, y + m, size - m * 2, size - m * 2);
      break;
    }

    case 'speech': {
      drawRoundRect(ctx, x, y, size, size, [m * 2, m * 2, m * 0.3, m * 2]);
      drawRoundRect(ctx, x + m, y + m, size - m * 2, size - m * 2, [m * 1.2, m * 1.2, 0, m * 1.2]);
      break;
    }

    case 'double-ring': {
      const halfM = m * 0.4;
      // Outer thin ring
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.arc(cx, cy, size / 2 - halfM, 0, Math.PI * 2);
      // Inner thin ring
      ctx.arc(cx, cy, size / 2 - m + halfM, 0, Math.PI * 2);
      ctx.arc(cx, cy, size / 2 - m, 0, Math.PI * 2);
      break;
    }

    case 'diamond': {
      ctx.moveTo(cx, y);
      ctx.lineTo(x + size, cy);
      ctx.lineTo(cx, y + size);
      ctx.lineTo(x, cy);
      ctx.closePath();

      ctx.moveTo(cx, y + m * 1.4);
      ctx.lineTo(x + size - m * 1.4, cy);
      ctx.lineTo(cx, y + size - m * 1.4);
      ctx.lineTo(x + m * 1.4, cy);
      ctx.closePath();
      break;
    }

    case 'pillow': {
      drawRoundRect(ctx, x, y, size, size, m * 1.2);
      drawRoundRect(ctx, x + m, y + m, size - m * 2, size - m * 2, m * 0.6);
      break;
    }

    default:
      ctx.rect(x, y, size, size);
      ctx.rect(x + m, y + m, size - m * 2, size - m * 2);
  }

  ctx.fill('evenodd');
  ctx.restore();
}

// Draw 3x3 Eye Marker Pupil (Center)
function drawEyeBall(
  ctx: CanvasRenderingContext2D,
  shape: EyeBallShape,
  x: number,
  y: number,
  size: number
) {
  // Center pupil occupies 3x3 modules = size
  const cx = x + size / 2;
  const cy = y + size / 2;
  const m = size / 3;

  ctx.save();
  ctx.beginPath();

  switch (shape) {
    case 'square':
      ctx.rect(x, y, size, size);
      break;

    case 'circle':
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      break;

    case 'rounded':
      drawRoundRect(ctx, x, y, size, size, m * 0.9);
      break;

    case 'squircle':
      drawRoundRect(ctx, x, y, size, size, m * 1.3);
      break;

    case 'leaf-single':
      drawRoundRect(ctx, x, y, size, size, [m * 1.4, 0, 0, 0]);
      break;

    case 'leaf-dual':
      drawRoundRect(ctx, x, y, size, size, [m * 1.4, 0, m * 1.4, 0]);
      break;

    case 'diamond':
      ctx.moveTo(cx, y);
      ctx.lineTo(x + size, cy);
      ctx.lineTo(cx, y + size);
      ctx.lineTo(x, cy);
      ctx.closePath();
      break;

    case 'heart':
      drawHeartPath(ctx, cx, cy, size * 1.05);
      break;

    case 'star':
      drawStarPath(ctx, cx, cy, 5, size * 0.52, size * 0.24);
      break;

    case 'sparkle':
      drawSparklePath(ctx, cx, cy, size * 1.05);
      break;

    case 'cross': {
      const w = size * 0.38;
      ctx.rect(cx - w / 2, y, w, size);
      ctx.rect(x, cy - w / 2, size, w);
      break;
    }

    case 'dot-grid': {
      // 3x3 mini dots
      const dotRad = m * 0.35;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const dx = x + c * m + m / 2;
          const dy = y + r * m + m / 2;
          ctx.moveTo(dx + dotRad, dy);
          ctx.arc(dx, dy, dotRad, 0, Math.PI * 2);
        }
      }
      break;
    }

    case 'vertical-bars': {
      const barW = m * 0.65;
      const gap = (size - 3 * barW) / 2;
      for (let i = 0; i < 3; i++) {
        const bx = x + i * (barW + gap);
        drawRoundRect(ctx, bx, y, barW, size, barW * 0.5);
      }
      break;
    }

    case 'horizontal-bars': {
      const barH = m * 0.65;
      const gap = (size - 3 * barH) / 2;
      for (let i = 0; i < 3; i++) {
        const by = y + i * (barH + gap);
        drawRoundRect(ctx, x, by, size, barH, barH * 0.5);
      }
      break;
    }

    case 'flower': {
      // 4-petal scallop
      const petalR = size * 0.28;
      ctx.arc(cx - size * 0.15, cy, petalR, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.15, cy, petalR, 0, Math.PI * 2);
      ctx.arc(cx, cy - size * 0.15, petalR, 0, Math.PI * 2);
      ctx.arc(cx, cy + size * 0.15, petalR, 0, Math.PI * 2);
      break;
    }

    case 'octagon':
      drawOctagon(ctx, cx, cy, size / 2);
      break;

    default:
      ctx.rect(x, y, size, size);
  }

  ctx.fill();
  ctx.restore();
}

// Master Canvas Rendering Engine
export function renderQRCodeToCanvas(options: RenderOptions) {
  const { canvas, state, logoImage } = options;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const totalSize = options.size || 800;
  canvas.width = totalSize;
  canvas.height = totalSize;

  ctx.clearRect(0, 0, totalSize, totalSize);

  // 1. Frame Layout Calculations
  let qrX = 0;
  let qrY = 0;
  let qrSize = totalSize;
  const frame = state.frame;

  // Calculate frame dimension adjustments
  if (frame.style !== 'none') {
    switch (frame.style) {
      case 'top-ribbon':
      case 'top-pill':
        qrSize = totalSize * 0.76;
        qrX = (totalSize - qrSize) / 2;
        qrY = totalSize * 0.20;
        break;

      case 'bottom-ribbon':
      case 'bottom-pill':
      case 'polaroid':
      case 'chat-bubble':
      case 'ticket':
      case 'minimal-card':
      case 'social-card':
        qrSize = totalSize * 0.76;
        qrX = (totalSize - qrSize) / 2;
        qrY = totalSize * 0.05;
        break;

      case 'phone':
        qrSize = totalSize * 0.70;
        qrX = (totalSize - qrSize) / 2;
        qrY = totalSize * 0.12;
        break;

      case 'circular-badge':
        qrSize = totalSize * 0.70;
        qrX = (totalSize - qrSize) / 2;
        qrY = (totalSize - qrSize) / 2;
        break;

      case 'neon-border':
        qrSize = totalSize * 0.80;
        qrX = (totalSize - qrSize) / 2;
        qrY = (totalSize - qrSize) / 2;
        break;
    }
  }

  // 2. Draw Frame Background (if active)
  if (frame.style !== 'none') {
    drawFrameBackground(ctx, totalSize, frame, qrX, qrY, qrSize);
  }

  // 3. Draw QR White Bounding Box / Canvas Background
  const canvasCfg = state.canvas || {
    qrPadding: 16,
    canvasRadius: 20,
    canvasBg: '#ffffff',
    canvasBorderWidth: 0,
    canvasBorderColor: '#e4e4e7',
    canvasShadow: false
  };

  const innerPad = Math.max((canvasCfg.qrPadding || 0) * (totalSize / 500), 0);
  const activeQRSize = Math.max(qrSize - innerPad * 2, 80);
  const activeQRX = qrX + innerPad;
  const activeQRY = qrY + innerPad;

  if (!state.colors.bgTransparent) {
    ctx.save();
    const bgFill = canvasCfg.canvasBg || '#ffffff';
    ctx.fillStyle = bgFill;
    const cRad = canvasCfg.canvasRadius ?? 0;
    const cBorderW = canvasCfg.canvasBorderWidth ?? 0;
    const cBorderCol = canvasCfg.canvasBorderColor || '#e4e4e7';

    if (frame.style === 'none') {
      if (cRad > 0 || cBorderW > 0) {
        const rad = cRad * (totalSize / 500);
        drawRoundRect(ctx, 16, 16, totalSize - 32, totalSize - 32, rad);
        ctx.fillStyle = bgFill;
        ctx.fill();
        if (cBorderW > 0) {
          ctx.lineWidth = cBorderW * (totalSize / 500);
          ctx.strokeStyle = cBorderCol;
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = bgFill;
        ctx.fillRect(0, 0, totalSize, totalSize);
      }
    } else {
      // White bounding card for framed designs
      const cardRadius = (canvasCfg.canvasRadius ?? 16) * (totalSize / 500);
      drawRoundRect(ctx, qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, cardRadius);
      ctx.fillStyle = bgFill;
      ctx.fill();
      if (cBorderW > 0) {
        ctx.lineWidth = cBorderW * (totalSize / 500);
        ctx.strokeStyle = cBorderCol;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // 4. Generate QR Matrix
  const qrData: QRMatrixResult = createQRMatrix(state);
  const matrixSize = qrData.size;
  const quiet = state.quietZone || 1;
  const totalModules = matrixSize + quiet * 2;
  const cellSize = activeQRSize / totalModules;
  const startX = activeQRX + quiet * cellSize;
  const startY = activeQRY + quiet * cellSize;

  // 5. Create Color Fill Gradient/Solid
  let bodyFill: string | CanvasGradient = state.colors.color1;
  if (state.colors.type === 'linear') {
    const rad = (state.colors.angle * Math.PI) / 180;
    const x0 = activeQRX + (Math.cos(rad + Math.PI) * activeQRSize) / 2 + activeQRSize / 2;
    const y0 = activeQRY + (Math.sin(rad + Math.PI) * activeQRSize) / 2 + activeQRSize / 2;
    const x1 = activeQRX + (Math.cos(rad) * activeQRSize) / 2 + activeQRSize / 2;
    const y1 = activeQRY + (Math.sin(rad) * activeQRSize) / 2 + activeQRSize / 2;
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, state.colors.color1);
    grad.addColorStop(1, state.colors.color2);
    bodyFill = grad;
  } else if (state.colors.type === 'radial') {
    const grad = ctx.createRadialGradient(
      activeQRX + activeQRSize / 2,
      activeQRY + activeQRSize / 2,
      activeQRSize * 0.05,
      activeQRX + activeQRSize / 2,
      activeQRY + activeQRSize / 2,
      activeQRSize * 0.7
    );
    grad.addColorStop(0, state.colors.color1);
    grad.addColorStop(1, state.colors.color2);
    bodyFill = grad;
  }

  // 6. Draw Body Data Modules
  ctx.save();
  ctx.fillStyle = bodyFill;
  ctx.strokeStyle = typeof bodyFill === 'string' ? bodyFill : state.colors.color1;

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Skip finder pattern / eye regions
      if (qrData.isAnyEye(r, c)) continue;

      // Skip logo reserved area
      if (qrData.isLogoReserved(r, c)) continue;

      if (qrData.matrix[r][c]) {
        const mx = startX + c * cellSize;
        const my = startY + r * cellSize;
        drawBodyModule(
          ctx,
          state.bodyShape,
          mx,
          my,
          cellSize,
          r,
          c,
          qrData.matrix,
          matrixSize,
          state.moduleScale || 90
        );
      }
    }
  }
  ctx.restore();

  // 7. Draw Eye Markers (Top-Left, Top-Right, Bottom-Left)
  const eyeLocations = [
    { r: 0, c: 0 }, // Top-Left
    { r: 0, c: matrixSize - 7 }, // Top-Right
    { r: matrixSize - 7, c: 0 } // Bottom-Left
  ];

  const eyeBorderColor = state.colors.eyeUseCustom
    ? state.colors.eyeBorderColor
    : bodyFill;
  const eyeCenterColor = state.colors.eyeUseCustom
    ? state.colors.eyeCenterColor
    : bodyFill;

  eyeLocations.forEach((loc) => {
    const eyeX = startX + loc.c * cellSize;
    const eyeY = startY + loc.r * cellSize;
    const eyeSize = 7 * cellSize;

    // Draw Outer Frame (7x7)
    ctx.save();
    ctx.fillStyle = eyeBorderColor;
    drawEyeFrame(ctx, state.eyeFrameShape, eyeX, eyeY, eyeSize);
    ctx.restore();

    // Draw Inner Pupil (3x3 at offset 2 modules)
    const pupilX = eyeX + 2 * cellSize;
    const pupilY = eyeY + 2 * cellSize;
    const pupilSize = 3 * cellSize;

    ctx.save();
    ctx.fillStyle = eyeCenterColor;
    drawEyeBall(ctx, state.eyeBallShape, pupilX, pupilY, pupilSize);
    ctx.restore();
  });

  // 8. Draw Logo Section (with Boundary Stroke & Scaling Control)
  if (state.logo.url) {
    drawLogoBadge(
      ctx,
      totalSize,
      activeQRX,
      activeQRY,
      activeQRSize,
      state.logo,
      logoImage,
      () => renderQRCodeToCanvas(options)
    );
  }

  // 9. Draw Frame Foregrounds, Badges & Rich CTA Typography
  if (frame.style !== 'none') {
    drawFrameForeground(ctx, totalSize, frame, qrX, qrY, qrSize);
  }
}

const logoImageCache = new Map<string, HTMLImageElement>();

function getActiveLogoImage(
  rawUrl: string,
  passedImg?: HTMLImageElement | null,
  onLoaded?: () => void
): HTMLImageElement | null {
  if (passedImg && passedImg.complete && ((passedImg.naturalWidth && passedImg.naturalWidth > 0) || passedImg.width > 0)) {
    return passedImg;
  }
  if (!rawUrl) return null;

  let url = rawUrl;
  if (url.startsWith('data:image/svg+xml;utf8,')) {
    url = url.replace('data:image/svg+xml;utf8,', 'data:image/svg+xml;charset=utf-8,');
  }

  if (logoImageCache.has(url)) {
    const cached = logoImageCache.get(url)!;
    if (cached.complete && ((cached.naturalWidth && cached.naturalWidth > 0) || cached.width > 0)) {
      return cached;
    }
  }

  const img = new Image();
  if (!url.startsWith('data:')) {
    img.crossOrigin = 'anonymous';
  }
  img.onload = () => {
    logoImageCache.set(url, img);
    if (onLoaded) onLoaded();
  };
  img.src = url;
  logoImageCache.set(url, img);
  return img.complete && ((img.naturalWidth && img.naturalWidth > 0) || img.width > 0) ? img : null;
}

// Draw Logo with Stroke, Boundary Badge, and Scaler (Preserving Intrinsic Aspect Ratio)
function drawLogoBadge(
  ctx: CanvasRenderingContext2D,
  totalSize: number,
  qrX: number,
  qrY: number,
  qrSize: number,
  logo: QRState['logo'],
  logoImage?: HTMLImageElement | null,
  onImageLoaded?: () => void
) {
  const cx = qrX + qrSize / 2;
  const cy = qrY + qrSize / 2;

  // Retrieve image from state or memory cache
  const effectiveImg = getActiveLogoImage(logo.url, logoImage, onImageLoaded);

  // 1. Calculate aspect ratio from the actual image (prevent distortion/stretching)
  const natW = (effectiveImg && (effectiveImg.naturalWidth || effectiveImg.width)) || 1;
  const natH = (effectiveImg && (effectiveImg.naturalHeight || effectiveImg.height)) || 1;
  const aspect = natW / natH;

  // Safe bounding size from slider (10% to 24% of QR size) for instant scanning
  const safeLogoPct = Math.min(Math.max(logo.size || 18, 10), 24);
  const baseDim = (qrSize * safeLogoPct) / 100;

  // Fit image into baseDim box while strictly preserving aspect ratio
  let logoW: number;
  let logoH: number;

  if (aspect >= 1) {
    // Wider than tall or 1:1 square
    logoW = baseDim;
    logoH = baseDim / aspect;
  } else {
    // Taller than wide (e.g. document icons, portrait logos)
    logoH = baseDim;
    logoW = baseDim * aspect;
  }

  // If user enabled "largerThanBoundary", scale up the logo image slightly
  if (logo.largerThanBoundary) {
    logoW *= 1.25;
    logoH *= 1.25;
  }

  // Dynamic padding around logo based on margin slider
  const pad = ((logo.margin || 6) * qrSize) / 800 + 4;

  // Enforce absolute maximum badge footprint of 25% for 100% scan reliability
  const maxBadge = qrSize * 0.25;
  const rawBw = (logo.largerThanBoundary ? baseDim : logoW) + pad * 2;
  const rawBh = (logo.largerThanBoundary ? (baseDim / (aspect >= 1 ? 1 : 1 / aspect)) : logoH) + pad * 2;
  const bw = Math.min(rawBw, maxBadge);
  const bh = Math.min(rawBh, maxBadge);

  ctx.save();

  // 2. Draw Boundary Background Badge
  if (logo.shape !== 'none' && bw > 0 && bh > 0) {
    const bx = cx - bw / 2;
    const by = cy - bh / 2;

    ctx.beginPath();
    switch (logo.shape) {
      case 'circle': {
        const radius = Math.max(bw, bh) / 2;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        break;
      }
      case 'squircle': {
        const rad = Math.min(bw, bh) * 0.42;
        drawRoundRect(ctx, bx, by, bw, bh, rad);
        break;
      }
      case 'rounded': {
        const rad = Math.min(bw, bh) * 0.22;
        drawRoundRect(ctx, bx, by, bw, bh, rad);
        break;
      }
      case 'square':
      default: {
        ctx.rect(bx, by, bw, bh);
        break;
      }
    }

    const badgeBgColor = logo.bgColor || '#ffffff';
    ctx.fillStyle = badgeBgColor;
    ctx.fill();

    // Draw Boundary Stroke
    if (logo.borderWidth > 0) {
      ctx.lineWidth = Math.max(logo.borderWidth * (qrSize / 600), 1);
      ctx.strokeStyle = logo.borderColor || '#3b82f6';
      ctx.stroke();
    }
  }

  // 3. Draw Logo Image with Exact Aspect Ratio (No height or width stretching!)
  if (effectiveImg && effectiveImg.complete && ((effectiveImg.naturalWidth && effectiveImg.naturalWidth > 0) || effectiveImg.width > 0)) {
    ctx.globalAlpha = logo.opacity !== undefined ? logo.opacity : 1.0;
    const lx = cx - logoW / 2;
    const ly = cy - logoH / 2;

    ctx.drawImage(effectiveImg, lx, ly, logoW, logoH);
  }

  ctx.beginPath();
  ctx.restore();
}

// Draw Frame Vector Backgrounds
function drawFrameBackground(
  ctx: CanvasRenderingContext2D,
  totalSize: number,
  frame: QRState['frame'],
  qrX: number,
  qrY: number,
  qrSize: number
) {
  ctx.save();
  const bg = frame.bgColor || '#18181b';
  const stroke = frame.strokeColor || '#27272a';

  switch (frame.style) {
    case 'top-ribbon':
    case 'bottom-ribbon':
    case 'polaroid':
    case 'minimal-card':
    case 'social-card':
      ctx.fillStyle = bg;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 4;
      ctx.beginPath();
      drawRoundRect(ctx, 20, 20, totalSize - 40, totalSize - 40, 24);
      ctx.fill();
      ctx.stroke();
      break;

    case 'phone':
      ctx.fillStyle = bg;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 6;
      ctx.beginPath();
      drawRoundRect(ctx, 30, 16, totalSize - 60, totalSize - 32, 44);
      ctx.fill();
      ctx.stroke();

      // Top Notch & Speaker
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      drawRoundRect(ctx, totalSize / 2 - 60, 26, 120, 24, 12);
      ctx.fill();
      ctx.fillStyle = '#27272a';
      ctx.beginPath();
      drawRoundRect(ctx, totalSize / 2 - 25, 34, 50, 6, 3);
      ctx.fill();
      break;

    case 'chat-bubble':
      ctx.fillStyle = bg;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 4;
      ctx.beginPath();
      drawRoundRect(ctx, 24, 20, totalSize - 48, totalSize - 80, 28);
      ctx.fill();
      ctx.stroke();

      // Bubble Tail
      ctx.beginPath();
      ctx.moveTo(totalSize / 2 - 20, totalSize - 60);
      ctx.lineTo(totalSize / 2, totalSize - 20);
      ctx.lineTo(totalSize / 2 + 20, totalSize - 60);
      ctx.closePath();
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.stroke();
      break;

    case 'ticket':
      ctx.fillStyle = bg;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 4;
      ctx.beginPath();
      drawRoundRect(ctx, 20, 20, totalSize - 40, totalSize - 40, 20);
      ctx.fill();
      ctx.stroke();

      // Ticket Perforations / Notches on left & right
      const notchY = qrY + qrSize + 20;
      ctx.fillStyle = '#09090b';
      ctx.beginPath();
      ctx.arc(20, notchY, 18, 0, Math.PI * 2);
      ctx.arc(totalSize - 20, notchY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Dashed line across
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = stroke;
      ctx.beginPath();
      ctx.moveTo(45, notchY);
      ctx.lineTo(totalSize - 45, notchY);
      ctx.stroke();
      ctx.setLineDash([]);
      break;

    case 'circular-badge':
      ctx.fillStyle = bg;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(totalSize / 2, totalSize / 2, totalSize / 2 - 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner dashed accent ring
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(totalSize / 2, totalSize / 2, totalSize / 2 - 36, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      break;

    case 'neon-border':
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 6;
      ctx.shadowColor = stroke;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      drawRoundRect(ctx, 30, 30, totalSize - 60, totalSize - 60, 28);
      ctx.stroke();
      ctx.shadowBlur = 0;
      break;

    case 'top-pill':
    case 'bottom-pill':
    default:
      break;
  }

  ctx.restore();
}

// Helper to build CSS font spec matching Google Fonts weights
export function buildCanvasFont(
  sizePx: number,
  fontFamily: string,
  bold: boolean = true,
  italic: boolean = false
): string {
  const style = italic ? 'italic ' : '';
  // Explicit numeric weight: 700 matches Google Fonts bold weight, 400 matches regular
  // This ensures authentic Google Font weight glyphs are rendered, not browser faux-bold
  const weight = bold ? '700 ' : '400 ';
  return `${style}${weight}${Math.round(sizePx)}px "${fontFamily}", sans-serif`;
}

// Draw Frame CTA Text, Banners, and Badges with Full Typography Customization
function drawFrameForeground(
  ctx: CanvasRenderingContext2D,
  totalSize: number,
  frame: QRState['frame'],
  qrX: number,
  qrY: number,
  qrSize: number
) {
  ctx.save();
  const textColor = frame.textColor || '#ffffff';
  const badgeColor = frame.badgeColor || '#2563eb';
  const fontFam = frame.font || 'Manrope';
  const rawText = frame.text || 'SCAN ME';
  const text = frame.uppercase !== false ? rawText.toUpperCase() : rawText;
  const scale = totalSize / 800;
  const userSize = (frame.fontSize || 28) * scale;
  const align = frame.textAlign || 'center';
  const bold = frame.bold !== false;
  const italic = !!frame.italic;

  switch (frame.style) {
    case 'top-ribbon': {
      const rw = totalSize * 0.78;
      const rh = Math.max(userSize * 1.8 + 14 * scale, 52 * scale);
      const rx = (totalSize - rw) / 2;
      const ry = 44 * scale;

      ctx.fillStyle = badgeColor;
      ctx.beginPath();
      drawRoundRect(ctx, rx, ry, rw, rh, 16 * scale);
      ctx.fill();

      // Text with alignment & typography
      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const tx = align === 'left' ? rx + 24 * scale : align === 'right' ? rx + rw - 24 * scale : totalSize / 2;
      ctx.fillText(text, tx, ry + rh / 2);
      break;
    }

    case 'bottom-ribbon': {
      const rw = totalSize * 0.78;
      const rh = Math.max(userSize * 1.8 + 14 * scale, 52 * scale);
      const rx = (totalSize - rw) / 2;
      const ry = totalSize - rh - 40 * scale;

      ctx.fillStyle = badgeColor;
      ctx.beginPath();
      drawRoundRect(ctx, rx, ry, rw, rh, 16 * scale);
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const tx = align === 'left' ? rx + 24 * scale : align === 'right' ? rx + rw - 24 * scale : totalSize / 2;
      ctx.fillText(text, tx, ry + rh / 2);
      break;
    }

    case 'top-pill': {
      const pw = Math.min(Math.max(text.length * (userSize * 0.65) + 64 * scale, 200 * scale), totalSize - 40 * scale);
      const ph = Math.max(userSize * 1.7 + 10 * scale, 48 * scale);
      const px = (totalSize - pw) / 2;
      const py = 46 * scale;

      ctx.fillStyle = badgeColor;
      ctx.beginPath();
      drawRoundRect(ctx, px, py, pw, ph, ph / 2);
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const tx = align === 'left' ? px + ph / 2 + 10 * scale : align === 'right' ? px + pw - ph / 2 - 10 * scale : totalSize / 2;
      ctx.fillText(text, tx, py + ph / 2);
      break;
    }

    case 'bottom-pill': {
      const pw = Math.min(Math.max(text.length * (userSize * 0.65) + 64 * scale, 200 * scale), totalSize - 40 * scale);
      const ph = Math.max(userSize * 1.7 + 10 * scale, 48 * scale);
      const px = (totalSize - pw) / 2;
      const py = totalSize - ph - 44 * scale;

      ctx.fillStyle = badgeColor;
      ctx.beginPath();
      drawRoundRect(ctx, px, py, pw, ph, ph / 2);
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const tx = align === 'left' ? px + ph / 2 + 10 * scale : align === 'right' ? px + pw - ph / 2 - 10 * scale : totalSize / 2;
      ctx.fillText(text, tx, py + ph / 2);
      break;
    }

    case 'polaroid': {
      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const textY = totalSize - 85 * scale;
      const tx = align === 'left' ? 44 * scale : align === 'right' ? totalSize - 44 * scale : totalSize / 2;
      ctx.fillText(text, tx, textY);

      if (frame.subtext) {
        ctx.fillStyle = '#71717a';
        ctx.font = buildCanvasFont(Math.max(userSize * 0.6, 14 * scale), fontFam, false, false);
        ctx.fillText(frame.subtext, tx, totalSize - 50 * scale);
      }
      break;
    }

    case 'phone': {
      ctx.fillStyle = '#71717a';
      ctx.beginPath();
      drawRoundRect(ctx, totalSize / 2 - 60 * scale, totalSize - 40 * scale, 120 * scale, 6 * scale, 3 * scale);
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const tx = align === 'left' ? 50 * scale : align === 'right' ? totalSize - 50 * scale : totalSize / 2;
      ctx.fillText(text, tx, totalSize - 75 * scale);
      break;
    }

    case 'ticket': {
      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const tx = align === 'left' ? 45 * scale : align === 'right' ? totalSize - 45 * scale : totalSize / 2;
      ctx.fillText(text, tx, totalSize - 75 * scale);
      break;
    }

    case 'minimal-card': {
      const bw = Math.min(Math.max(text.length * (userSize * 0.65) + 50 * scale, 180 * scale), totalSize - 40 * scale);
      const bh = Math.max(userSize * 1.6 + 8 * scale, 44 * scale);
      const bx = (totalSize - bw) / 2;
      const by = totalSize - bh - 48 * scale;

      ctx.fillStyle = badgeColor;
      ctx.beginPath();
      drawRoundRect(ctx, bx, by, bw, bh, 12 * scale);
      ctx.fill();

      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const tx = align === 'left' ? bx + 16 * scale : align === 'right' ? bx + bw - 16 * scale : totalSize / 2;
      ctx.fillText(text, tx, by + bh / 2);
      break;
    }

    case 'social-card': {
      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';

      const tx = align === 'left' ? 44 * scale : align === 'right' ? totalSize - 44 * scale : totalSize / 2;
      ctx.fillText(text, tx, totalSize - 85 * scale);
      if (frame.subtext) {
        ctx.fillStyle = badgeColor;
        ctx.font = buildCanvasFont(Math.max(userSize * 0.65, 15 * scale), fontFam, true, false);
        ctx.fillText(frame.subtext, tx, totalSize - 55 * scale);
      }
      break;
    }

    case 'circular-badge': {
      ctx.fillStyle = textColor;
      ctx.font = buildCanvasFont(userSize, fontFam, bold, italic);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, totalSize / 2, 45 * scale);
      break;
    }

    default:
      break;
  }

  ctx.restore();
}
