const path = require('path');

const logPath = path.join(__dirname, '../../logs/development.log');

const commonConfig = require('./common');

exports.envConfig = {
  web: {
    ...commonConfig.web,
    domain: process.env.DOMAIN || 'localhost',
    port: process.env.PORT || 3000,
    'dev-server-port': 9001,
    graphql: {
      path: 'graphql',
    },
  },
  logging: {
    ...commonConfig.web,
    appenders: {
      out: { type: 'console' },
      app: { type: 'file', filename: logPath },
    },
    categories: {
      default: {
        appenders: ['out'],
        level: 'info',
      },
    },
  },
};
