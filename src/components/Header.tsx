import React from 'react';
import { Shield, Smartphone, LayoutDashboard, AlertTriangle, Radio, RefreshCw, MapPin, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeMode: 'dashboard' | 'mobile';
  setActiveMode: (mode: 'dashboard' | 'mobile') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  onRefreshData?: () => void;
  isLoading?: boolean;
}

export const CITIES = [
  'All India Corridors',
  'New Delhi',
  'Bengaluru',
  'Mumbai / Khandala',
  'Hyderabad',
  'Chennai',
  'Mathura / Yamuna Exp'
];

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  setActiveMode,
  selectedCity,
  setSelectedCity,
  onRefreshData,
  isLoading
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      {/* Top emergency advisory ticker */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 px-4 py-1 border-b border-red-900/30 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center space-x-2 overflow-hidden">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-semibold text-red-400 uppercase tracking-wider text-[10px] px-1.5 py-0.5 bg-red-950/80 rounded border border-red-800/50">
            Live Warning
          </span>
          <div className="animate-marquee whitespace-nowrap text-slate-300 font-medium text-xs">
            ⚠️ <strong className="text-amber-300">NH-48 Mahipalpur & Yamuna Exp MP-68:</strong> Heavy monsoon waterlogging & dense fog risk. Random Forest Model predicts 88% accident probability without speed reduction. PWD emergency teams dispatched.
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-[11px] text-slate-400 flex-shrink-0">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Gemini 3.7 AI Model: <strong className="text-emerald-400">Online</strong>
          </span>
          <span>•</span>
          <span>MoRTH Standard: <strong className="text-blue-400">IRC:SP:84</strong></span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & National Road Safety Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-amber-200 to-orange-400 bg-clip-text text-transparent">
                  RoadGuard AI
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                  MoRTH & NHAI Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Predictive Accident Hotspot & Road Safety Platform (India)
              </p>
            </div>
          </div>

          {/* Center: City / Highway Corridor Selector */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 shadow-inner">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mr-1.5 flex-shrink-0" />
              <span className="text-slate-400 mr-1.5 hidden sm:inline">Corridor:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-2"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {onRefreshData && (
              <button
                onClick={onRefreshData}
                disabled={isLoading}
                title="Sync Live Sensors & AI Feeds"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 flex items-center justify-center disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            )}
          </div>

          {/* Right: Platform Dual-Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              id="mode-dashboard-btn"
              onClick={() => setActiveMode('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'dashboard'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Authority Dashboard</span>
            </button>

            <button
              id="mode-mobile-btn"
              onClick={() => setActiveMode('mobile')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeMode === 'mobile'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Citizen & Driver App</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
