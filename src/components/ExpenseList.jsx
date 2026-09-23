import { Link } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate, getCategoryStyle } from '../lib/helpers'
import { SkeletonRow, SkeletonCard } from './Skeleton'
import EmptyState from './EmptyState'

/**
 * ExpenseList renders the expense data in two layouts:
 *   - Desktop (md+): a proper HTML table with ARIA semantics
 *   - Mobile (<md): stacked card layout
 *
 * We use CSS (hidden/block md:hidden) to toggle between them rather than
 * JS-driven conditional rendering. This avoids layout shift on resize.
 *
 * The confirm() before delete is intentional for a simple destructive action.
 * In production you'd swap this for a modal — but confirm() is zero-JS-overhead,
 * accessible (browser handles focus management), and unambiguous.
 */
export default function ExpenseList({ expenses, loading, onEdit, onDelete, hasFilters, limit = 0 }) {
  const SKELETON_COUNT = limit > 0 ? limit : 5

  const displayedExpenses = limit > 0 ? expenses.slice(0, limit) : expenses
  const hasMore = limit > 0 && expenses.length > limit

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Desktop skeleton */}
        <div className="hidden md:block">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
        {/* Mobile skeleton */}
        <div className="md:hidden p-4">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card">
        <EmptyState
          filtered={hasFilters}
          onAdd={() => document.getElementById('expense-amount')?.focus()}
        />
      </div>
    )
  }

  // ── Desktop table ────────────────────────────────────────────────────────
  const DesktopTable = (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full" aria-label="Expense list">
        <thead>
          <tr className="border-b border-skipense-mist">
            <th className="text-left text-xs uppercase tracking-widest text-slate-400 font-medium px-6 py-4">Date</th>
            <th className="text-left text-xs uppercase tracking-widest text-slate-400 font-medium px-4 py-4">Category</th>
            <th className="text-left text-xs uppercase tracking-widest text-slate-400 font-medium px-4 py-4">Description</th>
            <th className="text-right text-xs uppercase tracking-widest text-slate-400 font-medium px-4 py-4">Amount</th>
            <th className="text-right text-xs uppercase tracking-widest text-slate-400 font-medium px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedExpenses.map((exp, idx) => (
            <tr
              key={exp.id}
              className={`border-b border-skipense-mist last:border-0 hover:bg-skipense-mist/40 transition-colors ${
                exp.id.startsWith('optimistic') ? 'opacity-60' : ''
              }`}
              aria-label={`Expense: ${exp.category}, ${formatCurrency(exp.amount)}, ${formatDate(exp.date)}`}
            >
              <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                {formatDate(exp.date)}
              </td>
              <td className="px-4 py-4">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
                  style={getCategoryStyle(exp.category)}
                >
                  {exp.category}
                </span>
              </td>
              <td className="px-4 py-4 text-sm text-slate-600 max-w-[220px] truncate">
                {exp.description || <span className="text-slate-300 italic">—</span>}
              </td>
              <td className="px-4 py-4 text-right font-bold text-skipense-ink text-sm whitespace-nowrap">
                {formatCurrency(exp.amount)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    id={`edit-expense-${idx}`}
                    aria-label={`Edit expense ${exp.category}`}
                    onClick={() => onEdit(exp)}
                    className="p-2 text-slate-400 hover:text-skipense-dark hover:bg-skipense-mist rounded-lg transition"
                    disabled={exp.id.startsWith('optimistic')}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    id={`delete-expense-${idx}`}
                    aria-label={`Delete expense ${exp.category}`}
                    onClick={() => {
                      if (window.confirm(`Delete this ${exp.category} expense of ${formatCurrency(exp.amount)}?`)) {
                        onDelete(exp.id)
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    disabled={exp.id.startsWith('optimistic')}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // ── Mobile cards ─────────────────────────────────────────────────────────
  const MobileCards = (
    <div className="md:hidden p-4 space-y-3">
      {displayedExpenses.map((exp, idx) => (
        <div
          key={exp.id}
          className={`bg-skipense-mist/50 rounded-2xl p-4 shadow-soft ${
            exp.id.startsWith('optimistic') ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">{formatDate(exp.date)}</span>
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={getCategoryStyle(exp.category)}
            >
              {exp.category}
            </span>
          </div>

          {exp.description && (
            <p className="text-sm text-slate-600 mb-2 truncate">{exp.description}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="font-bold text-skipense-ink">{formatCurrency(exp.amount)}</span>
            <div className="flex gap-2">
              <button
                id={`edit-expense-mobile-${idx}`}
                aria-label={`Edit expense ${exp.category}`}
                onClick={() => onEdit(exp)}
                className="p-2 text-slate-400 hover:text-skipense-dark bg-white rounded-lg transition shadow-soft"
                disabled={exp.id.startsWith('optimistic')}
              >
                <Pencil size={14} />
              </button>
              <button
                id={`delete-expense-mobile-${idx}`}
                aria-label={`Delete expense ${exp.category}`}
                onClick={() => {
                  if (window.confirm(`Delete this ${exp.category} expense of ${formatCurrency(exp.amount)}?`)) {
                    onDelete(exp.id)
                  }
                }}
                className="p-2 text-slate-400 hover:text-red-500 bg-white rounded-lg transition shadow-soft"
                disabled={exp.id.startsWith('optimistic')}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      {DesktopTable}
      {MobileCards}
      {hasMore && (
        <div className="p-4 border-t border-skipense-mist bg-skipense-mist/20 text-center">
          <Link to="/app/expenses" className="text-sm font-bold text-skipense-dark hover:text-skipense-ink hover:underline transition">
            View all {expenses.length} expenses →
          </Link>
        </div>
      )}
    </div>
  )
}
