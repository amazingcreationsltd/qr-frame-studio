import React, { useState, useEffect } from 'react';
import {
  Globe,
  Layout,
  Shapes,
  Image as ImageIcon,
  Palette,
  Eye,
  Sparkles
} from 'lucide-react';
import { Header } from './components/Header';
import { ContentTab } from './components/ContentTab';
import { FramesTab } from './components/FramesTab';
import { PatternsTab } from './components/PatternsTab';
import { LogoTab } from './components/LogoTab';
import { ColorsTab } from './components/ColorsTab';
import { QRPreview } from './components/QRPreview';
import { ExportModal } from './components/ExportModal';
import { QRState } from './types/qr';

const INITIAL_STATE: QRState = {
  contentType: 'url',
  rawText: 'https://qrframe.studio',
  wifi: {
    ssid: 'Studio WiFi',
    password: 'supersecretpass',
    encryption: 'WPA',
    hidden: false
  },
  vcard: {
    firstName: 'Alex',
    lastName: 'Rivers',
    organization: 'QR Frame Studio',
    title: 'Design Engineer',
    phone: '+1 (555) 019-2834',
    email: 'alex@qrframe.studio',
    url: 'https://qrframe.studio',
    address: 'San Francisco, CA',
    note: 'Let us connect and build together!'
  },
  email: {
    address: 'hello@qrframe.studio',
    subject: 'Project Collaboration',
    body: 'Hi, I would love to connect about a project...'
  },
  sms: {
    phone: '+15550192834',
    message: 'Hello from QR Frame Studio!'
  },
  whatsapp: {
    phone: '+15550192834',
    message: 'Hello, I would like to learn more about your services!'
  },
  crypto: {
    coin: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    amount: '0.01',
    message: 'Invoice Payment'
  },

  // Customization
  bodyShape: 'fluid-liquid',
  eyeFrameShape: 'squircle',
  eyeBallShape: 'squircle',
  moduleScale: 90,
  errorCorrectionLevel: 'M',

  logo: {
    url: '',
    size: 20,
    margin: 8,
    shape: 'squircle',
    bgColor: '#ffffff',
    borderColor: '#3b82f6',
    borderWidth: 2,
    largerThanBoundary: false,
    opacity: 1.0
  },

  colors: {
    type: 'linear',
    color1: '#2563eb',
    color2: '#1d4ed8',
    angle: 135,
    eyeUseCustom: false,
    eyeBorderColor: '#2563eb',
    eyeCenterColor: '#1d4ed8',
    bgColor: '#ffffff',
    bgTransparent: false
  },

  frame: {
    style: 'bottom-pill',
    text: 'SCAN ME',
    subtext: '',
    font: 'Manrope',
    fontSize: 28,
    textAlign: 'center',
    bold: true,
    italic: false,
    uppercase: true,
    letterSpacing: 0,
    bgColor: '#18181b',
    textColor: '#ffffff',
    strokeColor: '#27272a',
    icon: 'camera',
    badgeColor: '#2563eb'
  },

  canvas: {
    qrPadding: 16,
    canvasRadius: 20,
    canvasBg: '#ffffff',
    canvasBorderWidth: 0,
    canvasBorderColor: '#e4e4e7',
    canvasShadow: false
  },

  quietZone: 1
};

type ActiveTab = 'content' | 'frame' | 'patterns' | 'logo' | 'colors';

export const App: React.FC = () => {
  const [state, setState] = useState<QRState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<ActiveTab>('content');
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Synchronize logoImage whenever state.logo.url changes or component loads
  useEffect(() => {
    if (state.logo.url) {
      let url = state.logo.url;
      if (url.startsWith('data:image/svg+xml;utf8,')) {
        url = url.replace('data:image/svg+xml;utf8,', 'data:image/svg+xml;charset=utf-8,');
      }
      const img = new Image();
      if (!url.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
        setLogoImage(img);
      };
      img.onerror = () => {
        console.warn('Logo image failed to load from:', url.slice(0, 60));
      };
      img.src = url;
    } else {
      setLogoImage(null);
    }
  }, [state.logo.url]);

  const handleStateUpdate = (updates: Partial<QRState>) => {
    setState((prev) => ({
      ...prev,
      ...updates
    }));
  };

  const handleReset = () => {
    setState(INITIAL_STATE);
    setLogoImage(null);
  };

  const handleSelectPreset = (presetState: Partial<QRState>) => {
    setState((prev) => ({
      ...prev,
      ...presetState,
      colors: {
        ...prev.colors,
        ...(presetState.colors || {})
      },
      frame: {
        ...prev.frame,
        ...(presetState.frame || {})
      }
    }));
  };

  const TABS: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'content', label: 'Content', icon: Globe },
    { id: 'frame', label: 'Frames', icon: Layout },
    { id: 'patterns', label: 'Patterns', icon: Shapes },
    { id: 'logo', label: 'Logo', icon: ImageIcon },
    { id: 'colors', label: 'Colors', icon: Palette }
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Header
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        scannable={true}
      />

      {/* Main Workbench Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Studio Workbench Controls (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tab Navigation Pill Bar (Matching Screenshot 3 design) */}
            <div className="flex items-center gap-1.5 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-x-auto no-scrollbar shadow-md">
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`flex-1 min-w-[75px] sm:min-w-[90px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Tab Panel */}
            <div className="bg-zinc-900/40 border border-zinc-800/70 rounded-3xl p-5 sm:p-7 backdrop-blur-sm">
              {activeTab === 'content' && (
                <ContentTab state={state} onChange={handleStateUpdate} />
              )}
              {activeTab === 'frame' && (
                <FramesTab state={state} onChange={handleStateUpdate} />
              )}
              {activeTab === 'patterns' && (
                <PatternsTab state={state} onChange={handleStateUpdate} />
              )}
              {activeTab === 'logo' && (
                <LogoTab
                  state={state}
                  onChange={handleStateUpdate}
                  logoImage={logoImage}
                  onLogoLoad={setLogoImage}
                />
              )}
              {activeTab === 'colors' && (
                <ColorsTab state={state} onChange={handleStateUpdate} />
              )}
            </div>
          </div>

          {/* Right Column: Fixed/Sticky Live QR Preview (5 Cols on desktop) */}
          <div className="lg:col-span-5 hidden lg:block sticky top-20 self-start">
            <QRPreview state={state} logoImage={logoImage} />
          </div>
        </div>
      </main>

      {/* Mobile Floating Preview Button & Bottom Sheet */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-blue-600 text-white text-xs font-bold shadow-2xl shadow-blue-600/50 cursor-pointer active:scale-95 transition-transform"
        >
          <Eye className="w-4 h-4" />
          <span>{showMobilePreview ? 'Hide Preview' : 'View Live QR'}</span>
        </button>
      </div>

      {/* Mobile Fullscreen / Slideover Preview Drawer */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex flex-col justify-end animate-in fade-in">
          <div className="w-full max-w-lg mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white font-heading">
                Mobile Live Preview
              </span>
              <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 cursor-pointer"
              >
                Close
              </button>
            </div>
            <QRPreview state={state} logoImage={logoImage} />
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        state={state}
        logoImage={logoImage}
      />
    </div>
  );
};
export default App;
