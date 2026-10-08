import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shirt, LogOut, User, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-emerald-600 font-extrabold text-2xl tracking-tight">
          <div className="p-1.5 bg-emerald-50 rounded-xl">
            <Shirt className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-gray-900 font-black">Cloth<span className="text-emerald-600">Swap</span></span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-5">
          <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium text-sm transition">
            Explore Items
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/add-item"
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List an Item</span>
              </Link>
              
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl text-sm font-semibold transition"
              >
                <User className="w-4 h-4 text-gray-500" />
                <span>{user.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-gray-400 hover:text-red-600 p-2 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-700 hover:text-emerald-600 font-semibold text-sm px-3 py-2 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm shadow-emerald-500/20 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}