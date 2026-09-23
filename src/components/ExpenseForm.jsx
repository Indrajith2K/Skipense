import { useState, useEffect } from 'react'
import { PlusCircle, Save, X, Plus, Check } from 'lucide-react'
import { CATEGORIES as DEFAULT_CATEGORIES } from '../lib/helpers'

/**
 * ExpenseForm handles both ADD and EDIT modes.
 */
export default function ExpenseForm({
  onSubmit,
  editTarget,
  onCancel,
  submitting,
  error,
  categories = DEFAULT_CATEGORIES,
  onAddCategory,
}) {
  const isEditing = Boolean(editTarget)

  const [amount,      setAmount]      = useState('')
  const [date,        setDate]        = useState(today())
  const [category,    setCategory]    = useState(categories[0] || 'Other')
  const [description, setDescription] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  // Custom Category creation state
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [catCreating, setCatCreating] = useState(false)
  const [catError, setCatError] = useState(null)

  // Sync category selection if categories array changes
  useEffect(() => {
    if (!category && categories.length > 0) {
      setCategory(categories[0])
    }
  }, [categories, category])

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
    setCategory(categories[0] || 'Other')
    setDescription('')
    setFieldErrors({})
    setIsAddingCategory(false)
    setNewCatName('')
    setCatError(null)
  }

  const handleCreateCategorySubmit = async (e) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    setCatCreating(true)
    setCatError(null)

    if (onAddCategory) {
      const res = await onAddCategory(newCatName.trim())
      if (res.error) {
        setCatError(res.error)
      } else {
        const addedName = res.data?.name || newCatName.trim()
        setCategory(addedName)
        setNewCatName('')
        setIsAddingCategory(false)
      }
    } else {
      // Fallback
      setCategory(newCatName.trim())
      setNewCatName('')
      setIsAddingCategory(false)
    }
    setCatCreating(false)
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
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="expense-category" className="text-xs uppercase tracking-widest text-slate-500 font-medium">Category</label>
            {!isAddingCategory && (
              <button
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="text-xs font-bold text-skipense-dark hover:underline flex items-center gap-1"
              >
                <Plus size={12} />
                + Add Custom Category
              </button>
            )}
          </div>

          {isAddingCategory ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  placeholder="e.g. Subscriptions, Pet Care"
                  className={inputClass}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateCategorySubmit}
                  disabled={catCreating || !newCatName.trim()}
                  className="bg-skipense-dark text-skipense-lime p-3 rounded-xl hover:scale-105 transition disabled:opacity-50 shrink-0"
                  title="Save Category to Database"
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAddingCategory(false); setCatError(null) }}
                  className="bg-skipense-mist text-slate-500 p-3 rounded-xl hover:bg-slate-200 transition shrink-0"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
              {catError && <p className="text-red-400 text-xs">{catError}</p>}
            </div>
          ) : (
            <select
              id="expense-category"
              value={category}
              onChange={e => {
                if (e.target.value === '__ADD_NEW__') {
                  setIsAddingCategory(true)
                } else {
                  setCategory(e.target.value)
                }
              }}
              className={inputClass}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="__ADD_NEW__">+ Add Custom Category...</option>
            </select>
          )}
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
