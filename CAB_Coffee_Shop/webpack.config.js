const webpack = require('webpack');
const path = require('path');

const config = {
  entry: {
    products: './public/js/coffeeProducts.js',
    productForm: './public/js/productForm.js',
    shopperForm: './public/js/shopperForm.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
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
      }
    ]
  }
};
