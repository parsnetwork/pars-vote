import { describe, expect, it } from 'vitest'
import { filled, open, vested, type Bond, type Note } from './bonds'

const NOW = 1_800_000_000n
const DAY = 86_400n

const bond = (over: Partial<Bond> = {}): Bond => ({
  id: 0n,
  payment: '0x0000000000000000000000000000000000000001',
  target: 1000n,
  raised: 0n,
  minting: 1000n,
  discount: 500n,
  vesting: 30n * DAY,
  opens: NOW - DAY,
  closes: NOW + DAY,
  floor: 0n,
  ceiling: 0n,
  active: true,
  ...over,
})

const note = (over: Partial<Note> = {}): Note => ({
  bond: 0n,
  paid: 100n,
  owed: 100n,
  claimed: 0n,
  from: NOW - DAY,
  until: NOW + DAY,
  claimable: 0n,
  ...over,
})

describe('open', () => {
  it('is true only inside the window and with the flag set', () => {
    expect(open(bond(), NOW)).toBe(true)
  })

  /**
   * The flag is something an operator sets; the window is a fact about time.
   * A screen that read the flag alone would call a finished sale open for as
   * long as nobody got round to clearing it.
   */
  it('is false after the window, whatever the flag says', () => {
    expect(open(bond({ closes: NOW - 1n }), NOW)).toBe(false)
  })

  it('is false before the window opens', () => {
    expect(open(bond({ opens: NOW + 1n }), NOW)).toBe(false)
  })

  it('is false when the flag is clear inside the window', () => {
    expect(open(bond({ active: false }), NOW)).toBe(false)
  })

  /** A sale with no end is open until it is closed, not closed immediately. */
  it('treats no closing time as no deadline', () => {
    expect(open(bond({ closes: 0n }), NOW)).toBe(true)
  })
})

describe('filled', () => {
  it('reads the raise against the target in basis points', () => {
    expect(filled(bond({ raised: 500n, target: 1000n }))).toBe(5000n)
    expect(filled(bond({ raised: 1000n, target: 1000n }))).toBe(10_000n)
  })

  /** A bond with no target is a division by zero, not a full one. */
  it('answers nothing for a bond with no target', () => {
    expect(filled(bond({ target: 0n, raised: 10n }))).toBe(0n)
  })
})

describe('vested', () => {
  it('is half way at the half way point', () => {
    expect(vested(note({ from: NOW - DAY, until: NOW + DAY }), NOW)).toBe(5000n)
  })

  it('is nothing before it starts and whole after it ends', () => {
    expect(vested(note({ from: NOW + DAY, until: NOW + 2n * DAY }), NOW)).toBe(0n)
    expect(vested(note({ from: NOW - 2n * DAY, until: NOW - DAY }), NOW)).toBe(10_000n)
  })

  /**
   * A note with no vesting period is wholly vested rather than a division by
   * zero — the contract pays it out at once, so the screen must say so.
   */
  it('is whole when there is no period to vest over', () => {
    expect(vested(note({ from: NOW, until: NOW }), NOW)).toBe(10_000n)
  })
})
