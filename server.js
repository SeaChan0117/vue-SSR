const Vue = require('vue')
const express = require('express')
const fs = require('fs')

const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const template = fs.readFileSync('./index.template.html', 'utf-8')
const clientManifest  = require('./dist/vue-ssr-client-manifest.json')

const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template,
    clientManifest
})

const server = express()
server.use('/dist', express.static('./dist')) // 开发 dist 目录下的资源，否则找不到

server.get('*', (req, res) => {
    renderer.renderToString({
        title: "vue-ssr",
        meta: `<meta name="description" content="我是 vue ssr">`
    }, (err, html) => {
        if (err) {
            res.status(500).end('Internal Server Error.')
        }
        res.end(html)
    })
})

server.listen(3000, () => {
    console.log('server is running at port 3000')
})
