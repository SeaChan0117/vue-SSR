import Vuex from 'vuex'
import Vue from 'vue'
import axios from "axios"

Vue.use(Vuex)

export const createStore = () => {
    return new Vuex.Store({
        state: () => {
            return {
                posts: []
            }
        },
        mutations: {
            setPosts: (state, payload) => {
                state.posts = payload
            }
        },
        actions: {
            // 在服务端渲染期间务必让 action 返回一个 Promise
            async getPosts({ commit }) {
                const { data } = await axios.get('https://cnodejs.org/api/v1/topics')
                commit('setPosts', data.data)
            }
        }
    })
}
