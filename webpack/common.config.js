const path = require('path');
const outputDirectory = path.resolve(__dirname, '..', '../dist');

module.exports = ({ name, entry, babelOptions, aliases, rules }) => ({
  name,
  entry,
  mode: process.env.NODE_ENV || 'production',
  output: {
    path: outputDirectory,
    filename: '[name].bundle.js',
  },
  plugins: [new CleanWebpackPlugin([outputDirectory])],
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, '..', 'config'),
    },
  },
  stats: {
    colors: true,
  },
});
