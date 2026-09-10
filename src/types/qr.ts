export type BodyShape =
  | 'square'
  | 'rounded'
  | 'extra-rounded'
  | 'dots'
  | 'small-dots'
  | 'fluid-liquid'
  | 'horizontal-lines'
  | 'vertical-lines'
  | 'circuit'
  | 'diamonds'
  | 'sparkles'
  | 'hearts'
  | 'crosses'
  | 'triangles'
  | 'blobs'
  | 'bubbles'
  | 'hexagons'
  | 'chamfered'
  | 'diagonal'
  | 'stars';

export type EyeFrameShape =
  | 'square'
  | 'rounded'
  | 'circle'
  | 'squircle'
  | 'leaf-single'
  | 'leaf-dual'
  | 'chamfered'
  | 'hexagon'
  | 'octagon'
  | 'beaded'
  | 'postage'
  | 'speech'
  | 'double-ring'
  | 'diamond'
  | 'pillow';

export type EyeBallShape =
  | 'square'
  | 'circle'
  | 'rounded'
  | 'squircle'
  | 'leaf-single'
  | 'leaf-dual'
  | 'diamond'
  | 'heart'
  | 'star'
  | 'sparkle'
  | 'cross'
  | 'dot-grid'
  | 'vertical-bars'
  | 'horizontal-bars'
  | 'flower'
  | 'octagon';

export type FrameStyle =
  | 'none'
  | 'top-ribbon'
  | 'bottom-ribbon'
  | 'bottom-pill'
  | 'top-pill'
  | 'polaroid'
  | 'phone'
  | 'chat-bubble'
  | 'ticket'
  | 'circular-badge'
  | 'minimal-card'
  | 'neon-border'
  | 'social-card';

export interface LogoConfig {
  url: string;
  size: number; // 5 to 35 (percentage of QR size)
  margin: number; // 0 to 20 (padding/stroke boundary size)
  shape: 'circle' | 'squircle' | 'rounded' | 'square' | 'none';
  bgColor: string;
  borderColor: string;
  borderWidth: number; // 0 to 10
  largerThanBoundary: boolean; // if true, logo scale exceeds boundary box
  opacity: number;
}

export interface ColorConfig {
  type: 'solid' | 'linear' | 'radial';
  color1: string;
  color2: string;
  angle: number; // 0-360
  eyeUseCustom: boolean;
  eyeBorderColor: string;
  eyeCenterColor: string;
  bgColor: string;
  bgTransparent: boolean;
}

export interface FrameConfig {
  style: FrameStyle;
  text: string;
  subtext: string;
  font: string; // Dynamic Google Font name
  fontSize?: number; // 14 to 48 (default 26)
  textAlign?: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
  uppercase?: boolean;
  letterSpacing?: number; // -2 to 10
  bgColor: string;
  textColor: string;
  strokeColor: string;
  icon: string;
  badgeColor: string;
}

export interface CanvasConfig {
  qrPadding?: number; // Inner padding between QR code and white box (0 to 50px)
  canvasRadius?: number; // Corner radius of white boundary box (0 to 48px)
  canvasBg?: string; // Color of boundary box (#ffffff)
  canvasBorderWidth?: number; // Border thickness (0 to 10px)
  canvasBorderColor?: string; // Border color
  canvasShadow?: boolean; // Subtle card drop shadow
}

export type ContentType =
  | 'url'
  | 'wifi'
  | 'vcard'
  | 'text'
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'crypto';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden: boolean;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  url: string;
  address: string;
  note: string;
}

export interface EmailData {
  address: string;
  subject: string;
  body: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface WhatsappData {
  phone: string;
  message: string;
}

export interface CryptoData {
  coin: 'BTC' | 'ETH' | 'SOL' | 'USDT';
  address: string;
  amount: string;
  message: string;
}

export interface QRState {
  contentType: ContentType;
  rawText: string;
  wifi: WifiData;
  vcard: VCardData;
  email: EmailData;
  sms: SmsData;
  whatsapp: WhatsappData;
  crypto: CryptoData;
  
  // Customization
  bodyShape: BodyShape;
  eyeFrameShape: EyeFrameShape;
  eyeBallShape: EyeBallShape;
  logo: LogoConfig;
  colors: ColorConfig;
  frame: FrameConfig;
  canvas: CanvasConfig;
  
  // Technical settings
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  moduleScale: number; // 40 to 100 percent
  quietZone: number;
}
