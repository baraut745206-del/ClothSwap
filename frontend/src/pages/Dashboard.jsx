import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Mail, MapPin, Package, UserCheck, Repeat, Check, X, Send } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [myItems, setMyItems] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [itemsRes, swapsRes] = await Promise.all([
        API.get('/items'),
        API.get('/swaps/my-swaps')
      ]);

      const filteredItems = itemsRes.data.filter(
        (item) => item.owner?._id === user?._id || item.owner === user?._id
      );
      setMyItems(filteredItems);
      setSwaps(swapsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleStatusUpdate = async (swapId, status) => {
    setActionLoading(true);
    try {
      await API.put(`/swaps/${swapId}/status`, { status });
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update swap request status.');
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <p className="text-gray-500 font-medium">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const incomingSwaps = swaps.filter((s) => s.receiver?._id === user._id);
  const outgoingSwaps = swaps.filter((s) => s.requester?._id === user._id);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* User Info Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-2xl shadow-inner">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <UserCheck className="w-3.5 h-3.5" /> Verified Member
              </span>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-500 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-gray-400" />
                {user.email}
              </span>
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {user.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Incoming Swap Requests Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Repeat className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">Incoming Swap Proposals</h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
              {incomingSwaps.length} Requests
            </span>
          </div>

          {incomingSwaps.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No incoming swap requests yet.</p>
          ) : (
            <div className="space-y-4">
              {incomingSwaps.map((swap) => (
                <div
                  key={swap._id}
                  className="p-5 rounded-2xl border border-gray-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-center md:text-left flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      <span className="text-emerald-700 font-bold">{swap.requester?.name}</span> offered{' '}
                      <strong className="text-gray-900">{swap.offeredItem?.title}</strong> in exchange for your{' '}
                      <strong className="text-gray-900">{swap.requestedItem?.title}</strong>.
                    </p>
                    {swap.message && (
                      <p className="text-xs text-gray-500 italic bg-white p-2 rounded-lg border border-gray-100">
                        "{swap.message}"
                      </p>
                    )}
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                      swap.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                      swap.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      Status: {swap.status || 'Pending'}
                    </span>
                  </div>

                  {(!swap.status || swap.status === 'Pending') && (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusUpdate(swap._id, 'Accepted')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusUpdate(swap._id, 'Rejected')}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Outgoing Swap Requests Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Sent Swap Proposals (Outgoing)</h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
              {outgoingSwaps.length} Sent
            </span>
          </div>

          {outgoingSwaps.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">You haven't sent any swap proposals yet.</p>
          ) : (
            <div className="space-y-4">
              {outgoingSwaps.map((swap) => (
                <div
                  key={swap._id}
                  className="p-5 rounded-2xl border border-gray-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="space-y-1 text-center md:text-left flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      You proposed your <strong className="text-gray-900">{swap.offeredItem?.title}</strong> to{' '}
                      <span className="text-emerald-700 font-bold">{swap.receiver?.name}</span> for their{' '}
                      <strong className="text-gray-900">{swap.requestedItem?.title}</strong>.
                    </p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                      swap.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                      swap.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      Status: {swap.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Listed Items Section */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-900">My Listed Clothing Items</h2>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
              {myItems.length} {myItems.length === 1 ? 'Item' : 'Items'} Listed
            </span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-400 font-medium">Loading your listings...</div>
          ) : myItems.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              You have not listed any items yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="h-44 w-full bg-gray-100 relative">
                    <img
                      src={
                        item.images?.[0]?.includes('photo-1521572267360')
                          ? 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
                          : item.images?.[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-600 text-white">
                      {item.size}
                    </span>
                    {item.status === 'Swapped' && (
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[11px] font-black bg-purple-600 text-white shadow">
                        SWAPPED
                      </span>
                    )}
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{item.brand}</span>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h4>
                    </div>
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500">{item.condition}</span>
                      <span className="font-extrabold text-gray-900">₹{item.estimatedValue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}