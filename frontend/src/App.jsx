import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AddItem from './pages/AddItem.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ItemDetails from './pages/ItemDetails.jsx';
import API from './services/api.js';
import Admin from './pages/Admin.jsx';
import Calculator from './pages/Calculator.jsx';
import Chat from './pages/Chat.jsx';
import { Sparkles, ArrowRight, MapPin, Repeat, Search, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get('/items');
        setItems(res.data);
      } catch (err) {
        console.error('Failed to load items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const categories = ['All', 'Men', 'Women', 'Kids', 'Unisex', 'Accessories'];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 pb-20">
      {/* Hero Banner */}
      <section className="w-full bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-gray-100 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Sustainable Fashion Marketplace
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Swap Clothes, <span className="text-emerald-600">Save Planet</span>, Stay Stylish.
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Exchange your gently-used fashion directly with verified people in your community.
          </p>
          <div className="pt-2">
            <Link
              to="/add-item"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md transition inline-flex items-center gap-2 text-sm"
            >
              Start Swapping Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Grid Wrapper */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Search & Filter Card */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/70 shadow-sm mb-6 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, brand, or city..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Header with Title and Counter */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-black text-gray-900">Explore Available Items</h2>
            <p className="text-xs text-gray-500">Fresh clothes listed by community members</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
            {filteredItems.length} {filteredItems.length === 1 ? 'Item' : 'Items'} Found
          </span>
        </div>

        {/* Clothing Items Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 font-medium">Loading items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-gray-500 text-sm mb-3">No matching items found.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-xs font-bold text-emerald-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group relative"
              >
                <Link to={`/items/${item._id}`} className="block">
                  <div className="h-48 w-full bg-gray-100 overflow-hidden relative cursor-pointer">
                    <img
                      src={
                        item.images?.[0]?.includes('photo-1521572267360')
                          ? 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
                          : item.images?.[0] || 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-gray-800 shadow-sm">
                      {item.condition}
                    </div>
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[11px] font-black bg-emerald-600 text-white">
                      {item.size}
                    </div>
                    {item.status === 'Swapped' && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Swapped
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <Link to={`/items/${item._id}`}>
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                        <span className="text-emerald-700">{item.brand}</span>
                        <span>{item.category}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1 hover:text-emerald-600 transition">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                  </Link>

                  <div className="space-y-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {item.location}
                      </span>
                      <span className="text-sm font-extrabold text-gray-900">₹{item.estimatedValue}</span>
                    </div>

                    <Link
                      to={`/items/${item._id}`}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        item.status === 'Swapped'
                          ? 'bg-gray-100 text-gray-400 pointer-events-none'
                          : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white'
                      }`}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      {item.status === 'Swapped' ? 'Already Swapped' : 'View Details & Swap'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-slate-50">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  );
}