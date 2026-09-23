import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { CATEGORIES as DEFAULT_CATEGORIES, CATEGORY_COLORS as DEFAULT_CATEGORY_COLORS } from '../lib/helpers'

// Curated dynamic color palette for user custom categories
const CUSTOM_COLOR_PALETTE = [
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#6366F1', // Indigo
  '#3B82F6', // Blue
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#10B981', // Emerald
]

/**
 * Hash a string to select a deterministic color from CUSTOM_COLOR_PALETTE
 */
function getDeterministicColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % CUSTOM_COLOR_PALETTE.length
  return CUSTOM_COLOR_PALETTE[index]
}

/**
 * useCategories — fetches custom user categories from Supabase `categories` table
 * and merges them with default categories.
 */
export function useCategories(user) {
  const [customCategories, setCustomCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    if (!user) {
      setCustomCategories([])
      return
    }
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchErr } = await supabase
        .from('categories')
        .select('id, name, color, created_at')
        .order('created_at', { ascending: true })

      if (fetchErr) {
        // If table doesn't exist yet, fail gracefully without breaking UI
        console.warn('Custom categories table notice:', fetchErr.message)
      } else {
        setCustomCategories(data ?? [])
      }
    } catch (err) {
      console.warn('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  /**
   * Add a new custom category to database
   */
  const addCategory = useCallback(async (name) => {
    if (!user || !name.trim()) return { error: 'Category name is required' }
    
    const trimmed = name.trim()
    
    // Check if category already exists (case-insensitive)
    const allNames = [...DEFAULT_CATEGORIES, ...customCategories.map(c => c.name)]
    if (allNames.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      return { error: 'Category already exists' }
    }

    const color = getDeterministicColor(trimmed)
    const optimistic = { id: `temp-${Date.now()}`, name: trimmed, color }

    // Optimistic UI update
    setCustomCategories(prev => [...prev, optimistic])

    try {
      const { data, error: insertErr } = await supabase
        .from('categories')
        .insert({ user_id: user.id, name: trimmed, color })
        .select()

      if (insertErr) {
        // Revert optimistic update
        setCustomCategories(prev => prev.filter(c => c.id !== optimistic.id))
        return { error: insertErr.message }
      }

      // Reconcile with real DB row
      const real = data[0]
      setCustomCategories(prev => prev.map(c => c.id === optimistic.id ? real : c))
      return { data: real, error: null }
    } catch (err) {
      setCustomCategories(prev => prev.filter(c => c.id !== optimistic.id))
      return { error: err.message }
    }
  }, [user, customCategories])

  // Combined list of all category names
  const allCategories = useMemo(() => {
    const customNames = customCategories.map(c => c.name)
    // De-duplicate in case of collision
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...customNames]))
  }, [customCategories])

  // Combined category color map
  const categoryColors = useMemo(() => {
    const map = { ...DEFAULT_CATEGORY_COLORS }
    for (const c of customCategories) {
      map[c.name] = c.color || getDeterministicColor(c.name)
    }
    return map
  }, [customCategories])

  return {
    categories: allCategories,
    customCategories,
    categoryColors,
    loading,
    error,
    addCategory,
  }
}
