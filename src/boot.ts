/**
 * The head script, restated — and the one duplication in this fork.
 *
 * `@luxdao/app/chrome/boot` is the same four lines and would be imported here
 * if it could be. It cannot: the stack publishes TypeScript source, and node
 * refuses to strip types from a file under `node_modules` — which is where a
 * dependency's source lives and where a vite config's imports are resolved from
 * at configuration time, before any bundler has run. Every other module of the
 * stack is imported normally, because everything else is loaded by vite rather
 * than by node.
 *
 * So the string is written twice and pinned once: `boot.test.ts` asserts this
 * is character-for-character what the stack emits, so the two cannot drift
 * without a test saying so. A copy nobody checks would fall out of step at the
 * first change to the key and the symptom would be a page that flashes the
 * wrong ground on load.
 */
export const KEY = 'vote.theme'

export const boot = () =>
  `try{var t=localStorage.getItem(${JSON.stringify(KEY)})` +
  `;if(t==='light'){var c=document.documentElement.classList` +
  `;c.remove('dark');c.add('light')}}catch(e){}`
