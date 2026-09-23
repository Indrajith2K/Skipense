import { PlusCircle } from 'lucide-react'

/**
 * EmptyState — shown when the filtered or unfiltered expense list is empty.
 * The SVG illustration is inline (no external asset dependency).
 * onAdd is called when the user clicks "Add your first expense".
 */
export default function EmptyState({ filtered, onAdd }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center"
      role="status"
      aria-label="No expenses found"
    >
      {/* Minimal SVG illustration */}
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
        className="mb-6 opacity-40"
      >
        <rect width="80" height="80" rx="20" fill="#1B3530" />
        <rect x="18" y="24" width="44" height="6" rx="3" fill="#C7F269" />
        <rect x="18" y="36" width="30" height="4" rx="2" fill="#ffffff" opacity="0.4" />
        <rect x="18" y="46" width="36" height="4" rx="2" fill="#ffffff" opacity="0.4" />
        <rect x="18" y="56" width="22" height="4" rx="2" fill="#ffffff" opacity="0.4" />
      </svg>

      <h3 className="text-xl font-bold text-skipense-ink mb-2">
        {filtered ? 'No matching expenses' : 'No expenses yet'}
      </h3>
      <p className="text-slate-400 text-sm mb-6 max-w-xs leading-relaxed">
        {filtered
          ? 'Try adjusting your filters to see more results.'
          : 'Start tracking your spending by adding your first expense above.'}
      </p>

      {!filtered && (
        <button
          id="empty-state-add"
          onClick={onAdd}
          className="flex items-center gap-2 bg-skipense-lime text-skipense-ink font-bold rounded-full px-6 py-3 text-sm hover:scale-[1.02] transition-transform duration-200"
        >
          <PlusCircle size={16} />
          Add your first expense
        </button>
      )}
    </div>
  )
}
