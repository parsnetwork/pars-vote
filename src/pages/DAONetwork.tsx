import { Link } from 'react-router-dom'
import { Users, Wallet, TrendingUp } from 'lucide-react'
import { daos } from '../data/daos'

export function DAONetwork() {
  const totalTreasury = daos.reduce((acc, dao) => acc + dao.vaultBalance, 0)
  const totalFeeStream = daos.reduce((acc, dao) => acc + dao.feeStream7d, 0)
  const activeProposals = daos.reduce((acc, dao) => acc + dao.proposals.filter(p => p.status === 'active').length, 0)

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">DAO Network</span>
            </h1>
            <p className="text-white/60">
              10 specialized committees governing the Pars Protocol
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 text-center">
              <Users className="w-5 h-5 text-pars-gold mx-auto mb-2" />
              <p className="text-2xl font-bold gradient-text">10</p>
              <p className="text-sm text-white/60">Committees</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Wallet className="w-5 h-5 text-pars-gold mx-auto mb-2" />
              <p className="text-2xl font-bold gradient-text">${(totalTreasury / 1000).toFixed(0)}K</p>
              <p className="text-sm text-white/60">Total Treasury</p>
            </div>
            <div className="glass-card p-4 text-center">
              <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">+${(totalFeeStream / 1000).toFixed(1)}K</p>
              <p className="text-sm text-white/60">Fee Stream (7d)</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{activeProposals}</p>
              <p className="text-sm text-white/60">Active Proposals</p>
            </div>
          </div>

          {/* DAO Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {daos.map((dao) => (
              <Link
                key={dao.id}
                to={`/dao-network/${dao.id}`}
                className="glass-card p-6 hover:border-pars-gold/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pars-gold to-pars-bronze flex items-center justify-center">
                      <span className="text-sm font-bold text-pars-deep">{dao.symbol}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-pars-gold transition-colors">
                        {dao.name}
                      </h3>
                      <p className="text-sm text-white/50">{dao.persian}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold gradient-text">{dao.treasuryAllocation}%</p>
                    <p className="text-xs text-white/50">Allocation</p>
                  </div>
                </div>

                <p className="text-sm text-white/60 mb-4">{dao.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-white/40">Vault: </span>
                    <span className="text-white">${(dao.vaultBalance / 1000).toFixed(0)}K</span>
                  </div>
                  <div>
                    <span className="text-white/40">7d Fees: </span>
                    <span className="text-green-400">+${(dao.feeStream7d / 1000).toFixed(1)}K</span>
                  </div>
                  {dao.proposals.filter(p => p.status === 'active').length > 0 && (
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
                      {dao.proposals.filter(p => p.status === 'active').length} active
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
