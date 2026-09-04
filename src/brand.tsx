import type { ReactElement } from 'react'
import type { Brand } from '@luxfi/vote/chrome/brand'
import { venue } from '@luxfi/vote/gov/chain'

/**
 * pars.vote, as a tenant of the stack.
 *
 * The stack serves lux.vote, zoo.vote and hanzo.vote from one bundle and keeps
 * its tenant list open; this is the entry that adds a fourth site. Pars is a
 * fork rather than a fourth name on that bundle because it adds SCREENS — an
 * escrow on its own token, a bond market, a network of committees — and a
 * tenant flag on a screen only one site draws is how one app becomes two apps
 * sharing a binary.
 *
 * The chain comes from the stack's own registry rather than being restated
 * here. Two records of one chain id is how a devnet address comes to be
 * advertised as mainnet.
 */

/**
 * The Pars mark: the eight-pointed star, khatam.
 *
 * Two rings of the published mono cut and its centre, from
 * `parsdao/brand` `assets/logo/pars-logo-mono.svg`. The published file draws
 * five figures — two more recursions of the star and a pair of interlaced
 * circles — at a size where they are legible; at the twenty pixels a header
 * mark stands they close up into a grey disc, so this is the cut that survives
 * being small. The geometry and the viewBox are the file's.
 *
 * `currentColor`, like every mark in this chrome: a published logo paints
 * itself from `prefers-color-scheme`, which is the desktop's answer inside an
 * app that carries its own.
 */
function Pars({ height = 20 }: { height?: number }): ReactElement {
  return (
    <svg
      viewBox="-110 -110 220 220"
      height={height}
      width={height}
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      role="img"
      aria-label="Pars"
    >
      <path
        d="M0,-100 L30,-60 L100,-40 L60,0 L100,40 L30,60 L0,100 L-30,60 L-100,40 L-60,0 L-100,-40 L-30,-60 Z"
        strokeWidth={8}
      />
      <path
        d="M0,-58 L18,-35 L58,-23 L35,0 L58,23 L18,35 L0,58 L-18,35 L-58,23 L-35,0 L-58,-23 L-18,-35 Z"
        strokeWidth={7}
      />
      <circle r="9" fill="currentColor" stroke="none" />
    </svg>
  )
}

/**
 * The chain, from the stack's registry.
 *
 * Throws rather than falling back. A tenant whose chain is missing would
 * otherwise open on somebody else's governor and report real figures about the
 * wrong DAO — the one failure a reader cannot detect.
 */
function on(key: string) {
  const v = venue(key)
  if (!v) throw new Error(`No venue "${key}" in the stack's registry.`)
  return v
}

export const PARS: Brand = {
  key: 'pars',
  name: 'Pars',
  // The mark is a glyph and says nothing, so the word carries the name.
  word: 'Pars Vote',
  mark: Pars,
  venue: on('pars'),
  // Pars's own IAM, and the only thing that says who a reader is. Measured
  // rather than assumed from the estate's naming: pars.id serves an OpenID
  // configuration and stamps `iss=https://pars.id`. No trailing slash — an
  // issuer is compared as a literal string, and only one of the two is minted.
  issuer: 'https://pars.id',
}
