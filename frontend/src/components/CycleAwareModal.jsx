import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, Sparkles, X, Calendar, Activity, Zap, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function CycleAwareModal() {
  const { showCycleModal, closeCycleModal, saveCycleProfile, cycleProfile, user } = useAuth();
  const [step, setStep] = useState(cycleProfile ? 'FORM' : 'OPT_IN');
  const [loading, setLoading] = useState(false);

  // Form State
  const [lastPeriodDate, setLastPeriodDate] = useState(
    cycleProfile?.lastPeriodDate || new Date().toISOString().split('T')[0]
  );
  const [cycleLength, setCycleLength] = useState(cycleProfile?.cycleLength || 28);
  const [symptomSeverity, setSymptomSeverity] = useState(cycleProfile?.symptomSeverity || 'MODERATE');
  const [preferredPace, setPreferredPace] = useState(cycleProfile?.preferredPace || 'MODERATE');

  if (!showCycleModal) return null;

  const handleEnable = () => {
    setStep('FORM');
  };

  const handleSkip = () => {
    closeCycleModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await saveCycleProfile({
      lastPeriodDate,
      cycleLength: parseInt(cycleLength, 10),
      symptomSeverity,
      preferredPace,
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-lavender-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={closeCycleModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'OPT_IN' ? (
          /* STEP 1: OPT-IN PROMPT */
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-coral-400 via-lavender-500 to-teal-400 flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-coral-100">
              <Heart className="w-8 h-8 fill-white" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-700 text-xs font-bold uppercase tracking-wider mb-3 border border-coral-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CycleAware Travel Assistant</span>
            </div>

            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">
              Personalize Travel Comfort
            </h2>

            {/* Exact Required Text */}
            <div className="bg-lavender-50/80 border border-lavender-200 rounded-2xl p-4 mb-6">
              <p className="text-sm font-bold text-lavender-900 leading-relaxed">
                "Optional: Personalize your travel comfort without compromising your trip."
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
              Planning group or solo travel from Coimbatore to Kanniyakumari? Share your comfort preferences so we can dynamically adjust walking intensity, suggest scenic rest points, and plan flexible itinerary pace without forcing you to cancel activities.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleSkip}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={handleEnable}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-lavender-600 via-purple-600 to-teal-600 hover:from-lavender-700 hover:to-teal-700 shadow-md shadow-lavender-200 hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>Enable CycleAware</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-gray-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>100% private. Stored in dedicated normalized table.</span>
            </p>
          </div>
        ) : (
          /* STEP 2: PREFERENCES FORM */
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-lavender-100 text-lavender-700 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-lavender-500 text-lavender-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 leading-tight">
                  CycleAware Preferences
                </h2>
                <p className="text-xs text-gray-500">
                  Customized for {user?.name || 'traveller'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Last Period Date */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-lavender-600" />
                  Last Period Start Date
                </label>
                <input
                  type="date"
                  required
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-lavender-300"
                />
              </div>

              {/* Cycle Length */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Average Cycle Length (Days)</span>
                  <span className="text-lavender-700 font-extrabold">{cycleLength} days</span>
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {[24, 26, 28, 30, 32].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCycleLength(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        cycleLength === num
                          ? 'bg-lavender-600 text-white border-lavender-600 shadow-sm'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {num}d
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="21"
                  max="40"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
                  className="w-full accent-lavender-600 cursor-pointer"
                />
              </div>

              {/* Symptom Severity */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-coral-500" />
                  Typical Symptom Severity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'LOW', label: 'Low', desc: 'Mild / active' },
                    { value: 'MODERATE', label: 'Moderate', desc: 'Balanced' },
                    { value: 'HIGH', label: 'High', desc: 'Need rest breaks' },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSymptomSeverity(s.value)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        symptomSeverity === s.value
                          ? 'border-lavender-500 bg-lavender-50/70 font-bold text-lavender-900 ring-1 ring-lavender-300'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Pace */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                  Preferred Travel Pace
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'RELAXED', label: 'Relaxed', desc: 'Scenic cafes & calm' },
                    { value: 'MODERATE', label: 'Moderate', desc: 'Sightseeing & walks' },
                    { value: 'ACTIVE', label: 'Active', desc: 'Treks & waterfalls' },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPreferredPace(p.value)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        preferredPace === p.value
                          ? 'border-teal-500 bg-teal-50/70 font-bold text-teal-900 ring-1 ring-teal-300'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{p.label}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCycleModal}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-lavender-600 to-teal-600 hover:from-lavender-700 hover:to-teal-700 shadow-md shadow-lavender-200 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

