import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

/**
 * Navbar — sticky, blur-backdrop.
 * Mobile: hamburger menu toggles a full-width dropdown.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { label: 'Features', href: '#features', isRoute: false },
    { label: 'About',    href: '/about',    isRoute: true },
    { label: 'Blog',     href: '/blog',     isRoute: true },
    { label: 'Contact',  href: '#footer',   isRoute: false },
  ]

  function handleNav(link) {
    setOpen(false)
    if (link.isRoute) return // Handled by <Link>

    // If it's a hash link for the home page, but we're not on home
    if (location.pathname !== '/' && link.href !== '#footer') {
      navigate('/' + link.href)
    } else {
      const el = document.querySelector(link.href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-skipense-mist/60"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" aria-label="Skipense home">
            <Logo size="md" />
          </Link>

          {/* Center nav — desktop only */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-slate-500 hover:text-skipense-ink transition"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleNav(link)}
                  className="text-sm font-medium text-slate-500 hover:text-skipense-ink transition"
                >
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* Auth CTAs — desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-500 hover:text-skipense-ink transition"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-skipense-lime text-skipense-ink font-bold text-sm px-5 py-2.5 rounded-full hover:scale-[1.03] transition-transform duration-200"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            id="navbar-menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="md:hidden p-2 text-slate-500 hover:text-skipense-ink transition"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-skipense-mist px-4 py-4 space-y-3">
          {navLinks.map(link => (
            link.isRoute ? (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setOpen(false)}
                className="block w-full text-left text-sm font-medium text-slate-600 hover:text-skipense-ink py-2 transition"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={() => handleNav(link)}
                className="block w-full text-left text-sm font-medium text-slate-600 hover:text-skipense-ink py-2 transition"
              >
                {link.label}
              </button>
            )
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="text-center text-sm font-medium text-slate-500 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="text-center bg-skipense-lime text-skipense-ink font-bold text-sm px-5 py-3 rounded-full"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
