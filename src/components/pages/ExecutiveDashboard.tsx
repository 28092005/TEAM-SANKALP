import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  Filter,
  Package,
  Layers,
  RotateCcw,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { EXECUTIVE_STORY_CARDS } from '../../data/syntheticData';
import { STANDARD_DATE_RANGES } from '../../data/metadata';
import { Sparkles, AlertTriangle, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

// Custom Tooltip for Monthly Revenue Area Chart
const CustomRevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const curVal = payload[0]?.value;
    const prevVal = payload[1]?.value;
    const growth = prevVal ? (((curVal - prevVal) / prevVal) * 100).toFixed(1) : null;

    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-slate-200 text-xs space-y-1 z-50">
        <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">{label} 2025</p>
        <div className="flex items-center justify-between gap-4 text-blue-600 font-semibold">
          <span>Revenue:</span>
          <span>₹ {curVal} Cr</span>
        </div>
        {prevVal !== undefined && (
          <div className="flex items-center justify-between gap-4 text-slate-500">
            <span>Last Year:</span>
            <span>₹ {prevVal} Cr</span>
          </div>
        )}
        {growth && (
          <div className="pt-1 text-[10px] text-emerald-600 font-semibold border-t border-slate-100">
            +{growth}% YoY Expansion
          </div>
        )}
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Regional Pie Chart
const CustomRegionalTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-xl border border-slate-200 text-xs space-y-1 z-50">
        <p className="font-bold text-slate-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
          <span>{data.region}</span>
        </p>
        <p className="text-slate-600">
          Share: <span className="font-bold text-slate-900">{data.percentage}%</span>
        </p>
        <p className="text-slate-600">
          Revenue: <span className="font-bold text-slate-900">₹ {data.revenueCr} Cr</span>
        </p>
        <p className="text-[10px] text-emerald-600 font-semibold">Growth: +{data.growth}%</p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Top Products & Inventory
const CustomProductTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-xl border border-slate-200 text-xs space-y-1 z-50">
        <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">{label}</p>
        <div className="flex items-center justify-between gap-4 text-blue-600">
          <span>Revenue:</span>
          <span className="font-bold">₹ {payload[0]?.value} Cr</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-emerald-600">
          <span>Inventory Stock:</span>
          <span className="font-bold">{payload[1]?.value} units</span>
        </div>
      </div>
    );
  }
  return null;
};

const REGION_COLORS = ['#2563eb', '#06b6d4', '#6366f1', '#f59e0b', '#94a3b8'];

