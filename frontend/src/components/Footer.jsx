import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-12 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-gray-800">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-lavender-500 to-teal-400 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-white text-xl tracking-tight">CycleAware</span>
            </div>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed mb-4">
              <strong>Travel Without Compromise</strong> — smart travel planning combining destination discovery, separate travel mode pricing, budget calculation, and upcoming menstrual-aware comfort personalization.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/80 text-lavender-300 text-xs font-semibold border border-gray-700">
              <span>Operational Route:</span>
              <strong className="text-white">Coimbatore → Kanniyakumari (19 Attractions)</strong>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-4">Platform Pages</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Dashboard</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">Explore Kanniyakumari</Link>
              </li>
              <li>
                <Link to="/budget" className="hover:text-white transition-colors">Complete Budget Planner</Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-200 mb-4">Phase 1 & Beyond</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>✓ 19 Kanniyakumari Destinations</li>
              <li>✓ Dynamic Search & Filters (Category/Budget)</li>
              <li>✓ Train, Bus & Car Fare Separation</li>
              <li>✓ Shared Per-Person Trip Calculator</li>
              <li className="text-lavender-400 font-bold">→ Phase 2: Menstrual Comfort Profiles</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} CycleAware. Built for travel empowerment. All rates are demonstration estimates.
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-coral-400 fill-coral-400" /> for hackathon travellers
          </p>
        </div>
      </div>
    </footer>
  );
}

