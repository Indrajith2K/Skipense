import { Wallet, Calendar, Receipt } from 'lucide-react'
import { formatCurrency } from '../lib/helpers'

/**
 * MonthlyTotalCard — Displays the total amount spent this month
 * along with overall total expenses stats.
 */
export default function MonthlyTotalCard({ currentMonthTotal, grandTotal, expenseCount, className = '' }) {
  const currentMonthName = new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className={`bg-white rounded-2xl shadow-card p-6 transition-all hover:shadow-card-hover border border-slate-100/80 flex-1 flex flex-col justify-center ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left section: Current Month Total */}
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-skipense-lime/30 text-skipense-dark flex items-center justify-center shrink-0 p-3">
            <Wallet className="w-6 h-6 text-skipense-dark" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1">
                <Calendar size={12} className="text-slate-400 inline" />
                Total Spent This Month
              </p>
              <span className="text-[10px] font-medium bg-skipense-mist text-slate-500 px-2 py-0.5 rounded-full">
                {currentMonthName}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-skipense-ink mt-1 tracking-tight">
              {formatCurrency(currentMonthTotal)}
            </p>
          </div>
        </div>

        {/* Right section: All-Time Summary Stats */}
        <div className="flex items-center gap-6 sm:border-l sm:border-slate-100 sm:pl-6 w-full sm:w-auto justify-between sm:justify-end pt-3 sm:pt-0 border-t border-slate-100 sm:border-t-0">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">All Time Total</p>
            <p className="text-base sm:text-lg font-bold text-slate-700 mt-0.5">
              {formatCurrency(grandTotal)}
            </p>
          </div>
          <div className="text-right sm:text-left">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1 justify-end sm:justify-start">
              <Receipt size={12} />
              Records
            </p>
            <p className="text-base sm:text-lg font-bold text-slate-700 mt-0.5">
              {expenseCount} {expenseCount === 1 ? 'expense' : 'expenses'}
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
