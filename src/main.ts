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
;(function () {
  if (isTargetFrame()) {
    const app = createApp(App)
    const pinia = createPinia()

    app.use(ElementPlus)
    app.use(pinia)

    const logger = new Logger('main.ts')
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

    app.mount(
      (() => {
        try {
          const app = dce('div')
          app.id = 'BLTH'
          document.body.append(app)
          return app
        } catch (e) {
          logger.error('挂载Vue app时发送错误', e)
          return 'Error'
        }
      })()
    )
  }
})()
