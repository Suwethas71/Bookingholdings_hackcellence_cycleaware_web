import { Clock, IndianRupee, MapPin, Plus, Check } from 'lucide-react';
import { useTrip } from '../context/TripContext';

const categoryColors = {
  MONUMENT: 'bg-amber-100 text-amber-800 border-amber-200',
  RELIGIOUS: 'bg-orange-100 text-orange-800 border-orange-200',
  NATURE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  BEACH: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  HERITAGE: 'bg-purple-100 text-purple-800 border-purple-200',
  SCENIC: 'bg-teal-100 text-teal-800 border-teal-200',
};

const categoryEmoji = {
  MONUMENT: '🏛️',
  RELIGIOUS: '🛕',
  NATURE: '🌿',
  BEACH: '🏖️',
  HERITAGE: '🏯',
  SCENIC: '🌅',
};

export default function DestinationCard({ destination }) {
  const { addDestination, removeDestination, isSelected } = useTrip();
  const selected = isSelected(destination.id);

  const handleToggle = () => {
    if (selected) {
      removeDestination(destination.id);
    } else {
      addDestination(destination);
    }
  };

  const highlights = destination.highlights ? destination.highlights.split(',').slice(0, 3) : [];

  return (
    <div
      className={`group bg-white rounded-3xl overflow-hidden transition-all duration-300 border-2 flex flex-col justify-between ${
        selected
          ? 'border-lavender-500 shadow-xl shadow-lavender-100 ring-4 ring-lavender-100'
          : 'border-gray-100 hover:border-lavender-200 hover:shadow-xl'
      }`}
    >
      <div>
        {/* Destination Image with Badge */}
        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop';
            }}
          />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm backdrop-blur-md ${
                categoryColors[destination.category] || 'bg-gray-100 text-gray-800 border-gray-200'
              }`}
            >
              <span>{categoryEmoji[destination.category] || '📍'}</span>
              <span>{destination.categoryLabel || destination.category}</span>
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-gray-600 shadow-sm border border-gray-200">
              Demo Data
            </span>
          </div>

          {selected && (
            <div className="absolute inset-0 bg-lavender-900/20 backdrop-blur-[1px] flex items-center justify-center transition-opacity">
              <div className="bg-lavender-600 text-white rounded-full p-3 shadow-lg transform scale-110">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-extrabold text-gray-900 text-lg leading-snug group-hover:text-lavender-600 transition-colors">
              {destination.name}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-3">
            <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
            <span className="truncate">{destination.location}</span>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
            {destination.description}
          </p>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {highlights.map((h, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-gray-50 text-gray-600 px-2.5 py-1 rounded-md border border-gray-200"
                >
                  {h.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Meta Details Row */}
          <div className="grid grid-cols-2 gap-2 py-3 px-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs mb-4">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span className="font-medium">{destination.estimatedDuration}</span>
            </div>
            <div className="flex items-center justify-end gap-1 font-bold">
              <IndianRupee className="w-3.5 h-3.5 text-lavender-600" />
              <span className={destination.entryFee === 0 ? 'text-emerald-700' : 'text-gray-900'}>
                {destination.entryFee === 0 ? 'Free Entry' : `₹${destination.entryFee}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={handleToggle}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            selected
              ? 'bg-lavender-600 hover:bg-lavender-700 text-white shadow-md shadow-lavender-200'
              : 'bg-lavender-50 hover:bg-lavender-100 text-lavender-800 border border-lavender-200'
          }`}
        >
          {selected ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Selected for Trip</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Trip</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

