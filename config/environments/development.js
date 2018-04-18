import path from 'path';
const logPath = path.join(__dirname, '../../logs/development.log');

export const envConfig = {
  web: {
    port: 3000
  },
  logging: {
    appenders: {
      out: { type: 'console' },
      app: { type: 'file', filename: logPath }
    },
    categories: {
      default: {
        appenders:['out'],
        level: 'info',
      } 
    },
  }
};
