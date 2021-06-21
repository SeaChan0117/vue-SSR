const Vue = require('vue')
const express = require('express')
const fs = require('fs')

const renderer = require('vue-server-renderer').createRenderer({
    template: fs.readFileSync('./index.template.html', 'utf-8')
})

const server = express()

server.get('/', (req, res) => {
    const app = new Vue({
        template: `
            <div id="app">
                <h1>{{ message }}</h1>
            </div>
        `,
        data: {
            message: '你好啊 Vue SSR'
        }
    })

    renderer.renderToString(app, {
        title: "外部数据title",
        meta: `<meta name="description" content="我是 vue ssr">`
    },(err, html) => {
        if (err) {
            res.status(500).end('Internal Server Error.')
        }
        res.end(html)
    })
})

server.listen(3000, () => {
    console.log('server is running at port 3000')
})
