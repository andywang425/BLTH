import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'

import { dce, isTargetFrame } from './library/dom'
import * as MyIconsVue from './components/icons'
import './assets/css/base.css'

if (isTargetFrame()) {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(ElementPlus)
  app.use(pinia)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  for (const [key, component] of Object.entries(MyIconsVue)) {
    app.component(key, component)
  }

  app.mount(
    (() => {
      const app = dce('div')
      app.id = 'BLTH'
      document.body.append(app)
      return app
    })()
  )
}
