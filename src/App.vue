<template>
    <div id="app">
        <h1>{{ message }}</h1>
        <h2> 客户端动态交互 </h2>
        <div>
            <input type="text" v-mode="message">
        </div>
        <div>
            <button @click="onClick">Click Test</button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "App",
        data() {
            return {
                message: '我是 Vue SSR'
            }
        },
        methods: {
            onClick() {
                console.log('Vue SSR')
            }
        }
    }
</script>

<style scoped>

</style>
