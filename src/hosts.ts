/**
 * The two origins pars.vote talks to, besides its own: the chain it reads and
 * the IAM its readers sign in at.
 *
 * A module of their own, and a plain one, because two things need the same
 * answer and must not be able to disagree: `brand.tsx` reads from and signs in
 * at them, and `vite.config.ts` writes them into the page's
 * Content-Security-Policy. A config file cannot import the brand — it imports
 * the stack, which node will not load — so the values live where both can.
 */

/**
 * Pars's C-Chain, by the path form: the path names the chain it reads, where
 * the bare host means whatever the gateway last mapped it to.
 */
export const RPC = 'https://api.pars.network/v1/chain/c/rpc'

/**
 * Pars's own IAM, and the only thing that says who a reader is. Measured
 * rather than assumed from the estate's naming: pars.id serves an OpenID
 * configuration, stamps `iss=https://pars.id`, and names itself for every
 * endpoint it advertises. No trailing slash — an issuer is compared as a
 * literal string, and only one of the two is minted.
 */
export const ISSUER = 'https://pars.id'
