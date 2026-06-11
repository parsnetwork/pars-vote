import { useReadContract, useAccount } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'

const STAKING_ABI = [
  {
    name: 'warmupInfo',
    type: 'function',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'deposit', type: 'uint256' },
      { name: 'expiry', type: 'uint256' },
      { name: 'lock', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    name: 'warmupPeriod',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export function useWarmupInfo() {
  const { address } = useAccount()

  const { data: warmupData, isLoading: isLoadingWarmup } = useReadContract({
    address: CONTRACTS.luxDevnet.vLUX as `0x${string}`,
    abi: STAKING_ABI,
    functionName: 'warmupInfo',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  const { data: warmupPeriod } = useReadContract({
    address: CONTRACTS.luxDevnet.vLUX as `0x${string}`,
    abi: STAKING_ABI,
    functionName: 'warmupPeriod',
  })

  const deposit = warmupData?.[0] ? Number(warmupData[0]) / 1e18 : 0
  const expiry = warmupData?.[1] ? Number(warmupData[1]) : 0
  const isLocked = warmupData?.[2] ?? false
  const periodEpochs = warmupPeriod ? Number(warmupPeriod) : 2

  return {
    deposit,
    expiry,
    isLocked,
    periodEpochs,
    isLoading: isLoadingWarmup,
    hasWarmup: deposit > 0,
  }
}
