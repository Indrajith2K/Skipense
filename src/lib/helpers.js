/**
 * Currency formatter — Indian Rupee, 2 decimal places.
 * We use Intl.NumberFormat over a manual implementation because
 * it handles locale-specific grouping (1,00,000 vs 100,000) correctly.
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Date formatter — converts ISO date string (YYYY-MM-DD) to
 * human-readable form: "23 Sep 2026".
 * The `timeZone: 'UTC'` prevents off-by-one-day bugs caused by
 * local timezone shifting a midnight UTC date to the previous day.
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateStr))
}

/**
 * Consistent category color palette.
 * These exact hex values are also used in the Recharts color array
 * in Charts.jsx — keep them in sync via this single source of truth.
 */
export const CATEGORY_COLORS = {
  Travel:    '#1B3530',
  Food:      '#C7F269',
  Office:    '#2D5F57',
  Software:  '#8BC34A',
  Marketing: '#4CAF50',
  Utilities: '#558B6E',
  Other:     '#ECECEC',
}

/**
 * Returns a Tailwind-compatible background + text class pair for a category pill.
 * We use inline style for bg (from CATEGORY_COLORS) and derive text contrast manually.
 */
export function getCategoryStyle(category) {
  const bg = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other
  // Lime and Mist are light — use dark ink text. Darks use white.
  const lightBgs = ['#C7F269', '#8BC34A', '#ECECEC']
  const textColor = lightBgs.includes(bg) ? '#112320' : '#ffffff'
  return { backgroundColor: bg, color: textColor }
}

/**
 * Available expense categories — single source of truth.
 * Imported by ExpenseForm and Filters to keep dropdowns in sync.
 */
export const CATEGORIES = [
  'Travel',
  'Food',
  'Office',
  'Software',
  'Marketing',
  'Utilities',
  'Other',
]
