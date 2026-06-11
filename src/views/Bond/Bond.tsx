import { Link } from 'react-router-dom'
import { useChainId } from 'wagmi'
import { ArrowRight, TrendingUp, Percent, Clock, Info } from 'lucide-react'
import { formatUnits } from 'viem'
import { useLiveBonds, useBondStats } from '../../hooks/bond/useLiveBonds'
import { BondList, BondTable } from './components/BondList'
import { ClaimBonds } from './components/ClaimBonds'

export function Bond() {
  const chainId = useChainId()
  const { data: bonds, isLoading, isSuccess } = useLiveBonds({ chainId })
  const { data: stats } = useBondStats({ chainId })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-white/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <p className="font-mono text-xs tracking-widest text-white/40 mb-4 uppercase">
              Treasury Bonds
            </p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
              <span className="text-white">BOND.</span>
              <br />
              <span className="text-pars-gold">DISCOUNT.</span>
              <br />
              <span className="text-white/60">VEST.</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mb-8">
              Purchase ASHA tokens at a discount by providing liquidity to the treasury.
              Your tokens vest over time, giving you governance power in the Pars Protocol.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#bonds"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pars-gold text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
              >
                View Bonds
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/staking"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-black transition-colors"
              >
                Stake ASHA
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-white/20 py-6 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between gap-8 font-mono text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/40" />
              <span className="text-white/40 uppercase tracking-wider">Active Bonds</span>
              <span className="text-white font-bold ml-2">{stats?.totalBonds || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-white/40" />
              <span className="text-white/40 uppercase tracking-wider">Avg Discount</span>
              <span className="text-pars-gold font-bold ml-2">
                {stats?.averageDiscount.toFixed(1) || '0'}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/40" />
              <span className="text-white/40 uppercase tracking-wider">Total Raised</span>
              <span className="text-white font-bold ml-2">
                ${stats?.totalRaised ? Number(formatUnits(stats.totalRaised, 18)).toLocaleString() : '0'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* User's Bonds (Claims) */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <ClaimBonds />
        </div>
      </section>

      {/* How it Works */}
      <section className="border-y border-white/20 py-12 bg-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
            How Bonding Works
          </h2>
          <div className="grid md:grid-cols-4 gap-0 border border-white/20">
            <div className="p-6 border-b md:border-b-0 md:border-r border-white/20">
              <span className="font-mono text-xs text-pars-gold">01</span>
              <h3 className="font-bold text-white mt-2 mb-2">Choose a Bond</h3>
              <p className="text-white/60 text-sm">
                Select from available bonds with different discount rates and vesting periods.
              </p>
            </div>
            <div className="p-6 border-b md:border-b-0 md:border-r border-white/20">
              <span className="font-mono text-xs text-pars-gold">02</span>
              <h3 className="font-bold text-white mt-2 mb-2">Deposit USDC</h3>
              <p className="text-white/60 text-sm">
                Your USDC goes directly to the DAO treasury to fund protocol initiatives.
              </p>
            </div>
            <div className="p-6 border-b md:border-b-0 md:border-r border-white/20">
              <span className="font-mono text-xs text-pars-gold">03</span>
              <h3 className="font-bold text-white mt-2 mb-2">Tokens Vest</h3>
              <p className="text-white/60 text-sm">
                ASHA tokens vest linearly over the bond period. Claim anytime.
              </p>
            </div>
            <div className="p-6">
              <span className="font-mono text-xs text-pars-gold">04</span>
              <h3 className="font-bold text-white mt-2 mb-2">Stake for Power</h3>
              <p className="text-white/60 text-sm">
                Stake your ASHA for veASHA to participate in governance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bond List */}
      <section id="bonds" className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-baseline justify-between mb-8 border-b border-white/20 pb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Available Bonds
            </h2>
            <span className="font-mono text-xs text-white/40 uppercase tracking-wider">
              {bonds?.length || 0} active
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <BondTable bonds={bonds || []} isLoading={isLoading} />
          </div>

          {/* Mobile List */}
          <div className="lg:hidden">
            <BondList bonds={bonds || []} isLoading={isLoading} />
          </div>

          {isSuccess && (!bonds || bonds.length === 0) && (
            <div className="border border-white/20 p-12 text-center mt-8">
              <Info className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 font-mono text-sm uppercase tracking-wider mb-2">
                No Active Bonds
              </p>
              <p className="text-white/40 text-sm max-w-md mx-auto">
                There are currently no bond opportunities available.
                Check back later or follow our announcements for new bonds.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t border-white/20 py-12 bg-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6">
              Why Bond?
            </h2>
            <div className="space-y-4 text-white/60">
              <p>
                <strong className="text-white">Discounted Tokens:</strong> Bonds allow you to
                acquire ASHA tokens at a discount compared to market price.
              </p>
              <p>
                <strong className="text-white">Support the Protocol:</strong> Your contribution
                goes directly to the DAO treasury, funding development and community initiatives.
              </p>
              <p>
                <strong className="text-white">Long-term Alignment:</strong> Vesting periods
                encourage long-term thinking and reduce sell pressure.
              </p>
              <p>
                <strong className="text-white">Governance Power:</strong> Once claimed, stake
                your ASHA for veASHA to participate in protocol governance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6">
            Ready to Bond?
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#bonds"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pars-gold text-black font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"
            >
              View Available Bonds
            </a>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:border-pars-gold hover:text-pars-gold transition-colors"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
