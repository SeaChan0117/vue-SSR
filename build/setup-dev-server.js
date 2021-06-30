const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleWare = require('webpack-hot-middleware')

const resolve = filePath => path.resolve(__dirname, filePath)

module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => ready = r)

    // 监视构建 ==> 更新 Renderer，即调用 callback
    let template, serverBundle, clientManifest

    const update = () => {
        if (template && serverBundle && clientManifest) {
            ready()
            callback(serverBundle, template, clientManifest)
        }
    }

    update()
    // 监视构建 template --> 调用 update --> 更新 Renderer 渲染器
    const templatePath = resolve('../index.template.html')
    template = fs.readFileSync(templatePath, 'utf-8')
    // 监听文件变化的方法，此处使用第三方的 chokidar fs.watch  fa.watchFile chokidar
    chokidar.watch(templatePath).on('change', () => {
        update()
    })

    // 监视构建 serverBundle --> 调用 update --> 更新 Renderer 渲染器
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig)
    const serverDevMiddleware = devMiddleware(serverCompiler, {
        logLevel: 'silent' // 关闭日志输出
    })

    serverCompiler.hooks.done.tap('server', () => {
        serverBundle = JSON.parse(
            serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
        )
        update()
    })

    // 监视构建 clientManifest --> 调用 update --> 更新 Renderer 渲染器
    const clientConfig = require('./webpack.client.config')
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
    clientConfig.entry = [
        'webpack-hot-middleware/client?quiet=true&reload=true', // 和服务端交互处理热更新的一个脚本
        clientConfig.entry.app
    ]
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware = devMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        logLevel: 'silent' // 关闭日志输出
    })

    clientCompiler.hooks.done.tap('client', () => {
        clientManifest = JSON.parse(
            clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
        )
        update()
    })

    server.use(hotMiddleWare(clientCompiler, {
        log: false // 关闭日志输出
    }))

    // 将 clientDevMiddleware 挂载到 Express 服务中，提供对其内部内存中数据的访问
    server.use(clientDevMiddleware)

    return onReady
}
