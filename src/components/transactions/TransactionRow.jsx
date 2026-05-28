import { useState } from 'react'
import { motion } from 'framer-motion'

import {
  Pencil,
  Trash2,
  MoreVertical,
  Wallet,
  FileText,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import {
  formatCurrency,
  formatDateNumeric,
} from '@/lib/utils'

export default function TransactionRow({
  transaction,
  transactions = [],
  onEdit,
  onDelete,
  index,
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  // =========================
  // CATEGORY
  // =========================

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

  // =========================
  // RUNNING BALANCE
  // =========================

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  )

  const currentIndex = sortedTransactions.findIndex(
    (t) => t.id === transaction.id
  )

  const previousTransactions =
    sortedTransactions.slice(0, currentIndex + 1)

  const balance = previousTransactions.reduce(
    (sum, t) =>
      t.type === 'income'
        ? sum + t.amount
        : sum - t.amount,
    0
  )

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="border-b last:border-0 hover:bg-muted/30 transition-colors group"
      >

        {/* ========================= */}
        {/* TRANSACTION */}
        {/* ========================= */}

        <td className="py-3 px-4">

          <div className="flex items-center gap-3">

            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${category.bg}`}
            >
              <Icon
                className={`h-4 w-4 ${category.text}`}
              />
            </div>

            <div>

              <p className="font-medium text-sm">
                {transaction.title}
              </p>

              {transaction.notes && (
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {transaction.notes}
                </p>
              )}

            </div>
          </div>
        </td>

        {/* ========================= */}
        {/* CATEGORY */}
        {/* ========================= */}

        <td className="py-3 px-4 hidden md:table-cell">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${category.bg}`}
            >
              <Icon
                className={`h-3.5 w-3.5 ${category.text}`}
              />
            </div>
            <span className="text-sm font-medium">
              {category.label}
            </span>
          </div>
        </td>

        {/* ========================= */}
        {/* DATE */}
        {/* ========================= */}

        <td className="py-3 px-4 hidden sm:table-cell text-sm text-muted-foreground">
          {formatDateNumeric(transaction.date)}
        </td>

        {/* ========================= */}
        {/* INCOME */}
        {/* ========================= */}

        <td className="py-3 px-4 text-right">

          {transaction.type === 'income' ? (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              + {formatCurrency(transaction.amount)}
            </span>
          ) : (
            <span className="text-muted-foreground">
              —
            </span>
          )}

        </td>

        {/* ========================= */}
        {/* EXPENSE */}
        {/* ========================= */}

        <td className="py-3 px-4 text-right">

          {transaction.type === 'expense' ? (
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              - {formatCurrency(transaction.amount)}
            </span>
          ) : (
            <span className="text-muted-foreground">
              —
            </span>
          )}

        </td>

        {/* ========================= */}
        {/* TOTAL BALANCE */}
        {/* ========================= */}

        <td className="py-3 px-4 text-right">

          <span className="font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(balance)}
          </span>

        </td>

        {/* ========================= */}
        {/* ACTIONS */}
        {/* ========================= */}

        <td className="py-3 px-4">

          <DropdownMenu>

            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              <DropdownMenuItem
                onClick={() => onEdit(transaction)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </motion.tr>

      {/* ========================= */}
      {/* DELETE CONFIRMATION */}
      {/* ========================= */}

      <AlertDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      >
        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Delete Transaction
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete "
              {transaction.title}"?
              This action cannot be undone.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                onDelete(transaction.id)
                setDeleteOpen(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>

          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}