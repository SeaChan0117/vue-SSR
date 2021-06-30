const express = require('express')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const setUpDevServer = require('./build/setup-dev-server')

const server = express()
server.use('/dist', express.static('./dist')) // 开发 dist 目录下的资源，否则找不到

const isProd = process.env.NODE_ENV === 'production'
let renderer
let onReady
if (isProd) {
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const template = fs.readFileSync('./index.template.html', 'utf-8')
    const clientManifest  = require('./dist/vue-ssr-client-manifest.json')
    renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest
    })
} else {
    // 开发模式 --> 监视打包构建 --> 重新生成 Renderer 渲染器
    onReady = setUpDevServer(server, (serverBundle, template, clientManifest) => {
        renderer = createBundleRenderer(serverBundle, {
            template,
            clientManifest
        })
    })
}

const render = (req, res) => {
    renderer.renderToString({
        title: "vue-ssr",
        meta: `<meta name="description" content="我是 vue ssr">`
    }, (err, html) => {
        if (err) {
            res.status(500).end('Internal Server Error.')
        }
        res.end(html)
    })
}

server.get('*', isProd
    ? render
    : async (req, res) => {
        // 等待有了 Renderer 渲染器后，调用 render 进行渲染
        await onReady
        render(req, res)
    }
)

server.listen(3000, () => {
    console.log('server is running at port 3000')
})
