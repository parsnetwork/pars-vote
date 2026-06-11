import { formatUnits } from 'viem'
import { useChainId } from 'wagmi'
import { Clock, CheckCircle, Loader2, Gift } from 'lucide-react'
import { useBondNotes, type BondNote } from '../../../hooks/bond/useBondNotes'
import { useClaimBonds } from '../../../hooks/bond/useClaimBonds'

interface ClaimBondsProps {
  className?: string
}

export function ClaimBonds({ className = '' }: ClaimBondsProps) {
  const chainId = useChainId()
  const { data: notes, totalClaimable, hasNotes, isLoading } = useBondNotes({ chainId })

  if (isLoading) {
    return (
      <div className={`border border-white/20 p-8 animate-pulse ${className}`}>
        <div className="h-6 bg-white/10 w-1/3 mb-4" />
        <div className="h-4 bg-white/10 w-2/3" />
      </div>
    )
  }

  if (!hasNotes) {
    return null
  }

  return (
    <div className={`border border-white/20 ${className}`}>
      <div className="border-b border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Your Bonds</h2>
            <p className="text-white/40 text-sm font-mono mt-1">
              {notes.length} active bond{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 font-mono uppercase">Total Claimable</p>
            <p className="text-2xl font-black text-pars-gold">
              {Number(formatUnits(totalClaimable, 18)).toLocaleString(undefined, { maximumFractionDigits: 4 })}
            </p>
            <p className="text-xs text-white/60">ASHA</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/10">
        {notes.map((note) => (
          <BondNoteRow key={note.bondId} note={note} chainId={chainId} />
        ))}
      </div>
    </div>
  )
}

interface BondNoteRowProps {
  note: BondNote
  chainId: number
}

function BondNoteRow({ note, chainId }: BondNoteRowProps) {
  const { claimBond, isLoading, isSuccess } = useClaimBonds({ chainId })

  const handleClaim = () => {
    claimBond(note.bondId)
  }

  const claimableFormatted = Number(formatUnits(note.claimable, 18))
  const owedFormatted = Number(formatUnits(note.tokensOwed, 18))
  const claimedFormatted = Number(formatUnits(note.tokensClaimed, 18))

  const remainingTime = note.vestingEnd - Date.now()
  const daysRemaining = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)))

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-white/40">Bond #{note.bondId}</span>
            {note.isFullyVested ? (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-mono uppercase">
                <CheckCircle className="w-3 h-3" /> Vested
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-mono uppercase">
                <Clock className="w-3 h-3" /> Vesting
              </span>
            )}
          </div>
          <p className="text-lg font-bold text-white">
            {owedFormatted.toLocaleString(undefined, { maximumFractionDigits: 4 })} ASHA
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40 font-mono uppercase mb-1">Claimable Now</p>
          <p className="text-xl font-bold text-pars-gold">
            {claimableFormatted.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-white/40 font-mono mb-1">
          <span>{note.percentVested.toFixed(1)}% vested</span>
          {!note.isFullyVested && <span>{daysRemaining} days remaining</span>}
        </div>
        <div className="h-2 bg-white/10">
          <div
            className="h-full bg-pars-gold transition-all"
            style={{ width: `${note.percentVested}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <p className="text-white/40 font-mono text-xs uppercase">Total</p>
          <p className="text-white font-medium">{owedFormatted.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-white/40 font-mono text-xs uppercase">Claimed</p>
          <p className="text-white font-medium">{claimedFormatted.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-white/40 font-mono text-xs uppercase">Available</p>
          <p className="text-pars-gold font-medium">{claimableFormatted.toLocaleString()}</p>
        </div>
      </div>

      {/* Claim button */}
      {note.claimable > 0n && (
        <button
          onClick={handleClaim}
          disabled={isLoading}
          className={`w-full py-3 font-bold text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
            isLoading
              ? 'bg-white/10 text-white/40 cursor-wait'
              : 'bg-pars-gold text-black hover:bg-white'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Claiming...
            </>
          ) : (
            <>
              <Gift className="w-4 h-4" />
              Claim {claimableFormatted.toLocaleString()} ASHA
            </>
          )}
        </button>
      )}

      {isSuccess && (
        <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
          Successfully claimed! Your ASHA has been sent to your wallet.
        </div>
      )}
    </div>
  )
}

// Compact version for sidebar/header
export function ClaimBondsBadge() {
  const chainId = useChainId()
  const { totalClaimable, hasNotes } = useBondNotes({ chainId })

  if (!hasNotes || totalClaimable === 0n) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-pars-gold/20 border border-pars-gold/30">
      <Gift className="w-4 h-4 text-pars-gold" />
      <span className="text-sm font-bold text-pars-gold">
        {Number(formatUnits(totalClaimable, 18)).toLocaleString(undefined, { maximumFractionDigits: 2 })} ASHA
      </span>
      <span className="text-xs text-white/60">to claim</span>
    </div>
  )
}
