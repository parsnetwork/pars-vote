import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'

const GOVERNOR_ABI = [
  {
    name: 'castVote',
    type: 'function',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'uint8' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'castVoteWithReason',
    type: 'function',
    inputs: [
      { name: 'proposalId', type: 'uint256' },
      { name: 'support', type: 'uint8' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const

// Vote support: 0 = Against, 1 = For, 2 = Abstain
export type VoteSupport = 0 | 1 | 2

export function useVoteForProposal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const vote = async (proposalId: string, support: VoteSupport, reason?: string) => {
    const id = BigInt(proposalId)

    if (reason) {
      writeContract({
        address: CONTRACTS.luxDevnet.Governor as `0x${string}`,
        abi: GOVERNOR_ABI,
        functionName: 'castVoteWithReason',
        args: [id, support, reason],
      })
    } else {
      writeContract({
        address: CONTRACTS.luxDevnet.Governor as `0x${string}`,
        abi: GOVERNOR_ABI,
        functionName: 'castVote',
        args: [id, support],
      })
    }
  }

  return {
    vote,
    voteFor: (proposalId: string, reason?: string) => vote(proposalId, 1, reason),
    voteAgainst: (proposalId: string, reason?: string) => vote(proposalId, 0, reason),
    voteAbstain: (proposalId: string, reason?: string) => vote(proposalId, 2, reason),
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  }
}
