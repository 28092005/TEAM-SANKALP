import React from 'react';
import {
  Calendar,
  Filter,
  DollarSign,
  ShoppingCart,
  Package,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SALES_BY_CATEGORY_SUMMARY } from '../../data/syntheticData';
import { STANDARD_DATE_RANGES } from '../../data/metadata';

export const SalesReport: React.FC = () => {
  const { filters, updateFilter, resetFilters, monthlyTrend, orders, submitUserPrompt } = useApp();

  const totalSalesCr = monthlyTrend.reduce((acc, m) => acc + m.revenueCr, 0).toFixed(1);
  const totalOrdersCount = orders.length;

  const handleApply = () => {
    submitUserPrompt(`Analyze sales report with region ${filters.region} and category ${filters.category}`);
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sales Report</h1>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                FY 2025–2026
              </span>
            </div>
            <p className="text-xs text-slate-500">Financial revenue breakdown, category volume, and return audits</p>
            <div className="mt-1 flex items-center space-x-1.5 text-[11px] text-blue-700 bg-blue-50/60 border border-blue-200/50 rounded px-2 py-0.5 w-fit">
              <Info className="w-3 h-3 text-blue-600 shrink-0" />
              <span>Quarters: Q1 (Jan–Mar), Q2 (Apr–Jun), Q3 (Jul–Sep '26 Festival Peak), Q4 (Oct–Dec).</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400">Deep link state:</span>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              ?region={filters.region.toLowerCase().replace(' ', '_')}&cat={filters.category.toLowerCase()}
            </span>
          </div>
        </div>

        {/* Filter controls row matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          {/* Region */}
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

          {/* Product Category */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Product Category</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All Categories">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Home & Office">Home & Office</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Processing">Processing</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Date Range</label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <select
                value={filters.dateRange}
                onChange={(e) => updateFilter('dateRange', e.target.value)}
                className="bg-transparent text-xs text-slate-800 focus:outline-none cursor-pointer w-full"
              >
                {STANDARD_DATE_RANGES.map((rng) => (
                  <option key={rng} value={rng}>
                    {rng}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Apply and Reset buttons */}
          <div className="flex items-end space-x-1.5">
            <button
              onClick={handleApply}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2 px-2.5 rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
            <button
              onClick={resetFilters}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs py-2 px-2 rounded-lg border border-slate-200 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Total Sales</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹ {totalSalesCr} Cr</p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">Target: 104.2% achieved</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Total Orders</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalOrdersCount.toLocaleString('en-IN')}</p>
          <div className="mt-2 text-[11px] text-blue-600 font-medium">92.8% fulfilled on-time</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Units Sold</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">24,350</p>
          <div className="mt-2 text-[11px] text-indigo-600 font-medium">+18.4% YoY volume</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Return Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">2.4%</p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">Below industry benchmark (3.5%)</div>
        </div>
      </div>

      {/* Monthly Sales Dual Chart (Revenue & Orders) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Monthly Sales Progression</h2>
            <p className="text-[11px] text-slate-500">Revenue (₹ Cr) vs Order Volume (Units)</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center space-x-1.5 text-blue-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Revenue (₹ Cr)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-pink-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span>Orders</span>
            </span>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="h-56 w-full pt-2">
          <svg className="w-full h-full" viewBox="0 0 650 180">
            {/* Grid */}
            <line x1="0" y1="30" x2="650" y2="30" stroke="#f1f5f9" strokeDasharray="3" />
            <line x1="0" y1="80" x2="650" y2="80" stroke="#f1f5f9" strokeDasharray="3" />
            <line x1="0" y1="130" x2="650" y2="130" stroke="#f1f5f9" strokeDasharray="3" />
            <line x1="0" y1="160" x2="650" y2="160" stroke="#e2e8f0" />

            {/* Bars for Orders */}
            {monthlyTrend.map((m, i) => {
              const x = 30 + i * (600 / 12);
              const barH = (m.orders / 1200) * 110;
              const y = 160 - barH;
              return (
                <g key={i}>
                  <rect x={x} y={y} width="16" height={barH} fill="#fce7f3" rx="2" />
                  <rect x={x + 3} y={y} width="10" height={barH} fill="#f43f5e" rx="2" opacity="0.8" />
                  <text x={x + 8} y="174" fontSize="9" fill="#64748b" textAnchor="middle">{m.month}</text>
                </g>
              );
            })}

            {/* Line for Revenue */}
            {(() => {
              const points = monthlyTrend.map((m, i) => {
                const x = 38 + i * (600 / 12);
                const y = 160 - (m.revenueCr / 2.0) * 125;
                return { x, y };
              });
              const linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(' ');
              return (
                <g>
                  <path d={linePath} fill="none" stroke="#2563eb" strokeWidth="2.5" />
                  {points.map((p, idx) => (
                    <circle key={idx} cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
                  ))}
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Sales by Category Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Sales by Category</h2>
          <button
            onClick={() => submitUserPrompt('What is our return rate in accessories?')}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Ask Agent to audit categories</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Product Category</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">Units Sold</th>
                <th className="py-2.5 px-3 text-right">Return Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SALES_BY_CATEGORY_SUMMARY.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">{row.category}</td>
                  <td className="py-3 px-3 text-right font-medium text-slate-900">{row.revenue}</td>
                  <td className="py-3 px-3 text-right text-slate-600">{row.unitsSold.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {row.returnRate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
