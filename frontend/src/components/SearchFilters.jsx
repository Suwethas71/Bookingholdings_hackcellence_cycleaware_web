import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

const categories = [
  { value: 'ALL', label: 'All (19)' },
  { value: 'SCENIC', label: '🌅 Scenic' },
  { value: 'MONUMENT', label: '🏛️ Monuments' },
  { value: 'RELIGIOUS', label: '🛕 Religious' },
  { value: 'NATURE', label: '🌿 Nature' },
  { value: 'BEACH', label: '🏖️ Beaches' },
  { value: 'HERITAGE', label: '🏯 Heritage' },
];

const sortOptions = [
  { value: 'POPULARITY', label: 'Most Popular' },
  { value: 'ENTRY_FEE_ASC', label: 'Entry Fee: Free to Low' },
  { value: 'ENTRY_FEE_DESC', label: 'Entry Fee: High to Low' },
  { value: 'DISTANCE', label: 'Distance from Coimbatore' },
  { value: 'NAME', label: 'Name (A to Z)' },
];

export default function SearchFilters({ filters, onChange }) {
  const { search, category, maxEntryFee, sortBy } = filters;

  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onChange({ search: '', category: 'ALL', maxEntryFee: '', sortBy: 'POPULARITY' });
  };

  const hasActiveFilters = search || category !== 'ALL' || maxEntryFee !== '' || sortBy !== 'POPULARITY';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-lavender-100 p-6 mb-8">
      {/* Search Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-lavender-600" />
          <h2 className="font-bold text-gray-900 text-lg">Search & Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-coral-500 hover:text-coral-600 bg-coral-50 hover:bg-coral-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by attraction name or location (e.g. Waterfalls, Sunrise, Beach, Temple)..."
          value={search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-lavender-100 focus:border-lavender-400 text-sm bg-gray-50/70 transition-all placeholder:text-gray-400"
        />
        {search && (
          <button
            onClick={() => handleChange('search', '')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
          Filter by Category
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleChange('category', value)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                category === value
                  ? 'bg-lavender-600 text-white shadow-md shadow-lavender-200 scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-lavender-50 hover:text-lavender-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Row: Max Entry Fee + Sorting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Max Entry Fee (₹)
          </label>
          <select
            value={maxEntryFee}
            onChange={(e) => handleChange('maxEntryFee', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-lavender-100 text-xs sm:text-sm font-semibold bg-gray-50/70 text-gray-700"
          >
            <option value="">Any Entry Fee (Free to Paid)</option>
            <option value="0">Free Only (₹0)</option>
            <option value="20">Up to ₹20</option>
            <option value="50">Up to ₹50</option>
            <option value="100">Up to ₹100</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Sort Attractions By
          </label>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleChange('sortBy', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-lavender-100 text-xs sm:text-sm font-semibold bg-gray-50/70 text-gray-700"
            >
              {sortOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

