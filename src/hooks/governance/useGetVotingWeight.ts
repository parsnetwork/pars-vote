import { useReadContract, useAccount } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'

const VOTES_ABI = [
  {
    name: 'getVotes',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'getPastVotes',
    type: 'function',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'blockNumber', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export function useGetVotingWeight(blockNumber?: bigint) {
  const { address } = useAccount()

  const { data: currentVotes, isLoading: isLoadingCurrent } = useReadContract({
    address: CONTRACTS.luxDevnet.VotesToken as `0x${string}`,
    abi: VOTES_ABI,
    functionName: 'getVotes',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: pastVotes, isLoading: isLoadingPast } = useReadContract({
    address: CONTRACTS.luxDevnet.VotesToken as `0x${string}`,
    abi: VOTES_ABI,
    functionName: 'getPastVotes',
    args: address && blockNumber ? [address, blockNumber] : undefined,
    query: { enabled: !!address && !!blockNumber },
  })

  const votes = currentVotes ? Number(currentVotes) / 1e18 : 0
  const pastVotesNum = pastVotes ? Number(pastVotes) / 1e18 : 0

  return {
    votes,
    pastVotes: pastVotesNum,
    votesFormatted: votes.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    isLoading: isLoadingCurrent || isLoadingPast,
  }
}
