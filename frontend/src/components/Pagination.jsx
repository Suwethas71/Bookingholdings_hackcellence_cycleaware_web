import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, totalElements, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200">
      <div className="text-sm font-medium text-gray-500">
        Showing <span className="font-bold text-gray-900">{startItem}–{endItem}</span> of{' '}
        <span className="font-bold text-gray-900">{totalElements}</span> tourist places
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lavender-50 hover:border-lavender-300 text-gray-700 transition-all"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
              p === currentPage
                ? 'bg-lavender-600 text-white shadow-md shadow-lavender-200'
                : 'text-gray-700 hover:bg-lavender-50 hover:text-lavender-800'
            }`}
          >
            {p + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-lavender-50 hover:border-lavender-300 text-gray-700 transition-all"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

