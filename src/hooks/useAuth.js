import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useAuth encapsulates all auth state and actions.
 * It is the SINGLE source of truth for authentication in this app.
 *
 * Design note: we expose { user, loading, signIn, signUp, signOut }
 * rather than the raw Supabase session object. This abstraction means
 * if we ever swap auth providers, nothing outside this file changes.
 */
export function useAuth() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true) // true until we confirm session state

  useEffect(() => {
    // ─────────────────────────────────────────────────────────────────────────
    // SUPABASE TEACHING BLOCK
    // What:    Read the current auth session from localStorage/cookie on mount.
    // Why:     On page refresh, we need to restore the user's session without
    //          forcing them to log in again. Supabase persists the JWT in
    //          localStorage automatically; getSession() reads it synchronously.
    // SQL:     No SQL. This is a JWT decode + local storage read.
    // RLS:     Not applicable — no database query.
    // Returns: { data: { session: Session | null }, error: AuthError | null }
    //          session.user.id  → UUID of authenticated user
    //          session.user.email → user's email
    // ─────────────────────────────────────────────────────────────────────────
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // ─────────────────────────────────────────────────────────────────────────
    // SUPABASE TEACHING BLOCK
    // What:    Subscribe to auth state changes (login, logout, token refresh).
    // Why:     Real-time auth sync. Without this, if the user logs out in
    //          another tab, this tab wouldn't know. The subscription fires on
    //          every auth event: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.
    // SQL:     No SQL. Supabase broadcasts auth events via a broadcast channel.
    // RLS:     Not applicable — no database query.
    // Returns: { data: { subscription } } — call subscription.unsubscribe() on cleanup.
    //          The callback receives (event: string, session: Session | null)
    // ─────────────────────────────────────────────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // SUPABASE TEACHING BLOCK
  // What:    Create a new user account with email + password.
  // Why:     Registration flow. Supabase hashes the password with bcrypt
  //          and stores it in the auth.users table (not public schema).
  // SQL:     INSERT INTO auth.users (email, encrypted_password, ...) VALUES (...)
  //          You never write this SQL yourself — Supabase's Auth service owns it.
  // RLS:     Not applicable — this touches auth schema, not public schema.
  // Returns: { data: { user: User | null, session: Session | null },
  //            error: AuthError | null }
  //          Since "Confirm email" is OFF, session is immediately non-null.
  // ─────────────────────────────────────────────────────────────────────────
  const signUp = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // SUPABASE TEACHING BLOCK
  // What:    Sign in an existing user with email + password.
  // Why:     Login flow. Supabase verifies the password hash, issues a JWT
  //          (access token) and a refresh token, and stores them in localStorage.
  // SQL:     SELECT * FROM auth.users WHERE email = $1 (then bcrypt compare).
  // RLS:     Not applicable — auth.users is not in public schema.
  // Returns: { data: { user: User, session: Session }, error: AuthError | null }
  //          On success, onAuthStateChange fires with SIGNED_IN automatically.
  // ─────────────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // SUPABASE TEACHING BLOCK
  // What:    Sign out the current user and clear the local session.
  // Why:     Logout flow. Supabase invalidates the refresh token server-side
  //          and removes the JWT from localStorage. Without this, the token
  //          would persist and the user would remain "logged in" on refresh.
  // SQL:     No SQL. Supabase's Auth service invalidates the session token.
  // RLS:     Not applicable.
  // Returns: { error: AuthError | null }
  //          onAuthStateChange fires SIGNED_OUT — useAuth sets user to null.
  // ─────────────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return { user, loading, signIn, signUp, signOut }
}
