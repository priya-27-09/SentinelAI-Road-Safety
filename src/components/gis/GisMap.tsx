import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  AlertOctagon,
  Eye,
  Camera,
  Activity,
  Navigation,
  Compass,
  Zap,
  Info,
  Maximize2,
  Wrench
} from 'lucide-react';
import { BlackSpot, AccidentRecord, HazardReport, CCTVFeed, RouteOption } from '../../types';

interface GisMapProps {
  blackSpots: BlackSpot[];
  accidents: AccidentRecord[];
  hazards: HazardReport[];
  cctvFeeds: CCTVFeed[];
  selectedCity: string;
  selectedRoute?: RouteOption;
  onSelectBlackSpot?: (spot: BlackSpot) => void;
  onSelectHazard?: (hazard: HazardReport) => void;
  onRequestRepair?: (spotId?: string, hazardId?: string) => void;
}

const CITY_COORDS: Record<string, [number, number, number]> = {
  'All India Corridors': [20.5937, 78.9629, 5],
  'New Delhi': [28.5445, 77.1260, 12],
  'Bengaluru': [12.9276, 77.6338, 12],
  'Mumbai / Khandala': [18.7562, 73.3768, 12],
  'Hyderabad': [17.4399, 78.3489, 12],
  'Chennai': [13.0067, 80.2033, 12],
  'Mathura / Yamuna Exp': [27.6521, 77.6890, 11]
};

