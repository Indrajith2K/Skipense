import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts'
import {
  ArrowLeft, Calendar, TrendingUp, PieChart as PieIcon,
  BarChart3, Wallet, Filter, LogOut, ArrowUpRight
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useCategories } from '../hooks/useCategories'
import { formatCurrency, formatDate, getCategoryStyle, CATEGORY_COLORS } from '../lib/helpers'
import Logo from '../components/Logo'

/**
 * Analytics page — detailed expense reports with Week, Month, and Year filters.
 */
export default function Analytics() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { expenses, loading } = useExpenses(user)
  const { categoryColors } = useCategories(user)
  
  // Period filter state: 'week' | 'month' | 'year' | 'all'
  const [period, setPeriod] = useState('month')

  const handleLogout = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  // Calculate start dates for period filters
  const filteredExpenses = useMemo(() => {
    if (!expenses.length) return []
    const now = new Date()
    
    if (period === 'week') {
      // Start of current week (Monday)
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1)
      const monday = new Date(now.setDate(diff))
      monday.setHours(0, 0, 0, 0)
      const mondayStr = monday.toISOString().split('T')[0]
      return expenses.filter(e => e.date >= mondayStr)
    }

    if (period === 'month') {
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const monthPrefix = `${year}-${month}`
      return expenses.filter(e => e.date.startsWith(monthPrefix))
    }

    if (period === 'year') {
      const year = String(now.getFullYear())
      return expenses.filter(e => e.date.startsWith(year))
    }

    return expenses // 'all'
  }, [expenses, period])

  // Summary Metrics
  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0)
  }, [filteredExpenses])

  const categoryTotals = useMemo(() => {
    const map = {}
    for (const exp of filteredExpenses) {
      map[exp.category] = (map[exp.category] ?? 0) + Number(exp.amount)
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filteredExpenses])

  const topCategory = categoryTotals[0] ?? { name: 'N/A', value: 0 }

  const avgPerDay = useMemo(() => {
    if (!filteredExpenses.length) return 0
    const dates = new Set(filteredExpenses.map(e => e.date))
    return totalAmount / (dates.size || 1)
  }, [filteredExpenses, totalAmount])

  // Time trend data for charts (Daily for Week/Month, Monthly for Year/All)
  const trendData = useMemo(() => {
    if (!filteredExpenses.length) return []
    const map = {}
    
    if (period === 'year' || period === 'all') {
      // Group by Month (YYYY-MM)
      for (const e of filteredExpenses) {
        const monthKey = e.date.slice(0, 7) // "YYYY-MM"
        map[monthKey] = (map[monthKey] ?? 0) + Number(e.amount)
      }
      return Object.entries(map)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => {
          const [y, m] = key.split('-')
          const dateObj = new Date(Number(y), Number(m) - 1, 1)
          const label = dateObj.toLocaleString('en-IN', { month: 'short', year: '2-digit' })
          return { label, value }
        })
    } else {
      // Group by Date (YYYY-MM-DD)
      for (const e of filteredExpenses) {
        map[e.date] = (map[e.date] ?? 0) + Number(e.amount)
      }
      return Object.entries(map)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([dateStr, value]) => {
          const label = formatDate(dateStr).replace(/ \d{4}$/, '') // e.g. "21 Sep"
          return { label, value }
        })
    }
  }, [filteredExpenses, period])

  const colors = useMemo(() => {
    return categoryTotals.map(entry => categoryColors[entry.name] ?? CATEGORY_COLORS[entry.name] ?? '#3B82F6')
  }, [categoryTotals, categoryColors])

  const formatRupee = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const { label, name, value } = payload[0].payload
    return (
      <div className="bg-white shadow-card rounded-xl px-4 py-2.5 text-sm border border-slate-100">
        <p className="font-bold text-skipense-ink">{name || label}</p>
        <p className="text-slate-600 font-semibold">{formatCurrency(value)}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-skipense-mist/40 pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-skipense-mist/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/app" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-skipense-ink transition bg-skipense-mist px-3 py-1.5 rounded-full">
              <ArrowLeft size={14} />
              Dashboard
            </Link>
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-4">
              <Logo size="sm" showWordmark={false} />
              <span className="font-bold text-skipense-ink text-sm">Skipense Analytics</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium hidden md:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-slate-400 hover:text-skipense-ink transition text-sm font-medium"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Title & Period Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-skipense-ink tracking-tight">
              Expense Analytics
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Analyze your spending trends with custom time range filters.
            </p>
          </div>

          {/* Period Filters: Week, Month, Year, All */}
          <div className="inline-flex p-1.5 bg-white shadow-card rounded-2xl border border-slate-100 shrink-0 self-start md:self-auto">
            {[
              { id: 'week',  label: 'This Week',  icon: Calendar },
              { id: 'month', label: 'This Month', icon: Calendar },
              { id: 'year',  label: 'This Year',  icon: Calendar },
              { id: 'all',   label: 'All Time',   icon: Wallet },
            ].map(tab => {
              const Icon = tab.icon
              const active = period === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setPeriod(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    active
                      ? 'bg-skipense-dark text-skipense-lime shadow-sm scale-[1.02]'
                      : 'text-slate-500 hover:text-skipense-ink hover:bg-slate-50'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Spent */}
          <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Spent</p>
              <div className="w-9 h-9 rounded-xl bg-skipense-lime/30 text-skipense-dark flex items-center justify-center">
                <Wallet size={18} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-skipense-ink mt-2">{formatCurrency(totalAmount)}</p>
            <p className="text-[11px] text-slate-400 mt-1 capitalize">Filter: {period}</p>
          </div>

          {/* Daily Average */}
          <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Daily Average</p>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-skipense-ink mt-2">{formatCurrency(avgPerDay)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Per active day</p>
          </div>

          {/* Top Category */}
          <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Category</p>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <PieIcon size={18} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-skipense-ink mt-2 truncate">{topCategory.name}</p>
            <p className="text-[11px] text-slate-400 mt-1">{formatCurrency(topCategory.value)}</p>
          </div>

          {/* Transactions Count */}
          <div className="bg-white rounded-2xl shadow-card p-5 border border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Transactions</p>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <BarChart3 size={18} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-skipense-ink mt-2">{filteredExpenses.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">Expense records</p>
          </div>
        </div>

        {/* Main Charts Section */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-card p-12 flex items-center justify-center">
            <div className="w-8 h-8 skeleton rounded-full" />
          </div>
        ) : !filteredExpenses.length ? (
          <div className="bg-white rounded-2xl shadow-card p-12 text-center">
            <p className="text-slate-400 font-medium">No expenses found for this time period.</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting a different filter like "This Year" or "All Time".</p>
          </div>
        ) : (
          <>
            {/* Timeline Trend Chart */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
              <h3 className="font-bold text-skipense-ink text-base mb-1">
                Spending Trend over Time ({period === 'week' ? 'Daily' : period === 'month' ? 'Daily' : 'Monthly'})
              </h3>
              <p className="text-xs text-slate-400 mb-6">Visual timeline of total expenses</p>
              
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C7F269" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#C7F269" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ECECEC" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#1B3530" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown & Bar Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Donut */}
              <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
                <h3 className="font-bold text-skipense-ink text-base mb-4">Category Distribution</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={categoryTotals}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryTotals.map((entry, idx) => (
                        <Cell key={entry.name} fill={colors[idx]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {categoryTotals.map((entry, idx) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[idx] }} />
                      <span className="font-medium">{entry.name}:</span>
                      <span className="font-bold text-skipense-ink">{formatRupee(entry.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Bar Chart */}
              <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
                <h3 className="font-bold text-skipense-ink text-base mb-4">Total Amount by Category</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={categoryTotals} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ECECEC" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={48} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {categoryTotals.map((entry, idx) => (
                        <Cell key={entry.name} fill={colors[idx]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Expenses Table preview for selected period */}
        {filteredExpenses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-skipense-ink text-base">
                Expenses in {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : period === 'year' ? 'This Year' : 'All Time'}
              </h3>
              <Link to="/app/expenses" className="text-xs font-bold text-skipense-dark hover:underline flex items-center gap-1">
                View All Records <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-skipense-ink">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Description</th>
                    <th className="py-3 px-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.slice(0, 10).map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-2 text-slate-500 font-medium">{formatDate(exp.date)}</td>
                      <td className="py-3 px-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold" style={getCategoryStyle(exp.category, categoryColors)}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-600">{exp.description || '—'}</td>
                      <td className="py-3 px-2 text-right font-bold text-skipense-ink">{formatCurrency(exp.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
