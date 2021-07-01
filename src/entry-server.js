/**
 * 服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。
 * 此时，除了创建和返回应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。
 */
import { createApp } from './app'

export default async context => {
    // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
    // 以便服务器能够等待所有的内容在渲染前，
    // 就已经准备就绪。
    const { app, router } = createApp()

    // 设置服务器端 router 的位置
    router.push(context.url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    await new Promise(router.onReady.bind(router))
    return app
}
