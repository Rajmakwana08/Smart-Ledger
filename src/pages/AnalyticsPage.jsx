import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import MonthlyBarChart from '@/components/charts/MonthlyBarChart'
import ExpensePieChart from '@/components/charts/ExpensePieChart'
import { useTransactions } from '@/hooks/useTransactions'
import { formatCurrency } from '@/lib/utils'
import { getCategoryById } from '@/utils/categories'
import { groupByCategory } from '@/lib/utils'

export default function AnalyticsPage() {
  const { transactions, loading, stats } = useTransactions()

  const categoryData = useMemo(() => groupByCategory(transactions), [transactions])

  const topCategories = useMemo(() => {
    return [...categoryData]
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [categoryData])

  const savingsRate = stats.income > 0
    ? ((stats.income - stats.expense) / stats.income * 100).toFixed(1)
    : 0

  const avgTransaction = transactions.length > 0
    ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
    : 0

  const summaryCards = [
    {
      title: 'Net Savings',
      value: formatCurrency(stats.balance),
      icon: DollarSign,
      positive: stats.balance >= 0,
      sub: `${savingsRate}% savings rate`,
      gradient: stats.balance >= 0
        ? 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20'
        : 'from-rose-500/10 to-pink-500/10 border-rose-500/20',
      textColor: stats.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
    },
    {
      title: 'Total Income',
      value: formatCurrency(stats.income),
      icon: TrendingUp,
      positive: true,
      sub: `${transactions.filter((t) => t.type === 'income').length} transactions`,
      gradient: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats.expense),
      icon: TrendingDown,
      positive: false,
      sub: `${transactions.filter((t) => t.type === 'expense').length} transactions`,
      gradient: 'from-orange-500/10 to-amber-500/10 border-orange-500/20',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      title: 'Avg Transaction',
      value: formatCurrency(avgTransaction),
      icon: BarChart3,
      positive: true,
      sub: `${transactions.length} total transactions`,
      gradient: 'from-purple-500/10 to-violet-500/10 border-purple-500/20',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Insights into your financial health
        </p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={`bg-gradient-to-br ${card.gradient} border`}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <div className={`w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center`}>
                    <card.icon className={`h-4 w-4 ${card.textColor}`} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Monthly Income vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyBarChart transactions={transactions} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-purple-500" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensePieChart transactions={transactions} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top spending categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Spending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {topCategories.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-2">📊</p>
                <p className="text-muted-foreground text-sm">No expense data yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topCategories.map((cat, i) => {
                  const category = getCategoryById(cat.name)
                  const Icon = category.icon
                  const percentage = stats.expense > 0
                    ? ((cat.value / stats.expense) * 100).toFixed(1)
                    : 0

                  return (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="flex items-center gap-4"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${category.bg}`}>
                        <Icon className={`h-4 w-4 ${category.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category.label}</span>
                          <span className="text-sm font-semibold">{formatCurrency(cat.value)}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: 0.8 + i * 0.05, duration: 0.6 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right flex-shrink-0">
                        {percentage}%
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
