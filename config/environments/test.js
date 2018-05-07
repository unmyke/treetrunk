export const envConfig = {
  web: {},
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
