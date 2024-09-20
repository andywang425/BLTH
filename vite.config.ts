import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import monkey, { cdn, util } from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: {
          '': 'Bilibili Live Tasks Helper',
          en: 'Bilibili Live Tasks Helper',
          zh: 'Bilibili Live Tasks Helper'
        },
        namespace: 'https://github.com/andywang425',
        author: 'andywang425',
        description: {
          '': 'Enhancing the experience of watching Bilibili live streaming.',
          en: 'Enhancing the experience of watching Bilibili live streaming.',
          zh: '增强Bilibili直播观看体验。'
        },
        homepageURL: 'https://github.com/andywang425/BLTH',
        supportURL: 'https://github.com/andywang425/BLTH/issues',
        updateURL:
          'https://raw.githubusercontent.com/andywang425/BLTH/master/dist/bilibili-live-tasks-helper.meta.js',
        downloadURL:
          'https://raw.githubusercontent.com/andywang425/BLTH/master/dist/bilibili-live-tasks-helper.min.user.js',
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDEuMDY1IiBoZWlnaHQ9IjEyNy43NDciIHZpZXdCb3g9IjAgMCAzNy4zMjQgMzMuOCI+PHBhdGggZmlsbD0iIzIwYjBlMyIgZD0iTTg2Ljk2MiAxMTIuMzMyYTIuNjYxIDIuNjYxIDAgMCAxIDIuMjYyIDAgNS41MzYgNS41MzYgMCAwIDEgMS4zODQgMS4wMTFsNS4zMjMgNC42NThoMy44MDVsNS4zMjMtNC42NThhNS41ODkgNS41ODkgMCAwIDEgMS4zODQtMS4wMTEgMi42NjEgMi42NjEgMCAwIDEgMy41NCAyLjIwOSAyLjY2MSAyLjY2MSAwIDAgMS0uNTg2IDEuNzgzIDE0Ljg3NyAxNC44NzcgMCAwIDEtMS4xNzEgMS4wNjUgNy42OTEgNy42OTEgMCAwIDEtLjc0NS42MTJoMy4zMjZhNS42NDIgNS42NDIgMCAwIDEgMy45MTIgMS43NTYgNS42NjkgNS42NjkgMCAwIDEgMS43ODQgMy45MTJ2MTUuMzAzYTEwLjc3OCAxMC43NzggMCAwIDEtLjEzNCAyLjMxNSA1LjkwOCA1LjkwOCAwIDAgMS0yLjY2IDMuNzI2IDUuNzIyIDUuNzIyIDAgMCAxLTMuMDYxLjg1Mkg4Ni4yMTdhMTEuMjg0IDExLjI4NCAwIDAgMS0yLjM5Ni0uMTMzIDUuODgyIDUuODgyIDAgMCAxLTMuNjcyLTIuNjYyIDUuNjk1IDUuNjk1IDAgMCAxLS45MDUtMy4wNnYtMTUuMTQzYTExLjkyMyAxMS45MjMgMCAwIDEgMC0yLjIwOSA1Ljg1NSA1Ljg1NSAwIDAgMSA1LjMyMy00LjczN2gzLjQ4NmMtLjU1OS0uNC0xLjAzOC0uODc4LTEuNTQ0LTEuMzA0YTIuNjYxIDIuNjYxIDAgMCAxLS44NTEtMi4xODMgMi42NjEgMi42NjEgMCAwIDEgMS4zMDQtMi4xMDJtLS42MTIgMTAuMzI2YTIuNjYxIDIuNjYxIDAgMCAwLTIuMTAzIDEuOTE2IDMuNTkzIDMuNTkzIDAgMCAwIDAgMS4wMTF2MTIuNTg4YTIuNjYxIDIuNjYxIDAgMCAwIDEuODM3IDIuNjYyIDMuNTEzIDMuNTEzIDAgMCAwIDEuMTQ0LjE4NmgyMS42MzdhMi42NjEgMi42NjEgMCAwIDAgMi41MjgtMS41NyAzLjcyNiAzLjcyNiAwIDAgMCAuMjY2LTEuNzU3di0xMS43MWE0LjQ3MSA0LjQ3MSAwIDAgMCAwLTEuMjc3IDIuNjYxIDIuNjYxIDAgMCAwLTEuNzMtMS44MSA0LjI4NSA0LjI4NSAwIDAgMC0xLjY1LS4yMzlIODcuNjAxYTguODg5IDguODg5IDAgMCAwLTEuMjUxIDB6bTAgMCIgc3R5bGU9InN0cm9rZS13aWR0aDouMDMzMDcyOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc5LjE5MyAtMTEyLjA4KSIvPjxwYXRoIGQ9Ik04OC45NyAxMjguNjM2Yy4zNjMuMzc3Ljc0NS43NDcgMS4wODggMS4xNDIuNTk3LjY4NyAxLjExOCAxLjE5NyAxLjY2NiAxLjgwOS0uMTI5LTEuMTE3IDEuMzA0LTEuMTk4LjA3NC0xLjc1Ny0uNDA4LjQxNy0uOTQxLjg4NC0xLjM2IDEuMjIzLS4zOTIuMzE2LS44NjMuNjctMS4yMzUuOTUyLTEuOTA3IDEuNDQzLjIyNiA0LjA1MyAyLjEzIDIuNjA3IDAgMCAyLTEuNTM1IDIuODA3LTIuMzAxLjQ0LS40MTcuNjgtLjk1Ni43Mi0xLjU5Mi4wNC0uNjU0LS41MzUtMS4yNC0uNzk0LTEuNDk4LS45Mi0uOTE0LTEuNzQzLTEuOTY4LTIuNTUtMi44MTItMS41NzUtMS44LTQuMTIuNDI4LTIuNTQ2IDIuMjI3ek0xMDYuOTc5IDEyOC42MzZjLS4zNjMuMzc3LS43NDUuNzQ3LTEuMDg4IDEuMTQyLS41OTcuNjg3LTEuMTE4IDEuMTk3LTEuNjY2IDEuODA5LjEyOS0xLjExNy0xLjMwNC0xLjE5OC0uMDc0LTEuNzU3LjQwOC40MTcuOTQxLjg4NCAxLjM2IDEuMjIzLjM5Mi4zMTYuODYzLjY3IDEuMjM1Ljk1MiAxLjkwNyAxLjQ0My0uMjI2IDQuMDUzLTIuMTMgMi42MDcgMCAwLTItMS41MzUtMi44MDctMi4zMDEtLjQ0LS40MTctLjY4LS45NTYtLjcyLTEuNTkyLS4wNC0uNjU0LjUzNS0xLjI0Ljc5NC0xLjQ5OC45Mi0uOTE0IDEuNzQzLTEuOTY4IDIuNTUtMi44MTIgMS41NzUtMS44IDQuMTIuNDI4IDIuNTQ2IDIuMjI3eiIgc3R5bGU9ImZpbGw6IzIwYjBlMztmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6LjUyNDE1OTtzdHJva2UtZGFzaGFycmF5Om5vbmUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03OS4xOTMgLTExMi4wOCkiLz48L3N2Zz4NCg==',
        copyright: '2024, andywang425 (https://github.com/andywang425)',
        license: 'MIT',
        match: [
          '*://live.bilibili.com/1*',
          '*://live.bilibili.com/2*',
          '*://live.bilibili.com/3*',
          '*://live.bilibili.com/4*',
          '*://live.bilibili.com/5*',
          '*://live.bilibili.com/6*',
          '*://live.bilibili.com/7*',
          '*://live.bilibili.com/8*',
          '*://live.bilibili.com/9*',
          '*://live.bilibili.com/blanc/1*',
          '*://live.bilibili.com/blanc/2*',
          '*://live.bilibili.com/blanc/3*',
          '*://live.bilibili.com/blanc/4*',
          '*://live.bilibili.com/blanc/5*',
          '*://live.bilibili.com/blanc/6*',
          '*://live.bilibili.com/blanc/7*',
          '*://live.bilibili.com/blanc/8*',
          '*://live.bilibili.com/blanc/9*'
        ],
        'run-at': 'document-start',
        connect: [
          'api.bilibili.com',
          'api.live.bilibili.com',
          'api.vc.bilibili.com',
          'passport.bilibili.com',
          'live.bilibili.com',
          'live-trace.bilibili.com'
        ]
      },
      build: {
        externalGlobals: {
          vue: cdn.unpkg('Vue', 'dist/vue.global.prod.js').concat(
            // For pinia, another solution is .concat('https://unpkg.com/vue-demi@latest/lib/index.iife.js')
            util.dataUrl(';window.Vue=Vue;window.VueDemi=Vue;')
          ),
          'element-plus': cdn.unpkg('ElementPlus', 'dist/index.full.min.js'),
          '@element-plus/icons-vue': cdn.unpkg('ElementPlusIconsVue', 'dist/index.iife.min.js'),
          pinia: cdn.unpkg('Pinia', 'dist/pinia.iife.prod.js'),
          'vue-draggable-plus': cdn.unpkg('VueDraggablePlus', 'dist/vue-draggable-plus.iife.js'),
          lodash: cdn.unpkg('_', 'lodash.min.js'),
          'hotkeys-js': cdn.unpkg('hotkeys', 'dist/hotkeys.min.js'),
          luxon: cdn.unpkg('luxon', 'build/global/luxon.min.js'),
          'crypto-js': cdn.unpkg('CryptoJS', 'crypto-js.js')
        },
        externalResource: {
          'element-plus/dist/index.css': cdn.unpkg()
        },
        metaFileName: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
