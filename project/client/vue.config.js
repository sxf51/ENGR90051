const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ['marked'],
  devServer: {
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws' // 自动协议，正式开发时不要这么做
    }
  }
})
