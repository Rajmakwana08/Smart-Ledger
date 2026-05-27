import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateNumeric(date) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export function formatDateInput(date) {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

export function getMonthName(monthIndex) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return months[monthIndex]
}

export function groupByMonth(transactions) {
  const grouped = {}
  transactions.forEach((t) => {
    const date = new Date(t.date)
    const key = `${date.getFullYear()}-${date.getMonth()}`
    if (!grouped[key]) {
      grouped[key] = {
        month: getMonthName(date.getMonth()),
        year: date.getFullYear(),
        income: 0,
        expense: 0,
      }
    }
    if (t.type === 'income') {
      grouped[key].income += t.amount
    } else {
      grouped[key].expense += t.amount
    }
  })
  return Object.values(grouped).slice(-6)
}

export function groupByCategory(transactions) {
  const grouped = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!grouped[t.category]) {
        grouped[t.category] = 0
      }
      grouped[t.category] += t.amount
    })
  return Object.entries(grouped).map(([name, value]) => ({ name, value }))
}
