import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  TrendingUp,
  Award,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RegionalAnalysis: React.FC = () => {
  const { regions, filters, updateFilter, submitUserPrompt } = useApp();
  const [selectedStateHover, setSelectedStateHover] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Regional Analysis</h1>
            <p className="text-xs text-slate-500">Territorial sales distribution, state penetration, and regional velocities</p>
          </div>
          <button
            onClick={() => submitUserPrompt('Show Karnataka sales for last quarter')}
            className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center space-x-1.5 w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Agent: Audit Karnataka Territory</span>
          </button>
        </div>

        {/* Filter Bar matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Region</label>
            <select
              value={filters.region}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All Regions">All Regions</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Metric</label>
            <select
              value={filters.metric || 'Revenue'}
              onChange={(e) => updateFilter('metric', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Revenue">Revenue (₹ Cr)</option>
              <option value="Orders">Order Volume</option>
              <option value="Growth">YoY Growth %</option>
              <option value="Customers">Active Accounts</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Date Range</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                value={filters.dateRange}
                onChange={(e) => updateFilter('dateRange', e.target.value)}
                className="bg-transparent text-xs text-slate-800 focus:outline-none cursor-pointer w-full"
              >
                <option value="Jan 2025 - Dec 2025">Jan 2025 - Dec 2025</option>
                <option value="Q1 2025">Q1 2025</option>
                <option value="Q2 2025">Q2 2025</option>
                <option value="Q3 2025">Q3 2025</option>
                <option value="Q4 2025">Q4 2025</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Total Regions</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">8</p>
          <div className="mt-2 text-[11px] text-slate-500">Pan-India distribution footprint</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Top Region</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">Karnataka</p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">₹ 4.0 Cr (32.0% share)</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹ 12.4 Cr</p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">+12.5% vs FY24</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Growth</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">+12.5%</p>
          <div className="mt-2 text-[11px] text-slate-500">Strongest in South & West zones</div>
        </div>
      </div>

      {/* Middle: Interactive India Map Heatmap & Regional Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SVG India Map Visualizer matching screenshot */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Regional Revenue Intensity Map</h2>
              <p className="text-[11px] text-slate-500">Interactive territory density visualization</p>
            </div>
            {selectedStateHover && (
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {selectedStateHover}
              </span>
            )}
          </div>

          <div className="relative h-64 flex items-center justify-center my-2">
            {/* Elegant SVG Cartogram Map representing India Regions */}
            <svg viewBox="0 0 320 340" className="w-full h-full max-w-[280px]">
              {/* North (Delhi / NCR) */}
              <path
                d="M130,40 L160,35 L175,65 L160,95 L135,90 L120,65 Z"
                fill="#2563eb"
                className="hover:opacity-80 cursor-pointer transition-colors"
                onMouseEnter={() => setSelectedStateHover('Delhi NCR: ₹3.0 Cr (24%)')}
                onMouseLeave={() => setSelectedStateHover(null)}
                onClick={() => updateFilter('region', 'Delhi')}
              />
              <text x="145" y="70" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Delhi</text>

              {/* West (Maharashtra) */}
              <path
                d="M90,140 L140,135 L155,180 L115,205 L80,185 L75,155 Z"
                fill="#3b82f6"
                className="hover:opacity-80 cursor-pointer transition-colors"
                onMouseEnter={() => setSelectedStateHover('Maharashtra: ₹2.2 Cr (18%)')}
                onMouseLeave={() => setSelectedStateHover(null)}
                onClick={() => updateFilter('region', 'Maharashtra')}
              />
              <text x="115" y="170" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">MH</text>

              {/* South (Karnataka) - Highest revenue dark blue */}
              <path
                d="M100,210 L140,205 L150,260 L120,285 L95,250 Z"
                fill="#1d4ed8"
                className="hover:opacity-80 cursor-pointer transition-colors"
                onMouseEnter={() => setSelectedStateHover('Karnataka: ₹4.0 Cr (32%) - Top!')}
                onMouseLeave={() => setSelectedStateHover(null)}
                onClick={() => updateFilter('region', 'Karnataka')}
              />
              <text x="120" y="248" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">KA (★)</text>

              {/* South East (Tamil Nadu) */}
              <path
                d="M145,235 L180,240 L170,295 L135,290 L140,260 Z"
                fill="#60a5fa"
                className="hover:opacity-80 cursor-pointer transition-colors"
                onMouseEnter={() => setSelectedStateHover('Tamil Nadu: ₹1.5 Cr (12%)')}
                onMouseLeave={() => setSelectedStateHover(null)}
                onClick={() => updateFilter('region', 'Tamil Nadu')}
              />
              <text x="158" y="270" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">TN</text>

              {/* East / North East / Other Regions */}
              <path
                d="M175,100 L230,105 L260,145 L220,165 L165,140 Z"
                fill="#93c5fd"
                className="hover:opacity-80 cursor-pointer transition-colors"
                onMouseEnter={() => setSelectedStateHover('East & Other States: ₹1.7 Cr (14%)')}
                onMouseLeave={() => setSelectedStateHover(null)}
                onClick={() => updateFilter('region', 'Others')}
              />
              <text x="210" y="135" fill="#1e3a8a" fontSize="9" fontWeight="bold" textAnchor="middle">East / Other</text>
            </svg>

            {/* Heatmap Legend Box matching screenshot */}
            <div className="absolute right-2 bottom-2 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-[10px] space-y-1 shadow-xs">
              <span className="font-semibold text-slate-700 block mb-1">Revenue (₹ Cr)</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-2 rounded bg-[#1d4ed8]" />
                <span className="text-slate-600">&gt; 2.0 Cr</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-2 rounded bg-[#3b82f6]" />
                <span className="text-slate-600">1.0 - 2.0 Cr</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-2 rounded bg-[#60a5fa]" />
                <span className="text-slate-600">0.5 - 1.0 Cr</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-2 rounded bg-[#93c5fd]" />
                <span className="text-slate-600">&lt; 0.5 Cr</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Click on any zone or state on the map to filter application reports
          </p>
        </div>

        {/* Regional Performance Table matching screenshot */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">Regional Performance</h2>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Top Growth: +14.2%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Product / Territory</th>
                  <th className="py-2.5 px-3 text-right">Revenue</th>
                  <th className="py-2.5 px-3 text-right">Share %</th>
                  <th className="py-2.5 px-3 text-right">Status / Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regions.map((reg, idx) => (
                  <tr
                    key={idx}
                    onClick={() => updateFilter('region', reg.region)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{reg.region}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">₹ {reg.revenueCr} Cr</td>
                    <td className="py-3 px-3 text-right text-slate-600">{reg.percentage}.0%</td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        +{reg.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-[11px] text-blue-800 flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Context Insight: </span>
              Karnataka represents our principal market cluster with 780 enterprise accounts centered around Bengaluru Tech Corridor.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
