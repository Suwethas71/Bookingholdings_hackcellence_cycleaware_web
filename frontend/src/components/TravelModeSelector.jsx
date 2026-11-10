import { Train, Bus, Car, Info, Check } from 'lucide-react';
import { useTrip } from '../context/TripContext';

const travelModes = [
  {
    value: 'TRAIN',
    label: 'Train (Indian Railways)',
    icon: Train,
    subtitle: 'Coimbatore Jn (CBE) ⇄ Kanniyakumari (CAPE)',
    classes: [
      { value: 'GENERAL', label: 'General Second Class (2S)', price: '₹180', perTrip: 180 },
      { value: 'SLEEPER', label: 'Sleeper Class (SL)', price: '₹320', perTrip: 320 },
      { value: 'AC_3T', label: 'AC 3 Tier (3A)', price: '₹650', perTrip: 650 },
      { value: 'AC_2T', label: 'AC 2 Tier (2A)', price: '₹950', perTrip: 950 },
      { value: 'AC_1T', label: 'AC First Class (1A)', price: '₹1,500', perTrip: 1500 },
    ],
  },
  {
    value: 'BUS',
    label: 'Bus (SETC / Private)',
    icon: Bus,
    subtitle: 'SETC Ultra Deluxe, AC & Private Coaches',
    classes: [
      { value: 'GOVERNMENT', label: 'Govt SETC Express / Ordinary', price: '₹300', perTrip: 300 },
      { value: 'PRIVATE_ORDINARY', label: 'Private Non-AC Semi-Sleeper', price: '₹350', perTrip: 350 },
      { value: 'PRIVATE_AC', label: 'Private AC Semi-Sleeper', price: '₹550', perTrip: 550 },
      { value: 'SLEEPER', label: 'Multi-Axle AC Sleeper Bus', price: '₹700', perTrip: 700 },
    ],
  },
  {
    value: 'CAR',
    label: 'Car (Personal / Cab / Rental)',
    icon: Car,
    subtitle: 'NH 44 highway drive via Madurai & Tirunelveli',
    classes: [
      { value: 'OWN_CAR', label: 'Personal Car (Fuel + Tolls est.)', price: '₹1,200', perTrip: 1200 },
      { value: 'RENTAL', label: 'Self-Drive Rental Car', price: '₹2,500', perTrip: 2500 },
      { value: 'TAXI', label: 'Outstation Cab / Taxi Hire', price: '₹3,500', perTrip: 3500 },
    ],
  },
];

export default function TravelModeSelector() {
  const { travelMode, setTravelMode, travelClass, setTravelClass } = useTrip();

  const activeMode = travelModes.find((m) => m.value === travelMode) || travelModes[1];

  const handleModeSwitch = (modeValue) => {
    setTravelMode(modeValue);
    const target = travelModes.find((m) => m.value === modeValue);
    if (target && target.classes.length > 0) {
      setTravelClass(target.classes[1] ? target.classes[1].value : target.classes[0].value);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-lavender-100 p-6 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-extrabold text-gray-900 text-lg">Travel Transportation Mode</h2>
          <p className="text-xs text-gray-500">Choose one primary mode between Coimbatore and Kanniyakumari</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
          Separate Modes
        </span>
      </div>

      {/* Main Mode Toggle Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {travelModes.map(({ value, label, icon: Icon, subtitle }) => {
          const isCurrent = travelMode === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleModeSwitch(value)}
              className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                isCurrent
                  ? 'border-lavender-500 bg-lavender-50/70 shadow-md shadow-lavender-100 ring-2 ring-lavender-200'
                  : 'border-gray-200 hover:border-lavender-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCurrent ? 'bg-lavender-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isCurrent && (
                  <span className="w-5 h-5 rounded-full bg-lavender-600 text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-gray-900">{label.split('(')[0]}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Class / Tier Sub-Selector */}
      <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/80">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Select {travelMode === 'TRAIN' ? 'Railway Coach Class' : travelMode === 'BUS' ? 'Bus Type' : 'Car Option'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {activeMode.classes.map((c) => {
            const isSelected = travelClass === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setTravelClass(c.value)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-lavender-500 bg-white text-lavender-900 font-bold shadow-sm ring-1 ring-lavender-300'
                    : 'border-gray-200 bg-white/60 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="text-xs sm:text-sm font-semibold truncate mr-2">{c.label}</div>
                <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md flex-shrink-0">
                  {c.price}/way
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

