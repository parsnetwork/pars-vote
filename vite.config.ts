import { createRequire } from 'node:module'
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import react from '@vitejs/plugin-react'
import { bootScript } from '@hanzo/appearance/state'
import { boot } from './src/boot.js'
import { defineConfig, type Plugin } from 'vite'

/**
 * Every engine package, deduplicated.
 *
 * The design system draws through one module registry. Two physical copies of
 * any of these means two registries, and the symptom names nothing — a popover
 * throwing on an undefined reference, a theme that resolves on one component
 * and not its sibling. Read from disk rather than listed, so a package added by
 * an upgrade is deduplicated without anyone remembering to add it here.
 */
const engine = readdirSync(new URL('./node_modules/@hanzogui', import.meta.url))
  .filter((d) => !d.startsWith('.'))
  .map((d) => `@hanzogui/${d}`)

/**
 * The stack, as a directory.
 *
 * `@luxdao/app` publishes TypeScript source by subpath rather than a build, so
 * vite has to compile it rather than treat it as a dependency it can leave
 * alone. Resolved through the package's own entry so this does not encode where
 * the package manager put it.
 */
const require = createRequire(import.meta.url)
const stack = dirname(require.resolve('@luxdao/app/package.json'))

/**
 * Puts the two settings that must precede first paint in <head>, ahead of the
 * bundle. A person's type scale and the ground the page is drawn on are a
 * custom property and a class on <html>; React mounts after first paint, so the
 * bundle cannot set either soon enough and the page would draw once at the
 * published reading and again at theirs.
 */
function head(): Plugin {
  return {
    name: 'head-settings',
    transformIndexHtml: () => [
      { tag: 'script', injectTo: 'head' as const, children: bootScript() },
      { tag: 'script', injectTo: 'head' as const, children: boot() },
    ],
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), head()],
  define: {
    __DEV__: mode !== 'production',
    'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
    // Which site this bundle is. The stack decides the tenant from the host and
    // falls back to this; pars.vote is the only site this fork serves, so it is
    // the only value that is ever right here.
    'import.meta.env.VITE_VOTE_HOME': JSON.stringify('pars'),
    // The design system ships analytics that post to api.hanzo.ai on load, on
    // by default. This is a governance interface: who reads a proposal, and
    // when, is exactly the kind of thing it has no business reporting.
    'import.meta.env.VITE_HANZO_TELEMETRY': JSON.stringify('off'),
  },
  resolve: {
    // The engine is cross-platform and reaches for react-native at module
    // scope. In a browser bundle that has to land on the web build.
    alias: { 'react-native': 'react-native-web' },
    dedupe: ['react', 'react-dom', 'react-native-web', '@hanzo/gui', ...engine],
  },
  // The engine and its web shim reach React through CommonJS. Split into their
  // own chunk they resolve a different copy and `createContext` is undefined at
  // first paint.
  build: { commonjsOptions: { include: [/node_modules/] } },
  optimizeDeps: {
    // The stack is source, so it is compiled with this app rather than
    // pre-bundled as a dependency.
    exclude: ['@luxdao/app'],
    include: ['react-native-web', '@react-native/normalize-color', '@hanzo/gui', '@hanzogui/core'],
  },
  server: {
    fs: { allow: ['.', stack, join(stack, '..')] },
    port: 5289,
    // If the port is taken, stop rather than move. A dev server that quietly
    // picks another port is how two builds end up served at once and the one
    // being read is not the one being edited.
    strictPort: true,
  },
}))
