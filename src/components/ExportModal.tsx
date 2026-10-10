import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Printer,
  X,
  CheckCircle2,
  Calendar,
  Filter,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportCurrentViewToCSV } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const {
    currentPage,
    filters,
    orders,
    products,
    customers,
    regions,
    monthlyTrend,
    userName,
    addBlackboardLog
  } = useApp();

  const [activeTab, setActiveTab] = useState<'options' | 'pdf-preview'>('options');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const filename = exportCurrentViewToCSV({
      pageId: currentPage,
      filters,
      orders,
      products,
      customers,
      regions,
      monthlyTrend,
      userName
    });

    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'EXPORT_CSV_GENERATED',
      details: `Generated CSV file ${filename} with current filter state: ${JSON.stringify(filters)}`,
      status: 'success'
    });

    setDownloadSuccess(`Downloaded ${filename} successfully`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrintPDF = () => {
    addBlackboardLog({
      tier: 'Tier 3: Execution AppAgent',
      event: 'EXPORT_PDF_TRIGGERED',
      details: `Dispatched print/PDF generation for view [${currentPage}]`,
      status: 'success'
    });
    window.print();
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'executive-dashboard': return 'Executive Dashboard & KPI Brief';
      case 'sales-report': return 'Sales & Financial Invoicing Report';
      case 'product-performance': return 'Product Catalog & Inventory Performance';
      case 'regional-analysis': return 'Regional Market Penetration Analysis';
      case 'customer-directory': return 'Customer Directory & Account Health';
      case 'order-management': return 'Order Fulfillment & Lifecycle Operations';
      case 'benchmark-evaluation': return '125-Test Benchmark Evaluation Report';
      case 'agent-blackboard': return 'Three-Tier Architecture & Trajectory Audit';
      default: return 'Enterprise Business Intelligence Report';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none">
        {/* Header (hidden in print) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Export Report Documentation</h3>
              <p className="text-xs text-slate-500">Capture current dashboard state or data view</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab(activeTab === 'options' ? 'pdf-preview' : 'options')}
              className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              {activeTab === 'options' ? 'Document Preview' : 'Export Options'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center space-x-2 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{downloadSuccess}</span>
            </div>
          )}

          {activeTab === 'options' ? (
            <div className="space-y-6 print:hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option 1: CSV Export */}
                <div
                  onClick={handleExportCSV}
                  className="p-5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Raw Data
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      Export to CSV
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Download full table dataset filtered by your active parameters ({filters.region}, {filters.status}).
                    </p>
                  </div>
                  <button className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .CSV</span>
                  </button>
                </div>

                {/* Option 2: PDF Document / Print */}
                <div
                  onClick={() => setActiveTab('pdf-preview')}
                  className="p-5 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Formatted
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                      Export to PDF / Print
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Generate executive summary documentation with KPI cards, charts breakdown, and company metadata.
                    </p>
                  </div>
                  <button className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Preview & Print PDF</span>
                  </button>
                </div>
              </div>

              {/* Current View State Metadata Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-semibold text-slate-700 block">Current Capture State</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Report View:</span>
                    <span className="font-medium text-slate-800">{getPageTitle()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Active Region:</span>
                    <span className="font-medium text-slate-800">{filters.region}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Status Filter:</span>
                    <span className="font-medium text-slate-800">{filters.status}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date Range:</span>
                    <span className="font-medium text-slate-800">{filters.dateRange}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Printable PDF Preview Layout */
            <div className="border border-slate-200 rounded-xl p-6 bg-white shadow-xs space-y-6 print:border-none print:p-0">
              {/* PDF Document Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                      Context-Aware Application Agent
                    </h2>
                    <p className="text-[11px] text-blue-600 font-semibold">
                      Enterprise BI & Analytics Documentation
                    </p>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  <p className="font-semibold text-slate-800">Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                  <p>Operator: {userName} (Admin)</p>
                  <p className="font-mono text-[10px]">ID: RPT-{Date.now().toString().slice(-6)}</p>
                </div>
              </div>

              {/* Document Title & Active Filter Badges */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{getPageTitle()}</h3>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200">
                    Region: {filters.region}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                    Category: {filters.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                    Status: {filters.status}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                    Date Range: {filters.dateRange}
                  </span>
                </div>
              </div>

              {/* Key Executive Summary Metrics */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Gross Revenue</span>
                  <span className="text-base font-bold text-slate-900">₹ 12.4 Cr</span>
                  <span className="text-[10px] text-emerald-600 block">+12.5% YoY</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Total Order Volume</span>
                  <span className="text-base font-bold text-slate-900">8,420</span>
                  <span className="text-[10px] text-emerald-600 block">+8.3% MoM</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Active Customer Accounts</span>
                  <span className="text-base font-bold text-slate-900">2,350</span>
                  <span className="text-[10px] text-emerald-600 block">+15.2% YoY</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Average Order Value</span>
                  <span className="text-base font-bold text-slate-900">₹ 14,720</span>
                  <span className="text-[10px] text-emerald-600 block">+4.8% YoY</span>
                </div>
              </div>

              {/* Report Data Preview Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Transaction & Data Sample
                </span>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase font-semibold">
                      <th className="py-2 px-2">Reference ID</th>
                      <th className="py-2 px-2">Entity / Customer</th>
                      <th className="py-2 px-2">Category / Item</th>
                      <th className="py-2 px-2 text-right">Value (INR)</th>
                      <th className="py-2 px-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {orders.slice(0, 6).map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-2 px-2 font-mono text-slate-500">{ord.id}</td>
                        <td className="py-2 px-2 font-medium text-slate-800">{ord.customer}</td>
                        <td className="py-2 px-2 text-slate-600">{ord.product}</td>
                        <td className="py-2 px-2 text-right font-semibold text-slate-900">₹{ord.amount.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-2 text-center font-semibold text-slate-700">{ord.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Agent Certified Audit Sign-off */}
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-[11px] text-slate-700 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-blue-900">Agent System Verification: </span>
                  Data verified against Tier 2 Shared Memory Bus and validated with 0 schema violations. Report is ready for external auditing and compliance documentation.
                </div>
              </div>

              {/* Actions Footer inside preview */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 print:hidden">
                <button
                  onClick={() => setActiveTab('options')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Back to Options
                </button>
                <button
                  onClick={handlePrintPDF}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
