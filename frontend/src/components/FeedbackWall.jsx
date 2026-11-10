import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquareHeart, ShieldCheck, Sparkles, MapPin, Quote, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function StarDisplay({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= count
              ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
              : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function FeedbackWall() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Asynchronous function to fetch live reviews from MySQL via Spring Boot
  const fetchFeedbacks = () => {
    setLoading(true);
    setError(null);
    axios
      .get('http://localhost:8080/api/feedback', { timeout: 5000 })
      .then((response) => {
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setFeedbacks(response.data);
        } else {
          setFeedbacks([]);
        }
      })
      .catch((err) => {
        console.error("AXIOS ERROR:", err);
        setError(err.message + " - Check console for details");
        setFeedbacks([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Bind to useEffect hook so it loads on mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Compute metrics from genuine database records
  const totalReviews = feedbacks.length;
  const avgOverall = totalReviews > 0
    ? (feedbacks.reduce((sum, f) => sum + (f.overallRating || 5), 0) / totalReviews).toFixed(1)
    : '0.0';

  return (
    <section id="reviews" className="py-16 bg-gradient-to-b from-transparent via-purple-50/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider mb-3">
              <MessageSquareHeart className="w-3.5 h-3.5 text-purple-600" />
              <span>Public Feedback Wall · Live Community Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              What Real Travellers Say About CycleAware
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
              Authentic reviews submitted by travellers exploring Coimbatore to Kanniyakumari with personalized comfort and budget planning.
            </p>
          </div>

          {/* Action & Aggregate Rating Pill */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto">
            {/* Primary Manual Fetch Button */}
            <button
              type="button"
              onClick={fetchFeedbacks}
              disabled={loading}
              className="px-4 py-3 rounded-3xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              title="Click to manually query http://localhost:8080/api/feedback"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Fetching...' : 'Load All Reviews'}</span>
            </button>

            <div className="flex items-center gap-4 bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-lavender-100">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900">{avgOverall}</div>
                <div className="flex justify-center text-amber-400 my-0.5">
                  <StarDisplay count={totalReviews > 0 ? Math.round(Number(avgOverall)) : 0} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {totalReviews} {totalReviews === 1 ? 'Verified Review' : 'Verified Reviews'}
                </span>
              </div>
              <div className="border-l border-gray-100 pl-4 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Live Database</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RED ERROR BANNER */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm text-red-900 mb-0.5">Feedback Connection Error</h4>
              <p className="text-xs text-red-700 font-mono mb-2">{error}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-red-600">
                <span>Target: <code>http://localhost:8080/api/feedback</code></span>
                <span>•</span>
                <button
                  type="button"
                  onClick={fetchFeedbacks}
                  className="font-bold underline hover:text-red-900 cursor-pointer"
                >
                  Click to Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-lavender-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-lavender-200" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-lavender-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FEEDBACK CARDS GRID (Live MySQL Submissions) */}
        {!loading && feedbacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((f, idx) => {
              const displayName = f.userName && f.userName.trim() ? f.userName : "Anonymous Traveller";
              const initial = displayName[0].toUpperCase();

              return (
                <div
                  key={f.id || idx}
                  className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-lavender-100 flex flex-col justify-between group hover:border-lavender-300"
                >
                  <div>
                    {/* User Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-lavender-500 to-teal-500 text-white font-black text-sm flex items-center justify-center shadow-md shadow-lavender-200 group-hover:scale-105 transition-transform flex-shrink-0">
                          {initial}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900 leading-snug">
                            {displayName}
                          </h4>
                          <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                            <MapPin className="w-3 h-3 text-teal-600" />
                            <span>Coimbatore ➔ Kanniyakumari</span>
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 flex-shrink-0">
                        Verified Trip
                      </span>
                    </div>

                    {/* Ratings Matrix */}
                    <div className="bg-gray-50/80 rounded-2xl p-3 mb-4 space-y-1.5 border border-gray-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Overall Experience</span>
                        <StarDisplay count={f.overallRating || 5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Destination Accuracy</span>
                        <StarDisplay count={f.destinationAccuracyRating || 5} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-medium">Budget Realism</span>
                        <StarDisplay count={f.budgetCalculatorRating || 5} />
                      </div>
                    </div>

                    {/* Written Comments */}
                    {f.comments && (
                      <div className="relative mb-4">
                        <Quote className="w-5 h-5 text-purple-200 absolute -top-2 -left-1 opacity-60" />
                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-4 italic">
                          "{f.comments}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Suggestion & Date Footer */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    {f.suggestedPlaces && (
                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-1.5">
                        <span className="text-xs">💡</span>
                        <span>
                          <strong>Suggested Attraction:</strong> {f.suggestedPlaces}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                      <span>CycleAware Traveller</span>
                      <span>Review #{f.id || (idx + 1)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && feedbacks.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-lavender-100 shadow-sm max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-lavender-100 text-lavender-600 flex items-center justify-center mx-auto mb-4">
              <MessageSquareHeart className="w-7 h-7" />
            </div>
            <p className="text-base font-bold text-gray-800 mb-2">
              No feedback submitted yet. Be the first to review!
            </p>
            <p className="text-xs text-gray-500 mb-5 max-w-sm mx-auto">
              Share your travel experience, route accuracy, and budget tips to help future travellers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={fetchFeedbacks}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Load All Reviews</span>
              </button>
              <Link
                to="/budget#feedback"
                className="px-6 py-2.5 rounded-xl bg-lavender-600 hover:bg-lavender-700 text-white font-bold text-xs shadow-md inline-flex items-center gap-2 transition"
              >
                <span>Submit Review</span>
                <span>➔</span>
              </Link>
            </div>
          </div>
        )}

        {/* Footer Prompt */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-center">
          <button
            type="button"
            onClick={fetchFeedbacks}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Load All Reviews</span>
          </button>
          <Link
            to="/budget"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-lavender-200 text-lavender-800 hover:bg-lavender-50 font-bold text-xs sm:text-sm shadow-sm transition"
          >
            <span>Have you completed your trip? Leave a review on the Budget Planner</span>
            <span>➔</span>
          </Link>
        </div>
      </div>
    </section>
  );
}



