import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CONTRACTS } from '../../lib/wagmi'

const GOVERNOR_ABI = [
  {
    name: 'queue',
    type: 'function',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'execute',
    type: 'function',
    inputs: [{ name: 'proposalId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'payable',
  },
] as const

export function useExecuteProposal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const queue = async (proposalId: string) => {
    writeContract({
      address: CONTRACTS.luxDevnet.Governor as `0x${string}`,
      abi: GOVERNOR_ABI,
      functionName: 'queue',
      args: [BigInt(proposalId)],
    })
  }

  const execute = async (proposalId: string) => {
    writeContract({
      address: CONTRACTS.luxDevnet.Governor as `0x${string}`,
      abi: GOVERNOR_ABI,
      functionName: 'execute',
      args: [BigInt(proposalId)],
    })
  }

  return {
    queue,
    execute,
    isPending,
    isConfirming,
    isSuccess,
    hash,
    error,
  }
}
