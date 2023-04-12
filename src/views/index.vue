<template>
    <div class="container"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.9)">
        <Header></Header>
        <div class="content">
            <Search></Search>
            <Count></Count>
        </div>
        <div></div>
    </div>
</template>

<script>
import Header from './components/jiaow/header'
import Search from './components/jiaow/search'
import Count from './components/jiaow/count.vue'
export default {
    components:{
        Header,Search,Count
    },
    name: '',
    data() {
        return {
            loading: false
        }
    },
    mounted() {
        window.addEventListener('resize', this.resizeFn);
        setTimeout(() => {
            // this.loading = false
        }, 1000);
    },
    methods: {
    },
}
</script>

<style lang="less" scoped>
    .container {
        width: 100%;
        min-height: 1080px;
        background: url(.././assets/jiaow/bg.png)no-repeat;
        background-size: 100% 100%;
        .content {
            padding: 30px 60px 60px 60px;
            box-sizing: border-box;
        }
    }
</style>
