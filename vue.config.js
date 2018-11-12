const webpack = require('webpack')

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          WS_URL: JSON.stringify(process.env.WS_URL),
        },
      }),
    ],
  },
}
