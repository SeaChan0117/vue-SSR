import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../pages/Home"

Vue.use(VueRouter)

export const createRouter = () => {
    return  new VueRouter({
        mode: 'history', // 兼容前后端
        routes: [
            {
                path: '/',
                name: 'home',
                component: Home
            },
            {
                path: '/about',
                name: 'about',
                component: () => import('@/pages/about')
            },
            {
                path: '*',
                name: 'error404',
                component: () => import('@/pages/Page-404')
            }
        ]
    })
}
