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
import { proxy } from 'ajax-hook'
import { unsafeWindow } from '$'
import { useModuleStore } from './stores/useModuleStore'

try {
  // 编译的时候 if 条件会变成 true
  // @ts-ignore
  if (process.env.NODE_ENV !== 'development') {
    Logger.prototype.debug = () => {}
  }
} catch (error) {
  // 保险起见捕获一下错误
  Logger.prototype.debug = () => {}
}

const logger = new Logger('main.ts')

logger.log('document.readyState', document.readyState)

// proxy(
//   {
//     onRequest: (config, handler) => {
//       console.log(config.url)
//       handler.next(config)
//     }
//   },
//   unsafeWindow
// )
// proxy(
//   {
//     onResponse: (response, handler) => {
//       console.log(response.response)
//       handler.next(response)
//     }
//   },
//   unsafeWindow
// )
if (isTargetFrame()) {
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

  window.onload = () => {
    const div = dce('div')
    div.id = 'BLTH'
    document.body.append(div)
    app.mount(div)
  }
}
