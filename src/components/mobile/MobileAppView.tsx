import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Mic,
  MicOff,
  Camera,
  Navigation,
  Radio,
  AlertTriangle,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Flame,
  ArrowRight,
  TrendingDown,
  Gauge,
  Compass,
  Award
} from 'lucide-react';
import { HazardReport, HazardType, RouteOption, BlackSpot } from '../../types';
import { SAMPLE_ROUTES } from '../../data/mockData';

interface MobileAppViewProps {
  hazards: HazardReport[];
  blackSpots: BlackSpot[];
  onReportHazard: (hazard: Partial<HazardReport>) => void;
  onVoteHazard?: (id: string) => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  hazards,
  blackSpots,
  onReportHazard,
  onVoteHazard
}) => {
  // Mobile Tab state
  const [activeTab, setActiveTab] = useState<'RADAR' | 'VOICE' | 'REPORT' | 'ROUTES' | 'SOS'>('RADAR');

  // Driving Radar state
  const [simulatedSpeed, setSimulatedSpeed] = useState<number>(68);
  const [isSpeeding, setIsSpeeding] = useState(false);
  const [approachingSpot, setApproachingSpot] = useState<BlackSpot | null>(blackSpots[0] || null);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);
  const [radarDistanceMeters, setRadarDistanceMeters] = useState(380);

  // Voice Reporting state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [voiceResult, setVoiceResult] = useState<any>(null);

  // Manual / Camera Report Form state
  const [hazardType, setHazardType] = useState<HazardType>('POTHOLE');
  const [hazardTitle, setHazardTitle] = useState('');
  const [hazardDesc, setHazardDesc] = useState('');
  const [hazardAddress, setHazardAddress] = useState('NH-48 Corridor, near Dhaula Kuan merge');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Safe Route state
  const [selectedRouteId, setSelectedRouteId] = useState('route-safe');

  // SOS Emergency State
  const [sosActive, setSosActive] = useState(false);

  // Speed simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate minor speed jitter while driving
      setSimulatedSpeed((prev) => {
        const next = Math.max(35, Math.min(95, prev + (Math.random() > 0.5 ? 2 : -2)));
        setIsSpeeding(next > 70);
        return next;
      });

      // Decrease distance to simulated black spot
      setRadarDistanceMeters((prev) => {
        if (prev <= 50) return 450;
        return prev - 15;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Voice recording simulation or Web Speech Recognition
  const handleToggleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceResult(null);

      // Check if browser SpeechRecognition is available
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-IN';

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setVoiceText(transcript);
            handleProcessVoice(transcript);
            setIsRecording(false);
          };

          recognition.onerror = () => {
            setIsRecording(false);
            // Fallback sample transcript
            const sample = 'Huge waterlogging and deep pothole right after Mahipalpur flyover towards airport, cars are skidding!';
            setVoiceText(sample);
            handleProcessVoice(sample);
          };

          recognition.start();
          return;
        } catch (err) {
          console.warn('Speech recognition not permitted, using sample simulation', err);
        }
      }

      // If speech API unavailable in sandboxed environment, fallback to simulated realistic voice prompt
      setTimeout(() => {
        setIsRecording(false);
        const sample = 'Deep oil spill and stalled truck on the curved descent right after Khandala exit, cars are slipping!';
        setVoiceText(sample);
        handleProcessVoice(sample);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  const handleProcessVoice = async (transcript: string) => {
    if (!transcript) return;
    setIsProcessingVoice(true);
    try {
      const res = await fetch('/api/ai/process-voice-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceTranscript: transcript,
          currentSpeed: simulatedSpeed,
          driverCoords: { lat: 28.5445, lng: 77.1260 }
        })
      });
      const data = await res.json();
      setVoiceResult(data);
      if (data.createdHazard) {
        onReportHazard(data.createdHazard);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const handleSubmitManualReport = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Partial<HazardReport> = {
      title: hazardTitle || `${hazardType} Hazard on Corridor`,
      type: hazardType,
      description: hazardDesc || 'Citizen reported safety concern',
      address: hazardAddress,
      imageUrl: selectedPhoto,
      reporterType: 'QUICK_TAP',
      lat: 28.5445 + (Math.random() - 0.5) * 0.01,
      lng: 77.1260 + (Math.random() - 0.5) * 0.01
    };

    onReportHazard(newReport);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setHazardTitle('');
      setHazardDesc('');
      setActiveTab('RADAR');
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col min-h-[720px] relative">
      
      {/* Top Phone Status Bar */}
      <div className="bg-slate-900/90 px-5 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800">
        <span className="font-bold text-slate-200">09:41</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-sans font-semibold">
            GPS: 3m Lock
          </span>
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* App Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-4 text-slate-950 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center font-black">
            🛡️
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight text-white leading-none">
              RakshaPath Driver Companion
            </h2>
            <p className="text-[10px] text-amber-100 font-semibold mt-0.5">
              MoRTH Connected Safety App
            </p>
          </div>
        </div>

        <button
          onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
          className="p-2 rounded-full bg-slate-950/20 hover:bg-slate-950/40 text-white transition cursor-pointer"
          title={audioAlertsEnabled ? 'Voice Warnings Enabled' : 'Voice Warnings Muted'}
        >
          {audioAlertsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: DRIVING RADAR & DANGER WARNING HUD */}
        {activeTab === 'RADAR' && (
          <div className="space-y-4">
            {/* Speedometer & Live HUD */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-xl text-center">
              <div className="absolute top-2 left-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>Live HUD Speed</span>
              </div>

              {/* Speed display */}
              <div className="my-2">
                <span className={`text-6xl font-black font-mono tracking-tighter ${isSpeeding ? 'text-red-500 animate-pulse' : 'text-slate-100'}`}>
                  {simulatedSpeed}
                </span>
                <span className="text-xs text-slate-400 font-bold ml-1">km/h</span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Speed Limit: 70 km/h
                </span>
                {isSpeeding && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-bounce">
                    ⚠️ OVERSPEEDING
                  </span>
                )}
              </div>
            </div>

            {/* Approaching Black Spot Warning Banner */}
            {approachingSpot && (
              <div className="bg-gradient-to-r from-red-950 to-orange-950 border-2 border-red-500/80 rounded-2xl p-4 relative overflow-hidden shadow-2xl animate-pulse-glow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold text-sm">
                      ⚠️
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-300 block">
                        Black Spot Alert: {radarDistanceMeters}m Ahead
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {approachingSpot.name}
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-red-500 text-white shadow">
                    Risk {approachingSpot.riskScore}
                  </span>
                </div>

                <p className="text-xs text-slate-200 mt-2.5 leading-relaxed bg-black/40 p-2 rounded-lg border border-red-500/30">
                  🚨 <strong>Advisory:</strong> {approachingSpot.mlModel.topRiskFactors[0]?.description || 'Reduce speed to 40 km/h and maintain 4-second distance.'}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                  <span>3-Yr Fatalities: <strong className="text-red-400">{approachingSpot.fatalities3Yr} Deaths</strong></span>
                  <span className="text-amber-300 font-bold">Recommended Speed: 40 km/h</span>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('VOICE')}
                className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 flex flex-col items-center justify-center space-y-1 transition cursor-pointer"
              >
                <Mic className="w-5 h-5" />
                <span>Voice Report Hazard</span>
              </button>

              <button
                onClick={() => setActiveTab('ROUTES')}
                className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs flex flex-col items-center justify-center space-y-1 transition cursor-pointer"
              >
                <Navigation className="w-5 h-5 text-emerald-400" />
                <span>Safe Route Navigator</span>
              </button>
            </div>

            {/* Live Citizen Alert Feed */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-red-400" />
                  Nearby Hazards ({hazards.length})
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Live Broadcast</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {hazards.slice(0, 3).map((hz) => (
                  <div
                    key={hz.id}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-200 text-[11px]">{hz.title}</div>
                      <div className="text-[10px] text-slate-400">{hz.address}</div>
                    </div>
                    <button
                      onClick={() => onVoteHazard?.(hz.id)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px] font-bold border border-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      👍 {hz.upvotes}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VOICE REPORTING WHILE DRIVING */}
        {activeTab === 'VOICE' && (
          <div className="space-y-4 text-center">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center justify-center gap-1.5">
                <Mic className="w-4 h-4 text-amber-400" />
                Hands-Free Driver Voice Reporter
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Keep your eyes on the road. Tap mic and speak naturally (e.g. &quot;Severe pothole after Dhaula Kuan towards Gurugram&quot;).
              </p>
            </div>

            {/* Giant Glowing Mic Button */}
            <div className="py-6 flex flex-col items-center justify-center">
              <button
                onClick={handleToggleVoiceRecord}
                disabled={isProcessingVoice}
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white scale-110 shadow-red-500/50 animate-pulse'
                    : 'bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 shadow-orange-500/30 hover:scale-105'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Listening...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 mb-1" />
                    <span className="text-[10px] font-extrabold uppercase">Tap to Speak</span>
                  </>
                )}
              </button>

              {isRecording && (
                <div className="mt-4 text-xs font-mono text-red-400 animate-pulse">
                  🎙️ Recording audio stream & analyzing with Gemini...
                </div>
              )}

              {isProcessingVoice && (
                <div className="mt-4 text-xs font-mono text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Gemini NLP extracting hazard metadata...</span>
                </div>
              )}
            </div>

            {/* Quick Test Voice Prompts */}
            <div className="text-left bg-slate-900/60 p-3 rounded-2xl border border-slate-800 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Simulation Phrases:
              </span>
              <div className="space-y-1.5">
                {[
                  'Deep 1.2m pothole on right lane after Mahipalpur flyover!',
                  'Massive waterlogging at Silk Board underpass, cars stalling!',
                  'Commercial truck driving wrong side on Gachibowli exit!'
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setVoiceText(sample);
                      handleProcessVoice(sample);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 transition border border-slate-800/80 cursor-pointer"
                  >
                    🗣️ &quot;{sample}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Analysis Result Card */}
            {voiceResult && (
              <div className="bg-slate-950 border border-emerald-500/50 rounded-2xl p-4 text-left space-y-2 shadow-xl">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pb-1.5 border-b border-slate-800">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AI Hazard Extracted & Broadcasted!
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Confidence: {Math.round((voiceResult.extractedData?.confidenceScore || 0.95) * 100)}%
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-100">
                  {voiceResult.extractedData?.hazardTitle}
                </div>

                <p className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  📢 <strong>Broadcast Warning:</strong> {voiceResult.extractedData?.driverAudioAlert}
                </p>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>Type: <strong className="text-amber-400">{voiceResult.extractedData?.hazardType}</strong></span>
                  <span>Urgency: <strong className="text-red-400">{voiceResult.extractedData?.urgencyLevel}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REPORT ROAD HAZARD (CAMERA / MANUAL) */}
        {activeTab === 'REPORT' && (
          <form onSubmit={handleSubmitManualReport} className="space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-400" />
                Report Road Hazard
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Take a photo or select defect category for instant AI verification and PWD work order creation.
              </p>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hazard Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'POTHOLE', label: '🕳️ Pothole' },
                  { type: 'WATERLOGGING', label: '🌊 Flooding' },
                  { type: 'OIL_SPILL', label: '🛢️ Oil Spill' },
                  { type: 'WRONG_SIDE', label: '🚫 Wrong Side' },
                  { type: 'BROKEN_DIVIDER', label: '🚧 Barrier Cut' },
                  { type: 'STRAY_ANIMALS', label: '🐄 Animals' }
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setHazardType(item.type as HazardType)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold transition border text-center cursor-pointer ${
                      hazardType === item.type
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Preview & Snap */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Photo Evidence (AI Auto-Scanned)
              </label>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                <img src={selectedPhoto} alt="Hazard Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono font-bold">
                  ✓ AI Verified
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hazard Title
                </label>
                <input
                  type="text"
                  value={hazardTitle}
                  onChange={(e) => setHazardTitle(e.target.value)}
                  placeholder="e.g. Deep 1-meter crater in middle lane"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location / Milepost
                </label>
                <input
                  type="text"
                  value={hazardAddress}
                  onChange={(e) => setHazardAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-orange-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Verified Hazard Report</span>
            </button>

            {submittedSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4" />
                <span>Report logged! PWD repair priority calculated.</span>
              </div>
            )}
          </form>
        )}

        {/* TAB 4: DANGEROUS ROUTE ALERTS & SAFE ROUTE FINDER */}
        {activeTab === 'ROUTES' && (
          <div className="space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-400" />
                AI Safe Corridor Navigation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Route safety comparison considering blackspot density, live weather hazards, and road illumination.
              </p>
            </div>

            {/* Route Cards */}
            <div className="space-y-3">
              {SAMPLE_ROUTES.map((route) => {
                const isSelected = selectedRouteId === route.id;
                return (
                  <div
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? route.isAiRecommended
                          ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10'
                          : 'bg-slate-900 border-red-500 shadow-lg shadow-red-500/10'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    {route.isAiRecommended && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-bl-lg">
                        ✨ AI RECOMMENDED SAFE
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-bold text-slate-100">{route.name}</h4>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Distance</span>
                        <strong className="text-slate-200">{route.distanceKm} km</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">ETA</span>
                        <strong className="text-slate-200">{route.durationMins} mins</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">Safety Score</span>
                        <strong className={route.safetyScore >= 80 ? 'text-emerald-400' : 'text-red-400'}>
                          {route.safetyScore}/100
                        </strong>
                      </div>
                    </div>

                    {/* Warnings List */}
                    <div className="space-y-1">
                      {route.warnings.map((w, idx) => (
                        <div key={idx} className="text-[10px] text-slate-400 flex items-start gap-1">
                          <span className="text-amber-400 mt-0.5">•</span>
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: EMERGENCY SOS */}
        {activeTab === 'SOS' && (
          <div className="space-y-4 text-center">
            <div className="bg-red-950/40 border border-red-600/40 rounded-2xl p-4">
              <h3 className="text-sm font-bold text-red-400 flex items-center justify-center gap-1.5">
                <Flame className="w-4 h-4" />
                Emergency Collision / Medical SOS
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                One-tap direct link to National Highway Helpline 1033, Police 112, and Emergency Ambulance 108.
              </p>
            </div>

            {/* Giant SOS Trigger Button */}
            <div className="py-6 flex flex-col items-center justify-center">
              <button
                onClick={() => setSosActive(!sosActive)}
                className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
                  sosActive
                    ? 'bg-red-600 text-white animate-ping'
                    : 'bg-gradient-to-tr from-red-600 via-rose-600 to-orange-600 text-white hover:scale-105 shadow-red-600/40'
                }`}
              >
                <PhoneCall className="w-8 h-8 mb-1" />
                <span className="text-sm font-black uppercase">
                  {sosActive ? 'DISPATCHING' : 'SOS 112'}
                </span>
              </button>

              {sosActive ? (
                <div className="mt-4 p-3 rounded-xl bg-red-950 border border-red-500 text-xs text-red-200">
                  🚨 Highway Patrol PCR #14 & Ambulance dispatched to your GPS coordinates (28.5445° N, 77.1260° E). ETA: 4 mins.
                </div>
              ) : (
                <span className="text-xs text-slate-400 mt-3 font-medium">
                  Tap to broadcast crash location to nearest PCR unit
                </span>
              )}
            </div>

            {/* Direct Dial Helplines */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left">
                <div className="font-bold text-amber-400">1033</div>
                <div className="text-[10px] text-slate-400">NHAI Highway Emergency</div>
              </div>
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left">
                <div className="font-bold text-blue-400">108</div>
                <div className="text-[10px] text-slate-400">Ambulance & Trauma Care</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Phone Tab Navigation Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-1.5 grid grid-cols-5 gap-1 text-[10px] font-semibold text-slate-400">
        <button
          onClick={() => setActiveTab('RADAR')}
          className={`py-2 rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
            activeTab === 'RADAR' ? 'bg-slate-800 text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Radio className="w-4 h-4 mb-0.5" />
          <span>Radar</span>
        </button>

        <button
          onClick={() => setActiveTab('VOICE')}
          className={`py-2 rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
            activeTab === 'VOICE' ? 'bg-slate-800 text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Mic className="w-4 h-4 mb-0.5" />
          <span>Voice</span>
        </button>

        <button
          onClick={() => setActiveTab('REPORT')}
          className={`py-2 rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
            activeTab === 'REPORT' ? 'bg-slate-800 text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Camera className="w-4 h-4 mb-0.5" />
          <span>Report</span>
        </button>

        <button
          onClick={() => setActiveTab('ROUTES')}
          className={`py-2 rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
            activeTab === 'ROUTES' ? 'bg-slate-800 text-amber-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          <Navigation className="w-4 h-4 mb-0.5" />
          <span>Routes</span>
        </button>

        <button
          onClick={() => setActiveTab('SOS')}
          className={`py-2 rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
            activeTab === 'SOS' ? 'bg-red-950 text-red-400 font-bold' : 'hover:text-red-300'
          }`}
        >
          <Flame className="w-4 h-4 mb-0.5" />
          <span>SOS</span>
        </button>
      </div>
    </div>
  );
};
