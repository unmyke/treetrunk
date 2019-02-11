/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { EnvironmentPlugin, DefinePlugin } = require('webpack');

const rootDirectory = process.env.PWD;

module.exports = (target, mode) => {
  const outputDirectory = path.join(rootDirectory, 'dist', target);

  return {
    output: {
      path: outputDirectory,
      filename: `${mode}.bundle.js`,
    },
    plugins: [
      new EnvironmentPlugin({
        NODE_ENV: 'development',
        HOST: 'localhost',
        PORT: '8080',
        DB_HOST: 'localhost',
        DB_PORT: '27017',
        DB_NAME: 'treetrunk-development',
        DB_USER: '',
        DB_PASS: '',
      }),
      new DefinePlugin({
        'process.env.TARGET': JSON.stringify(target),
      }),
      new CleanWebpackPlugin([outputDirectory], { root: rootDirectory }),
    ],
    module: {
      rules: [
        {
          test: /\.(graphql|gql)$/,
          exclude: /(node_modules)/,
          use: ['graphql-tag/loader'],
        },
      ],
    },
    resolve: {
      alias: {
        '@config': path.join(rootDirectory, 'config'),
      },
    },
    stats: {
      all: false,
      modules: true,
      maxModules: 0,
      errors: true,
      warnings: true,
      moduleTrace: true,
      errorDetails: true,
      colors: true,
    },
  };
};
