module.exports = {
  devServer: {
    port: 3333,
    proxy: 'http://111.26.53.74:8081'
    // proxy: 'http://localhost:3000'
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
};
