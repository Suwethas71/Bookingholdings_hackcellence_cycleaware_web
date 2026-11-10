import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Calendar, Activity, Zap, ShieldCheck, Edit3, LogOut, ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

export default function ProfilePage() {
  const { user, cycleProfile, logout, openCycleModal } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fdfaf4] pt-24 items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-lg border border-gray-100">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-black text-gray-800 mb-2">Sign in Required</h2>
          <p className="text-xs text-gray-500 mb-6">Please log in to view your travel profile and preferences.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 rounded-xl bg-lavender-600 text-white font-bold text-xs"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  const isFemale = user.gender === 'FEMALE';

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf4] pt-20">
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-lavender-700 hover:text-lavender-900 font-bold text-xs uppercase tracking-wider mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Traveller Profile</span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors w-fit"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-lavender-100">
            <h3 className="font-extrabold text-base text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-lavender-600" />
              <span>Identity & Account</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Self-Identified Gender</span>
                <span className="font-bold text-gray-900">{user.gender}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">Account Status</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 font-semibold">CycleAware Module</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${isFemale ? 'text-coral-700 bg-coral-50' : 'text-gray-600 bg-gray-100'}`}>
                  {isFemale ? (cycleProfile ? 'Configured ✓' : 'Available (Not set)') : 'Not applicable'}
                </span>
              </div>
            </div>
          </div>

          {/* CycleAware Preferences Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-lavender-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-coral-500 fill-coral-500" />
                  <span>CycleAware Preferences</span>
                </h3>
                {isFemale && (
                  <button
                    onClick={openCycleModal}
                    className="text-xs font-bold text-lavender-700 hover:text-lavender-900 flex items-center gap-1 bg-lavender-50 px-2.5 py-1 rounded-lg"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{cycleProfile ? 'Update' : 'Configure'}</span>
                  </button>
                )}
              </div>

              {!isFemale ? (
                <div className="p-6 text-center bg-gray-50 rounded-2xl text-xs text-gray-500">
                  CycleAware comfort tracking is tailored for female travellers. Standard itinerary planning is fully enabled.
                </div>
              ) : cycleProfile ? (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-lavender-600" />
                      Last Period Start Date
                    </span>
                    <span className="font-black text-gray-800">{cycleProfile.lastPeriodDate}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-semibold">Average Cycle Length</span>
                    <span className="font-black text-lavender-700">{cycleProfile.cycleLength} Days</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-semibold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-coral-500" />
                      Typical Symptom Severity
                    </span>
                    <span className="font-black text-coral-700 bg-coral-50 px-2.5 py-0.5 rounded-full border border-coral-200">
                      {cycleProfile.symptomSeverity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-semibold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-teal-600" />
                      Preferred Travel Pace
                    </span>
                    <span className="font-black text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      {cycleProfile.preferredPace}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center bg-lavender-50/70 border border-lavender-100 rounded-2xl">
                  <p className="text-xs text-gray-600 mb-3">
                    You haven't configured your cycle comfort preferences yet.
                  </p>
                  <button
                    onClick={openCycleModal}
                    className="py-2 px-4 rounded-xl font-bold text-xs text-white bg-lavender-600 hover:bg-lavender-700 shadow-sm transition"
                  >
                    Set Up Preferences
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Isolated in normalized `cycle_profiles` table</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

