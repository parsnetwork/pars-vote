import { describe, expect, it } from 'vitest'
import { client, config } from '@luxdao/app/chrome/id'
import { PARS } from './brand'

describe('pars.vote as a tenant', () => {
  /**
   * The chain is declared here and nowhere else. Every screen reads the
   * tenant's chain, so this is the whole of which network pars.vote reports on.
   */
  it('reads the Pars chain, by the path form a browser may read', () => {
    expect([PARS.venue.key, PARS.venue.id]).toEqual(['pars', 494949])
    expect(PARS.venue.rpc).toMatch(/^https:\/\/api\.pars\.network\/v1\/chain\/[Cc]\/rpc$/)
    expect(PARS.local).toBeUndefined()
  })

  it('signs readers in at pars.id, as the pars-vote client, back to its own callback', () => {
    expect(PARS.issuer).toBe('https://pars.id')
    expect(client(PARS)).toBe('pars-vote')
    expect(config(PARS, 'https://pars.vote')).toEqual({
      serverUrl: 'https://pars.id',
      clientId: 'pars-vote',
      redirectUri: 'https://pars.vote/auth/callback',
      scope: 'openid profile email',
    })
  })

  it('is called Pars and nothing else', () => {
    expect([PARS.name, PARS.word]).toEqual(['Pars', 'Pars Vote'])
  })
})
