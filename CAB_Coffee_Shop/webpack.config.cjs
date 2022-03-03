const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
  entry: {
    products: './public/js/coffeeProducts.js',
    productForm: './public/js/productForm.js',
    shopperForm: './public/js/shopperForm.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'views/index.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'coffee-products.html',
      template: 'views/coffee-products.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'shopper-form.html',
      template: 'views/shopper-form.html'
    }),
    new HtmlWebpackPlugin({
      filename: 'products-form.html',
      template: 'views/products-form.html'
    })
  ]
};

module.exports = config;
