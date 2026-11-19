import { readFileSync, writeFileSync } from 'node:fs'

export function extractChangelog(version, markdown) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)) {
    throw new Error(`Invalid release version: ${version}`)
  }

  const sections = markdown.replaceAll('\r\n', '\n').split(/(?=^## )/m)
  const prefix = `## [${version}]`
  const matches = sections.filter((section) => section.startsWith(prefix))
  if (matches.length !== 1) {
    throw new Error(`Expected one changelog heading for ${version}, found ${matches.length}`)
  }

  const section = matches[0].trimEnd()
  const [heading, ...body] = section.split('\n')
  if (!/^ - \d{4}-(?:[1-9]|1[0-2])-(?:[1-9]|[12]\d|3[01])$/.test(heading.slice(prefix.length))) {
    throw new Error(`Invalid release heading: ${heading}`)
  }
  if (!body.join('\n').trim()) throw new Error(`Empty changelog for ${version}`)
  return section
}

if (import.meta.main) {
  const [, , version, output] = process.argv
  const body = extractChangelog(version, readFileSync('CHANGELOG.md', 'utf8'))
  if (output) writeFileSync(output, body)
  else process.stdout.write(body)
}
