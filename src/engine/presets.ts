import { QRState } from '../types/qr';

export interface PresetDesign {
  id: string;
  name: string;
  category: string;
  previewGradient: string;
  state: Partial<QRState>;
}

export const DESIGN_PRESETS: PresetDesign[] = [
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    category: 'Tech & Modern',
    previewGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    state: {
      bodyShape: 'fluid-liquid',
      eyeFrameShape: 'squircle',
      eyeBallShape: 'squircle',
      colors: {
        type: 'linear',
        color1: '#3b82f6',
        color2: '#1d4ed8',
        angle: 135,
        eyeUseCustom: false,
        eyeBorderColor: '#3b82f6',
        eyeCenterColor: '#1d4ed8',
        bgColor: '#09090b',
        bgTransparent: false
      },
      frame: {
        style: 'bottom-pill',
        text: 'SCAN ME',
        subtext: '',
        font: 'Manrope',
        bgColor: '#18181b',
        textColor: '#ffffff',
        strokeColor: '#27272a',
        icon: 'camera',
        badgeColor: '#2563eb'
      }
    }
  },
  {
    id: 'cyber-emerald',
    name: 'Cyber Emerald',
    category: 'Dark Tech',
    previewGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    state: {
      bodyShape: 'circuit',
      eyeFrameShape: 'chamfered',
      eyeBallShape: 'diamond',
      colors: {
        type: 'linear',
        color1: '#10b981',
        color2: '#047857',
        angle: 45,
        eyeUseCustom: true,
        eyeBorderColor: '#34d399',
        eyeCenterColor: '#10b981',
        bgColor: '#064e3b1a',
        bgTransparent: false
      },
      frame: {
        style: 'neon-border',
        text: 'CONNECT NODE',
        subtext: '',
        font: 'JetBrains Mono',
        bgColor: '#09090b',
        textColor: '#10b981',
        strokeColor: '#10b981',
        icon: 'sparkle',
        badgeColor: '#059669'
      }
    }
  },
  {
    id: 'sunset-peach',
    name: 'Sunset Glow',
    category: 'Vibrant',
    previewGradient: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
    state: {
      bodyShape: 'sparkles',
      eyeFrameShape: 'circle',
      eyeBallShape: 'sparkle',
      colors: {
        type: 'linear',
        color1: '#f97316',
        color2: '#ec4899',
        angle: 120,
        eyeUseCustom: false,
        eyeBorderColor: '#f97316',
        eyeCenterColor: '#ec4899',
        bgColor: '#ffffff',
        bgTransparent: false
      },
      frame: {
        style: 'top-ribbon',
        text: 'DISCOVER MORE',
        subtext: '',
        font: 'Manrope',
        bgColor: '#18181b',
        textColor: '#ffffff',
        strokeColor: '#f97316',
        icon: 'sparkle',
        badgeColor: '#f97316'
      }
    }
  },
  {
    id: 'luxury-gold',
    name: 'Midnight Gold',
    category: 'Premium',
    previewGradient: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
    state: {
      bodyShape: 'diamonds',
      eyeFrameShape: 'diamond',
      eyeBallShape: 'diamond',
      colors: {
        type: 'linear',
        color1: '#fbbf24',
        color2: '#d97706',
        angle: 45,
        eyeUseCustom: true,
        eyeBorderColor: '#f59e0b',
        eyeCenterColor: '#fbbf24',
        bgColor: '#09090b',
        bgTransparent: false
      },
      frame: {
        style: 'minimal-card',
        text: 'EXCLUSIVE VIP',
        subtext: 'Scan to Enter',
        font: 'Manrope',
        bgColor: '#18181b',
        textColor: '#ffffff',
        strokeColor: '#3f3f46',
        icon: 'star',
        badgeColor: '#d97706'
      }
    }
  },
  {
    id: 'clean-minimal',
    name: 'Clean Monochrome',
    category: 'Minimal',
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)',
    state: {
      bodyShape: 'rounded',
      eyeFrameShape: 'rounded',
      eyeBallShape: 'rounded',
      colors: {
        type: 'solid',
        color1: '#09090b',
        color2: '#09090b',
        angle: 0,
        eyeUseCustom: false,
        eyeBorderColor: '#09090b',
        eyeCenterColor: '#09090b',
        bgColor: '#ffffff',
        bgTransparent: false
      },
      frame: {
        style: 'polaroid',
        text: 'Visit Website',
        subtext: 'Point camera to open link',
        font: 'Plus Jakarta Sans',
        bgColor: '#ffffff',
        textColor: '#09090b',
        strokeColor: '#e4e4e7',
        icon: 'none',
        badgeColor: '#09090b'
      }
    }
  },
  {
    id: 'bubble-social',
    name: 'Social Bubble',
    category: 'Social',
    previewGradient: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
    state: {
      bodyShape: 'dots',
      eyeFrameShape: 'beaded',
      eyeBallShape: 'circle',
      colors: {
        type: 'linear',
        color1: '#8b5cf6',
        color2: '#3b82f6',
        angle: 90,
        eyeUseCustom: false,
        eyeBorderColor: '#8b5cf6',
        eyeCenterColor: '#3b82f6',
        bgColor: '#18181b',
        bgTransparent: false
      },
      frame: {
        style: 'chat-bubble',
        text: 'CHAT WITH US',
        subtext: '',
        font: 'Manrope',
        bgColor: '#18181b',
        textColor: '#ffffff',
        strokeColor: '#8b5cf6',
        icon: 'none',
        badgeColor: '#8b5cf6'
      }
    }
  }
];
