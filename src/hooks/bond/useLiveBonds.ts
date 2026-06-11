import { useReadContract, useReadContracts } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'
import BondABI from '../../abi/Bond.json'
import type { Bond, BondConfig } from './useBond'

// ABI typing for wagmi
const bondAbi = BondABI as unknown as readonly any[]

export interface UseLiveBondsOptions {
  chainId?: number
}

/**
 * Fetch all active bonds from the Bond contract
 */
export function useLiveBonds({ chainId = 96370 }: UseLiveBondsOptions = {}) {
  const bondAddress = chainId === 96369
    ? CONTRACTS.luxMainnet.Bond
    : CONTRACTS.luxDevnet.Bond

  // Get active bond IDs
  const { data: activeBondIds, isLoading: idsLoading, error: idsError } = useReadContract({
    address: bondAddress as `0x${string}`,
    abi: bondAbi,
    functionName: 'getActiveBonds',
  })

  // Fetch all bond configs
  const bondIds = (activeBondIds as bigint[]) || []

  const bondConfigCalls = bondIds.map((id) => ({
    address: bondAddress as `0x${string}`,
    abi: bondAbi,
    functionName: 'getBond' as const,
    args: [id] as const,
  }))

  const totalRaisedCalls = bondIds.map((id) => ({
    address: bondAddress as `0x${string}`,
    abi: bondAbi,
    functionName: 'totalRaised' as const,
    args: [id] as const,
  }))

  const { data: bondConfigs, isLoading: configsLoading } = useReadContracts({
    contracts: bondConfigCalls as any,
  })

  const { data: totalRaisedData, isLoading: raisedLoading } = useReadContracts({
    contracts: totalRaisedCalls as any,
  })

  const isLoading = idsLoading || configsLoading || raisedLoading

  // Transform data into Bond array
  const bonds: Bond[] = bondIds.map((id, index) => {
    const config = bondConfigs?.[index]?.result as BondConfig | undefined
    const raised = totalRaisedData?.[index]?.result as bigint | undefined

    if (!config) {
      return null
    }

    return {
      id: Number(id),
      paymentToken: config.paymentToken,
      targetRaise: config.targetRaise,
      tokensToMint: config.tokensToMint,
      discount: config.discount,
      vestingPeriod: config.vestingPeriod,
      startTime: config.startTime,
      endTime: config.endTime,
      minPurchase: config.minPurchase,
      maxPurchase: config.maxPurchase,
      active: config.active,
      totalRaised: raised || 0n,
      discountPercent: Number(config.discount) / 100,
      vestingDays: Number(config.vestingPeriod) / 86400,
      isExpired: Date.now() / 1000 > Number(config.endTime),
      isSoldOut: (raised || 0n) >= config.targetRaise,
      progress: config.targetRaise > 0n
        ? Number((raised || 0n) * 100n / config.targetRaise)
        : 0,
    }
  }).filter((bond): bond is Bond => bond !== null)

  return {
    data: bonds,
    isLoading,
    error: idsError,
    isSuccess: !isLoading && !idsError,
  }
}

/**
 * Get total bond stats across all active bonds
 */
export function useBondStats({ chainId = 96370 }: UseLiveBondsOptions = {}) {
  const { data: bonds, isLoading } = useLiveBonds({ chainId })

  const stats = {
    totalBonds: bonds?.length || 0,
    totalTargetRaise: bonds?.reduce((acc, b) => acc + b.targetRaise, 0n) || 0n,
    totalRaised: bonds?.reduce((acc, b) => acc + b.totalRaised, 0n) || 0n,
    averageDiscount: bonds?.length
      ? bonds.reduce((acc, b) => acc + b.discountPercent, 0) / bonds.length
      : 0,
  }

  return {
    data: stats,
    isLoading,
  }
}
