import { Info } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number | null
  tooltip?: string
  isLoading?: boolean
  subValue?: string
}

export function MetricCard({ label, value, tooltip, isLoading, subValue }: MetricCardProps) {
  return (
    <div className="flex flex-col gap-1 min-w-[180px]">
      <div className="flex items-center gap-2">
        <span className="text-sm text-white/60">{label}</span>
        {tooltip && (
          <div className="group relative">
            <Info className="w-4 h-4 text-white/40 cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black border border-white/20 text-white/80 text-xs max-w-[280px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-pre-wrap">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="h-9 w-32 bg-white/5 animate-pulse" />
      ) : (
        <>
          <span className="text-2xl md:text-3xl font-bold text-pars-gold">{value ?? '---'}</span>
          {subValue && <span className="text-sm text-white/50">{subValue}</span>}
        </>
      )}
    </div>
  )
}

interface MetricRowProps {
  children: React.ReactNode
}

export function MetricRow({ children }: MetricRowProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap justify-around gap-6">
        {children}
      </div>
    </div>
  )
}
