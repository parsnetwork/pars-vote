import { Link } from 'react-router-dom'
import { formatUnits } from 'viem'
import { Clock, TrendingUp, Percent, ArrowRight } from 'lucide-react'
import type { Bond } from '../../../hooks/bond/useBond'

interface BondListProps {
  bonds: Bond[]
  isLoading?: boolean
}

export function BondList({ bonds, isLoading }: BondListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-white/20 p-6 animate-pulse">
            <div className="h-6 bg-white/10 w-1/3 mb-4" />
            <div className="h-4 bg-white/10 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (bonds.length === 0) {
    return (
      <div className="border border-white/20 p-12 text-center">
        <p className="text-white/60 font-mono text-sm uppercase tracking-wider">
          No active bonds
        </p>
        <p className="text-white/40 text-sm mt-2">
          Check back later for new bond opportunities
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-0 border border-white/20">
      {bonds.map((bond, index) => (
        <BondCard
          key={bond.id}
          bond={bond}
          isLast={index === bonds.length - 1}
        />
      ))}
    </div>
  )
}

interface BondCardProps {
  bond: Bond
  isLast?: boolean
}

function BondCard({ bond, isLast }: BondCardProps) {
  const targetRaiseFormatted = formatUnits(bond.targetRaise, 18)
  const totalRaisedFormatted = formatUnits(bond.totalRaised, 18)

  return (
    <Link
      to={`/bond/${bond.id}`}
      className={`block p-6 hover:bg-white/5 transition-colors group ${
        !isLast ? 'border-b border-white/20' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
              Bond #{bond.id}
            </span>
            {bond.isSoldOut && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-mono uppercase">
                Sold Out
              </span>
            )}
            {bond.isExpired && !bond.isSoldOut && (
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs font-mono uppercase">
                Expired
              </span>
            )}
            {bond.active && !bond.isSoldOut && !bond.isExpired && (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-mono uppercase">
                Active
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-pars-gold transition-colors">
            ASHA Bond
          </h3>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black text-pars-gold">
            {bond.discountPercent.toFixed(1)}%
          </p>
          <p className="text-xs text-white/40 font-mono uppercase">Discount</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-white/40 font-mono uppercase mb-1">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Target
          </p>
          <p className="text-sm font-medium text-white">
            {Number(targetRaiseFormatted).toLocaleString()} USDC
          </p>
        </div>

        <div>
          <p className="text-xs text-white/40 font-mono uppercase mb-1">
            <Percent className="w-3 h-3 inline mr-1" />
            Raised
          </p>
          <p className="text-sm font-medium text-white">
            {Number(totalRaisedFormatted).toLocaleString()} USDC
          </p>
        </div>

        <div>
          <p className="text-xs text-white/40 font-mono uppercase mb-1">
            <Clock className="w-3 h-3 inline mr-1" />
            Vesting
          </p>
          <p className="text-sm font-medium text-white">
            {bond.vestingDays.toFixed(0)} days
          </p>
        </div>

        <div>
          <p className="text-xs text-white/40 font-mono uppercase mb-1">Progress</p>
          <p className="text-sm font-medium text-white">
            {bond.progress.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/10 mb-4">
        <div
          className="h-full bg-pars-gold transition-all"
          style={{ width: `${Math.min(100, bond.progress)}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-white/40 font-mono">
          Min: {formatUnits(bond.minPurchase, 18)} | Max: {formatUnits(bond.maxPurchase, 18)}
        </p>
        <span className="flex items-center gap-1 text-sm text-pars-gold group-hover:gap-2 transition-all">
          Bond Now <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </Link>
  )
}

// Desktop table view for larger screens
export function BondTable({ bonds, isLoading }: BondListProps) {
  if (isLoading || bonds.length === 0) {
    return <BondList bonds={bonds} isLoading={isLoading} />
  }

  return (
    <div className="hidden lg:block border border-white/20">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20 text-left">
            <th className="p-4 font-mono text-xs text-white/40 uppercase tracking-wider">Bond</th>
            <th className="p-4 font-mono text-xs text-white/40 uppercase tracking-wider">Discount</th>
            <th className="p-4 font-mono text-xs text-white/40 uppercase tracking-wider">Vesting</th>
            <th className="p-4 font-mono text-xs text-white/40 uppercase tracking-wider">Progress</th>
            <th className="p-4 font-mono text-xs text-white/40 uppercase tracking-wider">Status</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {bonds.map((bond) => (
            <tr key={bond.id} className="border-b border-white/10 hover:bg-white/5">
              <td className="p-4">
                <span className="font-bold text-white">ASHA Bond #{bond.id}</span>
              </td>
              <td className="p-4">
                <span className="text-pars-gold font-bold">{bond.discountPercent.toFixed(1)}%</span>
              </td>
              <td className="p-4">
                <span className="text-white/80">{bond.vestingDays.toFixed(0)} days</span>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1 bg-white/10">
                    <div
                      className="h-full bg-pars-gold"
                      style={{ width: `${Math.min(100, bond.progress)}%` }}
                    />
                  </div>
                  <span className="text-white/60 text-sm">{bond.progress.toFixed(0)}%</span>
                </div>
              </td>
              <td className="p-4">
                {bond.isSoldOut && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-mono uppercase">
                    Sold Out
                  </span>
                )}
                {bond.isExpired && !bond.isSoldOut && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-mono uppercase">
                    Expired
                  </span>
                )}
                {bond.active && !bond.isSoldOut && !bond.isExpired && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-mono uppercase">
                    Active
                  </span>
                )}
              </td>
              <td className="p-4">
                <Link
                  to={`/bond/${bond.id}`}
                  className="px-4 py-2 bg-pars-gold text-black font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Bond
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
