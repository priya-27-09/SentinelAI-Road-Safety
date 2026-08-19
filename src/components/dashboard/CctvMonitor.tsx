import React, { useState } from 'react';
import {
  Camera,
  Scan,
  AlertTriangle,
  Radio,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { CCTVFeed } from '../../types';

interface CctvMonitorProps {
  cctvFeeds: CCTVFeed[];
}

export const CctvMonitor: React.FC<CctvMonitorProps> = ({ cctvFeeds }) => {
  const [selectedCam, setSelectedCam] = useState<CCTVFeed>(cctvFeeds[0] || {} as CCTVFeed);
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visionAnalysis, setVisionAnalysis] = useState<any>(null);
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);

  // Trigger Gemini AI Vision analysis on camera frame
  const handleAnalyzeFrame = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-cctv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cctvId: selectedCam.id,
          cameraName: selectedCam.cameraName,
          locationName: selectedCam.junction
        })
      });
      const data = await res.json();
      setVisionAnalysis(data.analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl mb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Computer Vision CCTV Highway Surveillance</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                Edge AI Active
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Automated real-time anomaly detection for potholes, wrong-side driving, waterlogging, and pedestrian hazards.
            </p>
          </div>
        </div>

        {/* AI & Stream Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAiBoxes(!showAiBoxes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
              showAiBoxes
                ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>AI Bounding Boxes: {showAiBoxes ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleAnalyzeFrame}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing Frame...' : 'Gemini Vision Audit'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Main Active CCTV Feed with AI Bounding Box Overlays (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group">
            {/* Live Camera Image */}
            <img
              src={selectedCam.imageUrl || 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80'}
              alt={selectedCam.cameraName}
              className="w-full h-full object-cover"
            />

            {/* Tactical Grid Scanlines */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none opacity-50"></div>

            {/* Top HUD Stats Overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-slate-200 text-xs flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="font-mono font-bold">{selectedCam.cameraName}</span>
                <span className="text-slate-400 text-[10px]">• {selectedCam.junction}</span>
              </div>

              <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-slate-200 text-xs flex items-center gap-3">
                <span className="text-[11px] font-mono">
                  Density: <strong className="text-amber-400">{selectedCam.vehicleCountPerMin} veh/m</strong>
                </span>
                <span className="text-[11px] font-mono">
                  Speed: <strong className="text-blue-400">{selectedCam.avgSpeedKmph} km/h</strong>
                </span>
              </div>
            </div>

            {/* Dynamic AI Computer Vision Bounding Boxes */}
            {showAiBoxes && selectedCam.activeDetections?.map((detection, idx) => {
              const isPothole = detection.type === 'POTHOLE';
              const isWrongSide = detection.type === 'WRONG_SIDE';
              const isSpeeding = detection.type === 'SPEED_VIOLATION';
              const isWater = detection.type === 'WATERLOGGING';

              const boxColor = isWrongSide
                ? 'border-red-500 bg-red-500/20 text-red-300'
                : isPothole
                ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                : isWater
                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                : 'border-purple-500 bg-purple-500/20 text-purple-300';

              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${detection.box.x}%`,
                    top: `${detection.box.y}%`,
                    width: `${detection.box.width}%`,
                    height: `${detection.box.height}%`
                  }}
                  className={`border-2 rounded transition-all duration-300 ${boxColor} shadow-lg flex flex-col justify-between p-1`}
                >
                  <div className="flex items-center justify-between text-[9px] font-mono font-bold bg-slate-950/90 px-1 py-0.5 rounded border border-current w-max">
                    <span>{detection.type.replace(/_/g, ' ')}</span>
                    <span className="ml-1 text-emerald-400">{Math.round(detection.confidence * 100)}%</span>
                  </div>
                  <span className="text-[8px] bg-slate-950/80 text-slate-200 px-1 rounded truncate">
                    {detection.description}
                  </span>
                </div>
              );
            })}

            {/* Bottom Timestamp & Alert Ticker */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-slate-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60">
              <span className="font-mono text-slate-400">
                FRAME LATENCY: <strong className="text-emerald-400 font-bold">18ms</strong> | MODEL: YOLOv11 + Gemini 3.7
              </span>
              <span className="text-amber-300 font-semibold">
                ⚠️ {selectedCam.activeDetections?.length || 0} Road Hazards Tracked in Frame
              </span>
            </div>
          </div>

          {/* Camera Selector Thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cctvFeeds.map((cam) => {
              const isSelected = selectedCam.id === cam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => {
                    setSelectedCam(cam);
                    setVisionAnalysis(null);
                  }}
                  className={`p-2 rounded-xl text-left border transition relative overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {cam.cameraName.split('-')[1]}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cam.status === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                    ></span>
                  </div>
                  <div className="text-xs font-bold text-slate-200 truncate">{cam.city}</div>
                  <div className="text-[10px] text-slate-400 truncate">{cam.junction}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Computer Vision Anomaly Feed & Police Dispatch (4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Real-time Detection Event Log */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                Live Vision Telemetry
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Risk Index: <strong className="text-amber-400">{selectedCam.currentRiskIndex}/100</strong>
              </span>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {selectedCam.activeDetections?.map((det, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{det.type.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] font-mono text-amber-400">{det.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{det.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Live Vision Audit Result */}
          {visionAnalysis ? (
            <div className="bg-slate-950/90 border border-blue-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs font-bold text-blue-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Traffic Police Advisory
                </span>
                <span className="text-[10px] text-slate-400">Gemini 3.7 Vision</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {visionAnalysis.trafficPoliceAdvisory}
              </p>
              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-800">
                <span>Status: <strong className="text-red-400">{visionAnalysis.status}</strong></span>
                <span>Anomalies Detected: <strong className="text-amber-400">{visionAnalysis.detectedHazardsCount}</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 text-center text-xs text-slate-400 space-y-1.5">
              <Sparkles className="w-5 h-5 text-amber-400 mx-auto opacity-70" />
              <p className="font-medium text-slate-300">Automated Camera AI Audit</p>
              <p className="text-[11px]">
                Click &quot;Gemini Vision Audit&quot; to synthesize instant traffic police advisory and dispatch recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
