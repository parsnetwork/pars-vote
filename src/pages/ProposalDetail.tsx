import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAccount } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useGetProposalDetails } from '../hooks/governance/useGetProposalDetails'
import { useVoteForProposal } from '../hooks/governance/useVoteForProposal'
import { useGetVotingWeight } from '../hooks/governance/useGetVotingWeight'

export function ProposalDetail() {
  const { id } = useParams<{ id: string }>()
  const { isConnected } = useAccount()
  const { proposal, state, isLoading } = useGetProposalDetails(id)
  const { voteFor, voteAgainst, voteAbstain, isPending } = useVoteForProposal()
  const { votes, votesFormatted } = useGetVotingWeight()

  if (isLoading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 w-1/3 mb-4"></div>
            <div className="h-4 bg-white/10 w-2/3 mb-8"></div>
          </div>
        </div>
      </div>
    )
  }

  const totalVotes = proposal
    ? Number(proposal.forVotes) + Number(proposal.againstVotes) + Number(proposal.abstainVotes)
    : 0

  const forPercent = totalVotes > 0 ? (Number(proposal?.forVotes || 0) / totalVotes) * 100 : 0
  const againstPercent = totalVotes > 0 ? (Number(proposal?.againstVotes || 0) / totalVotes) * 100 : 0

  const getStatusIcon = () => {
    switch (state) {
      case 'Active':
        return <Clock className="w-5 h-5 text-blue-400" />
      case 'Succeeded':
      case 'Executed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'Defeated':
      case 'Canceled':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
    }
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link
            to="/governance"
            className="inline-flex items-center gap-2 text-white/60 hover:text-pars-gold mb-8 font-mono text-sm uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Proposals
          </Link>

          {/* Header */}
          <div className="border-b border-white/20 pb-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              {getStatusIcon()}
              <span className="font-mono text-sm uppercase tracking-wider text-white/60">
                PIP-{id} • {state}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
              Proposal #{id}
            </h1>
            <p className="text-white/60 font-mono text-sm">
              Proposed by: {proposal?.proposer?.slice(0, 6)}...{proposal?.proposer?.slice(-4)}
            </p>
          </div>

          {/* Voting Stats */}
          <div className="border border-white/20 p-6 mb-8">
            <h2 className="font-bold uppercase tracking-wider text-sm mb-6">Current Votes</h2>

            {/* Progress Bars */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-green-400 font-mono uppercase">For</span>
                  <span className="font-mono">{forPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/10">
                  <div
                    className="h-full bg-green-400"
                    style={{ width: `${forPercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-red-400 font-mono uppercase">Against</span>
                  <span className="font-mono">{againstPercent.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-white/10">
                  <div
                    className="h-full bg-red-400"
                    style={{ width: `${againstPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Vote Counts */}
            <div className="grid grid-cols-3 gap-4 font-mono text-sm border-t border-white/20 pt-4">
              <div>
                <span className="text-white/40 uppercase block">For</span>
                <span className="text-green-400">{Number(proposal?.forVotes || 0) / 1e18}</span>
              </div>
              <div>
                <span className="text-white/40 uppercase block">Against</span>
                <span className="text-red-400">{Number(proposal?.againstVotes || 0) / 1e18}</span>
              </div>
              <div>
                <span className="text-white/40 uppercase block">Abstain</span>
                <span className="text-white/60">{Number(proposal?.abstainVotes || 0) / 1e18}</span>
              </div>
            </div>
          </div>

          {/* Cast Vote */}
          {state === 'Active' && (
            <div className="border border-white/20 p-6 mb-8">
              <h2 className="font-bold uppercase tracking-wider text-sm mb-6">Cast Your Vote</h2>

              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-white/60 mb-4">Connect your wallet to vote</p>
                  <ConnectButton />
                </div>
              ) : votes === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60">You need veASHA to vote on proposals.</p>
                  <Link to="/staking" className="text-pars-gold hover:underline mt-2 inline-block">
                    Stake ASHA to get voting power →
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-white/60 mb-4 font-mono text-sm">
                    Your voting power: <span className="text-pars-gold">{votesFormatted} veASHA</span>
                  </p>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => id && voteFor(id)}
                      disabled={isPending}
                      className="py-3 bg-green-500 text-white font-bold uppercase tracking-wider text-sm hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? 'Voting...' : 'For'}
                    </button>
                    <button
                      onClick={() => id && voteAgainst(id)}
                      disabled={isPending}
                      className="py-3 bg-red-500 text-white font-bold uppercase tracking-wider text-sm hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? 'Voting...' : 'Against'}
                    </button>
                    <button
                      onClick={() => id && voteAbstain(id)}
                      disabled={isPending}
                      className="py-3 bg-white/20 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? 'Voting...' : 'Abstain'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="border border-white/20 p-6">
            <h2 className="font-bold uppercase tracking-wider text-sm mb-6">Timeline</h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 bg-pars-gold"></div>
                <span className="text-white/60">Created</span>
                <span className="text-white ml-auto">Block #{proposal?.startBlock}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 ${state === 'Active' ? 'bg-blue-400' : 'bg-white/20'}`}></div>
                <span className="text-white/60">Voting Ends</span>
                <span className="text-white ml-auto">Block #{proposal?.endBlock}</span>
              </div>
              {proposal?.eta && proposal.eta > 0 && (
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-white/20"></div>
                  <span className="text-white/60">Execution ETA</span>
                  <span className="text-white ml-auto">
                    {new Date(proposal.eta * 1000).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
