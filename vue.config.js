module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? 'test/' : '',
  devServer: {
    compress: true,
    disableHostCheck: true,
  },
}
