import React, { useState } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Filter,
  Sparkles,
  Download,
  Plus,
  Edit2,
  X,
  CreditCard,
  User,
  Package,
  RotateCcw,
  Trash2,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import { STANDARD_DATE_RANGES } from '../../data/metadata';

export const OrderManagement: React.FC = () => {
  const {
    orders,
    filters,
    updateFilter,
    resetFilters,
    submitUserPrompt,
    regenerateSyntheticData,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    userRole,
    userName
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState(userRole === 'Customer' ? userName : '');
  const [newProduct, setNewProduct] = useState('Laptop Pro 16"');
  const [newAmount, setNewAmount] = useState('65990');
  const [newRegion, setNewRegion] = useState('Karnataka');
  const [newStatus, setNewStatus] = useState<OrderStatus>('Processing');
  const [newPayment, setNewPayment] = useState('UPI / NetBanking');
  const [customerOrdersOnly, setCustomerOrdersOnly] = useState(userRole === 'Customer');

  const filteredOrders = orders.filter((ord) => {
    if (customerOrdersOnly && !ord.customer.toLowerCase().includes(userName.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'All' && ord.status !== filters.status) {
      return false;
    }
    if (filters.region !== 'All Regions' && ord.region !== filters.region) {
      return false;
    }
    return true;
  });

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newAmount) return;

    addOrder({
      customer: newCustomerName.trim(),
      customerId: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      product: newProduct,
      productId: `PRD-${Math.floor(100 + Math.random() * 900)}`,
      amount: parseInt(newAmount, 10) || 5000,
      status: newStatus,
      region: newRegion,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: newPayment
    });

    setIsCreateModalOpen(false);
    setNewCustomerName(userRole === 'Customer' ? userName : '');
    setNewAmount('65990');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'Returned':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Header matching screenshot */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order Management</h1>
              {userRole === 'Customer' && (
                <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-200">
                  Customer Portal Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Live transaction lifecycle, fulfillment queue, and status auditing</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Order</span>
            </button>

            <button
              onClick={() => submitUserPrompt('Show cancelled orders')}
              className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Filter Cancelled</span>
            </button>

            {userRole === 'Admin' && (
              <button
                onClick={() => regenerateSyntheticData(1.0)}
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Seed Batch</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter bar matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Delivered">Delivered</option>
              <option value="Processing">Processing</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

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

          <div className="flex items-end">
            <label className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg w-full cursor-pointer">
              <input
                type="checkbox"
                checked={customerOrdersOnly}
                onChange={(e) => setCustomerOrdersOnly(e.target.checked)}
                className="rounded text-blue-600 accent-blue-600"
              />
              <span className="truncate">My Account ({userName.split(' ')[0]})</span>
            </label>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
              title="Reset order status, region, and date filters to default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Total Orders</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</p>
          <div className="mt-2 text-[11px] text-blue-600 font-medium">100% indexed in queue</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Delivered</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {orders.filter((o) => o.status === 'Delivered').length}
          </p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">Fulfilled successfully</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Processing</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {orders.filter((o) => o.status === 'Processing').length}
          </p>
          <div className="mt-2 text-[11px] text-slate-500">In fulfillment pipeline</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-xs bg-rose-50/20">
          <p className="text-xs text-rose-600 font-medium">Cancelled</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {orders.filter((o) => o.status === 'Cancelled').length}
          </p>
          <div className="mt-2 text-[11px] text-rose-600 font-medium">Flagged status</div>
        </div>
      </div>

      {/* Order Transaction Operations Table with CRUD actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Transaction Operations ({filteredOrders.length} orders shown)
            </h2>
            <p className="text-[11px] text-slate-500">
              Direct lifecycle controls: update status and track fulfillment in real-time
            </p>
          </div>
          {filters.status !== 'All' && (
            <button
              onClick={() => updateFilter('status', 'All')}
              className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Status (Update)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-700">{ord.id}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{ord.customer}</td>
                  <td className="py-3 px-3 text-slate-600">{ord.product}</td>
                  <td className="py-3 px-3 text-slate-500">{ord.region}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{ord.date}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    ₹{ord.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {/* Status updater dropdown */}
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${getStatusBadge(
                        ord.status
                      )}`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Returned">Returned</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal (CRUD Create) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Create New Order</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. Rohan Mehta or Enterprise Client"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Product SKU</label>
                <select
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value='Laptop Pro 16"'>Laptop Pro 16"</option>
                  <option value='Smartphone Ultra 5G'>Smartphone Ultra 5G</option>
                  <option value='Tablet Air 11"'>Tablet Air 11"</option>
                  <option value='Noise-Cancelling Headphones'>Noise-Cancelling Headphones</option>
                  <option value='4K IPS Ultrawide Monitor'>4K IPS Ultrawide Monitor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Amount (₹ INR)</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Region</label>
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={newPayment}
                    onChange={(e) => setNewPayment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  >
                    <option value="UPI / NetBanking">UPI / NetBanking</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Corporate Invoice">Corporate Invoice</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Confirm & Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
