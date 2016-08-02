const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// prefer to use absolute paths everywhere to avoid confusion
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

module.exports = {
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