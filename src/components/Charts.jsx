import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { CATEGORY_COLORS } from '../lib/helpers'

/**
 * Charts — two views of the same categoryTotals data.
 *
 * We receive categoryTotals from useExpenses (already memoized).
 * We do NOT re-derive data here — this component is purely presentational.
 *
 * Recharts requires a fixed pixel height on the ResponsiveContainer parent.
 * We use height={280}. Do not use percentage heights — Recharts will infinitely
 * loop trying to measure a container that's also measured by Recharts.
 */
export default function Charts({ categoryTotals }) {
  const colors = useMemo(
    () => categoryTotals.map(entry => CATEGORY_COLORS[entry.name] ?? '#ECECEC'),
    [categoryTotals]
  )

  if (!categoryTotals.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow-card p-6 h-[300px] flex items-center justify-center">
            <p className="text-slate-300 text-sm">No data to display</p>
          </div>
        ))}
      </div>
    )
  }

  const formatRupee = (value) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const { name, value } = payload[0].payload
    return (
      <div className="bg-white shadow-card rounded-xl px-4 py-2.5 text-sm">
        <p className="font-bold text-skipense-ink">{name}</p>
        <p className="text-slate-500">{formatRupee(value)}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pie chart */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-skipense-ink text-base">Breakdown by Category</h3>
          <Link
            to="/app/analytics"
            className="flex items-center gap-1 text-xs font-bold text-skipense-dark bg-skipense-mist hover:bg-slate-200 px-3 py-1.5 rounded-full transition duration-200"
            title="Filter by Week, Month, or Year"
          >
            <span>Week / Month / Year</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
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
        {/* Legend below pie */}
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {categoryTotals.map((entry, idx) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-500">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: colors[idx] }}
              />
              {entry.name}
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-skipense-ink text-base">Total by Category</h3>
          <Link
            to="/app/analytics"
            className="flex items-center gap-1 text-xs font-bold text-skipense-dark bg-skipense-mist hover:bg-slate-200 px-3 py-1.5 rounded-full transition duration-200"
            title="Filter by Week, Month, or Year"
          >
            <span>Filter Reports</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={categoryTotals} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ECECEC" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
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
  )
}
