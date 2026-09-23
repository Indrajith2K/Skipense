import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import TopBar from '../components/TopBar'
import ExpenseForm from '../components/ExpenseForm'
import Filters from '../components/Filters'
import ExpenseList from '../components/ExpenseList'
import Charts from '../components/Charts'

/**
 * Dashboard — the main protected page.
 *
 * State philosophy: Dashboard owns "edit mode" state only.
 * All expense data lives in useExpenses. All auth state lives in useAuth.
 * This keeps Dashboard as a pure orchestrator — it wires hooks and components.
 */
export default function Dashboard() {
  const { user, signOut }           = useAuth()
  const navigate                    = useNavigate()
  const {
    expenses,
    filtered,
    categoryTotals,
    grandTotal,
    loading,
    filters,
    setFilters,
    addExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses(user)

  const [editTarget,  setEditTarget]  = useState(null) // the expense being edited, or null
  const [submitting,  setSubmitting]  = useState(false)
  const [formError,   setFormError]   = useState(null)

  const hasFilters = Boolean(filters.category || filters.dateFrom || filters.dateTo)

  const handleLogout = useCallback(async () => {
    await signOut()
    navigate('/', { replace: true })
  }, [signOut, navigate])

  const handleFormSubmit = useCallback(async (fields) => {
    setSubmitting(true)
    setFormError(null)

    let result
    if (editTarget) {
      result = await updateExpense(editTarget.id, fields)
    } else {
      result = await addExpense(fields)
    }

    setSubmitting(false)

    if (result.error) {
      setFormError(result.error)
    } else {
      setEditTarget(null)
    }
  }, [editTarget, addExpense, updateExpense])

  const handleEdit = useCallback((expense) => {
    setEditTarget(expense)
    setFormError(null)
    // Scroll form into view on mobile
    document.getElementById('expense-form-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditTarget(null)
    setFormError(null)
  }, [])

  return (
    <div className="min-h-screen bg-skipense-mist/40">
      <TopBar
        grandTotal={grandTotal}
        email={user?.email}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Row 1: Form + Filters */}
        <div
          id="expense-form-card"
          className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start"
        >
          <ExpenseForm
            onSubmit={handleFormSubmit}
            editTarget={editTarget}
            onCancel={handleCancelEdit}
            submitting={submitting}
            error={formError}
          />
          <Filters
            filters={filters}
            setFilters={setFilters}
            total={expenses.length}
            shown={filtered.length}
          />
        </div>

        {/* Row 2: Charts */}
        <Charts categoryTotals={categoryTotals} />

        {/* Row 3: Expense list */}
        <section aria-label="Expense list">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-skipense-ink text-lg">Expenses</h2>
            <span className="text-xs text-slate-400">
              {filtered.length} {filtered.length === 1 ? 'record' : 'records'}
            </span>
          </div>
          <ExpenseList
            expenses={filtered}
            loading={loading}
            onEdit={handleEdit}
            onDelete={deleteExpense}
            hasFilters={hasFilters}
          />
        </section>
      </main>
    </div>
  )
}
