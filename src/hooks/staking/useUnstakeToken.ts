import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { CONTRACTS } from '../../lib/wagmi'

const STAKING_ABI = [
  {
    name: 'unstake',
    type: 'function',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [{ name: 'ashaAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const

export function useUnstakeToken() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const unstake = async (amount: string) => {
    const parsedAmount = parseUnits(amount, 18)

    writeContract({
      address: CONTRACTS.luxDevnet.vLUX as `0x${string}`,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [parsedAmount],
    })
  }

  return {
    unstake,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  }
}
