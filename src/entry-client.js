/**
 * 客户端 entry 只需创建应用程序，并且将其挂载到 DOM 中
 */
import { createApp } from './app'

// 客户端特定引导逻辑……

const { app, router, store } = createApp()

// 客户端将服务端设置到 widow 的状态配置到客户端
if (window['__INITIAL_STATE__']) {
    store.replaceState(window['__INITIAL_STATE__'])
}

router.onReady(() => {
    app.$mount('#app')
})
