import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import TopBar from '../components/TopBar'
import ExpenseList from '../components/ExpenseList'

export default function AllExpenses() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  
  // We don't need filters here typically for the full list, but we use the same hook
  const { expenses, loading, deleteExpense } = useExpenses(user)

  const handleLogout = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  const groupedExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0) return []
    
    const result = []
    let currentGroup = null
    
    // Expenses are already sorted descending by date from the hook
    expenses.forEach(exp => {
      const date = new Date(exp.date)
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })
      
      if (!currentGroup || currentGroup.monthYear !== monthYear) {
        currentGroup = { monthYear, expenses: [] }
        result.push(currentGroup)
      }
      currentGroup.expenses.push(exp)
    })
    
    return result
  }, [expenses])

  return (
    <div className="min-h-screen bg-skipense-mist/40">
      <TopBar
        grandTotal={expenses.reduce((sum, e) => sum + e.amount, 0)}
        email={user?.email}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="flex items-center gap-4">
          <Link
            to="/app"
            className="p-2 bg-white rounded-full shadow-soft text-slate-500 hover:text-skipense-ink hover:scale-105 transition"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-skipense-ink tracking-tight">All Expenses</h1>
            <p className="text-sm text-slate-500">History of all recorded transactions</p>
          </div>
        </div>

        {loading ? (
          <ExpenseList loading={true} />
        ) : groupedExpenses.length === 0 ? (
          <ExpenseList expenses={[]} />
        ) : (
          <div className="space-y-10">
            {groupedExpenses.map(group => (
              <section key={group.monthYear} aria-label={`Expenses for ${group.monthYear}`}>
                <h2 className="text-sm uppercase tracking-widest text-slate-400 font-bold mb-3 ml-2">
                  {group.monthYear}
                </h2>
                <ExpenseList
                  expenses={group.expenses}
                  loading={false}
                  // For "All expenses" page, we can route the user back to the dashboard if they click edit,
                  // or just let them manage it there. Redirecting with an alert for simplicity.
                  onEdit={() => alert('Please return to the main dashboard to edit expenses.')}
                  onDelete={deleteExpense}
                  hasFilters={false}
                />
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
