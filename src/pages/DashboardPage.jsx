import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import TransactionForm from '@/components/transactions/TransactionForm'
import MonthlyBarChart from '@/components/charts/MonthlyBarChart'
import ExpensePieChart from '@/components/charts/ExpensePieChart'
import { useTransactions } from '@/hooks/useTransactions'
import { useAuth } from '@/context/AuthContext'

export default function DashboardPage() {
  const [formOpen, setFormOpen] = useState(false)
  const { profile } = useAuth()
  const { transactions, loading, stats, addTransaction } = useTransactions()

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const displayName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">
            {greeting()}, {displayName} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's your financial overview
          </p>
        </div>
        <Button variant="gradient" onClick={() => setFormOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Balance"
          amount={stats.balance}
          icon={Wallet}
          gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
          index={0}
        />
        <StatsCard
          title="Total Income"
          amount={stats.income}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-400 to-teal-500"
          index={1}
        />
        <StatsCard
          title="Total Expenses"
          amount={stats.expense}
          icon={TrendingDown}
          gradient="bg-gradient-to-br from-rose-400 to-pink-500"
          index={2}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyBarChart transactions={transactions} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensePieChart transactions={transactions} />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
              <span className="text-xs text-muted-foreground">
                {transactions.length} total
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions} loading={loading} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction form */}
      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={addTransaction}
      />
    </div>
  )
}
