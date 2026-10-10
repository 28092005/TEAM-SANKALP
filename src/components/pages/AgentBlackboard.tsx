import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Database,
  Workflow,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Terminal,
  Activity,
  Code
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_METADATA_CATALOG } from '../../data/metadata';

export const AgentBlackboard: React.FC = () => {
  const { blackboardLogs, regenerateSyntheticData, submitUserPrompt } = useApp();
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [dataMultiplier, setDataMultiplier] = useState<number>(1.5);
  const [activeTab, setActiveTab] = useState<'architecture' | 'trajectory' | 'metadata'>('architecture');

  const filteredLogs = blackboardLogs.filter((log) => {
    if (selectedTier === 'All') return true;
    return log.tier.includes(selectedTier);
  });

  const handleGenerateSynthetic = () => {
    regenerateSyntheticData(dataMultiplier);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Agent Blackboard & Architecture
            </h1>
            <span className="bg-cyan-100 text-cyan-800 text-xs font-bold px-2 py-0.5 rounded border border-cyan-300">
              3-TIER ENTERPRISE BLUEPRINT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Definitive three-tier architecture: HostAgent orchestrator, shared memory bus, and hybrid execution layer.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'architecture' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Architecture Blueprint
          </button>
          <button
            onClick={() => setActiveTab('trajectory')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'trajectory' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Live Trajectory Bus ({blackboardLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'metadata' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Knowledge Graph Schema
          </button>
        </div>
      </div>

      {/* Synthetic Data Generator Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-xl shadow-md border border-indigo-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Synthetic Enterprise Data Generator</span>
          </div>
          <h3 className="text-base font-bold text-white">Simulate High-Volume Tenant Records</h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Generate synthetic orders, custom customer cohorts, and transaction variance to stress-test agent navigation and analytical accuracy at scale.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/10 p-2.5 rounded-lg border border-white/20 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-300">Volume Multiplier:</span>
            <span className="text-xs font-bold text-cyan-300">{dataMultiplier}x (30+ records)</span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            step="0.5"
            value={dataMultiplier}
            onChange={(e) => setDataMultiplier(parseFloat(e.target.value))}
            className="w-24 accent-cyan-400"
          />
          <button
            onClick={handleGenerateSynthetic}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-md shadow transition-colors flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Seed Now</span>
          </button>
        </div>
      </div>

      {activeTab === 'architecture' && (
        <div className="space-y-6">
          {/* 4-Layer Enterprise Architecture Blueprint (Slide 4 Taxonomy) */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Four-Layer System Architecture (KLE Tech Problem 5A Specification)
                </h2>
                <p className="text-xs text-slate-500">
                  Full stack alignment across Data, Modeling, Orchestration, and Application layers.
                </p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-md border border-blue-200 uppercase">
                4 Architectural Layers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {/* Layer 1 */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                  Layer 1: Data & Metadata
                </span>
                <h3 className="text-xs font-bold text-slate-900">Relational & Schema Bus</h3>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li>• 10,000+ <code className="bg-white px-1 py-0.2 rounded border">sales</code> transactions</li>
                  <li>• 1,000+ <code className="bg-white px-1 py-0.2 rounded border">orders</code> & fulfillment logs</li>
                  <li>• 500+ <code className="bg-white px-1 py-0.2 rounded border">customers</code> CRM directory</li>
                  <li>• Declarative <code className="bg-white px-1 py-0.2 rounded border">metadata.json</code> catalog</li>
                </ul>
              </div>

              {/* Layer 2 */}
              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Layer 2: Modeling & AI
                </span>
                <h3 className="text-xs font-bold text-slate-900">Semantic AI & RAG Engine</h3>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li>• Gemini 2.5 / 2.0 API tool calling</li>
                  <li>• Knowledge Graph semantic retrieval</li>
                  <li>• Zero-latency local fallback planner</li>
                  <li>• Faithfulness & numerical grounding</li>
                </ul>
              </div>

              {/* Layer 3 */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Layer 3: Orchestration & Actions
                </span>
                <h3 className="text-xs font-bold text-slate-900">3-Tier Blackboard Bus</h3>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li>• <strong>Tier 1:</strong> Intent decomposition & safety</li>
                  <li>• <strong>Tier 2:</strong> Shared memory & trajectory logs</li>
                  <li>• <strong>Tier 3:</strong> Execution & slot mutations</li>
                  <li>• Metadata Validator & reason codes</li>
                </ul>
              </div>

              {/* Layer 4 */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Layer 4: Application & UX
                </span>
                <h3 className="text-xs font-bold text-slate-900">Reactive BI Experience</h3>
                <ul className="text-[11px] text-slate-600 space-y-1">
                  <li>• React 19 + Tailwind CSS + Recharts</li>
                  <li>• Autonomous Executive Story Cards</li>
                  <li>• Voice synthesis & Web Speech API</li>
                  <li>• Real-time printable PDF/CSV export</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Blueprint Visualizer replicating Image 2 */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-slate-900">
              Three-Tier Context-Aware Agentic Blueprint (HostAgent Orchestrator)
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Flow Steps */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50">
                  <span className="text-[10px] font-bold text-blue-700 uppercase">1. User Intent</span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">Natural Language Prompt</p>
                  <p className="text-[11px] text-slate-600 mt-1">Initiates the workflow via text or speech.</p>
                </div>

                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">2. HostAgent Orchestration</span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">Task Decomposition & FSM</p>
                  <p className="text-[11px] text-slate-600 mt-1">Plans cross-application subtasks and maintains global execution state.</p>
                </div>

                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">3. Blackboard Sync</span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">Shared Memory Substrate</p>
                  <p className="text-[11px] text-slate-600 mt-1">Central data bus preserves trajectory logs, RAG metadata, and episodic state.</p>
                </div>

                <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50">
                  <span className="text-[10px] font-bold text-rose-700 uppercase">4. AppAgent Execution</span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">Hybrid GUI & Native Tooling</p>
                  <p className="text-[11px] text-slate-600 mt-1">Specialized localized agents execute simulated clicks and native APIs.</p>
                </div>

                <div className="p-3 rounded-lg border border-indigo-200 bg-indigo-50/50">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase">5. UI Feedback Loop</span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">Continuous State Validation</p>
                  <p className="text-[11px] text-slate-600 mt-1">Observations return to HostAgent for error recovery and analytical presentation.</p>
                </div>
              </div>

              {/* Right: Three Tier Structural Diagram */}
              <div className="lg:col-span-2 space-y-4">
                {/* Tier 1 Box */}
                <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-50/70 to-teal-50/40 shadow-xs relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-900">
                      Tier 1: Intent & Orchestration (HostAgent)
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                      Desktop Orchestrator
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-lg border border-emerald-200 shadow-2xs font-medium text-slate-800">
                      Task Decomposition
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-emerald-200 shadow-2xs font-medium text-slate-800">
                      Global State Machine (FSM)
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-emerald-200 shadow-2xs font-medium text-slate-800">
                      Cross-App Routing
                    </div>
                  </div>
                </div>

                {/* Tier 2 Box */}
                <div className="p-4 rounded-xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-50/70 to-yellow-50/40 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-900">
                      Tier 2: The Shared Substrate (Blackboard Memory Bus)
                    </span>
                    <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-semibold">
                      Persistent Memory
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-2xs font-medium text-slate-800 flex items-center justify-center gap-1">
                      <Database className="w-3 h-3 text-amber-600" />
                      <span>Trajectory Logs</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-2xs font-medium text-slate-800 flex items-center justify-center gap-1">
                      <Workflow className="w-3 h-3 text-amber-600" />
                      <span>External Docs (RAG)</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-2xs font-medium text-slate-800 flex items-center justify-center gap-1">
                      <Cpu className="w-3 h-3 text-amber-600" />
                      <span>Episodic State</span>
                    </div>
                  </div>
                </div>

                {/* Tier 3 Box */}
                <div className="p-4 rounded-xl border-2 border-rose-500/40 bg-gradient-to-r from-rose-50/70 to-pink-50/40 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-rose-900">
                      Tier 3: Execution Layer (Specialized AppAgents)
                    </span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded font-semibold">
                      GUI & Native Tool Calling
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-rose-200 shadow-2xs">
                      <p className="font-bold text-slate-900 mb-1">BI & Analytics AppAgent</p>
                      <p className="text-[11px] text-slate-500">Native API / MCP Server Tool Calling</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-rose-200 shadow-2xs">
                      <p className="font-bold text-slate-900 mb-1">Browser / UI AppAgent</p>
                      <p className="text-[11px] text-slate-500">GUI Vision & Simulated Click Automation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trajectory' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Real-Time Trajectory Stream</h2>
              <p className="text-[11px] text-slate-500">Live blackboard event audit log with tier traceability</p>
            </div>

            <div className="flex items-center space-x-1.5 text-xs">
              {['All', 'Tier 1', 'Tier 2', 'Tier 3'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    selectedTier === tier
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-white border-b border-slate-200 text-[11px] text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Architecture Tier</th>
                  <th className="py-2.5 px-3">Event Type</th>
                  <th className="py-2.5 px-3">Execution Payload & Details</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${
                          log.tier.includes('Tier 1')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : log.tier.includes('Tier 2')
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {log.tier.split(':')[0]}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{log.event}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-md font-sans text-xs">{log.details}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-emerald-600 font-sans font-semibold text-[11px]">SUCCESS</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'metadata' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Knowledge Graph & Component Schema</h2>
            <p className="text-[11px] text-slate-500">
              Exported metadata catalog representing pages, widgets, filters, and routing mappings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {APP_METADATA_CATALOG.map((page) => (
              <div key={page.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-900">{page.title}</h3>
                  <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    {page.route}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">{page.description}</p>
                <div className="pt-2 border-t border-slate-200 text-[11px] space-y-1">
                  <p className="font-semibold text-slate-700">Registered Widgets ({page.widgets.length}):</p>
                  <ul className="list-disc pl-4 text-slate-500 space-y-0.5">
                    {page.widgets.map((w) => (
                      <li key={w.id}>{w.title} ({w.type})</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
