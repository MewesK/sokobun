const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, 'src'),

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.src', '.json', '.js'],
    modules: ['src', 'node_modules'],
  },

  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      }
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'SokoBun'
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000
  }
};
