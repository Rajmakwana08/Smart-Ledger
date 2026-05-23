import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '@/services/transactionService'
import { useToast } from '@/components/ui/use-toast'

export function useTransactions(filters = {}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTransactions = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data = await getTransactions(user.id, filters)
      setTransactions(data)
    } catch (err) {
      setError(err.message)
      toast({
        title: 'Error',
        description: 'Failed to load transactions.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [user, JSON.stringify(filters)])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  async function addTransaction(transaction) {
    try {
      const newTransaction = await createTransaction({
        ...transaction,
        user_id: user.id,
      })
      setTransactions((prev) => [newTransaction, ...prev])
      toast({
        title: 'Transaction added',
        description: `${transaction.title} has been recorded.`,
      })
      return newTransaction
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add transaction.',
        variant: 'destructive',
      })
      throw err
    }
  }

  async function editTransaction(id, updates) {
    try {
      const updated = await updateTransaction(id, updates)
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      )
      toast({
        title: 'Transaction updated',
        description: 'Changes saved successfully.',
      })
      return updated
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update transaction.',
        variant: 'destructive',
      })
      throw err
    }
  }

  async function removeTransaction(id) {
    try {
      await deleteTransaction(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
      toast({
        title: 'Transaction deleted',
        description: 'Transaction removed successfully.',
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete transaction.',
        variant: 'destructive',
      })
      throw err
    }
  }

  const stats = {
    income: transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    expense: transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    get balance() {
      return this.income - this.expense
    },
  }

  return {
    transactions,
    loading,
    error,
    stats,
    addTransaction,
    editTransaction,
    removeTransaction,
    refetch: fetchTransactions,
  }
}
