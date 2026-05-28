import { motion } from 'framer-motion'
import {
  ArrowRight,
  Wallet,
  FileText,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import {
  formatCurrency,
  formatDateNumeric,
} from '@/lib/utils'

export default function RecentTransactions({
  transactions,
  loading,
}) {
  const navigate = useNavigate()

  // Loading State
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3"
          >
            <Skeleton className="h-10 w-10 rounded-xl" />

            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>

            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    )
  }

  // Empty State
  if (!transactions.length) {
    return (
      <div className="text-center py-10">
        <p className="text-4xl mb-3">💸</p>

        <p className="text-muted-foreground text-sm">
          No transactions yet
        </p>

        <p className="text-muted-foreground text-xs mt-1">
          Add your first transaction to get started
        </p>
      </div>
    )
  }

  return (
    <div>

      <div className="space-y-1">

        {transactions.slice(0, 6).map((transaction, i) => {

          // Get category
          let category

          if (transaction.category === 'cash') {
            category = {
              id: 'cash',
              label: 'Cash',
              icon: Wallet,
              bg: 'bg-emerald-100 dark:bg-emerald-900/30',
              text: 'text-emerald-600 dark:text-emerald-400',
            }
          } else if (transaction.category === 'check') {
            category = {
              id: 'check',
              label: 'Check',
              icon: FileText,
              bg: 'bg-blue-100 dark:bg-blue-900/30',
              text: 'text-blue-600 dark:text-blue-400',
            }
          } else {
            category = {
              id: transaction.category,
              label: transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1),
              icon: Wallet,
              bg: 'bg-gray-100 dark:bg-gray-900/30',
              text: 'text-gray-600 dark:text-gray-400',
            }
          }

          const Icon = category.icon

          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-default"
            >

              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${category.bg}`}
              >
                <Icon
                  className={`h-4 w-4 ${category.text}`}
                />
              </div>

              {/* Title + Date */}
              <div className="flex-1 min-w-0">

                <p className="font-medium text-sm truncate">
                  {transaction.title}
                </p>

                <p className="text-xs text-muted-foreground">
                  {formatDateNumeric(transaction.date)}
                </p>
              </div>

              {/* Amount */}
              <span
                className={`font-semibold text-sm flex-shrink-0 ${
                  transaction.type === 'income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {transaction.type === 'income'
                  ? '+'
                  : '-'}

                {formatCurrency(transaction.amount)}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* View All Button */}
      {transactions.length > 6 && (
        <Button
          variant="ghost"
          className="w-full mt-3 text-muted-foreground hover:text-foreground"
          onClick={() =>
            navigate('/transactions')
          }
        >
          View all transactions

          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  )
}