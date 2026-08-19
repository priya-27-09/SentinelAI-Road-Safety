import React, { useState } from 'react';
import {
  BrainCircuit,
  Sliders,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  Cpu,
  ShieldAlert,
  ArrowRight,
  Send,
  HelpCircle
} from 'lucide-react';
import { BlackSpot } from '../../types';

interface BlackSpotPredictorProps {
  onAddBlackSpot?: (spot: BlackSpot) => void;
  onRequestRepairDispatch?: (spot: BlackSpot) => void;
}

export const BlackSpotPredictor: React.FC<BlackSpotPredictorProps> = ({
  onAddBlackSpot,
  onRequestRepairDispatch
}) => {
  // Input parameters for ML simulation
  const [corridorName, setCorridorName] = useState('NH-48 (Delhi-Gurugram Expressway) Kms 18.4');
  const [city, setCity] = useState('Gurugram');
  const [state, setState] = useState('Haryana');

  // Sliders
  const [trafficDensity, setTrafficDensity] = useState(82); // 0-100
  const [roadCurvature, setRoadCurvature] = useState(74); // 0-100
  const [lightingDeficiency, setLightingDeficiency] = useState(55); // 0-100
  const [surfaceDefectScore, setSurfaceDefectScore] = useState(68); // 0-100
  const [weatherSensitivity, setWeatherSensitivity] = useState(60); // 0-100
  const [speedVariance, setSpeedVariance] = useState(85); // 0-100

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  // Dynamic ML score calculation (Simulating XGBoost / Random Forest Ensemble)
  const computedRiskScore = Math.min(
    99,
    Math.round(
      trafficDensity * 0.22 +
      roadCurvature * 0.20 +
      lightingDeficiency * 0.14 +
      surfaceDefectScore * 0.18 +
      weatherSensitivity * 0.10 +
      speedVariance * 0.16
    )
  );

  const getRiskGrade = (score: number) => {
    if (score >= 85) return { text: 'CRITICAL DANGER', color: 'text-red-400', bg: 'bg-red-950/70', border: 'border-red-600' };
    if (score >= 70) return { text: 'HIGH RISK', color: 'text-orange-400', bg: 'bg-orange-950/70', border: 'border-orange-600' };
    if (score >= 50) return { text: 'MODERATE RISK', color: 'text-yellow-400', bg: 'bg-yellow-950/70', border: 'border-yellow-600' };
    return { text: 'LOW RISK', color: 'text-emerald-400', bg: 'bg-emerald-950/70', border: 'border-emerald-600' };
  };

  const riskMeta = getRiskGrade(computedRiskScore);

  // Trigger Gemini AI deep analysis
  const handleRunAiAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/ai/predict-blackspot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          corridorName,
          city,
          state,
          trafficDensity,
          roadCurvature,
          lightingDeficiency,
          surfaceDefectScore,
          weatherSensitivity,
          speedVariance
        })
      });
      const data = await res.json();
      setAuditResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl mb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Predictive Black Spot Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                XGBoost + Random Forest v2.4
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Simulate road geometry, weather, and traffic factors to predict future accident hotspots before fatal crashes occur.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAiAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-orange-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Generating MoRTH Audit...' : 'Run Gemini AI Engineering Audit'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Corridor Input & Simulation Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Highway / Corridor Segment
              </label>
              <input
                type="text"
                value={corridorName}
                onChange={(e) => setCorridorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="e.g. NH-48 Mahipalpur or Bengaluru ORR"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                placeholder="City"
              />
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Feature Weight Adjustment Matrix</span>
            </div>

            {/* Slider 1: Traffic Density */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Traffic Density & Congestion (PCU/hr)</span>
                <span className="font-mono text-amber-400 font-bold">{trafficDensity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={trafficDensity}
                onChange={(e) => setTrafficDensity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Slider 2: Road Curvature */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Road Curvature & Geometric Blindness (Radius &lt; 200m)</span>
                <span className="font-mono text-amber-400 font-bold">{roadCurvature}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={roadCurvature}
                onChange={(e) => setRoadCurvature(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Slider 3: Speed Variance */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Speed Variance & Overspeeding Disparity (&gt;80 km/h)</span>
                <span className="font-mono text-amber-400 font-bold">{speedVariance}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={speedVariance}
                onChange={(e) => setSpeedVariance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Slider 4: Pavement Defect */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Pavement Surface Distress & Pothole Index</span>
                <span className="font-mono text-amber-400 font-bold">{surfaceDefectScore}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={surfaceDefectScore}
                onChange={(e) => setSurfaceDefectScore(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Slider 5: Weather Sensitivity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Weather Sensitivity (Monsoon Runoff / Winter Fog)</span>
                <span className="font-mono text-amber-400 font-bold">{weatherSensitivity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={weatherSensitivity}
                onChange={(e) => setWeatherSensitivity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Slider 6: Lighting Deficiency */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Night Lighting Deficiency (Lux &lt; 40)</span>
                <span className="font-mono text-amber-400 font-bold">{lightingDeficiency}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={lightingDeficiency}
                onChange={(e) => setLightingDeficiency(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Live Risk Gauge & AI Engineering Diagnosis (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Live Computed Score Card */}
          <div className={`p-4 rounded-2xl border ${riskMeta.border} ${riskMeta.bg} relative overflow-hidden`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                Random Forest ML Risk Index
              </span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${riskMeta.color} bg-slate-950/80 border border-current`}>
                {riskMeta.text}
              </span>
            </div>

            <div className="flex items-baseline space-x-3 my-2">
              <span className="text-4xl lg:text-5xl font-black text-slate-100 tracking-tight">
                {computedRiskScore}
              </span>
              <span className="text-slate-400 text-sm font-semibold">/ 100 Risk Score</span>
            </div>

            <div className="w-full bg-slate-950/80 rounded-full h-2.5 overflow-hidden my-2 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-300"
                style={{ width: `${computedRiskScore}%` }}
              ></div>
            </div>

            <div className="text-[11px] text-slate-300 mt-2 flex items-center justify-between">
              <span>MoRTH 500m Blackspot Threshold:</span>
              <strong className={computedRiskScore >= 70 ? 'text-red-300' : 'text-emerald-300'}>
                {computedRiskScore >= 70 ? '⚠️ CRITERIA EXCEEDED' : 'Normal Range'}
              </strong>
            </div>
          </div>

          {/* AI Result or Trigger Preview */}
          {auditResult ? (
            <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gemini Engineering Diagnosis
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Confidence: {Math.round((auditResult.confidenceScore || 0.95) * 100)}%
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {auditResult.executiveSummary}
              </p>

              <div>
                <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Recommended IRC Countermeasures:
                </span>
                <ul className="space-y-1 text-xs text-slate-400">
                  {auditResult.recommendedInterventions?.slice(0, 3).map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Est. PWD Budget</span>
                  <strong className="text-amber-400 font-mono text-sm">
                    ₹{auditResult.estimatedCostLakhs} Lakhs
                  </strong>
                </div>
                <button
                  onClick={() => onRequestRepairDispatch?.(auditResult)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Issue PWD Work Order</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-2 text-slate-400">
              <Cpu className="w-8 h-8 text-amber-500/50 mb-1" />
              <p className="text-xs font-medium text-slate-300">
                Ready for AI Countermeasure Synthesis
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Click &quot;Run Gemini AI Engineering Audit&quot; to synthesize IRC:SP:84 compliant rumble strips, crash barriers, and budget estimates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
