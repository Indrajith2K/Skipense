import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { formatCurrency } from '../lib/helpers'
import Logo from './Logo'

export default function TopBar({ grandTotal, email, onLogout }) {
  return (
    <header
      className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-skipense-mist/80"
      aria-label="Dashboard top bar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" aria-label="Skipense home">
          <Logo size="sm" showWordmark={false} />
        </Link>
        <Link to="/" className="hidden sm:block">
          <span className="font-bold text-skipense-ink tracking-tight">Skipense</span>
        </Link>

        {/* Total pill */}
        <div
          className="bg-skipense-lime text-skipense-ink font-bold text-sm px-4 py-1.5 rounded-full whitespace-nowrap"
          aria-label={`Total expenses: ${formatCurrency(grandTotal)}`}
        >
          Total: {formatCurrency(grandTotal)}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="text-sm text-slate-400 font-medium hidden md:block max-w-[200px] truncate"
            title={email}
          >
            {email}
          </span>
          <button
            id="topbar-logout"
            aria-label="Log out"
            onClick={onLogout}
            className="flex items-center gap-1.5 text-slate-400 hover:text-skipense-ink transition text-sm font-medium"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
