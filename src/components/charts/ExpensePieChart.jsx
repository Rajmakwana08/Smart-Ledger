import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { groupByCategory } from '@/lib/utils'

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f97316',
  '#eab308', '#10b981', '#06b6d4', '#3b82f6',
  '#ef4444', '#a855f7',
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border rounded-xl p-3 shadow-xl text-sm">
        <p className="font-semibold capitalize">{payload[0].name}</p>
        <p className="text-muted-foreground">{formatCurrency(payload[0].value)}</p>
        <p className="text-muted-foreground">{payload[0].payload.percent?.toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

export default function ExpensePieChart({ transactions }) {
  const data = groupByCategory(transactions)

  const total = data.reduce((sum, d) => sum + d.value, 0)
  const dataWithPercent = data.map((d) => ({
    ...d,
    percent: total > 0 ? (d.value / total) * 100 : 0,
  }))

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-4xl mb-2">📊</p>
          <p className="text-muted-foreground text-sm">No expense data yet</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={dataWithPercent}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {dataWithPercent.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span className="text-xs capitalize text-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
