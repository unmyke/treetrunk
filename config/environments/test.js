exports.envConfig = {
  web: {
    domain: process.env.DOMAIN || 'test',
    port: process.env.PORT || 'testport',
  },
  logging: {
    appenders: {
      out: { type: 'console' },
      // app: { type: 'file', filename: logPath },
    },
    categories: {
      default: {
        appenders: ['out'],
        level: 'info',
      },
    },
  },
};
