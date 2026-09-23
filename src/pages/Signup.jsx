import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/Logo'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate   = useNavigate()

  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [confirm,    setConfirm]    = useState('')
  const [showPass,   setShowPass]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors,     setErrors]     = useState({})

  function validate() {
    const e = {}
    if (!email)    e.email    = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.'
    if (!password) e.password = 'Password is required.'
    else if (password.length < 6) e.password = 'Minimum 6 characters.'
    if (!confirm)  e.confirm  = 'Please confirm your password.'
    else if (confirm !== password) e.confirm = 'Passwords do not match.'
    return e
  }

  async function handleSubmit(evt) {
    evt.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSubmitting(true)

    const { error } = await signUp(email, password)
    setSubmitting(false)

    if (error) {
      setErrors({ form: error.message })
    } else {
      navigate('/app', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-skipense-mist flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-10">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="md" />
        </div>

        <h1 className="text-3xl font-bold text-skipense-ink text-center mb-1 tracking-tight">
          Create your account
        </h1>
        <p className="text-slate-500 text-center text-sm mb-8">
          Start tracking expenses in under a minute
        </p>

        {errors.form && (
          <p className="text-red-500 text-sm text-center mb-4 -mt-4">{errors.form}</p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="text-xs uppercase tracking-widest text-slate-500 font-medium block mb-1.5">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-skipense-mist rounded-xl px-4 py-3 text-skipense-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-skipense-dark/20 transition"
              placeholder="you@company.com"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="text-xs uppercase tracking-widest text-slate-500 font-medium block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-skipense-mist rounded-xl px-4 py-3 pr-11 text-skipense-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-skipense-dark/20 transition"
                placeholder="Min. 6 characters"
              />
              <button
                type="button"
                aria-label={showPass ? 'Hide password' : 'Show password'}
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-skipense-ink transition"
              >
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm password */}
          <div>
            <label htmlFor="signup-confirm" className="text-xs uppercase tracking-widest text-slate-500 font-medium block mb-1.5">
              Confirm Password
            </label>
            <input
              id="signup-confirm"
              type={showPass ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full bg-skipense-mist rounded-xl px-4 py-3 text-skipense-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-skipense-dark/20 transition"
              placeholder="Repeat password"
            />
            {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm}</p>}
          </div>

          <button
            id="signup-submit"
            type="submit"
            disabled={submitting}
            className="w-full bg-skipense-lime text-skipense-ink font-bold rounded-full py-3.5 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {submitting ? (
              <span className="w-5 h-5 rounded-full skeleton inline-block" />
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-skipense-dark font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
