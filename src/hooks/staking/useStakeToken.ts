import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits } from 'viem'
import { CONTRACTS } from '../../lib/wagmi'

const STAKING_ABI = [
  {
    name: 'stake',
    type: 'function',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'lockMonths', type: 'uint256' },
    ],
    outputs: [{ name: 'veAmount', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
] as const

export function useStakeToken() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const stake = async (amount: string, lockMonths: number = 6) => {
    const parsedAmount = parseUnits(amount, 18)

    writeContract({
      address: CONTRACTS.luxDevnet.vLUX as `0x${string}`,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [parsedAmount, BigInt(lockMonths)],
    })
  }

  return {
    stake,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  }
}
