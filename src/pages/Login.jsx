import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/Logo'

export default function Login() {
  const { signIn } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from?.pathname ?? '/app'

  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [submitting,  setSubmitting]  = useState(false)
  const [errors,      setErrors]      = useState({})

  function validate() {
    const e = {}
    if (!email)    e.email    = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.'
    if (!password) e.password = 'Password is required.'
    return e
  }

  async function handleSubmit(evt) {
    evt.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSubmitting(true)

    const { error } = await signIn(email, password)
    setSubmitting(false)

    if (error) {
      setErrors({ form: error.message })
    } else {
      navigate(from, { replace: true })
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
          Welcome back
        </h1>
        <p className="text-slate-500 text-center text-sm mb-8">
          Sign in to your expense dashboard
        </p>

        {/* Form-level error */}
        {errors.form && (
          <p className="text-red-500 text-sm text-center mb-4 -mt-4">{errors.form}</p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="text-xs uppercase tracking-widest text-slate-500 font-medium block mb-1.5">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-skipense-mist rounded-xl px-4 py-3 text-skipense-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-skipense-dark/20 transition"
              placeholder="you@company.com"
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
            {errors.email && (
              <p id="login-email-error" className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="text-xs uppercase tracking-widest text-slate-500 font-medium block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-skipense-mist rounded-xl px-4 py-3 pr-11 text-skipense-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-skipense-dark/20 transition"
                placeholder="••••••••"
                aria-describedby={errors.password ? 'login-password-error' : undefined}
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
            {errors.password && (
              <p id="login-password-error" className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={submitting}
            className="w-full bg-skipense-lime text-skipense-ink font-bold rounded-full py-3.5 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {submitting ? (
              <span className="w-5 h-5 rounded-full skeleton inline-block" />
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-skipense-dark font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