export const GisMap: React.FC<GisMapProps> = ({
  blackSpots,
  accidents,
  hazards,
  cctvFeeds,
  selectedCity,
  selectedRoute,
  onSelectBlackSpot,
  onSelectHazard,
  onRequestRepair
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    blackSpotsLayer: L.LayerGroup;
    accidentsLayer: L.LayerGroup;
    hazardsLayer: L.LayerGroup;
    cctvLayer: L.LayerGroup;
    routeLayer: L.LayerGroup;
  } | null>(null);

  // Layer toggles
  const [showBlackSpots, setShowBlackSpots] = useState(true);
  const [showAccidents, setShowAccidents] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [showCctv, setShowCctv] = useState(true);
  const [showRoute, setShowRoute] = useState(true);
  const [activeLayerFilter, setActiveLayerFilter] = useState<'ALL' | 'CRITICAL_ONLY'>('ALL');

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [28.5445, 77.1260],
        zoom: 11,
        zoomControl: true,
        attributionControl: false
      });

      // Dark tactical carto tiles for intelligence aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      const blackSpotsLayer = L.layerGroup().addTo(map);
      const accidentsLayer = L.layerGroup().addTo(map);
      const hazardsLayer = L.layerGroup().addTo(map);
      const cctvLayer = L.layerGroup().addTo(map);
      const routeLayer = L.layerGroup().addTo(map);

      layersRef.current = {
        blackSpotsLayer,
        accidentsLayer,
        hazardsLayer,
        cctvLayer,
        routeLayer
      };

      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map alive during session unless unmounted completely
    };
  }, []);

  // Update center when city selection changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const target = CITY_COORDS[selectedCity] || CITY_COORDS['All India Corridors'];
    mapInstanceRef.current.flyTo([target[0], target[1]], target[2], {
      duration: 1.2
    });
  }, [selectedCity]);

  // Render & Update GIS Layers
  useEffect(() => {
    if (!mapInstanceRef.current || !layersRef.current) return;
    const { blackSpotsLayer, accidentsLayer, hazardsLayer, cctvLayer, routeLayer } = layersRef.current;

    // 1. Black Spots Layer
    blackSpotsLayer.clearLayers();
    if (showBlackSpots) {
      blackSpots.forEach((spot) => {
        if (activeLayerFilter === 'CRITICAL_ONLY' && spot.riskGrade !== 'CRITICAL') return;

        const color = spot.riskScore >= 90 ? '#ef4444' : spot.riskScore >= 75 ? '#f97316' : '#eab308';

        // Danger zone radius circle
        const circle = L.circle([spot.lat, spot.lng], {
          radius: spot.radiusMeters,
          color: color,
          weight: 2,
          fillColor: color,
          fillOpacity: 0.25,
          dashArray: spot.riskGrade === 'CRITICAL' ? '4, 4' : undefined
        });

        // Pulsing HTML Marker
        const icon = L.divIcon({
          className: 'custom-blackspot-icon',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
              <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: ${color}; opacity: 0.4; animation: pulse-glow 2s infinite;"></div>
              <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #0f172a; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color};">
                <span style="color: ${color}; font-size: 10px; font-weight: 800;">${spot.riskScore}</span>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([spot.lat, spot.lng], { icon });

        // Interactive Popup
        const popupContent = `
          <div style="padding: 10px; max-width: 280px; font-family: sans-serif;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 9px; font-weight: 800; background: ${color}22; color: ${color}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${color}44;">
                ${spot.riskGrade} BLACK SPOT
              </span>
              <span style="font-size: 10px; color: #94a3b8;">${spot.code}</span>
            </div>
            <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: 700; color: #f8fafc;">${spot.name}</h4>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #cbd5e1;">${spot.corridor}, ${spot.city}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px; background: #1e293b; padding: 6px; border-radius: 6px; font-size: 10px;">
              <div>
                <div style="color: #94a3b8;">Risk Score</div>
                <div style="font-weight: 800; color: ${color}; font-size: 12px;">${spot.riskScore} / 100</div>
              </div>
              <div>
                <div style="color: #94a3b8;">3-Yr Fatalities</div>
                <div style="font-weight: 800; color: #ef4444; font-size: 12px;">${spot.fatalities3Yr} Deaths (${spot.historicalAccidentsCount} crashes)</div>
              </div>
            </div>

            <div style="margin-bottom: 8px;">
              <div style="font-size: 10px; color: #fbbf24; font-weight: 600; margin-bottom: 2px;">Primary ML Risk Factor:</div>
              <div style="font-size: 10px; color: #e2e8f0; line-height: 1.3;">${spot.mlModel.topRiskFactors[0]?.factor || 'High Speed Variance'}</div>
            </div>

            <div style="display: flex; gap: 6px; margin-top: 8px;">
              <button id="btn-inspect-${spot.id}" style="flex: 1; background: #f59e0b; color: #020617; border: none; padding: 5px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; cursor: pointer;">
                Inspect AI Model
              </button>
              <button id="btn-repair-${spot.id}" style="background: #334155; color: #f8fafc; border: 1px solid #475569; padding: 5px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; cursor: pointer;">
                Dispatch PWD
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          document.getElementById(`btn-inspect-${spot.id}`)?.addEventListener('click', () => {
            onSelectBlackSpot?.(spot);
          });
          document.getElementById(`btn-repair-${spot.id}`)?.addEventListener('click', () => {
            onRequestRepair?.(spot.id);
          });
        });

        blackSpotsLayer.addLayer(circle);
        blackSpotsLayer.addLayer(marker);
      });
    }

    // 2. Accidents Layer
    accidentsLayer.clearLayers();
    if (showAccidents) {
      accidents.forEach((acc) => {
        const accColor = acc.severity === 'FATAL' ? '#dc2626' : acc.severity === 'GREVIOUS' ? '#ea580c' : '#ca8a04';
        
        const marker = L.circleMarker([acc.lat, acc.lng], {
          radius: acc.severity === 'FATAL' ? 7 : 5,
          color: accColor,
          weight: 1.5,
          fillColor: accColor,
          fillOpacity: 0.85
        });

        marker.bindPopup(`
          <div style="padding: 8px; font-family: sans-serif; font-size: 11px;">
            <div style="font-weight: 700; color: ${accColor}; margin-bottom: 2px;">
              💥 ${acc.severity} ACCIDENT RECORD
            </div>
            <div style="font-weight: 600; color: #f8fafc; margin-bottom: 4px;">${acc.title}</div>
            <div style="color: #94a3b8; margin-bottom: 4px;">${acc.locationName} (${acc.date})</div>
            <div style="background: #1e293b; padding: 4px; border-radius: 4px; margin-bottom: 4px; color: #e2e8f0;">
              <strong>Cause:</strong> ${acc.primaryCause.replace(/_/g, ' ')} | <strong>Weather:</strong> ${acc.weather}
            </div>
            <div style="color: #cbd5e1; font-size: 10px;">${acc.description}</div>
          </div>
        `);

        accidentsLayer.addLayer(marker);
      });
    }

    // 3. Citizen Hazards Layer
    hazardsLayer.clearLayers();
    if (showHazards) {
      hazards.forEach((hz) => {
        const hzIcon = L.divIcon({
          className: 'hazard-marker',
          html: `
            <div style="background: #e11d48; color: white; width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.5); border: 1.5px solid #ffe4e6; font-size: 12px;">
              ⚠️
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([hz.lat, hz.lng], { icon: hzIcon });
        marker.bindPopup(`
          <div style="padding: 8px; font-family: sans-serif; font-size: 11px; max-width: 240px;">
            <span style="background: #e11d48; color: white; font-size: 9px; font-weight: 700; padding: 2px 5px; border-radius: 3px;">
              ${hz.type} HAZARD
            </span>
            <div style="font-weight: 700; color: #f8fafc; margin-top: 4px;">${hz.title}</div>
            <div style="color: #94a3b8; font-size: 10px;">${hz.address} (${hz.timestamp})</div>
            <p style="margin: 4px 0; color: #e2e8f0; font-size: 10px;">${hz.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 10px;">
              <span style="color: #38bdf8;">👍 ${hz.upvotes} Driver Confirmations</span>
              <span style="color: #a7f3d0;">AI Confidence: ${(hz.aiVerificationDetails?.confidence || 0.95) * 100}%</span>
            </div>
          </div>
        `);

        hazardsLayer.addLayer(marker);
      });
    }

    // 4. CCTV Cameras Layer
    cctvLayer.clearLayers();
    if (showCctv) {
      cctvFeeds.forEach((cam) => {
        const camIcon = L.divIcon({
          className: 'cctv-marker',
          html: `
            <div style="background: ${cam.status === 'WARNING' ? '#f59e0b' : '#3b82f6'}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 8px rgba(59, 130, 246, 0.6); border: 2px solid white;">
              📹
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([cam.lat, cam.lng], { icon: camIcon });
        marker.bindPopup(`
          <div style="padding: 8px; font-family: sans-serif; font-size: 11px;">
            <div style="font-weight: 700; color: #38bdf8;">${cam.cameraName}</div>
            <div style="color: #cbd5e1; font-size: 10px;">${cam.junction}, ${cam.city}</div>
            <div style="margin-top: 4px; font-size: 10px; color: #94a3b8;">
              Live Detections: <strong style="color: #f59e0b;">${cam.activeDetections.length} Anomaly items</strong>
            </div>
          </div>
        `);

        cctvLayer.addLayer(marker);
      });
    }

    // 5. Route Waypoints Layer
    routeLayer.clearLayers();
    if (showRoute && selectedRoute && selectedRoute.waypoints.length > 0) {
      const polyline = L.polyline(selectedRoute.waypoints, {
        color: selectedRoute.isAiRecommended ? '#10b981' : '#ef4444',
        weight: 4,
        opacity: 0.8,
        dashArray: selectedRoute.isAiRecommended ? undefined : '6, 6'
      });

      routeLayer.addLayer(polyline);
    }
  }, [
    blackSpots,
    accidents,
    hazards,
    cctvFeeds,
    showBlackSpots,
    showAccidents,
    showHazards,
    showCctv,
    showRoute,
    activeLayerFilter,
    selectedRoute
  ]);

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[560px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Layer Controls */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl max-w-xs text-xs">
        <div className="flex items-center justify-between font-bold text-slate-200 mb-2 pb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>GIS Intelligence Layers</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {blackSpots.length} Blackspots
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-1 rounded">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
              Predicted Black Spots
            </span>
            <input
              type="checkbox"
              checked={showBlackSpots}
              onChange={(e) => setShowBlackSpots(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-1 rounded">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              Historical Crash Records
            </span>
            <input
              type="checkbox"
              checked={showAccidents}
              onChange={(e) => setShowAccidents(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-1 rounded">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Live Citizen Hazards
            </span>
            <input
              type="checkbox"
              checked={showHazards}
              onChange={(e) => setShowHazards(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer hover:bg-slate-800/50 p-1 rounded">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              CCTV Surveillance Nodes
            </span>
            <input
              type="checkbox"
              checked={showCctv}
              onChange={(e) => setShowCctv(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Filter Pill */}
        <div className="mt-2 pt-2 border-t border-slate-800 flex gap-1.5">
          <button
            onClick={() => setActiveLayerFilter('ALL')}
            className={`flex-1 py-1 rounded text-[10px] font-semibold transition ${
              activeLayerFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Spots
          </button>
          <button
            onClick={() => setActiveLayerFilter('CRITICAL_ONLY')}
            className={`flex-1 py-1 rounded text-[10px] font-semibold transition ${
              activeLayerFilter === 'CRITICAL_ONLY'
                ? 'bg-red-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Critical Only
          </button>
        </div>
      </div>

      {/* Floating Legend / Quick Stats */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-xl text-[11px] text-slate-300 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>Risk &gt; 90: <strong className="text-red-400">Critical</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span>
          <span>Risk 75-89: <strong className="text-orange-400">High</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span>Risk &lt; 75: <strong className="text-yellow-400">Moderate</strong></span>
        </div>
      </div>
    </div>
  );
};
