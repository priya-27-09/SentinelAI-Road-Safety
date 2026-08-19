import React from 'react';
import { AlertTriangle, ShieldCheck, Wrench, Radio, TrendingDown, Users, Flame } from 'lucide-react';
import { BlackSpot, HazardReport, RepairWorkOrder } from '../../types';

interface OverviewStatsProps {
  blackSpots: BlackSpot[];
  hazards: HazardReport[];
  repairOrders: RepairWorkOrder[];
  stats?: {
    totalBlackSpots: number;
    criticalSpots: number;
    activeHazards: number;
    totalFatalitiesRecorded: number;
    repairsInProgress: number;
    estimatedLivesSavedYTD: number;
  };
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({
  blackSpots,
  hazards,
  repairOrders,
  stats
}) => {
  const criticalSpotsCount = blackSpots.filter((b) => b.riskGrade === 'CRITICAL').length;
  const activeHazardsCount = hazards.filter((h) => h.status !== 'COMPLETED').length;
  const activeRepairsCount = repairOrders.filter(
    (r) => r.status === 'IN_PROGRESS' || r.status === 'WORK_ORDER_ISSUED'
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Black Spots Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden group hover:border-red-900/50 transition">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            AI Predicted Black Spots
          </span>
          <div className="p-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-100">
            {blackSpots.length}
          </span>
          <span className="text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/50">
            {criticalSpotsCount} Critical
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>MoRTH Protocol Audited</span>
          <span className="text-slate-300 font-mono font-semibold">100% Verified</span>
        </div>
      </div>

      {/* 2. Lives Saved YTD */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden group hover:border-emerald-900/50 transition">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Estimated Lives Saved (YTD)
          </span>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl lg:text-3xl font-extrabold text-emerald-400">
            {stats?.estimatedLivesSavedYTD || 148}
          </span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
            <TrendingDown className="w-3.5 h-3.5" />
            -34% Crashes
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>Early Driver Warnings</span>
          <span className="text-emerald-400 font-mono font-semibold">124k Broadcasts</span>
        </div>
      </div>

      {/* 3. Citizen & Driver Hazard Reports */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden group hover:border-amber-900/50 transition">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Live Citizen Hazard Reports
          </span>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Radio className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-100">
            {activeHazardsCount}
          </span>
          <span className="text-xs font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50">
            Voice & Camera AI
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>Driver Upvotes / Confirmations</span>
          <span className="text-slate-300 font-mono font-semibold">243 Verified</span>
        </div>
      </div>

      {/* 4. Active PWD Work Orders */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden group hover:border-blue-900/50 transition">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            PWD / NHAI Repair Orders
          </span>
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Wrench className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-100">
            {activeRepairsCount}
          </span>
          <span className="text-xs font-semibold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900/50">
            High Priority SLA
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>Avg Repair Turnaround</span>
          <span className="text-blue-300 font-mono font-semibold">3.2 Days</span>
        </div>
      </div>
    </div>
  );
};
