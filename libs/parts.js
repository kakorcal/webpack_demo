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

exports.minify = function(){
  return {
    plugins: [
      // at the bare minimum, this plugin will go through the mangling process by default
      // mangling - reduce functions, variables, and property names to a minimum
      
      // alternatives:
        // in command line, you can use 'webpack -p' to get the same effect. -p just stands for production.
        // another way to uglify is using a loader: https://www.npmjs.com/package/uglify-loader
      new webpack.optimize.UglifyJsPlugin({
        // all options can be viewed here: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
        compress: {
          // Uglify warnings can help you to understand how it processes the code. 
          // Therefore it may be beneficial to have a peek at the full output every once in a while.
          // But for most cases, it can be left as false.
          warnings: false
        }
      })
    ]
  }
};

// Idea behind DefinePlugin
// When minifying code, you can make use of free variables like process.env.NODE_ENV to be used in if statements. 
// UglifyJs removes if statements when they are true which will increase performance.
// Learn more about what free variables are here: http://stackoverflow.com/questions/12934929/what-are-free-variables
// They are basically variables that aren't declared inside the function and aren't pass as a parameter.
exports.setFreeVariable = function(key, value){
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  }
};


exports.extractBundle = function(options){
  const entry = {};
  entry[options.name] = options.entries;

  return {
    entry: entry,
    plugins: [
    // The CommonsChunkPlugin identifies common modules and put them into a commons chunk. 
      new webpack.optimize.CommonsChunkPlugin({
        // extracting the manifest file - contains the webpack runtime that starts the whole application 
        // and contains the dependency information needed by it. This avoids a serious invalidation problem and 
        // the manifest is needed for reliable caching.
        // If we don't extract a manifest, webpack will generate the runtime to the vendor bundle. 
        // In case we modify the application code, the application bundle hash will change. 
        // Because that hash will change, so does the implementation of the runtime as it uses the hash 
        // to load the application bundle. Due to this the vendor bundle will receive a new hash too! 
        // This is why you should keep the manifest separate from the main bundles as doing this avoids the problem.
        // TODO: try to see what happens when you don't include 'manifest'
        names: [options.name, 'manifest']
      })
    ]
  };
};