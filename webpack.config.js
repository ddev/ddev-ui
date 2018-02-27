const path = require('path');

module.exports = {
  entry: './js/src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'js/dist'),
    publicPath: path.resolve(__dirname, './'),
  },
  target: 'electron',
  module: {
    loaders: [
      {
        test: /\.js(x)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=/fonts/[name].[ext]',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
};

