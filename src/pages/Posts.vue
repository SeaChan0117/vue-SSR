<template>
    <div>
        <h1>Posts List</h1>
        <ul>
            <li v-for="post in posts" :key="post.id">
                {{ post.title }}
            </li>
        </ul>
    </div>
</template>

<script>
    import axios from 'axios'
    import { mapState, mapActions } from 'vuex'
    export default {
        name: "Posts",
        metaInfo: {
            title: '条目'
        },
        data() {
            return {
                // posts: []
            }
        },
        computed: {
            ...mapState(['posts'])
        },
        // Vue SSR 特殊的为服务端渲染提供的生命周期钩子函数
        serverPrefetch() {
            // 发起 action 返回 promise
            return this.getPosts()
        },
        methods: {
          ...mapActions(['getPosts'])
        },
        // 服务端渲染只支持 beforeCreate 和 created 钩子函数
        // 且服务端渲染不会等待它们中的异步操作
        // 不支持响应式数据
        // 以下方法在服务端渲染中不会工作，实际是在客户端渲染出来的
        // async created() {
        //     const { data } = await axios({
        //         method: 'GET',
        //         url: 'https://cnodejs.org/api/v1/topics'
        //     })
        //
        //     this.posts = data.data
        // }
    }
</script>

<style scoped>

</style>
