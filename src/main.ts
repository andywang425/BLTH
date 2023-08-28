import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import { useCacheStore } from './stores/useCacheStore'
import { dce, isTargetFrame } from './library/dom'
import * as MyIconsVue from './components/icons'
import './assets/css/base.css'
import Logger from './library/logger'
import { useModuleStore } from './stores/useModuleStore'

const logger = new Logger('Main')

if (isTargetFrame()) {
  logger.log('document.readyState', document.readyState)

  const app = createApp(App)
  const pinia = createPinia()

  app.use(ElementPlus)
  app.use(pinia)

  const cacheStore = useCacheStore()
  cacheStore.checkIfMainBLTHRunning()

  if (!cacheStore.isMainBLTHRunning) {
    logger.log('当前脚本是Main BLTH，开始存活心跳')
    cacheStore.startAliveHeartBeat()
  } else {
    logger.log('其它页面上存在正在运行的Main BLTH')
  }

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  for (const [key, component] of Object.entries(MyIconsVue)) {
    app.component(key, component)
  }

  const moduleStore = useModuleStore()
  moduleStore.loadModules()

  const mountApp = () => {
    const div = dce('div')
    div.id = 'BLTH'
    document.body.append(div)
    app.mount(div)
    moduleStore.emitter.emit('Main', {
      moment: 'document-end'
    })
  }

  if (document.readyState !== 'loading') {
    mountApp()
  } else {
    document.addEventListener('DOMContentLoaded', () => mountApp())
  }

  if (document.readyState === 'complete') {
    moduleStore.emitter.emit('Main', {
      moment: 'window-load'
    })
  } else {
    window.addEventListener('load', () => {
      moduleStore.emitter.emit('Main', {
        moment: 'window-load'
      })
    })
  }
}
