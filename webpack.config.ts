import * as path from 'path';
import * as webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const config = (_env: string, argv: any): webpack.Configuration => {
    console.log('MODE: ' + argv.mode);
    return {
        entry: path.resolve(__dirname, 'src'),

        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, 'dist')
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.src', '.json', '.js'],
            modules: ['src', 'node_modules']
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
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: ['file-loader']
                },
                {
                    test: /\.txt$/,
                    use: ['file-loader']
                }
            ]
        },

        optimization: {
            minimize: argv.mode === 'production',
            minimizer: [
                new TerserPlugin({
                    extractComments: false
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        },

        plugins: [
            new webpack.BannerPlugin(
                'SokoBun v' +
                    process.env.npm_package_version +
                    ' (' +
                    process.env.npm_package_homepage +
                    ')\n' +
                    'Copyright 2020 ' +
                    process.env.npm_package_author_name +
                    '\n' +
                    'Licensed under ' +
                    process.env.npm_package_license
            ),
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

export default config;
