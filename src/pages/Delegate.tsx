import { Users, Search, TrendingUp, Award } from 'lucide-react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface Delegate {
  address: string
  name: string
  votingPower: string
  delegators: number
  participation: string
  statement: string
}

const topDelegates: Delegate[] = [
  {
    address: '0x1234...5678',
    name: 'PersianDAO Core',
    votingPower: '125,000 vePARS',
    delegators: 156,
    participation: '98%',
    statement: 'Focused on infrastructure and cross-chain development.',
  },
  {
    address: '0x2345...6789',
    name: 'Health DAO Steward',
    votingPower: '89,000 vePARS',
    delegators: 89,
    participation: '95%',
    statement: 'Prioritizing healthcare access and emergency medical aid.',
  },
  {
    address: '0x3456...7890',
    name: 'Culture Council',
    votingPower: '67,500 vePARS',
    delegators: 67,
    participation: '92%',
    statement: 'Preserving Persian heritage and supporting artists.',
  },
]

export function Delegate() {
  const { isConnected } = useAccount()

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">Delegate Power</span>
            </h1>
            <p className="text-white/60">
              Delegate your vePARS to trusted representatives who vote on your behalf.
            </p>
          </div>

          {/* Delegation Info */}
          <div className="glass-card p-6 mb-8">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-pars-gold" />
              How Delegation Works
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-pars-gold font-medium mb-1">Keep Your Tokens</p>
                <p className="text-white/60">Your vePARS stay in your wallet. Only voting power is delegated.</p>
              </div>
              <div>
                <p className="text-pars-gold font-medium mb-1">Revoke Anytime</p>
                <p className="text-white/60">Change or remove your delegation at any time with no penalty.</p>
              </div>
              <div>
                <p className="text-pars-gold font-medium mb-1">Earn Rewards</p>
                <p className="text-white/60">Active delegates earn PARS rewards for participation.</p>
              </div>
            </div>
          </div>

          {/* Your Delegation */}
          {!isConnected ? (
            <div className="glass-card p-12 text-center mb-8">
              <Users className="w-12 h-12 text-pars-gold mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">Connect to Delegate</h2>
              <p className="text-white/60 mb-6">
                Connect your wallet to view and manage your delegation.
              </p>
              <ConnectButton />
            </div>
          ) : (
            <div className="glass-card p-6 mb-8">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pars-gold" />
                Your Delegation Status
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-pars-deep/50 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Your vePARS</p>
                  <p className="text-2xl font-bold gradient-text">0.00</p>
                </div>
                <div className="bg-pars-deep/50 p-4 rounded-lg">
                  <p className="text-white/60 text-sm mb-1">Delegated To</p>
                  <p className="text-lg font-medium">Not delegated</p>
                </div>
              </div>
            </div>
          )}

          {/* Search Delegates */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search delegates by name or address..."
                className="w-full bg-pars-deep border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pars-gold"
              />
            </div>
          </div>

          {/* Top Delegates */}
          <div className="space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Award className="w-5 h-5 text-pars-gold" />
              Top Delegates
            </h2>
            {topDelegates.map((delegate) => (
              <div key={delegate.address} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{delegate.name}</h3>
                    <p className="text-white/40 text-sm font-mono">{delegate.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-pars-gold font-semibold">{delegate.votingPower}</p>
                    <p className="text-white/40 text-sm">{delegate.delegators} delegators</p>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4">{delegate.statement}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    <span className="text-white/40">Participation: </span>
                    <span className="text-green-400">{delegate.participation}</span>
                  </span>
                  <button className="px-6 py-2 bg-gradient-to-r from-pars-gold to-pars-bronze text-pars-deep font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    Delegate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
