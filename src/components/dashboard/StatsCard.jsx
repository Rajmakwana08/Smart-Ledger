import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function StatsCard({ title, amount, icon: Icon, gradient, trend, trendValue, index }) {
  const animatedAmount = useAnimatedCounter(amount, 1200)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 text-white shadow-lg',
        gradient
      )}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 translate-y-6 -translate-x-6" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>

        <p className="text-3xl font-bold tracking-tight">
          {formatCurrency(animatedAmount)}
        </p>

        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trend >= 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-white/80" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-white/80" />
            )}
            <span className="text-xs text-white/80">
              {Math.abs(trendValue || trend)}% vs last month
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
