import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { extractChangelog } from './extract-changelog.mjs'

const [baseSha] = process.argv.slice(2)
const base = JSON.parse(execFileSync('git', ['show', `${baseSha}:package.json`])).version
const [major, minor, patch] = base.split('.').map(Number)
const expected = patch + 1 >= 10 ? `${major}.${minor + 1}.0` : `${major}.${minor}.${patch + 1}`
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
