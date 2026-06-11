import { useReadContract } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'

const GOVERNOR_ABI = [
  {
    name: 'proposalCount',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'proposals',
    type: 'function',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'proposer', type: 'address' },
      { name: 'eta', type: 'uint256' },
      { name: 'startBlock', type: 'uint256' },
      { name: 'endBlock', type: 'uint256' },
      { name: 'forVotes', type: 'uint256' },
      { name: 'againstVotes', type: 'uint256' },
      { name: 'abstainVotes', type: 'uint256' },
      { name: 'canceled', type: 'bool' },
      { name: 'executed', type: 'bool' },
    ],
    stateMutability: 'view',
  },
] as const

export interface Proposal {
  id: number
  proposer: string
  eta: number
  startBlock: number
  endBlock: number
  forVotes: bigint
  againstVotes: bigint
  abstainVotes: bigint
  canceled: boolean
  executed: boolean
  status: 'pending' | 'active' | 'canceled' | 'defeated' | 'succeeded' | 'queued' | 'expired' | 'executed'
}

export function useGetProposals() {
  const { data: count, isLoading: isLoadingCount } = useReadContract({
    address: CONTRACTS.luxDevnet.Governor as `0x${string}`,
    abi: GOVERNOR_ABI,
    functionName: 'proposalCount',
  })

  // For now return mock data - in production would fetch all proposals
  const proposals: Proposal[] = []

  return {
    proposals,
    totalCount: count ? Number(count) : 0,
    isLoading: isLoadingCount,
  }
}
