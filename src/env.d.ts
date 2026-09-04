/// <reference types="vite/client" />

/**
 * What this build is told, and nothing more.
 *
 * `VITE_VOTE_HOME` is fixed to `pars` in `vite.config.ts` rather than left to
 * the environment: this fork serves one site, so the value that is ever right
 * is known at configuration and a build cannot be told otherwise.
 */
interface ImportMetaEnv {
  readonly VITE_VOTE_HOME?: string
  readonly VITE_HANZO_TELEMETRY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
