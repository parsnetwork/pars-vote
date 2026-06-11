import { useReadContract, useReadContracts, useAccount } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'
import BondABI from '../../abi/Bond.json'
import type { Bond } from './useBond'

// ABI typing for wagmi
const bondAbi = BondABI as unknown as readonly any[]

export interface BondNote {
  bondId: number
  paymentAmount: bigint
  tokensOwed: bigint
  tokensClaimed: bigint
  vestingStart: number // timestamp ms
  vestingEnd: number // timestamp ms
  claimable: bigint
  percentVested: number
  isFullyVested: boolean
  bond?: Bond
}

export interface UseBondNotesOptions {
  chainId?: number
}

/**
 * Fetch user's bond purchases (notes) across all bonds
 */
export function useBondNotes({ chainId = 96370 }: UseBondNotesOptions = {}) {
  const { address } = useAccount()

  const bondAddress = chainId === 96369
    ? CONTRACTS.luxMainnet.Bond
    : CONTRACTS.luxDevnet.Bond

  // Also check next bond ID to get historical bonds
  const { data: nextBondId } = useReadContract({
    address: bondAddress as `0x${string}`,
    abi: bondAbi,
    functionName: 'nextBondId',
  })

  // Create array of all bond IDs to check
  const allBondIds = Array.from(
    { length: Number(nextBondId || 0) },
    (_, i) => BigInt(i)
  )

  // Fetch user's purchase for each bond
  const purchaseCalls = allBondIds.map((id) => ({
    address: bondAddress as `0x${string}`,
    abi: bondAbi,
    functionName: 'purchases' as const,
    args: [id, address] as const,
  }))

  const claimableCalls = allBondIds.map((id) => ({
    address: bondAddress as `0x${string}`,
    abi: bondAbi,
    functionName: 'claimable' as const,
    args: [id, address] as const,
  }))

  const { data: purchaseData, isLoading: purchasesLoading } = useReadContracts({
    contracts: purchaseCalls as any,
    query: {
      enabled: !!address && allBondIds.length > 0,
    },
  })

  const { data: claimableData, isLoading: claimableLoading } = useReadContracts({
    contracts: claimableCalls as any,
    query: {
      enabled: !!address && allBondIds.length > 0,
    },
  })

  const isLoading = purchasesLoading || claimableLoading

  // Transform into BondNote array, filtering out empty purchases
  const notes: BondNote[] = allBondIds
    .map((id, index) => {
      const purchase = purchaseData?.[index]?.result as any
      const claimable = claimableData?.[index]?.result as bigint | undefined

      if (!purchase || purchase.tokensOwed === 0n) {
        return null
      }

      const vestingStart = Number(purchase.vestingStart) * 1000
      const vestingEnd = Number(purchase.vestingEnd) * 1000
      const now = Date.now()

      const vestingDuration = vestingEnd - vestingStart
      const elapsed = Math.max(0, now - vestingStart)
      const percentVested = vestingDuration > 0
        ? Math.min(100, (elapsed / vestingDuration) * 100)
        : 100

      return {
        bondId: Number(id),
        paymentAmount: purchase.paymentAmount,
        tokensOwed: purchase.tokensOwed,
        tokensClaimed: purchase.tokensClaimed,
        vestingStart,
        vestingEnd,
        claimable: claimable || 0n,
        percentVested,
        isFullyVested: now >= vestingEnd,
      }
    })
    .filter((note): note is BondNote => note !== null)

  // Calculate totals
  const totalOwed = notes.reduce((acc, n) => acc + n.tokensOwed, 0n)
  const totalClaimed = notes.reduce((acc, n) => acc + n.tokensClaimed, 0n)
  const totalClaimable = notes.reduce((acc, n) => acc + n.claimable, 0n)

  return {
    data: notes,
    totalOwed,
    totalClaimed,
    totalClaimable,
    isLoading,
    hasNotes: notes.length > 0,
  }
}
