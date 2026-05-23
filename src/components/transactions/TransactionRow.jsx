import { useState } from 'react'
import { motion } from 'framer-motion'
import { Pencil, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { formatCurrency, formatDate } from '@/lib/utils'
import { getCategoryById } from '@/utils/categories'

export default function TransactionRow({ transaction, onEdit, onDelete, index }) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const category = getCategoryById(transaction.category)
  const Icon = category.icon

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="border-b last:border-0 hover:bg-muted/30 transition-colors group"
      >
        {/* Category icon + title */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${category.bg}`}>
              <Icon className={`h-4 w-4 ${category.text}`} />
            </div>
            <div>
              <p className="font-medium text-sm">{transaction.title}</p>
              {transaction.notes && (
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {transaction.notes}
                </p>
              )}
            </div>
          </div>
        </td>

        {/* Category */}
        <td className="py-3 px-4 hidden md:table-cell">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${category.bg} ${category.text}`}>
            {category.label}
          </span>
        </td>

        {/* Date */}
        <td className="py-3 px-4 hidden sm:table-cell text-sm text-muted-foreground">
          {formatDate(transaction.date)}
        </td>

        {/* Type */}
        <td className="py-3 px-4 hidden lg:table-cell">
          <Badge variant={transaction.type === 'income' ? 'success' : 'danger'}>
            {transaction.type}
          </Badge>
        </td>

        {/* Amount */}
        <td className="py-3 px-4 text-right">
          <span
            className={`font-semibold text-sm ${
              transaction.type === 'income'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </span>
        </td>

        {/* Actions */}
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
              <DropdownMenuItem onClick={() => onEdit(transaction)}>
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

      {/* Delete confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{transaction.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
