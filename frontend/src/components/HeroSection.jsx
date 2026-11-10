import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRight, Star, Users, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-lavender-50 via-[#fdfaf4] to-teal-50 pt-20 pb-16">
      {/* Decorative blurred background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-lavender-300/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-coral-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Intro */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-lavender-100/90 text-lavender-800 border border-lavender-200 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-lavender-600" />
              CycleAware · Travel Without Compromise
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6">
              AI-Powered Travel Personalisation for{' '}
              <span className="bg-gradient-to-r from-lavender-600 via-teal-600 to-coral-500 bg-clip-text text-transparent">
                Every Journey
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl">
              Planning a group or solo trip from <strong>Coimbatore to Kanniyakumari</strong>? Discover 19 iconic attractions, compare train, bus, and car costs, compute per-person budgets, and prepare for our upcoming menstrual-aware comfort itinerary engine.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                onClick={() => navigate('/explore')}
                className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-lavender-600 via-purple-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-lg shadow-lavender-300 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Explore 19 Attractions</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/budget')}
                className="flex items-center justify-center gap-2 bg-white text-gray-800 border-2 border-lavender-200 hover:border-lavender-400 px-8 py-4 rounded-2xl font-bold text-base hover:bg-lavender-50 transition-all shadow-sm"
              >
                <span>Calculate Trip Budget</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200/80">
              <div>
                <div className="text-3xl font-black text-gray-900">19</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attractions</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900">6</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-black text-teal-600">₹1,000+</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fares Verified</div>
              </div>
            </div>
          </div>

          {/* Right Column: Route Showcase Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-7 shadow-2xl border border-lavender-100 relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-700">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Route</span>
                    <h3 className="font-bold text-gray-900 text-base">Coimbatore → Kanniyakumari</h3>
                  </div>
                </div>
                <span className="px-3 py-1 bg-teal-50 text-teal-700 font-bold text-xs rounded-full border border-teal-200">
                  NH 44 Corridor
                </span>
              </div>

              {/* Sample Destination Pills */}
              <div className="space-y-3 mb-6">
                {[
                  { name: 'Sunrise Point', tag: 'Scenic', fee: 'Free', icon: '🌅' },
                  { name: 'Thiruvalluvar Statue & Memorial', tag: 'Monument', fee: '₹70', icon: '🗿' },
                  { name: 'Vivekananda Rock Memorial', tag: 'Heritage', fee: '₹70', icon: '🏯' },
                  { name: 'Thirparappu Waterfalls', tag: 'Nature', fee: '₹10', icon: '🌊' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-lavender-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.tag}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-lavender-700 bg-lavender-50 px-2.5 py-1 rounded-lg">
                      {item.fee}
                    </span>
                  </div>
                ))}
              </div>

              {/* Differentiating Feature Teaser */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-lavender-50 via-purple-50 to-teal-50 border border-lavender-200/80">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-coral-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                      Phase 2 Integration Ready
                    </h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Menstrual-cycle comfort & symptom-aware dynamic itineraries for solo & group trips without missing the fun!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

