const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// provides a merge function that concatenates arrays and merges objects
// https://www.npmjs.com/package/webpack-merge
const merge = require('webpack-merge');
// gives you better error messages
// https://www.npmjs.com/package/webpack-validator
const validate = require('webpack-validator');

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
    // merge the common stuff with the specific configs
    config = merge(common, {});
    break;
  default:
    config = merge(common, {});
}

module.exports = validate(config);