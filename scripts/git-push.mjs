/**
 * Stage all changes, commit, and push to origin/main.
 * Usage from repo root:
 *   npm run push
 *   npm run push -- "feat: describe your change"
 */
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
process.chdir(root)

function gitExe() {
  const fromEnv = process.env.GIT_EXE
  if (fromEnv && existsSync(fromEnv)) return `"${fromEnv}"`
  const bin = 'C:\\Program Files\\Git\\bin\\git.exe'
  if (existsSync(bin)) return `"${bin}"`
  const cmd = 'C:\\Program Files\\Git\\cmd\\git.exe'
  if (existsSync(cmd)) return `"${cmd}"`
  return 'git'
}

const git = gitExe()

const msg =
  process.argv.slice(2).join(' ').trim() || `chore: sync ${new Date().toISOString().slice(0, 10)}`

try {
  execSync(`${git} add -A`, { stdio: 'inherit', shell: true })
  const status = execSync(`${git} status --porcelain`, { encoding: 'utf8', shell: true })
  if (!status.trim()) {
    console.log('Nothing to commit (working tree clean).')
    process.exit(0)
  }
  execSync(`${git} commit -m ${JSON.stringify(msg)}`, { stdio: 'inherit', shell: true })
  execSync(`${git} push -u origin main`, { stdio: 'inherit', shell: true })
  console.log('Pushed to origin/main.')
} catch {
  process.exit(1)
}
