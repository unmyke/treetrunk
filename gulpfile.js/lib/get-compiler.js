const webpack = require('webpack');
const { webpackOptions } = require('../constants');

module.exports = ({ target, env }) => webpack(webpackOptions[target](env));
