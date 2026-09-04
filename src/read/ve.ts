import type { Venue } from '@luxfi/vote/gov/chain'
import type { Ve } from '@luxfi/vote/read/ve'
import * as abi from '../abi'
import { sited } from '../at'

/**
 * Pars's escrow, as the stack's vote-escrow screen needs it stated.
 *
 * The screen is the stack's; this is the contract under it. The two differ
 * from the Curve-style escrow the stack binds by default in three ways that
 * are visible to a reader, so they are stated rather than smoothed over:
 *
 *  1. **Weight does not decay.** `stake` mints a multiple at the moment of
 *     locking and the balance does not move again until `lockEnd` passes. A
 *     screen that drew a decay line here would be drawing a line the contract
 *     does not follow.
 *  2. **The lock is a whole number of months**, one to forty-eight, and a month
 *     is thirty days. The bounds are in the contract's `require`, not in
 *     getters, so they are stated here — which is the one thing in this file
 *     that would go stale silently if the contract changed, and the test beside
 *     it is what pins them.
 *  3. **Weight is delegable.** The escrow is an `ERC20Votes`, so escrow weight
 *     carries the delegation the base token's does.
 *
 * MOVING TO THE GENERIC ESCROW: `luxfi/standard` now ships `VeVotes`, and
 * `@luxfi/vote` binds it as `VOTES` — one lock per account, power that decays
 * linearly, `lock(amount, duration)` for all three of create, add and extend.
 * It is the better contract: it has an add that does not move the end, and it
 * pays back what was deposited rather than at a rate fixed to the shortest
 * lock. Moving Pars onto it is `export const VEASHA = VOTES` with a `where`
 * that reads Pars's own address, and nothing else in this repository changes.
 */

/** A month, as this contract counts one. */
export const MONTH = 30n * 86_400n

export const MIN_MONTHS = 1n
export const MAX_MONTHS = 48n

/**
 * Escrow minted for a lock: `amount * (100 + months * 10) / 100`.
 *
 * Ten per cent per month, on top of the deposit. A one-month lock mints 1.1x
 * and a forty-eight-month lock 5.8x.
 */
export const weight = (amount: bigint, months: bigint): bigint =>
  (amount * (100n + months * 10n)) / 100n

/**
 * ASHA returned for escrow burned: `escrowed * 100 / 110`.
 *
 * The exit rate is fixed at the one-month multiple whatever the lock was, so it
 * is not the inverse of `weight` for any other length. `surplus` below is that
 * difference, and it is drawn on the screen rather than left in the contract.
 */
export const returned = (escrowed: bigint): bigint => (escrowed * 100n) / 110n

/**
 * What a round trip through the escrow adds to a holder's ASHA.
 *
 * Zero for a one-month lock, and positive for every longer one: locking 100
 * ASHA for six months mints 160 escrow, and burning 160 escrow returns 145. The
 * 45 comes out of the same pool every other locker deposited into, so the last
 * to leave is short. Measured from the contract's own arithmetic, in a test.
 */
export const surplus = (amount: bigint, months: bigint): bigint =>
  returned(weight(amount, months)) - amount

/** Lock length in months, from the two timestamps the contract stores. */
export const months = (end: bigint, from: bigint): bigint =>
  end > from ? (end - from) / MONTH : 0n

export const VEASHA: Ve = {
  where: (v: Venue) => sited(v, 'escrow'),
  abi: abi.escrow,
  delegable: true,
  decays: false,

  async whole(ask) {
    const [base, name, symbol, decimals, supply] = await Promise.all([
      ask<string>('asha'),
      ask<string>('name'),
      ask<string>('symbol'),
      ask<number>('decimals'),
      ask<bigint>('totalSupply'),
    ])
    return {
      base,
      name,
      symbol,
      decimals,
      // The contract keeps no running total of what it holds, so there is none
      // to report. Null says that; zero would say it holds nothing.
      locked: null,
      supply,
      min: MIN_MONTHS * MONTH,
      max: MAX_MONTHS * MONTH,
      step: MONTH,
    }
  },

  async lockOf(ask, who) {
    const [power, end, votes, delegate] = await Promise.all([
      ask<bigint>('balanceOf', [who]),
      ask<bigint>('lockEnd', [who]),
      ask<bigint>('getVotes', [who]),
      ask<string>('delegates', [who]),
    ])
    // The deposit is not stored: the contract keeps the escrow balance and the
    // end, and the amount that produced them is recoverable only through the
    // multiple. Reported at the exit rate, which is what a holder gets back.
    return { amount: returned(power), end, power, votes, delegate }
  },

  /**
   * `stake(amount, lockMonths)` — a length, not an end. The stack hands an end,
   * because that is what a Curve-style escrow takes; this turns it back into
   * the months this contract counts, and floors, because a month it cannot
   * complete is a month it will not mint for.
   */
  open: (amount, end) => ({
    functionName: 'stake',
    args: [amount, months(end, BigInt(Math.floor(Date.now() / 1000)))],
  }),

  // No `add` and no `extend`, which is why they are optional upstream. There is
  // no `increaseAmount` and no `increaseUnlockTime` on this contract: a second
  // `stake` mints against the new deposit and OVERWRITES `lockEnd` with one
  // measured from today, so it would silently shorten a longer lock that was
  // already running. The screen offers what the contract has.

  /** `unstake(amount)` burns escrow and returns ASHA at the fixed exit rate. */
  close: (power) => ({ functionName: 'unstake', args: [power] }),

  delegate: (to) => ({ functionName: 'delegate', args: [to] }),
}
