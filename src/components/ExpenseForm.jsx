import { useState, useEffect } from 'react'
import { PlusCircle, Save, X } from 'lucide-react'
import { CATEGORIES } from '../lib/helpers'

/**
 * ExpenseForm handles both ADD and EDIT modes.
 *
 * Design decision: single form for both modes.
 * When `editTarget` prop is provided, the form pre-populates
 * and the submit button says "Update Expense".
 * When `editTarget` is null, it's a fresh add form.
 *
 * This avoids duplicating form logic in two separate components.
 *
 * Props:
 *   onSubmit(fields)  → called with { amount, date, category, description }
 *   editTarget        → expense object to edit, or null
 *   onCancel()        → cancel edit mode
 *   submitting        → boolean (parent controls this to show loading state)
 *   error             → string | null (inline error from parent)
 */
export default function ExpenseForm({ onSubmit, editTarget, onCancel, submitting, error }) {
  const isEditing = Boolean(editTarget)

  const [amount,      setAmount]      = useState('')
  const [date,        setDate]        = useState(today())
  const [category,    setCategory]    = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // When editTarget changes (entering edit mode), populate fields
  useEffect(() => {
    if (editTarget) {
      setAmount(String(editTarget.amount))
      setDate(editTarget.date)
      setCategory(editTarget.category)
      setDescription(editTarget.description ?? '')
    } else {
      resetForm()
    }
  }, [editTarget])

  function today() {
    return new Date().toISOString().split('T')[0]
  }

  function resetForm() {
    setAmount('')
    setDate(today())
    setCategory(CATEGORIES[0])
    setDescription('')
    setFieldErrors({})
  }

  function validate() {
    const e = {}
    const parsed = parseFloat(amount)
    if (!amount)        e.amount = 'Amount is required.'
    else if (isNaN(parsed) || parsed <= 0) e.amount = 'Enter a valid positive amount.'
    if (!date)          e.date   = 'Date is required.'
    if (!category)      e.category = 'Select a category.'
    return e
  }

  async function handleSubmit(evt) {
    evt.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setFieldErrors(e); return }
    setFieldErrors({})

    await onSubmit({
      amount:      parseFloat(amount),
      date,
      category,
      description: description.trim() || null,
    })

    if (!isEditing) resetForm()
  }

  const inputClass = "w-full bg-skipense-mist rounded-xl px-4 py-3 text-skipense-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-skipense-dark/20 transition text-sm"
  const labelClass = "text-xs uppercase tracking-widest text-slate-500 font-medium block mb-1.5"

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <h2 className="font-bold text-skipense-ink text-lg mb-5">
        {isEditing ? 'Edit Expense' : 'Add Expense'}
      </h2>

      {error && (
        <p className="text-red-400 text-sm mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Amount + Date row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expense-amount" className={labelClass}>Amount (₹)</label>
            <input
              id="expense-amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className={inputClass}
              aria-describedby={fieldErrors.amount ? 'expense-amount-err' : undefined}
            />
            {fieldErrors.amount && (
              <p id="expense-amount-err" className="text-red-400 text-xs mt-1">{fieldErrors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="expense-date" className={labelClass}>Date</label>
            <input
              id="expense-date"
              type="date"
              value={date}
              max={today()}
              onChange={e => setDate(e.target.value)}
              className={inputClass}
              aria-describedby={fieldErrors.date ? 'expense-date-err' : undefined}
            />
            {fieldErrors.date && (
              <p id="expense-date-err" className="text-red-400 text-xs mt-1">{fieldErrors.date}</p>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="expense-category" className={labelClass}>Category</label>
          <select
            id="expense-category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="expense-description" className={labelClass}>Description <span className="normal-case tracking-normal">(optional)</span></label>
          <input
            id="expense-description"
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="e.g. Team lunch, AWS bill…"
            className={inputClass}
            maxLength={200}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            id="expense-submit"
            type="submit"
            disabled={submitting}
            className="flex-1 bg-skipense-lime text-skipense-ink font-bold rounded-full py-3 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 disabled:opacity-60 text-sm"
          >
            {submitting ? (
              <span className="w-4 h-4 rounded-full skeleton inline-block" />
            ) : isEditing ? (
              <><Save size={15} /> Update Expense</>
            ) : (
              <><PlusCircle size={15} /> Add Expense</>
            )}
          </button>

          {isEditing && (
            <button
              id="expense-cancel"
              type="button"
              onClick={onCancel}
              className="px-4 bg-skipense-mist text-skipense-ink font-medium rounded-full py-3 flex items-center gap-1 hover:bg-slate-200 transition text-sm"
            >
              <X size={14} /> Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
