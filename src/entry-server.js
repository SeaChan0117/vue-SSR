/**
 * 服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。
 * 此时，除了创建和返回应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。
 */
import { createApp } from './app'

export default async context => {
    // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
    const { app, router, store } = createApp()

    const meta = app.$meta()

    // 设置服务器端 router 的位置
    router.push(context.url)

    context.meta = meta

    // 等到 router 将可能的异步组件和钩子函数解析完
    await new Promise(router.onReady.bind(router))

    // 当服务端渲染结束后调用
    context.rendered = () => {
        // Renderer 会把 context.state 数据对象内联到页面模板中
        // 最终发送给客户端的页面中会包含一段脚本：window.__INITIAL_STATE__ = context.state
        // 客户端就要把页面中的 window.__INITIAL_STATE__ 拿出来填充到客户端 store 容器中
        context.state = store.state // 将服务端状态挂载到客户端状态上，保持一致，才能在客户端渲染
    }
    return app
}
