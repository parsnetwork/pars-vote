import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Wallet, TrendingUp, Clock, Vote, CheckCircle, XCircle, AlertCircle, ExternalLink, MessageSquare } from 'lucide-react'
import { getDAO, type DAO, type Proposal } from '../data/daos'

const tabs = [
  { id: 'mandate', label: 'Mandate' },
  { id: 'budget', label: 'Budget' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'execution', label: 'Execution' },
  { id: 'reports', label: 'Reports' },
  { id: 'partners', label: 'Partners' },
]

const statusConfig = {
  active: { icon: Vote, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Active' },
  passed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Passed' },
  rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Rejected' },
  pending: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Pending' },
}

export function DAODetail() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('mandate')
  const dao = getDAO(id || '')

  if (!dao) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Committee Not Found</h1>
          <Link to="/dao-network" className="text-pars-gold hover:underline">
            Back to DAO Network
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            to="/dao-network"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to DAO Network
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pars-gold to-pars-bronze flex items-center justify-center">
                <Heart className="w-8 h-8 text-pars-deep" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {dao.name} <span className="text-white/50">{dao.persian}</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-pars-gold/10 text-pars-gold rounded text-xs font-medium">
                    {dao.symbol}
                  </span>
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-xs font-medium">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold gradient-text">{dao.treasuryAllocation}%</p>
              <p className="text-sm text-white/50">Working Treasury</p>
            </div>
          </div>

          {/* Treasury Stats */}
          <div className="glass-card p-6 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                  <Wallet className="w-4 h-4" />
                  Vault Balance
                </div>
                <p className="text-xl font-bold">${(dao.vaultBalance / 1000).toFixed(0)}K</p>
                <p className="text-xs text-white/40">USDC</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Fee Stream (7d)
                </div>
                <p className="text-xl font-bold text-green-400">+${(dao.feeStream7d / 1000).toFixed(1)}K</p>
                <p className="text-xs text-white/40">{dao.baseSplit}% baseline allocation</p>
              </div>
              <div>
                <div className="text-white/50 text-sm mb-1">Base Split</div>
                <p className="text-xl font-bold">{dao.baseSplit}%</p>
                <p className="text-xs text-white/40">of all protocol fees</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  Spend Timelock
                </div>
                <p className="text-xl font-bold">{dao.spendTimelock}</p>
                <p className="text-xs text-white/40">via Treasury execution</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-sm text-white/60">
                Vault receives automatic {dao.baseSplit}% of all protocol fees (non-discretionary).
                Spending requires timelocked proposals through Treasury DAO.
              </p>
              <a
                href="#"
                className="text-pars-gold text-sm hover:underline whitespace-nowrap ml-4"
              >
                View Treasury Dashboard
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-pars-gold text-pars-deep'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="glass-card p-6">
            {activeTab === 'mandate' && <MandateTab dao={dao} />}
            {activeTab === 'budget' && <BudgetTab dao={dao} />}
            {activeTab === 'proposals' && <ProposalsTab dao={dao} />}
            {activeTab === 'execution' && <ExecutionTab dao={dao} />}
            {activeTab === 'reports' && <ReportsTab dao={dao} />}
            {activeTab === 'partners' && <PartnersTab dao={dao} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function MandateTab({ dao }: { dao: DAO }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Mandate</h3>
      <p className="text-white/70 mb-6">{dao.mandate}</p>

      <h4 className="font-semibold mb-3">Owns</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {dao.owns.map((item, i) => (
          <div key={i} className="p-4 bg-white/5 rounded-lg">
            <h5 className="font-medium mb-1">{item.name}</h5>
            <p className="text-sm text-white/60">{item.description}</p>
          </div>
        ))}
      </div>

      <h4 className="font-semibold mb-3">Outputs</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-white/50 text-left">
              <th className="pb-3 font-medium">OUTPUT</th>
              <th className="pb-3 font-medium">FREQUENCY</th>
              <th className="pb-3 font-medium">DESCRIPTION</th>
            </tr>
          </thead>
          <tbody>
            {dao.outputs.map((output, i) => (
              <tr key={i} className="border-t border-white/10">
                <td className="py-3">{output.name}</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-white/10 rounded text-xs">{output.frequency}</span>
                </td>
                <td className="py-3 text-white/60">{output.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BudgetTab({ dao }: { dao: DAO }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Budget Allocation</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-white/50 text-sm mb-1">Annual Allocation</p>
          <p className="text-2xl font-bold gradient-text">{dao.treasuryAllocation}%</p>
          <p className="text-sm text-white/60">of total protocol treasury</p>
        </div>
        <div className="p-4 bg-white/5 rounded-lg">
          <p className="text-white/50 text-sm mb-1">Current Balance</p>
          <p className="text-2xl font-bold">${(dao.vaultBalance / 1000).toFixed(0)}K</p>
          <p className="text-sm text-white/60">USDC in vault</p>
        </div>
      </div>

      <h4 className="font-semibold mb-3">Fee Distribution</h4>
      <div className="p-4 bg-white/5 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60">Base Split</span>
          <span className="font-medium">{dao.baseSplit}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pars-gold to-pars-bronze rounded-full"
            style={{ width: `${dao.baseSplit * 10}%` }}
          />
        </div>
        <p className="text-xs text-white/40 mt-2">
          Automatically receives {dao.baseSplit}% of all protocol fees
        </p>
      </div>

      <h4 className="font-semibold mb-3">Recent Transactions</h4>
      <p className="text-white/50 text-sm">No recent transactions</p>
    </div>
  )
}

function ProposalsTab({ dao }: { dao: DAO }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Active Proposals</h3>
        <a
          href="https://github.com/parsdao/pips/discussions/new?category=proposals"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-pars-gold text-pars-deep rounded-lg text-sm font-medium hover:opacity-90"
        >
          <MessageSquare className="w-4 h-4" />
          New Proposal
        </a>
      </div>

      {dao.proposals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-white/50 mb-4">No active proposals for this committee</p>
          <a
            href="https://github.com/parsdao/pips"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pars-gold hover:underline"
          >
            View all PIPs on GitHub
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {dao.proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="font-semibold mb-3">How Proposals Work</h4>
        <ol className="space-y-2 text-sm text-white/70">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pars-gold/10 text-pars-gold flex items-center justify-center text-xs font-bold">1</span>
            <span>Start a GitHub Discussion in the <a href="https://github.com/parsdao/pips/discussions" className="text-pars-gold hover:underline">PIPs repository</a></span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pars-gold/10 text-pars-gold flex items-center justify-center text-xs font-bold">2</span>
            <span>Community reviews and provides feedback</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pars-gold/10 text-pars-gold flex items-center justify-center text-xs font-bold">3</span>
            <span>If approved, a formal PIP is created and voting begins</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pars-gold/10 text-pars-gold flex items-center justify-center text-xs font-bold">4</span>
            <span>vePARS holders vote on the proposal</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-pars-gold/10 text-pars-gold flex items-center justify-center text-xs font-bold">5</span>
            <span>Passed proposals enter timelock and execute automatically</span>
          </li>
        </ol>
      </div>
    </div>
  )
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const config = statusConfig[proposal.status]
  const Icon = config.icon
  const totalVotes = proposal.votesFor + proposal.votesAgainst
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0

  return (
    <div className="p-4 bg-white/5 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            <a
              href={`https://github.com/parsdao/pips/blob/main/PIPs/${proposal.pip}.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-pars-gold"
            >
              {proposal.pip}
            </a>
          </div>
          <h4 className="font-medium">{proposal.title}</h4>
        </div>
        <div className="flex items-center gap-1 text-white/60 text-sm">
          <Clock className="w-4 h-4" />
          {proposal.endTime}
        </div>
      </div>

      {totalVotes > 0 && (
        <div className="mb-3">
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

      <div className="flex gap-2">
        {proposal.status === 'active' && (
          <>
            <button className="flex-1 py-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors text-sm">
              Vote For
            </button>
            <button className="flex-1 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm">
              Vote Against
            </button>
          </>
        )}
        <a
          href={`https://github.com/parsdao/pips/discussions`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-white/10 text-white/70 rounded-lg hover:bg-white/5 transition-colors text-sm inline-flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Discuss
        </a>
      </div>
    </div>
  )
}

function ExecutionTab({ dao: _dao }: { dao: DAO }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Execution History</h3>
      <p className="text-white/50">No executed proposals yet</p>
    </div>
  )
}

function ReportsTab({ dao }: { dao: DAO }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Committee Reports</h3>
      <div className="space-y-3">
        {dao.outputs.map((output, i) => (
          <div key={i} className="p-4 bg-white/5 rounded-lg flex items-center justify-between">
            <div>
              <h4 className="font-medium">{output.name}</h4>
              <p className="text-sm text-white/60">{output.description}</p>
            </div>
            <span className="px-2 py-1 bg-white/10 rounded text-xs">{output.frequency}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PartnersTab({ dao: _dao }: { dao: DAO }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Partner Organizations</h3>
      <p className="text-white/50">Partner registry coming soon</p>
    </div>
  )
}
