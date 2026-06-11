import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { formatUnits } from 'viem'
import { useChainId } from 'wagmi'
import { ArrowLeft, Clock, TrendingUp, Percent, ExternalLink } from 'lucide-react'
import { useBond } from '../../../hooks/bond/useBond'
import { BondInputArea } from './BondInputArea'

export function BondModal() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const chainId = useChainId()

  const bondId = id ? parseInt(id, 10) : 0
  const { data: bond, isLoading, error } = useBond({ bondId, chainId })

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate('/bond')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 w-1/4 mb-8" />
            <div className="h-64 bg-white/10" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !bond) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Link to="/bond" className="flex items-center gap-2 text-white/60 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Bonds
          </Link>
          <div className="border border-red-500/50 bg-red-500/10 p-8 text-center">
            <p className="text-red-400 font-bold mb-2">Bond Not Found</p>
            <p className="text-white/60 text-sm">
              This bond may have been closed or doesn't exist.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const endDate = new Date(Number(bond.endTime) * 1000)
  const startDate = new Date(Number(bond.startTime) * 1000)

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/bond" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-sm uppercase">Back</span>
          </Link>
          <div className="flex items-center gap-4">
            {bond.isSoldOut && (
              <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-mono uppercase">
                Sold Out
              </span>
            )}
            {bond.isExpired && !bond.isSoldOut && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-mono uppercase">
                Expired
              </span>
            )}
            {bond.active && !bond.isSoldOut && !bond.isExpired && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-mono uppercase">
                Active
              </span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Bond Info */}
          <div>
            <div className="border border-white/20 p-8 mb-6">
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
                Bond #{bond.id}
              </p>
              <h1 className="text-4xl font-black uppercase tracking-tight mb-4">
                ASHA Bond
              </h1>
              <p className="text-white/60">
                Purchase ASHA tokens at a discount. Your tokens will vest linearly over the vesting period.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-0 border border-white/20">
              <div className="p-6 border-r border-b border-white/20">
                <div className="flex items-center gap-2 text-white/40 mb-2">
                  <Percent className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase">Discount</span>
                </div>
                <p className="text-3xl font-black text-pars-gold">
                  {bond.discountPercent.toFixed(1)}%
                </p>
              </div>

              <div className="p-6 border-b border-white/20">
                <div className="flex items-center gap-2 text-white/40 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase">Vesting</span>
                </div>
                <p className="text-3xl font-black text-white">
                  {bond.vestingDays.toFixed(0)}
                </p>
                <p className="text-white/40 text-sm">days</p>
              </div>

              <div className="p-6 border-r border-white/20">
                <div className="flex items-center gap-2 text-white/40 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase">Target</span>
                </div>
                <p className="text-xl font-bold text-white">
                  {Number(formatUnits(bond.targetRaise, 18)).toLocaleString()}
                </p>
                <p className="text-white/40 text-sm">USDC</p>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-white/40 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase">Raised</span>
                </div>
                <p className="text-xl font-bold text-pars-gold">
                  {Number(formatUnits(bond.totalRaised, 18)).toLocaleString()}
                </p>
                <p className="text-white/40 text-sm">USDC ({bond.progress.toFixed(1)}%)</p>
              </div>
            </div>

            {/* Progress */}
            <div className="border border-white/20 border-t-0 p-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/40 font-mono uppercase">Progress</span>
                <span className="text-white font-bold">{bond.progress.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-white/10">
                <div
                  className="h-full bg-pars-gold transition-all"
                  style={{ width: `${Math.min(100, bond.progress)}%` }}
                />
              </div>
            </div>

            {/* Time Info */}
            <div className="border border-white/20 border-t-0 p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-white/40 font-mono uppercase mb-1">Start</p>
                  <p className="text-white">{startDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-white/40 font-mono uppercase mb-1">End</p>
                  <p className="text-white">{endDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Payment Token */}
            <div className="border border-white/20 border-t-0 p-6">
              <p className="text-white/40 font-mono text-xs uppercase mb-2">Payment Token</p>
              <div className="flex items-center justify-between">
                <span className="text-white font-mono">{bond.paymentToken.slice(0, 10)}...{bond.paymentToken.slice(-8)}</span>
                <a
                  href={`https://explore.lux.network/address/${bond.paymentToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pars-gold hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Purchase Form */}
          <div>
            <div className="border border-white/20 p-6">
              <h2 className="text-xl font-black uppercase tracking-tight mb-6">
                Bond USDC for ASHA
              </h2>

              {bond.active && !bond.isSoldOut && !bond.isExpired ? (
                <BondInputArea bond={bond} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/60 mb-4">
                    {bond.isSoldOut
                      ? 'This bond has sold out.'
                      : bond.isExpired
                        ? 'This bond has expired.'
                        : 'This bond is not currently active.'}
                  </p>
                  <Link
                    to="/bond"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-pars-gold text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
                  >
                    View Other Bonds
                  </Link>
                </div>
              )}
            </div>

            {/* Info box */}
            <div className="border border-white/20 border-t-0 p-6 bg-white/5">
              <h3 className="font-bold text-white mb-3">How Bonding Works</h3>
              <ol className="space-y-2 text-sm text-white/60">
                <li className="flex gap-2">
                  <span className="text-pars-gold font-bold">1.</span>
                  Deposit USDC at a discount
                </li>
                <li className="flex gap-2">
                  <span className="text-pars-gold font-bold">2.</span>
                  ASHA tokens vest over {bond.vestingDays.toFixed(0)} days
                </li>
                <li className="flex gap-2">
                  <span className="text-pars-gold font-bold">3.</span>
                  Claim vested tokens anytime
                </li>
                <li className="flex gap-2">
                  <span className="text-pars-gold font-bold">4.</span>
                  Stake ASHA for veASHA to vote
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
