/**
 * 使用方法：把 svg 文件放到 ./src/components/icons/ 目录下，然后运行命令 npm run svg2vue 即可将其转换成 vue 组件
 *
 * @description 将 .svg 文件优化并转换为 vue 组件（.vue文件）
 */

import { promises as fs } from 'fs'
import { join, extname, basename, resolve } from 'path'
import { optimize } from 'svgo'

const svgDirPath = resolve('./src/components/icons/')

fs.readdir(svgDirPath)
  .then((files) => {
    const svgFiles = files.filter((file) => extname(file) === '.svg')

    const filePromises = svgFiles.map(async (file) => {
      const filePath = join(svgDirPath, file)
      // 读 svg 文件
      const data = await fs.readFile(filePath, 'utf8')
      // 使用 svgo 优化 svg
      const result = optimize(data, {
        multipass: true,
      })
      const optimizedSvgString = result.data
      // 加上 Vue 的 <template> 标签
      const vueContent = `<template>\n${optimizedSvgString}\n</template>\n`
      // 修改文件后缀，获得新的文件路径
      const newFilePath = join(svgDirPath, basename(file, '.svg') + '.vue')
      // 写文件
      return await fs.writeFile(newFilePath, vueContent, 'utf8')
    })
    return Promise.all(filePromises)
  })
  .then(() => {
    console.log('所有svg文件均已被转换为vue组件')
  })
  .catch((err) => {
    console.error('转换失败:', err)
  })
