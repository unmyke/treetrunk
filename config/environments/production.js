exports.envConfig = {
  web: {
    port: process.env.PORT,
  },
  logging: {
    appenders: [{ type: 'console', layout: { type: 'basic' } }],
  },
};
