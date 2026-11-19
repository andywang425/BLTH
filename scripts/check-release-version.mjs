import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { extractChangelog } from './extract-changelog.mjs'

function versionAt(ref) {
  return JSON.parse(execFileSync('git', ['show', `${ref}:package.json`])).version
}

function parts(version) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`Invalid release version: ${version}`)
  }
  return version.split('.').map(BigInt)
}

const [baseSha, headSha = 'HEAD'] = process.argv.slice(2)
const base = versionAt(baseSha)
const baseParts = parts(base)
const [major, minor, patch] = baseParts
let expected = patch + 1n >= 10n ? `${major}.${minor + 1n}.0` : `${major}.${minor}.${patch + 1n}`

// Limit intent to the PR source history. The checkout itself may be a synthetic merge.
const history = execFileSync(
  'git',
  [
    'log',
    '--format=%H%x00%(trailers:key=Release-Version-Override,only)%x00',
    `${baseSha}..${headSha}`,
  ],
  { encoding: 'utf8' },
).split('\0')
let overrideCommit
for (let i = 0; i + 1 < history.length; i += 2) {
  const trailers = history[i + 1].trim()
  if (!trailers) continue
  const commit = history[i].trim()
  if (overrideCommit || trailers.includes('\n')) {
    throw new Error('Expected only one Release-Version-Override trailer in this PR')
  }
  overrideCommit = commit
  const version = trailers.slice(trailers.indexOf(':') + 1).trim()
  const target = parts(version)
  const index = target.findIndex((part, i) => part !== baseParts[i])
  if (index === -1 || target[index] < baseParts[index]) {
    throw new Error(`Release-Version-Override ${version} must be greater than ${base}`)
  }
  if (versionAt(commit) !== version || versionAt(`${commit}^1`) === version) {
    throw new Error(
      `Release-Version-Override must be on the commit setting package.json to ${version}`,
    )
  }
  expected = version
}
const pkg = JSON.parse(readFileSync('package.json'))
const lock = JSON.parse(readFileSync('package-lock.json'))
for (const [field, actual] of [
  ['package.json version', pkg.version],
  ['package-lock.json version', lock.version],
  ['package-lock.json root package version', lock.packages?.['']?.version],
]) {
  if (actual !== expected) throw new Error(`${field}: expected ${expected}, got ${actual}`)
}
extractChangelog(expected, readFileSync('CHANGELOG.md', 'utf8'))
console.log(`Release version ${base} -> ${expected}`)
