import { useState, useEffect } from 'react';
import API from '../services/api';
import { ShieldCheck, Trash2, Users, Package, RefreshCw } from 'lucide-react';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await API.get('/items');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;
    try {
      await API.delete(`/items/${id}`);
      setItems((prev) => prev.filter((item) => item._id !== id));
      alert('Item removed successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">Admin Control Center</h1>
              <p className="text-xs text-gray-500">Manage platform listings, monitor activity, and moderate items</p>
            </div>
          </div>
          <button
            onClick={fetchItems}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl inline-flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Listings</p>
              <p className="text-xl font-black text-gray-900">{items.length}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Swapped Items</p>
              <p className="text-xl font-black text-gray-900">
                {items.filter((i) => i.status === 'Swapped').length}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">System Status</p>
              <p className="text-xl font-black text-emerald-600">Active</p>
            </div>
          </div>
        </div>

        {/* Listings Moderation Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Active Listings Moderation</h2>
            <span className="text-xs font-bold text-gray-500">{items.length} Records</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-semibold text-gray-400">Loading listings...</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">No listings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Value</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{item.title}</div>
                        <div className="text-[11px] text-gray-400">{item.brand || 'No Brand'}</div>
                      </td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3 font-semibold">₹{item.estimatedValue}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Swapped'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.status || 'Available'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{item.location}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg font-bold transition inline-flex items-center gap-1 text-[11px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}