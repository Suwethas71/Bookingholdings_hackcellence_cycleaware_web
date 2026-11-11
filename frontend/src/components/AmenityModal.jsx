import { useState, useEffect } from 'react';
import { amenitiesApi } from '../api/axios';
import { X, MapPin, Star, Navigation, Loader2, AlertCircle, Footprints } from 'lucide-react';

const BADGE_META = {
  pharmacy: {
    title: 'Nearby Sanitary Supplies & Pharmacies',
    subtitle: 'Verified medical stores and chemists within 1.5 km radius',
    icon: '🛍️',
    headerBg: 'from-indigo-600 to-lavender-600',
    tagStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  restroom: {
    title: 'Nearby Clean Washrooms & Restrooms',
    subtitle: 'Public comfort stations & changing facilities within 1.5 km',
    icon: '🚻',
    headerBg: 'from-teal-600 to-emerald-600',
    tagStyle: 'bg-teal-50 text-teal-800 border-teal-200',
  },
  hospital: {
    title: 'Nearby Clinics & Medical Support',
    subtitle: 'Emergency care & women-friendly health centers within 1.5 km',
    icon: '🏥',
    headerBg: 'from-rose-600 to-coral-500',
    tagStyle: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  hydration: {
    title: 'Nearby Hydration & Refreshment Stations',
    subtitle: 'Tender coconut vendors, fresh juice stalls & shaded cafes',
    icon: '🥥',
    headerBg: 'from-amber-500 to-orange-500',
    tagStyle: 'bg-amber-50 text-amber-800 border-amber-200',
  },
};

export default function AmenityModal({ isOpen, onClose, lat, lng, badgeType, destinationName }) {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !badgeType) return;

    let isMounted = true;
    const targetLat = lat ?? 8.0883;
    const targetLng = lng ?? 77.5385;

    async function fetchAmenities() {
      setLoading(true);
      setError('');
      setAmenities([]);
      try {
        const res = await amenitiesApi.getNearby(targetLat, targetLng, badgeType);
        if (isMounted) {
          setAmenities(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error('Failed to load nearby amenities:', err);
        if (isMounted) {
          setError('Unable to reach amenities service. Ensure Spring Boot backend is running on port 8080.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAmenities();
    return () => {
      isMounted = false;
    };
  }, [isOpen, lat, lng, badgeType]);

  if (!isOpen) return null;

  const meta = BADGE_META[badgeType] || BADGE_META.restroom;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden border border-lavender-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${meta.headerBg} p-6 text-white relative`}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="flex items-center gap-3 pr-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
              {meta.icon}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                {destinationName ? `Near ${destinationName}` : 'Live Google Maps Places'}
              </span>
              <h3 className="text-lg sm:text-xl font-black leading-tight">
                {meta.title}
              </h3>
              <p className="text-xs text-white/90 mt-0.5">{meta.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 bg-cream/40 flex-1">
          {/* Loading State */}
          {loading && (
            <div className="py-14 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-lavender-600 animate-spin mb-3" />
              <p className="text-sm font-bold text-gray-800">
                Searching nearby locations around ({Number(lat || 8.0883).toFixed(4)}, {Number(lng || 77.5385).toFixed(4)})...
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Calculating real-time walking distance & comfort tags
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-sm mb-1">Could Not Fetch Nearby Amenities</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && amenities.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">
              No matching amenities found within 1.5 km radius.
            </div>
          )}

          {/* Amenity Result Cards */}
          {!loading && !error && amenities.length > 0 && (
            <div className="space-y-4">
              {amenities.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 border border-gray-200/80 hover:border-lavender-300 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-black text-base text-gray-900 leading-snug">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                        <span>{item.address}</span>
                      </div>
                    </div>

                    {/* Star Rating Pill */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black self-start flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating ? item.rating.toFixed(1) : '4.2'}</span>
                    </div>
                  </div>

                  {/* Comfort Tags Micro-Badges */}
                  {item.comfortTags && item.comfortTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 my-3">
                      {item.comfortTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${meta.tagStyle}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Walking Distance, Duration & Google Maps CTA */}
                  <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                      <Footprints className="w-4 h-4 text-lavender-600 flex-shrink-0" />
                      <span>
                        <strong className="text-gray-900 font-black">{item.walkingDistance}</strong>
                        <span className="mx-1.5 text-gray-300">•</span>
                        <strong className="text-teal-700 font-black">{item.walkingDuration}</strong>
                      </span>
                    </div>

                    <a
                      href={item.googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-lavender-700 text-white text-xs font-extrabold shadow-sm transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Get Walking Directions 🗺️</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>Coordinates: {Number(lat || 8.0883).toFixed(4)}, {Number(lng || 77.5385).toFixed(4)} • Radius: 1.5 km</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

