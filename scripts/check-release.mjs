import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { appendFileSync, readFileSync, statSync } from 'node:fs'
import { basename } from 'node:path'

const files = [
  'dist/bilibili-live-tasks-helper.user.js',
  'dist/bilibili-live-tasks-helper.min.user.js',
  'dist/bilibili-live-tasks-helper.meta.js',
]

export function checkFiles() {
  return files.map((path) => {
    const stat = statSync(path, { throwIfNoEntry: false })
    if (!stat?.isFile() || !stat.size) throw new Error(`Missing or empty release file: ${path}`)
    const digest = 'sha256:' + createHash('sha256').update(readFileSync(path)).digest('hex')
    return { path, name: basename(path), size: stat.size, digest }
  })
}

export function checkRelease({ tag, sha, tagSha, release, body, assets }) {
  if (tagSha && tagSha !== sha) throw new Error(`${tag}: expected ${sha}, found ${tagSha}`)
  if (!release) return { state: 'create', missing: files }
  const differences = []
  if (!tagSha) differences.push(`Missing tag ${tag} at ${sha}`)
  if (release.prerelease || release.name !== tag)
    differences.push(
      `Unexpected release name or prerelease flag: ${release.name}, ${release.prerelease}`,
    )
  const actualBody = (release.body ?? '').replaceAll('\r\n', '\n')
  if (actualBody !== body)
    differences.push(`Release body differs:\nexpected:\n${body}\nfound:\n${actualBody}`)
  const missing = []
  for (const asset of assets) {
    const remote = release.assets.find((item) => item.name === asset.name)
    if (!remote) missing.push(asset.path)
    else if (
      remote.state !== 'uploaded' ||
      remote.size !== asset.size ||
      remote.digest !== asset.digest
    ) {
      differences.push(
        `${asset.path}: expected uploaded ${asset.size} bytes ${asset.digest}, found ${remote.state} ${remote.size} bytes ${remote.digest}`,
      )
    }
  }
  for (const remote of release.assets) {
    if (!assets.some((asset) => asset.name === remote.name))
      differences.push(`Unexpected asset: ${remote.name}`)
  }
  if (differences.length) throw new Error(differences.join('\n'))
  return { state: release.draft ? 'draft' : missing.length ? 'repair' : 'complete', missing }
}

if (import.meta.main) {
  const assets = checkFiles()
  const [, , mode, sha, bodyPath] = process.argv
  if (mode !== 'files') {
    if (!['inspect', 'verify'].includes(mode)) throw new Error('Expected files, inspect or verify')
    const body = readFileSync(bodyPath, 'utf8')
    const tag = 'v' + JSON.parse(readFileSync('package.json')).version
    const ref = `refs/tags/${tag}`
    const refs = execFileSync('git', ['ls-remote', 'origin', ref, ref + '^{}'], {
      encoding: 'utf8',
    })
    const tags = new Map(
      refs
        .trim()
        .split('\n')
        .map((line) => line.trim().split(/\s+/).reverse()),
    )
    const tagSha = tags.get(ref + '^{}') ?? tags.get(ref)
    // Include drafts left by an interrupted upload. An API failure must stop the run.
    const records = execFileSync(
      'gh',
      [
        'api',
        '--paginate',
        'repos/{owner}/{repo}/releases?per_page=100',
        '--jq',
        `.[] | select(.tag_name == ${JSON.stringify(tag)}) | @json`,
      ],
      { encoding: 'utf8' },
    ).trim()
    const release = records ? JSON.parse(records) : null
    const { state, missing } = checkRelease({ tag, sha, tagSha, release, body, assets })
    console.log(JSON.stringify({ tag, sha, tagSha, state, missing, assets }, null, 2))
    if (mode === 'verify' && state !== 'complete') throw new Error(`${tag} is ${state}`)
    if (mode === 'inspect' && process.env.GITHUB_OUTPUT) {
      appendFileSync(
        process.env.GITHUB_OUTPUT,
        `tag=${tag}\nstate=${state}\nmissing=${missing.join(' ')}\ncreate_tag=${!tagSha}\n`,
      )
    }
  }
}
