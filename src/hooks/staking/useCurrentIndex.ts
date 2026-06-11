import { useReadContract } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'

const STAKING_ABI = [
  {
    name: 'index',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export function useCurrentIndex() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: CONTRACTS.luxDevnet.vLUX as `0x${string}`,
    abi: STAKING_ABI,
    functionName: 'index',
  })

  // Index is stored with 18 decimals
  const index = data ? Number(data) / 1e18 : 1.0

  return {
    index,
    isLoading,
    error,
    refetch,
  }
}
