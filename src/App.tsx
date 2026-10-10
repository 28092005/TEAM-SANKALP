/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { AgentAssistant } from './components/AgentAssistant';
import { ExportModal } from './components/ExportModal';
import { NotificationCenter } from './components/NotificationCenter';

import { ExecutiveDashboard } from './components/pages/ExecutiveDashboard';
import { SalesReport } from './components/pages/SalesReport';
import { ProductPerformance } from './components/pages/ProductPerformance';
import { RegionalAnalysis } from './components/pages/RegionalAnalysis';
import { CustomerDirectory } from './components/pages/CustomerDirectory';
import { OrderManagement } from './components/pages/OrderManagement';
import { BenchmarkEvaluation } from './components/pages/BenchmarkEvaluation';
import { AgentBlackboard } from './components/pages/AgentBlackboard';
import { LoginPage } from './components/LoginPage';
import { ApprovalsModal } from './components/ApprovalsModal';

import {
  Sparkles,
  Search,
  Bell,
  CheckCircle2,
  Compass,
  ArrowRight,
  ExternalLink,
  Bot,
  Download,
  RotateCcw,
  LogOut,
  FilterX,
  Shield
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const {
    currentPage,
    setCurrentPage,
    isAuthenticated,
    setIsAuthenticated,
    userRole,
    userName,
    submitUserPrompt,
    isAgentPanelOpen,
    setIsAgentPanelOpen,
    resetFilters,
    hasActiveFilters,
    isApprovalsModalOpen,
    setIsApprovalsModalOpen,
    changeRequests,
    logout
  } = useApp();

  const pendingApprovalsCount = changeRequests.filter((r) => r.status === 'PENDING').length;

  if (!isAuthenticated || currentPage === 'login') {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (currentPage) {
      case 'executive-dashboard':
        return <ExecutiveDashboard />;
      case 'sales-report':
        return <SalesReport />;
      case 'product-performance':
        return <ProductPerformance />;
      case 'regional-analysis':
        return <RegionalAnalysis />;
      case 'customer-directory':
        return <CustomerDirectory />;
      case 'order-management':
        return <OrderManagement />;
      case 'benchmark-evaluation':
        return <BenchmarkEvaluation />;
      case 'agent-blackboard':
        return <AgentBlackboard />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'executive-dashboard':
        return 'Executive Dashboard';
      case 'sales-report':
        return 'Sales Report';
      case 'product-performance':
        return 'Product Performance';
      case 'regional-analysis':
        return 'Regional Analysis';
      case 'customer-directory':
        return 'Customer Directory';
      case 'order-management':
        return 'Order Management';
      case 'benchmark-evaluation':
        return 'Benchmark Evaluation (125 Tests)';
      case 'agent-blackboard':
        return 'Agent Blackboard & Architecture';
      default:
        return 'Executive Dashboard';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* 1. Left Sidebar */}
      <Sidebar />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        {/* Top App Header / Bar */}
        <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 select-none shadow-2xs">
          {/* Breadcrumb path */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Enterprise BI</span>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">{getPageTitle()}</span>
          </div>

          {/* Quick Test Triggers & Top Controls */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs text-slate-600">
              <span className="text-[10px] uppercase font-bold text-slate-400">Quick Prompt:</span>
              <button
                onClick={() => submitUserPrompt('Show Karnataka sales for last quarter')}
                className="hover:text-blue-600 hover:underline text-[11px]"
              >
                "Karnataka Sales"
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => submitUserPrompt('Show cancelled orders')}
                className="hover:text-rose-600 hover:underline text-[11px]"
              >
                "Cancelled Orders"
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => submitUserPrompt('Compare revenue this month vs last month')}
                className="hover:text-blue-600 hover:underline text-[11px]"
              >
                "MoM Trend"
              </button>
            </div>

            {/* Reset Filters Quick Button with Active Indicator */}
            <button
              onClick={resetFilters}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                hasActiveFilters
                  ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100 ring-1 ring-blue-400/40'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
              title="Reset all active region, category, status, and date filters to default"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${hasActiveFilters ? 'text-blue-600' : 'text-slate-500'}`} />
              <span>Reset Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              )}
            </button>

            {/* RBAC Approvals Queue Button */}
            <button
              onClick={() => setIsApprovalsModalOpen(true)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                pendingApprovalsCount > 0
                  ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 ring-1 ring-amber-400/30'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
              }`}
              title="View and manage RBAC change approval requests"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Approvals</span>
              {pendingApprovalsCount > 0 && (
                <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full font-mono">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {/* Export to PDF/CSV Button */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold shadow-2xs transition-all hover:border-blue-400 cursor-pointer"
              title="Capture current dashboard state or report data for external documentation"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export to PDF/CSV</span>
            </button>

            {/* Notification Center */}
            <NotificationCenter />

            {/* Role Switcher Pill */}
            <button
              onClick={() => {
                setCurrentPage('login');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                userRole === 'Admin' || userRole === 'Platform Admin' || userRole === 'Enterprise Admin'
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
              }`}
              title="Click to view Persona Flows & Login Portal"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{userRole}: {userName ? userName.split(' ')[0] : 'User'}</span>
            </button>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
              title="Sign Out of Tenant Account"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {!isAgentPanelOpen && (
              <button
                onClick={() => setIsAgentPanelOpen(true)}
                className="flex items-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Open Agent</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Content Body (Scrollable) */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* 3. Right Docked Agent Assistant */}
      <AgentAssistant />

      {/* Export to PDF / CSV Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* RBAC Approvals Management Modal */}
      <ApprovalsModal
        isOpen={isApprovalsModalOpen}
        onClose={() => setIsApprovalsModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
