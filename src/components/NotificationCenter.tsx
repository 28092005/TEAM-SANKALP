import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Sparkles,
  Database,
  Cpu,
  Layers,
  ArrowRight,
  X,
  CheckCircle2,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';
import { ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setCurrentPage,
    changeRequests,
    approveChangeRequest,
    rejectChangeRequest,
    userRole
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'agent' | 'crud' | 'system' | 'approvals'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const isAdmin = userRole === 'Admin' || userRole === 'Platform Admin' || userRole === 'Enterprise Admin';
  const pendingApprovalsCount = changeRequests.filter((r) => r.status === 'PENDING').length;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.linkPage) {
      setCurrentPage(notif.linkPage);
      setIsOpen(false);
    }
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'agent':
        return <Bot className="w-3.5 h-3.5 text-blue-600" />;
      case 'data':
        return <Database className="w-3.5 h-3.5 text-indigo-600" />;
      case 'crud':
        return <Layers className="w-3.5 h-3.5 text-emerald-600" />;
      case 'system':
      default:
        return <Cpu className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white shadow-xs animate-in zoom-in-50">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-xs text-slate-900 tracking-tight">
                Notification Center
              </h3>
              {unreadNotificationsCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {unreadNotificationsCount} unread
                </span>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={markAllNotificationsRead}
                disabled={unreadNotificationsCount === 0}
                className="p-1 text-slate-400 hover:text-blue-600 rounded disabled:opacity-40 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={clearNotifications}
                disabled={notifications.length === 0}
                className="p-1 text-slate-400 hover:text-rose-600 rounded disabled:opacity-40 transition-colors"
                title="Clear all notifications"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 p-2 bg-slate-50/60 border-b border-slate-200 overflow-x-auto text-[11px]">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'agent', label: 'Agent' },
                { id: 'crud', label: 'CRUD' },
                { id: 'approvals', label: `RBAC Approvals (${pendingApprovalsCount})` },
                { id: 'system', label: 'System' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List Body */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filterType === 'approvals' ? (
              changeRequests.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <ShieldCheck className="w-7 h-7 mx-auto mb-2 text-emerald-500" />
                  <p className="font-semibold text-slate-700">No Change Requests in Queue</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Non-admin write/delete requests appear here for approval.</p>
                </div>
              ) : (
                changeRequests.map((req) => (
                  <div key={req.id} className="p-3 bg-white space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                          req.type === 'DELETE' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {req.type} {req.entity}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 font-semibold">{req.entityId}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        req.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-700 font-medium">
                      {req.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
                      <span>By: <strong className="text-slate-600">{req.requesterName}</strong> ({req.requesterRole})</span>
                      <span>{req.timestamp}</span>
                    </div>

                    {req.status === 'PENDING' && isAdmin && (
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => approveChangeRequest(req.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1 px-2 rounded text-[11px] transition-colors cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Approve & Apply</span>
                        </button>
                        <button
                          onClick={() => rejectChangeRequest(req.id)}
                          className="flex-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-semibold py-1 px-2 rounded text-[11px] transition-colors cursor-pointer border border-slate-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {req.status === 'PENDING' && !isAdmin && (
                      <p className="text-[10px] text-amber-600 font-medium italic">
                        Awaiting Administrator review and authorization.
                      </p>
                    )}
                  </div>
                ))
              )
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                <p className="font-medium">No notifications in this category</p>
                <p className="text-[11px] text-slate-400 mt-0.5">System is operating smoothly</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 text-xs ${
                    !notif.read ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs truncate ${!notif.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                      {notif.message}
                    </p>

                    {notif.linkPage && (
                      <span className="mt-1 inline-flex items-center space-x-1 text-[10px] text-blue-600 font-semibold hover:underline">
                        <span>View page</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <span className="text-[10px] text-slate-400">
              Live updates connected to HostAgent & Blackboard Memory Bus
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
