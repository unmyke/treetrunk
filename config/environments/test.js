exports.envConfig = {
  web: {
    domain: 'test',
    port: 'testport',
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
