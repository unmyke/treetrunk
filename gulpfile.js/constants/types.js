module.exports = {
  envs: {
    DEV: 'development',
    PROD: 'production',
    TEST: 'test'
  },
  targets: {
    COMMON: 'common',
    SERVER: 'server',
    CONSOLE: 'console',
    CLIENT: 'client'
  },
  globs: {
    NODE: 'node',
    REACT: 'react'
  },
  dirs: {
    SRC: 'srcDir',
    DST: 'dstDir'
  },
  configs: {
    API: 'api',
    WEB: 'web',
    DATABASE: 'database',
    LOGGING: 'logging'
  },
  webpackStatsOptions: {
    LOG: 'log',
    WARN: 'warn',
    ERROR: 'error'
  }
};
