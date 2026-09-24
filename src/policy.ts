import { ISSUER, RPC } from './hosts.js'

/**
 * The Content-Security-Policy pars.vote is served under.
 *
 * The page holds an IAM access token and a refresh token in browser storage.
 * Any script that runs on this origin can read them, so what may run here is
 * the whole of the question, and the answer is: this site's own bundle, the
 * two boot scripts in its head — by hash, not by `'unsafe-inline'` — and
 * Cloudflare's analytics beacon, which the zone injects. Everything the bundle
 * reaches is named: its own origin, the chain, the IAM, and the beacon's
 * collector. A script that got onto the page some other way can neither run
 * nor send what it read anywhere.
 *
 * Styles are `'unsafe-inline'` because the design engine writes its rules into
 * `<style>` at runtime; a style can restyle the page but cannot read storage.
 *
 * Framing is refused by the ingress, not here: `frame-ancestors` is ignored in
 * a `<meta>` policy, and `X-Frame-Options: DENY` is the header the site's route
 * sends.
 *
 * `inline` is the text of every inline script in the built page, exactly as
 * written there, because a hash is over those bytes and nothing else.
 */
export function policy(inline: readonly string[], digest: (text: string) => string): string {
  const origin = (url: string) => new URL(url).origin
  const beacon = 'https://static.cloudflareinsights.com'
  const collector = 'https://cloudflareinsights.com'
  return [
    "default-src 'self'",
    `script-src 'self' ${inline.map((s) => `'sha256-${digest(s)}'`).join(' ')} ${beacon}`.replace(/ {2,}/g, ' '),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${origin(RPC)} ${origin(ISSUER)} ${collector}`,
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}
