const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env', '@babel/react'],
        },
      },
    ],
  },
  resolve: {
    alias: {
      Main: path.resolve(__dirname, 'src', 'main'),
      Components: path.resolve(__dirname, 'src', 'renderer', 'components'),
      Resources: path.resolve(__dirname, 'src', 'resources'),
      Media: path.resolve(__dirname, 'src', 'resources', 'media'),
    },
    extensions: ['.js', '.jsx'],
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'src', 'renderer'),
      path.join(__dirname, 'src', 'resources'),
      path.join(__dirname, 'src', 'resources', 'media'),
      'node_modules',
    ],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
};
