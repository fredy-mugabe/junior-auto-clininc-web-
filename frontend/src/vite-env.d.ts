/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set automatically on Vercel builds from `VERCEL_GIT_COMMIT_SHA`. */
  readonly VITE_GIT_SHA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
