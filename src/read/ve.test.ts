import { describe, expect, it } from 'vitest'
import { MAX_MONTHS, MIN_MONTHS, MONTH, VEASHA, months, returned, surplus, weight } from './ve'

const ONE = 10n ** 18n
const NOW = 1_800_000_000n

describe('weight', () => {
  /** Ten per cent a month on top of the deposit, which is the whole rule. */
  it('mints the deposit plus a tenth for every month locked', () => {
    expect(weight(100n * ONE, 1n)).toBe(110n * ONE)
    expect(weight(100n * ONE, 6n)).toBe(160n * ONE)
    expect(weight(100n * ONE, 48n)).toBe(580n * ONE)
  })

  it('is linear in the amount', () => {
    expect(weight(2n * ONE, 12n)).toBe(2n * weight(ONE, 12n))
  })
})

describe('returned', () => {
  /**
   * The exit rate is fixed at the one-month multiple whatever the lock was, so
   * it is the inverse of `weight` at one month and at no other length.
   */
  it('undoes a one-month lock exactly', () => {
    expect(returned(weight(100n * ONE, 1n))).toBe(100n * ONE)
  })

  it('does not undo any longer lock', () => {
    expect(returned(weight(100n * ONE, 6n))).not.toBe(100n * ONE)
  })
})

describe('surplus', () => {
  /**
   * What a round trip adds to the holder's ASHA, and takes from the pool every
   * other locker deposited into. Zero at one month, and rising with the lock.
   * This is arithmetic from the deployed contract, not a proposal about it.
   */
  it('is nothing on the shortest lock', () => {
    expect(surplus(100n * ONE, 1n)).toBe(0n)
  })

  it('is positive on every longer lock, and grows with the length', () => {
    const six = surplus(100n * ONE, 6n)
    const twelve = surplus(100n * ONE, 12n)
    expect(six).toBeGreaterThan(0n)
    expect(twelve).toBeGreaterThan(six)
    // 100 in, 160 minted, 145.45… back.
    expect(six).toBe((160n * ONE * 100n) / 110n - 100n * ONE)
  })

  it('grows with the deposit as well as the lock', () => {
    expect(surplus(1000n * ONE, 12n)).toBe(10n * surplus(100n * ONE, 12n))
  })
})

describe('months', () => {
  it('reads a lock length back out of the two timestamps', () => {
    expect(months(NOW + 6n * MONTH, NOW)).toBe(6n)
  })

  /** A month it cannot complete is a month the contract will not mint for. */
  it('floors a part month rather than rounding it up', () => {
    expect(months(NOW + 6n * MONTH - 1n, NOW)).toBe(5n)
  })

  it('is nothing for an end that has passed', () => {
    expect(months(NOW - MONTH, NOW)).toBe(0n)
  })
})

describe('the Pars escrow, as the stack reads it', () => {
  /**
   * The bounds are in the contract's `require`, not in getters, so they are
   * stated in the adapter. This is what pins them to the contract.
   */
  it('states the bounds the contract enforces', () => {
    expect(MIN_MONTHS).toBe(1n)
    expect(MAX_MONTHS).toBe(48n)
    expect(MONTH).toBe(30n * 86_400n)
  })

  it('does not claim a decay this contract does not have', () => {
    expect(VEASHA.decays).toBe(false)
  })

  it('offers delegation, because the escrow is a votes token', () => {
    expect(VEASHA.delegable).toBe(true)
    expect((VEASHA.abi as { name?: string }[]).map((m) => m.name)).toContain('delegate')
  })

  /**
   * The absence is the point. A second `stake` overwrites `lockEnd` with one
   * measured from today, so an "add" button would shorten a longer lock that
   * was already running.
   */
  it('offers neither adding to a running lock nor extending one', () => {
    expect(VEASHA.add).toBeUndefined()
    expect(VEASHA.extend).toBeUndefined()
  })

  it('turns the end the screen asks for back into the months the contract takes', () => {
    const call = VEASHA.open(ONE, NOW + 6n * MONTH)
    expect(call.functionName).toBe('stake')
    expect(call.args[0]).toBe(ONE)
    // The second argument is a count of months, not a timestamp.
    expect(call.args[1]).toBeLessThanOrEqual(MAX_MONTHS)
  })

  it('burns the weight it was handed rather than a fixed amount', () => {
    expect(VEASHA.close(42n)).toEqual({ functionName: 'unstake', args: [42n] })
  })

  it('signs every call against a member of its own ABI', () => {
    const names = new Set((VEASHA.abi as { name?: string }[]).map((m) => m.name))
    for (const call of [VEASHA.open(1n, NOW), VEASHA.close(1n)]) {
      expect(names).toContain(call.functionName)
    }
  })
})
