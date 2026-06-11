import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'
import BondABI from '../../abi/Bond.json'

export interface UseClaimBondsOptions {
  chainId?: number
}

/**
 * Hook for claiming vested bond tokens
 */
export function useClaimBonds({ chainId = 96370 }: UseClaimBondsOptions = {}) {
  const bondAddress = chainId === 96369
    ? CONTRACTS.luxMainnet.Bond
    : CONTRACTS.luxDevnet.Bond

  const {
    writeContract,
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  /**
   * Claim vested tokens from a specific bond
   */
  const claimBond = (bondId: number) => {
    writeContract({
      address: bondAddress as `0x${string}`,
      abi: BondABI,
      functionName: 'claim',
      args: [BigInt(bondId)],
    })
  }

  return {
    claimBond,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  }
}

/**
 * Hook for claiming from multiple bonds
 */
export function useClaimMultipleBonds({ chainId = 96370 }: UseClaimBondsOptions = {}) {
  const bondAddress = chainId === 96369
    ? CONTRACTS.luxMainnet.Bond
    : CONTRACTS.luxDevnet.Bond

  const {
    writeContract,
    data: hash,
    isPending,
    error,
    reset,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  /**
   * Claim from multiple bonds in sequence
   * Note: This requires multiple transactions. For batch claiming,
   * consider adding a claimAll function to the contract.
   */
  const claimAll = async (bondIds: number[]) => {
    // For now, just claim the first one
    // TODO: Implement batch claiming if contract supports it
    if (bondIds.length > 0) {
      writeContract({
        address: bondAddress as `0x${string}`,
        abi: BondABI,
        functionName: 'claim',
        args: [BigInt(bondIds[0])],
      })
    }
  }

  return {
    claimAll,
    isLoading: isPending || isConfirming,
    isSuccess,
    error,
    hash,
    reset,
  }
}
