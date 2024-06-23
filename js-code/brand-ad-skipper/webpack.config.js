const path = require('path');

module.exports = {
  entry: './src/background.js',
  output: {
    filename: 'background.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
