/**
 * @description 压缩编译后的用户脚本
 */
import { promises as fs } from 'fs'
import { minify } from 'terser'

async function minifyUserscript(inputPath, outputPath) {
  const code = await fs.readFile(inputPath, 'utf-8')

  // 获取 Userscript metadata
  const metadataMatch = code.match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/)
  const metadata = metadataMatch ? metadataMatch[0] : ''

  // 压缩
  const minified = await minify(code, {
    format: {
      comments: false
    }
  })

  // 加上 metadata
  const result = `${metadata}\n${minified.code}`

  await fs.writeFile(outputPath, result, 'utf-8')
}

minifyUserscript(
  'dist/bilibili-live-tasks-helper.user.js',
  'dist/bilibili-live-tasks-helper.min.user.js'
)
