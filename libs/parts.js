const webpack = require('webpack');
// the webpack-dev-server is a development server running in-memory. 
// It refreshes content automatically in the browser while you develop your application. 
// It also supports an advanced Webpack feature known as Hot Module Replacement (HMR), 
// which provides a way to patch the browser state without a full refresh.
exports.devServer = function(options){
  return {
    devServer: {
      // enables you to fallback to use this api: https://developer.mozilla.org/en-US/docs/Web/API/History_API
      historyApiFallback: true,
      hot: true,
      inline: true,
      // display errors only to reduce the amount of output
      // stats: 'errors-only',
      host: options.host, // Defaults to `localhost`
      port: options.port // Defaults to 8080
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        // enable multi-pass compilation
        // https://en.wikipedia.org/wiki/Multi-pass_compiler
        multiStep: true
      })
    ]
  };
};