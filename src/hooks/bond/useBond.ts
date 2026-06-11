import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { CONTRACTS } from '../../lib/wagmi'
import BondABI from '../../abi/Bond.json'

export interface BondConfig {
  paymentToken: `0x${string}`
  targetRaise: bigint
  tokensToMint: bigint
  discount: bigint // basis points (2000 = 20%)
  vestingPeriod: bigint // seconds
  startTime: bigint
  endTime: bigint
  minPurchase: bigint
  maxPurchase: bigint
  active: boolean
}

export interface Bond extends BondConfig {
  id: number
  totalRaised: bigint
  discountPercent: number
  vestingDays: number
  isExpired: boolean
  isSoldOut: boolean
  progress: number // 0-100
}

export interface UseBondOptions {
  bondId: number
  chainId?: number
}

/**
 * Fetch a single bond by ID
 */
export function useBond({ bondId, chainId = 96370 }: UseBondOptions) {
  const bondAddress = chainId === 96369
    ? CONTRACTS.luxMainnet.Bond
    : CONTRACTS.luxDevnet.Bond

  const { data: bondConfig, isLoading: configLoading, error: configError } = useReadContract({
    address: bondAddress as `0x${string}`,
    abi: BondABI,
    functionName: 'getBond',
    args: [BigInt(bondId)],
  })

  const { data: totalRaised, isLoading: raisedLoading } = useReadContract({
    address: bondAddress as `0x${string}`,
    abi: BondABI,
    functionName: 'totalRaised',
    args: [BigInt(bondId)],
  })

  const isLoading = configLoading || raisedLoading

  // Transform raw data into Bond interface
  const bond: Bond | undefined = bondConfig ? {
    id: bondId,
    paymentToken: (bondConfig as any).paymentToken,
    targetRaise: (bondConfig as any).targetRaise,
    tokensToMint: (bondConfig as any).tokensToMint,
    discount: (bondConfig as any).discount,
    vestingPeriod: (bondConfig as any).vestingPeriod,
    startTime: (bondConfig as any).startTime,
    endTime: (bondConfig as any).endTime,
    minPurchase: (bondConfig as any).minPurchase,
    maxPurchase: (bondConfig as any).maxPurchase,
    active: (bondConfig as any).active,
    totalRaised: (totalRaised as bigint) || 0n,
    discountPercent: Number((bondConfig as any).discount) / 100,
    vestingDays: Number((bondConfig as any).vestingPeriod) / 86400,
    isExpired: Date.now() / 1000 > Number((bondConfig as any).endTime),
    isSoldOut: (totalRaised as bigint) >= (bondConfig as any).targetRaise,
    progress: (bondConfig as any).targetRaise > 0n
      ? Number(((totalRaised as bigint) || 0n) * 100n / (bondConfig as any).targetRaise)
      : 0,
  } : undefined

  return {
    data: bond,
    isLoading,
    error: configError,
  }
}

/**
 * Calculate discounted token amount for a given payment
 */
export function calculateBondPayout(
  paymentAmount: bigint,
  targetRaise: bigint,
  tokensToMint: bigint,
  discount: bigint
): bigint {
  if (targetRaise === 0n) return 0n
  // tokensOwed = (amount * tokensToMint * (10000 + discount)) / (targetRaise * 10000)
  return (paymentAmount * tokensToMint * (10000n + discount)) / (targetRaise * 10000n)
}

/**
 * Format bond amount for display
 */
export function formatBondAmount(amount: bigint, decimals: number = 18): string {
  return formatUnits(amount, decimals)
}
