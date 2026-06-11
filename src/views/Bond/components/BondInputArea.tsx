import { useState, useEffect } from 'react'
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useChainId } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { AlertCircle, ArrowDown, Loader2 } from 'lucide-react'
import type { Bond } from '../../../hooks/bond/useBond'
import { calculateBondPayout } from '../../../hooks/bond/useBond'
import { usePurchaseBond, useTokenAllowance, useTokenBalance } from '../../../hooks/bond/usePurchaseBond'

interface BondInputAreaProps {
  bond: Bond
  onSuccess?: () => void
}

export function BondInputArea({ bond, onSuccess }: BondInputAreaProps) {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [amount, setAmount] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const { balance } = useTokenBalance(bond.paymentToken)
  const { allowance, refetch: refetchAllowance } = useTokenAllowance(bond.paymentToken, chainId)

  const {
    approveToken,
    purchaseBond,
    isApproving,
    isPurchasing,
    approvalSuccess,
    purchaseSuccess,
    error,
  } = usePurchaseBond({ bondId: bond.id, chainId })

  // Parse input amount
  const parsedAmount = amount ? parseUnits(amount, 18) : 0n

  // Calculate payout with discount
  const payout = parsedAmount > 0n
    ? calculateBondPayout(parsedAmount, bond.targetRaise, bond.tokensToMint, bond.discount)
    : 0n

  // Check if approval needed
  const needsApproval = allowance !== undefined && parsedAmount > allowance

  // Validation
  const isAmountTooLow = parsedAmount > 0n && parsedAmount < bond.minPurchase
  const isAmountTooHigh = parsedAmount > bond.maxPurchase
  const exceedsBalance = balance !== undefined && parsedAmount > balance
  const exceedsCapacity = parsedAmount > (bond.targetRaise - bond.totalRaised)

  const isValid =
    parsedAmount > 0n &&
    !isAmountTooLow &&
    !isAmountTooHigh &&
    !exceedsBalance &&
    !exceedsCapacity &&
    bond.active &&
    !bond.isSoldOut &&
    !bond.isExpired

  // Set max amount
  const setMax = () => {
    if (!balance) return
    const maxByBalance = balance
    const maxByCapacity = bond.targetRaise - bond.totalRaised
    const maxByLimit = bond.maxPurchase
    const max = [maxByBalance, maxByCapacity, maxByLimit].reduce((a, b) => a < b ? a : b)
    setAmount(formatUnits(max, 18))
  }

  // Handle approval success
  useEffect(() => {
    if (approvalSuccess) {
      refetchAllowance()
    }
  }, [approvalSuccess, refetchAllowance])

  // Handle purchase success
  useEffect(() => {
    if (purchaseSuccess) {
      setAmount('')
      setShowConfirm(false)
      onSuccess?.()
    }
  }, [purchaseSuccess, onSuccess])

  const handleSubmit = () => {
    if (needsApproval) {
      approveToken(bond.paymentToken, parsedAmount)
    } else {
      setShowConfirm(true)
    }
  }

  const handleConfirm = () => {
    purchaseBond(parsedAmount)
  }

  if (!isConnected) {
    return (
      <div className="border border-white/20 p-8 text-center">
        <p className="text-white/60 mb-4">Connect wallet to purchase bonds</p>
        <ConnectButton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="border border-white/20 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-white/40 uppercase">You Pay</span>
          <span className="font-mono text-xs text-white/40">
            Balance: {balance ? Number(formatUnits(balance, 18)).toLocaleString() : '0'} USDC
          </span>
        </div>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 bg-transparent text-2xl font-bold text-white outline-none"
          />
          <button
            onClick={setMax}
            className="px-3 py-1 bg-white/10 text-white/60 text-xs font-mono uppercase hover:bg-white/20 transition-colors"
          >
            Max
          </button>
          <span className="font-bold text-white">USDC</span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center">
        <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
          <ArrowDown className="w-5 h-5 text-pars-gold" />
        </div>
      </div>

      {/* Output */}
      <div className="border border-pars-gold p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-white/40 uppercase">You Receive</span>
          <span className="font-mono text-xs text-pars-gold">
            +{bond.discountPercent.toFixed(1)}% Discount
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex-1 text-2xl font-bold text-pars-gold">
            {payout > 0n ? Number(formatUnits(payout, 18)).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0.0'}
          </span>
          <span className="font-bold text-white">ASHA</span>
        </div>
        <p className="text-xs text-white/40 mt-2">
          Vests over {bond.vestingDays.toFixed(0)} days
        </p>
      </div>

      {/* Validation errors */}
      {parsedAmount > 0n && (
        <div className="space-y-2">
          {isAmountTooLow && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Minimum purchase: {formatUnits(bond.minPurchase, 18)} USDC
            </div>
          )}
          {isAmountTooHigh && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Maximum purchase: {formatUnits(bond.maxPurchase, 18)} USDC
            </div>
          )}
          {exceedsBalance && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Insufficient balance
            </div>
          )}
          {exceedsCapacity && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Exceeds remaining capacity
            </div>
          )}
        </div>
      )}

      {/* Error from transaction */}
      {error && (
        <div className="border border-red-500/50 bg-red-500/10 p-4 text-red-400 text-sm">
          {error.message}
        </div>
      )}

      {/* Bond details */}
      <div className="border border-white/10 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Discount</span>
          <span className="text-pars-gold font-bold">{bond.discountPercent.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Vesting Period</span>
          <span className="text-white">{bond.vestingDays.toFixed(0)} days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/40">Remaining Capacity</span>
          <span className="text-white">
            {Number(formatUnits(bond.targetRaise - bond.totalRaised, 18)).toLocaleString()} USDC
          </span>
        </div>
      </div>

      {/* Action buttons */}
      {!showConfirm ? (
        <button
          onClick={handleSubmit}
          disabled={!isValid || isApproving}
          className={`w-full py-4 font-bold text-sm uppercase tracking-wider transition-colors ${
            isValid
              ? 'bg-pars-gold text-black hover:bg-white'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          {isApproving ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Approving...
            </span>
          ) : needsApproval ? (
            'Approve USDC'
          ) : (
            'Bond'
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="border border-pars-gold bg-pars-gold/10 p-4">
            <p className="text-white font-bold mb-2">Confirm Bond Purchase</p>
            <p className="text-white/60 text-sm">
              You are about to bond {amount} USDC for {Number(formatUnits(payout, 18)).toLocaleString()} ASHA.
              Your ASHA will vest linearly over {bond.vestingDays.toFixed(0)} days.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-4 border border-white/20 text-white font-bold text-sm uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPurchasing}
              className="flex-1 py-4 bg-pars-gold text-black font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors"
            >
              {isPurchasing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Bonding...
                </span>
              ) : (
                'Confirm'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
