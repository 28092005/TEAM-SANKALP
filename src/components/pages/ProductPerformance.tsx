import React, { useState } from 'react';
import {
  Package,
  CheckCircle,
  TrendingUp,
  Star,
  Calendar,
  Filter,
  Sparkles,
  BarChart2,
  Plus,
  Trash2,
  X,
  Edit2,
  RotateCcw,
  Info,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { STANDARD_DATE_RANGES } from '../../data/metadata';

export const ProductPerformance: React.FC = () => {
  const {
    products,
    filters,
    updateFilter,
    resetFilters,
    submitUserPrompt,
    addProduct,
    updateProduct,
    deleteProduct,
    userRole
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newRevenue, setNewRevenue] = useState('1.5');
  const [newUnits, setNewUnits] = useState('1200');
  const [newStock, setNewStock] = useState('150');
  const [newRating, setNewRating] = useState('4.5');

  const filteredProducts = products.filter((prod) => {
    if (filters.category !== 'All Categories' && prod.category !== filters.category) {
      return false;
    }
    return true;
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addProduct({
      name: newProdName.trim(),
      category: newCategory,
      revenue: parseFloat(newRevenue) || 1.0,
      unitsSold: parseInt(newUnits, 10) || 500,
      stock: parseInt(newStock, 10) || 100,
      rating: parseFloat(newRating) || 4.2,
      growth: 12.5
    });

    setIsAddModalOpen(false);
    setNewProdName('');
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Product Performance</h1>
            <p className="text-xs text-slate-500">SKU revenue velocity, catalog health, and inventory turnover</p>
          </div>
          <div className="flex items-center space-x-2">
            {userRole === 'Admin' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add SKU</span>
              </button>
            )}

            <button
              onClick={() => submitUserPrompt('Top 5 products by revenue')}
              className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center space-x-1.5 w-fit cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Agent to Rank SKUs</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="All Categories">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Home & Office">Home & Office</option>
            </select>
          </div>

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
            <button
              onClick={resetFilters}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2 px-3 rounded-lg border border-slate-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
              title="Reset category, region, and date filters to default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Total Products</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{products.length}</p>
          <div className="mt-2 text-[11px] text-slate-500">SKUs in active catalog</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Active Products</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {products.filter((p) => p.stock > 0).length}
          </p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">In stock inventory</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Total Revenue</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">₹ 12.4 Cr</p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">+12.5% vs target</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs text-slate-500">Avg. Rating</p>
          <div className="flex items-center space-x-1.5 mt-1">
            <p className="text-2xl font-bold text-slate-900">4.2</p>
            <div className="flex text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Based on 14,280 reviews</div>
        </div>
      </div>

      {/* Product Performance Visualizer */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Product Performance</h2>
            <p className="text-[11px] text-slate-500">Revenue (₹ Cr) vs Units Sold</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center space-x-1.5 text-blue-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Revenue (₹ Cr)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-indigo-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Units Sold (k)</span>
            </span>
          </div>
        </div>

        {/* Dual Bar Chart */}
        <div className="h-52 w-full flex items-end justify-around px-2 pt-6 pb-2 border-b border-slate-100">
          {filteredProducts.slice(0, 6).map((item, idx) => {
            const revHeight = Math.min(130, (item.revenue / 3.5) * 120);
            const unitsHeight = Math.min(130, (item.unitsSold / 3500) * 120);

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="flex items-end gap-1.5 h-36">
                  <div
                    style={{ height: `${revHeight}px` }}
                    className="w-6 bg-blue-600 hover:bg-blue-700 rounded-t-sm transition-all relative group"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1 shadow border rounded">
                      ₹{item.revenue} Cr
                    </span>
                  </div>
                  <div
                    style={{ height: `${unitsHeight}px` }}
                    className="w-6 bg-indigo-400 hover:bg-indigo-500 rounded-t-sm transition-all relative group"
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-1 shadow border rounded">
                      {item.unitsSold} units
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-600 font-medium max-w-[80px] truncate text-center mt-1">
                  {item.name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing Products Table with CRUD */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Product Catalog Operations ({filteredProducts.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">Units Sold</th>
                <th className="py-2.5 px-3 text-right">Stock (Update)</th>
                <th className="py-2.5 px-3 text-right">Rating</th>
                <th className="py-2.5 px-3 text-right">Growth</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-400">{p.id}</span>
                    <span>{p.name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{p.category}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">₹ {p.revenue} Cr</td>
                  <td className="py-3 px-3 text-right text-slate-600">{p.unitsSold.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <span className="font-mono text-slate-700 font-semibold">{p.stock}</span>
                      <button
                        onClick={() => updateProduct(p.id, { stock: p.stock + 10 })}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          userRole === 'Admin' || userRole === 'Platform Admin'
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                        title={
                          userRole === 'Admin' || userRole === 'Platform Admin'
                            ? 'Add 10 to stock (Direct Admin Update)'
                            : 'Request +10 stock change (Queues request for Admin approval)'
                        }
                      >
                        +10
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                      ★ {p.rating}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-600 font-semibold">+{p.growth}%</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className={`p-1 rounded transition-colors cursor-pointer ${
                        userRole === 'Admin' || userRole === 'Platform Admin'
                          ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          : 'text-amber-500 hover:text-amber-700 hover:bg-amber-50'
                      }`}
                      title={
                        userRole === 'Admin' || userRole === 'Platform Admin'
                          ? 'Delete SKU (Direct Admin Delete)'
                          : 'Request SKU Deletion (Queues request for Admin approval)'
                      }
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SKU Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Add New Catalog SKU</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">SKU Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Wireless ANC Earbuds Pro"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Office">Home & Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Revenue (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newRevenue}
                    onChange={(e) => setNewRevenue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Units Sold</label>
                  <input
                    type="number"
                    required
                    value={newUnits}
                    onChange={(e) => setNewUnits(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    max="5.0"
                    min="1.0"
                    required
                    value={newRating}
                    onChange={(e) => setNewRating(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                  />
                </div>
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
                  Save SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
