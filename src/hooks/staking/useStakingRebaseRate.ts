import { useReadContract } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'

const DISTRIBUTOR_ABI = [
  {
    name: 'rewardRate',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export function useStakingRebaseRate() {
  const { data, isLoading, error } = useReadContract({
    address: CONTRACTS.luxDevnet.Strategy as `0x${string}`,
    abi: DISTRIBUTOR_ABI,
    functionName: 'rewardRate',
  })

  // Reward rate is per epoch (8 hours), convert to APY
  // APY = (1 + rate)^(365*3) - 1 (3 rebases per day)
  const rebaseRate = data ? Number(data) / 1e9 : 0
  const apy = Math.pow(1 + rebaseRate, 365 * 3) - 1

  return {
    rebaseRate,
    apy,
    apyPercent: (apy * 100).toFixed(2),
    isLoading,
    error,
  }
}
