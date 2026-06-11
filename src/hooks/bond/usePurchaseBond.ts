import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'
import BondABI from '../../abi/Bond.json'
import ERC20ABI from '../../abi/ERC20.json'

// ABI typing for wagmi
const bondAbi = BondABI as unknown as readonly any[]
const erc20Abi = ERC20ABI as unknown as readonly any[]

export interface UsePurchaseBondOptions {
  bondId: number
  chainId?: number
}

/**
 * Hook for purchasing bonds with approval flow
 */
export function usePurchaseBond({ bondId, chainId = 96370 }: UsePurchaseBondOptions) {
  const bondAddress = chainId === 96369
    ? CONTRACTS.luxMainnet.Bond
    : CONTRACTS.luxDevnet.Bond

  // Approval write
  const {
    writeContract: approve,
    data: approvalHash,
    isPending: isApproving,
    error: approvalError,
    reset: resetApproval,
  } = useWriteContract()

  // Purchase write
  const {
    writeContract: purchase,
    data: purchaseHash,
    isPending: isPurchasing,
    error: purchaseError,
    reset: resetPurchase,
  } = useWriteContract()

  // Wait for approval
  const { isLoading: isWaitingApproval, isSuccess: approvalSuccess } = useWaitForTransactionReceipt({
    hash: approvalHash,
  })

  // Wait for purchase
  const { isLoading: isWaitingPurchase, isSuccess: purchaseSuccess } = useWaitForTransactionReceipt({
    hash: purchaseHash,
  })

  /**
   * Approve payment token for bond contract
   */
  const approveToken = (tokenAddress: `0x${string}`, amount: bigint) => {
    approve({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [bondAddress, amount],
    })
  }

  /**
   * Purchase bond
   */
  const purchaseBond = (amount: bigint) => {
    purchase({
      address: bondAddress as `0x${string}`,
      abi: bondAbi,
      functionName: 'purchase',
      args: [BigInt(bondId), amount],
    })
  }

  const reset = () => {
    resetApproval()
    resetPurchase()
  }

  return {
    // Approval
    approveToken,
    isApproving: isApproving || isWaitingApproval,
    approvalSuccess,
    approvalError,
    approvalHash,

    // Purchase
    purchaseBond,
    isPurchasing: isPurchasing || isWaitingPurchase,
    purchaseSuccess,
    purchaseError,
    purchaseHash,

    // Combined state
    isLoading: isApproving || isWaitingApproval || isPurchasing || isWaitingPurchase,
    error: approvalError || purchaseError,
    reset,
  }
}

/**
 * Check token allowance for bond contract
 */
export function useTokenAllowance(
  tokenAddress: `0x${string}` | undefined,
  chainId: number = 96370
) {
  const { address } = useAccount()

  const bondAddress = chainId === 96369
    ? CONTRACTS.luxMainnet.Bond
    : CONTRACTS.luxDevnet.Bond

  const { data: allowance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address, bondAddress],
    query: {
      enabled: !!tokenAddress && !!address,
    },
  })

  return {
    allowance: allowance as bigint | undefined,
    isLoading,
    refetch,
  }
}

/**
 * Get user token balance
 */
export function useTokenBalance(tokenAddress: `0x${string}` | undefined) {
  const { address } = useAccount()

  const { data: balance, isLoading, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!tokenAddress && !!address,
    },
  })

  return {
    balance: balance as bigint | undefined,
    isLoading,
    refetch,
  }
}
