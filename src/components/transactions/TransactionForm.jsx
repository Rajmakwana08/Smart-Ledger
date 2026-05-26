import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Store,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { cn, formatDateInput } from '@/lib/utils'
import { CATEGORIES, getCategoriesForType } from '@/utils/categories'

const defaultForm = {
  type: 'expense',
  title: '',
  amount: '',
  category: '',
  date: formatDateInput(new Date()),
  notes: '',
}

export default function TransactionForm({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  const [form, setForm] = useState(initialData || defaultForm)
  const [loading, setLoading] = useState(false)

  const isEdit = !!initialData

  function handleChange(field, value) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value }

      // Reset category when type changes
      if (field === 'type') {
        updated.category = ''
      }

      return updated
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.title || !form.amount || !form.category || !form.date) return

    setLoading(true)

    try {
      await onSubmit({
        ...form,
        amount: parseFloat(form.amount),
      })

      if (!isEdit) {
        setForm(defaultForm)
      }

      onClose()
    } finally {
      setLoading(false)
    }
  }

  // Get categories based on type
  let categories = getCategoriesForType(form.type)

  // Add SHOP category inside income
  if (form.type === 'income') {
    categories = [
      
      {
        id: 'shop',
        label: 'Shop',
        icon: Store,
        color: '#8b5cf6',
      },
      ...categories,
    ]
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
            {['expense', 'income'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('type', type)}
                className={cn(
                  'flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
                  form.type === type
                    ? type === 'expense'
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-emerald-500 text-white shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {type === 'expense' ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}

                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>

            <Input
              id="title"
              placeholder="e.g. Grocery shopping"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount</Label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ₹
              </span>

              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="pl-7"
                value={form.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>

            <Select
              value={form.category}
              onValueChange={(val) => handleChange('category', val)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>

              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <cat.icon
                        className="h-4 w-4"
                        style={{ color: cat.color }}
                      />

                      {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>

            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>

            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
            />
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="gradient"
              disabled={
                loading ||
                !form.title ||
                !form.amount ||
                !form.category
              }
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />

                  {isEdit
                    ? 'Save Changes'
                    : 'Add Transaction'}
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}