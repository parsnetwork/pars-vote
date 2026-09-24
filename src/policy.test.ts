import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { policy } from './policy'

const digest = (text: string) => createHash('sha256').update(text).digest('base64')
const directives = (p: string) => new Map(p.split('; ').map((d) => [d.split(' ')[0]!, d.split(' ').slice(1)]))

describe('the page policy', () => {
  const boot = "try{var t=localStorage.getItem('vote.theme')}catch(e){}"
  const p = directives(policy([boot], digest))

  /**
   * The page holds IAM tokens in storage, so an inline script is exactly what
   * the policy exists to refuse. The boot scripts are admitted by their hash,
   * which admits those bytes and nothing else.
   */
  it('admits the head scripts by hash and no inline script besides', () => {
    const script = p.get('script-src')!
    expect(script).toContain(`'sha256-${digest(boot)}'`)
    expect(script).not.toContain("'unsafe-inline'")
    expect(script).not.toContain("'unsafe-eval'")
    expect(script).not.toContain('*')
  })

  it('reaches its own chain and its own IAM, and names no other estate', () => {
    expect(p.get('connect-src')).toEqual(["'self'", 'https://api.pars.network', 'https://pars.id', 'https://cloudflareinsights.com'])
    expect(policy([boot], digest)).not.toMatch(/lux|zoo|hanzo/)
  })

  it('embeds nothing and is posted nowhere else', () => {
    expect(p.get('frame-src')).toEqual(["'none'"])
    expect(p.get('object-src')).toEqual(["'none'"])
    expect(p.get('base-uri')).toEqual(["'self'"])
    expect(p.get('form-action')).toEqual(["'self'"])
  })
})
