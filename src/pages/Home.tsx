import { Link } from 'react-router-dom'
import { ArrowRight, Vote, Users, FileText, Shield, Lock, Coins } from 'lucide-react'

const stats = [
  { label: 'Active Proposals', value: '0', change: '---' },
  { label: 'veASHA Stakers', value: '0', change: '---' },
  { label: 'Total Votes Cast', value: '0', change: '---' },
  { label: 'ASHA Staked', value: '0', change: '---' },
]

const features = [
  {
    icon: Lock,
    title: 'Stake ASHA',
    description: 'Lock ASHA to receive veASHA governance power. Longer locks provide higher voting weight and APR.',
  },
  {
    icon: Vote,
    title: 'Cast Your Vote',
    description: 'Vote on MIGA Improvement Proposals across all ten DAOs. Your veASHA weight determines your influence.',
  },
  {
    icon: FileText,
    title: 'Create Proposals',
    description: 'Draft and submit proposals for community consideration. Shape the direction of the MIGA Protocol.',
  },
  {
    icon: Users,
    title: 'Delegate Power',
    description: 'Delegate your veASHA to trusted representatives. Earn delegation rewards for active participation.',
  },
  {
    icon: Coins,
    title: 'Earn Rewards',
    description: 'veASHA holders earn PARS emissions and protocol revenue. Rewards compound automatically.',
  },
  {
    icon: Shield,
    title: 'Shielded Voting',
    description: 'Privacy-preserving votes on Lux T-Chain. Your preferences remain confidential until results.',
  },
]

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pars-gold/10 border border-pars-gold/20 mb-8">
            <span className="text-pars-gold text-sm font-medium">Decentralized Governance</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">Your Voice Matters</span>
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
            Stake ASHA to earn veASHA governance power. Vote on proposals, delegate power, and shape the future of the MIGA Protocol.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/staking"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pars-gold to-pars-bronze text-pars-deep font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Stake ASHA
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/governance"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-colors"
            >
              View Proposals
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
                <p className="text-pars-gold text-xs mt-1">{stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voting Power */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              veASHA Governance Power
            </h2>
            <div className="bg-pars-deep/50 rounded-lg p-6 font-mono text-center mb-6">
              <p className="text-lg md:text-xl text-pars-gold">
                veASHA = ASHA × √(karma/100) × (1 + lock_months × 0.1)
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-pars-gold font-semibold mb-2">Snapshot Voting</p>
                <p className="text-white/70 text-sm">
                  Votes are weighted by your veASHA at proposal creation time.
                </p>
              </div>
              <div>
                <p className="text-pars-gold font-semibold mb-2">Karma Multiplier</p>
                <p className="text-white/70 text-sm">
                  Active participation increases your karma score and voting power.
                </p>
              </div>
              <div>
                <p className="text-pars-gold font-semibold mb-2">Time-Locked Commitment</p>
                <p className="text-white/70 text-sm">
                  Longer locks demonstrate long-term alignment with the protocol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Governance Tools</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-6">
                <feature.icon className="w-10 h-10 text-pars-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to participate?
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Connect your wallet to view active proposals and cast your votes.
            Your participation shapes the future of the MIGA Protocol.
          </p>
          <Link
            to="/governance"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pars-gold to-pars-bronze text-pars-deep font-semibold rounded-lg hover:opacity-90 transition-opacity glow-gold"
          >
            Start Voting
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
