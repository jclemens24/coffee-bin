const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: {
    index: './public/js/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].bundle.js',
    clean: true,
    assetModuleFilename: 'images/[hash][ext]'
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.m?js$/i,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './views/index.html',
      filename: 'index.html',
      templateParameters: {
        title: 'C.A.B | Coffee Shop'
      }
    }),
    new HtmlWebpackPlugin({
      template: './views/coffee-products.html',
      filename: 'coffee-products.html'
    }),
    new HtmlWebpackPlugin({
      template: './views/teaProducts.html',
      filename: 'teaProducts.html'
    }),
    new HtmlWebpackPlugin({
      template: './views/shopper-form.html',
      filename: 'shopper-form.html'
    }),
    new HtmlWebpackPlugin({
      template: './views/products-form.html',
      filename: 'products-form.html'
    }),
    new HtmlWebpackPlugin({
      template: './views/merch.html',
      filename: 'merch.html'
    }),
    new HtmlWebpackPlugin({
      template: './views/locations.html',
      filename: 'locations.html'
    }),
    new MiniCssExtractPlugin()
  ],
  mode: 'production',
  experiments: {
    topLevelAwait: true
  }
};

module.exports = config;
