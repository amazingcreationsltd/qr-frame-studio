import React from 'react';
import {
  Globe,
  Wifi,
  Contact,
  FileText,
  Mail,
  MessageSquare,
  PhoneCall,
  Coins
} from 'lucide-react';
import { ContentType, QRState } from '../types/qr';

interface ContentTabProps {
  state: QRState;
  onChange: (updates: Partial<QRState>) => void;
}

const CONTENT_TYPES: { id: ContentType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'url', label: 'Link / URL', icon: Globe },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { id: 'vcard', label: 'Contact', icon: Contact },
  { id: 'text', label: 'Plain Text', icon: FileText },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'sms', label: 'SMS', icon: MessageSquare },
  { id: 'whatsapp', label: 'WhatsApp', icon: PhoneCall },
  { id: 'crypto', label: 'Crypto', icon: Coins },
];

export const ContentTab: React.FC<ContentTabProps> = ({ state, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Type Selector Pills */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
          Select Content Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CONTENT_TYPES.map(({ id, label, icon: Icon }) => {
            const active = state.contentType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange({ contentType: id })}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                  active
                    ? 'bg-blue-600/15 border-blue-500 text-blue-400 shadow-sm shadow-blue-500/10'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : 'text-zinc-500'}`} />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Content Form */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
        {state.contentType === 'url' && (
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Website URL
                </label>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {state.rawText.length} chars
                </span>
              </div>
              <input
                type="url"
                value={state.rawText}
                onChange={(e) => onChange({ rawText: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
            </div>

            {/* URL Optimization & Dot Quantity Tip */}
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-[11px] font-medium text-zinc-300">
                  {state.rawText.length > 60
                    ? 'Dense URL (High Dot Quantity)'
                    : 'Clean URL (Few Dots, Large & Bold)'}
                </div>
                <div className="text-[10px] text-zinc-500">
                  {state.rawText.length > 60
                    ? 'Shorter links produce fewer, larger dots with more spacing.'
                    : 'Optimal length for big, crisp module shapes.'}
                </div>
              </div>

              {state.rawText.includes('?') && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const clean = state.rawText.split('?')[0];
                      onChange({ rawText: clean });
                    } catch (e) {}
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600/15 border border-blue-500/30 text-[11px] font-semibold text-blue-400 hover:bg-blue-600/25 transition-all cursor-pointer whitespace-nowrap"
                >
                  Strip Tracking (?utm)
                </button>
              )}
            </div>
          </div>
        )}

        {state.contentType === 'wifi' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Network SSID (Name)
              </label>
              <input
                type="text"
                value={state.wifi.ssid}
                onChange={(e) =>
                  onChange({ wifi: { ...state.wifi, ssid: e.target.value } })
                }
                placeholder="Home WiFi"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <input
                type="text"
                value={state.wifi.password}
                onChange={(e) =>
                  onChange({ wifi: { ...state.wifi, password: e.target.value } })
                }
                placeholder="WiFi Password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Encryption
                </label>
                <select
                  value={state.wifi.encryption}
                  onChange={(e) =>
                    onChange({
                      wifi: {
                        ...state.wifi,
                        encryption: e.target.value as 'WPA' | 'WEP' | 'nopass'
                      }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>
              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.wifi.hidden}
                    onChange={(e) =>
                      onChange({ wifi: { ...state.wifi, hidden: e.target.checked } })
                    }
                    className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-blue-600 focus:ring-blue-500"
                  />
                  Hidden Network
                </label>
              </div>
            </div>
          </div>
        )}

        {state.contentType === 'vcard' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">First Name</label>
                <input
                  type="text"
                  value={state.vcard.firstName}
                  onChange={(e) =>
                    onChange({ vcard: { ...state.vcard, firstName: e.target.value } })
                  }
                  placeholder="Alex"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={state.vcard.lastName}
                  onChange={(e) =>
                    onChange({ vcard: { ...state.vcard, lastName: e.target.value } })
                  }
                  placeholder="Rivers"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Company</label>
                <input
                  type="text"
                  value={state.vcard.organization}
                  onChange={(e) =>
                    onChange({ vcard: { ...state.vcard, organization: e.target.value } })
                  }
                  placeholder="Acme Studio"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Job Title</label>
                <input
                  type="text"
                  value={state.vcard.title}
                  onChange={(e) =>
                    onChange({ vcard: { ...state.vcard, title: e.target.value } })
                  }
                  placeholder="Lead Designer"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={state.vcard.phone}
                  onChange={(e) =>
                    onChange({ vcard: { ...state.vcard, phone: e.target.value } })
                  }
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Email</label>
                <input
                  type="email"
                  value={state.vcard.email}
                  onChange={(e) =>
                    onChange({ vcard: { ...state.vcard, email: e.target.value } })
                  }
                  placeholder="alex@studio.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {state.contentType === 'text' && (
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Plain Text Note / Message
            </label>
            <textarea
              rows={4}
              value={state.rawText}
              onChange={(e) => onChange({ rawText: e.target.value })}
              placeholder="Type any message, instructions, or notes here..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {state.contentType === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Recipient Email</label>
              <input
                type="email"
                value={state.email.address}
                onChange={(e) =>
                  onChange({ email: { ...state.email, address: e.target.value } })
                }
                placeholder="contact@brand.com"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Subject</label>
              <input
                type="text"
                value={state.email.subject}
                onChange={(e) =>
                  onChange({ email: { ...state.email, subject: e.target.value } })
                }
                placeholder="Project Inquiry"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {state.contentType === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                WhatsApp Phone (with Country Code)
              </label>
              <input
                type="tel"
                value={state.whatsapp.phone}
                onChange={(e) =>
                  onChange({ whatsapp: { ...state.whatsapp, phone: e.target.value } })
                }
                placeholder="+14155552671"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Pre-filled Message</label>
              <input
                type="text"
                value={state.whatsapp.message}
                onChange={(e) =>
                  onChange({ whatsapp: { ...state.whatsapp, message: e.target.value } })
                }
                placeholder="Hi, I would like to book a demo..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {state.contentType === 'crypto' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Cryptocurrency</label>
                <select
                  value={state.crypto.coin}
                  onChange={(e) =>
                    onChange({
                      crypto: {
                        ...state.crypto,
                        coin: e.target.value as 'BTC' | 'ETH' | 'SOL' | 'USDT'
                      }
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="SOL">Solana (SOL)</option>
                  <option value="USDT">Tether (USDT)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Amount (Optional)</label>
                <input
                  type="text"
                  value={state.crypto.amount}
                  onChange={(e) =>
                    onChange({ crypto: { ...state.crypto, amount: e.target.value } })
                  }
                  placeholder="0.05"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Wallet Address</label>
              <input
                type="text"
                value={state.crypto.address}
                onChange={(e) =>
                  onChange({ crypto: { ...state.crypto, address: e.target.value } })
                }
                placeholder="0x71C... or bc1q..."
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
