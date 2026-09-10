import QRCode from 'qrcode';
import { QRState } from '../types/qr';

export interface QRMatrixResult {
  size: number;
  matrix: boolean[][];
  isEyeOuter: (row: number, col: number) => boolean;
  isEyeCenter: (row: number, col: number) => boolean;
  isAnyEye: (row: number, col: number) => boolean;
  isLogoReserved: (row: number, col: number) => boolean;
  rawPayload: string;
}

export function generatePayloadString(state: QRState): string {
  switch (state.contentType) {
    case 'url':
      let url = state.rawText.trim();
      if (url && !/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url || 'https://qrframe.studio';

    case 'wifi': {
      const { ssid, password, encryption, hidden } = state.wifi;
      const enc = encryption === 'nopass' ? 'nopass' : encryption;
      const h = hidden ? 'H:true;' : '';
      return `WIFI:T:${enc};S:${ssid};P:${password};${h};`;
    }

    case 'vcard': {
      const v = state.vcard;
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${v.lastName};${v.firstName};;;`,
        `FN:${v.firstName} ${v.lastName}`.trim(),
        v.organization ? `ORG:${v.organization}` : '',
        v.title ? `TITLE:${v.title}` : '',
        v.phone ? `TEL;TYPE=CELL:${v.phone}` : '',
        v.email ? `EMAIL:${v.email}` : '',
        v.url ? `URL:${v.url}` : '',
        v.address ? `ADR:;;${v.address};;;;` : '',
        v.note ? `NOTE:${v.note}` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n');
    }

    case 'email': {
      const { address, subject, body } = state.email;
      const params = new URLSearchParams();
      if (subject) params.set('subject', subject);
      if (body) params.set('body', body);
      const query = params.toString();
      return `mailto:${address}${query ? '?' + query : ''}`;
    }

    case 'sms': {
      const { phone, message } = state.sms;
      return `SMSTO:${phone}:${message}`;
    }

    case 'whatsapp': {
      const { phone, message } = state.whatsapp;
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const encodedMsg = encodeURIComponent(message);
      return `https://wa.me/${cleanPhone}${encodedMsg ? '?text=' + encodedMsg : ''}`;
    }

    case 'crypto': {
      const { coin, address, amount } = state.crypto;
      const prefixMap: Record<string, string> = {
        BTC: 'bitcoin',
        ETH: 'ethereum',
        SOL: 'solana',
        USDT: 'ethereum' // Or generic ERC-20
      };
      const scheme = prefixMap[coin] || 'bitcoin';
      return `${scheme}:${address}${amount ? '?amount=' + amount : ''}`;
    }

    case 'text':
    default:
      return state.rawText || 'Hello World from QR Frame Studio!';
  }
}

export function createQRMatrix(state: QRState): QRMatrixResult {
  const payload = generatePayloadString(state);
  
  // Directly respect user-selected Error Correction Level (L: 7%, M: 15%, Q: 25%, H: 30%)
  const ecl = state.errorCorrectionLevel || (state.logo.url ? 'H' : 'M');

  const qr = QRCode.create(payload, {
    errorCorrectionLevel: ecl,
  });

  const size = qr.modules.size;
  const matrix: boolean[][] = [];

  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      row.push(!!qr.modules.get(r, c));
    }
    matrix.push(row);
  }

  // 7x7 Finder Pattern Locations:
  // Top-Left: (0..6, 0..6)
  // Top-Right: (0..6, size-7..size-1)
  // Bottom-Left: (size-7..size-1, 0..6)
  const isEyeOuter = (r: number, c: number): boolean => {
    const inTL = r >= 0 && r < 7 && c >= 0 && c < 7;
    const inTR = r >= 0 && r < 7 && c >= size - 7 && c < size;
    const inBL = r >= size - 7 && r < size && c >= 0 && c < 7;
    if (!inTL && !inTR && !inBL) return false;

    // Check if it's on the outer 7x7 border (r=0, r=6, c=0, c=6 relative to the eye)
    const localR = inBL ? r - (size - 7) : r;
    const localC = inTR ? c - (size - 7) : c;

    const isBorder =
      localR === 0 || localR === 6 || localC === 0 || localC === 6 ||
      localR === 1 || localR === 5 || localC === 1 || localC === 5; // frame area
    return isBorder;
  };

  const isEyeCenter = (r: number, c: number): boolean => {
    const inTL = r >= 2 && r <= 4 && c >= 2 && c <= 4;
    const inTR = r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3;
    const inBL = r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4;
    return inTL || inTR || inBL;
  };

  const isAnyEye = (r: number, c: number): boolean => {
    const inTL = r >= 0 && r < 7 && c >= 0 && c < 7;
    const inTR = r >= 0 && r < 7 && c >= size - 7 && c < size;
    const inBL = r >= size - 7 && r < size && c >= 0 && c < 7;
    return inTL || inTR || inBL;
  };

  // Safe logo reservation: Keep false so Reed-Solomon Level H handles the clean overlay
  const isLogoReserved = (): boolean => false;

  return {
    size,
    matrix,
    isEyeOuter,
    isEyeCenter,
    isAnyEye,
    isLogoReserved,
    rawPayload: payload
  };
}
