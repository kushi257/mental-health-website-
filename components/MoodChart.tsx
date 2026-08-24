'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface MoodLog {
  id: string
  score: number
  tags: string[]
  note?: string
  createdAt: string
}

export default function MoodChart({ logs }: { logs: MoodLog[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
        No mood logs available yet. Submit a check-in to start tracking!
      </div>
    )
  }

  const chartData = logs.map(l => {
    const d = new Date(l.createdAt)
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      score: l.score,
    }
  })

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#94a3b8" fontSize={11} tickLine={false} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const val = payload[0].value as number
                const labels = ['Struggling', 'Low', 'Okay', 'Good', 'Great']
                return (
                  <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                    <p className="font-bold">{payload[0].payload.date}</p>
                    <p className="text-teal-400">Score: {val}/5 ({labels[val - 1]})</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#0d9488"
            strokeWidth={3}
            dot={{ r: 4, fill: '#0d9488' }}
            activeDot={{ r: 7, fill: '#0ea5e9' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
