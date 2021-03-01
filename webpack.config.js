const path = require("path");
const fs = require('fs')
module.exports = {
  target: 'node',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: 'app.bundle.js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
};