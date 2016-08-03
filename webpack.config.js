const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// provides a merge function that concatenates arrays and merges objects
// https://www.npmjs.com/package/webpack-merge
const merge = require('webpack-merge');
// gives you better error messages
// https://www.npmjs.com/package/webpack-validator
const validate = require('webpack-validator');

// devServer
const parts = require('./libs/parts');

// prefer to use absolute paths everywhere to avoid confusion
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

// stuff that's common for both dev and production
const common = {
  // entries can accept a string, array, or object
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({title: 'Webpack Demo'})
  ]
};

var config;
// Detect how npm is run and branch based on that
// learn more about npm_lifecycle_event here: 
// https://medium.com/@brianhan/use-this-npm-variable-as-a-flag-for-your-build-scripts-31069f5e2e57#.iofh1bwso
switch(process.env.npm_lifecycle_event){
  case 'build': 
    console.log('BUILDING BUNDLE');
    // merge the common stuff with the specific configs
    config = merge(
      common, 
      // source maps allows you to see where the error occurred during the build.
      // this link gives all the options: https://webpack.github.io/docs/configuration.html#devtool
      // basically, you get to choose the quality of the source map. each have pros and cons regarding
      // performance and the quality of the file.
      // to enable source maps for css, you have to include it in query loader as css?sourceMap
      // If you want more control over source maps, you can use the SourceMapDevToolPlugin
      // https://webpack.github.io/docs/list-of-plugins.html#sourcemapdevtoolplugin
      {devtool: 'source-map'},
      parts.minify(),
      // React relies on process.env.NODE_ENV based optimizations. 
      // If we force it to production, React will get built in an optimized manner. 
      // This will disable some checks (e.g., property type checks). 
      // Most importantly it will give you a smaller build and improved performance 
      // because of how UglifyJs treats the if statements.
      parts.setFreeVariable('process.env.NODE_ENV', 'production'),
      parts.setupCSS(PATHS.app)
    );
    break;
  default:
    console.log('USING WEBPACK DEV SERVER');
    // config for dev server
    config = merge(
      common, 
      {devtool: 'eval-source-map'},
      parts.setupCSS(PATHS.app), 
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

// wrap config into a validator
module.exports = validate(config);