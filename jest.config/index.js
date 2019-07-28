const moduleNameMapper = require('./module-name-mapper');

module.exports = {
  rootDir: process.cwd(),
  testURL: 'http://localhost',
  setupFiles: ['jest-plugin-context/setup'],
  testMatch: [
    '**/?(*.)+(spec|test).[tj]s?(x)',
    '**/*.test/**/!(imports)*.[tj]s?(x)',
  ],
  moduleNameMapper,
};
