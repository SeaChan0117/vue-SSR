/**
 * 服务器 entry 使用 default export 导出函数，并在每次渲染中重复调用此函数。
 * 此时，除了创建和返回应用程序实例之外，它不会做太多事情 - 但是稍后我们将在此执行服务器端路由匹配 (server-side route matching) 和数据预取逻辑 (data pre-fetching logic)。
 */
import { createApp } from './app'

export default context => {
    const { app } = createApp()
    // TODO：服务端路由处理，数据预取...
    return app
}
