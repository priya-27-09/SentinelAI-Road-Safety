import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { GisMap } from './components/gis/GisMap';
import { OverviewStats } from './components/dashboard/OverviewStats';
import { BlackSpotPredictor } from './components/dashboard/BlackSpotPredictor';
import { TrafficAnalytics } from './components/dashboard/TrafficAnalytics';
import { CctvMonitor } from './components/dashboard/CctvMonitor';
import { RepairPriorityBoard } from './components/dashboard/RepairPriorityBoard';
import { MobileAppView } from './components/mobile/MobileAppView';
import {
  INITIAL_BLACK_SPOTS,
  INITIAL_ACCIDENTS,
  INITIAL_HAZARDS,
  INITIAL_CCTV_FEEDS,
  INITIAL_REPAIR_ORDERS,
  SAMPLE_ROUTES
} from './data/mockData';
import {
  BlackSpot,
  AccidentRecord,
  HazardReport,
  CCTVFeed,
  RepairWorkOrder,
  RouteOption,
  RepairStatus
} from './types';
import {
  Shield,
  Layers,
  BrainCircuit,
  BarChart3,
  Camera,
  Wrench,
  Smartphone,
  LayoutDashboard,
  Columns,
  RefreshCw,
  AlertOctagon,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = useState<'dashboard' | 'mobile'>('dashboard');
  const [selectedCity, setSelectedCity] = useState<string>('All India Corridors');
  const [dashboardTab, setDashboardTab] = useState<'MAP' | 'PREDICTOR' | 'ANALYTICS' | 'CCTV' | 'REPAIRS'>('MAP');

  // Core Data Stores
  const [blackSpots, setBlackSpots] = useState<BlackSpot[]>(INITIAL_BLACK_SPOTS);
  const [accidents, setAccidents] = useState<AccidentRecord[]>(INITIAL_ACCIDENTS);
  const [hazards, setHazards] = useState<HazardReport[]>(INITIAL_HAZARDS);
  const [cctvFeeds, setCctvFeeds] = useState<CCTVFeed[]>(INITIAL_CCTV_FEEDS);
  const [repairOrders, setRepairOrders] = useState<RepairWorkOrder[]>(INITIAL_REPAIR_ORDERS);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>(SAMPLE_ROUTES[1]);
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [modalContent, setModalContent] = useState<any>(null);

  // Fetch initial data from server
  const fetchOverviewData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/data/overview');
      if (res.ok) {
        const data = await res.json();
        if (data.blackSpots) setBlackSpots(data.blackSpots);
        if (data.accidents) setAccidents(data.accidents);
        if (data.hazards) setHazards(data.hazards);
        if (data.cctvFeeds) setCctvFeeds(data.cctvFeeds);
        if (data.repairOrders) setRepairOrders(data.repairOrders);
        if (data.stats) setStatsData(data.stats);
      }
    } catch (e) {
      console.warn('Using local state cache', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  // Filtered lists based on city corridor selection
  const filteredBlackSpots = blackSpots.filter((b) => {
    if (selectedCity === 'All India Corridors') return true;
    return b.city.toLowerCase().includes(selectedCity.toLowerCase()) || b.corridor.toLowerCase().includes(selectedCity.toLowerCase());
  });

  const filteredAccidents = accidents.filter((a) => {
    if (selectedCity === 'All India Corridors') return true;
    return a.city.toLowerCase().includes(selectedCity.toLowerCase()) || a.locationName.toLowerCase().includes(selectedCity.toLowerCase());
  });

  const filteredHazards = hazards.filter((h) => {
    if (selectedCity === 'All India Corridors') return true;
    return h.city.toLowerCase().includes(selectedCity.toLowerCase()) || h.address.toLowerCase().includes(selectedCity.toLowerCase());
  });

  const filteredCctv = cctvFeeds.filter((c) => {
    if (selectedCity === 'All India Corridors') return true;
    return c.city.toLowerCase().includes(selectedCity.toLowerCase()) || c.junction.toLowerCase().includes(selectedCity.toLowerCase());
  });

  // Handle citizen hazard submission
  const handleReportHazard = async (newHz: Partial<HazardReport>) => {
    try {
      const res = await fetch('/api/hazards/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHz)
      });
      if (res.ok) {
        const data = await res.json();
        setHazards((prev) => [data.hazard, ...prev]);
      } else {
        const localHazard: HazardReport = {
          id: `hz-${Date.now().toString().slice(-4)}`,
          title: newHz.title || 'Road Hazard Reported',
          type: newHz.type || 'POTHOLE',
          description: newHz.description || '',
          lat: newHz.lat || 28.5445,
          lng: newHz.lng || 77.1260,
          address: newHz.address || 'Highway Corridor',
          city: selectedCity === 'All India Corridors' ? 'Delhi NCR' : selectedCity,
          timestamp: 'Just now',
          reportedBy: 'Citizen Reporter',
          reporterType: newHz.reporterType || 'QUICK_TAP',
          imageUrl: newHz.imageUrl,
          upvotes: 1,
          verifiedByAi: true,
          status: 'PENDING_REVIEW'
        };
        setHazards((prev) => [localHazard, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle upvoting hazard
  const handleVoteHazard = async (id: string) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === id ? { ...h, upvotes: h.upvotes + 1 } : h))
    );
    try {
      await fetch('/api/hazards/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hazardId: id })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Handle PWD repair status update
  const handleUpdateRepairStatus = async (id: string, status: RepairStatus) => {
    setRepairOrders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    try {
      await fetch('/api/repairs/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workOrderId: id, status })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Handle AI Work Order Generation from Blackspot / Hazard
  const handleRequestRepair = async (spotId?: string, hazardId?: string) => {
    try {
      const res = await fetch('/api/ai/suggest-repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blackSpotId: spotId, hazardId })
      });
      const data = await res.json();
      if (data.workOrder) {
        setRepairOrders((prev) => [data.workOrder, ...prev]);
        setDashboardTab('REPAIRS');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onRefreshData={fetchOverviewData}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: AUTHORITY COMMAND CENTER DASHBOARD */}
        {activeMode === 'dashboard' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <OverviewStats
              blackSpots={filteredBlackSpots}
              hazards={filteredHazards}
              repairOrders={repairOrders}
              stats={statsData}
            />

            {/* Dashboard Sub-navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDashboardTab('MAP')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    dashboardTab === 'MAP'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>GIS Accident Map</span>
                </button>

                <button
                  onClick={() => setDashboardTab('PREDICTOR')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    dashboardTab === 'PREDICTOR'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Black Spot Predictor</span>
                </button>

                <button
                  onClick={() => setDashboardTab('ANALYTICS')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    dashboardTab === 'ANALYTICS'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Traffic Analytics</span>
                </button>

                <button
                  onClick={() => setDashboardTab('CCTV')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    dashboardTab === 'CCTV'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>CCTV Vision Room</span>
                </button>

                <button
                  onClick={() => setDashboardTab('REPAIRS')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    dashboardTab === 'REPAIRS'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>PWD Repair Dispatch</span>
                </button>
              </div>

              {/* Quick shortcut to test Mobile App */}
              <button
                onClick={() => setActiveMode('mobile')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Test Citizen App View &rarr;</span>
              </button>
            </div>

            {/* TAB CONTENT */}
            {dashboardTab === 'MAP' && (
              <div className="space-y-6">
                <GisMap
                  blackSpots={filteredBlackSpots}
                  accidents={filteredAccidents}
                  hazards={filteredHazards}
                  cctvFeeds={filteredCctv}
                  selectedCity={selectedCity}
                  selectedRoute={selectedRoute}
                  onSelectBlackSpot={(spot) => {
                    setDashboardTab('PREDICTOR');
                  }}
                  onRequestRepair={handleRequestRepair}
                />

                {/* Corridor Overview Table */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <AlertOctagon className="w-4 h-4 text-red-400" />
                      <span>MoRTH Critical Black Spot Registry ({filteredBlackSpots.length})</span>
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Standard: MoRTH 500m / 5 Fatalities in 3-Years
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                          <th className="pb-2">Code & Location</th>
                          <th className="pb-2">Corridor / Highway</th>
                          <th className="pb-2">Risk Score</th>
                          <th className="pb-2">3-Yr Casualties</th>
                          <th className="pb-2">Primary ML Contributing Factor</th>
                          <th className="pb-2">Authority</th>
                          <th className="pb-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filteredBlackSpots.map((spot) => (
                          <tr key={spot.id} className="hover:bg-slate-800/40 transition">
                            <td className="py-3 font-semibold text-slate-200">
                              <div>{spot.name}</div>
                              <span className="text-[10px] font-mono text-slate-400">{spot.code}</span>
                            </td>
                            <td className="py-3 text-slate-300">
                              {spot.corridor}, {spot.city}
                            </td>
                            <td className="py-3">
                              <span
                                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                  spot.riskScore >= 90
                                    ? 'bg-red-950 text-red-400 border border-red-800'
                                    : 'bg-orange-950 text-orange-400 border border-orange-800'
                                }`}
                              >
                                {spot.riskScore} / 100
                              </span>
                            </td>
                            <td className="py-3 text-slate-300">
                              <span className="text-red-400 font-bold">{spot.fatalities3Yr} Fatal</span> (
                              {spot.injuries3Yr} Injured)
                            </td>
                            <td className="py-3 text-slate-300 max-w-xs truncate">
                              {spot.mlModel.topRiskFactors[0]?.factor || 'High Speed Disparity'}
                            </td>
                            <td className="py-3 text-slate-400 text-[11px] truncate max-w-[150px]">
                              {spot.assignedAuthority}
                            </td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => handleRequestRepair(spot.id)}
                                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[10px] transition cursor-pointer"
                              >
                                Dispatch PWD
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {dashboardTab === 'PREDICTOR' && (
              <BlackSpotPredictor
                onAddBlackSpot={(spot) => setBlackSpots((prev) => [spot, ...prev])}
                onRequestRepairDispatch={(spot) => handleRequestRepair(spot.id)}
              />
            )}

            {dashboardTab === 'ANALYTICS' && (
              <TrafficAnalytics accidents={filteredAccidents} blackSpots={filteredBlackSpots} />
            )}

            {dashboardTab === 'CCTV' && (
              <CctvMonitor cctvFeeds={filteredCctv} />
            )}

            {dashboardTab === 'REPAIRS' && (
              <RepairPriorityBoard
                repairOrders={repairOrders}
                onUpdateStatus={handleUpdateRepairStatus}
                onGenerateNewWorkOrder={() => handleRequestRepair(blackSpots[0]?.id)}
              />
            )}
          </div>
        )}

        {/* VIEW 2: CITIZEN & DRIVER MOBILE COMPANION APP */}
        {activeMode === 'mobile' && (
          <div className="py-4">
            <div className="max-w-xl mx-auto mb-4 text-center">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-900/50 inline-block mb-2">
                📱 RakshaPath Mobile Experience
              </span>
              <h2 className="text-xl font-bold text-slate-100">
                Citizen & Driver Safety Companion
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Equipped with hands-free voice hazard reporting, live accident warnings, dangerous route alerts, and speed radar.
              </p>
            </div>

            <MobileAppView
              hazards={hazards}
              blackSpots={blackSpots}
              onReportHazard={handleReportHazard}
              onVoteHazard={handleVoteHazard}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-300">
              RoadGuard AI Platform • Ministry of Road Transport and Highways (MoRTH) Standards
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Powered by Random Forest ML &amp; Gemini 3.7 Flash Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
}
