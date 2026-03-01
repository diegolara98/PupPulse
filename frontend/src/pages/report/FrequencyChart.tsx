import { Box, Typography } from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import type { SeizureRecord } from '../../types'
import type { TimeRange } from './reportUtils'
import { buildChartBuckets } from './reportUtils'
import { frequencyChartStyles as s } from './FrequencyChart.styles'

interface Props {
  records: SeizureRecord[]
  range: TimeRange
}

// Custom tooltip styled to match the dark theme instead of recharts' default white box
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <Box sx={s.tooltipBox}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography fontWeight={700} color="primary.light">
        {payload[0].value} seizure{payload[0].value !== 1 ? 's' : ''}
      </Typography>
    </Box>
  )
}

export default function FrequencyChart({ records, range }: Props) {
  const buckets = buildChartBuckets(records, range)
  const max = Math.max(...buckets.map(b => b.count), 1)

  return (
    <Box sx={s.root}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buckets} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: '#aaa', fontSize: 11 }}
            axisLine={{ stroke: '#444' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, max + 1]}
            tick={{ fill: '#aaa', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {buckets.map((_, i) => (
              // Slightly lighter shade for bars with zero seizures so they don't vanish
              <Cell key={i} fill={buckets[i].count === 0 ? '#2a2a40' : '#674CA7'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
