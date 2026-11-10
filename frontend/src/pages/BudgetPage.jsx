import TravelModeSelector from '../components/TravelModeSelector';
import BudgetCalculator from '../components/BudgetCalculator';
import FeedbackForm from '../components/FeedbackForm';
import SelectionSidebar from '../components/SelectionSidebar';
import Footer from '../components/Footer';
import { useTrip } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calculator, Sparkles } from 'lucide-react';

export default function BudgetPage() {
  const { selectedDestinations } = useTrip();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfaf4] pt-20">
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/explore')}
            className="inline-flex items-center gap-2 text-lavender-700 hover:text-lavender-900 font-bold text-xs uppercase tracking-wider mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Destination Catalogue</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Feature 4 & 5: Transportation & Budget Calculator</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                Plan Your Trip Budget
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Compare Train, Bus, and Car travel modes, configure lodging & meals, and calculate accurate per-person expenses with selected entry fees.
              </p>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-lavender-100/80 border border-lavender-200 text-xs font-bold text-lavender-800">
              {selectedDestinations.length} Places In Itinerary
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Controls & Calculations */}
          <div className="lg:col-span-8 space-y-6">
            <TravelModeSelector />
            <BudgetCalculator />
            <FeedbackForm />
          </div>

          {/* Persistent Trip Selection Overview */}
          <div className="lg:col-span-4">
            <SelectionSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

