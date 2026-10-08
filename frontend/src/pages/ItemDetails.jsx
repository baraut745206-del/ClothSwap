import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, MapPin, Tag, Repeat, AlertCircle, CheckCircle, X } from 'lucide-react';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Swap modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myItems, setMyItems] = useState([]);
  const [selectedMyItemId, setSelectedMyItemId] = useState('');
  const [message, setMessage] = useState('');
  const [submittingSwap, setSubmittingSwap] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Item details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchItemDetails();
  }, [id]);

  const openSwapModal = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setModalError('');
    setIsModalOpen(true);

    try {
      const res = await API.get('/items');
      const mine = res.data.filter(
        (it) => it.owner?._id === user._id || it.owner === user._id
      );
      setMyItems(mine);
      if (mine.length > 0) {
        setSelectedMyItemId(mine[0]._id);
      }
    } catch (err) {
      console.error('Failed to load user items:', err);
    }
  };

  const handleSendSwap = async (e) => {
    e.preventDefault();
    if (!selectedMyItemId) {
      setModalError('Please select one of your items to offer.');
      return;
    }

    setSubmittingSwap(true);
    setModalError('');

    try {
      await API.post('/swaps', {
        requestedItemId: item._id,
        offeredItemId: selectedMyItemId,
        message,
      });
      setSwapSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to send swap proposal.');
    } finally {
      setSubmittingSwap(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <p className="text-gray-400 font-medium">Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-slate-50 p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        <p className="text-gray-700 font-bold mb-4">{error || 'Item not found.'}</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  const isOwner = user && (user._id === item.owner?._id || user._id === item.owner);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </button>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-10">
          {/* Image Side */}
          <div className="space-y-4">
            <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-gray-100 relative border border-gray-100">
              <img
                src={
                  item.images?.[0]?.includes('photo-1521572267360')
                    ? 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
                    : item.images?.[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
                }
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-bold bg-white/95 text-gray-800 shadow-sm">
                {item.condition}
              </span>
              <span className="absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-black bg-emerald-600 text-white shadow-sm">
                Size: {item.size}
              </span>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  {item.brand} • {item.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">{item.title}</h1>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b border-gray-100">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {item.location}
                </span>
                <span className="font-extrabold text-gray-900 text-lg">
                  Est. ₹{item.estimatedValue}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Item Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-gray-100">
                  {item.description}
                </p>
              </div>

              {item.swapFor && (
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Owner Preference</h3>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-100">
                    <Tag className="w-3.5 h-3.5" />
                    Looking to swap for: {item.swapFor}
                  </div>
                </div>
              )}
            </div>

            {/* Action Area */}
            <div className="pt-4 border-t border-gray-100">
              {isOwner ? (
                <div className="p-3 bg-gray-50 text-gray-500 rounded-xl text-center text-xs font-medium">
                  This item was listed by you.
                </div>
              ) : (
                <button
                  onClick={openSwapModal}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <Repeat className="w-4 h-4" />
                  Propose Swap Offer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Propose Swap Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-gray-900 mb-1">Make a Swap Offer</h3>
            <p className="text-xs text-gray-500 mb-4">
              Select one of your items to exchange for <strong>{item.title}</strong>
            </p>

            {swapSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900 text-sm">Offer Sent Successfully!</h4>
                <p className="text-xs text-emerald-700">The owner will review your offer in their dashboard.</p>
              </div>
            ) : myItems.length === 0 ? (
              <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
                <p className="text-xs text-amber-800 font-semibold">
                  You need to list at least one item before proposing a swap.
                </p>
                <Link
                  to="/add-item"
                  className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  List an Item Now
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSendSwap} className="space-y-4">
                {modalError && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl font-medium">
                    {modalError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Select Your Item to Offer
                  </label>
                  <select
                    value={selectedMyItemId}
                    onChange={(e) => setSelectedMyItemId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {myItems.map((it) => (
                      <option key={it._id} value={it._id}>
                        {it.title} ({it.brand} - ₹{it.estimatedValue})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Message to Owner (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Hi, my item is barely worn and I would love to trade with your jacket!"
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submittingSwap}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 text-xs transition disabled:opacity-50"
                >
                  {submittingSwap ? 'Sending Offer...' : 'Confirm & Send Swap Offer'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}