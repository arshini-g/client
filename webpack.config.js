const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // Set the mode to 'production'
  mode: 'production',
  
  // Entry point of the application
  entry: './src/index.js',
  
  // Output configuration
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/[name].[contenthash].js',
    publicPath: '/'
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.svg$/,
        loader: '@svgr/webpack',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    alias: {
      '@fortawesome/fontawesome-svg-core': '@fortawesome/fontawesome-svg-core',
      '@fortawesome/react-fontawesome': '@fortawesome/react-fontawesome',
    },
  },
  
  plugins: [
    new HtmlMinifierPlugin({
      collapseWhitespace: true, // Combines multiple whitespaces into one
      removeComments: true, // Remove HTML comments
      minifyCSS: true, // Minify CSS
      minifyJS: true, // Minify JS
      removeRedundantAttributes: true, // Remove redundant attributes
      useShortDoctype: true, // Use shorter DOCTYPEs
      removeEmptyAttributes: true, // Remove empty attributes
      caseSensitive: true // Ensure case-sensitivity
    })
  ],
  
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
    runtimeChunk: 'single',
    minimizer: [
      // Minify CSS files
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash].css',
      }),
      // Minify JavaScript files
      new (require('terser-webpack-plugin'))()
    ]
  },
  
  // Source map for easier debugging
  devtool: 'source-map'
};
