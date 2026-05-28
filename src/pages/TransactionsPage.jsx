import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import TransactionRow from '@/components/transactions/TransactionRow'
import TransactionForm from '@/components/transactions/TransactionForm'
import { useTransactions } from '@/hooks/useTransactions'
import { CATEGORIES } from '@/utils/categories'
import { exportToCSV, exportToPDF } from '@/utils/exportUtils'
import { formatDateInput } from '@/lib/utils'

export default function TransactionsPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [pdfTitle, setPdfTitle] = useState('')
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedTransactionIds, setSelectedTransactionIds] = useState([])
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)

  const { transactions, loading, stats, addTransaction, editTransaction, removeTransaction } =
    useTransactions()

  // Client-side filtering, sorting, and balance calculation
  const { filtered, transactionBalances } = useMemo(() => {
    const filteredTransactions = transactions.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      if (startDate && t.date < startDate) return false
      if (endDate && t.date > endDate) return false
      return true
    })
    
    // Sort oldest first to calculate running balance
    const sortedAsc = [...filteredTransactions].sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date)
      if (dateDiff !== 0) return dateDiff
      
      // If dates are same, sort by entry order (oldest entry first, since useTransactions adds new to beginning)
      return transactions.indexOf(a) - transactions.indexOf(b)
    })
    
    // Calculate running balance
    let balance = 0
    const balanceMap = {}
    sortedAsc.forEach(t => {
      if (t.type === 'income') {
        balance += t.amount
      } else {
        balance -= t.amount
      }
      balanceMap[t.id] = balance
    })
    
    // Sort newest first for display
    const sortedDesc = [...filteredTransactions].sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date)
      if (dateDiff !== 0) return dateDiff
      
      // If dates are same, sort oldest entry first (bottom to top in same-day group)
      return transactions.indexOf(b) - transactions.indexOf(a)
    })
    
    return { filtered: sortedDesc, transactionBalances: balanceMap }
  }, [transactions, search, typeFilter, categoryFilter, startDate, endDate])

  function handleEdit(transaction) {
    setEditingTransaction({
      ...transaction,
      amount: String(transaction.amount),
    })
    setFormOpen(true)
  }

  function handleCloseForm() {
    setFormOpen(false)
    setEditingTransaction(null)
  }

  async function handleSubmit(data) {
    if (editingTransaction) {
      await editTransaction(editingTransaction.id, data)
    } else {
      await addTransaction(data)
    }
  }

  function clearFilters() {
    setSearch('')
    setTypeFilter('all')
    setCategoryFilter('all')
    setStartDate('')
    setEndDate('')
  }

  const hasActiveFilters =
    search || typeFilter !== 'all' || categoryFilter !== 'all' || startDate || endDate

  function toggleTransactionSelection(id) {
    setSelectedTransactionIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    )
  }

  function toggleSelectAll() {
    if (selectedTransactionIds.length === filtered.length) {
      setSelectedTransactionIds([])
    } else {
      setSelectedTransactionIds(filtered.map((t) => t.id))
    }
  }

  async function handleBulkDelete() {
    for (const id of selectedTransactionIds) {
      await removeTransaction(id)
    }
    setSelectedTransactionIds([])
    setBulkDeleteOpen(false)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {selectedTransactionIds.length > 0 
              ? `${selectedTransactionIds.length} selected` 
              : `${filtered.length} of ${transactions.length} transactions`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {isSelectionMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSelectionMode(false)
                  setSelectedTransactionIds([])
                }}
              >
                Cancel
              </Button>
              {selectedTransactionIds.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setBulkDeleteOpen(true)} 
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedTransactionIds.length})
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelectionMode(true)}
              >
                Select
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToCSV(filtered, transactionBalances)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPdfDialogOpen(true)}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
              <Button variant="gradient" onClick={() => setFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-accent' : ''}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t mt-3"
            >
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="Start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                placeholder="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-medium">No transactions found</p>
              <p className="text-muted-foreground text-sm mt-1">
                {hasActiveFilters
                  ? 'Try adjusting your filters'
                  : 'Add your first transaction to get started'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    {isSelectionMode && (
                      <th className="py-3 px-4 w-12">
                        <input
                          type="checkbox"
                          checked={filtered.length > 0 && selectedTransactionIds.length === filtered.length}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </th>
                    )}
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Income
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Expense
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Total Balance
                    </th>
                    <th className="py-3 px-4 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((transaction, i) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      balance={transactionBalances[transaction.id]}
                      onEdit={handleEdit}
                      onDelete={removeTransaction}
                      index={i}
                      isSelectionMode={isSelectionMode}
                      isSelected={selectedTransactionIds.includes(transaction.id)}
                      onToggleSelect={() => toggleTransactionSelection(transaction.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form */}
      <TransactionForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingTransaction}
      />

      {/* PDF Title Dialog */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Download PDF</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pdfTitle">Report Title</Label>
              <Input
                id="pdfTitle"
                placeholder="e.g. Monthly Transactions"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPdfDialogOpen(false)
                setPdfTitle('')
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="gradient"
              onClick={() => {
                exportToPDF(filtered, transactionBalances, stats, pdfTitle || 'Financial Report')
                setPdfDialogOpen(false)
                setPdfTitle('')
              }}
            >
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedTransactionIds.length} Transactions
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete these {selectedTransactionIds.length} transactions?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
