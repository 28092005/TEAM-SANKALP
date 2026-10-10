import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Globe,
  Users,
  ShoppingCart,
  CheckCircle2,
  Cpu,
  BarChart3,
  LogOut,
  Sparkles,
  Layers,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageId } from '../types';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'executive-dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
  { id: 'sales-report', label: 'Sales Report', icon: TrendingUp },
  { id: 'product-performance', label: 'Product Performance', icon: Package },
  { id: 'regional-analysis', label: 'Regional Analysis', icon: Globe },
  { id: 'customer-directory', label: 'Customer Directory', icon: Users },
  { id: 'order-management', label: 'Order Management', icon: ShoppingCart },
  {
    id: 'benchmark-evaluation',
    label: 'Benchmark Evaluation',
    icon: CheckCircle2,
    badge: '125 TESTS',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  {
    id: 'agent-blackboard',
    label: 'Blackboard & Architecture',
    icon: Cpu,
    badge: '3-TIER FSM',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'login',
    label: 'Personas & Login',
    icon: Shield,
    badge: '4 ROLES',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
  }
];

export const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, userName, userRole, setIsAuthenticated, addBlackboardLog } = useApp();

  const handleNavClick = (pageId: PageId) => {
    setCurrentPage(pageId);
    addBlackboardLog({
      tier: 'Tier 1: Intent & Orchestrator',
      event: 'MANUAL_ROUTE_CHANGE',
      details: `User manually clicked navigation item: ${pageId}`,
      status: 'info'
    });
  };

  return (
    <aside className="w-64 bg-[#0B132B] text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight leading-snug">
              Context-Aware
            </h1>
            <p className="text-xs text-blue-400 font-medium">Application Agent</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 text-[11px] text-slate-400 border border-slate-700/50">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">Autonomous BI Companion</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Application Views
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border leading-none ml-1.5 shrink-0 ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold flex items-center justify-center text-xs shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] text-slate-400 truncate">{userRole}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setCurrentPage('login');
            }}
            title="Sign Out to Login Page"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
