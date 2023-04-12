module.exports = {
    publicPath: './',
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true
            }
        }
    },
    devServer: {
    // 设置为0.0.0.0则所有的地址均能访问
    host: '0.0.0.0',
    port: 8086,
    https: false,
    hotOnly: false,
    // 跨域问题解决 代理（关键部分）
    proxy: {
      '/api': {
        target: 'http://172.16.70.201:8086', // 注意！此处为后端提供的真实接口
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          // 如果接口中是没有api的，那就直接置空，'^/api': ''，
          // 如果接口中有api，那就得写成{'^/api':'/api'}
          '^/api': ''
        }
      }
    }
  }
}