const webpack = require('webpack');
// the webpack-dev-server is a development server running in-memory. 
// meaning that it doesn't output the results into your build directory.
// https://en.wikipedia.org/wiki/In-memory_database
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

exports.setupCSS = function(paths){
  return {
    module: {
      // Loaders are transformations applied to the source file. They return the new source
      // List of loaders: http://webpack.github.io/docs/list-of-loaders.html
      loaders: [
        {
          // apply loader if file matches this extension
          test: /\.css$/,
          // loaders are evaluated right to left. the css-loader then style-loader get evaluated.
          // the css-loader resolves stuff like @import and url statements while style-loaders
          // resolves require statements in javascript files
          // css?modules lets you default to local scoping and lets you use syntax shown in 
          // https://github.com/css-modules/css-modules
          loaders: ['style', 'css?modules'],
          // IMPORTANT: always specify what path the loader should check. 
          // otherwise it will look at all files from the base directory which will hurt performance.
          include: paths
        }
      ]
    }
  }
};