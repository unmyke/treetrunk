exports.envConfig = {
  web: {
    domain: process.env.DOMAIN,
    port: process.env.PORT,
  },
  logging: {
    appenders: [{ type: 'console', layout: { type: 'basic' } }],
  },
};
