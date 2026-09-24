import type { ReactElement } from 'react'
import type { Brand } from '@luxdao/app/chrome/brand'
import { identity, type Venue } from '@luxdao/app/gov/chain'
import { ISSUER, RPC } from './hosts'
import khatam from './khatam.svg'

/**
 * pars.vote, as a tenant of the stack: its name, its mark, its chain and its
 * IAM, declared here and nowhere else.
 *
 * The stack names no tenant in anything a fork imports — its own three are
 * registered by its own entry — so this file is the only site a bundle built
 * from this fork carries. Pars is a fork rather than a fourth name on the
 * stack's bundle because it adds SCREENS — an escrow on its own token, a bond
 * market, a network of committees — and a tenant flag on a screen only one site
 * draws is how one app becomes two apps sharing a binary.
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
 * Pars's chain, and the one record of it.
 *
 * Two records name two different Bounties here. This is the one in
 * deployments/l2-mainnet/pars.json; the DAO repo names another, and that file
 * marks its own work-market block superseded. An address is a candidate, never
 * a claim: `presence()` asks the chain and the screens say what it answers.
 */
const CHAIN: Venue = {
  id: 494949,
  key: 'pars',
  ...identity(494949, { name: 'Pars', symbol: 'PARS' }),
  rpc: RPC,
  explorer: 'https://explore.pars.network',
  at: {
    bounty: '0x79254D4A9286FBd65E7177440Be20f00934c33c2',
    governor: '0x62Ea1B27CDD922dbAaE0572f4CD4862Ca939C24c',
    safe: '0x4CEA4ac1C874a340B06e0422E77a477463C3a542',
  },
}

export const PARS: Brand = {
  key: 'pars',
  name: 'Pars',
  // The mark is a glyph and says nothing, so the word carries the name.
  word: 'Pars Vote',
  mark: Pars,
  // A glyph already, so the corner and the lockup are one drawing.
  glyph: Pars,
  // This site's own file: the tab is the one surface where a mark is the
  // host's to choose, and pars.vote's is the khatam. Content-addressed, so a
  // cache holding an earlier mark under a fixed name cannot keep showing it.
  icon: { svg: khatam, touch: '/icon-180.png' },
  venue: CHAIN,
  issuer: ISSUER,
}
