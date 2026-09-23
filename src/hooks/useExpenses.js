// ─────────────────────────────────────────────────────────────────────────────
// RLS 101
//
// You'll notice our SELECT call below does NOT include .eq('user_id', user.id).
// That is intentional. Here's why:
//
// Row Level Security (RLS) is a Postgres feature that runs a WHERE clause on
// EVERY query — before your app code sees any data. Our policy says:
//   USING (auth.uid() = user_id)
// Postgres evaluates auth.uid() from the JWT Supabase sends with each request.
//
// So even if we ran: supabase.from('expenses').select('*')
// Postgres would silently add: WHERE user_id = '<current user UUID>'
// No row from another user can ever be returned — the filter is at the DB layer.
//
// This is the correct, idiomatic Supabase pattern. Adding .eq('user_id', ...)
// in JS would be redundant — and a false sense of security (JS can be bypassed;
// Postgres RLS cannot).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useExpenses manages all CRUD for the expenses table.
 * It owns: raw data, loading state, error state, filtering, and totals.
 * It does NOT manage form state — that lives in ExpenseForm.
 *
 * Optimistic UI pattern used throughout:
 *   1. Update local state immediately (so UI feels instant).
 *   2. Send the mutation to Supabase.
 *   3. On success, reconcile with the server response (replace optimistic record).
 *   4. On error, revert local state and surface the error.
 * This beats the "refetch after every mutation" approach for perceived performance.
 */
