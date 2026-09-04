import { lazy } from 'react'
import { Route } from 'react-router'
import App, { screen } from '@luxfi/vote'
import type { Place } from '@luxfi/vote/chrome/nav'

/**
 * pars.vote: the stack, plus the screens only Pars has.
 *
 * Every screen the other sites draw — proposals, voting power, treasury, work,
 * roles, karma, the deployment survey — is imported and not restated. What is
 * added is four routes and the four header entries that reach them, which is
 * the whole of what this fork is.
 *
 * Lazy, for the reason the stack's own routes are: imported at the top of this
 * file each screen would join the shell's module graph, and one route that will
 * not parse would take down the nav, the footer and every screen that was fine,
 * as a blank document rather than as an error.
 */
const Stake = lazy(() => import('./routes/Stake'))
const Bonds = lazy(() => import('./routes/Bonds'))
const Network = lazy(() => import('./routes/Network'))
const Committee = lazy(() => import('./routes/Committee'))

/**
 * `/stake` overrides the stack's own escrow screen rather than sitting beside
 * it. React Router takes the first matching route and the fork's are placed
 * ahead of the base's, so one path means one screen: the stack's escrow screen
 * reading Pars's escrow, with the note about its exit rate under it.
 */
const WHERE: readonly Place[] = [
  ['/stake', 'Vote escrow'],
  ['/bonds', 'Bonds'],
  ['/network', 'Network'],
]

export default function Pars() {
  return (
    <App
      places={WHERE}
      more={
        <>
          <Route path="/stake" element={screen('stake', <Stake />)} />
          <Route path="/bonds" element={screen('bonds', <Bonds />)} />
          <Route path="/network" element={screen('network', <Network />)} />
          <Route path="/network/:address" element={screen('committee', <Committee />)} />
        </>
      }
    />
  )
}
