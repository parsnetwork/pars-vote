import { describe, expect, it } from 'vitest'
import { DAOS } from '../at'
import { NOBODY, under, type Committee } from './network'

const one = (over: Partial<Committee> = {}): Committee => ({
  address: '0x00000000000000000000000000000000000000aa',
  name: 'Committee',
  parent: '0x00000000000000000000000000000000000000ff',
  proposals: 0n,
  quorum: 20n,
  period: 100n,
  size: 1234,
  ...over,
})

describe('under', () => {
  it('holds when the committee names the main DAO as its parent', () => {
    expect(under(one(), '0x00000000000000000000000000000000000000FF')).toBe(true)
  })

  /**
   * The edge is what makes a network. A contract that names a different parent
   * is not part of this one however it was recorded, and drawing it in the list
   * anyway is how a register becomes a claim.
   */
  it('fails when the committee answers to somebody else', () => {
    expect(under(one({ parent: '0x00000000000000000000000000000000000000ee' }), '0x00000000000000000000000000000000000000ff')).toBe(false)
  })

  it('fails when the committee names nobody', () => {
    expect(under(one({ parent: NOBODY }), '0x00000000000000000000000000000000000000ff')).toBe(false)
  })

  /** No main DAO on record is not a match against every committee. */
  it('fails when there is no main DAO to check against', () => {
    expect(under(one(), undefined)).toBe(false)
  })
})

describe('the committee register', () => {
  /**
   * The app this replaces shipped ten committees with names, treasury
   * allocations, vault balances and seven-day fee streams typed into a file,
   * over a register of two zero addresses marked "TODO: Deploy". Nothing is
   * recorded on Pars because nothing is deployed on Pars, and this is the test
   * that keeps a name from arriving before an address does.
   */
  it('records no committee on Pars, because none is deployed', () => {
    expect(DAOS.pars).toEqual([])
  })

  it('carries addresses and nothing else', () => {
    for (const list of Object.values(DAOS)) {
      for (const a of list) expect(a).toMatch(/^0x[0-9a-fA-F]{40}$/)
    }
  })
})
