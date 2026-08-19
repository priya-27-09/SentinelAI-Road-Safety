import React, { useState } from 'react';
import {
  Wrench,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Sparkles,
  DollarSign,
  Building,
  UserCheck,
  Filter,
  Plus
} from 'lucide-react';
import { RepairWorkOrder, RepairStatus } from '../../types';

interface RepairPriorityBoardProps {
  repairOrders: RepairWorkOrder[];
  onUpdateStatus?: (id: string, status: RepairStatus) => void;
  onGenerateNewWorkOrder?: () => void;
}

export const RepairPriorityBoard: React.FC<RepairPriorityBoardProps> = ({
  repairOrders,
  onUpdateStatus,
  onGenerateNewWorkOrder
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredOrders = repairOrders.filter((order) => {
    if (filterStatus === 'ALL') return true;
    return order.status === filterStatus;
  });

  const getStatusBadge = (status: RepairStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return { text: 'In Progress (Active Crew)', bg: 'bg-blue-950/80', textCol: 'text-blue-400', border: 'border-blue-700/50' };
      case 'WORK_ORDER_ISSUED':
        return { text: 'Work Order Issued', bg: 'bg-amber-950/80', textCol: 'text-amber-400', border: 'border-amber-700/50' };
      case 'COMPLETED':
        return { text: 'Repaired & Cleared', bg: 'bg-emerald-950/80', textCol: 'text-emerald-400', border: 'border-emerald-700/50' };
      case 'VERIFIED':
        return { text: 'MoRTH Verified', bg: 'bg-purple-950/80', textCol: 'text-purple-400', border: 'border-purple-700/50' };
      default:
        return { text: 'Pending Inspection', bg: 'bg-slate-900', textCol: 'text-slate-400', border: 'border-slate-700' };
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl mb-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>PWD & NHAI Infrastructure Repair Dispatcher</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                AI Priority Matrix
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Algorithmically prioritized work orders based on crash probability reduction, traffic volume exposure, and cost-benefit ratios.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter Chips */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'WORK_ORDER_ISSUED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition text-[11px] cursor-pointer ${
                  filterStatus === status
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {onGenerateNewWorkOrder && (
            <button
              onClick={onGenerateNewWorkOrder}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>AI Synthesize Work Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Work Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.map((order) => {
          const badge = getStatusBadge(order.status);
          const isHighPriority = order.priorityScore >= 90;

          return (
            <div
              key={order.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-lg flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              {/* Left Accent Stripe */}
              <div
                className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  isHighPriority ? 'bg-red-500' : 'bg-amber-500'
                }`}
              ></div>

              {/* Top Row: WO Number & Priority Score */}
              <div className="flex items-center justify-between pl-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-extrabold text-slate-400">
                    {order.workOrderNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.bg} ${badge.textCol} ${badge.border}`}>
                    {badge.text}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-semibold">Priority:</span>
                  <span className={`text-xs font-black font-mono ${isHighPriority ? 'text-red-400' : 'text-amber-400'}`}>
                    {order.priorityScore}/100
                  </span>
                </div>
              </div>

              {/* Title & Location */}
              <div className="pl-2">
                <h4 className="text-sm font-bold text-slate-100 leading-snug">
                  {order.title}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  📍 {order.locationName}
                </p>
              </div>

              {/* AI Notes */}
              <div className="pl-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                <span className="text-amber-400 font-bold flex items-center gap-1 mb-1">
                  <Sparkles className="w-3 h-3" />
                  AI Engineering Spec:
                </span>
                {order.aiRecommendedNotes}
              </div>

              {/* Contractor & Cost Meta */}
              <div className="pl-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-slate-900/40 p-2 rounded-xl border border-slate-800/60">
                <div>
                  <span className="text-slate-400 block text-[10px]">Est. Budget</span>
                  <strong className="text-emerald-400 font-mono">₹{order.estimatedCostInrLakhs} Lakhs</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SLA Target</span>
                  <strong className="text-amber-400 font-mono">{order.daysRemaining} Days Left</strong>
                </div>
                <div className="sm:col-span-1 col-span-2">
                  <span className="text-slate-400 block text-[10px]">Assigned Contractor</span>
                  <strong className="text-slate-200 truncate block">{order.contractor}</strong>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pl-2 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 font-mono">
                  Dept: {order.authority}
                </span>

                <div className="flex items-center gap-1.5">
                  {order.status === 'WORK_ORDER_ISSUED' && (
                    <button
                      onClick={() => onUpdateStatus?.(order.id, 'IN_PROGRESS')}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition cursor-pointer"
                    >
                      Start Repair Work
                    </button>
                  )}
                  {order.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => onUpdateStatus?.(order.id, 'COMPLETED')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition cursor-pointer"
                    >
                      Mark Completed & Verified
                    </button>
                  )}
                  {order.status === 'COMPLETED' && (
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Resolved & Safe
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
