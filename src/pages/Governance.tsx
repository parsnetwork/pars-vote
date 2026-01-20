import { Vote, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Proposal {
  id: number
  title: string
  status: 'active' | 'passed' | 'rejected' | 'pending'
  dao: string
  votesFor: number
  votesAgainst: number
  endTime: string
}

const proposals: Proposal[] = [
  {
    id: 1,
    title: 'MIP-001: Emergency Medical Aid Fund',
    status: 'active',
    dao: 'SAL (Health)',
    votesFor: 156000,
    votesAgainst: 12000,
    endTime: '2d 4h',
  },
  {
    id: 2,
    title: 'MIP-002: Cultural Archive Initiative',
    status: 'active',
    dao: 'FARH (Culture)',
    votesFor: 89000,
    votesAgainst: 45000,
    endTime: '4d 12h',
  },
  {
    id: 3,
    title: 'MIP-003: Security Audit Funding',
    status: 'passed',
    dao: 'AMN (Security)',
    votesFor: 234000,
    votesAgainst: 18000,
    endTime: 'Ended',
  },
  {
    id: 4,
    title: 'MIP-004: Cross-Chain Bridge Upgrade',
    status: 'pending',
    dao: 'SAZ (Infrastructure)',
    votesFor: 0,
    votesAgainst: 0,
    endTime: 'Starts in 1d',
  },
]

const statusConfig = {
  active: { icon: Vote, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Active' },
  passed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Passed' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Rejected' },
  pending: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Pending' },
}

export function Governance() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                <span className="gradient-text">Governance</span>
              </h1>
              <p className="text-white/60">
                Vote on MIGA Improvement Proposals with your vePARS.
              </p>
            </div>
            <a
              href="https://pars.ngo/stake"
              className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pars-gold to-pars-bronze text-pars-deep font-semibold rounded-lg hover:opacity-90"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get vePARS
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold gradient-text">4</p>
              <p className="text-sm text-white/60">Total Proposals</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">2</p>
              <p className="text-sm text-white/60">Active</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-green-400">1</p>
              <p className="text-sm text-white/60">Passed</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">1</p>
              <p className="text-sm text-white/60">Pending</p>
            </div>
          </div>

          {/* Proposals List */}
          <div className="space-y-4">
            {proposals.map((proposal) => {
              const config = statusConfig[proposal.status]
              const Icon = config.icon
              const totalVotes = proposal.votesFor + proposal.votesAgainst
              const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0

              return (
                <div key={proposal.id} className="glass-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
                          <Icon className="w-3 h-3" />
                          {config.label}
                        </span>
                        <span className="text-xs text-white/40">{proposal.dao}</span>
                      </div>
                      <h3 className="text-lg font-semibold">{proposal.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-white/60 text-sm">
                      <Clock className="w-4 h-4" />
                      {proposal.endTime}
                    </div>
                  </div>

                  {totalVotes > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-400">For: {(proposal.votesFor / 1000).toFixed(0)}K</span>
                        <span className="text-red-400">Against: {(proposal.votesAgainst / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                          style={{ width: `${forPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {proposal.status === 'active' && (
                      <>
                        <button className="flex-1 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors">
                          Vote For
                        </button>
                        <button className="flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                          Vote Against
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 border border-white/10 text-white/70 rounded-lg hover:bg-white/5 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
