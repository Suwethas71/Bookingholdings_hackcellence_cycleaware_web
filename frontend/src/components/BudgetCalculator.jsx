import { useState, useEffect } from 'react';
import { IndianRupee, Users, Moon, Utensils, Car, Calculator, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { budgetApi } from '../api/axios';

export default function BudgetCalculator() {
  const {
    selectedDestinations,
    travelMode,
    travelClass,
    travellers,
    setTravellers,
    nights,
    setNights,
    accommodationType,
    setAccommodationType,
    foodBudget,
    setFoodBudget,
    localTransport,
    setLocalTransport,
    misc,
    setMisc,
    totalEntryFees,
  } = useTrip();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userBudget, setUserBudget] = useState('');
  const [calculationMode, setCalculationMode] = useState('');

  // Fallback local calculation logic matching backend service
  const computeLocalFallback = () => {
    const tr = travellers || 1;
    const n = nights || 2;

    let farePerPerson = 300;
    if (travelMode === 'TRAIN') {
      if (travelClass === 'GENERAL') farePerPerson = 180;
      else if (travelClass === 'SLEEPER') farePerPerson = 320;
      else if (travelClass === 'AC_3T') farePerPerson = 650;
      else if (travelClass === 'AC_2T') farePerPerson = 950;
      else if (travelClass === 'AC_1T') farePerPerson = 1500;
      else farePerPerson = 320;
    } else if (travelMode === 'BUS') {
      if (travelClass === 'GOVERNMENT') farePerPerson = 300;
      else if (travelClass === 'PRIVATE_ORDINARY') farePerPerson = 350;
      else if (travelClass === 'PRIVATE_AC') farePerPerson = 550;
      else if (travelClass === 'SLEEPER') farePerPerson = 700;
      else farePerPerson = 400;
    } else if (travelMode === 'CAR') {
      if (travelClass === 'OWN_CAR') farePerPerson = 1200;
      else if (travelClass === 'RENTAL') farePerPerson = 2500;
      else if (travelClass === 'TAXI') farePerPerson = 3500;
      else farePerPerson = 2000;
    }

    const totalTransport = farePerPerson * tr * 2; // round trip
    const localCost = (localTransport || 400) * (n + 1) * Math.ceil(tr / 4);

    let roomRate = 1200;
    if (accommodationType === 'BUDGET') roomRate = 700;
    else if (accommodationType === 'STANDARD') roomRate = 1200;
    else if (accommodationType === 'PREMIUM') roomRate = 2500;
    else if (accommodationType === 'LUXURY') roomRate = 5000;

    const totalRooms = Math.ceil(tr / 2);
    const totalAccom = roomRate * n * totalRooms;
    const totalFood = (foodBudget || 500) * tr * (n + 1);
    const entryTotal = (totalEntryFees || 0) * tr;
    const miscTotal = misc || 500;
    const total = totalTransport + localCost + totalAccom + totalFood + entryTotal + miscTotal;

    return {
      transportationCost: totalTransport,
      transportationBreakdown: `${travelMode} (${travelClass}) - ₹${farePerPerson}/person × ${tr} travellers × 2 (round trip)`,
      localTransportCost: localCost,
      accommodationCost: totalAccom,
      accommodationBreakdown: `${accommodationType} - ₹${roomRate}/night × ${n} nights × ${totalRooms} room(s)`,
      foodCost: totalFood,
      attractionEntryFees: entryTotal,
      miscellaneousCost: miscTotal,
      totalCost: total,
      perPersonCost: Math.round(total / tr),
      numberOfTravellers: tr,
      numberOfNights: n,
      disclaimer: 'All prices are estimated figures for planning purposes only. Please verify current fares with respective service providers.',
    };
  };

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const payload = {
        selectedDestinationIds: selectedDestinations.map((d) => d.id),
        travelMode,
        travelClass,
        numberOfTravellers: travellers,
        numberOfNights: nights,
        accommodationType,
        foodBudgetPerPersonPerDay: foodBudget,
        localTransportBudgetPerDay: localTransport,
        miscellaneousBudget: misc,
      };

      const res = await budgetApi.calculate(payload);
      setResult(res.data);
      setCalculationMode('Live Spring Boot API');
    } catch (err) {
      // Graceful local fallback so user gets immediate response
      const fallback = computeLocalFallback();
      setResult(fallback);
      setCalculationMode('Estimated Engine (Client-side)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically recalculate when key inputs change if result is already showing
    if (result) {
      handleCalculate();
    }
  }, [travelMode, travelClass, travellers, nights, accommodationType, foodBudget, localTransport, misc, selectedDestinations.length]);

  const fmt = (n) => `₹${Math.round(n || 0).toLocaleString('en-IN')}`;
  const parsedUserBudget = parseFloat(userBudget) || 0;
  const isOverBudget = parsedUserBudget > 0 && result && result.perPersonCost > parsedUserBudget;

  return (
    <div className="space-y-6">
      {/* Parameter Inputs Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-lavender-100 p-6 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-lavender-600" />
            <h2 className="font-extrabold text-gray-900 text-lg">Trip Parameters & Expenses</h2>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            2. Trip Variables
          </span>
        </div>

        {/* Travellers and Nights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-lavender-600" />
                Number of Travellers
              </span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTravellers(num)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    travellers === num
                      ? 'bg-lavender-600 text-white border-lavender-600 shadow-md shadow-lavender-200'
                      : 'border-gray-200 hover:bg-lavender-50 text-gray-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-teal-600" />
                Duration (Nights)
              </span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNights(num)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    nights === num
                      ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200'
                      : 'border-gray-200 hover:bg-teal-50 text-gray-700'
                  }`}
                >
                  {num}N / {num + 1}D
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accommodation Tier */}
        <div className="mb-5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
            Accommodation Category (Per Night / Double Occupancy)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { value: 'BUDGET', label: 'Budget Lodge / Dorm', price: '₹700' },
              { value: 'STANDARD', label: 'Standard Hotel', price: '₹1,200' },
              { value: 'PREMIUM', label: 'Premium 3-Star Resort', price: '₹2,500' },
              { value: 'LUXURY', label: 'Sea-View Luxury 5-Star', price: '₹5,000' },
            ].map((acc) => (
              <button
                key={acc.value}
                type="button"
                onClick={() => setAccommodationType(acc.value)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  accommodationType === acc.value
                    ? 'border-lavender-500 bg-lavender-50/70 ring-2 ring-lavender-200 shadow-sm'
                    : 'border-gray-200 hover:border-lavender-200'
                }`}
              >
                <div className="text-xs font-bold text-gray-900">{acc.label}</div>
                <div className="text-xs font-semibold text-lavender-700 mt-1">{acc.price}/night</div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Expenses Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-orange-500" />
                Food / Person / Day
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                value={foodBudget}
                onChange={(e) => setFoodBudget(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 font-semibold text-sm focus:ring-2 focus:ring-lavender-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-teal-600" />
                Local Auto/Cab / Day
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                value={localTransport}
                onChange={(e) => setLocalTransport(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 font-semibold text-sm focus:ring-2 focus:ring-lavender-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Miscellaneous / Trip
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
              <input
                type="number"
                value={misc}
                onChange={(e) => setMisc(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 font-semibold text-sm focus:ring-2 focus:ring-lavender-200 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* User Budget Comparison Input */}
        <div className="mb-6 p-4 rounded-2xl bg-gray-50 border border-gray-200">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
            Compare Against Your Target Budget (₹ per person) — Optional
          </label>
          <div className="relative max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
            <input
              type="number"
              placeholder="e.g. 4500"
              value={userBudget}
              onChange={(e) => setUserBudget(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 font-bold text-sm focus:ring-2 focus:ring-lavender-200 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Calculate Action Button */}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl font-black text-base text-white bg-gradient-to-r from-lavender-600 via-purple-600 to-teal-600 hover:from-lavender-700 hover:to-teal-700 shadow-xl shadow-lavender-200 hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 active:scale-[0.99]"
        >
          <Calculator className="w-5 h-5" />
          <span>{loading ? 'Computing Estimated Budget...' : 'Calculate Complete Trip Budget'}</span>
        </button>
      </div>

      {/* Results Breakdown Section */}
      {result && (
        <div className="bg-white rounded-3xl shadow-sm border border-lavender-100 p-6 sm:p-7 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-gray-100 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-gray-900 text-xl">Estimated Budget Breakdown</h3>
                <span className="text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  {calculationMode}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Based on {result.numberOfTravellers} traveller(s) for {result.numberOfNights} night(s)
              </p>
            </div>

            {/* Target Budget comparison indicator */}
            {parsedUserBudget > 0 && (
              <div>
                {isOverBudget ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-800 border border-red-200 px-3 py-1.5 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Over target by {fmt(result.perPersonCost - parsedUserBudget)}/person
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Within target! Saves {fmt(parsedUserBudget - result.perPersonCost)}/person
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Breakdown Items Table */}
          <div className="space-y-3 mb-6">
            {[
              {
                icon: '🚆',
                title: 'Intercity Transportation (Round Trip)',
                subtitle: result.transportationBreakdown,
                amount: result.transportationCost,
              },
              {
                icon: '🛺',
                title: 'Local Transportation (Kanniyakumari Town & Sightseeing)',
                subtitle: `₹${localTransport}/day × ${result.numberOfNights + 1} days`,
                amount: result.localTransportCost,
              },
              {
                icon: '🏨',
                title: 'Hotel Accommodation',
                subtitle: result.accommodationBreakdown,
                amount: result.accommodationCost,
              },
              {
                icon: '🍽️',
                title: 'Food & Refreshments',
                subtitle: `₹${foodBudget}/person/day × ${result.numberOfTravellers} travellers × ${result.numberOfNights + 1} days`,
                amount: result.foodCost,
              },
              {
                icon: '🎟️',
                title: `Attraction Entry Fees (${selectedDestinations.length} places selected)`,
                subtitle: `Total fees: ₹${totalEntryFees}/person × ${result.numberOfTravellers} travellers`,
                amount: result.attractionEntryFees,
              },
              {
                icon: '💼',
                title: 'Miscellaneous & Contingency',
                subtitle: 'Emergency funds, water bottles, pooja items',
                amount: result.miscellaneousCost,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-lavender-100 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4 font-black text-gray-900 text-base">
                  {fmt(item.amount)}
                </div>
              </div>
            ))}
          </div>

          {/* Totals Highlight Box */}
          <div
            className={`rounded-3xl p-6 border ${
              isOverBudget
                ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
                : 'bg-gradient-to-r from-lavender-50 via-purple-50 to-teal-50 border-lavender-200'
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Total Trip Estimated Cost ({result.numberOfTravellers} travellers)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-0.5">
                  {fmt(result.totalCost)}
                </div>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-gray-200/80 pt-3 sm:pt-0 sm:pl-6">
                <span className="text-xs font-bold text-lavender-800 uppercase tracking-wider">
                  Per Person Shared Cost
                </span>
                <div className="text-3xl sm:text-4xl font-black text-lavender-700 tracking-tight mt-0.5">
                  {fmt(result.perPersonCost)}
                </div>
              </div>
            </div>
          </div>

          {/* Legal / Accuracy Disclaimer */}
          <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Price Disclaimer:</strong> {result.disclaimer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

