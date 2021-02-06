module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    port: 3333,
    proxy: {
      '/api': {
        // target: 'https://doco.dev',
        target: 'http://localhost:7001',
        // 开启跨域
        changeOrigin: true,
      },
    },
  },
  pwa: {
    iconPaths: {
      favicon32: 'favicon_icon.png',
      favicon16: 'favicon_icon.png',
      appleTouchIcon: 'favicon_icon.png',
      maskIcon: 'favicon_icon.png',
      msTileImage: 'favicon_icon.png',
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
};