export function useExpenses(user) {
  const [expenses, setExpenses]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [filters, setFilters]     = useState({
    category: '',
    dateFrom: '',
    dateTo:   '',
  })

  // ─────────────────────────────────────────────────────────────────────────
  // SUPABASE TEACHING BLOCK
  // What:    Fetch all expenses for the current user, ordered newest-first.
  // Why:     Initial data load for the dashboard expense list and charts.
  // SQL:     SELECT id, user_id, amount, date, category, description, created_at
  //          FROM public.expenses
  //          WHERE user_id = auth.uid()   ← enforced by RLS, not our code
  //          ORDER BY date DESC, created_at DESC;
  // RLS:     "Users can view own expenses" policy — USING (auth.uid() = user_id).
  //          Only the current user's rows are returned. No filter needed in JS.
  // Returns: { data: Array<{ id, user_id, amount, date, category, description,
  //            created_at }>, error: PostgrestError | null }
  // ─────────────────────────────────────────────────────────────────────────
  const fetchExpenses = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('expenses')
      .select('id, user_id, amount, date, category, description, created_at')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setExpenses(data ?? [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  // ─────────────────────────────────────────────────────────────────────────
  // SUPABASE TEACHING BLOCK
  // What:    Insert a new expense row for the current user.
  // Why:     "Add Expense" form submission.
  // SQL:     INSERT INTO public.expenses (user_id, amount, date, category, description)
  //          VALUES (auth.uid(), $amount, $date, $category, $description)
  //          RETURNING *;
  //          Note: user_id is set in our JS (from user.id) AND enforced by RLS.
  //          The RLS insert policy checks: WITH CHECK (auth.uid() = user_id).
  //          If they don't match, Postgres rejects the insert. Belt AND suspenders.
  // RLS:     "Users can insert own expenses" — WITH CHECK (auth.uid() = user_id).
  // Returns: { data: [{ id, user_id, amount, date, category, description,
  //            created_at }], error: PostgrestError | null }
  //          We use data[0] to get the server-assigned id + created_at.
  // ─────────────────────────────────────────────────────────────────────────
  const addExpense = useCallback(async (fields) => {
    // Optimistic: prepend with a temp id so the UI updates instantly
    const optimisticId = `optimistic-${Date.now()}`
    const optimistic = { id: optimisticId, user_id: user.id, ...fields }
    setExpenses(prev => [optimistic, ...prev])

    const { data, error: insertError } = await supabase
      .from('expenses')
      .insert({ user_id: user.id, ...fields })
      .select()

    if (insertError) {
      // Revert — remove the optimistic row
      setExpenses(prev => prev.filter(e => e.id !== optimisticId))
      return { error: insertError.message }
    }

    // Reconcile: replace optimistic row with real server row (gets real id + created_at)
    const real = data[0]
    setExpenses(prev => prev.map(e => e.id === optimisticId ? real : e))
    return { error: null }
  }, [user])

  // ─────────────────────────────────────────────────────────────────────────
  // SUPABASE TEACHING BLOCK
  // What:    Update an existing expense row by its UUID.
  // Why:     "Edit Expense" form submission.
  // SQL:     UPDATE public.expenses
  //          SET amount=$1, date=$2, category=$3, description=$4
  //          WHERE id = $id
  //          AND user_id = auth.uid()   ← RLS adds this automatically
  //          RETURNING *;
  // RLS:     "Users can update own expenses" — USING (auth.uid() = user_id).
  //          If the row belongs to a different user, 0 rows are updated (no error,
  //          just silent no-op). Always check data.length === 1 in production.
  // Returns: { data: [{ id, user_id, amount, date, category, description,
  //            created_at }], error: PostgrestError | null }
  // ─────────────────────────────────────────────────────────────────────────
  const updateExpense = useCallback(async (id, fields) => {
    // Optimistic: update local state immediately
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...fields } : e))

    const { data, error: updateError } = await supabase
      .from('expenses')
      .update(fields)
      .eq('id', id)
      .select()

    if (updateError) {
      // Revert — re-fetch to restore truth
      fetchExpenses()
      return { error: updateError.message }
    }

    const real = data[0]
    setExpenses(prev => prev.map(e => e.id === id ? real : e))
    return { error: null }
  }, [fetchExpenses])

  // ─────────────────────────────────────────────────────────────────────────
  // SUPABASE TEACHING BLOCK
  // What:    Delete an expense row by its UUID.
  // Why:     "Delete" action on expense list rows.
  // SQL:     DELETE FROM public.expenses
  //          WHERE id = $id
  //          AND user_id = auth.uid()   ← RLS enforces ownership
  // RLS:     "Users can delete own expenses" — USING (auth.uid() = user_id).
  //          A user cannot delete another user's expense — Postgres silently
  //          deletes 0 rows instead of throwing an error.
  // Returns: { error: PostgrestError | null }
  //          No data returned on DELETE unless you add .select() (not needed here).
  // ─────────────────────────────────────────────────────────────────────────
  const deleteExpense = useCallback(async (id) => {
    // Optimistic: remove from local state immediately
    const snapshot = expenses // capture for rollback
    setExpenses(prev => prev.filter(e => e.id !== id))

    const { error: deleteError } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setExpenses(snapshot) // revert
      return { error: deleteError.message }
    }

    return { error: null }
  }, [expenses])

  /**
   * Filtered view — computed via useMemo so it only recalculates when
   * expenses or filters change. Never re-filters on unrelated state updates.
   */
  const filtered = useMemo(() => {
    return expenses.filter(exp => {
      if (filters.category && exp.category !== filters.category) return false
      if (filters.dateFrom && exp.date < filters.dateFrom) return false
      if (filters.dateTo   && exp.date > filters.dateTo)   return false
      return true
    })
  }, [expenses, filters])

  /**
   * Category totals — used by both the pie chart and bar chart.
   * useMemo: only recalculates when filtered list changes.
   * Returns: Array<{ name: string, value: number }>
   */
  const categoryTotals = useMemo(() => {
    const map = {}
    for (const exp of filtered) {
      map[exp.category] = (map[exp.category] ?? 0) + Number(exp.amount)
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [filtered])

  /**
   * Grand total — sum of ALL expenses (not just filtered).
   * This is what the top-bar pill shows.
   */
  const grandTotal = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount), 0),
    [expenses]
  )

  return {
    expenses,
    filtered,
    categoryTotals,
    grandTotal,
    loading,
    error,
    filters,
    setFilters,
    addExpense,
    updateExpense,
    deleteExpense,
  }
}
