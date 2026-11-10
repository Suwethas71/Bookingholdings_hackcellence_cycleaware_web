import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Sparkles, User, LogIn, LogOut } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { selectedDestinations } = useTrip();
  const { user, cycleProfile, logout, openCycleModal } = useAuth();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore 19 Attractions' },
    { to: '/itinerary', label: '✨ AI Itinerary' },
    { to: '/budget', label: 'Budget Planner' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-lavender-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lavender-600 via-teal-500 to-coral-400 flex items-center justify-center text-white shadow-md shadow-lavender-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-lavender-600 to-teal-700 bg-clip-text text-transparent">
                CycleAware
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 bg-lavender-100 text-lavender-800 rounded-full border border-lavender-200">
                Phase 3 AI
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-xs sm:text-sm font-semibold transition-colors ${
                  location.pathname === to
                    ? 'text-lavender-700 border-b-2 border-lavender-600 pb-1'
                    : 'text-gray-600 hover:text-lavender-600'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side: Cart + Auth State */}
          <div className="hidden md:flex items-center gap-3">
            {/* Trip Cart */}
            <Link
              to="/explore"
              className="relative flex items-center gap-1.5 bg-lavender-50 hover:bg-lavender-100 text-lavender-800 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border border-lavender-200 transition-all"
            >
              <Heart className="w-4 h-4 text-coral-500 fill-coral-500" />
              <span>Trip Cart</span>
              {selectedDestinations.length > 0 && (
                <span className="ml-1 w-5 h-5 bg-lavender-600 text-white text-xs rounded-full flex items-center justify-center font-black">
                  {selectedDestinations.length}
                </span>
              )}
            </Link>

            {/* Auth Controls */}
            {user ? (
              <div className="flex items-center gap-2.5">
                {user.gender === 'FEMALE' && (
                  <button
                    onClick={openCycleModal}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-coral-50 text-coral-700 border border-coral-200 hover:bg-coral-100 transition"
                    title="CycleAware Comfort Settings"
                  >
                    <span>🌸</span>
                    <span>{cycleProfile ? 'CycleAware Active' : 'Set Comfort'}</span>
                  </button>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all"
                >
                  <User className="w-3.5 h-3.5 text-lavender-600" />
                  <span className="truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-bold text-gray-700 hover:text-lavender-700 transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-lavender-600 to-teal-600 hover:from-lavender-700 hover:to-teal-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-lavender-200 hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2.5">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                  location.pathname === to
                    ? 'bg-lavender-50 text-lavender-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-bold text-gray-800 bg-gray-50"
                  >
                    👤 Profile: {user.name} ({user.gender})
                  </Link>
                  {user.gender === 'FEMALE' && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        openCycleModal();
                      }}
                      className="text-left px-3 py-2 rounded-lg text-sm font-bold text-coral-700 bg-coral-50"
                    >
                      🌸 Configure CycleAware Preferences
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="text-left px-3 py-2 rounded-lg text-sm font-bold text-rose-600 hover:bg-rose-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-2 rounded-xl text-sm font-bold border border-gray-200 text-gray-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="text-center py-2 rounded-xl text-sm font-bold bg-lavender-600 text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
