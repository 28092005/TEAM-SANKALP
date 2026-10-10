/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Role-Based Access Control (RBAC) Change Approval Governance Console
 */

import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  AlertTriangle,
  X,
  Layers,
  ArrowRight,
  Database,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ApprovalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApprovalsModal: React.FC<ApprovalsModalProps> = ({ isOpen, onClose }) => {
  const {
    changeRequests,
    approveChangeRequest,
    rejectChangeRequest,
    userRole,
    userName
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  if (!isOpen) return null;

  const isAdmin = userRole === 'Admin' || userRole === 'Platform Admin' || userRole === 'Enterprise Admin';

  const filteredRequests = changeRequests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const pendingCount = changeRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  RBAC Change Approval Governance
                </h2>
                {pendingCount > 0 && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                    {pendingCount} PENDING
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Audited modification pipeline: Only Administrator can execute state updates & deletions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Role Notice */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Logged in as:</span>
            <span className="font-bold text-slate-900">{userName || 'User'}</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                isAdmin
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-purple-50 text-purple-700 border-purple-200'
              }`}
            >
              {userRole}
            </span>
          </div>

          <span className="text-[11px] text-slate-500">
            {isAdmin ? 'Full execution authority' : 'Read-only audit view'}
          </span>
        </div>

        {/* Filters */}
        <div className="p-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {filteredRequests.length} record(s)
          </span>
        </div>

        {/* Body list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <ShieldCheck className="w-10 h-10 mx-auto text-emerald-500/80" />
              <p className="font-semibold text-slate-700 text-xs">
                {filterStatus === 'PENDING'
                  ? 'No pending approval requests in queue'
                  : 'No requests match the selected filter'}
              </p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                When non-admin roles (Regional Sales Manager, Operations Analyst) attempt to update or delete orders, customers, or SKUs, requests appear here for verification.
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-2.5 transition-all hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                          req.type === 'DELETE'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {req.type} {req.entity}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        #{req.entityId}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono uppercase ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{req.description}</p>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                    {req.timestamp}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <User className="w-3 h-3 text-slate-400" />
                      {req.requesterName}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-mono">{req.requesterRole}</span>
                  </div>

                  {req.status === 'PENDING' && (
                    <div className="flex items-center space-x-1.5">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => approveChangeRequest(req.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] px-3 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer shadow-2xs"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve & Apply</span>
                          </button>
                          <button
                            onClick={() => rejectChangeRequest(req.id)}
                            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-medium text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                          Awaiting Admin Review
                        </span>
                      )}
                    </div>
                  )}

                  {req.status === 'APPROVED' && (
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Change executed live
                    </span>
                  )}

                  {req.status === 'REJECTED' && (
                    <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-rose-500" />
                      Blocked by Admin
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Enterprise Auditing: All mutations logged to Agent Blackboard</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
