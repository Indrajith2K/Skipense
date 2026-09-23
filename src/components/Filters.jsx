import { useRef, useCallback } from 'react'
import { Filter, RotateCcw } from 'lucide-react'
import { CATEGORIES as DEFAULT_CATEGORIES } from '../lib/helpers'

/**
 * Filters — category dropdown + date range.
 */
export default function Filters({ filters, setFilters, total, shown, categories = DEFAULT_CATEGORIES }) {
  const debounceRef = useRef(null)

  const handleCategory = useCallback((e) => {
    setFilters(f => ({ ...f, category: e.target.value }))
  }, [setFilters])

  const handleDate = useCallback((field) => (e) => {
    const value = e.target.value
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilters(f => ({ ...f, [field]: value }))
    }, 300)
  }, [setFilters])

  const handleReset = useCallback(() => {
    setFilters({ category: '', dateFrom: '', dateTo: '' })
    // Reset native input values (uncontrolled approach for date inputs)
    document.getElementById('filter-date-from').value = ''
    document.getElementById('filter-date-to').value   = ''
  }, [setFilters])

  const inputClass = "w-full bg-skipense-mist rounded-xl px-3 py-2.5 text-skipense-ink text-sm focus:outline-none focus:ring-2 focus:ring-skipense-dark/20 transition"
  const labelClass = "text-xs uppercase tracking-widest text-slate-500 font-medium block mb-1.5"

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 h-fit">
      <div className="flex items-center gap-2 mb-5">
        <Filter size={16} className="text-skipense-dark" />
        <h2 className="font-bold text-skipense-ink text-lg">Filters</h2>
      </div>

      <div className="space-y-4">
        {/* Category */}
        <div>
          <label htmlFor="filter-category" className={labelClass}>Category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={handleCategory}
            className={inputClass}
          >
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Date from */}
        <div>
          <label htmlFor="filter-date-from" className={labelClass}>From</label>
          <input
            id="filter-date-from"
            type="date"
            defaultValue={filters.dateFrom}
            onChange={handleDate('dateFrom')}
            className={inputClass}
          />
        </div>

        {/* Date to */}
        <div>
          <label htmlFor="filter-date-to" className={labelClass}>To</label>
          <input
            id="filter-date-to"
            type="date"
            defaultValue={filters.dateTo}
            onChange={handleDate('dateTo')}
            className={inputClass}
          />
        </div>

        {/* Reset */}
        <button
          id="filter-reset"
          type="button"
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 bg-skipense-mist text-skipense-ink font-medium rounded-full py-2.5 hover:bg-slate-200 transition text-sm"
        >
          <RotateCcw size={13} /> Reset Filters
        </button>

        {/* Live count */}
        <p className="text-xs text-slate-400 text-center">
          Showing <span className="font-bold text-skipense-dark">{shown}</span>{' '}
          of <span className="font-bold">{total}</span> expenses
        </p>
      </div>
    </div>
  )
}
