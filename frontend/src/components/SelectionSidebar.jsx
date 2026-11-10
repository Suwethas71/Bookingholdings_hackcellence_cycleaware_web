import { X, ArrowRight, Trash2, ArrowUpDown, MapPin, IndianRupee, Sparkles } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';

export default function SelectionSidebar() {
  const { selectedDestinations, removeDestination, reorderDestinations, totalEntryFees, travellers } = useTrip();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-lavender-100 p-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
        <div>
          <h2 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
            <span>Your Trip</span>
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
          </h2>
          <span className="text-xs text-gray-400">Coimbatore → Kanniyakumari</span>
        </div>
        <span className="bg-lavender-100 text-lavender-800 text-xs font-black px-3 py-1 rounded-full border border-lavender-200">
          {selectedDestinations.length} selected
        </span>
      </div>

      {/* Selected Items List */}
      {selectedDestinations.length === 0 ? (
        <div className="text-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-2xl mb-4">
          <div className="text-4xl mb-3">📍</div>
          <h4 className="font-bold text-gray-700 text-sm mb-1">No attractions selected yet</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Click <strong>Add to Trip</strong> on any attraction card to add it to your itinerary. Your selections persist across pages!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 mb-5 max-h-[360px] overflow-y-auto pr-1">
          {selectedDestinations.map((dest, idx) => (
            <div
              key={dest.id}
              className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:border-lavender-200 group transition-all"
            >
              {/* Order number */}
              <div className="w-6 h-6 rounded-lg bg-lavender-100 text-lavender-800 font-black text-xs flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </div>

              {/* Title & Fee */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                  {dest.name}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span>{dest.categoryLabel || dest.category}</span>
                  <span>•</span>
                  <span className={dest.entryFee === 0 ? 'text-emerald-600 font-semibold' : 'text-gray-600'}>
                    {dest.entryFee === 0 ? 'Free' : `₹${dest.entryFee}`}
                  </span>
                </div>
              </div>

              {/* Order buttons */}
              <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100">
                {idx > 0 && (
                  <button
                    onClick={() => reorderDestinations(idx, idx - 1)}
                    title="Move up"
                    className="p-1 text-gray-500 hover:text-lavender-700 rounded hover:bg-white text-[10px]"
                  >
                    ▲
                  </button>
                )}
                {idx < selectedDestinations.length - 1 && (
                  <button
                    onClick={() => reorderDestinations(idx, idx + 1)}
                    title="Move down"
                    className="p-1 text-gray-500 hover:text-lavender-700 rounded hover:bg-white text-[10px]"
                  >
                    ▼
                  </button>
                )}
                <button
                  onClick={() => removeDestination(dest.id)}
                  title="Remove"
                  className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Entry Fee Summary Box */}
      <div className="bg-gradient-to-br from-lavender-50 via-purple-50/50 to-teal-50 rounded-2xl p-4 border border-lavender-100 mb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 mb-1">
          <span>Est. Entry Fees Total</span>
          <div className="flex items-center font-black text-gray-900 text-sm">
            <IndianRupee className="w-3.5 h-3.5 text-lavender-600" />
            <span>₹{(totalEntryFees * (travellers || 1)).toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="text-[11px] text-gray-400 flex items-center justify-between">
          <span>₹{totalEntryFees} per person × {travellers || 1} traveller{travellers > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Action Buttons: 1. Generate AI Itinerary (Gemini Engine) */}
      <div className="space-y-2.5">
        <button
          onClick={() => navigate('/itinerary')}
          className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-purple-700 via-lavender-600 to-teal-600 hover:from-purple-800 hover:to-teal-700 text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-200 hover:shadow-xl transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Generate AI Itinerary</span>
        </button>

        {/* 2. Proceed to Budget Planner */}
        <button
          onClick={() => navigate('/budget')}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-lavender-50 hover:bg-lavender-100 text-lavender-800 border border-lavender-200 flex items-center justify-center gap-1.5 transition-all"
        >
          <span>Calculate Budget</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
