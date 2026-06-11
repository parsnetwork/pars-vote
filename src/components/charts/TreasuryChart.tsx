import { ReactNode } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Info } from 'lucide-react'

// Pars brand colors for charts
export const PARS_CHART_COLORS = {
  gold: '#D4AF37',
  bronze: '#CD7F32',
  copper: '#B87333',
  brass: '#B5A642',
  amber: '#FFBF00',
  tan: '#8B7355',
  sand: '#C2B280',
  wheat: '#DEB887',
  // For stacked areas
  stable: '#D4AF37',    // Gold for stablecoins
  volatile: '#CD7F32',  // Bronze for volatile
  pol: '#8B7355',       // Tan for POL
  line: '#FFFFFF',      // White for comparison line
}

export type ChartType = 'area' | 'stacked-area' | 'line' | 'bar' | 'composed'

interface ChartCardProps {
  title: string
  subTitle?: string
  tooltip?: string
  isLoading?: boolean
  children: ReactNode
  height?: number
}

export function ChartCard({ title, subTitle, tooltip, isLoading, children, height = 400 }: ChartCardProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg text-white/70">{title}</h3>
            {tooltip && (
              <div className="group relative">
                <Info className="w-4 h-4 text-white/40 cursor-help" />
                <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-black border border-white/20 text-white/80 text-xs max-w-[300px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-pre-wrap">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
          {subTitle && (
            <span className="text-2xl md:text-3xl font-bold text-pars-gold">{subTitle}</span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse bg-white/5" style={{ height }} />
      ) : (
        <div style={{ height }}>
          {children}
        </div>
      )}
    </div>
  )
}

interface TreasuryAreaChartProps {
  data: any[]
  dataKeys: { key: string; name: string; color: string }[]
  xAxisKey?: string
  stacked?: boolean
  showLegend?: boolean
  valueFormatter?: (value: number) => string
}

export function TreasuryAreaChart({
  data,
  dataKeys,
  xAxisKey = 'date',
  stacked = false,
  showLegend = true,
  valueFormatter = (v) => formatCurrency(v),
}: TreasuryAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {dataKeys.map(({ key, color }) => (
            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          stroke="#666"
          tick={{ fill: '#999', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(date) => formatDate(date)}
        />
        <YAxis
          stroke="#666"
          tick={{ fill: '#999', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 0,
          }}
          labelStyle={{ color: '#999' }}
          formatter={(value, name) => [typeof value === 'number' ? valueFormatter(value) : '---', name]}
          labelFormatter={(date) => formatDateFull(date)}
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => <span className="text-white/70 text-sm">{value}</span>}
          />
        )}
        {dataKeys.map(({ key, name, color }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={name}
            stroke={color}
            fill={`url(#gradient-${key})`}
            stackId={stacked ? '1' : undefined}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

interface TreasuryComposedChartProps {
  data: any[]
  areaKeys: { key: string; name: string; color: string }[]
  lineKeys?: { key: string; name: string; color: string }[]
  xAxisKey?: string
  showLegend?: boolean
  valueFormatter?: (value: number) => string
}

export function TreasuryComposedChart({
  data,
  areaKeys,
  lineKeys = [],
  xAxisKey = 'date',
  showLegend = true,
  valueFormatter = (v) => formatCurrency(v),
}: TreasuryComposedChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {areaKeys.map(({ key, color }) => (
            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          stroke="#666"
          tick={{ fill: '#999', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(date) => formatDate(date)}
        />
        <YAxis
          stroke="#666"
          tick={{ fill: '#999', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 0,
          }}
          labelStyle={{ color: '#999' }}
          formatter={(value, name) => [typeof value === 'number' ? valueFormatter(value) : '---', name]}
          labelFormatter={(date) => formatDateFull(date)}
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => <span className="text-white/70 text-sm">{value}</span>}
          />
        )}
        {areaKeys.map(({ key, name, color }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={name}
            stroke={color}
            fill={`url(#gradient-${key})`}
            stackId="1"
          />
        ))}
        {lineKeys.map(({ key, name, color }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            name={name}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

interface SupplyBreakdownChartProps {
  data: any[]
  dataKeys: { key: string; name: string; color: string }[]
  xAxisKey?: string
  showLegend?: boolean
}

export function SupplyBreakdownChart({
  data,
  dataKeys,
  xAxisKey = 'date',
  showLegend = true,
}: SupplyBreakdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {dataKeys.map(({ key, color }) => (
            <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          stroke="#666"
          tick={{ fill: '#999', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(date) => formatDate(date)}
        />
        <YAxis
          stroke="#666"
          tick={{ fill: '#999', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatNumber(v)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #333',
            borderRadius: 0,
          }}
          labelStyle={{ color: '#999' }}
          formatter={(value, name) => [typeof value === 'number' ? formatNumber(value) : '---', name]}
          labelFormatter={(date) => formatDateFull(date)}
        />
        {showLegend && (
          <Legend
            verticalAlign="bottom"
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => <span className="text-white/70 text-sm">{value}</span>}
          />
        )}
        {dataKeys.map(({ key, name, color }) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            name={name}
            stroke={color}
            fill={`url(#gradient-${key})`}
            stackId="1"
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Utility functions
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toFixed(2)}`
}

function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toFixed(0)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export { formatCurrency, formatNumber, formatDate, formatDateFull }
