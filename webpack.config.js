const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  console.log('MODE: ' + argv.mode);
  return {
    entry: path.resolve(__dirname, 'src'),

    output: {
      filename: '[name].[contenthash].js',
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
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ],
        },
        {
          test: /\.txt$/,
          use: [
            'file-loader',
          ],
        }
      ],
    },

    optimization: {
      minimize: argv.mode === 'production',
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    },

    plugins: [
      new CleanWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'SokoBun',
        template: './public/index.html',
        favicon: './public/favicon.png'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      })
    ],

    devtool: argv.mode === 'production' ? false : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      port: 9000
    }
  };
};
