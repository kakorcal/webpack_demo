const path = require('path');
// for chunking
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// provides a merge function that concatenates arrays and merges objects
// https://www.npmjs.com/package/webpack-merge
const merge = require('webpack-merge');
// gives you better error messages
// https://www.npmjs.com/package/webpack-validator
const validate = require('webpack-validator');

const parts = require('./libs/parts');

// prefer to use absolute paths everywhere to avoid confusion
const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css'),
  ],
  build: path.join(__dirname, 'build')
};

// stuff that's common for both dev and production
const common = {
  // entries can accept a string, array, or object
  entry: {
    app: PATHS.app,
    // bundle splitting - basically we want multiple bundles so dependencies don't have to be 
    // bundled again if the app state changes. To give you a simple example, instead of having app.js (100 kB), 
    // we could end up with app.js (10 kB) and vendor.js (90 kB). Now changes made to the application 
    // are cheap for the clients that have already used the application earlier.
    // We can push the vendor dependencies to a bundle of its own and benefit from client level caching. 
    // now there are two entry chunks
      // vendor: ['react'] // this is temporary hard coded
    // side note: http://programmers.stackexchange.com/questions/123305/what-is-the-difference-between-the-lib-and-vendor-folders
    style: PATHS.style
  },
  output: {
    path: PATHS.build,
    // output name will be the same as entry property name
    // currently, if you look at the size of both app.js and vendor.js they are about the same.
    // this is because app.js also contains react and its dependencies (webpack pulls the related dependencies to a bundle by default)
    // so we have to use the CommonsChunkPlugin to change the webpack default.
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
      { 
        // placeholders - strings that can attach info about the webpack output
          // most useful ones:
          /*
            [path] - returns an entry path
            [name] - returns an entry name
            [hash] - returns build hash
            [chunkhash] - returns chunk specific hash
          */
        // adding the placeholders to the output file will let us know if its a new build.
        // If the file contents related to a chunk are different, the hash will change as well, 
        // thus invalidating the cache. More accurately, the browser will send a new request for 
        // the new file. This means if only app bundle gets updated, only that file needs to be requested again.
          // Note that you can override existing arrays/objects
          // see: https://www.npmjs.com/package/webpack-merge
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          // This is used for require.ensure. The setup
          // will work without but this is useful to set.
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.minify(),
      // React relies on process.env.NODE_ENV based optimizations. 
      // If we force it to production, React will get built in an optimized manner. 
      // This will disable some checks (e.g., property type checks). 
      // Most importantly it will give you a smaller build and improved performance 
      // because of how UglifyJs treats the if statements.
      parts.setFreeVariable('process.env.NODE_ENV', 'production'),
      // parts.setupCSS(PATHS.app), 
      parts.extractCSS(PATHS.style),
      // NOTE: webpack is aware of PATHS.app (ie. index.js). so you don't have to pass it in.
      // just being more explicit
      parts.purifyCSS([PATHS.app]),
      parts.extractBundle({
        name: 'vendor',
        // NOTE: its important to see more clearly what exactly is going on.
        // this link: http://survivejs.com/webpack/building-with-webpack/splitting-bundles/
        // has diagrams that show the differences between how the dependencies are not repeated between two entry points.
        // protip: if you separate package.json dependencies/devDependencies strictly
        // you can use that instead of hard coding it here.
          // entries: ['react'] // hard coded
        // NOTE: when using Object.keys, the return value order is random
        // this can only be used if the order doesn't matter with each other.
        // for example, angular needs to come before angular-ui-router, but 
        // the order doesn't matter for lodash and jquery
        entries: Object.keys(pkg.dependencies)
      }),
      parts.clean(PATHS.build)
    );
    break;
  default:
    console.log('USING WEBPACK DEV SERVER');
    // config for dev server
    config = merge(
      common, 
      {devtool: 'eval-source-map'},
      parts.setupCSS(PATHS.style), 
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      })
    );
}

// wrap config into a validator
module.exports = validate(config);