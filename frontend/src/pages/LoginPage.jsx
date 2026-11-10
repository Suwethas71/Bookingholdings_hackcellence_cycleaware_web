import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/explore');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf4] pt-20">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-lavender-100 relative overflow-hidden">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lavender-600 via-teal-500 to-coral-400 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-lavender-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
              <p className="text-xs text-gray-500 mt-1">Sign in to access your saved itineraries and comfort preferences.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold bg-gray-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-white bg-gradient-to-r from-lavender-600 via-purple-600 to-teal-600 hover:from-lavender-700 hover:to-teal-700 shadow-md shadow-lavender-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-bold text-lavender-700 hover:text-lavender-900 underline">
                Create one now
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