export const ExecutiveDashboard: React.FC = () => {
  const {
    monthlyTrend,
    regions,
    products,
    orders,
    customers,
    setCurrentPage,
    submitUserPrompt,
    filters,
    updateFilter,
    resetFilters
  } = useApp();

  const recentOrders = orders.slice(0, 5);

  // Live dynamic KPI computations from genuine dataset
  const totalRevenueCr = monthlyTrend.reduce((acc, m) => acc + m.revenueCr, 0).toFixed(1);
  const totalOrdersCount = orders.length;
  const totalCustomersCount = customers.length;
  const totalAmount = orders.reduce((acc, o) => acc + o.amount, 0);
  const avgOrderValue = Math.round(totalAmount / (orders.length || 1));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Returned':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Date Range and Operational Quarter Explanation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
              LIVE DATASET
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Overall enterprise commerce performance, real-time KPI synthesis, and autonomous driver diagnosis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quarter definition explainer badge */}
          <div
            className="hidden sm:flex items-center space-x-1.5 bg-blue-50/80 border border-blue-200/80 text-blue-900 text-[11px] px-2.5 py-1.5 rounded-lg"
            title="Quarters represent 3-month operational periods: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec). The dataset spans Oct 2025 - Sep 2026."
          >
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-medium">
              FY25-26 Cycle · Q3 Peak (Jul–Sep '26)
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs text-slate-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.dateRange}
              onChange={(e) => updateFilter('dateRange', e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-xs"
            >
              {STANDARD_DATE_RANGES.map((rng) => (
                <option key={rng} value={rng}>
                  {rng}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center space-x-1 bg-white hover:bg-slate-50 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Reset active filters to default"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* 4 Live Computed KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹ {totalRevenueCr} Cr</div>
          <div className="mt-2 flex items-center text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+12.5%</span>
            <span className="text-slate-400 font-normal ml-1">vs prior cycle</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Orders</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalOrdersCount.toLocaleString('en-IN')}</div>
          <div className="mt-2 flex items-center text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>100% verified</span>
            <span className="text-slate-400 font-normal ml-1">in memory queue</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Customers</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCustomersCount.toLocaleString('en-IN')}</div>
          <div className="mt-2 flex items-center text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+15.2%</span>
            <span className="text-slate-400 font-normal ml-1">Pan-India CRM</span>
          </div>
        </div>

        {/* Avg. Order Value */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Avg. Order Value</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹ {avgOrderValue.toLocaleString('en-IN')}</div>
          <div className="mt-2 flex items-center text-[11px] text-emerald-600 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>+4.8%</span>
            <span className="text-slate-400 font-normal ml-1">basket size</span>
          </div>
        </div>
      </div>

      {/* Executive Story Cards & Business Anomalies (Hackathon Presentation Tier) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white shadow-md border border-indigo-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/60 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-400/40 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Autonomous Anomaly Detection & Story Cards
              </span>
              <span className="text-xs text-slate-400 font-mono">APP_TODAY: 2026-09-30</span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Executive Focus: Critical Divergences & Driver Summaries
            </h2>
          </div>
          <span className="text-[11px] text-slate-300 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
            Click any story card to orchestrate agent investigation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {EXECUTIVE_STORY_CARDS.map((card) => {
            const isAnomaly = card.category === 'Anomaly' || card.category === 'Risk';
            return (
              <div
                key={card.id}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3.5 transition-all flex flex-col justify-between group hover:border-indigo-400/50"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        card.category === 'Anomaly'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : card.category === 'Risk'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : card.category === 'Growth'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {card.category}
                    </span>
                    <span
                      className={`text-xs font-bold font-mono ${
                        card.isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {card.changeValue}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                    {card.description}
                  </p>

                  <div className="pt-2 border-t border-white/10 space-y-1">
                    {card.drivers.slice(0, 2).map((drv, dIdx) => (
                      <div key={dIdx} className="text-[10px] text-slate-300 flex items-start gap-1">
                        <span className="text-cyan-400 shrink-0">•</span>
                        <span className="truncate">{drv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-white/10">
                  <button
                    onClick={() => submitUserPrompt(card.suggestedPrompt)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold py-1.5 px-2.5 rounded-lg transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Zap className="w-3 h-3 text-amber-300" />
                    <span>Investigate with Agent</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Revenue Trend & Sales by Region (Powered by Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Interactive Area Chart (Recharts) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Revenue Trend (Interactive Recharts)</h2>
              <p className="text-[11px] text-slate-500">Monthly gross revenue in ₹ Crores with hover tooltips</p>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              FY 2025
            </span>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rechartsRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  domain={[0, 2.0]}
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}Cr`}
                />
                <Tooltip content={<CustomRevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenueCr"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#rechartsRevenueGrad)"
                  activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Region Interactive Donut Chart (Recharts) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Sales by Region</h2>
            <p className="text-[11px] text-slate-500 mb-2">Territory market share with slice tooltips</p>
          </div>

          <div className="relative h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={regions}
                  dataKey="percentage"
                  nameKey="region"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {regions.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={REGION_COLORS[index % REGION_COLORS.length]}
                      className="transition-all hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomRegionalTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-slate-800">₹12.4 Cr</span>
              <span className="text-[9px] text-slate-400">Total</span>
            </div>
          </div>

          {/* Region Legend */}
          <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
            {regions.map((reg, idx) => (
              <div
                key={idx}
                onClick={() => submitUserPrompt(`Show ${reg.region} sales for last quarter`)}
                className="flex items-center justify-between py-0.5 px-1.5 rounded hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: REGION_COLORS[idx % REGION_COLORS.length] }}
                  />
                  <span className="text-slate-600 text-[11px]">{reg.region}</span>
                </div>
                <span className="font-semibold text-slate-900 text-[11px]">{reg.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Top Products & Inventory Recharts Bar Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products by Revenue & Inventory Bar Chart (Recharts) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Revenue & Inventory Metrics (Recharts)</h2>
              <p className="text-[11px] text-slate-500">Dual-axis bar metrics: Revenue (₹ Cr) vs Current Stock</p>
            </div>
            <button
              onClick={() => setCurrentPage('product-performance')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>Catalog View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={products.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(val) => val.split(' ')[0]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis
                  yAxisId="rev"
                  orientation="left"
                  tick={{ fontSize: 10, fill: '#3b82f6' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}Cr`}
                />
                <YAxis
                  yAxisId="stock"
                  orientation="right"
                  tick={{ fontSize: 10, fill: '#10b981' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}u`}
                />
                <Tooltip content={<CustomProductTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  iconSize={8}
                />
                <Bar
                  yAxisId="rev"
                  dataKey="revenue"
                  name="Revenue (₹ Cr)"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  yAxisId="stock"
                  dataKey="stock"
                  name="Inventory Stock"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Orders</h2>
              <p className="text-[11px] text-slate-500">Live transaction stream</p>
            </div>
            <button
              onClick={() => setCurrentPage('order-management')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-semibold">
                  <th className="py-2 px-2">Order ID</th>
                  <th className="py-2 px-2">Customer</th>
                  <th className="py-2 px-2">Product</th>
                  <th className="py-2 px-2 text-right">Amount</th>
                  <th className="py-2 px-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-2 font-mono text-slate-700 font-medium">{ord.id}</td>
                    <td className="py-2.5 px-2 text-slate-800 font-medium">{ord.customer}</td>
                    <td className="py-2.5 px-2 text-slate-600 truncate max-w-[120px]">{ord.product}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-slate-900">
                      ₹{ord.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadge(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
