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
import { waitForMoment } from './library/utils'

const logger = new Logger('Main')

logger.log('document.readyState', document.readyState)

const pinia = createPinia()

const cacheStore = useCacheStore(pinia)
const moduleStore = useModuleStore(pinia)

cacheStore.checkCurrentScriptType()
logger.log('当前脚本的类型为', cacheStore.currentScriptType)

if (cacheStore.currentScriptType === 'Main') {
  cacheStore.startMainBLTHAliveHeartBeat()
}

moduleStore.loadModules('unknown')

await waitForMoment('document-body')

if (isTargetFrame()) {
  const app = createApp(App)

  app.use(ElementPlus)
  app.use(pinia)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  for (const [key, component] of Object.entries(MyIconsVue)) {
    app.component(key, component)
  }

  moduleStore.loadModules('yes')

  await waitForMoment('document-end')

  const div = dce('div')
  div.id = 'BLTH'
  document.body.append(div)
  app.mount(div)
}
