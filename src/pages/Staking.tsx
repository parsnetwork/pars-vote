import { Link } from 'react-router-dom'
import { ArrowRight, Lock, Coins, TrendingUp, Shield, Clock, Zap } from 'lucide-react'

const stakingTiers = [
  { duration: '1 Month', multiplier: '1.1x', apr: '~8%', recommended: false },
  { duration: '3 Months', multiplier: '1.3x', apr: '~12%', recommended: false },
  { duration: '6 Months', multiplier: '1.6x', apr: '~18%', recommended: true },
  { duration: '12 Months', multiplier: '2.0x', apr: '~25%', recommended: false },
  { duration: '24 Months', multiplier: '2.5x', apr: '~32%', recommended: false },
]

const benefits = [
  {
    icon: Shield,
    title: 'veASHA Governance',
    description: 'Lock ASHA to receive veASHA voting power. Longer locks = more influence in protocol decisions.',
  },
  {
    icon: Coins,
    title: 'Staking Rewards',
    description: 'Earn PARS emissions proportional to your veASHA balance. Rewards compound automatically.',
  },
  {
    icon: TrendingUp,
    title: 'Protocol Revenue',
    description: 'veASHA holders receive a share of protocol fees from bonding, trading, and treasury operations.',
  },
  {
    icon: Clock,
    title: 'Time-Weighted Power',
    description: 'Your governance power scales with lock duration. Demonstrate long-term commitment to the protocol.',
  },
]

export function Staking() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pars-gold/10 border border-pars-gold/20 mb-8">
            <Lock className="w-4 h-4 text-pars-gold" />
            <span className="text-pars-gold text-sm font-medium">Stake ASHA</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Stake ASHA, Earn veASHA</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Lock your ASHA tokens to receive veASHA governance power and earn staking rewards.
            Longer locks provide greater voting weight and higher yields.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pars-gold to-pars-bronze text-pars-deep font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Stake ASHA
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-y border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            <span className="gradient-text">How ASHA Staking Works</span>
          </h2>

          <div className="glass-card p-8 max-w-4xl mx-auto">
            <div className="bg-pars-deep/50 rounded-lg p-6 font-mono text-center mb-8">
              <p className="text-lg md:text-xl text-pars-gold">
                veASHA = ASHA × √(karma/100) × (1 + lock_months × 0.1)
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-pars-gold/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-pars-gold font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Bond Tokens</h3>
                <p className="text-white/60 text-sm">
                  Bond CYRUS, PARS, or MIGA tokens to mint ASHA at a discount.
                </p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-pars-gold/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-pars-gold font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Vest ASHA</h3>
                <p className="text-white/60 text-sm">
                  5-day vesting period. Claim ASHA as it vests into your wallet.
                </p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-pars-gold/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-pars-gold font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Stake for veASHA</h3>
                <p className="text-white/60 text-sm">
                  Lock ASHA for 1-24 months to receive veASHA governance power.
                </p>
              </div>
              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-pars-gold/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-pars-gold font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Earn & Govern</h3>
                <p className="text-white/60 text-sm">
                  Earn PARS rewards and vote on proposals with your veASHA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staking Tiers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Lock Duration Tiers</span>
          </h2>

          <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {stakingTiers.map((tier) => (
              <div
                key={tier.duration}
                className={`glass-card p-6 text-center relative ${
                  tier.recommended ? 'ring-2 ring-pars-gold' : ''
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-pars-gold text-pars-deep text-xs font-bold rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <p className="text-white/60 text-sm mb-2">{tier.duration}</p>
                <p className="text-3xl font-bold gradient-text mb-2">{tier.multiplier}</p>
                <p className="text-pars-gold text-sm">Est. APR: {tier.apr}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-white/50 text-sm mt-6">
            * APR estimates based on current emissions. Actual rates may vary.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            <span className="gradient-text">Staking Benefits</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass-card p-6">
                <benefit.icon className="w-10 h-10 text-pars-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-white/60">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASHA Info */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Zap className="w-10 h-10 text-pars-gold" />
              <h2 className="text-2xl md:text-3xl font-bold">What is ASHA?</h2>
            </div>

            <p className="text-white/70 mb-6">
              ASHA is the unified reserve token of the PARS ecosystem, modeled on OHM-style protocol-owned liquidity.
              You mint ASHA by bonding CYRUS, PARS, or MIGA tokens at a discount. Stake ASHA to receive veASHA
              governance power and earn protocol rewards.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-pars-deep/50 rounded-lg p-4">
                <p className="text-pars-gold font-semibold mb-2">Bond CYRUS</p>
                <p className="text-white/60 text-sm">
                  Bond CYRUS tokens for ASHA at a discount. 5-day vesting. cyrus.money
                </p>
              </div>
              <div className="bg-pars-deep/50 rounded-lg p-4">
                <p className="text-pars-gold font-semibold mb-2">Bond PARS</p>
                <p className="text-white/60 text-sm">
                  Bond PARS tokens for ASHA at a discount. 5-day vesting. pars.network
                </p>
              </div>
              <div className="bg-pars-deep/50 rounded-lg p-4">
                <p className="text-pars-gold font-semibold mb-2">Bond MIGA</p>
                <p className="text-white/60 text-sm">
                  Bond MIGA tokens for ASHA at a discount. 5-day vesting. migaprotocol.xyz
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 text-pars-gold hover:text-pars-bronze transition-colors"
              >
                Read the full documentation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
