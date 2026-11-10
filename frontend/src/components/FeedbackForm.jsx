import { useState } from 'react';
import { Star, Send, CheckCircle2, MessageSquareHeart } from 'lucide-react';
import { feedbackApi } from '../api/axios';

function StarRating({ label, value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-100">
      <span className="text-xs sm:text-sm font-bold text-gray-700">{label}</span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-1 focus:outline-none transition-transform hover:scale-125"
          >
            <Star
              className={`w-6 h-6 ${
                star <= (hover || value)
                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FeedbackForm() {
  const [form, setForm] = useState({
    userName: '',
    overallRating: 5,
    destinationAccuracyRating: 5,
    budgetCalculatorRating: 5,
    comments: '',
    suggestedPlaces: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.overallRating) {
      setError('Please provide an overall experience rating.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await feedbackApi.submit(form);
      console.log('Feedback submitted to MySQL:', res.data);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit feedback to backend:', err);
      setError(
        'Submission failed: ' + (err.response?.data?.message || err.message) +
        '. Please ensure the Spring Boot backend is running on http://localhost:8080.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-lavender-100 p-8 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-2">Feedback Received & Saved!</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
          Thank you for helping us polish CycleAware. Your review has been saved to the live database and will appear on the Public Feedback Wall.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/#reviews"
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition inline-block"
          >
            View on Feedback Wall
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setForm({
                userName: '',
                overallRating: 5,
                destinationAccuracyRating: 5,
                budgetCalculatorRating: 5,
                comments: '',
                suggestedPlaces: '',
              });
            }}
            className="text-xs font-bold text-lavender-700 hover:text-lavender-800 underline"
          >
            Submit another review
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-lavender-100 p-6 sm:p-7">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquareHeart className="w-5 h-5 text-coral-500" />
        <h2 className="font-extrabold text-gray-900 text-lg">Traveller Feedback & Suggestions</h2>
      </div>
      <p className="text-xs text-gray-500 mb-6">
        Feature 6: Help us improve destination information accuracy and budget calculations.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Your Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Priyadharshini"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-lavender-200 focus:outline-none"
          />
        </div>

        {/* 3 Rating categories */}
        <div className="space-y-2.5">
          <StarRating
            label="1. Overall Experience with CycleAware"
            value={form.overallRating}
            onChange={(val) => setForm({ ...form, overallRating: val })}
          />
          <StarRating
            label="2. Destination Information & Timing Accuracy"
            value={form.destinationAccuracyRating}
            onChange={(val) => setForm({ ...form, destinationAccuracyRating: val })}
          />
          <StarRating
            label="3. Budget Calculator Clarity & Realism"
            value={form.budgetCalculatorRating}
            onChange={(val) => setForm({ ...form, budgetCalculatorRating: val })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Suggest Missing Attractions or Local Tips
          </label>
          <input
            type="text"
            placeholder="e.g. Hidden sunset view behind Vattakottai, Thengapattinam beach..."
            value={form.suggestedPlaces}
            onChange={(e) => setForm({ ...form, suggestedPlaces: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-lavender-200 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            General Feedback & Comments
          </label>
          <textarea
            rows={3}
            placeholder="Share your thoughts on the route planner, comfort features you would love to see, etc."
            value={form.comments}
            onChange={(e) => setForm({ ...form, comments: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-lavender-200 focus:outline-none resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-semibold">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-sm text-white bg-gray-900 hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'Submitting...' : 'Submit Feedback'}</span>
        </button>
      </form>
    </div>
  );
}

