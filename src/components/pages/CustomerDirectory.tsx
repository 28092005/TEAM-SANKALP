import React, { useState } from 'react';
import {
  Users,
  Search,
  UserCheck,
  UserPlus,
  AlertTriangle,
  Mail,
  MapPin,
  Sparkles,
  Building2,
  DollarSign,
  Plus,
  Trash2,
  X,
  Edit2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CustomerItem, CustomerStatus, CustomerType } from '../../types';

export const CustomerDirectory: React.FC = () => {
  const {
    customers,
    filters,
    updateFilter,
    submitUserPrompt,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    userRole,
    userName
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLocation, setNewLocation] = useState('Bangalore, KA');
  const [newRegion, setNewRegion] = useState('Karnataka');
  const [newType, setNewType] = useState<CustomerType>('Enterprise');

  const filteredCustomers = customers.filter((cust) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = cust.name.toLowerCase().includes(q);
      const matchEmail = cust.email.toLowerCase().includes(q);
      const matchLoc = cust.location.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchLoc) return false;
    }

    if (filters.region !== 'All Regions' && cust.region !== filters.region) {
      return false;
    }

    if (filters.category !== 'All Categories' && filters.category !== 'All Types' && cust.type !== filters.category) {
      return false;
    }

    if (filters.status !== 'All' && cust.status !== filters.status) {
      return false;
    }

    return true;
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    addCustomer({
      name: newName.trim(),
      email: newEmail.trim(),
      location: newLocation,
      region: newRegion,
      ordersCount: 1,
      totalSpent: 45000,
      status: 'Active',
      type: newType,
      joinedDate: new Date().toISOString().split('T')[0],
      lastOrderDate: new Date().toISOString().split('T')[0]
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Inactive':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Churned':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header matching screenshot */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Directory</h1>
            <p className="text-xs text-slate-500">Master client registry, churn auditing, and enterprise accounts</p>
          </div>
          <div className="flex items-center space-x-2">
            {userRole === 'Admin' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Customer</span>
              </button>
            )}

            <button
              onClick={() => submitUserPrompt('Find churned customers in Delhi')}
              className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center space-x-1.5 w-fit cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Agent: Audit Churned</span>
            </button>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name, email, or location..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filter dropdowns matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Region</label>
            <select
              value={filters.region}
              onChange={(e) => updateFilter('region', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none"
            >
              <option value="All Regions">All Regions</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Customer Type</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none"
            >
              <option value="All Categories">All Types</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Retail">Retail</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Churned">Churned</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Total Customers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{customers.length}</p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">Pan-India CRM roster</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Active Customers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {customers.filter((c) => c.status === 'Active').length}
          </p>
          <div className="mt-2 text-[11px] text-blue-600 font-medium">Verified active buyers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">New Customers</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">230</p>
          <div className="mt-2 text-[11px] text-indigo-600 font-medium">Onboarded this quarter</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Churn Rate</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {((customers.filter((c) => c.status === 'Churned').length / customers.length) * 100).toFixed(1)}%
          </p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">Retained healthy baseline</div>
        </div>
      </div>

      {/* Customer Directory Table matching screenshot with CRUD */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">Customer Roster & Status Management ({filteredCustomers.length})</h2>
          <span className="text-[11px] text-slate-500">Live CRM synchronization</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Customer ID</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Segment</th>
                <th className="py-2.5 px-3 text-right">Orders</th>
                <th className="py-2.5 px-3 text-right">Total Spent</th>
                <th className="py-2.5 px-3 text-center">Status (Update)</th>
                {userRole === 'Admin' && <th className="py-2.5 px-3 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    userName.toLowerCase() === c.name.toLowerCase() ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-mono text-slate-500">{c.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{c.name}</span>
                      {userName.toLowerCase() === c.name.toLowerCase() && (
                        <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400">{c.email}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-600 flex items-center space-x-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{c.location}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.type === 'Enterprise'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : c.type === 'VIP'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-slate-700">{c.ordersCount}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    ₹{c.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {/* Status updater dropdown */}
                    <select
                      value={c.status}
                      disabled={userRole !== 'Admin'}
                      onChange={(e) => updateCustomer(c.id, { status: e.target.value as CustomerStatus })}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${getStatusBadge(
                        c.status
                      )}`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Churned">Churned</option>
                    </select>
                  </td>
                  {userRole === 'Admin' && (
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => deleteCustomer(c.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove Customer (CRUD Delete)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal (CRUD Create) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Register New Customer</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Tanya Kapoor"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. tanya@enterprise.io"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Territory Region</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Customer Segment</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as CustomerType)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="Enterprise">Enterprise</option>
                  <option value="VIP">VIP</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
