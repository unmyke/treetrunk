import path from 'path';

const root = process.env.PWD;
const logPath = path.join(root, 'logs/development.log');

export default {
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
};