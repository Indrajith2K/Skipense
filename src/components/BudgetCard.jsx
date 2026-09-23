import { useState, useEffect } from 'react'
import { formatCurrency } from '../lib/helpers'
import { Pencil, Check, AlertTriangle, AlertOctagon } from 'lucide-react'

export default function BudgetCard({ settings, currentMonthTotal, updateMonthlyLimit, loading }) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const limit = settings?.monthly_limit ? Number(settings.monthly_limit) : null

  useEffect(() => {
    if (limit) setInputValue(limit.toString())
  }, [limit])

  const handleSave = async () => {
    const val = parseFloat(inputValue)
    if (isNaN(val) || val <= 0) return

    setSubmitting(true)
    const { error } = await updateMonthlyLimit(val)
    setSubmitting(false)
    if (!error) setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-card p-6 h-[180px] flex items-center justify-center">
        <div className="w-8 h-8 skeleton rounded-full" />
      </div>
    )
  }

  const hasLimit = limit !== null && limit > 0
  const percentage = hasLimit ? Math.min(100, (currentMonthTotal / limit) * 100) : 0
  const isWarning = percentage >= 80 && percentage < 100
  const isCritical = percentage >= 100

  let statusColor = 'bg-skipense-dark'
  if (isCritical) statusColor = 'bg-red-500'
  else if (isWarning) statusColor = 'bg-amber-500'

  return (
    <div className={`bg-white rounded-2xl shadow-card p-6 border-l-4 ${
      isCritical ? 'border-red-500' : isWarning ? 'border-amber-500' : 'border-transparent'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Monthly Spend Limit</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-skipense-ink transition"
            aria-label="Edit limit"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-skipense-mist rounded-lg px-3 py-2 text-sm text-skipense-ink focus:outline-none focus:ring-2 focus:ring-skipense-dark/20"
            placeholder="e.g. 5000"
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={submitting}
            className="bg-skipense-lime text-skipense-ink p-2 rounded-lg hover:scale-105 transition flex-shrink-0 disabled:opacity-50"
          >
            <Check size={16} />
          </button>
        </div>
      ) : hasLimit ? (
        <div>
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className="text-2xl font-bold text-skipense-ink">{formatCurrency(currentMonthTotal)}</span>
              <span className="text-sm text-slate-400"> / {formatCurrency(limit)}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-md ${
              isCritical ? 'bg-red-50 text-red-600' : isWarning ? 'bg-amber-50 text-amber-600' : 'bg-skipense-mist text-skipense-ink'
            }`}>
              {percentage.toFixed(0)}%
            </span>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${statusColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {isCritical ? (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <AlertOctagon size={14} /> Limit Exceeded
            </div>
          ) : isWarning ? (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <AlertTriangle size={14} /> Nearing Limit
            </div>
          ) : (
            <div className="text-xs text-slate-400">You are on track this month.</div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500 mb-3">No monthly limit set.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-bold bg-skipense-mist text-skipense-ink px-4 py-2 rounded-full hover:bg-skipense-dark hover:text-white transition"
          >
            Set Limit
          </button>
        </div>
      )}
    </div>
  )
}
