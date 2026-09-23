import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

/**
 * Route-level code splitting with React.lazy + Suspense.
 * Why: Landing, Login/Signup, and Dashboard are large bundles.
 * Lazy loading means the user only downloads what they need.
 * The fallback is a minimal skeleton — no spinner (per design spec).
 */
const Landing       = React.lazy(() => import('./pages/Landing'))
const Login         = React.lazy(() => import('./pages/Login'))
const Signup        = React.lazy(() => import('./pages/Signup'))
const Dashboard     = React.lazy(() => import('./pages/Dashboard'))
const AllExpenses   = React.lazy(() => import('./pages/AllExpenses'))
const Analytics     = React.lazy(() => import('./pages/Analytics'))
const About         = React.lazy(() => import('./pages/About'))
const Blog          = React.lazy(() => import('./pages/Blog'))
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'))
const CookiePolicy  = React.lazy(() => import('./pages/CookiePolicy'))
const Security      = React.lazy(() => import('./pages/Security'))

/**
 * ProtectedRoute: wraps any route that requires authentication.
 * While auth state is loading (first paint), show nothing.
 * Once resolved: redirect unauthenticated users to /login.
 *
 * We pass `location` through the redirect so after login we can
 * send the user back to where they were trying to go.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-skipense-mist flex items-center justify-center">
        <div className="w-10 h-10 skeleton rounded-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

/**
 * PageFallback: shown by Suspense while lazy chunks are downloading.
 * Intentionally minimal — no layout shift, no spinner, just a quiet wait.
 */
function PageFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex gap-2">
        <div className="w-2 h-2 bg-skipense-dark rounded-full animate-bounce [animation-delay:0ms]" />
        <div className="w-2 h-2 bg-skipense-dark rounded-full animate-bounce [animation-delay:150ms]" />
        <div className="w-2 h-2 bg-skipense-dark rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/"        element={<Landing />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/signup"  element={<Signup />} />
          <Route path="/about"   element={<About />} />
          <Route path="/blog"    element={<Blog />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms"   element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/security" element={<Security />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/expenses"
            element={
              <ProtectedRoute>
                <AllExpenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          {/* Catch-all: redirect unknown routes to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
