import type { Address } from 'viem'
import type { Venue } from '@luxfi/vote/gov/chain'
import { reader } from '@luxfi/vote/gov/client'
import { attempt, type Read } from '@luxfi/vote/gov/read'
import * as abi from '../abi'
import { sited } from '../at'

/**
 * The bond market: a fixed-term sale of the token at a discount, vested.
 *
 * A bond is a window. Inside it anyone may pay `paymentToken` and is owed
 * tokens at a discount to the going rate; the tokens vest over `vestingPeriod`
 * from the moment of purchase, and are claimed as they vest. The market is
 * therefore three different clocks — the sale window, one holder's vesting, and
 * the block timestamp — and mixing them up is the way a bond screen lies. Each
 * is read and named separately here.
 */

export interface Bond {
  id: bigint
  /** What a buyer pays in. */
  payment: Address
  /** What the sale is trying to raise, and what it has. */
  target: bigint
  raised: bigint
  /** Tokens the sale mints if it fills. */
  minting: bigint
  /** Basis points off the going rate. 500 is five per cent. */
  discount: bigint
  /** Seconds a purchase takes to vest, from the moment it is made. */
  vesting: bigint
  opens: bigint
  closes: bigint
  floor: bigint
  ceiling: bigint
  /** The contract's own flag, which is not the same as being inside the window. */
  active: boolean
}

/** One buyer's position in one bond. */
export interface Note {
  bond: bigint
  paid: bigint
  owed: bigint
  claimed: bigint
  from: bigint
  until: bigint
  /** Vested and not yet taken, as the contract computes it. */
  claimable: bigint
}

/**
 * A bond is open when the contract says so AND the clock agrees.
 *
 * `active` is a flag an operator sets; the window is a fact about time. A
 * screen that showed the flag alone would call a closed sale open for as long
 * as nobody got round to clearing it.
 */
export const open = (b: Bond, now: bigint): boolean =>
  b.active && b.opens <= now && (b.closes === 0n || now < b.closes)

/** How much of the target has been paid in, in basis points, without dividing by zero. */
export const filled = (b: Bond): bigint => (b.target === 0n ? 0n : (b.raised * 10_000n) / b.target)

/** Vested share of a note, in basis points. A note past its end is wholly vested. */
export function vested(n: Note, now: bigint): bigint {
  if (n.until <= n.from) return 10_000n
  if (now >= n.until) return 10_000n
  if (now <= n.from) return 0n
  return ((now - n.from) * 10_000n) / (n.until - n.from)
}

export async function bonds(v: Venue): Promise<Read<Bond[]>> {
  const here = await sited(v, 'bond')
  if (here.at !== 'read') return here
  const address = here.value.address

  return attempt(async () => {
    const ask = reader(v, address, abi.bond)
    const next = await ask<bigint>('nextBondId')
    // Ids are 0-based and `nextBondId` is one past the last, so a market that
    // has sold nothing answers 0 and there is no bond to read.
    const ids = Array.from({ length: Number(next) }, (_, i) => BigInt(i))
    return Promise.all(
      ids.map(async (id) => {
        const [row, raised] = await Promise.all([
          ask<readonly [Address, bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint, boolean]>(
            'bonds',
            [id],
          ),
          ask<bigint>('totalRaised', [id]),
        ])
        return {
          id,
          payment: row[0],
          target: row[1],
          minting: row[2],
          discount: row[3],
          vesting: row[4],
          opens: row[5],
          closes: row[6],
          floor: row[7],
          ceiling: row[8],
          active: row[9],
          raised,
        }
      }),
    )
  })
}

export async function notes(v: Venue, who: `0x${string}`, ids: readonly bigint[]): Promise<Read<Note[]>> {
  const here = await sited(v, 'bond')
  if (here.at !== 'read') return here
  const address = here.value.address

  return attempt(async () => {
    const ask = reader(v, address, abi.bond)
    const rows = await Promise.all(
      ids.map(async (id) => {
        const [p, claimable] = await Promise.all([
          ask<readonly [bigint, bigint, bigint, bigint, bigint, bigint]>('purchases', [id, who]),
          ask<bigint>('claimable', [id, who]),
        ])
        return {
          bond: id,
          paid: p[1],
          owed: p[2],
          claimed: p[3],
          from: p[4],
          until: p[5],
          claimable,
        }
      }),
    )
    // A bond nobody bought answers with a zeroed struct rather than an error,
    // so a position of zero is not a position.
    return rows.filter((n) => n.owed > 0n || n.paid > 0n)
  })
}
