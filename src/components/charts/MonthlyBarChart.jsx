import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { groupByMonth } from '@/lib/utils'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border rounded-xl p-3 shadow-xl text-sm space-y-1">
        <p className="font-semibold">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: p.fill }}
            />
            <span className="text-muted-foreground capitalize">{p.name}:</span>
            <span className="font-medium">{formatCurrency(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function MonthlyBarChart({ transactions }) {
  const data = groupByMonth(transactions)

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-4xl mb-2">📈</p>
          <p className="text-muted-foreground text-sm">No data to display yet</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={4} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 4 }} />
        <Legend
          formatter={(value) => (
            <span className="text-xs capitalize text-foreground">{value}</span>
          )}
        />
        <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} name="income" />
        <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} name="expense" />
      </BarChart>
    </ResponsiveContainer>
  )
}
