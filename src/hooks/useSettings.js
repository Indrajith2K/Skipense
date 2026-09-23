import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSettings(user) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSettings = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    const { data, error: fetchError } = await supabase
      .from('user_settings')
      .select('monthly_limit')
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setSettings(data || { monthly_limit: null })
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const updateMonthlyLimit = useCallback(async (limit) => {
    if (!user) return

    // Optimistic update
    const previousSettings = settings
    setSettings({ monthly_limit: limit })

    // Upsert the limit (insert or update depending if a row already exists)
    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, monthly_limit: limit, updated_at: new Date().toISOString() })

    if (upsertError) {
      setSettings(previousSettings)
      return { error: upsertError.message }
    }

    return { error: null }
  }, [user, settings])

  return {
    settings,
    loading,
    error,
    updateMonthlyLimit,
  }
}
